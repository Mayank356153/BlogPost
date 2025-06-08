import { collection, onSnapshot} from "firebase/firestore";
import { db } from "@/config/firebase";
const trendingTopics = (callback) => {
  const topicsRef = collection(db, "topics");

  const unsubscribe = onSnapshot(topicsRef, (snapshot) => {

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

  
    callback(topFive);
  });

  return unsubscribe; 
};

export default  trendingTopics
