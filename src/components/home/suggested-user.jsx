"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";
import {useAllUsers} from "@/lib/useAllUsers";
import { db } from "@/config/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "sonner";
// Mock suggested users data
// const suggestedUsers = [
//   {
//     id: 1,
//     name: "Sophia Chen",
//     username: "sophiachen",
//     avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     role: "Flutter Developer",
//   },
//   {
//     id: 2,
//     name: "James Wilson",
//     username: "jameswil",
//     avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     role: "Firebase Expert",
//   },
//   {
//     id: 3,
//     name: "Olivia Johnson",
//     username: "oliviaj",
//     avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     role: "Android Developer",
//   },
// ];


function getTopUsersByFollowersArray(allUsers, limitCount = 5) {
  return [...allUsers]
    .map(user => ({
      ...user,
      followerCount: Array.isArray(user.followers) ? user.followers.length : 0,
    }))
    .sort((a, b) => b.followerCount - a.followerCount)
    .slice(0, limitCount);
}

import { useAuth } from "../auth/auth-provider";


export default function SuggestedUsers(){
const {currentUser,user} = useAuth();
const [currentfollowing, setCurrentFollowing] = useState(user?.following || []);
 
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

  
  
  // console.log("RESULT",suggestedUsers?.following?.includes(targetUserId))
  return suggestedUsers?.following?.includes(targetUserId) || currentfollowing.includes(targetUserId) || false;
  
}
 

  const allusers=useAllUsers();
  const[suggestedUsers, setSuggestedUsers] = useState([]);
  
 useEffect(() => {
  if (!currentUser || !allusers || allusers.length === 0) {
    setSuggestedUsers([]);
    return;
  }

  const topUsers = getTopUsersByFollowersArray(allusers, 5);
  // Filter out users the currentUser is already following
  const filteredTopUsers = topUsers.filter(
    (us) => !(user.following || []).includes(us.id)
  );
   console.log("TOP USERS",filteredTopUsers)
  setSuggestedUsers(filteredTopUsers);
}, [allusers, currentUser]);

     return (
    <Card>
  <CardHeader className="pb-3">
    <div className="flex items-center">
      <UsersRound className="w-4 h-4 mr-2 text-primary" />
      <CardTitle className="text-lg">People to follow</CardTitle>
    </div>
    <CardDescription>Suggested connections for you</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {suggestedUsers?.map((us) => (
      <div key={user.id} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage   referrerPolicy="no-referrer" src={us.image || "/blank-profile-picture-973460_1280.webp" } width='50' alt={us.name} />
            <AvatarFallback>{us.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{us.name}</p>
            <p className="text-xs text-muted-foreground">@{us.username}</p>
            <p className="text-xs text-muted-foreground">{us.followers?.length || 0} followers</p>
          </div>
        </div>
        <Button variant="outline" size="sm" disabled={checkIfFollowing(us.id)} onClick={() => followUser(us.id)}>
          {checkIfFollowing(us.id) ? "Following" : "Follow"}
        </Button>
      </div>
    ))}
  </CardContent>
</Card>
  );
}