import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get the current user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    console.log('Processing image for OCR:', imageUrl);

    // Mock OCR processing (in real implementation, you would use a service like Google Vision API or AWS Textract)
    const mockExtractedText = "Paracetamol 500mg Tablets";
    const mockMedicineName = "Paracetamol";
    const mockConfidenceScore = 0.95;

    // Mock generic suggestions
    const mockGenericSuggestions = [
      {
        name: "Generic Paracetamol",
        manufacturer: "Generic Pharma",
        price: 25.00,
        savings: 15.00
      },
      {
        name: "Acetaminophen",
        manufacturer: "Health Plus",
        price: 22.00,
        savings: 18.00
      }
    ];

    // Save scan result to database
    const { data: scanResult, error } = await supabase
      .from('medicine_scans')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        extracted_text: mockExtractedText,
        detected_medicine_name: mockMedicineName,
        confidence_score: mockConfidenceScore,
        generic_suggestions: mockGenericSuggestions,
        price_savings: 18.00
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      extracted_text: mockExtractedText,
      medicine_name: mockMedicineName,
      confidence_score: mockConfidenceScore,
      generic_suggestions: mockGenericSuggestions,
      price_savings: 18.00,
      scan_id: scanResult.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in medicine-ocr function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});