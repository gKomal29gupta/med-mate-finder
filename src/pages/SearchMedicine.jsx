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
      setResults([
        {
          id: 1,
          medicine: term,
          brand: "Generic Brand",
          generic: "Generic " + term,
          savings: "₹25.00",
          rating: 4.5,
          location: "Local Pharmacy",
          time: "5 min",
          isAvailable: true,
          price: "₹75.00"
        },
        {
          id: 2,
          medicine: term,
          brand: "Brand Name",
          generic: "Generic " + term,
          savings: "₹15.00",
          rating: 3.8,
          location: "Online Pharmacy",
          time: "2 days",
          isAvailable: false,
          price: "₹90.00"
        }
      ]);
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
      {searchTerm === "" && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
            <CardDescription>
              Quickly find common medicines
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Search Results</h2>
            <Badge variant="secondary">{results.length} results</Badge>
          </div>
          
          {results.map((result) => (
            <Card key={result.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{result.medicine}</h3>
                    <div className="text-sm text-muted-foreground">
                      <span>{result.brand} → {result.generic}</span>
                      {result.savings && (
                        <Badge variant="outline" className="ml-2 text-success border-success">
                          Saved {result.savings}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>{result.rating} Rating</span>
                      <MapPin className="w-4 h-4" />
                      <span>{result.location} ({result.time})</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">{result.price}</p>
                    {result.isAvailable ? (
                      <Badge variant="ghost" className="text-success">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchTerm !== "" && results.length === 0 && !isSearching && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or check for spelling errors.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Search Tips</CardTitle>
          <CardDescription>
            Get the best results when searching for medicines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Be Specific</h4>
              <p className="text-sm text-muted-foreground">
                Include the dosage and form (e.g., "Amoxicillin 250mg capsules").
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Check Spelling</h4>
              <p className="text-sm text-muted-foreground">
                Make sure the medicine name is spelled correctly.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Try Generic Names</h4>
              <p className="text-sm text-muted-foreground">
                Search for the active ingredient if you can't find the brand name.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Use Synonyms</h4>
              <p className="text-sm text-muted-foreground">
                Medicines can have multiple names; try different variations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
