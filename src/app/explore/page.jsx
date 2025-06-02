"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Calendar, Hash } from "lucide-react";
// import {Post} from "@/components/feed/feed-container"
import  PostCard  from "@/components/post/post-card";


const mockPosts = [
  {
    id: "e1",
    author: {
      id: "1",
      name: "Tech Explorer",
      username: "techexplorer",
      image: "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "Just discovered an amazing new feature in TensorFlow 2.0! Check out my tutorial on implementing custom training loops. #MachineLearning #TensorFlow",
    images: [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    createdAt: "2025-04-16T10:30:00Z",
    likesCount: 45,
    commentsCount: 12,
    sharesCount: 8,
    isLiked: false,
    tags: ["MachineLearning", "TensorFlow", "Tutorial"],
  },
  {
    id: "e2",
    author: {
      id: "2",
      name: "Cloud Native",
      username: "cloudnative",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "Here's my comprehensive guide to deploying microservices with Kubernetes and Istio. Includes practical examples and best practices! #Kubernetes #CloudNative",
    createdAt: "2025-04-15T15:45:00Z",
    likesCount: 67,
    commentsCount: 23,
    sharesCount: 15,
    isLiked: true,
    tags: ["Kubernetes", "CloudNative", "Microservices"],
  },
];

const topics = [
  { name: "Flutter", posts: 1234, followers: 5678 },
  { name: "Machine Learning", posts: 987, followers: 4321 },
  { name: "Cloud Computing", posts: 765, followers: 3456 },
  { name: "Web Development", posts: 543, followers: 2345 },
  { name: "Android", posts: 432, followers: 1987 },
];


const people = [
  {
    name: "Sarah Chen",
    username: "sarahchen",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    bio: "ML Engineer | GDG Organizer",
    followers: 1234,
  },
  {
    name: "Alex Kumar",
    username: "alexk",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    bio: "Flutter Developer | Tech Writer",
    followers: 987,
  },
];



export default function ExplorePage() {
const [searchQuery,setSearchQuery]=useState("") 
const [posts, setPosts] = useState(mockPosts);

const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
        };
      }
      return post;
    }));
  };

   return (
    <div className="container px-4 py-8 mx-auto">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Explore</h1>
        <div className="relative">
          <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search posts, topics, or people..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="trending">
        <TabsList className="mb-8">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="topics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.name}
                className="p-4 transition-colors border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{topic.name}</h3>
                  </div>
                  <Button variant="outline" size="sm">Follow</Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{topic.posts.toLocaleString()} posts</p>
                  <p>{topic.followers.toLocaleString()} followers</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="people">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <div
                key={person.username}
                className="p-4 transition-colors border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">@{person.username}</p>
                      </div>
                      <Button variant="outline" size="sm">Follow</Button>
                    </div>
                    <p className="mt-2 text-sm">{person.bio}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {person.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );


}