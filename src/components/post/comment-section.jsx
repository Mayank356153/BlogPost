"use client"

import { useState } from "react"
import PropTypes from 'prop-types'
import {Avatar,AvatarImage,AvatarFallback} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import {useAuth} from "@/components/auth/auth-provider"
import {Heart,Reply} from "lucide-react"
import {cn} from "@/lib/utils"

// Mock comments data
const mockComments = {
  "1": [
    {
      id: "101",
      author: {
        id: "5",
        name: "Michael Scott",
        username: "michaels",
        image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      content: "Great work! Which packages did you use for the authentication UI?",
      createdAt: "2025-04-15T15:10:00Z",
      likesCount: 3,
      isLiked: false,
    },
    // ... (rest of the mock comments remain the same)
  ],
  // ... (other comment threads remain the same)
};

export default function CommentSection({postId}){
    const {user}=useAuth();
    const[comments,setComments]=useState(mockComments[postId] || [])
    const[newComment,setNewComment]=useState("")
        const[isSubmitting,setIsSubmitting]=useState(false)


         const handleCommentSubmit = async () => {
    if (!user || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: `new-${Date.now()}`,
        author: {
          id: user.id,
          name: user.name,
          username: user.username || user.email.split('@')[0],
          image: user.image,
        },
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        likesCount: 0,
        isLiked: false,
      };
      
      setComments([...comments, comment]);
      setNewComment("");
      setIsSubmitting(false);
    }, 500);
  };

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = !comment.isLiked;
        return {
          ...comment,
          isLiked,
          likesCount: isLiked ? comment.likesCount + 1 : comment.likesCount - 1,
        };
      }
      return comment;
    }));
  };
  return(
    <div className="p-4">
         {/* Comment input */}
      {user && (
        <div className="flex gap-3 mb-6">
          <Avatar>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
              onClick={handleCommentSubmit}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </div>
      )}


        {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.image} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium">{comment.author.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    @{comment.author.username}
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
                  <span>{comment.likesCount}</span>
                </button>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
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

CommentSection.PropTypes={
    postId:PropTypes.string.isRequired
}