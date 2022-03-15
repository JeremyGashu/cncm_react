import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const fetchAggregate = async (id) => {
    const response = await axios.get(`${baseUrl}/departments/aggregates/${id}`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data.results[0])
        return response.data.results[0]
    }

}