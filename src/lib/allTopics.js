
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

const fetchTopics = (onUpdate) => {
  const topicsRef = collection(db, "topics");

  const unsubscribe = onSnapshot(topicsRef, (snapshot) => {
    const topics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onUpdate(topics); // Callback to update state or UI
  }, (error) => {
    console.error("Error watching topics:", error);
  });

  return unsubscribe; 
};

export default fetchTopics;
