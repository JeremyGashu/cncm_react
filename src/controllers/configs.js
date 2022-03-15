import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const fetchConfigs = async () => {
    const response = await axios.get(`${baseUrl}/system-configs`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data.results)
        return response.data.results
    }
}