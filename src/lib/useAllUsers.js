// useUsers.js
"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/components/auth/auth-provider";

export function useAllUsers() {
  
  const [allUsers, setAllUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const usersCollection = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllUsers(users.filter((user) => user.id !== currentUser?.uid));
    });

    return () => unsubscribe(); 
  }, [currentUser]);

  return allUsers;
}
