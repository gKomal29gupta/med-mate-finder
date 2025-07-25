import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Scan, 
  Loader2,
  CheckCircle,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ScanMedicine() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        medicine: "Paracetamol 500mg",
        brand: "Crocin",
        generic: "Acetaminophen",
        brandPrice: "₹25.00",
        genericPrice: "₹12.00",
        savings: "₹13.00",
        dosage: "500mg tablets",
        manufacturer: "GSK",
        description: "Pain reliever and fever reducer"
      });
      
      toast({
        title: "Scan Complete!",
        description: "Medicine identified successfully. Check generic alternatives below.",
      });
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleScan();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scan Medicine</h1>
        <p className="text-muted-foreground">
          Take a photo or upload an image of your medicine to find generic alternatives
        </p>
      </div>

      {/* Scan Interface */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Scan Medicine
            </CardTitle>
            <CardDescription>
              Use your camera or upload an image to identify medicines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <div>
                    <p className="font-medium">Scanning Medicine...</p>
                    <p className="text-sm text-muted-foreground">Processing image and identifying medicine</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Scan className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ready to Scan</p>
                    <p className="text-sm text-muted-foreground">Take a clear photo of the medicine package</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid gap-2 md:grid-cols-2">
              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                variant="medical"
                size="lg"
                className="w-full"
              >
                <Camera className="w-5 h-5" />
                {isScanning ? "Scanning..." : "Take Photo"}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="w-full relative"
                disabled={isScanning}
              >
                <Upload className="w-5 h-5" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isScanning}
                />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Scanning Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Clear Image Quality</p>
                  <p className="text-xs text-muted-foreground">Ensure good lighting and focus on the medicine name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Include Dosage</p>
                  <p className="text-xs text-muted-foreground">Make sure dosage information is visible</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Steady Hands</p>
                  <p className="text-xs text-muted-foreground">Keep the camera steady to avoid blur</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Multiple Angles</p>
                  <p className="text-xs text-muted-foreground">Try different angles if first scan doesn't work</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Results */}
      {scanResult && (
        <Card className="border-0 shadow-lg border-l-4 border-l-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Medicine Identified
            </CardTitle>
            <CardDescription>
              We found generic alternatives that can save you money
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Original Medicine */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Branded Medicine</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{scanResult.brand}</h3>
                  <p className="text-muted-foreground">{scanResult.medicine}</p>
                  <p className="text-sm text-muted-foreground">by {scanResult.manufacturer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{scanResult.brandPrice}</span>
                  <Badge variant="secondary">Brand Price</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scanResult.description}</p>
              </div>

              {/* Generic Alternative */}
              <div className="space-y-4 p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-success-foreground">Generic Alternative</Badge>
                  <Badge variant="outline" className="text-success border-success">
                    <DollarSign className="w-3 h-3" />
                    Save {scanResult.savings}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-success">{scanResult.generic}</h3>
                  <p className="text-muted-foreground">{scanResult.dosage}</p>
                  <p className="text-sm text-muted-foreground">Same active ingredient</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-success">{scanResult.genericPrice}</span>
                  <Badge variant="outline" className="text-success">Generic Price</Badge>
                </div>
                <p className="text-sm text-success/80">
                  Generic medicines have the same active ingredients and effectiveness as branded medicines
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button variant="medical" size="lg">
                Set Reminder
              </Button>
              <Button variant="outline" size="lg">
                Save to History
              </Button>
              <Button variant="outline" size="lg">
                Find Nearby Stores
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Info */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">About Generic Medicines</h4>
              <p className="text-sm text-muted-foreground">
                Generic medicines contain the same active ingredients as branded medicines and are equally effective. 
                They are typically 20-80% cheaper than branded versions.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Consult Your Doctor</h4>
              <p className="text-sm text-muted-foreground">
                Always consult with your healthcare provider before switching to generic alternatives, 
                especially for critical medications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}