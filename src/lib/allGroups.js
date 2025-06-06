// useTopics.js (hook or logic to fetch + listen)
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

const fetchGroups = (onUpdate) => {
  const topicsRef = collection(db, "groups");

  const unsubscribe = onSnapshot(topicsRef, (snapshot) => {
    const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onUpdate(groups); // Callback to update state or UI
  }, (error) => {
    console.error("Error watching topics:", error);
  });

  return unsubscribe; // Call this to stop listening
};

export default fetchGroups;
