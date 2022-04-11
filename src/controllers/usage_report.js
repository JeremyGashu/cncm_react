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

export const fetchUsageReportByCompany = async (id) => {
    const response = await axios.get(`${baseUrl}/companies/${id}/usage-reports`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    if (response.status === 200) {
        console.log(response.data)
        return response.data.results.rows.usage_reports || []
    }
}

export const addUsageReportToCompany = async (data) => {
    const { companyid, assetId, frequency: amount, date } = data
    const response = await axios.post(`${baseUrl}/companies/${companyid}/usage-reports`, { assetId, amount, date }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    return response.data
}


export const addBulkUsageReport = async (data) => {
    const { companyId, usage_reports } = data

    const formData = new FormData();
    formData.append('companyId', companyId)
    formData.append('license_document', usage_reports)

    let response = await axios.post(`${baseUrl}/usage-reports/upload`, formData, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    console.log(response.data)
    return response.data
}