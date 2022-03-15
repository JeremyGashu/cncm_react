import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const sendNotifiationGroup = async (data) => {
    console.log(data)
    let response = await axios.post(`${baseUrl}/notifications/group/send`, { ...data }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data.results.rows)
    console.log(response.data)
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