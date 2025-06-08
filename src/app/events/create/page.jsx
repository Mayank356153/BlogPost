"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, MapPin, Users, ImagePlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Upload from "@/helpers/upload";
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
import {toast} from "sonner";
import { db } from "@/config/firebase";
import { useAuth } from "@/components/auth/auth-provider";
import { addDoc, collection } from "firebase/firestore";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string(),
  time: z.string(),
  location: z.string().min(3, "Location is required"),
  type: z.enum(["online", "in-person", "hybrid"]),
  capacity: z.string().transform(Number),
  image: z.any().refine((file) => file instanceof File, { message: "Image is required" })
});



export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user}=useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "in-person",
      capacity: "",
      image: null,
    },
  });

 const onSubmit = async (values) => {
  setIsSubmitting(true);
  try {
    if(!user) return toast.error("You must be logged in to create an event.");
    console.log("Form values:", values);

    const imageUrl = await Upload(values.image);
    if (!imageUrl) {
      toast.error("Failed to upload image. Please try again.");
      return;
    }

    console.log("Uploaded image URL:", imageUrl);

   
    const eventDocRef = await addDoc(collection(db, "events"), {
  title: values.title,
  description: values.description,
  date: values.date,
  time: values.time,
  location: values.location,
  type: values.type,
  capacity: values.capacity,
  attendees:0,
  image: imageUrl,
  author: user,
  createdAt: new Date()
});

   console.log("Event created successfully:", eventDocRef);
   
    toast(
      <>
        <strong>Event created</strong>
        <div>Your event has been created successfully.</div>
      </>,
      { variant: "success" }
    );

    router.push("/events");
  } catch (error) {
    console.error("Event creation error:", error);
    toast.error("Failed to create event. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Create New Event</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="min-h-[100px]"
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
                        placeholder="Maximum number of attendees"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            
            
          <FormField
  control={form.control}
  name="image"
  render={({ field: { onChange, ref, name } }) => (
    <FormItem>
      <FormLabel>Cover Image</FormLabel>
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
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}