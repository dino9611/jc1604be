import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import ProtectedRoutes from "./components/protectedRoutes";
import Verified from "./pages/verified";
import Register from "./pages/register";

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <ProtectedRoutes path="/login" exact component={Login} />
      <ProtectedRoutes path="/register" exact component={Register} />
      <Route path="/verified/:token" component={Verified} />
    </Switch>
  );
}

export default App;
