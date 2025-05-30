

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Layers,Users,Calendar,MessageSquare,Globe } from 'lucide-react'

export default function Home() {
  
  
  return (
      <div>
      {/* Hero Section */}
      <section className="min-h-screen sm:min-h-[80vh] relative flex items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 sm:px-6">
        <div className="container mx-auto py-12 sm:py-16 text-center">
          <Layers className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-4 sm:mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Welcome to GDG Social
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Connect with Google Developer Group members worldwide. Share knowledge,
            collaborate on projects, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/signup">Join the Community</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/50 px-4 sm:px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Everything you need to connect and grow
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-background p-4 sm:p-6 rounded-lg text-center">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Community</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect with developers who share your interests and passion
              </p>
            </div>
            <div className="bg-background p-4 sm:p-6 rounded-lg text-center">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Events</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover and join tech events, workshops, and meetups
              </p>
            </div>
            <div className="bg-background p-4 sm:p-6 rounded-lg text-center">
              <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Discussions</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Share knowledge and engage in meaningful tech discussions
              </p>
            </div>
            <div className="bg-background p-4 sm:p-6 rounded-lg text-center">
              <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Global Network</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Be part of a worldwide network of Google Developer Groups
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-bold mb-2">500+</p>
              <p className="text-base sm:text-lg text-muted-foreground">Active Communities</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-bold mb-2">50K+</p>
              <p className="text-base sm:text-lg text-muted-foreground">Global Members</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-bold mb-2">1000+</p>
              <p className="text-base sm:text-lg text-muted-foreground">Monthly Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-primary text-primary-foreground px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to get started?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join the GDG community today and connect with developers worldwide
          </p>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
    
  )
}
