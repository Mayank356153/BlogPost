

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Layers,Users,Calendar,MessageSquare,Globe } from 'lucide-react'

export default function Home() {
  
  
  return (
      <div>
      {/* Hero Section */}
      <section className="min-h-screen sm:min-h-[80vh] relative flex items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 sm:px-6">
        <div className="container py-12 mx-auto text-center sm:py-16">
          <Layers className="w-12 h-12 mx-auto mb-4 sm:h-16 sm:w-16 text-primary sm:mb-6" />
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl sm:mb-6">
            Welcome to GDG Social
          </h1>
          <p className="max-w-2xl px-4 mx-auto mb-6 text-lg sm:text-xl text-muted-foreground sm:mb-8">
            Connect with Google Developer Group members worldwide. Share knowledge,
            collaborate on projects, and grow together.
          </p>
          <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/signup">Join the Community</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

    
      <section className="px-4 py-12 sm:py-16 bg-muted/50 sm:px-6">
        <div className="container mx-auto">
          <h2 className="mb-8 text-2xl font-bold text-center sm:text-3xl sm:mb-12">
            Everything you need to connect and grow
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8">
            <div className="p-4 text-center rounded-lg bg-background sm:p-6">
              <Users className="w-8 h-8 mx-auto mb-3 sm:h-10 sm:w-10 text-primary sm:mb-4" />
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">Community</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect with developers who share your interests and passion
              </p>
            </div>
            <div className="p-4 text-center rounded-lg bg-background sm:p-6">
              <Calendar className="w-8 h-8 mx-auto mb-3 sm:h-10 sm:w-10 text-primary sm:mb-4" />
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">Events</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover and join tech events, workshops, and meetups
              </p>
            </div>
            <div className="p-4 text-center rounded-lg bg-background sm:p-6">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 sm:h-10 sm:w-10 text-primary sm:mb-4" />
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">Discussions</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Share knowledge and engage in meaningful tech discussions
              </p>
            </div>
            <div className="p-4 text-center rounded-lg bg-background sm:p-6">
              <Globe className="w-8 h-8 mx-auto mb-3 sm:h-10 sm:w-10 text-primary sm:mb-4" />
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">Global Network</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Be part of a worldwide network of Google Developer Groups
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="px-4 py-12 sm:py-16 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div className="p-4">
              <p className="mb-2 text-3xl font-bold sm:text-4xl">500+</p>
              <p className="text-base sm:text-lg text-muted-foreground">Active Communities</p>
            </div>
            <div className="p-4">
              <p className="mb-2 text-3xl font-bold sm:text-4xl">50K+</p>
              <p className="text-base sm:text-lg text-muted-foreground">Global Members</p>
            </div>
            <div className="p-4">
              <p className="mb-2 text-3xl font-bold sm:text-4xl">1000+</p>
              <p className="text-base sm:text-lg text-muted-foreground">Monthly Events</p>
            </div>
          </div>
        </div>
      </section>


      <section className="px-4 py-12 sm:py-16 bg-primary text-primary-foreground sm:px-6">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl sm:mb-6">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto mb-6 text-lg sm:text-xl sm:mb-8 opacity-90">
            Join the  community today and connect with developers worldwide
          </p>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
    
  )
}
