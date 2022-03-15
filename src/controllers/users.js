import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const fetchUsers = async () => {
    const response = await axios.get(`${baseUrl}/users`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    return response.data
}

export const addUser = async (data) => {
    const { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, birthdate, bank, account_number, representative, gender } = data
    console.log(data)
    let response = await axios.post(`${baseUrl}/users`, { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, birthdate, bank, account_number, representative, gender }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const editUser = async (data) => {
    const { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, id } = data
    console.log(data)
    let response = await axios.patch(`${baseUrl}/users/${id}`, { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deleteUser = async (id) => {
    const res = await axios.delete(`${baseUrl}/users/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}

