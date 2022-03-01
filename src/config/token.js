export const getAuthToken = () => {
    const authData = localStorage.getItem('authData')
    const parsedData = JSON.parse(authData)
    return parsedData['token']
}