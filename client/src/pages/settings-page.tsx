import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@shared/schema";

export default function SettingsPage() {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profilePicUrl: user?.profilePicUrl || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    newMessages: true,
    marketingEmails: false,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement password change logic
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    });
  };

  // Admin-specific settings
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="container p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        rows={4}
                        value={profileForm.bio}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            bio: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profilePicUrl">Profile Picture URL</Label>
                      <Input
                        id="profilePicUrl"
                        placeholder="URL to your profile picture"
                        value={profileForm.profilePicUrl}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            profilePicUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="mb-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={
                            profileForm.profilePicUrl ||
                            `https://ui-avatars.com/api/?name=${profileForm.firstName}+${profileForm.lastName}&background=3B82F6&color=fff&size=128`
                          }
                          alt={`${profileForm.firstName} ${profileForm.lastName}`}
                        />
                        <AvatarFallback>
                          {profileForm.firstName.charAt(0)}
                          {profileForm.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Profile visibility depends on your role. Admin and teacher profiles
                      are visible to students.
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Current role: {user?.role}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Your current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Your new password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control which notifications you receive from the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Course Updates</p>
                    <p className="text-sm text-gray-500">
                      Get notified when your courses are updated
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.courseUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("courseUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Messages</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications for new messages
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newMessages}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("newMessages", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">
                      Receive promotions and marketing information
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("marketingEmails", checked)
                    }
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    className="bg-primary"
                    onClick={() => {
                      toast({
                        title: "Settings saved",
                        description: "Your notification preferences have been updated.",
                      });
                    }}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings and defaults.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Platform Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-gray-500">
                            Enable maintenance mode to prevent user logins
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New User Registrations</p>
                          <p className="text-sm text-gray-500">
                            Allow new users to register on the platform
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto Approve Teachers</p>
                          <p className="text-sm text-gray-500">
                            Automatically approve new teacher applications
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Default Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultCourseStatus">Default Course Status</Label>
                        <select
                          id="defaultCourseStatus"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coursesPerPage">Courses Per Page</Label>
                        <Input
                          id="coursesPerPage"
                          type="number"
                          min="5"
                          max="50"
                          defaultValue="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">API Configuration</h3>
                    <div className="space-y-2">
                      <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                      <Input
                        id="openaiApiKey"
                        type="password"
                        placeholder="••••••••••••••••••••••••••••••"
                      />
                      <p className="text-xs text-gray-500">
                        This key is used for AI content generation features.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      className="bg-primary"
                      onClick={() => {
                        toast({
                          title: "Settings saved",
                          description: "Platform settings have been updated.",
                        });
                      }}
                    >
                      Save Admin Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}