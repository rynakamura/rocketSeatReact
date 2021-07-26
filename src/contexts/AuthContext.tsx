import { createContext, ReactNode, useEffect, useState } from "react"
import { auth,firebase } from "../service/firebase"




type User = {
    id: string;
    name: string;
    photo: string;
}

type AuthContextType= {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props:AuthContextProviderProps){
    const [user, setUser] = useState<User>();

    //Ver se o user ja havia se logado antes e resgatar essa info
    useEffect(()=> {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL,uid} = user

                if(!displayName || !photoURL){
                    throw new Error('Faltam informações na sua conta Googele') 
                }

                setUser({
                    id: uid,
                    name:displayName,
                    photo: photoURL,
                })
            }
        })
        return () => {
            unsubscribe();
        }
    },[])

    //logar com Google
    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()

        const result = await auth.signInWithPopup(provider)

        if (result.user){
            const {displayName,photoURL,uid} = result.user

            if(!displayName || !photoURL){
                throw new Error('Faltam informações na sua conta Google') 
            }
            
            setUser({
                id: uid,
                name:displayName,
                photo: photoURL
            })
        }

 
    }

    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}