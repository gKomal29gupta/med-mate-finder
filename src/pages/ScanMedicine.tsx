import { useState, useRef } from "react";
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
  DollarSign,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ScanMedicine() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        await processImage(blob);
      }
    }, 'image/jpeg', 0.8);
    
    stopCamera();
  };

  const processImage = async (file: Blob) => {
    setIsScanning(true);
    
    try {
      // Upload image to Supabase storage
      const fileName = `medicine-scan-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medicine-scans')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medicine-scans')
        .getPublicUrl(fileName);

      // Call OCR edge function
      const { data, error } = await supabase.functions.invoke('medicine-ocr', {
        body: { imageUrl: publicUrl }
      });

      if (error) throw error;

      // Set scan results
      setScanResult({
        medicine: data.medicine_name,
        brand: data.medicine_name,
        generic: data.generic_suggestions[0]?.name || 'Generic Alternative',
        brandPrice: `₹${(data.generic_suggestions[0]?.price + data.price_savings).toFixed(2)}`,
        genericPrice: `₹${data.generic_suggestions[0]?.price.toFixed(2)}`,
        savings: `₹${data.price_savings.toFixed(2)}`,
        dosage: data.extracted_text,
        manufacturer: data.generic_suggestions[0]?.manufacturer || 'Various',
        description: "Generic medicine with same active ingredients",
        confidence: data.confidence_score,
        scanId: data.scan_id
      });

      toast({
        title: "Scan Complete!",
        description: `Medicine identified with ${(data.confidence_score * 100).toFixed(1)}% confidence`,
      });

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to process image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
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

      {/* Camera View */}
      {showCamera && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Camera View
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={stopCamera}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-muted"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button 
                  onClick={capturePhoto}
                  disabled={isScanning}
                  size="lg"
                  className="bg-white/90 hover:bg-white text-foreground"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                onClick={startCamera} 
                disabled={isScanning || showCamera}
                variant="medical"
                size="lg"
                className="w-full"
              >
                <Camera className="w-5 h-5" />
                {showCamera ? "Camera Active" : "Take Photo"}
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