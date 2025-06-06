"use client"

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Calendar, Hash } from "lucide-react";
// import {Post} from "@/components/feed/feed-container"
import  PostCard  from "@/components/post/post-card";
import { db } from "@/config/firebase";
import { collection, onSnapshot,document } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { set } from "date-fns";
import { updateDoc,doc,arrayUnion } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import {fetchFollowedUsersPosts} from "@/lib/allposts";
import { useAllUsers } from "@/lib/useAllUsers";
import fetchTopics from "@/lib/allTopics"









const users=async(setPeople,current_id)=>{
  const usersCollection = collection(db, "users");
  
  const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPeople(users.filter(user => user.id !== current_id)); // Exclude default user if needed
  
    console.log("Users updated:", users.filter(user => user.id !== current_id));
  });
  return unsubscribe || [];
}



export default function ExplorePage() {

  
  const [searchQuery,setSearchQuery]=useState("") 
  const [posts, setPosts] = useState([]);
  const [topics,setTopics]=useState([])
  const[people,setPeople]=useState([])
    const allUsers = useAllUsers();    // hook call at top level, not inside useEffect
  const {currentUser,user}=useAuth();
  
  const[currentfollowing,setCurrentFollowing]=useState([])
  const[filteredPeople,setFilteredPeople]=useState([])

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

useEffect(()=>{
    const unsubscribe = fetchTopics(setTopics);

    return () => unsubscribe();
},[])




const handleTopicFollow = async (topicId) => {
  try {
    if (!currentUser) return;

    const topicRef = doc(db, "topics", topicId);
       const id=currentUser.uid
    const res=await getDoc(topicRef)
    console.log(res)
    await updateDoc(topicRef, {
      following: arrayUnion(id)
    });

    toast.success("Successfully following topic");
  } catch (error) {
    console.error("Unable to follow topic", error);
    toast.error("Unable to follow topic");
  }
};


  
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

  
  const followUser = async ( targetUserId) => {
  if (!currentUser.uid || !targetUserId) return;

  const currentUserRef = doc(db, "users", currentUser.uid);

  const targetUserRef=doc(db,"users",targetUserId)
  
  try {
    await updateDoc(currentUserRef, {
      following: arrayUnion(targetUserId),
    });
    
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUser.uid),})
      
    setCurrentFollowing((prev) => [...prev, targetUserId]);
    toast.success("You are now following this user!");
  } catch (error) {
    console.error("Error following user:", error);
  }
};

const checkIfFollowing = (targetUserId) => {
  if (!currentUser?.uid || !targetUserId) return false;

  console.log("CURRENT USER",currentUser)
  console.log("TARGET USER ID",targetUserId)
  
  console.log("RESULT",user.following?.includes(targetUserId))
  return user.following?.includes(targetUserId) || currentfollowing.includes(targetUserId) || false;
  
}



useEffect(() => {
    const query = searchQuery.toLowerCase();

    
if (!query || query.trim() === "") {
    setFilteredPeople(people); // Return all people if search query is empty
    return;
  }

  
    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(query) ||
      person.username.toLowerCase().includes(query)
    );

    setFilteredPeople(filtered);
  }, [searchQuery,people]);


  

  useEffect(()=>{
   users(setPeople,currentUser?.uid)
   console.log("users")
    console.log(people)
  },[])

   return (
    <div className="container px-4 py-8 mx-auto">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Explore</h1>
        <div className="relative">
          <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search posts, topics, or people..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="trending">
        <TabsList className="mb-8">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="topics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.name}
                className="p-4 transition-colors border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{topic.name}</h3>
                  </div>
                  <Button variant="outline" size="sm" onClick={()=>handleTopicFollow(topic?.id)} disabled={topic?.following?.includes(currentUser?.uid)} >{topic?.following?.includes(currentUser?.uid)?"Following":"Follow"}</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {/* <p>{topic.posts.toLocaleString()} posts</p> */}
                  <p>{topic.following?.length} followers</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="people">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="p-4 transition-colors border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <img          
                       src={person.image || "/blank-profile-picture-973460_1280.webp"}
                    alt={person.name}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">@{person.username}</p>
                      </div>
                      <Button variant="outline" size="sm" disabled={checkIfFollowing(person.id)} onClick={()=>followUser(person.id)}>{checkIfFollowing(person.id)?"Following":"Follow"}</Button>
                    </div>
                    <p className="mt-2 text-sm">{person.bio || "NO BIO IS GIVEN"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {person.followers?.length || 0} followers
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );


}