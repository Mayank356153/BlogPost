"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Edit, Users, Calendar, MapPin, Link as LinkIcon, Globe, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Post } from "@/components/feed/feed-container";
import PostCard from "@/components/post/post-card";
import { ProfileAbout } from "@/components/profile/profile-about";
import Link from "next/link";
import { db } from "@/config/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";



export default function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   if (!user) return;
    
  //   const fetchUserPosts = async () => {
  //     try {
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       setPosts(mockUserPosts);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchUserPosts();
  // }, [user]);

  useEffect(()=>{

    try {
       if(!user) return;

      const postRef=collection(db,"users",user.id,"posts")
      const postUnsubscribe=onSnapshot(postRef,(snapshot)=>{
        const fetchedPosts=snapshot.docs.map((doc)=>({
          post_id:doc.id,
          author:user,
          ...doc.data()
        }))
        console.log("post")
        console.log(fetchedPosts)
        setPosts(fetchedPosts)
      })
       return ()=>postUnsubscribe()
    } catch (error) {
        console.log("error in profile",error)
    }
    finally{
      setLoading(false)
    }
  
  },[user])
  
  if (!user) {
    redirect('/login');
    return null;
  }

  useEffect(()=>console.log("qwert"),[posts])
  
  const handleLike = (postId) => {
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative w-full h-64 bg-gradient-to-r from-primary/30 via-primary/10 to-background">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container px-4 mx-auto">
        {/* Profile Header */}
        <div className="relative mb-8 -mt-32">
          <div className="flex flex-col items-start gap-6 lg:flex-row">
            {/* Profile Image */}
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={user.image ||  "/blank-profile-picture-973460_1280.webp" }    alt={user.name} referrerPolicy="no-referrer" />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1 mt-4 lg:mt-32">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username || user.email.split('@')[0]}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              
              <div className="mt-4 space-y-4">
                <p className="max-w-2xl text-muted-foreground">
                  {user.bio || "Software developer and GDG enthusiast. Passionate about creating innovative solutions and sharing knowledge within the developer community."}
                </p>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="w-4 h-4 mr-2" />
                    <a href="https://github.com/demouser" className="hover:text-primary">github.com/demouser</a>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined April 2023
                  </div>
                </div>

                <div className="flex gap-6">
                  <button className="hover:text-primary">
                    <span className="font-bold">{user?.following?.length || 0}</span>
                    <span className="ml-1 text-muted-foreground">Following</span>
                  </button>
                  <button className="hover:text-primary">
                    <span className="font-bold">{user?.followers?.length || 0}</span>
                    <span className="ml-1 text-muted-foreground">Followers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              {/* Groups */}
              <div className="p-4 border rounded-lg bg-card">
                <h3 className="mb-4 font-semibold">My Groups</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">GDG San Francisco</p>
                      <p className="text-xs text-muted-foreground">1.2k members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Flutter Developers</p>
                      <p className="text-xs text-muted-foreground">3.5k members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <TabsContent value="posts" className="space-y-6">
                {loading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading posts...</div>
                ) : posts.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No posts yet</div>
                ) : (
                  posts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                    />
                  ))
                )}
              </TabsContent>

              


              <TabsContent value="about">
                <ProfileAbout user={user} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}