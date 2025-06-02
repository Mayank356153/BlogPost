"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, MapPin, Users } from "lucide-react";


// Mock event data
const mockEvent = {
  id: "1",
  title: "Flutter Forward Extended",
  date: "2025-05-15",
  time: "10:00 AM",
  location: "San Francisco, CA",
  image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};


export default function ConfirmationPage() {
  const params = useParams();

  return (
    <div className="container px-4 py-16 mx-auto">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="mb-2 text-3xl font-bold">Registration Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for registering for {mockEvent.title}. We look forward to seeing you there!
          </p>
        </div>

        <div className="p-6 mb-8 rounded-lg bg-muted/50">
          <div className="flex items-start gap-6">
            <img
              src={mockEvent.image}
              alt={mockEvent.title}
              className="object-cover w-32 h-32 rounded-lg"
            />
            <div className="text-left">
              <h2 className="mb-2 text-xl font-semibold">{mockEvent.title}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{mockEvent.date} at {mockEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{mockEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Your ticket has been confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address with additional details.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link href={`/events/${params.id}`}>
                Event Details
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}