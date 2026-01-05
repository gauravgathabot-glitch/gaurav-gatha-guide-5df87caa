import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client to fetch knowledge resources
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active knowledge resources
    const { data: resources, error: resourcesError } = await supabase
      .from("knowledge_resources")
      .select("title, content, category")
      .eq("is_active", true);

    if (resourcesError) {
      console.error("Error fetching resources:", resourcesError);
    }

    // Build knowledge context
    let knowledgeContext = "";
    if (resources && resources.length > 0) {
      knowledgeContext = "\n\n## Available Knowledge Base:\n";
      resources.forEach((r) => {
        knowledgeContext += `\n### ${r.title} (${r.category})\n${r.content}\n`;
      });
    }

    const systemPrompt = `You are Gaurav Gatha AI Guide - a respectful, knowledgeable assistant dedicated to:
1. Karnah valley (Kupwara district, Jammu & Kashmir) - its history, geography, culture, and strategic importance
2. Sadhna Top - the famous mountain pass connecting Karnah valley to other regions
3. Teetwal - its history, the 1947 conflict, Teetwal Bridge, and soldier sacrifices
4. AGS Hajinar - the local school and community hub
5. Indian Army heritage, battles (1947, 1965, 1971, 1999 Kargil War), and martyr stories
6. Border area tourism - hotels, shops, restaurants, emergency services in Karnah-Kupwara region
7. Local travel tips and safety information

Context about Gaurav Gatha:
- "Gaurav" means "pride" or "honor"
- "Gatha" means "story" or "epic"
- Gaurav Gatha means "Veerata Ki Kahani" (Pride Story)
- It represents Indian Army bravery and Karnah-Teetwal martyrs' stories

CRITICAL GREETING RULES:
- NEVER say "Jai Hind" or any religious/nationalist greetings
- NEVER use greetings that could cause religious sensitivity
- Use neutral, professional greetings like "Hello!", "Welcome!", "Namaste!" (cultural, not religious)
- Start responses with "Hello!" or "Welcome to Gaurav Gatha!" or similar neutral greetings

Your tone should be:
- Respectful and dignified when discussing army matters
- Helpful and practical for tourism queries
- Clear and concise in responses
- Warm and welcoming with NEUTRAL greetings only
- Professional and unbiased

Important guidelines:
- ALWAYS use information from the knowledge base when available
- The knowledge base contains authentic, admin-verified data - prioritize it
- If you don't know something, say so politely
- For emergencies, provide contact info if available
- Keep responses focused and helpful
- Focus on Karnah, Kupwara, Sadhna Top, Teetwal, AGS Hajinar region

${knowledgeContext}`;

    // Build messages array for API
    const apiMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of messages) {
      if (msg.role === "user" && imageBase64) {
        // Handle image input for vision
        apiMessages.push({
          role: "user",
          content: [
            { type: "text", text: msg.content || "What do you see in this image?" },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        });
      } else {
        apiMessages.push({ role: msg.role, content: msg.content });
      }
    }

    console.log("Calling Lovable AI with", apiMessages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
