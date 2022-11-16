import React, {useContext, useEffect, useState} from 'react';
import AppRouter from './components/AppRouter';
import NavBar from './components/Navbar';
import {observer} from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";

import {Context} from "./index";
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";

const App = observer(() => {
  const {user, isAuth} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      check().then(data => {
          user.setUser(true)
          user.setIsAuth(true)
      }).finally(() => setLoading(false))
  }, [isAuth, user])

  if (loading) {
      return (
        <div style={{height: 600}} className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="info"  as="div"/>
        </div>
      )
  }

  return (
    <div>
      <BrowserRouter>
          <NavBar />
          <AppRouter />
      </BrowserRouter>
    </div>
  );
});

export default App;
