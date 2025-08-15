import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  TrendingDown,
  Star,
  MapPin,
  Clock,
  AlertTriangle,
  DollarSign,
  Pill
} from "lucide-react";

const searchSuggestions = [
  "Paracetamol", "Amoxicillin", "Metformin", "Aspirin", "Ibuprofen", 
  "Omeprazole", "Atorvastatin", "Lisinopril", "Vitamin D3", "Vitamin B12"
];

const searchResults = [
  {
    id: 1,
    brand: "Crocin 500mg",
    generic: "Acetaminophen 500mg",
    brandPrice: "₹25.00",
    genericPrice: "₹12.00",
    savings: "52%",
    rating: 4.5,
    manufacturer: "GSK",
    category: "Pain Relief",
    usage: "Fever, Headache, Body Pain",
    sideEffects: "Rare: Nausea, Allergic reactions",
    dosage: "1-2 tablets every 4-6 hours"
  },
  {
    id: 2,
    brand: "Amoxil 250mg",
    generic: "Amoxicillin 250mg",
    brandPrice: "₹120.00",
    genericPrice: "₹45.00",
    savings: "62%",
    rating: 4.7,
    manufacturer: "GSK",
    category: "Antibiotic",
    usage: "Bacterial Infections",
    sideEffects: "Common: Nausea, Diarrhea",
    dosage: "250-500mg every 8 hours"
  }
];

export default function SearchMedicine() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    setSearchTerm(term);
    
    // Simulate API call
    setTimeout(() => {
      setResults(searchResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search Medicine</h1>
        <p className="text-muted-foreground">
          Find generic alternatives and compare prices for your medicines
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for medicine name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchTerm);
                  }
                }}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button 
              onClick={() => handleSearch(searchTerm)}
              variant="medical"
              size="lg"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Suggestions */}
      {!results.length && !isSearching && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
            <CardDescription>
              Click on any medicine to search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results for "{searchTerm}"
            </h2>
            <Badge variant="secondary">
              {results.length} results found
            </Badge>
          </div>

          {results.map((medicine) => (
            <Card key={medicine.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Medicine Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{medicine.brand}</h3>
                        <p className="text-muted-foreground">{medicine.manufacturer}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{medicine.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{medicine.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Usage</h4>
                        <p className="text-sm">{medicine.usage}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Dosage</h4>
                        <p className="text-sm">{medicine.dosage}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Side Effects</h4>
                        <p className="text-sm text-warning">{medicine.sideEffects}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Comparison */}
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Branded</Badge>
                      </div>
                      <div className="text-2xl font-bold text-foreground">{medicine.brandPrice}</div>
                      <p className="text-sm text-muted-foreground">Original Price</p>
                    </div>

                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-success text-success-foreground">Generic</Badge>
                        <Badge variant="outline" className="text-success border-success">
                          <TrendingDown className="w-3 h-3" />
                          {medicine.savings} off
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-success">{medicine.genericPrice}</div>
                      <p className="text-sm text-success/80">{medicine.generic}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="medical" size="sm">
                        <Clock className="w-4 h-4" />
                        Set Reminder
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4" />
                        Find Stores
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pill className="w-4 h-4" />
                        More Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Important Notice */}
      <Card className="border-0 shadow-lg border-l-4 border-l-warning">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Medical Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider before starting, stopping, or changing your medication. 
            Generic medicines shown here have the same active ingredients as branded medicines but may have different inactive ingredients.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}