import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

//returns all users
export const fetchPermissions = async () => {
    const response = await axios.get(`${baseUrl}/auth/permissions`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data)
        return response.data.results.rows
    }
}
