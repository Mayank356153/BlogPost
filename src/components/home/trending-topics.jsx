"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
// Mock trending topics data
const trendingTopics = [
  { id: 1, name: "Flutter", count: 325 },
  { id: 2, name: "Firebase", count: 248 },
  { id: 3, name: "React", count: 211 },
  { id: 4, name: "Android", count: 189 },
  { id: 5, name: "TensorFlow", count: 176 },
];

export default function TrendingTopics(){

    const[topics,setTopics]=useState(trendingTopics)
    console.log(trendingTopics)
    return(
         <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-primary" />
          <CardTitle className="text-lg">Trending Topics</CardTitle>
        </div>
        <CardDescription>Popular topics in the community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Link href={`/topics/${topic.name.toLowerCase()}`} key={topic.id}>
              <Badge variant="secondary" className="px-3 py-1 text-sm hover:bg-secondary/80">
                #{topic.name}
                <span className="ml-1 text-xs text-muted-foreground">
                  {topic.count}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
    )
}