// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Search, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
// import { useAuth } from "@/components/auth/auth-provider";
// import { formatDistanceToNow } from "date-fns";
// import {FollowingUsers} from "@/lib/FollowingUsers"
// import { db } from "@/config/firebase";
// import { collection,doc,setDoc,addDoc,serverTimestamp,updateDoc } from "firebase/firestore";
// // Mock data
// const mockChats= [
//   {
//     id: "1",
//     user: {
//       id: "2",
//       name: "Sarah Chen",
//       image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//       status: "online"
//     },
//     lastMessage: {
//       content: "Looking forward to the Flutter workshop!",
//       timestamp: "2025-04-16T10:30:00Z"
//     },
//     unreadCount: 2
//   },
//   {
//     id: "2",
//     user: {
//       id: "3",
//       name: "Alex Kumar",
//       image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//       status: "offline",
//       lastSeen: "2025-04-16T09:15:00Z"
//     },
//     lastMessage: {
//       content: "Thanks for sharing the article about Kotlin Multiplatform",
//       timestamp: "2025-04-15T18:45:00Z"
//     },
//     unreadCount: 0
//   }
// ];

// const mockMessages = {
//   "1": [
//     {
//       id: "m1",
//       content: "Hey! Are you joining the Flutter workshop next week?",
//       senderId: "2",
//       receiverId: "1",
//       timestamp: "2025-04-16T10:15:00Z"
//     },
//     {
//       id: "m2",
//       content: "Yes, I've already registered! Can't wait to learn about the new features.",
//       senderId: "1",
//       receiverId: "2",
//       timestamp: "2025-04-16T10:20:00Z"
//     },
//     {
//       id: "m3",
//       content: "Looking forward to the Flutter workshop!",
//       senderId: "2",
//       receiverId: "1",
//       timestamp: "2025-04-16T10:30:00Z"
//     }
//   ]
// };




// export default function MessagesPage() {
// //   const { user } = useAuth();
// //   const [selectedChat, setSelectedChat] = useState(null);
// //   const [messages, setMessages] = useState(mockMessages[1]);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [chats, setChats] = useState(mockChats);
// //   const [showChatList, setShowChatList] = useState(true);
// //    const [users,setUsers]=useState([])
// //    const [selectedUser,setSelectedUser]=useState(null)
// //   const followingUsers = FollowingUsers(); // ✅ use the hook at the top level
// //   const[senderUser,setSenderUser]=useState(user?.id)

// // const getChatId=(senderId,receiverId)=>{
// //   return [senderId,receiverId].sort().join('_')
// // }


  
// //   useEffect(() => {
// //     setUsers(followingUsers);
// //   }, [followingUsers]);



   
// //   useEffect(() => {
// //     if (selectedChat) {
// //       setMessages(mockMessages[selectedChat.id] || []);
// //       setShowChatList(false);
// //     }
// //   }, [selectedChat]);

  

// //   useEffect(()=>{
// //     console.log("message user")
// //     console.log(users)
// //   },[users])

// //   const handleSendMessage = async (e) => {
// //     e.preventDefault();
// //     alert("as")
    


// //     console.log("send",senderUser)
// //     console.log("Receive",selectedUser.id)
// //     console.log("Message",newMessage)


// //      const chatId=getChatId(senderUser,selectedUser.id)
// //      const chatRef=doc(db,"chats",chatId)
      
// //      const messageRef=collection(chatRef,"messages")

// //      await addDoc(messageRef,{
// //                     senderId:senderUser,
// //                     receiverId:selectedUser.id,
// //                     message:newMessage,
// //                     timestamp:serverTimestamp(),
// //                     seen:false,
// //      })


// //      await setDoc(chatRef,{
// //       users:[senderUser,selectedUser.id],
// //       lastMessage:newMessage,
// //         lastUpdated: serverTimestamp()
// //      },{merge:true})
     
// //     setNewMessage("")
// //   };

// //   const handleBackToList = () => {
// //     setShowChatList(true);
// //     setSelectedChat(null);
// //   };
//  const { user } = useAuth();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const followingUsers = FollowingUsers();
//   const senderUser = user?.id;

//   const getChatId = (a, b) => [a, b].sort().join("_");

//   useEffect(() => {
//     setUsers(followingUsers);
//   }, [followingUsers]);

//   useEffect(() => {
//     if (!selectedUser) return;
//     const chatId = getChatId(senderUser, selectedUser.id);
//     const msgQuery = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));

//     const unsub = onSnapshot(msgQuery, (snap) => {
//       const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setMessages(fetched);
//     });
//     return () => unsub();
//   }, [selectedUser]);

//   useEffect(() => {
//     const markSeen = async () => {
//       if (!selectedUser) return;
//       const chatId = getChatId(senderUser, selectedUser.id);
//       const messagesRef = collection(db, "chats", chatId, "messages");
//       const snap = await getDocs(messagesRef);

//       snap.forEach(async (msgDoc) => {
//         const msg = msgDoc.data();
//         if (msg.receiverId === senderUser && !msg.seen) {
//           await updateDoc(doc(db, "chats", chatId, "messages", msgDoc.id), { seen: true });
//         }
//       });

//       await updateDoc(doc(db, "chats", chatId), { seenBy: [senderUser] });
//     };

//     markSeen();
//   }, [selectedUser]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;

//     const chatId = getChatId(senderUser, selectedUser.id);
//     const chatRef = doc(db, "chats", chatId);
//     const msgRef = collection(chatRef, "messages");

//     await addDoc(msgRef, {
//       senderId: senderUser,
//       receiverId: selectedUser.id,
//       message: newMessage,
//       timestamp: serverTimestamp(),
//       seen: false
//     });

//     await setDoc(chatRef, {
//       users: [senderUser, selectedUser.id],
//       lastMessage: newMessage,
//       lastSenderId: senderUser,
//       seenBy: [senderUser],
//       lastUpdated: serverTimestamp()
//     }, { merge: true });

//     setNewMessage("");
//   };

  
//   return (
//     <div className="container px-0 py-8 mx-auto sm:px-4">
//       <div className="w-full  mx-auto border rounded-lg overflow-hidden h-[calc(100vh-8rem)]">
//         <div className="flex h-full">
//           {/* Chat list */}
//           <div className={`w-full sm:w-80 border-r flex flex-col ${showChatList ? 'block' : 'hidden sm:flex'}`}>
//             <div className="p-4 border-b">
//               <h2 className="mb-4 text-xl font-semibold">Messages</h2>
//               <div className="relative">
//                 <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
//                 <Input
//                   placeholder="Search messages..."
//                   className="pl-10"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="flex-1 overflow-y-auto">
//               {users.map((us) => (
//                 <button
//                   key={us.id}
//                   className="flex items-start w-full gap-3 p-4 transition-colors hover:bg-muted/50"
//                   // onClick={() => setSelectedChat(chat)}\
//                   onClick={()=>setSelectedUser(us)}
//                 >
//                   <div className="relative">
//                     <Avatar>
//                       <AvatarImage width="50" referrerPolicy="no-referrer"  src={us?.image || "/blank-profile-picture-973460_1280.webp" } alt={us?.name} />
//                       <AvatarFallback>{us?.name?.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     {/* <span
//                       className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full ${
//                         chat.user.status === "online" ? "bg-green-500" : "bg-gray-400"
//                       }`}
//                     /> */}
//                   </div>
//                   <div className="flex-1 text-left">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{us?.name}</span>
                     
//                     </div>
                   
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>




//           {/* Chat area */}
//           <div className={`flex-1 flex flex-col ${!showChatList ? 'block' : 'hidden sm:flex'}`}>
//             {selectedUser ? (
//               <>
//                 {/* Chat header */}
//                 <div className="flex items-center justify-between p-4 border-b">
//                   <div className="flex items-center gap-3">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="mr-2 sm:hidden"
//                       onClick={handleBackToList}
//                     >
//                       <ArrowLeft className="w-5 h-5" />
//                     </Button>
//                     <Avatar>
//                       <AvatarImage width="50" referrerPolicy="no-referrer" src={selectedUser?.image ||  "/blank-profile-picture-973460_1280.webp"} alt={selectedUser?.name} />
//                       <AvatarFallback>{selectedUser?.name?.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-medium">{selectedUser?.name}</h3>
//                       {/* <p className="text-sm text-muted-foreground">
//                         {selectedChat.user.status === "online"
//                           ? "Online"
//                           : selectedChat.user.lastSeen
//                           ? `Last seen ${formatDistanceToNow(new Date(selectedChat.user.lastSeen), { addSuffix: true })}`
//                           : "Offline"}
//                       </p> */}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button variant="ghost" size="icon">
//                       <Phone className="w-5 h-5" />
//                     </Button>
//                     <Button variant="ghost" size="icon">
//                       <Video className="w-5 h-5" />
//                     </Button>
//                     <Button variant="ghost" size="icon">
//                       <MoreVertical className="w-5 h-5" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Messages */}
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-4">
//                     {messages.map((message) => {
//                       const isOwn = message.senderId === user?.id;
//                       return (
//                         <div
//                           key={message.id}
//                           className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
//                         >
//                           <div
//                             className={`max-w-[70%] rounded-lg p-3 ${
//                               isOwn
//                                 ? "bg-primary text-primary-foreground"
//                                 : "bg-muted"
//                             }`}
//                           >
//                             <p>{message.content}</p>
//                             <p className="mt-1 text-xs opacity-70">
//                               {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
//                             </p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </ScrollArea>

//                 {/* Message input */}
//                 <div className="relative bottom-0 p-4 border-t">
//                   <form
//                     onSubmit={handleSendMessage}
//                     className="flex gap-2"
//                   >
//                     <Input
//                       placeholder="Type a message..."
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                     />
//                     <Button type="submit">
//                       <Send className="w-4 h-4" />
//                     </Button>
//                   </form>
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center justify-center flex-1 text-muted-foreground">
//                 Select a chat to start messaging
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  // Get chat ID by combining and sorting user IDs
  const getChatId = (a, b) => [a, b].sort().join("_");

  // Load following users
  useEffect(() => {
    setUsers(followingUsers);
  }, [followingUsers]);

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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className={`flex-1 flex flex-col ${!showChatList ? 'block' : 'hidden sm:flex'}`}>
            {selectedUser ? (
              <>
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b">
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
                    <div>
                      <h3 className="font-medium">{selectedUser?.name}</h3>
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
                <div className="flex-1 overflow-y-auto">
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
                  </div>
                </div>

                {/* Message input */}
                <div className="p-4 border-t">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}