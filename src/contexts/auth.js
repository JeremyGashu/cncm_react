import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
    loadingAuthState: false,
    authenticated: false,
    authData: null,
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthContext = createContext(initialState)

const AuthProvider = (props) => {
    const [loadingAuthState, setLoadingAuthState] = useState(false)
    const [authData, setAuthData] = useState(null)

    const logOut = async () => {
        setLoadingAuthState(true)
        localStorage.removeItem('authData')
        setAuthData(null)
        setLoadingAuthState(false)

    }
    useEffect(() => {
        console.log('Auth context running')
        setLoadingAuthState(true)
        const data = localStorage.getItem('authData')
        if (data) {
            console.log('Auth context running')
            setAuthData(JSON.parse(data))
            console.log('Set Auth data')
        }

        setLoadingAuthState(false)

        return () => {

        }
    }, [])

    return (
        <AuthContext.Provider value={{ loadingAuthState, setLoadingAuthState, authData, setAuthData, logOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider