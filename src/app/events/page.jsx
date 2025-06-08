"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/components/auth/auth-provider";
import {toast} from "sonner";





export default function EventsPage() {
const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
    const Router = useRouter();
  const { user } = useAuth(); 
    
     useEffect(() => {

      if(!user){
        toast.error("You must be logged in to view events.");
        Router.push("/login");
        return;
      }
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
      console.log("Events data:", eventsData);
    });

    return () => unsubscribe(); 
  }, []);


  const isRegistered=(eventId)=>{
    console.log("Checking registration for u:", events)
    const eventExists = events.find(event => event.id === eventId);
const alreadyRegistered = eventExists.attendeesList?.some(
  attendee => attendee.userId === user.id
);
    return alreadyRegistered ? true : false;
    }



   return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => Router.push("/events/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => Router.push("/events/filter")}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Event tab */}
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="overflow-hidden border rounded-lg group">
                <div className="relative">
                  <img
                    src={event.image }  
                    alt={event.title}
                    className="object-cover w-full h-48"
                  />
                  <Badge
                    className="absolute top-4 right-4"
                    variant={event.type === "online" ? "secondary" : "default"}
                  >
                    {event.type}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {event.title}
                  </h3>
                  
                  <p className="mb-4 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{event.attendees || 0} attending</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={event.author.image || "/blank-profile-picture-973460_1280.webp"}
                        alt={event.author.name}
                        className="w-6 h-6 mr-2 rounded-full"
                      />
                      <span className="text-sm text-muted-foreground">
                        {event.author.name}
                      </span>
                    </div>
                    <Button disabled={isRegistered(event.id)} onClick={()=>Router.push(`/events/${event.id}/register`)}>
                      {isRegistered(event.id) ? "Registered" : "Register"}
                      {
                        isRegistered(event.id) ? null : <ExternalLink className="w-4 h-4 ml-2" />
                      }
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="py-12 text-center text-muted-foreground">
            No past events to display
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="py-12 text-center text-muted-foreground">
            No saved events
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );



}