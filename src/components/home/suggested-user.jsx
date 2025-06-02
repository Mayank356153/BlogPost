"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UsersRound } from "lucide-react";

// Mock suggested users data
const suggestedUsers = [
  {
    id: 1,
    name: "Sophia Chen",
    username: "sophiachen",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    role: "Flutter Developer",
  },
  {
    id: 2,
    name: "James Wilson",
    username: "jameswil",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    role: "Firebase Expert",
  },
  {
    id: 3,
    name: "Olivia Johnson",
    username: "oliviaj",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    role: "Android Developer",
  },
];

export default function SuggestedUsers(){
     return (
    // <Card>
    //   <CardHeader className="pb-3">
    //     <div className="flex items-center">
    //       <UsersRound className="w-4 h-4 mr-2 text-primary" />
    //       <CardTitle className="text-lg">People to follow</CardTitle>
    //     </div>
    //     <CardDescription>Suggested connections for you</CardDescription>
    //   </CardHeader>
    //   <CardContent className="space-y-4">
    //     {suggestedUsers.map((user) => (
    //       <div key={user.id} className="flex items-center justify-between">
    //         <div className="flex items-center gap-3">
    //           <Avatar>
    //             <AvatarImage src={user.avatar} sizes="5" alt={user.name} />
    //             <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    //           </Avatar>
    //           <div>
    //             <p className="text-sm font-medium leading-none">{user.name}</p>
    //             <p className="text-xs text-muted-foreground">@{user.username}</p>
    //           </div>
    //         </div>
    //         <Button variant="outline" size="sm">
    //           Follow
    //         </Button>
    //       </div>
    //     ))}
    //   </CardContent>
    // </Card>
    <Card>
  <CardHeader className="pb-3">
    <div className="flex items-center">
      <UsersRound className="w-4 h-4 mr-2 text-primary" />
      <CardTitle className="text-lg">People to follow</CardTitle>
    </div>
    <CardDescription>Suggested connections for you</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {suggestedUsers.map((user) => (
      <div key={user.id} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} width='50' alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Follow
        </Button>
      </div>
    ))}
  </CardContent>
</Card>
  );
}