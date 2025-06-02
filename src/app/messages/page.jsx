"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { formatDistanceToNow } from "date-fns";
// Mock data
const mockChats= [
  {
    id: "1",
    user: {
      id: "2",
      name: "Sarah Chen",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      status: "online"
    },
    lastMessage: {
      content: "Looking forward to the Flutter workshop!",
      timestamp: "2025-04-16T10:30:00Z"
    },
    unreadCount: 2
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "Alex Kumar",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      status: "offline",
      lastSeen: "2025-04-16T09:15:00Z"
    },
    lastMessage: {
      content: "Thanks for sharing the article about Kotlin Multiplatform",
      timestamp: "2025-04-15T18:45:00Z"
    },
    unreadCount: 0
  }
];

const mockMessages = {
  "1": [
    {
      id: "m1",
      content: "Hey! Are you joining the Flutter workshop next week?",
      senderId: "2",
      receiverId: "1",
      timestamp: "2025-04-16T10:15:00Z"
    },
    {
      id: "m2",
      content: "Yes, I've already registered! Can't wait to learn about the new features.",
      senderId: "1",
      receiverId: "2",
      timestamp: "2025-04-16T10:20:00Z"
    },
    {
      id: "m3",
      content: "Looking forward to the Flutter workshop!",
      senderId: "2",
      receiverId: "1",
      timestamp: "2025-04-16T10:30:00Z"
    }
  ]
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState(mockChats);

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages[selectedChat.id] || []);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const message = {
      id: `m${Date.now()}`,
      content: newMessage.trim(),
      senderId: user.id,
      receiverId: selectedChat.user.id,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Update last message in chat list
    setChats(chats.map(chat => 
      chat.id === selectedChat.id
        ? {
            ...chat,
            lastMessage: {
              content: message.content,
              timestamp: message.timestamp
            }
          }
        : chat
    ));
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
        {/* Chat list */}
        <div className="flex flex-col border-r w-80">
          <div className="p-4 border-b">
            <h2 className="mb-4 text-xl font-semibold">Messages</h2>
            <div className="relative">
              <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors ${
                  selectedChat?.id === chat.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage width="50" src={chat.user.image} alt={chat.user.name} />
                    
                    <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${
                      chat.user.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{chat.user.name}</span>
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm truncate text-muted-foreground">
                      {chat.lastMessage.content}
                    </p>
                  )}
                  {chat.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        {selectedChat ? (
          <div className="flex flex-col flex-1">
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage width="50" src={selectedChat.user.image} alt={selectedChat.user.name} />
                  <AvatarFallback>{selectedChat.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedChat.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.user.status === "online"
                      ? "Online"
                      : selectedChat.user.lastSeen
                      ? `Last seen ${formatDistanceToNow(new Date(selectedChat.user.lastSeen), { addSuffix: true })}`
                      : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="mt-1 text-xs opacity-70">
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}