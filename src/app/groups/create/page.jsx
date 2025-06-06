"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Users, ImagePlus, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import Upload from "@/helpers/upload";
import { db } from "@/config/firebase";
import { addDoc,collection } from "firebase/firestore";
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  type: z.enum(["public", "private"]),
  image: z.any().refine((file) => file instanceof File, { message: "Image is required" }),
  coverImage: z.any().refine((file) => file instanceof File, { message: "Cover Image is required" }),
});



const categories = [
  "Mobile Development",
  "Web Development",
  "Cloud Computing",
  "Machine Learning",
  "DevOps",
  "UI/UX Design",
  "Blockchain",
  "Security",
  "Data Science",
];



export default function CreateGroupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user,currentUser}=useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      type: "public",
      image: null,
      coverImage: null,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
       if(!user) return toast.error("You must be logged in to create an event.");
    console.log("Form values:", values);


     const imageUrl = await Upload(values.image);
     const coverImageUrl=await Upload(values.coverImage)
        if (!imageUrl || !coverImageUrl) {
      toast.error("Failed to upload image. Please try again.");
      return;
    }

    const topicRef=await addDoc(collection(db,"groups"),{
      name:values.name,
       description: values.description,
      category: values.category,
      type: values.type,
      image: imageUrl,
      coverImage: coverImageUrl,
      members:1,
      activity:{
        posts:0,
        events:0
      },
      admins:user,
      recentMembers:[],
    })

 console.log("Group created successfully:", topicRef);
   
    toast(
      <>
        <strong>Group created</strong>
        <div>Your group has been created successfully.</div>
      </>,
      { variant: "success" }
    );

    router.push("/groups");




     
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      

      

      toast.success(<>
      <strong>Group Created</strong>
      <div>
        Your group has been created successfully.
      </div>
      </>)
      
      router.push("/groups");
    } catch (error) {
     
      toast.error("Failed to create group. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Create New Group</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your group"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group privacy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field:{onChange,ref,name} }) => (
                <FormItem>
                  <FormLabel>Group Image URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ImagePlus className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                       <Input
            type="file"
            accept="image/*"
            className="pl-10"
            onChange={(e) => onChange(e.target.files?.[0])}
            ref={ref}
            name={name}
          />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field:{onChange,ref,name} }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ImagePlus className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                       <Input
            type="file"
            accept="image/*"
            className="pl-10"
            onChange={(e) => onChange(e.target.files?.[0])}
            ref={ref}
            name={name}
          />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}