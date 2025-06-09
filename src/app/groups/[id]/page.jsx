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
import { addDoc, getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { query,orderBy } from "firebase/firestore";
import { updateDoc,increment,onSnapshot,collection } from "firebase/firestore";



export default function GroupPage(props) {
     const { id } = use(props.params)
     const {user,currentUser}=useAuth();
  const [group,setGroup] = useState({});
  const router=useRouter()
  const [posts,setPosts] = useState([]);
  const[isSubmitting,setIsSubmitting]=useState(false)
  const [messages, setMessages] = useState([]);
  const [groupEvents,setGroupEvents]=useState([])
  const [newMessage, setNewMessage] = useState("");
  
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);



  useEffect(() => {
    if (!id) return;
    if(!user) return;

    const postsRef = collection(db,"groups",id,"posts");
   const eventRef=collection(db,"groups",id,"events")
   const messageRef=collection(db,"groups",id,"messages")
       const messagesQuery = query(messageRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });
    
     const eventunsubscribe=onSnapshot(eventRef,(snapshot)=>{
      const fetchEvents=snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))
      setGroupEvents(fetchEvents)
     })
    
     const messageunsubscribe=onSnapshot(messagesQuery,(snapshot)=>{
      const fetchMessages=snapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }))
      console.log(fetchMessages.reverse())
      setMessages(fetchMessages.reverse())
     })
    return () => {
      unsubscribe();
      eventunsubscribe();
      messageunsubscribe();
    } 
  }, [id]);



  

  
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

  


  const handleSendMessage=async(e)=>{
    e.preventDefault();
    if(!id) return ;
    if(!user) return ;
    if(!newMessage) return ;
    console.log("a")
    try {
      setIsSubmitting(true)
      const messageRef=collection(db,"groups",id,"messages")

       await addDoc(messageRef,{
        sender:user,
        content:newMessage,
        timestamp:new Date().toISOString(),
       })
       setNewMessage("")

       toast.success("Message Sent Successfully.")

      
    } catch (error) {
                console.log("Error in sending message",error)
                toast.error("Error in sending message")      
    } 
    finally{
      setIsSubmitting(false)
    }
  }


 
 
   const handleLeave = async () => {
     try {
  
       console.log(user)
       const groupRef=doc(db,"groups",group.id)
       const userRef=doc(db,"users",user.id)
       const removerUser=group.recentMembers.filter(member => member.id!==user.id)
       console.log("a")

       const removerMember=group.allUser.filter(us=> us!==user.id)
       console.log("B")       
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

  

  return (
    <div className="min-h-screen">
  
      <div className="relative w-full h-64">
        <img
          src={group?.coverImage}
          alt={group?.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

  
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
                    {group?.allUser?.length} members
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
                toast.success(<>
                <strong>Event created</strong>
                <div>Your event has been created successfully.</div>
                </>)
              }} 
            />
          </DialogContent>
        </Dialog>

  
        <Tabs defaultValue="discussion" className="mt-8">
          <TabsList>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
             <TabsTrigger value="chat">Chat</TabsTrigger>
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
                  {messages.map((message) => {
                    const isCurrentUser = message.sender?.id===user?.id;
                    // const isCurrentUser = true;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="flex-shrink-0">
                          <AvatarImage   referrerPolicy="no-referrer" src={message.sender?.image || "/blank-profile-picture-973460_1280.webp"} width='50' alt={message.sender?.name} />
                          <AvatarFallback>{message.sender?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 max-w-[70%] ${isCurrentUser ? 'text-right' : ''}`}>
                          <div className={`${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.sender?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div 
                              className={`rounded-lg p-3 ${
                                isCurrentUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

            
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={isSubmitting}>{isSubmitting?"Sending":"Send"}</Button>
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
              {groupEvents.map((event) => (
                <div key={event.id} className="overflow-hidden border rounded-lg">
                  <img
                    src={event?.image}
                    alt={event?.title}
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
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={admin?.image ||  "/blank-profile-picture-973460_1280.webp"} alt={admin.name} width="50" referrerPolicy="no-referrer"/>
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
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member?.image || "/blank-profile-picture-973460_1280.webp"}  width="50" alt={member?.name} referrerPolicy="no-referrer"/>
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
                    <p className="text-2xl font-bold">{posts.length}</p>
                    <p className="text-muted-foreground">Posts this month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{groupEvents.length}</p>
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