"use client";

import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Plus,
  Calendar,
  MessageSquare,
  ChevronRight,
  UserPlus,
  Check,
} from "lucide-react";
import {toast} from "sonner"
import Link from "next/link";
import { db } from "@/config/firebase";
import { collection,snapshot,onSnapshot, arrayUnion, updateDoc, arrayRemove, increment } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { doc } from "firebase/firestore";

// interface Group {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   members: number;
//   type: "public" | "private";
//   category: string;
//   activity: {
//     posts: number;
//     events: number;
//   };
//   recentEvent?: {
//     title: string;
//     date: string;
//   };
//   isJoined?: boolean;
//   isPending?: boolean;
// }

const mockGroups = [
  {
    id: "1",
    name: "Flutter Developers",
    description: "A community of Flutter enthusiasts sharing knowledge and best practices for cross-platform development.",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 1500,
    type: "public",
    category: "Mobile Development",
    activity: {
      posts: 230,
      events: 12,
    },
    recentEvent: {
      title: "Flutter Forward Extended",
      date: "2025-05-15",
    },
    isJoined: true,
  },
  {
    id: "2",
    name: "Cloud Native Developers",
    description: "Discussing cloud architecture, Kubernetes, and modern infrastructure patterns.",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 2300,
    type: "public",
    category: "Cloud Computing",
    activity: {
      posts: 345,
      events: 8,
    },
    recentEvent: {
      title: "Kubernetes Workshop",
      date: "2025-06-01",
    },
    isJoined: true,
  },
];

const discoverGroups = [
  {
    id: "3",
    name: "AI & Machine Learning",
    description: "Exploring the latest in artificial intelligence, machine learning, and deep learning technologies.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 1800,
    type: "public",
    category: "Artificial Intelligence",
    activity: {
      posts: 156,
      events: 6,
    },
    recentEvent: {
      title: "TensorFlow Workshop",
      date: "2025-05-20",
    },
    isJoined: false,
  },
  {
    id: "4",
    name: "Web Development Masters",
    description: "Advanced web development techniques, frameworks, and best practices for modern web applications.",
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 2100,
    type: "public",
    category: "Web Development",
    activity: {
      posts: 289,
      events: 15,
    },
    recentEvent: {
      title: "React 19 Deep Dive",
      date: "2025-05-25",
    },
    isJoined: false,
  },
  {
    id: "5",
    name: "Cybersecurity Experts",
    description: "Sharing knowledge about cybersecurity, ethical hacking, and protecting digital assets.",
    image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 950,
    type: "private",
    category: "Security",
    activity: {
      posts: 78,
      events: 4,
    },
    recentEvent: {
      title: "Penetration Testing Bootcamp",
      date: "2025-06-10",
    },
    isJoined: false,
  },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [discoveredGroups, setDiscoveredGroups] = useState([]);
  const {user,currentUser}=useAuth();


   useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'groups'), (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log("groups")
      const groupAlreadyJoined=groupsData.filter(group=> group.allUser.includes(user.id))
      const groupNotJoined=groupsData.filter(group=> !group.allUser.includes(user.id))
      setGroups(groupAlreadyJoined)
      setDiscoveredGroups(groupNotJoined)
    })

    return () => unsubscribe() // Cleanup on unmount
  }, [])

  const handleJoinGroup = async (group) => {
    try {
      // Simulate API call

        if(!user){
          toast.error(<>
          <strong>Failed to Join Group</strong>
          <div>You must be login to join group.</div>
          </>)
          return;
        }
        if(group.type==="private"){
           toast.success(<>
          <strong>Failed to Join Group</strong>
          <div>You must be login to join group.</div>
          </>)
          return;
        }

        const groupRef=doc(db,"groups",group.id)
        const userRef=doc(db,"users",user.id)

        await updateDoc(groupRef,{
          allUser:arrayUnion(user.id),
          recentMembers:arrayUnion(user)
        })

        await updateDoc(userRef,{
          groups:arrayUnion(group.id)
        })
      
      toast.success(
        <>
        <strong>Successfully joined group</strong>
        <div>You are now a member of heeloo!</div>
        </>
      )

    } catch (error) {

      
     console.log("Error in joining group",error)
      toast.error(<>
        <strong>Failed to join group</strong>
        <div>There was an error joining the group. Please try again.</div>
      </>)
    }
  };

  const handleLeaveGroup = async (group) => {
    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(user)
      const groupRef=doc(db,"groups",group.id)
      const userRef=doc(db,"users",user.id)
      const removerUser=group.recentMembers.filter(member => member.id!==user.id)
      const removerMember=group.allUser.filter(us=> us!==user.id)
      console.log("k")
      await updateDoc(groupRef,{
        recentMembers:removerUser,
        members:increment(-1),
        allUser:removerMember
      })
  console.log("o")

      const groupRemove=user.groups.filter(gr=> gr!== group.id)
      await updateDoc(userRef,{
        groups:groupRemove
      })

     

 toast.success(
        <>
        <strong>Left group</strong>
        <div>You have successfully left the group.</div>
        </>
      )


     
    } catch (error) {
      console.log("Error in leaving group",error)
      

      
 toast.error(
        <>
        <strong>Failed to leave group</strong>
        <div>There was an error leaving the group. Please try again.</div>
        </>
      )
    }
  };

  const getJoinButtonContent = (group) => {
    if (group.isJoined) {
      return (
        <>
          <Check className="w-4 h-4 mr-2" />
          Joined
        </>
      );
    }
    
    if (group.isPending) {
      return "Pending";
    }
    
    if (group.type === "private") {
      return (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Request to Join
        </>
      );
    }
    
    return (
      <>
        <UserPlus className="w-4 h-4 mr-2" />
        Join Group
      </>
    );
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Button asChild>
          <Link href="/groups/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Group tabs */}
      <Tabs defaultValue="my-groups">
        <TabsList className="mb-8">
          <TabsTrigger value="my-groups">My Groups ({groups.length})</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups">
          {groups.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No groups yet</h3>
              <p className="mb-4 text-muted-foreground">
                Join some groups to connect with like-minded developers
              </p>
              <Button asChild>
                <Link href="#discover" onClick={() => document.querySelector('[value="discover"]')?.click()}>
                  Discover Groups
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="overflow-hidden transition-colors border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Group image */}
                    <div className="w-full h-48 md:w-64 md:h-auto">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Group content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="mb-1 text-xl font-semibold">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{group.members.toLocaleString()} members</span>
                            <Badge variant="secondary">{group.type}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLeaveGroup(group)}
                          >
                            Leave
                          </Button>
                          <Button asChild>
                            <Link href={`/groups/${group.id}`}>
                              View Group
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <p className="mb-4 text-muted-foreground">
                        {group.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium">{group.category}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Posts</p>
                          <p className="font-medium">{group.activity.posts}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Events</p>
                          <p className="font-medium">{group.activity.events}</p>
                        </div>
                        {group.recentEvent && (
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Next Event</p>
                            <p className="font-medium">{group.recentEvent.date}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          <div className="grid gap-6">
            {discoverGroups.length>0 && discoveredGroups.map((group) => (
              <div
                key={group.id}
                className="overflow-hidden transition-colors border rounded-lg hover:bg-muted/50"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Group image */}
                  <div className="w-full h-48 md:w-64 md:h-auto">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Group content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="mb-1 text-xl font-semibold">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{group.members.toLocaleString()} members</span>
                          <Badge variant="secondary">{group.type}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                       

                         <Button 
                            size="sm"
                            onClick={() => handleJoinGroup(group)}
                            disabled={group.isPending}
                            variant={group.isPending ? "outline" : "default"}
                          >
                            {getJoinButtonContent(group)} 
                          </Button>
                       
                      </div>
                    </div>

                    <p className="mb-4 text-muted-foreground">
                      {group.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{group.category}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Posts</p>
                        <p className="font-medium">{group.activity.posts}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Events</p>
                        <p className="font-medium">{group.activity.events}</p>
                      </div>
                      {group.recentEvent && (
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Next Event</p>
                          <p className="font-medium">{group.recentEvent.date}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <div className="py-12 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No pending invites</h3>
            <p>Group invitations will appear here when you receive them.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}