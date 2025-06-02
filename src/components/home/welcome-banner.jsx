"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarPlus, Users } from 'lucide-react';

export default function WelcomeBanner(){
    const {user}= useAuth()
    if(!user){
            return (
      <div className="w-full p-6 mb-8 border rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold">Welcome to GDG Social</h1>
          <p className="mb-6 text-muted-foreground">
            Connect with Google Developer Group members, share your knowledge, and stay updated with the latest events and technologies.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Join the community</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
    }

    return(
        <div className="w-full p-6 mb-8 border rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">Welcome back, {user.name}!</h1>
        <p className="mb-6 text-muted-foreground">
          What would you like to share with the GDG community today?
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/create-post">
              Create a post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/events">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Upcoming events
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/groups">
              <Users className="w-4 h-4 mr-2" />
              Your groups
            </Link>
          </Button>
        </div>
      </div>
    </div>
    )
}