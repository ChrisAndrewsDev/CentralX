import React, {useState, useEffect, useContext} from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

// create AuthContext - creates wrapper/provider
const AuthContext = createContext();

// create useAuth function to access AuthContext values - accessing wrapper values
export function useAuth(){
    return useContext(AuthContext);
}

// create Auth provider - defines wrapper/provider
export function AuthProvider({children}){

    const [user, setUser] = useState(null);
    let navigate = useNavigate();

    // User authentication
    useEffect(() => {
        const userData = getCurrentUser();
        setUser(userData)
    }, [])

    // register and login function
    const loginSaveuser = async (user) => {
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user);
    }

    // obtain current user function
    function getCurrentUser(){
        try {
           let savedData = localStorage.getItem('user');
            savedData = JSON.parse(savedData);
            return savedData;
        } catch (error) {
            return null;
        }
    }

    // logout function
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login')
    }

    // exported user props
    const value = {
        user,
        loginSaveuser,
        getCurrentUser,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    )
}
