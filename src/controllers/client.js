import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"


export const fetchCompanies = async () => {
    const response = await axios.get(`${baseUrl}/companies`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)
    if (response.status === 200) {
        return response.data.results.rows
    }

}

export const addCompanies = async (data) => {
    const { name, email, phone, license_number, license_document, address } = data

    const formData = new FormData();
    formData.append('name', name)
    formData.append('email', email)
    formData.append('address', address)
    formData.append('phone', phone)
    formData.append('license_number', license_number)
    formData.append('license_document', license_document)

    let response = await axios.post(`${baseUrl}/companies`, formData, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    console.log(response.data)
    return response.data
}

export const editCompany = async (data) => {
    const { companyid, phone, email, license_number, name, address } = data
    console.log(data)
    let response = await axios.patch(`${baseUrl}/companies/${companyid}`, { phone, email, license_number, name, address }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deleteCompany = async (data) => {
    const { companyid } = data
    const res = await axios.delete(`${baseUrl}/companies/${companyid}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}