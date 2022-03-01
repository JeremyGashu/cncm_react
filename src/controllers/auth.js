import axios from "axios"
import { baseUrl } from "../urls/urls"

export const loginRequest = async (auth) => {
    const { username, password } = auth
    let response = await axios.post(`${baseUrl}/auth/login`, { username, password })
    if (response.status === 200 && !response.data.error) {
        localStorage.setItem('authData', JSON.stringify(response.data.results))
    }

    return response.data
}