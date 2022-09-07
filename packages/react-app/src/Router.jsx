import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AuthPage = lazy(() => import("./pages/AuthPage"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
