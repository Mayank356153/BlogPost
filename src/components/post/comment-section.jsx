"use client"

import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import {Avatar,AvatarImage,AvatarFallback} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { add, formatDistanceToNow, set } from "date-fns";
import {useAuth} from "@/components/auth/auth-provider"
import {Heart,Reply} from "lucide-react"
import {cn} from "@/lib/utils"
import { useId } from "react"
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { toast } from "sonner";

export default function CommentSection({post}){
    const {user}=useAuth();
    const[commentsView,setCommentsView]=useState(post.comments || [])
    const[newComment,setNewComment]=useState("")
        const[isSubmitting,setIsSubmitting]=useState(false)
const { currentUser} = useAuth(); // make sure it's inside your component
const id=useId()
  

const addCommentToPost = async () => {
  
  if (!currentUser) return;
  
  if (!newComment.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }

  try {

    console.log("Adding comment to post:", post);  
    
    const postRef = doc(db, `users/${post.author?.id}/posts/${post.post_id}`);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      alert("Post not found");
      toast.error("Post not found");
      return;
    }

    const newComments = {
      content: newComment,
      user_id: currentUser.uid,
      createdAt: new Date(),
      author: user,
      likesCount:[]
    };

    await updateDoc(postRef, {
      comments: arrayUnion(newComments),
    });
     setNewComment("");
    
    toast.success("Comment added!");
  } catch (err) {
    console.error("Error adding comment:", err);
    toast.error("Failed to add comment");
  }
};

useEffect(()=>setCommentsView(post.comments || []),[post.comments])
        



  // const handleLikeComment = (commentId) => {
  //   setComments(comments.map(comment => {
  //     if (comment.id === commentId) {
  //       const isLiked = !comment.isLiked;
  //       return {
  //         ...comment,
  //         isLiked,
  //         likesCount: isLiked ? comment.likesCount + 1 : comment.likesCount - 1,
  //       };
  //     }
  //     return comment;
  //   }));
  // };

  
  return(
    <div className="p-4">
         {/* Comment input */}
      {user && (
        <div className="flex gap-3 mb-6">
          <Avatar>
            <AvatarImage src={user.image ||  "/blank-profile-picture-973460_1280.webp"} referrerPolicy="no-referrer"  alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) ||"K"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 resize-none"
            />
            <Button 
              size="sm" 
              onClick={()=>addCommentToPost()}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </div>
      )}


        {/* Comments list */}
      <div className="space-y-6">
        {commentsView.map((comment) => (
          <div key={id} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author?.image ||  "/blank-profile-picture-973460_1280.webp"} alt={comment.author?.name || "ASd"} />
              <AvatarFallback>{comment.author?.name.charAt(0) || "gff"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium">{comment.author?.name ||"JJJ"}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    @{comment.author?.username || "JJ"}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <button 
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                  onClick={() => handleLikeComment(comment.id)}
                >
                  <Heart 
                    className={cn(
                      "h-3.5 w-3.5",
                      comment.isLiked && "fill-destructive text-destructive"
                    )} 
                  />
                  <span>{comment.likesCount.length}</span>
                </button>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt.toDate()), { addSuffix: true })}
                </span>
                <button className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Reply className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>



    </div>
  )
    
}  
