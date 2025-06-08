"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {toast} from "sonner"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Shield,
  User,
  Globe,
  Mail,
  Lock,
  Trash2,
  Upload,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
     

      toast.success(<>
        <strong>Settings saved!</strong>
        <div>Your changes have been saved successfully.</div>
      </>)
    } catch (error) {
     

      toast.error(<>
        <strong>Error saving settings</strong>
        <div>There was an issue saving your settings. Please try again later.</div>
      </>)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(<>
        <strong>Password reset email sent!</strong>
        <div>Check your email for instructions to reset your password.</div>
      </>)
    } catch (error) {
     


      toast.error(<>
        <strong>Error sending reset email</strong>
        <div>There was an issue sending the password reset email. Please try again later.</div>
      </>)
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      
      toast.error("Please enter your email correctly to confirm deletion.")
      return;
    }

    try {
      

      toast.success(<>
        <strong>Account deleted successfully!</strong>
        <div>Your account and all associated data have been removed.</div>
      </>)
      router.push("/");
    } catch (error) {
    
      toast.error(<>
        <strong>Error deleting account</strong>
        <div>There was an issue deleting your account. Please try again later.</div>
      </>)
     } finally {
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>

        <div className="grid gap-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input defaultValue={user?.name} />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea 
                    defaultValue={user?.bio}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input defaultValue="San Francisco, CA" />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input placeholder="https://example.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Account Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue={user?.email} type="email" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your password or reset it if forgotten
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleSendPasswordReset}>
                    Reset Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Protect your account with 2FA</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive email notifications about your activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive push notifications about your activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Monthly Newsletter</p>
                    <p className="text-xs text-muted-foreground">
                      Receive our monthly newsletter with updates
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle>Privacy Settings</CardTitle>
              </div>
              <CardDescription>
                Control your privacy and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Profile Visibility</p>
                    <p className="text-xs text-muted-foreground">
                      Make your profile visible to everyone
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Show Online Status</p>
                    <p className="text-xs text-muted-foreground">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm">Activity Status</p>
                    <p className="text-xs text-muted-foreground">
                      Show your activity status to others
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="mb-4 text-sm text-muted-foreground">
                          To confirm, please enter your email address: <strong>{user?.email}</strong>
                        </p>
                        <Input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setShowDeleteDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}