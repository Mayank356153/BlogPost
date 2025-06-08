"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Users, ImagePlus, Clock } from 'lucide-react';
import {toast} from "sonner"
import { db } from '@/config/firebase';
import { useAuth } from "@/components/auth/auth-provider";
import { addDoc, collection } from "firebase/firestore";
import Upload from '@/helpers/upload';
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required"),
  type: z.enum(["online", "in-person", "hybrid"]),
  capacity: z.string().min(1, "Capacity is required").transform(Number),
  image:  z.any().refine((file) => file instanceof File, { message: "Image is required" })
});



export default function GroupEventCreateForm({ groupId, onSuccess } ){
  const [isSubmitting, setIsSubmitting] = useState(false);
   const {user}=useAuth()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "in-person" ,
      capacity: "",
      image: null,
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
       if(!user) return toast.error("You must be logged in to create an event.");
    console.log("Form values:", values);
        const imageUrl=await Upload(values.image)

        if (!imageUrl) {
      toast.error("Failed to upload image. Please try again.");
      return;
    }

    console.log("Uploaded image URL:", imageUrl);
        
      const eventDocRef = await addDoc(collection(db, "groups",groupId,"events"), {
  title: values.title,
  description: values.description,
  date: values.date,
  time: values.time,
  location: values.location,
  type: values.type,
  capacity: values.capacity,
  image: imageUrl,
  author: user,
  createdAt: new Date()
});
    
      
      
      console.log('Creating event for group:', groupId, values);
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
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
                  placeholder="Describe your event"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                    <Input type="date" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                    <Input type="time" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Enter location or meeting link"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="in-person">In Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Users className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Max attendees"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
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

        <div className="flex justify-end gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}