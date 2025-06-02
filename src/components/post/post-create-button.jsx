"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/auth-provider';
import  PostCreateForm  from '@/components/post/post-create-form';

export default function PostCreateButton() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline-block">Create Post</span>
          <span className="sm:hidden">Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            Share your thoughts, ideas, and media with the GDG community.
          </DialogDescription>
        </DialogHeader>
        <PostCreateForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}