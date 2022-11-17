import React, {useContext, useState} from 'react';
import {Container, Form} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useNavigate} from "react-router-dom";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import { LOGIN_ROUTE, MAIN_PAGE_ROUTE, REGISTRATION_ROUTE } from '../utils/const';

 function BasicAlerts({errorMessage}) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error">{errorMessage}</Alert>
      </Stack>
    );
  }

const LoginPage = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
                user.setUser(data)
                user.setIsAuth(true)
                navigate(MAIN_PAGE_ROUTE)
            } else {
                data = await registration(email, password, name);
                user.setUser(data)
                user.setIsAuth(true)
                navigate(MAIN_PAGE_ROUTE)
            }
            
        } catch (e) {
            setErrorMessage(e.response.data.message)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column"
            style={{height: window.innerHeight - 54}}
        >
            {errorMessage ? <BasicAlerts errorMessage={errorMessage}/> : null}
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Enter your password..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {!isLogin && <Form.Control
                        className="mt-3"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        type="text"
                    />}
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>

                </Form>
            </Card>
        </Container>
    );
});

export default LoginPage;