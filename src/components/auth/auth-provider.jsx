"use client"

import { createContext,useContext,useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import PropTypes from "prop-types"
import { db } from "../../config/firebase"
import app from "../../config/firebase"
import { doc,collection,addDoc ,setDoc,getDoc} from "firebase/firestore"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {createUserWithEmailAndPassword, sendPasswordResetEmail,sendEmailVerification, signInWithEmailAndPassword}  from 'firebase/auth'
const AuthContext=createContext()
import { toast } from "sonner"
import {useToast} from '@/hooks/use-toast'
import isEmail from "validator/lib/isEmail"
import { GoogleAuthProvider } from "firebase/auth"
import { GithubAuthProvider } from "firebase/auth"
import { signInWithPopup } from "firebase/auth"
import { fetchSignInMethodsForEmail } from "firebase/auth"
export function AuthProvider({children}){
    const[user,setUser]=useState(null);
    const[isLoading,setLoading]=useState(false)
     const Toast=useToast()
    const router=useRouter();

    
    const auth=getAuth(app);
  

    useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (person) => {
  if (person) {
    if (person.emailVerified) {
              const userRef = doc(db, "users", person.uid);
    const userSnap = await getDoc(userRef);
    
                setUser(userSnap.data())
                    router.push("/dashboard")
    } else { 
            toast.error("Verify your email first. A verification link has been sent.");
      setUser(null);
    }
  } else {
    await auth.signOut()
    setUser(null); // Not logged in
  }
});


  return () => unsubscribe(); // Clean up the listener
}, [auth]); // add dependency


//login user with email and password
const LoginWithEmail = async (email, password) => {

  if (!isEmail(email) || !password.trim()) {
    toast.error("Please enter a valid email and password.");
    return;
  }

  try {
    
    console.log(email)
    const method = await fetchSignInMethodsForEmail(auth, email);
   console.log(method)
    if (method.length && !method.includes("password")) {
      toast.error(`This email is registered using ${method[0]}. Please sign in with that method.`);
      return ;
    }

    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await sendEmailVerification(user);
      toast.error("Verify your email first. A verification link has been sent.");
      return ;
    }
      
    
                
  
    toast.success("Login successful!");
        console.log("Signed in user:", user);


   return;

  } catch (error) {
    toast.error(`Login failed: ${error.code}`);
    }

};

//signup user with email and password
const signUpWithEmail = async (name, email, password) => {
 

  if (!isEmail(email) || !password.trim()) {
    toast.error("Please enter a valid email and password.");
    return;
  }

  try {
    const userCreation = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCreation.user;
   console.log(user)
   
   await auth.signOut()

const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      id: user.uid,
      name: name,
      email: user.email,
      username:name.trim(),
      image:user.profileImage || "",
      createdAt: new Date(),
    });

    
    await sendEmailVerification(user);

    toast.success("Verification email sent successfully");
    toast.success("Sign up successful");
    router.push("/login");

    return {
      success: true,
      message: "Signup successful. Verification email sent."
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
    router.push("/")
    setUser(null)
    return { success: true };
  } catch (error) {
    toast.error(`Sign out failed: ${error.message}`);
    return { success: false, message: error.message };
  }
};

//reset password
const resetPassword=async(email)=>{
      
  if (!isEmail(email)) {
    toast.error("Please enter a valid email")
    return
  }

        try {
           await sendPasswordResetEmail(auth,email)
           toast.success("Password reset email sent")
        } catch (error) {
          toast.error("Failed to send reset email")
    console.error("Reset error:", error.message)
        }
}


//google login
const googleLogin=async()=>{
 const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

      const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        username: user.displayName?.trim() || "",
        image: user.photoURL || "",
        createdAt: new Date(),
      });
    }

    // router.push("/dashboard")
    // setUser(userSnap.data())


    toast.success(`Welcome ${user.displayName || "User"}!`);
    console.log("Signed in user:", user);
  } catch (error) {
    toast.error("Google sign-in failed");
    console.error("Google sign-in error:", error?.code, error?.message);
  }
}



const githubLogin=async()=>{
 const provider = new GithubAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;


    if (user) {
      
      const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        username: user.displayName?.trim() || "",
        image: user.photoURL || "",
        createdAt: new Date(),
      });
    }
  console.log("Signed in user:", user);
  toast.success(`Welcome ${user.displayName || "User"}!`);
} 


else {
  console.warn("signInWithPopup returned no user.");
}


  } catch (error) {
   if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      console.log("JHH")
       console.log(error.customData)
      if (email) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log(methods)
        toast.error(
          `Account exists with ${methods[0]} sign-in. Please use that instead.`
        );
      } else {
        toast.error("This email is already used with another provider.");
      }
    } else {
      toast.error("GitHub sign-in failed.");
      console.error("GitHub sign-in error:", error?.code, error?.message);
    }
  }
}

const value={
    user,
    isLoading,
    LoginWithEmail,
    logoutUser,
    signUpWithEmail,
    resetPassword,
    googleLogin,
    githubLogin
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









