import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const sendNotifiation = async (data) => {
    const { type, title, priority, body, receivers } = data
    let response = await axios.post(`${baseUrl}/notifications/send`, { type, title, priority, body: { body }, receivers }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data.results.rows)
    return response.data
}

export const fetchNotificatins = async () => {
    let response = await axios.get(`${baseUrl}/notifications`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    console.log(response.data)
    return response.data.results.rows
}