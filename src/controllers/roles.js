import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const fetchRoles = async () => {
    const response = await axios.get(`${baseUrl}/auth/roles`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data)
        return response.data.results.rows
    }
}

export const addRole = async (data) => {
    const { name, description, permissions } = data
    console.log(data)
    let response = await axios.post(`${baseUrl}/auth/roles`, { name, description, permissions }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}


export const editRole = async (data) => {
    const { name, description, permissions, id, status } = data
    console.log(data)
    let response = await axios.patch(`${baseUrl}/auth/roles/${id}`, { name, description, permissions, status }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    console.log(response.data)
    return response.data
}


export const deleteRole = async (id) => {
    const res = await axios.delete(`${baseUrl}/auth/roles/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}