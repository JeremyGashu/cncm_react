export const hasPermission = (permission) => {
    try {
        //TODO check if authData is not null before 
        const authData = localStorage.getItem('authData')
        const parsedData = JSON.parse(authData)
        let permissions = parsedData['role']['permissions']
        permissions = permissions.map(permission => permission.value)
        return permissions.includes(permission)
    } catch (error) {
        return false
    }
}