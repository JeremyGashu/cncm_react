import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"


export const fetchDepartments = async () => {
    const response = await axios.get(`${baseUrl}/departments`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)

    if (response.status === 200) {
        return response.data.results.rows
    }
}

export const addDepartment = async (data) => {
    const { name, type, defaultPrice, description } = data
    console.log(data)
    let response = await axios.post(`${baseUrl}/departments`, { name, type, defaultPrice, description }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    console.log(response.data)
    return response.data
}

export const editDepartment = async (data) => {
    const { id, name, type, defaultPrice, description } = data
    console.log(data)
    let response = await axios.patch(`${baseUrl}/departments/${id}`, { id, name, type, defaultPrice, description }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deleteDepartment = async (id) => {
    const res = await axios.delete(`${baseUrl}/departments/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}