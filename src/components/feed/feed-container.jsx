"use client"
import { useState,useEffect, use } from "react"
import {skeleton} from "@/components/ui/skeleton"
import PostCard from '@/components/post/post-card'
// Mock posts data
import { db } from "@/config/firebase";
import { useAuth } from "../auth/auth-provider";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "sonner";
import {fetchFollowedUsersPosts} from "@/lib/allposts";
import { useAllUsers } from "@/lib/useAllUsers";
import { set } from "date-fns";


export default function FeedContainer(){
   const { user,currentUser } = useAuth(); // auth hook at top level
  const allUsers = useAllUsers();    // hook call at top level, not inside useEffect
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  
useEffect(() => {
  if (!currentUser || allUsers.length === 0) return;

  console.log("currentUser", currentUser);

  // Set up Firestore listener
  const unsubscribe = fetchFollowedUsersPosts(
    user.following || [],
    allUsers,
    setPosts
  );

  // Cleanup on unmount or dependency change
  return () => {
    console.log("Unsubscribing from posts listener");
    unsubscribe();
  };
}, [currentUser, allUsers]);

useEffect(() => console.log("Posts updated:", posts), [posts]); // Debugging line to check posts updates
  

    const handleLike=(postId)=>{   //change later for like manage of real post
        setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
        };
      }
      return post;
    }));
    }

    return(
         <div className="space-y-6">
      {posts.map((post) => (
        <PostCard 
          key={post.post_id} 
          post={post} 
          onLike={() => handleLike(post.id)} 
        />
      ))}
    </div>
    )

} 