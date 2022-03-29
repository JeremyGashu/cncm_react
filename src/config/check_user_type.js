export const getUserType = () => {
    try {
        //TODO check if authData is not null before 
        const authData = localStorage.getItem('authData')
        const parsedData = JSON.parse(authData)
        if (parsedData['association']) {
            return 'association'
        }

        else if (parsedData['department']) {
            return 'department'
        }

        else if (parsedData['company']) {
            return 'company'
        }

        else {
            return 'user'
        }
    } catch (error) {
        return false
    }
}

export const getCompanyIdFromAuthData = () => {
    try {
        //TODO check if authData is not null before 
        const authData = localStorage.getItem('authData')
        const parsedData = JSON.parse(authData)
        return parsedData['company'][0]['id']
    } catch (error) {
        return false
    }
}