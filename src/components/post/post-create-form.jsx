"use client"
import openai from "@/config/openai"
import { useEffect, useState,useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from "uuid" // For unique filenames
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { Skeleton } from "../ui/skeleton";
import { getAuth } from 'firebase/auth';
// import { useForm } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/auth-provider';
import {toast} from 'sonner';
import { Badge } from '@/components/ui/badge';
import { X, ImagePlus, VideoIcon } from 'lucide-react';
import { db } from '@/config/firebase';
// import { addDoc } from 'firebase/firestore';
import Upload from '@/helpers/upload';  
import { Wand2 } from "lucide-react";
const formSchema = z.object({
  content: z.string().min(1, "Post content can't be empty").max(500, "Post content can't exceed 500 characters"),
});




export default function PostCreateForm(){
      
     const {reset}=useForm();
    const {user}=useAuth()
    const router=useRouter();
    const auth=getAuth()
      const [isSubmitting, setIsSubmitting] = useState(false);
 const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [mediaFiles, setMediaFiles] = useState([])
 const [suggestedTags, setSuggestedTags] = useState([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
 const imageInputRef = useRef(null)

 const generateTags = async () => {
  if (!content || typeof content !== "string" || content.trim().length < 10) {
    toast.error(
      <>
        <strong>Content too short</strong>
        <div>Please provide more content (at least 10 characters).</div>
      </>
    );
    return;
  }

  if (isGeneratingTags) return;

  setIsGeneratingTags(true);
  try {
    const res = await fetch("/pages/api/generate-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "API error");

    const newTags = data.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    setTags(newTags);
  } catch (error) {
    console.error("Tag generation error:", error);
    toast.error(
      <>
        <strong>AI Service Error</strong>
        <div>{error.message || "Failed to generate tags. Try again later."}</div>
      </>
    );
  } finally {
    setIsGeneratingTags(false);
  }
};

  

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      addMediaFile( file)
    }
  }

  useEffect(()=>console.log(mediaFiles),[mediaFiles])

  
  const form=useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
        content:""
    }
  })

  
  const content  = form.watch("content");


  const addTag=()=>{
    console.log(currentTag)
    
    if(currentTag && !tags.includes(currentTag)){
        setTags((prev)=>([
            ...prev,
            currentTag
        ]))
        
        setCurrentTag("")
    }
  }

  useEffect(()=>console.log(tags),[tags])
  const removeTag=(tag)=>{
            setTags((prev)=>prev.filter(tg=> tg!==tag))
  }

  const addMediaFile = async (file) => {
  if (!file) {
   
    toast.error(<>
      <strong>No file selected</strong>
      <div>Please choose a media file to upload.</div>
    </>)
    return;
  }

  setMediaFiles((prev) => [...prev, file]);

 
  toast.success(<> 
    <strong>Media added</strong>
    <div>{file.name} has been added to your post.</div>
  </>)
};


const removeFile = (fileNumber) => {
  setMediaFiles((prev) => prev.filter((_, index) => index !== fileNumber));
 toast(
  <div style={{ color: 'red' }}>
    <strong>Media removed</strong>
    <div>The selected media has been removed from the post.</div>
  </div>
);

  
};


 const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };
  



  
  
const onSubmit = async (data) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    setIsSubmitting(true);

    const mediaUrls = await Promise.all(
      mediaFiles.map(async (file) => await Upload(file))
    );
    
    
    console.log(mediaUrls)

    const newPost = {
      content: data.content,

      
      images: mediaUrls.flat(),
      
      createdAt: new Date(),
      
      userId: currentUser.uid, // or user.id
      likesCount:0,
      commentCount:0,
      sharesCount:0,
      isLiked:false,
      tags: tags.length > 0 ? tags : [],
      
    };

    console.log(newPost)
    const userPostsRef = collection(db, "users", currentUser.uid, "posts");

    // Add post to user's posts
    await addDoc(userPostsRef, newPost);

   toast.success(
  <>
    <strong>Post created</strong>
    <div>Your post has been saved under your profile.</div>
  </>
);


    

    setMediaFiles([]);
    reset();

  } catch (error) {
    console.error("Post creation error:", error);
   

    toast.error(<>
      <strong>Post creation failed</strong>
      <div>There was an error creating your post. Please try again.</div>
    </>)
  } finally {
    setIsSubmitting(false);
  }
};

  if(!user) return null;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.image || "/blank-profile-picture-973460_1280.webp"} alt={user.name}  referrerPolicy="no-referrer"/>
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Media preview */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative overflow-hidden border rounded-md">
                {['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'mpeg', '3gp'].includes(file.name.split('.').pop().toLowerCase()) ? (
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={URL.createObjectURL(file)}
                      loading="lazy"
                      className="absolute top-0 left-0 w-full h-full"
                      title="Video content"
                      frameBorder="0"
                      allow=" fullscreen; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Media preview" 
                    className="object-cover w-full h-auto aspect-video"
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute w-6 h-6 rounded-full top-1 right-1"
                  onClick={() => removeFile(index)}
                  type="button"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Tags */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="group">
                #{tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100"
                  onClick={() => removeTag(tag)}
                  type="button"
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            ))}
          </div>
          
          {content && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateTags}
                  disabled={isGeneratingTags || !content}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGeneratingTags ? "Generating..." : "Suggest Tags"}
                </Button>
              </div>
              
              {isGeneratingTags ? (
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-6" />
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="h-6 w-14" />
                </div>
              ) : suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => addTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag"
              className="flex w-full px-3 py-1 text-sm transition-colors border rounded-md shadow-sm h-9 border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="button" variant="outline" onClick={() => addTag(currentTag)}>
              Add
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
              <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
                onClick={() => handleImageClick()}
             >
              <ImagePlus className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleImageClick()}
             >
              <VideoIcon className="w-4 h-4 mr-2" />
              Video
            </Button>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 