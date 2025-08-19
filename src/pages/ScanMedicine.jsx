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
  const [scanResult, setScanResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const { toast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait for the video element to be available and set the stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
      
      toast({
        title: "Camera Ready",
        description: "Camera access granted. You can now take a photo.",
      });
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

  const processImage = async (file) => {
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

  const handleImageUpload = (event) => {
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
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            {showCamera ? "Take a Photo" : "Open Camera"}
          </CardTitle>
          <CardDescription>
            Use your camera to scan the medicine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showCamera && (
            <Button variant="outline" className="w-full" onClick={startCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Open Camera
            </Button>
          )}

          {showCamera && (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-md aspect-video"
                style={{ objectFit: 'cover' }}
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary">Live View</Badge>
                <Button variant="destructive" size="icon" onClick={stopCamera}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {showCamera && (
            <Button className="w-full" onClick={capturePhoto} disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Identifying Medicine...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upload Image */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload from Device
          </CardTitle>
          <CardDescription>
            Alternatively, upload an image from your computer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isScanning}
          />
        </CardContent>
      </Card>

      {/* Scan Result */}
      {scanResult && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" />
              Scan Result
            </CardTitle>
            <CardDescription>
              Details of the scanned medicine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold">{scanResult.medicine}</h3>
                <p className="text-muted-foreground">
                  {scanResult.description}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Scan ID: {scanResult.scanId}
                </Badge>
              </div>
              <div className="text-right">
                <Badge variant="success">
                  Confidence: {(scanResult.confidence * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-md font-semibold">Brand</h4>
                <p>{scanResult.brand}</p>
                <Badge variant="ghost">₹{scanResult.brandPrice}</Badge>
              </div>
              <div>
                <h4 className="text-md font-semibold">Generic Alternative</h4>
                <p>{scanResult.generic}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="ghost">₹{scanResult.genericPrice}</Badge>
                  <Badge variant="success">Save {scanResult.savings}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold">Dosage</h4>
              <p>{scanResult.dosage}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-md font-semibold">Manufacturer</h4>
                <p>{scanResult.manufacturer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scanning State */}
      {isScanning && (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="mr-4 h-6 w-6 animate-spin" />
            Scanning and identifying medicine...
          </CardContent>
        </Card>
      )}
    </div>
  );
}
