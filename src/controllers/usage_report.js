import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const fetchAllUsageReports = async () => {
    const response = await axios.get(`${baseUrl}/usage-reports`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data)
        return response.data.results.rows
    }
}