import axios from "axios"
import { getAuthToken } from "../config/token"
import { baseUrl } from "../urls/urls"


export const fetchAssetByDepartmentId = async (id) => {
    const response = await axios.get(`${baseUrl}/departments/${id}/assets`, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })

    console.log(response.data.results.rows)
    if (response.status === 200) {
        return response.data.results.rows.assets
    }

}

export const addAssetToDepartment = async (data) => {
    const { userid, name, type, description, metaData, } = data

    // console.log(JSON.stringify({ userid, name, type, description, metaData, }))

    console.log(data)
    let response = await axios.post(`${baseUrl}/users/${userid}/assets`, { name, type, description, metaData, }, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    console.log(response.data)
    return response.data


}

export const editAsset = async (data) => {
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

export const deleteAsset = async (id) => {
    // const { associationid, } = data
    // const res = await axios.delete(`${baseUrl}/departments/${departmentid}/associations/${associationid}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } })
    // return res.data
}