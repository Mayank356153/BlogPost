import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/config/firebase";
const trendingTopics = (callback) => {
  const topicsRef = collection(db, "topics");

  const unsubscribe = onSnapshot(topicsRef, (snapshot) => {
    // Convert snapshot to array with following count
    const topics = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Unnamed",
        following: Array.isArray(data.following) ? data.following.length : 0,
        ...data,
      };
    });

    // Sort and pick top 5
    const topFive = topics
      .sort((a, b) => b.followingCount - a.followingCount)
      .slice(0, 5);

    // Use callback to send data to UI
    callback(topFive);
  });

  return unsubscribe; // Call this to stop listening
};

export default  trendingTopics
