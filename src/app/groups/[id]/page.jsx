"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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
  AlertTriangle
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
import {toast} from "sonner";

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



export default function GroupPage() {
  const params = useParams();
  const [group] = useState(mockGroup);
  const [posts] = useState(mockPosts);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isMember, setIsMember] = useState(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const handleJoinLeave = () => {
    if (isMember) {
      setShowLeaveDialog(true);
    } else {
      handleJoin();
    }
  };

  const handleJoin = () => {
    setIsMember(true);
   
    toast.success(<>
    <strong>Welcome to the group!</strong>
    <div>
      You have successfully joined the group.
    </div>
    </>)
    
  };

  const handleLeave = () => {
    setIsMember(false);
    setShowLeaveDialog(false);
    toast({
      title: "Left group",
      description: "You have successfully left the group.",
    });
     
     toast.success(<>
    <strong>Left Group</strong>
    <div>
You have successfully left the group.
    </div>
    </>)
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
          src={group.coverImage}
          alt={group.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Group Info */}
      <div className="container relative z-10 px-4 mx-auto -mt-20">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <img
            src={group.image}
            alt={group.name}
            className="w-32 h-32 border-4 rounded-lg border-background"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{group.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.members.toLocaleString()} members
                  </span>
                  <Badge variant="secondary">{group.type}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleJoinLeave}>
                  {isMember ? "Leave Group" : "Join Group"}
                </Button>
                <Button>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
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

        {/* Tabs */}
        <Tabs defaultValue="discussion" className="mt-8">
          <TabsList>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="discussion" className="mt-6">
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="border rounded-lg">
              {/* Chat messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar>
                      {/* <AvatarImage size='50' src={message.sender.image} alt={message.sender.name} /> */}
                                                <AvatarImage src={message.sender.image} width='50' alt={message.sender.name} />

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

        



          <TabsContent value="members" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 font-semibold">Admins</h3>
                <div className="grid gap-4">
                  {group.admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {/* <AvatarImage src={admin.image} alt={admin.name} /> */}
                                                    <AvatarImage src={admin.image} width='50' alt={admin.name} />

                          <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-muted-foreground">{admin.role}</p>
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
                  {group.recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {/* <AvatarImage src={member.image} alt={member.name} /> */}
                                                    <AvatarImage src={member.image} width='50' alt={member.name} />

                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
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
                <p className="text-muted-foreground">{group.description}</p>
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
                    <p className="text-2xl font-bold">{group.activity.posts}</p>
                    <p className="text-muted-foreground">Posts this month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{group.activity.events}</p>
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