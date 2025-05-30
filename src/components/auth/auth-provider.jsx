"use client"

import { createContext,useContext,useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import PropTypes from "prop-types"
import { db } from "../../config/firebase"
import app from "../../config/firebase"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword}  from 'firebase/auth'
const AuthContext=createContext()
import { toast } from "sonner"


export function AuthProvider({children}){
    const[user,setUser]=useState(null);
    const[isLoading,setLoading]=useState(false)

    const router=useRouter();

    
    const auth=getAuth(app);
    useEffect(()=>{
        onAuthStateChanged(auth,(person)=>{
            if(person){
                setUser(person)
            }
            else{
                setUser(null)
                console.log("user")
            }
        })
    })

    useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (person) => {
    setUser(person ?? null);
  });

  return () => unsubscribe(); // Clean up the listener
}, [auth]); // add dependency


//login user with email and password
const LoginWithEmail = async (email, password) => {
  if (email === "" || password === "") {
    toast.error("Email or Password can't be empty");
    return {
      success: false,
      message: "Email or Password can't be empty"
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const User = userCredential.user;

    if (!User.emailVerified) {
      await sendEmailVerification(User);
      toast.error("Verify your email first. A verification link has been sent.");
      return {
        success: false,
        message: "Email not verified"
      };
    }
    setUser(User)
    toast.success("Login successful!");
    router.push('/dashboard')
    return {
      success: true,
      User
    };

  } catch (error) {
    toast.error(`Login failed: ${error.code}`);
    return {
      success: false,
      message: error.code
    };
  }
};

//signup user with email and password
const signUpWithEmail = async (email, password) => {
  if (email === "" || password === "") {
    toast.error("Email or Password can't be empty");
    return {
      success: false,
      message: "Email or Password can't be empty"
    };
  }

  try {
    const userCreation = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCreation.user;

    await sendEmailVerification(user);
    toast.success("Verification email sent successfully");
    toast.success("Sign up successful");

    return {
      success: true,
      user
    };

  } catch (error) {
    toast.error(`Sign up failed: ${error.code}`);
    return {
      success: false,
      message: error.code
    };
  }
};

//logout user 

const logoutUser = async () => {
  try {
    await signOut(auth);
    toast.success("Signed out successfully");
    setUser(null)
    return { success: true };
  } catch (error) {
    toast.error(`Sign out failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

const value={
    user,
    isLoading,
    LoginWithEmail,
    logoutUser,
    signUpWithEmail
}

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};









