import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"


export const fetchMembersByDepartmentId = async (id) => {
    const response = await axios.get(`${baseUrl}/departments/${id}/members`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)
    if (response.status === 200) {
        return response.data.results.rows.members
    }

}

export const addMemberToDepartment = async (data) => {

    const { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, departmentid, gender, bank, account_number, birthdate, representative } = data
    console.log(data)
    let response = await axios.post(`${baseUrl}/departments/${departmentid}/members`, { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, gender, bank, account_number, birthdate, representative }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const editDepartmentMembers = async (data) => {
    const { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, bank, account_number, representative, gender, birthdate, memberid, departmentid, } = data
    console.log(JSON.stringify(data))
    let response = await axios.patch(`${baseUrl}/departments/${departmentid}/members/${memberid}`, { username, email, phone, password, confirm_password, role, first_name, middle_name, last_name, bank, account_number, representative, gender, birthdate }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }

    })
    console.log(response.data)
    return response.data
}

export const deleteMember = async (data) => {
    const { memberid, departmentid } = data
    const res = await axios.delete(`${baseUrl}/departments/${departmentid}/members/${memberid}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    return res.data
}