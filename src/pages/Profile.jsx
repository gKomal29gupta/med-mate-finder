import { useState, useEffect } from "react";
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
  Phone,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, updateProfile, getDisplayName, getAge } = useUserProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalConditions: [],
    allergies: []
  });
  
  const [notifications, setNotifications] = useState({
    medicationReminders: true,
    priceAlerts: true,
    healthTips: false,
    systemUpdates: true
  });

  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.date_of_birth || "",
        emergencyContactName: profile.emergency_contact_name || "",
        emergencyContactPhone: profile.emergency_contact_phone || "",
        medicalConditions: profile.medical_conditions || [],
        allergies: profile.allergies || []
      });
      
      if (profile.notification_preferences) {
        setNotifications({
          medicationReminders: profile.notification_preferences.reminder ?? true,
          priceAlerts: profile.notification_preferences.price_alerts ?? true,
          healthTips: profile.notification_preferences.health_tips ?? false,
          systemUpdates: profile.notification_preferences.system_updates ?? true
        });
      }
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      full_name: profileData.name,
      phone: profileData.phone,
      date_of_birth: profileData.dateOfBirth || null,
      emergency_contact_name: profileData.emergencyContactName || null,
      emergency_contact_phone: profileData.emergencyContactPhone || null,
      medical_conditions: profileData.medicalConditions,
      allergies: profileData.allergies,
      notification_preferences: {
        reminder: notifications.medicationReminders,
        price_alerts: notifications.priceAlerts,
        health_tips: notifications.healthTips,
        system_updates: notifications.systemUpdates
      }
    });
    
    if (success) {
      setIsEditing(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    setNotifications({ ...notifications, [key]: value });
  };

  const stats = {
    medicinesScanned: 47,
    totalSavings: 2340,
    remindersSet: 12,
    adherenceRate: 87
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
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
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={(e) => setProfileData({...profileData, emergencyContactName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={profileData.emergencyContactPhone}
                    onChange={(e) => setProfileData({...profileData, emergencyContactPhone: e.target.value})}
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
              <h3 className="font-bold text-lg">{getDisplayName()}</h3>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              {getAge() && (
                <Badge variant="outline" className="mt-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  Age {getAge()}
                </Badge>
              )}
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