import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"


export const fetchAssociationsByDepartmentId = async (id) => {
    const response = await axios.get(`${baseUrl}/departments/${id}/associations`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)
    if (response.status === 200) {
        return response.data.results.rows.associations
    }

}

export const addAssociationToDepartment = async (data) => {
    const { name, email, phone, license_number, license_document, address, id } = data

    const formData = new FormData();
    formData.append('name', name)
    formData.append('email', email)
    formData.append('address', address)
    formData.append('phone', phone)
    formData.append('license_number', license_number)
    formData.append('license_document', license_document)

    let response = await axios.post(`${baseUrl}/departments/${id}/associations`, formData, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    console.log(response.data)
    return response.data
}

export const editAssociation = async (data) => {
    const { associationid, departmentid, phone, email, license_number, name, address } = data
    console.log(data)
    let response = await axios.patch(`${baseUrl}/departments/${departmentid}/associations/${associationid}`, { phone, email, license_number, name, address }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deleteAssociation = async (data) => {
    const { associationid, departmentid } = data
    const res = await axios.delete(`${baseUrl}/departments/${departmentid}/associations/${associationid}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}

export const fetchMembersOfAssociatin = async (id) => {
    const response = await axios.get(`${baseUrl}/associations/${id}/members`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)
    if (response.status === 200) {
        return response.data.results.rows.members
    }
}

export const addMemberToAssociation = async (data) => {

    const { associationid, username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, gender, bank, account_number, birthdate, representative } = data
    console.log(data)
    let response = await axios.post(`${baseUrl}/associations/${associationid}/members`, { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, gender, bank, account_number, birthdate, representative }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deleteMemberFromAssociation = async ({ userid, associationid }) => {
    console.log(`${baseUrl}/associations/${associationid}/members/${userid}`)

    const res = await axios.delete(`${baseUrl}/associations/${associationid}/members/${userid}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    console.log(res.data)
    return res.data
}