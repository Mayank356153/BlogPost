"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ImagePlus,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Mail
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  github: z.string().min(2, "GitHub username must be at least 2 characters").or(z.string().length(0)),
  linkedin: z.string().min(2, "LinkedIn username must be at least 2 characters").or(z.string().length(0)),
  twitter: z.string().min(2, "Twitter username must be at least 2 characters").or(z.string().length(0)),
  email: z.string().email("Please enter a valid email address"),
});



export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.image || "");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      location: "San Francisco, CA",
      website: "",
      github: "",
      linkedin: "",
      twitter: "",
      email: user?.email || "",
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
     

      toast.success(<>
        <strong>Profile Updated</strong>
        <div>
          Your profile has been updated successfully.
        </div>
      </>)
      
      router.push("/profile");
    } catch (error) {
     


      toast.error(<>
        <strong>Update Failed</strong>
        <div>
          There was an error updating your profile. Please try again later. 
        </div>
      </>)
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Edit Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a new profile picture or keep your current one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="avatar-upload"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("avatar-upload").click()}
                    >
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Your location" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                          <Input className="pl-10" type="email" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                          <Input className="pl-10" placeholder="https://example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Github className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Your GitHub username" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Linkedin className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Your LinkedIn username" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Twitter className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Your Twitter username" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}