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
        

        await updateDoc(groupRef,{
          allUser:arrayUnion(user.id),
          recentMembers:arrayUnion(user)
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
                            <span>{group.allUser?.length} members</span>
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
            {discoveredGroups.length>0 && discoveredGroups.map((group) => (
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
                          <span>{group.allUser?.length} members</span>
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