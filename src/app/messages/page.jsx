
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { formatDistanceToNow } from "date-fns";
import { FollowingUsers } from "@/lib/FollowingUsers";
import { db } from "@/config/firebase";
import { 
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs
} from "firebase/firestore";

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatList, setShowChatList] = useState(true);
  const followingUsers = FollowingUsers();
  const[filteredUsers,setFilteredUsers]=useState([])
  // Get chat ID by combining and sorting user IDs
  const getChatId = (a, b) => [a, b].sort().join("_");

  // Load following users
  useEffect(() => {
    console.log("lk")
    setUsers(followingUsers);
  }, [followingUsers]);



  useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredUsers(followingUsers);
  } else {
    setFilteredUsers(
      followingUsers.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }
}, [followingUsers, searchQuery]);



  // Load messages when a user is selected
  useEffect(() => {
    if (!selectedUser || !user?.id) return;
    
    const chatId = getChatId(user.id, selectedUser.id);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [selectedUser, user?.id]);


  
  // Mark messages as seen
  useEffect(() => {
    const markMessagesAsSeen = async () => {
      if (!selectedUser || !user?.id) return;
      
      const chatId = getChatId(user.id, selectedUser.id);
      const messagesRef = collection(db, "chats", chatId, "messages");
      
      // Get all unseen messages sent to current user
      const querySnapshot = await getDocs(messagesRef);
      const batch = [];
      
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        if (message.receiverId === user.id && !message.seen) {
          batch.push(updateDoc(doc.ref, { seen: true }));
        }
      });

      // Update chat metadata
      batch.push(
        setDoc(doc(db, "chats", chatId), {
          users: [user.id, selectedUser.id],
          seenBy: [user.id],
          lastUpdated: serverTimestamp()
        }, { merge: true })
      );

      await Promise.all(batch);
    };

    markMessagesAsSeen();
  }, [selectedUser, user?.id, messages]);


  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !user?.id) return;

    const chatId = getChatId(user.id, selectedUser.id);
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    try {
      // Add new message
      await addDoc(messagesRef, {
        senderId: user.id,
        receiverId: selectedUser.id,
        message: newMessage,
        timestamp: serverTimestamp(),
        seen: false
      });

      // Update chat metadata
      await setDoc(chatRef, {
        users: [user.id, selectedUser.id],
        lastMessage: newMessage,
        lastSenderId: user.id,
        seenBy: [user.id],
        lastUpdated: serverTimestamp()
      }, { merge: true });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
  };


 

  useEffect(()=>console.log("change"),[filteredUsers])




  
  return (
    <div className="container px-0 py-8 mx-auto sm:px-4">
      <div className="w-full mx-auto border rounded-lg overflow-hidden h-[calc(100vh-8rem)]">
        <div className="flex h-full">
          {/* Chat list */}
          <div className={`w-full sm:w-80 border-r flex flex-col ${showChatList ? 'block' : 'hidden sm:flex'}`}>
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
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="flex items-start w-full gap-3 p-4 transition-colors hover:bg-muted/50"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowChatList(false);
                  }}
                >
                  <Avatar>
                    <AvatarImage 
                      width="50" 
                      referrerPolicy="no-referrer"  
                      src={user?.image || "/blank-profile-picture-973460_1280.webp"} 
                      alt={user?.name} 
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user?.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat area */}
          {/* <div className={`flex-1 flex flex-col ${!showChatList ? 'block' : 'hidden sm:flex'}`}> */}
            {/* {selectedUser ? (
              <> */}
                {/* Chat header */}
                {/* <div className="flex items-center justify-between px-2 py-2 border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 sm:hidden"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar>
                      <AvatarImage 
                        width="50" 
                        referrerPolicy="no-referrer" 
                        src={selectedUser?.image || "/blank-profile-picture-973460_1280.webp"} 
                        alt={selectedUser?.name} 
                      />
                      <AvatarFallback>{selectedUser?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div> */}
                      {/* <h3 className="font-medium">{selectedUser?.name}</h3>
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
                </div> */}

                {/* Messages */}
                {/* <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-4">
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
                            <p>{message.message}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {message.timestamp && formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div> */}
                {/* </div> */}

                {/* Message input */}
                {/* <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-muted-foreground">
                Select a chat to start messaging
              </div>
            )} */}
          {/* </div> */}
          <div className={`flex-1 flex flex-col ${!showChatList ? 'flex' : 'hidden sm:flex'}`}>
  {selectedUser ? (
    <>
      {/* Chat header - made more compact for mobile */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b bg-background">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={handleBackToList}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarImage 
              width="50" 
              referrerPolicy="no-referrer" 
              src={selectedUser?.image || "/blank-profile-picture-973460_1280.webp"} 
              alt={selectedUser?.name} 
            />
            <AvatarFallback className="text-sm sm:text-base">
              {selectedUser?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <h3 className="text-sm font-medium sm:text-base">{selectedUser?.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Messages - improved spacing for mobile */}
      <div className="flex-1 p-2 overflow-y-auto sm:p-4">
        <div className="space-y-2 sm:space-y-4">
          {messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.message}</p>
                  <p className="mt-0.5 text-xs opacity-70">
                    {message.timestamp && formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message input - better mobile layout */}
      <div className="sticky bottom-0 p-2 border-t sm:p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            className="text-sm sm:text-base"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button 
            type="submit" 
            size="sm"
            className="w-10 h-10 sm:w-auto sm:h-auto" 
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center flex-1 p-4 text-center text-muted-foreground">
      <p className="text-sm sm:text-base">Select a chat to start messaging</p>
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
}