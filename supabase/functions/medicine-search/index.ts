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
    const { searchQuery } = await req.json();
    
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

    console.log('Searching for medicine:', searchQuery);

    // Search in the existing Medicines table
    const { data: medicineData, error: medicineError } = await supabase
      .from('Medicines')
      .select('*')
      .ilike('name', `%${searchQuery}%`)
      .limit(10);

    if (medicineError) {
      console.error('Error searching medicines:', medicineError);
    }

    // Mock search results (in real implementation, you would search a comprehensive medicine database)
    const mockSearchResults = {
      found: true,
      medicine: {
        name: searchQuery,
        manufacturer: "Example Pharma",
        price: 40.00,
        type: "Tablet",
        pack_size: "10 tablets",
        composition: "Active ingredient details",
        dosage: "As directed by physician",
        side_effects: ["Nausea", "Dizziness", "Headache"],
        uses: ["Pain relief", "Fever reduction"],
        contraindications: ["Pregnancy", "Liver disease"]
      },
      generic_alternatives: [
        {
          name: `Generic ${searchQuery}`,
          manufacturer: "Generic Pharma",
          price: 25.00,
          savings: 15.00,
          type: "Tablet",
          availability: "Available"
        },
        {
          name: `Alternative ${searchQuery}`,
          manufacturer: "Health Plus",
          price: 22.00,
          savings: 18.00,
          type: "Tablet",
          availability: "Available"
        }
      ],
      database_results: medicineData || []
    };

    // Save search to database
    const { data: searchResult, error } = await supabase
      .from('medicine_searches')
      .insert({
        user_id: user.id,
        search_query: searchQuery,
        medicine_found: mockSearchResults.medicine,
        generic_alternatives: mockSearchResults.generic_alternatives
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      ...mockSearchResults,
      search_id: searchResult.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in medicine-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});