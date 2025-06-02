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
  Bookmark
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

export default function PostCard({post,onLike}){
    const [showComments,setShowComments]=useState(false)
     const toggleComments = () => {
    setShowComments((prev)=>!prev);
  };

  return(
     <div className="border rounded-lg bg-card">
      {/* Post Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar>
              {/* <img className="w-12" src={post.author.image} alt={post.author.name} /> */}
                          <AvatarImage src={post.author.image} width='50' alt={post.author.name} />

              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/profile/${post.author.username}`} className="font-medium hover:underline">
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              @{post.author.username} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
            <DropdownMenuItem>
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
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-3 overflow-hidden rounded-md">
            <img 
              src={post.images[0]} 
              alt="Post content" 
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        )}
        
        {/* Video */}
        {post.video && (
          <div className="rounded-md overflow-hidden relative pt-[56.25%] mb-3">
            <iframe
              src={post.video}
              className="absolute top-0 left-0 w-full h-full"
              title="Video content"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
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
            onClick={onLike}
          >
            <Heart 
              className={cn(
                "h-5 w-5",
                post.isLiked && "fill-destructive text-destructive"
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
            <span>{post.commentsCount}</span>
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
          <CommentSection postId={post.id} />
        </>
      )}
    </div>
  );
}