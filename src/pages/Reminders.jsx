import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Plus,
  Clock,
  Calendar,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const existingReminders = [
  {
    id: 1,
    medicine: "Metformin 500mg",
    time: "08:00",
    frequency: "Daily",
    dosage: "1 tablet",
    isActive: true,
    nextDue: "Tomorrow 8:00 AM",
    adherence: 95
  },
  {
    id: 2,
    medicine: "Vitamin D3",
    time: "20:00",
    frequency: "Weekly",
    dosage: "1 capsule",
    isActive: true,
    nextDue: "Sunday 8:00 PM",
    adherence: 88
  },
  {
    id: 3,
    medicine: "Blood Pressure Check",
    time: "09:00",
    frequency: "Daily",
    dosage: "Measurement",
    isActive: false,
    nextDue: "Paused",
    adherence: 76
  }
];

export default function Reminders() {
  const [reminders, setReminders] = useState(existingReminders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicine: "",
    time: "",
    frequency: "daily",
    dosage: ""
  });
  const { toast } = useToast();

  const handleAddReminder = () => {
    if (!newReminder.medicine || !newReminder.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in medicine name and time.",
        variant: "destructive"
      });
      return;
    }

    const reminder = {
      id: Date.now(),
      medicine: newReminder.medicine,
      time: newReminder.time,
      frequency: newReminder.frequency,
      dosage: newReminder.dosage || "1 tablet",
      isActive: true,
      nextDue: "Tomorrow " + newReminder.time,
      adherence: 100
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ medicine: "", time: "", frequency: "daily", dosage: "" });
    setShowAddForm(false);
    
    toast({
      title: "Reminder Added!",
      description: `Reminder set for ${newReminder.medicine} at ${newReminder.time}`,
    });
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "Reminder has been removed successfully.",
    });
  };

  const getAdherenceColor = (adherence) => {
    if (adherence >= 90) return "text-success";
    if (adherence >= 70) return "text-warning";
    return "text-destructive";
  };

  const getAdherenceLabel = (adherence) => {
    if (adherence >= 90) return "Excellent";
    if (adherence >= 70) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicine Reminders</h1>
          <p className="text-muted-foreground">
            Never miss your medication with personalized reminders
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="medical"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </Button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <Card className="border-0 shadow-lg border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Reminder
            </CardTitle>
            <CardDescription>
              Set up a new medication reminder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="medicine">Medicine Name</Label>
                <Input
                  id="medicine"
                  placeholder="e.g., Metformin 500mg"
                  value={newReminder.medicine}
                  onChange={(e) => setNewReminder({...newReminder, medicine: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 1 tablet"
                  value={newReminder.dosage}
                  onChange={(e) => setNewReminder({...newReminder, dosage: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({...newReminder, frequency: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-needed">As Needed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleAddReminder} variant="medical">
                Add Reminder
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reminder Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reminders.filter(r => r.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Average Adherence</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Reminders</h2>
        
        {reminders.map((reminder) => (
          <Card key={reminder.id} className={`border-0 shadow-lg transition-all ${
            reminder.isActive ? 'bg-card' : 'bg-muted/30'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    reminder.isActive ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Bell className={`w-6 h-6 ${
                      reminder.isActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{reminder.medicine}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reminder.time} - {reminder.frequency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {reminder.nextDue}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{reminder.dosage}</Badge>
                      <Badge variant="outline" className={getAdherenceColor(reminder.adherence)}>
                        {reminder.adherence}% - {getAdherenceLabel(reminder.adherence)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`reminder-${reminder.id}`} className="text-sm">
                      {reminder.isActive ? 'Active' : 'Paused'}
                    </Label>
                    <Switch
                      id={`reminder-${reminder.id}`}
                      checked={reminder.isActive}
                      onCheckedChange={() => toggleReminder(reminder.id)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reminder Tips */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Reminder Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Improve Adherence</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Link medication times to daily routines</li>
                <li>• Use pill organizers for multiple medicines</li>
                <li>• Set up family member notifications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take medicines at consistent times</li>
                <li>• Don't skip doses without consulting doctor</li>
                <li>• Keep backup reminders on your phone</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}