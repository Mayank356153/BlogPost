"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import PostCard from "@/components/post/post-card";


// Mock saved posts data
const mockSavedPosts= [
  {
    id: "1",
    author: {
      id: "1",
      name: "Emma Thompson",
      username: "emmadev",
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "A comprehensive guide to implementing authentication in Flutter apps using Firebase. Includes code examples and best practices! #Flutter #Firebase #Authentication",
    images: [
      "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    createdAt: "2025-04-15T14:30:00Z",
    likesCount: 42,
    commentsCount: 7,
    sharesCount: 3,
    isLiked: true,
    tags: ["Flutter", "Firebase", "Authentication"],
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Alex Kumar",
      username: "alexk",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    content: "Deep dive into Kubernetes operators: how to build, deploy, and manage them effectively. Check out the full tutorial on my blog! #Kubernetes #CloudNative #DevOps",
    createdAt: "2025-04-14T18:45:00Z",
    likesCount: 35,
    commentsCount: 12,
    sharesCount: 8,
    isLiked: false,
    tags: ["Kubernetes", "CloudNative", "DevOps"],
  },
];

export default function SavedPage() {
  const [posts, setPosts] = useState(mockSavedPosts);
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Saved Items</h1>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search saved items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="all">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="py-12 text-center text-muted-foreground">
            No saved articles
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="py-12 text-center text-muted-foreground">
            No saved media
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}