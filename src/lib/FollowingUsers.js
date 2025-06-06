// useUsers.js
"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/components/auth/auth-provider";

export function FollowingUsers() {
  
  const [allUsers, setAllUsers] = useState([]);
  const { currentUser,user } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const usersCollection = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("asdfg")
      setAllUsers(users.filter(us=> user.following.includes(us.id)))
    //   setAllUsers(users);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [currentUser]);

  return allUsers;
}
