import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

export function fetchFollowedUsersPosts(user, allUsers, setPosts) {
 

  const followingUsers = allUsers.filter(us => us.id!==user.id);
  console.log("Following Users:", followingUsers);

  const unsubscribeFunctions = [];
  const allUserPostsMap = {}; // { userId: [posts] }
  const isPostAllowed = (post) => {
    // If no schedule → always show
    if (!post.scheduledDate || !post.scheduledTime) return true;
  
    const now = new Date();
    const current = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  
    const scheduledAt = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
  
    const scheduledRounded = new Date(
      scheduledAt.getFullYear(),
      scheduledAt.getMonth(),
      scheduledAt.getDate(),
      scheduledAt.getHours(),
      scheduledAt.getMinutes()
    );
  
    return scheduledRounded.getTime() === current.getTime();
  };
  
  followingUsers.forEach(us => {
    const postsRef = collection(db, `users/${us.id}/posts`);
    console.log(`Setting listener on users/${us.id}/posts`);

    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const userPosts = snapshot.docs.map(doc => ({
        post_id: doc.id,
        ...doc.data(),
        author: us
      }));

      allUserPostsMap[us.id] = userPosts;

      // Combine and shuffle all posts
      const combinedPosts = Object.values(allUserPostsMap)
        .flat().filter(isPostAllowed)
        .sort(() => Math.random() - 0.5);

      console.log(`Updated combined posts (${combinedPosts.length})`);
      setPosts(combinedPosts);
    });

    unsubscribeFunctions.push(unsubscribe);
  });

  return () => unsubscribeFunctions.forEach(unsub => unsub());
}