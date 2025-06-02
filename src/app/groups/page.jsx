"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Plus,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
const mockGroups = [
  {
    id: "1",
    name: "Flutter Developers",
    description: "A community of Flutter enthusiasts sharing knowledge and best practices for cross-platform development.",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 1500,
    type: "public",
    category: "Mobile Development",
    activity: {
      posts: 230,
      events: 12,
    },
    recentEvent: {
      title: "Flutter Forward Extended",
      date: "2025-05-15",
    },
  },
  {
    id: "2",
    name: "Cloud Native Developers",
    description: "Discussing cloud architecture, Kubernetes, and modern infrastructure patterns.",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    members: 2300,
    type: "public",
    category: "Cloud Computing",
    activity: {
      posts: 345,
      events: 8,
    },
    recentEvent: {
      title: "Kubernetes Workshop",
      date: "2025-06-01",
    },
  },
];


export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState(mockGroups);
  const router = useRouter();
  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Groups</h1>
        <Button onClick={() => router.push("/groups/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Search groups..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Group tabs */}
      <Tabs defaultValue="my-groups">
        <TabsList className="mb-8">
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups">
          <div className="grid gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="overflow-hidden transition-colors border rounded-lg hover:bg-muted/50"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Group image */}
                  <div className="w-full h-48 md:w-64 md:h-auto">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Group content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="mb-1 text-xl font-semibold">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{group.members.toLocaleString()} members</span>
                          <Badge variant="secondary">{group.type}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => router.push(`/groups/${group.id}`)}>
                        View Group
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <p className="mb-4 text-muted-foreground">
                      {group.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{group.category}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Posts</p>
                        <p className="font-medium">{group.activity.posts}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Events</p>
                        <p className="font-medium">{group.activity.events}</p>
                      </div>
                      {group.recentEvent && (
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Next Event</p>
                          <p className="font-medium">{group.recentEvent.date}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover">
          <div className="py-12 text-center text-muted-foreground">
            Discover new groups based on your interests
          </div>
        </TabsContent>

        <TabsContent value="invites">
          <div className="py-12 text-center text-muted-foreground">
            No pending invites
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
