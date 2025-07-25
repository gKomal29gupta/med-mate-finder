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
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing reminder notifications...');

    // Get current time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Find active reminders that need to be sent
    const { data: activeReminders, error: reminderError } = await supabase
      .from('reminders')
      .select(`
        *,
        profiles!inner(email, full_name, notification_preferences)
      `)
      .eq('is_active', true)
      .lte('start_date', currentDate)
      .or(`end_date.is.null,end_date.gte.${currentDate}`)
      .contains('specific_times', [currentTime]);

    if (reminderError) {
      throw reminderError;
    }

    console.log(`Found ${activeReminders?.length || 0} reminders to process`);

    // Process each reminder
    for (const reminder of activeReminders || []) {
      try {
        // Check if notification already sent today for this time
        const { data: existingLog } = await supabase
          .from('reminder_logs')
          .select('id')
          .eq('reminder_id', reminder.id)
          .eq('scheduled_time', `${currentDate}T${currentTime}:00.000Z`)
          .single();

        if (existingLog) {
          console.log(`Notification already sent for reminder ${reminder.id}`);
          continue;
        }

        // Create reminder log
        const { error: logError } = await supabase
          .from('reminder_logs')
          .insert({
            reminder_id: reminder.id,
            user_id: reminder.user_id,
            scheduled_time: `${currentDate}T${currentTime}:00.000Z`,
            status: 'pending'
          });

        if (logError) {
          console.error('Error creating reminder log:', logError);
          continue;
        }

        // Send notification (in a real implementation, you would integrate with email/SMS services)
        console.log(`Sending notification for ${reminder.medicine_name} to ${reminder.profiles.email}`);
        
        // Here you would integrate with services like:
        // - Resend for email
        // - Twilio for SMS
        // - Push notification services
        
        console.log(`Notification sent for reminder: ${reminder.medicine_name} - ${reminder.dosage}`);

      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed_reminders: activeReminders?.length || 0,
      timestamp: now.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in reminder-notifications function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});