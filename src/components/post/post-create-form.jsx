"use client"

import { useEffect, useState,useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid" // For unique filenames
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { getAuth } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, ImagePlus, VideoIcon } from 'lucide-react';
import { db } from '@/config/firebase';
import { addDoc } from 'firebase/firestore';

const formSchema = z.object({
  content: z.string().min(1, "Post content can't be empty").max(500, "Post content can't exceed 500 characters"),
});

export default function PostCreateForm(){
    const {user}=useAuth()
    const{toast}=useToast()
    const auth=getAuth()
      const [isSubmitting, setIsSubmitting] = useState(false);
 const [tags, setTags] = useState([[]])
  const [currentTag, setCurrentTag] = useState("")
  const [mediaFiles, setMediaFiles] = useState([])

 const imageInputRef = useRef(null)

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

  const addMediaFile=async(file)=>{
    if(!file) return;

const storage=getStorage();
          const filename=`${uuidv4()}-${file.name}`
        const storageRef=ref(storage,`images/${filename}`)
        
        const snapshot=await uploadBytes(storageRef,file)
        const downloadURL=await getDownloadURL(snapshot.ref)
        console.log(downloadURL)
        console.log(contentTags)



    
    setMediaFiles((prev)=>[
        ...prev,
         file
    ])
    toast({
      
      message: "Your media has been added to the post.",
    });
  }

  const removeFile=(fileNumber)=>{
    setMediaFiles((prev)=>prev.filter(index=> index!== fileNumber))
  }

 const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };
  
  const onSubmit=async(data)=>{
    if(!user) return ;
    try {
      ALERT("A")
        setIsSubmitting(true)
          const contentTags = data.content.match(/#(\w+)/g)?.map(tag => tag.substring(1)) || [];

          const storage=getStorage();
          const filename=`${uuidv4()}-${file.name}`
        const storageRef=ref(storage,`images/${filename}`)
        
        const snapshot=await uploadBytes(storageRef,mediaFiles[0])
        const downloadURL=await getDownloadURL(snapshot.ref)
        console.log(downloadURL)
        console.log(contentTags)
        // const formData={
        //     content:data,
        //     createdAt:new Date(),
        //     likesCount:0,
        //     commentsCount:0,
        //     sharesCount:0,
        //     tags:tags
        // }
        // const currentUser=auth.currentUser
        // const userId=user.uid
        // const postRef=collection(db,"users",userId,"posts")
        
        // const docRef=await addDoc(postRef,formData)
        
        
        
        
    } catch (error) {
         toast({
        variant: "destructive",
        title: "Failed to create post",
        description: "There was an error publishing your post. Please try again.",
      });
    }
    finally{
        setIsSubmitting(false)
    }
  }

  if(!user) return null;
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar>
            {/* <AvatarImage src={user.image} alt={user.name} /> */}
            <AvatarImage src={user.image} width='50' alt={user.name} />
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
                {file.type.includes('video') ? (
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={URL.createObjectURL(file)}
                      className="absolute top-0 left-0 w-full h-full"
                      title="Video content"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
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
            {tags.length>0 && tags?.map((tag) => (
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
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag"
              className="flex w-full px-3 py-1 text-sm transition-colors border rounded-md shadow-sm h-9 border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="button" variant="outline" onClick={addTag}>
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