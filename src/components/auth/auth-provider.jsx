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
import { setPersistence } from "firebase/auth"
import { browserLocalPersistence } from "firebase/auth"
import { fetchSignInMethodsForEmail } from "firebase/auth"
export  function AuthProvider({children}){
    const[user,setUser]=useState(null);
    const [currentUser,setCurrentUser]=useState(null)
    const[isLoading,setLoading]=useState(false)
    const router=useRouter();

    
    const auth=getAuth(app);



    useEffect(()=>{
                  const check=onAuthStateChanged(auth,async(user)=>{
                    if(user && user.emailVerified){
                      console.log("user",user)
                      setCurrentUser(user)
                       try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data());
          router.replace("/dashboard")
        } else {
          console.warn("No Firestore user data found");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user data from Firestore:", error);
        setUser(null);
      }
                    }
                    else{
                      setCurrentUser(null)
                      setUser(null)
                    }
                  })
                  return ()=>check();
    },[])
  


//login user with email and password
const LoginWithEmail = async (email, password) => {
  if (!isEmail(email) || !password.trim()) {
    toast.error("Please enter a valid email and password.");
    return;
  }

  try {
    console.log(email);

    const method = await fetchSignInMethodsForEmail(auth, email);
    console.log(method);

    if (method.length && !method.includes("password")) {
      toast.error(`This email is registered using ${method[0]}. Please sign in with that method.`);
      return;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        toast.error("User data not found in Firestore.");
        return;
      }

      const userData = userSnap.data();

      setUser(userData);
      setCurrentUser(auth.currentUser);

  
     
        router.push("/dashboard");
  toast.success(<>
        <strong>Welcome back!</strong>
        <div>You have successfully logged in.</div>
      </>)

           

    } else {
      console.log(user);
      toast.error("Verify your email first. A verification link has been sent.");
      setUser(null);
    }

    console.log("Signed in user:", user);
    return;

  } catch (error) {
    console.log(`Login failed: ${error.code}`);
    toast.error("Login failed. Please check your credentials.");
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
     
    router.push("/login");
 toast(
  <>
    <strong>Account created!</strong>
    <div>You have successfully signed up.</div>
  </>,
  { variant: 'success' }
);
      
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

  if (user.emailVerified) {
              const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
                setUser(userSnap.data())
                setCurrentUser(auth.currentUser)

                      



                    router.push("/dashboard")

                    toast.success(<>
        <strong>Google login successful!</strong>
        <div>You have successfully logged in with Google.</div>
      </>)
    console.log("Signed in user:", user);
    } else { 
      console.log(user)
            toast.error("Verify your email first. A verification link has been sent.");
      setUser(null);
    }
 
  } catch (error) {
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

                const userDoc=await getDoc(userRef)
                setUser(userDoc.data())
                setCurrentUser(auth.currentUser)

                    router.push("/dashboard")



                     toast.success(<>
        <strong>Github login successful!</strong>
        <div>You have successfully logged in with Github.</div>
      </>)
                     console.log("Signed in user:", user);
   


 
} 





  } catch (error) {
     if (error.code === "auth/account-exists-with-different-credential") {
      const email = error.customData.email;
      const pendingCred = GithubAuthProvider.credentialFromError(error);

      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log(methods)
      if (methods.includes("google.com")) {
        alert("This email is already used with Google. Please sign in with Google to link GitHub.");

        const googleProvider = new GoogleAuthProvider();
        const googleResult = await signInWithPopup(auth, googleProvider);

        // Link GitHub to the existing Google account
        await linkWithCredential(googleResult.user, pendingCred);
        alert("GitHub account linked to your Google account!");
      } else {
        alert("Email already used with a different provider. Please use the correct method.");
      }
    } else {
      console.error("GitHub sign-in error:", error);
      alert("GitHub login failed.");
    }  
  }
}

const value={
    user,
    currentUser,
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

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired
// };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth nee to be  within an AuthProvider');
  }
  return context;
};









