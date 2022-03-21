import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"


export const fetchPaymentConfigs = async () => {
    const response = await axios.get(`${baseUrl}/payment-configs`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)

    if (response.status === 200) {
        return response.data.results.rows
    }
}

export const addPaymentConfig = async (data) => {
    const { type, companyId, price } = data
    console.log(data)
    let response = await axios.post(`${baseUrl}/payment-configs`, { type, companyId, price }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    console.log(response.data)
    return response.data
}

export const editPaymentConfig = async (data) => {
    const { type, companyId, price, id, status } = data
    console.log(data)
    let response = await axios.patch(`${baseUrl}/payment-configs/${id}`, { type, companyId, price, status }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deletePaymentConfig = async (id) => {
    const res = await axios.delete(`${baseUrl}/payment-configs/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}