import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

export function fetchFollowedUsersPosts(userIds, allUsers, setPosts) {
  if (!Array.isArray(userIds) || userIds.length === 0 || !Array.isArray(allUsers)) {
    console.warn("Invalid inputs to fetchFollowedUsersPosts");
    return () => {};
  }

  const followingUsers = allUsers.filter(user => userIds.includes(user.id));
  console.log("Following Users:", followingUsers);

  const unsubscribeFunctions = [];
  const allUserPostsMap = {}; // { userId: [posts] }

  followingUsers.forEach(user => {
    const postsRef = collection(db, `users/${user.id}/posts`);
    console.log(`Setting listener on users/${user.id}/posts`);

    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const userPosts = snapshot.docs.map(doc => ({
        post_id: doc.id,
        ...doc.data(),
        author: user
      }));

      allUserPostsMap[user.id] = userPosts;

      // Combine and shuffle all posts
      const combinedPosts = Object.values(allUserPostsMap)
        .flat()
        .sort(() => Math.random() - 0.5);

      console.log(`Updated combined posts (${combinedPosts.length})`);
      setPosts(combinedPosts);
    });

    unsubscribeFunctions.push(unsubscribe);
  });

  return () => unsubscribeFunctions.forEach(unsub => unsub());
}