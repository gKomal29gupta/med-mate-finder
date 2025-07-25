import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scan, 
  Search, 
  Pill, 
  Clock, 
  TrendingUp,
  Camera,
  History,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

const recentActivity = [
  {
    id: 1,
    type: "scan",
    medicine: "Paracetamol 500mg",
    generic: "Acetaminophen",
    savings: "₹45",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "search",
    medicine: "Amoxicillin 250mg",
    generic: "Generic Amoxicillin",
    savings: "₹120",
    time: "1 day ago",
  },
  {
    id: 3,
    type: "reminder",
    medicine: "Metformin 500mg",
    action: "Reminder set",
    time: "2 days ago",
  },
];

const upcomingReminders = [
  {
    id: 1,
    medicine: "Metformin 500mg",
    time: "2:00 PM",
    type: "Daily",
  },
  {
    id: 2,
    medicine: "Vitamin D3",
    time: "8:00 PM",
    type: "Weekly",
  },
  {
    id: 3,
    medicine: "Blood Pressure Check",
    time: "9:00 AM",
    type: "Tomorrow",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground">
            Track your medicines and save money with generic alternatives
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="medical" size="lg">
            <Link to="/scan">
              <Camera className="w-5 h-5" />
              Scan Medicine
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Medicines Scanned"
          value={47}
          description="This month"
          icon={Scan}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Savings"
          value="₹2,340"
          description="With generic alternatives"
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Reminders"
          value={12}
          description="Set for this week"
          icon={Bell}
        />
        <StatCard
          title="Search History"
          value={89}
          description="Medicines searched"
          icon={History}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest scans and searches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'scan' ? 'bg-primary/20 text-primary' :
                    activity.type === 'search' ? 'bg-secondary/20 text-secondary' :
                    'bg-accent/20 text-accent'
                  }`}>
                    {activity.type === 'scan' && <Scan className="w-4 h-4" />}
                    {activity.type === 'search' && <Search className="w-4 h-4" />}
                    {activity.type === 'reminder' && <Bell className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.medicine}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.generic || activity.action}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.savings && (
                    <Badge variant="secondary" className="mb-1">
                      Saved {activity.savings}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/history">
                View All Activity
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Upcoming Reminders
            </CardTitle>
            <CardDescription>
              Don't miss your medication schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-warning/20 text-warning rounded-full flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{reminder.medicine}</p>
                    <p className="text-xs text-muted-foreground">{reminder.type}</p>
                  </div>
                </div>
                <Badge variant="outline">{reminder.time}</Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/reminders">
                Manage Reminders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used features for easy access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-2">
              <Link to="/scan">
                <Camera className="w-6 h-6" />
                Scan Medicine
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-2">
              <Link to="/search">
                <Search className="w-6 h-6" />
                Search Medicine
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 flex-col gap-2">
              <Link to="/reminders">
                <Bell className="w-6 h-6" />
                Set Reminder
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}