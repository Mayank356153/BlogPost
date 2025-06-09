"use client"

import { useState } from "react";
import PropTypes from 'prop-types';
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageSquare, 
  Share, 
  MoreHorizontal,
  Bookmark,
   ChevronLeft,
  ChevronRight,
  Play
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import  CommentSection  from "@/components/post/comment-section";
import { cn } from "@/lib/utils";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import { db } from "@/config/firebase";
import { toast } from "sonner";
import {motion, AnimatePresence} from "framer-motion";
import { useRef,useEffect } from "react";
export default function PostCard({post,group=false,groupId=""}){
    const [showComments,setShowComments]=useState(false)
const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const galleryRef = useRef(null);
  const videoRefs = useRef([]);

  // Handle drag start (mouse or touch)
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX - (galleryRef.current?.offsetLeft || 0));
    setScrollLeft(galleryRef.current?.scrollLeft || 0);
    
    // Pause all videos when dragging starts
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
  };

  // Handle drag movement
  const handleDragMove = (e) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - (galleryRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Reduced multiplier for smoother dragging
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle drag end and snap to nearest slide
  const handleDragEnd = () => {
    setIsDragging(false);
    if (!galleryRef.current) return;

    const containerWidth = galleryRef.current.clientWidth;
    const scrollPosition = galleryRef.current.scrollLeft;
    const imageIndex = Math.round(scrollPosition / containerWidth);
    
    // Ensure index stays within bounds
    const clampedIndex = Math.max(0, Math.min(imageIndex, post.images.length - 1));
    setCurrentMediaIndex(clampedIndex);
    
    // Smooth scroll to the selected image
    galleryRef.current.scrollTo({
      left: clampedIndex * containerWidth,
      behavior: 'smooth'
    });
  };

  // Update current index on scroll
  const handleScroll = () => {
    if (!galleryRef.current || isDragging) return;
    const containerWidth = galleryRef.current.clientWidth;
    const scrollPosition = galleryRef.current.scrollLeft;
    const index = Math.round(scrollPosition / containerWidth);
    setCurrentMediaIndex(index);
  };

  // Auto-play current video when index changes
  useEffect(() => {
    if (videoRefs.current[currentMediaIndex]) {
      const currentVideo = videoRefs.current[currentMediaIndex];
      const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].some(ext => 
        post.images[currentMediaIndex]?.toLowerCase().endsWith(ext)
      );
      
      if (isVideo) {
        currentVideo.play().catch(e => console.log('Autoplay prevented:', e));
      }
    }
  }, [currentMediaIndex, post.images]);

  // Set up scroll listener
  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      gallery.addEventListener('scroll', handleScroll, { passive: true });
      return () => gallery.removeEventListener('scroll', handleScroll);
    }
  }, []);
    
     const toggleComments = () => {
    setShowComments((prev)=>!prev);
  };



const { currentUser } = useAuth(); // make sure it's inside your component



const handleLike = async (postId, targetUserId) => {
  if (!currentUser) return;
  
let postRef;
  if(!group){
     postRef = doc(db, `users/${targetUserId}/posts/${postId}`);
  }else{
    postRef=doc(db,"groups",groupId,"posts",post.id)
  }
   if (!postRef) {
      console.error("Post reference not found");
      return;
    }
  try {
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) return;
    
    const postData = postSnap.data();
    
    console.log(postData)
    
    const likedBy = postData.likedBy || [];
    
    const isLiked = likedBy.includes(currentUser.uid);
    
    // Update in Firestore
    await updateDoc(postRef, {
      likedBy: isLiked
        ? arrayRemove(currentUser.uid)
        : arrayUnion(currentUser.uid),
      likesCount: isLiked
        ? (postData.likesCount || 0) - 1
        : (postData.likesCount || 0) + 1,
    });

    
    

    toast.success(`Post ${isLiked ? "unliked" : "liked"} successfully`);
  } catch (err) {
    console.error("Error updating like:", err);
    toast.error("Something went wrong.");
  }
};


const handleSavedPost = async (postId, targetUserId) => {
 try {
   if(!currentUser) return;
     const currerentUSerRef=doc(db,"users",currentUser.uid);
     if(!group){
       await updateDoc(currerentUSerRef,{
       savedPosts: arrayUnion(doc(db, `users/${targetUserId}/posts/${postId}`))
     });
     }
     else{
       await updateDoc(currerentUSerRef,{
       savedPosts: arrayUnion(doc(db, `groups/${groupId}/posts/${postId}`))
     });
     }
    
 
     toast.success("Post saved successfully");
 } catch (error) {
  
    console.error("Error saving post:", error);
    toast.error("Failed to save post");
  
 }
}

  return(
     <div className="border rounded-lg bg-card">
      {/* Post Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post?.author?.username}`}>
            <Avatar>
                          <AvatarImage   referrerPolicy="no-referrer" src={post.author?.image || "/blank-profile-picture-973460_1280.webp"} width='50' alt={post.author?.name} />

              <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${post.author?.username}`} className="font-medium hover:underline">
              {post.author?.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              @{post.author.username} · {formatDistanceToNow(new Date(post.createdAt?.toDate()), { addSuffix: true })}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSavedPost(post.post_id, post.author.id)}>  
              <Bookmark className="w-4 h-4 mr-2" />
              Save post
            </DropdownMenuItem>
            <DropdownMenuItem>
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Post Content */}
      <div className="px-4 mb-4">
        <p className="mb-3 whitespace-pre-line">{post.content}</p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Link href={`/topics/${tag.toLowerCase()}`} key={tag}>
                <Badge variant="outline" className="text-sm">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        
          {/* Media Gallery */}
        {post.images && post.images.length > 0 && (
         <div className="relative mb-3 overflow-hidden bg-black rounded-lg">
      <div
        ref={galleryRef}
className="flex overflow-x-auto snap-x snap-mandatory touch-pan-x hide-scrollbar"
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE
          '&::-webkit-scrollbar': { // Chrome/Safari
            display: 'none',
            width: 0,
            height: 0,
            background: 'transparent'
          }
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        // style={{ scrollBehavior: isDragging ? 'unset' : 'smooth' }}
      >
        {post.images?.map((file, index) => (
          <div key={index} className="relative flex-none w-full snap-center">
            {['mp4', 'mov', 'avi', 'mkv', 'webm'].some(ext => 
              file?.toLowerCase().endsWith(ext)
            ) ? (
              <div className="relative pt-[56.25%]">
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={file}
                  controls
                  playsInline
                  className="absolute top-0 left-0 object-contain w-full h-full bg-black"
                  loop
                  muted
                />
              </div>
            ) : (
              <img 
                src={file} 
                alt={`Media ${index + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain bg-black"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        ))}
      </div>

      {/* Media counter dots */}
      {post.images.length > 1 && (
        <div className="absolute left-0 right-0 flex justify-center bottom-4">
          <div className="flex gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-sm">
            {post.images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (galleryRef.current) {
                    galleryRef.current.scrollTo({
                      left: index * galleryRef.current.clientWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  className={cn(
                    "w-2 h-2 rounded-full bg-white/80",
                    index === currentMediaIndex && "bg-white"
                  )}
                  animate={{
                    opacity: index === currentMediaIndex ? 1 : 0.6,
                    scale: index === currentMediaIndex ? 1.3 : 1
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
        )}
        
       
      </div>
      
      {/* Actions */}
      <div className="px-4 pb-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={()=>handleLike(post.post_id, post.author.id)}
          >
           <Heart 
  className={cn(
    "h-5 w-5 transition-colors duration-200",
    post.likedBy?.includes(currentUser?.uid) && "fill-destructive text-destructive"
  )}
/>

            <span>{post.likesCount}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={toggleComments}
          >
            <MessageSquare className="w-5 h-5" />
            <span>{post.comments?.length || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Share className="w-5 h-5" />
            <span>{post.sharesCount}</span>
          </Button>
        </div>
      </div>
      
      {/* Comments */}
      {showComments && (
        <>
          <Separator />
          <CommentSection post={post}  group={true} groupId={groupId}/>
        </>
      )}
    </div>
  );
}