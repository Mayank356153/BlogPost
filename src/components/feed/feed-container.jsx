"use client"
import { useState,useEffect } from "react"
import {skeleton} from "@/components/ui/skeleton"
import PostCard from '@/components/post/post-card'
// Mock posts data
const mockPosts = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Emma Thompson",
      username: "emmadev",
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },

    
    content: "Just finished building my first Flutter app with Firebase authentication! The process was smoother than I expected. #Flutter #Firebase #MobileApp",
   
   
    images: [
      "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    
    createdAt: "2025-04-15T14:30:00Z",
    
    likesCount: 42,
    commentsCount: 7,
    sharesCount: 3,
    isLiked: false,
    tags: ["Flutter", "Firebase", "MobileApp"],
  },
  
    {
    id: "2",
    author: {
      id: "1",
      name: "Emma Thompson",
      username: "emmadev",
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "Just finished building my first Flutter app with Firebase authentication! The process was smoother than I expected. #Flutter #Firebase #MobileApp",
    images: [
      "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    createdAt: "2025-04-15T14:30:00Z",
    likesCount: 42,
    commentsCount: 7,
    sharesCount: 3,
    isLiked: false,
    tags: ["Flutter", "Firebase", "MobileApp"],
  }
  
  
  // ... (rest of the mock posts remain the same)
];

export default function FeedContainer(){
    const[posts,setPosts]=useState(mockPosts)  //change later with real time data
    const[loading,setLoading]=useState(false)

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
          key={post.id} 
          post={post} 
          onLike={() => handleLike(post.id)} 
        />
      ))}
    </div>
    )

} 