import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { LOGIN_ROUTE, MAIN_PAGE_ROUTE, REGISTRATION_ROUTE } from "./utils/const";

export const authRoutes = [
    {
        path: MAIN_PAGE_ROUTE,
        Component: MainPage
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: LoginPage
    },
    {
        path: REGISTRATION_ROUTE,
        Component: LoginPage
    }
]