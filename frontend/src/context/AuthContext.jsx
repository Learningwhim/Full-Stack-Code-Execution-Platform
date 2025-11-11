import {createContext, useState, useEffect, useContext} from "react";

const AuthContext = createContext();
function AuthProvider({children}) {
        const [user, setUser] = useState(null);
        const login = (userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        }

        const logout = () => {
            setUser(null);
            localStorage.removeItem("user");
        }
        useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            if(savedUser)
           setUser(JSON.parse(savedUser));
    }catch(error){
        console.error("Error parsing stored user:", error);
    setUser(null);
    localStorage.removeItem("user");
        }
    }, [])
        
    
    return(<AuthContext.Provider value ={{user, login, logout}}>
        {children}
    </AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext)
export default AuthProvider;