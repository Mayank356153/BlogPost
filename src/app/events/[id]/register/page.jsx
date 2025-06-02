"use client"

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, MapPin, Users } from "lucide-react";
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
import {toast} from "sonner";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
     name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dietary: z.string().optional(),
  notes: z.string().optional(),
});

// Mock event data
const mockEvent = {
  id: "1",
  title: "Flutter Forward Extended",
  description: "Join us for an extended session of Flutter Forward, where we'll dive deep into the latest Flutter features and best practices.",
  date: "2025-05-15",
  time: "10:00 AM",
  location: "San Francisco, CA",
  type: "hybrid",
  image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  attendees: 150,
  capacity: 200,
  price: "Free",
};

export default function EventRegisterPage() {
const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [event] = useState(mockEvent);

    const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dietary: "",
      notes: "",
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
     toast(
  <>
    <strong>Registration successful</strong>
    <div>You have successfully registered for the event.</div>
  </>,
  { variant: 'success' }
);

      
      router.push(`/events/${params.id}`);
    } catch (error) {
     toast(
  <>
    <strong>Registration failed</strong>
    <div>Failed to register for the event. Please try again.</div>
  </>,
  { variant: "destructive" }
);

    } finally {
      setIsSubmitting(false);
    }
  };

  return(
     <div className="container px-4 py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Event Registration</h1>
        
        {/* Event Details */}
        <div className="p-6 mb-8 rounded-lg bg-muted/50">
          <div className="flex items-start gap-6">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-32 h-32 rounded-lg"
            />
            <div>
              <h2 className="mb-2 text-xl font-semibold">{event.title}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{event.attendees} attending • {event.capacity - event.attendees} spots left</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{event.type}</Badge>
                <Badge variant="outline">{event.price}</Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dietary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Requirements</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Any dietary requirements? (Optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes or requirements? (Optional)"
                      {...field}
                    />
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
                {isSubmitting ? "Registering..." : "Register for Event"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )


}