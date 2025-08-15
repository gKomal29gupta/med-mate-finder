import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  History as HistoryIcon,
  Search,
  Scan,
  Bell,
  Filter,
  Download,
  TrendingDown,
  Calendar,
  Clock
} from "lucide-react";

const historyData = [
  {
    id: 1,
    type: "scan",
    medicine: "Paracetamol 500mg",
    brand: "Crocin",
    generic: "Acetaminophen",
    savings: "₹13.00",
    date: "2024-01-15",
    time: "2:30 PM"
  },
  {
    id: 2,
    type: "search",
    medicine: "Amoxicillin 250mg",
    brand: "Amoxil",
    generic: "Generic Amoxicillin",
    savings: "₹75.00",
    date: "2024-01-14",
    time: "10:15 AM"
  },
  {
    id: 3,
    type: "reminder",
    medicine: "Metformin 500mg",
    action: "Reminder Set",
    date: "2024-01-13",
    time: "9:00 AM"
  },
  {
    id: 4,
    type: "scan",
    medicine: "Vitamin D3 60000 IU",
    brand: "Drise",
    generic: "Cholecalciferol",
    savings: "₹25.00",
    date: "2024-01-12",
    time: "4:45 PM"
  },
  {
    id: 5,
    type: "search",
    medicine: "Omeprazole 20mg",
    brand: "Omez",
    generic: "Generic Omeprazole",
    savings: "₹18.00",
    date: "2024-01-11",
    time: "11:20 AM"
  }
];

export default function History() {
  const [history, setHistory] = useState(historyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSavings = history
    .filter(item => item.savings)
    .reduce((total, item) => total + parseFloat(item.savings!.replace('₹', '')), 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scan": return <Scan className="w-4 h-4" />;
      case "search": return <Search className="w-4 h-4" />;
      case "reminder": return <Bell className="w-4 h-4" />;
      default: return <HistoryIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scan": return "bg-primary/20 text-primary";
      case "search": return "bg-secondary/20 text-secondary";
      case "reminder": return "bg-warning/20 text-warning";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "scan": return "Scanned";
      case "search": return "Searched";
      case "reminder": return "Reminder";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity History</h1>
          <p className="text-muted-foreground">
            Track your medicine searches, scans, and savings over time
          </p>
        </div>
        <Button variant="outline" size="lg">
          <Download className="w-5 h-5" />
          Export History
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <HistoryIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{history.length}</p>
                <p className="text-sm text-muted-foreground">Total Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalSavings.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Scan className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{history.filter(h => h.type === 'scan').length}</p>
                <p className="text-sm text-muted-foreground">Medicines Scanned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{history.filter(h => h.type === 'search').length}</p>
                <p className="text-sm text-muted-foreground">Searches Made</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search medicine name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All
              </Button>
              <Button
                variant={filterType === "scan" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("scan")}
              >
                <Scan className="w-4 h-4" />
                Scans
              </Button>
              <Button
                variant={filterType === "search" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("search")}
              >
                <Search className="w-4 h-4" />
                Searches
              </Button>
              <Button
                variant={filterType === "reminder" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("reminder")}
              >
                <Bell className="w-4 h-4" />
                Reminders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Activity Timeline</h2>
          <Badge variant="secondary">
            {filteredHistory.length} items shown
          </Badge>
        </div>

        {filteredHistory.map((item) => (
          <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{item.medicine}</h3>
                      <Badge variant="outline">{getTypeBadge(item.type)}</Badge>
                    </div>
                    
                    {item.brand && item.generic && (
                      <div className="text-sm text-muted-foreground">
                        <span>{item.brand} → {item.generic}</span>
                        {item.savings && (
                          <Badge variant="outline" className="ml-2 text-success border-success">
                            Saved {item.savings}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {item.action && (
                      <p className="text-sm text-muted-foreground">{item.action}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                  {item.type !== "reminder" && (
                    <Button variant="ghost" size="sm">
                      Search Again
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredHistory.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Activities Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Start scanning or searching medicines to see your activity here"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Savings Insights</CardTitle>
          <CardDescription>
            Your medicine cost optimization journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">₹{totalSavings.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Total Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                ₹{totalSavings > 0 ? (totalSavings / history.filter(h => h.savings).length).toFixed(0) : '0'}
              </p>
              <p className="text-sm text-muted-foreground">Average per Medicine</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">
                {history.filter(h => h.savings).length}
              </p>
              <p className="text-sm text-muted-foreground">Medicines with Savings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}