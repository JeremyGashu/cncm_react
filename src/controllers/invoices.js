import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"

export const fetchInvoicesByCompany = async (id) => {
    const response = await axios.get(`${baseUrl}/companies/${id}/invoices`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data)
        return response.data.results.rows.invoices || []
    }
}

export const fetchAllInvoices = async () => {
    const response = await axios.get(`${baseUrl}/invoices`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data)
        return response.data.results.rows || []
    }
}

