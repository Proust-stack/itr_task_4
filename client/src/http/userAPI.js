import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const registration = async (email, password, name) => {
    const {data} = await $host.post('api/user/registration', {email, password, name})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const getAllUsers = async () => {
    const {data} = await $host.get('api/user/list' )
    return data
}
export const block = async (users) => {
    const {data} = await axios({
        method: 'put',
        url: process.env.REACT_APP_API_URL + 'api/user/block',
        data: {
            users
        }
      });
    return data
}
export const unBlock = async (users) => {
    const {data} = await axios({
        method: 'put',
        url: process.env.REACT_APP_API_URL + 'api/user/unblock',
        data: {
            users
        }
      });
    return data
}
export const deleteUser = async (users) => {
    const {data} = await axios({
        method: 'delete',
        url: process.env.REACT_APP_API_URL + 'api/user/delete',
        data: {
            users
        }
      });
    return data
}