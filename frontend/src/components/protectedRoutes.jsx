import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoutes = ({ ...rest }) => {
  const Auth = useSelector((state) => state.Auth);
  if (Auth.isLogin) {
    return <Redirect to="/" />;
  } else {
    return <Route {...rest} />;
  }
};

export default ProtectedRoutes;
