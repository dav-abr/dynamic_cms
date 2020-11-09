import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import { getCookie } from "./helpers";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!getCookie("token"));

  const onLogin = React.useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  return (
    <Router>
      {isLoggedIn ? (
        <Layout />
      ) : (
        <>
          <Route path="/login">
            <Login onLogin={onLogin} />
          </Route>
          <Route>
            <Redirect to="/login" />
          </Route>
        </>
      )}
    </Router>
  );
};

export default App;
