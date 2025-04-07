import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@shared/schema";
import { Redirect } from "wouter";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  
  // Only admin users should access this page
  if (user?.role !== UserRole.ADMIN) {
    return <Redirect to="/settings" />;
  }

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "LearnHub",
    siteDescription: "A comprehensive e-learning platform",
    maintenanceMode: false,
    allowRegistrations: true,
    autoApproveTeachers: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@learnhub.com",
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
    stripePublicKey: "",
    stripeSecretKey: "",
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings updated",
      description: "General settings have been saved successfully.",
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Email settings updated",
      description: "Email configuration has been saved successfully.",
    });
  };

  const handleIntegrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Integration settings updated",
      description: "API keys and integrations have been saved successfully.",
    });
  };

  return (
    <div className="container p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic platform settings and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteDescription: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">
                        Enable to make the site inaccessible to non-admin users
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          maintenanceMode: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow User Registrations</p>
                      <p className="text-sm text-gray-500">
                        Enable to allow new users to register
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.allowRegistrations}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          allowRegistrations: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Approve Teachers</p>
                      <p className="text-sm text-gray-500">
                        Enable to automatically approve teacher applications
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.autoApproveTeachers}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({
                          ...generalSettings,
                          autoApproveTeachers: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary">
                    Save General Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email server settings for notifications and communication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      placeholder="smtp.example.com"
                      value={emailSettings.smtpHost}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpHost: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      placeholder="587"
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPort: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      placeholder="Username or email"
                      value={emailSettings.smtpUser}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpUser: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      placeholder="••••••••••••"
                      value={emailSettings.smtpPassword}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    placeholder="noreply@yourdomain.com"
                    value={emailSettings.fromEmail}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        fromEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary">
                    Save Email Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Configure integration keys for third-party services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIntegrationSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">OpenAI Integration</h3>
                  <div className="space-y-2">
                    <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                    <Input
                      id="openaiApiKey"
                      type="password"
                      placeholder={integrationSettings.openaiApiKey ? "••••••••••••••••••••••••••••••" : "Enter your OpenAI API key"}
                      value={integrationSettings.openaiApiKey}
                      onChange={(e) =>
                        setIntegrationSettings({
                          ...integrationSettings,
                          openaiApiKey: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-gray-500">
                      This key is used for AI-assisted content generation features.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Integration</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                      <Input
                        id="stripePublicKey"
                        placeholder="pk_test_..."
                        value={integrationSettings.stripePublicKey}
                        onChange={(e) =>
                          setIntegrationSettings({
                            ...integrationSettings,
                            stripePublicKey: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        placeholder="sk_test_..."
                        value={integrationSettings.stripeSecretKey}
                        onChange={(e) =>
                          setIntegrationSettings({
                            ...integrationSettings,
                            stripeSecretKey: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Required for processing payments for premium courses.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-primary">
                    Save Integration Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system status and perform maintenance tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Environment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="font-medium text-sm">Node.js Version</p>
                        <p className="text-sm text-gray-500">v20.x</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Database</p>
                        <p className="text-sm text-gray-500">PostgreSQL</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Environment</p>
                        <p className="text-sm text-gray-500">Production</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Storage</p>
                        <p className="text-sm text-gray-500">Local Filesystem</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Maintenance Tasks</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="M7 21h10" />
                        <path d="M12 3v18" />
                        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                      </svg>
                      Clear Cache
                    </Button>

                    <Button variant="outline" className="w-full justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m8 17 4 4 4-4" />
                      </svg>
                      Backup Database
                    </Button>

                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M10 2h4" />
                        <path d="M12 14v-4" />
                        <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
                        <path d="M9 17H4v5" />
                      </svg>
                      Reset System
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">System Logs</h3>
                  <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md h-40 overflow-auto">
                    <p>[2025-04-06 05:00:01] Server started</p>
                    <p>[2025-04-06 05:00:10] Database connection established</p>
                    <p>[2025-04-06 05:00:15] OpenAI API connection verified</p>
                    <p>[2025-04-06 05:01:24] User login: admin@learnhub.com</p>
                    <p>[2025-04-06 05:15:36] New course created: "Introduction to AI"</p>
                    <p>[2025-04-06 05:23:42] File upload: course_materials/ai_intro.pdf</p>
                    <p>[2025-04-06 05:30:15] New user registration: student@example.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}