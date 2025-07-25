import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Edit,
  Save,
  Bell,
  Shield,
  Heart,
  Award,
  Calendar,
  Mail,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    age: "45",
    emergencyContact: "+91 9876543211",
    medicalConditions: ["Diabetes Type 2", "Hypertension"],
    allergies: ["Penicillin", "Shellfish"]
  });
  
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    priceAlerts: true,
    healthTips: false,
    systemUpdates: true
  });

  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const stats = {
    medicinesScanned: 47,
    totalSavings: 2340,
    remindersSet: 12,
    adherenceRate: 87
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Button 
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          variant={isEditing ? "medical" : "outline"}
          size="lg"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive" />
                Medical Information
              </CardTitle>
              <CardDescription>
                Important health information for better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Medical Conditions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.medicalConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-destructive border-destructive">
                      {condition}
                      {isEditing && (
                        <button className="ml-2 text-xs">×</button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      + Add Condition
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Allergies</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="text-warning border-warning">
                      {allergy}
                      {isEditing && (
                        <button className="ml-2 text-xs">×</button>
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      + Add Allergy
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified when it's time to take your medicine</p>
                  </div>
                  <Switch
                    checked={notifications.medicationReminders}
                    onCheckedChange={(value) => handleNotificationChange('medicationReminders', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications about better prices and generic alternatives</p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(value) => handleNotificationChange('priceAlerts', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Health Tips</Label>
                    <p className="text-sm text-muted-foreground">Weekly health tips and medicine information</p>
                  </div>
                  <Switch
                    checked={notifications.healthTips}
                    onCheckedChange={(value) => handleNotificationChange('healthTips', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Important app updates and feature announcements</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(value) => handleNotificationChange('systemUpdates', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-bold text-lg">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <Badge variant="outline" className="mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                Age {profileData.age}
              </Badge>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Medicines Scanned</span>
                  <span className="font-bold">{stats.medicinesScanned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Savings</span>
                  <span className="font-bold text-success">₹{stats.totalSavings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Reminders</span>
                  <span className="font-bold">{stats.remindersSet}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Adherence Rate</span>
                  <span className="font-bold text-primary">{stats.adherenceRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Contacts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}