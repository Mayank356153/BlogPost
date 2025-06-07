"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Users,
  Calendar,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Share,
  AlertTriangle,
  Plus,
  PlusCircle,
  CalendarPlus,
  UserPlus,
  Check,
  UserMinus
} from "lucide-react";
import PostCard from "@/components/post/post-card";
import { Post } from "@/components/feed/feed-container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {toast} from "sonner"
import  PostCreateForm  from "@/components/groups/group-post-create-form"
import  GroupEventCreateForm  from "@/components/groups/group-event-create-form";
import { db } from "@/config/firebase";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { updateDoc,increment,onSnapshot,collection } from "firebase/firestore";
// Mock group data
const mockGroup = {
  id: "1",
  name: "Flutter Developers",
  description: "A community of Flutter enthusiasts sharing knowledge and best practices for cross-platform development.",
  image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  coverImage: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  members: 1500,
  type: "public",
  category: "Mobile Development",
  activity: {
    posts: 230,
    events: 12,
  },
  admins: [
    {
      id: "1",
      name: "Sarah Chen",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      role: "Admin"
    }
  ],
  recentMembers: [
    {
      id: "2",
      name: "Alex Kumar",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: "3",
      name: "Emma Thompson",
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    }
  ]
};

// Mock posts
const mockPosts = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Sarah Chen",
      username: "sarahchen",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "Excited to announce our next Flutter workshop! We'll be covering the latest features in Flutter 3.0. Don't forget to RSVP!",
    images: [
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    createdAt: "2025-04-16T10:30:00Z",
    likesCount: 42,
    commentsCount: 7,
    sharesCount: 3,
    isLiked: false,
    tags: ["Flutter", "Workshop", "MobileApp"],
  }
];

// Mock messages
const mockMessages = [
  {
    id: "1",
    sender: {
      id: "2",
      name: "Alex Kumar",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "Hey everyone! I'm working on a Flutter animation library. Would love to get your feedback!",
    timestamp: "2025-04-16T15:30:00Z",
  },
  {
    id: "2",
    sender: {
      id: "3",
      name: "Emma Thompson",
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "That sounds interesting! Can you share more details about the features you're planning to include?",
    timestamp: "2025-04-16T15:35:00Z",
  },
];

// Mock events
const mockEvents = [
  {
    id: "1",
    title: "Flutter Forward Extended",
    date: "2025-05-15",
    time: "10:00 AM",
    location: "San Francisco, CA",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendees: 150,
  }
];

export default function GroupPage(props) {
     const { id } = use(props.params)
     const {user,currentUser}=useAuth();
  const [group,setGroup] = useState({});
  const router=useRouter()
  const [posts,setPosts] = useState(mockPosts);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isMember, setIsMember] = useState(false); // Start as not a member to show join functionality
  const [isJoining, setIsJoining] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);



  useEffect(() => {
    if (!id) return;
    if(!user) return;

    const postsRef = collection(db,"groups",id,"posts");

    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    
    });

    return () => unsubscribe(); // clean up on unmount
  }, [id]);


  const handleJoinLeave = () => {
    if (isMember) {
      setShowLeaveDialog(true);
    } else {
      handleJoin();
    }
  };

  
  useEffect(()=>{
    console.log(id)
    const fetchGroup = async () => {
      try {
        const docRef = doc(db, 'groups', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setGroup({ id: docSnap.id, ...docSnap.data() })
        } else {
          console.log('Group not found')
        }
      } catch (err) {
        console.log('Error fetching group')
        console.error(err)
      }
    }
    if(id) fetchGroup()
  },[id])

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsMember(true);
     toast.success("Welcome to the group!", {
  description: `You have successfully joined ${group.name}.`,
})

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to join group",
        description: "There was an error joining the group. Please try again.",
      });
    } finally {
      setIsJoining(false);
    }
  };

 
   const handleLeave = async () => {
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
      
       router.replace("/groups")

 
      
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

  const handleLike = (postId) => {
    // Handle like functionality
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: {
        id: "current-user",
        name: "Current User",
        image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="relative w-full h-64">
        <img
          src={group?.coverImage}
          alt={group?.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Group Info */}
      <div className="container relative z-10 px-4 mx-auto -mt-20">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <img
            src={group?.image}
            alt={group?.name}
            className="w-32 h-32 border-4 rounded-lg border-background"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{group?.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group?.members?.toLocaleString()} members
                  </span>
                  <Badge variant="secondary">{group.type}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={()=>setShowLeaveDialog(true)}
                  variant={"default"}
                >
                 
                    
                      <UserMinus className="w-4 h-4 mr-2" />
                      Leave Group
                    
                 
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
       
          <div className="p-4 mt-6 border rounded-lg bg-muted/50">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button 
                onClick={() => setShowCreatePostDialog(true)}
                className="flex-1 sm:flex-none"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Post
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowCreateEventDialog(true)}
                className="flex-1 sm:flex-none"
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>
        

       

        {/* Leave Group Dialog */}
        <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Group</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this group? You'll no longer have access to the group's content and discussions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLeave}>
                Leave Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Post Dialog */}
        <Dialog open={showCreatePostDialog} onOpenChange={setShowCreatePostDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Post in {group?.name}</DialogTitle>
              <DialogDescription>
                Share something with the {group?.name} community
              </DialogDescription>
            </DialogHeader>
            <PostCreateForm groupId={group.id}
              onSuccess={() => {
                setShowCreatePostDialog(false);
                
                
                toast.success(<>
                <strong>Post created</strong>
                <div>Your post has been shared with the group.</div>
                </>)
              }} 
            />
          </DialogContent>
        </Dialog>

        {/* Create Event Dialog */}
        <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Event for {group?.name}</DialogTitle>
              <DialogDescription>
                Organize a new event for the {group?.name} community
              </DialogDescription>
            </DialogHeader>
            <GroupEventCreateForm 
              groupId={group.id}
              onSuccess={() => {
                setShowCreateEventDialog(false);
                toast({
                  title: "Event created",
                  description: "Your event has been created successfully.",
                });
              }} 
            />
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs defaultValue="discussion" className="mt-8">
          <TabsList>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            {isMember && <TabsTrigger value="chat">Chat</TabsTrigger>}
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="discussion" className="mt-6">
            
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Recent Posts</h3>
                  <Button onClick={() => setShowCreatePostDialog(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <PostCard
                    group={true}
                    groupId={group?.id}
                      key={post.id}
                      post={post}
                      onLike={() => handleLike(post.id)}
                    />
                  ))}
                </div>
              </>
            
          </TabsContent>

          
            <TabsContent value="chat" className="mt-6">
              <div className="border rounded-lg">
                {/* Chat messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={message.sender.image} alt={message.sender.name} />
                        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.sender.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
        

          <TabsContent value="events" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              
                <Button onClick={() => setShowCreateEventDialog(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockEvents.map((event) => (
                <div key={event.id} className="overflow-hidden border rounded-lg">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold">{event.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" >
                      View Details 
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          
        
          <TabsContent value="members" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 font-semibold">Admins</h3>
                <div className="grid gap-4">
                  {group?.admins?.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={admin?.image} alt={admin.name} />
                          <AvatarFallback>{admin?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{admin?.name}</p>
                          <p className="text-sm text-muted-foreground">{admin?.role}</p>
                        </div>
                      </div>
                     <Button variant="outline">Message</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">Members</h3>
                <div className="grid gap-4">
                  {group?.recentMembers?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member?.image} alt={member?.name} />
                          <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member?.name}</p>
                          <p className="text-sm text-muted-foreground">Member</p>
                        </div>
                      </div>
                     <Button variant="outline">Message</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold">About this group</h3>
                <p className="text-muted-foreground">{group?.description}</p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Group rules</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Be respectful and constructive in discussions</li>
                  <li>No spam or self-promotion without permission</li>
                  <li>Share knowledge and help others learn</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{group?.activity?.posts}</p>
                    <p className="text-muted-foreground">Posts this month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{group?.activity?.events}</p>
                    <p className="text-muted-foreground">Upcoming events</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}