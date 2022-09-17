// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IUSDC {
    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
}

contract Dank is Ownable {

    address private immutable _USDCContract;
    ISwapRouter public immutable swapRouter;

    // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    uint24 public constant poolFee = 3000;

    constructor(address _swapRouter, address USDCContract) {
        swapRouter = ISwapRouter(_swapRouter);
        _USDCContract = USDCContract;
    }

    struct UserData {
        string userName;
        address publicAddress;
        string ipfsURI;
    }

    mapping (string => UserData) _idToUser;

    event UserCreated(uint256 timestamp, string username, address userAddress, string ipfsURI);

    function registerUser(string memory userName, address publicAddress, string memory ipfsURI) external returns (bool) {
        require(keccak256(bytes(_idToUser[userName].userName)) != keccak256(bytes(userName)), "This user is already registered.");

        _idToUser[userName] = UserData({
            userName: userName,
            publicAddress: publicAddress,
            ipfsURI: ipfsURI
        });

        emit UserCreated(block.timestamp, userName, publicAddress, ipfsURI);

        return true;
    }

    function getUser(string memory userName) public view returns (UserData memory) {
        return _idToUser[userName];
    }

    function resolveAddress(string memory userName) public view returns (address) {
        return _idToUser[userName].publicAddress;
    }

    // struct to store a bucket details
    struct Bucket {
        string name;
        string description;
        address[] tokens;
        uint256[] weightages;
    }

    // struct to maintain User Investments
    struct UserInvestment {
        uint256 totalAmount;
        uint256[] holdings;
    }

    // mapping to track user investments, username -> bucketId -> investment struct
    mapping (string => mapping(uint256 => UserInvestment)) private _userInvestments;

    // mapping to track every bucket
    mapping (uint256 => Bucket) public bucketDetails;

    // private counter to maintain the number of buckets
    uint256 private _counter = 0;

    // array of supported tokens
    address[] public supportedTokens;

    // event for bucket creation
    event BucketCreated(uint256 bucketId, string bucketName, string description, address[] tokens, uint256[] weightages);
    event InvestedInBucket(uint256 indexed bucketId, uint256 amountInvested, string indexed userId, uint256 timestamp);
    event WithdrawnFromBucket(uint256 indexed bucketId, uint256 amountOut, string indexed userId, uint256 timestamp);

    // function to create a bucket - onlyOwner
    function createBucket(string memory name, string memory description, address[] memory tokens, uint256[] memory weightage) external onlyOwner returns (bool) {
        require (tokens.length == weightage.length, "Number of tokens should equal to weightage");

        uint256 totalWeightage = 0;
 
        for (uint256 i = 0; i < weightage.length; i++) {
            totalWeightage += weightage[i]; 
        }

        require (totalWeightage == 10000, "Weightage should be 100%");

        bucketDetails[_counter] = Bucket({
            name: name,
            description: description,
            tokens: tokens,
            weightages: weightage
        });

        emit BucketCreated(_counter, name, description, tokens, weightage);

        _counter++;

        return true;
    }
    
    // fetch a bucket - return struct
    function fetchBucketDetails(uint256 id) external view returns (Bucket memory) {
        return bucketDetails[id];
    }

    // Invest util
    function swapUSDCToToken(uint256 amountIn, address _tokenOut) internal returns (uint256 amountOut) {
        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _USDCContract,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    // function usdcFraction
    function calculateInvestedAmountForToken(uint256 weightage, uint256 investedAmount) internal pure returns (uint256) {
        return (investedAmount / 10000) * weightage;
    }

    // Invest function
    function invest(string memory _userId, uint256 _bucketId, uint256 _investValue) external userExists(_userId) returns (bool) {
        
        TransferHelper.safeTransferFrom(_USDCContract, msg.sender, address(this), _investValue);
        TransferHelper.safeApprove(_USDCContract, address(swapRouter), _investValue);

        Bucket memory bucket = bucketDetails[_bucketId];
        address[] memory tokens = bucket.tokens;
        uint256[] memory weights = bucket.weightages;

        uint256[] memory holdings = new uint256[](tokens.length);

        for (uint256 i = 0; i < tokens.length; i += 1) {
            uint256 amountForToken = calculateInvestedAmountForToken(weights[i], _investValue);
            holdings[i] = swapUSDCToToken(amountForToken, tokens[i]);
        }

        uint256[] memory currentHoldings = _userInvestments[_userId][_bucketId].holdings;
        uint totalAmount = _userInvestments[_userId][_bucketId].totalAmount;

        if (totalAmount == 0) {
            _userInvestments[_userId][_bucketId].totalAmount = _investValue;
            _userInvestments[_userId][_bucketId].holdings = holdings;
        } else {
            _userInvestments[_userId][_bucketId].totalAmount += _investValue;
            string memory _user = _userId;
            uint256 _bucket = _bucketId;
            uint256[] memory updatedHoldings = new uint256[](currentHoldings.length);
            for (uint256 j = 0; j < currentHoldings.length; j += 1) {
                updatedHoldings[j] = currentHoldings[j] + holdings[j];
            }
            _userInvestments[_user][_bucket].holdings = updatedHoldings;
        }

        emit InvestedInBucket(_bucketId, _investValue, _userId, block.timestamp);
        return true;
    }

    // Withdraw util
    function swapTokenToUSDC(uint256 amountIn, address _tokenIn) internal returns (uint256 amountOut) {
        // Transfer the specified amount of _tokenIn to this contract.
        TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), amountIn);

        // Approve the router to spend _tokenIn.
        TransferHelper.safeApprove(_tokenIn, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _USDCContract,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    // Withdraw function
    function withdraw(string memory _userId, uint256 _bucketId) external userExists(_userId) returns (bool) {
        require(_userInvestments[_userId][_bucketId].totalAmount > 0, "Invested amount should be greater than 0");

        Bucket memory bucket = bucketDetails[_bucketId];
        address[] memory tokens = bucket.tokens;

        UserInvestment memory investment = _userInvestments[_userId][_bucketId];
        uint256[] memory holdings = investment.holdings;

        uint256 amountOut = 0;

        for (uint256 i = 0; i < holdings.length; i += 1) {
            amountOut += swapTokenToUSDC(holdings[i], tokens[i]);
        }

        // _userInvestments[_userId][_bucketId].totalAmount = 0;
        // _userInvestments[_userId][_bucketId].totalAmount
        delete _userInvestments[_userId][_bucketId];

        emit WithdrawnFromBucket(_bucketId, amountOut, _userId, block.timestamp);

        return true;
    }

    // get user investment details
    function getUserInvestmentDetails(string memory _userId, uint256 _bucketId) external view returns (UserInvestment memory) {
        return _userInvestments[_userId][_bucketId];
    }

    modifier userExists(string memory _userId) {
        require(_idToUser[_userId].publicAddress != address(0x0), "User does not exists");
        _;
    }
}
