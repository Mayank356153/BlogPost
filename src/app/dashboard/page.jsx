"use client"


import FeedContainer from "@/components/feed/feed-container"
import  PostCreateButton  from '@/components/post/post-create-button';
import WelcomeBanner from '@/components/home/welcome-banner';
import  TrendingTopics  from '@/components/home/trending-topics';
import  SuggestedUsers  from '@/components/home/suggested-user';
import { useAuth } from '@/components/auth/auth-provider';
import { redirect } from 'next/navigation';



export default function DashboardPage() {
  const {user}=useAuth();
  if(!user){
    redirect('/login')
    return(null)
  }

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 sm:py-8">
      <WelcomeBanner />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Main content */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="sticky top-[4.5rem] z-10 bg-background/80 backdrop-blur-sm pb-4 flex items-center justify-between border-b mb-6">
            <h2 className="text-xl font-bold sm:text-2xl">Your Feed</h2>
            <PostCreateButton />
          </div>
          <FeedContainer />
        </div>

        {/* Sidebar */}
        <div className="order-1 w-full lg:w-80 lg:order-2">
          <div className="sticky top-[4.5rem] space-y-6">
            <TrendingTopics />
            <SuggestedUsers />
          </div>
        </div>
      </div>
    </div>
  )
}
