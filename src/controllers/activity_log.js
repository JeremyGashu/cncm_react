import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const getActivityLog = async () => {
    const response = await axios.get(`${baseUrl}/activity-logs`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        return response.data.results.rows
    }
}