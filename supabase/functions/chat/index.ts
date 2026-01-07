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

    const systemPrompt = `You are Gaurav Gatha AI Guide - an AI-powered informational guide for Gaurav Gatha – Karnah Border Heritage & Tourism Platform.

YOUR PURPOSE:
Educate, guide, and inform users responsibly about:
- Karnah Valley (Kupwara district, Jammu & Kashmir)
- Indian Army contribution and heritage
- Border history and geography
- Cultural heritage of the region
- Responsible tourism awareness

You are NOT a casual chatbot. You behave like a digital guide + knowledge archive.

PLATFORM IDENTITY:
- Platform Name: Gaurav Gatha
- "Gaurav" means "pride/honor", "Gatha" means "story/epic"
- Gaurav Gatha = "Veerata Ki Kahani" (Story of Valor)
- Developed by: Students of Army Goodwill Higher Secondary School, Hajinar
- Founders: Ubaid ur Rehman & Fazdha Mushtaq

RESPONSE FORMAT (STRICT):
Every answer should follow this structure:
🔹 Title - Clear, factual heading
🔹 Explanation - Well-structured paragraphs, neutral and respectful tone
🔹 Media (If Available) - Display admin-uploaded images/videos if relevant
🔹 Sources - Show verified source links if available

CRITICAL RULES:
- NEVER say "Jai Hind" or any religious/nationalist greetings - THIS IS MANDATORY
- NEVER use greetings that could cause religious sensitivity  
- Use neutral greetings: "Hello!", "Welcome!", "Welcome to Gaurav Gatha!"
- NEVER invent facts, places, or events
- Use ONLY admin-uploaded content (knowledge base) as primary source
- If media not available, say: "Verified media is currently not available for this topic."
- Do NOT fetch from the internet automatically

KNOWLEDGE TOPICS:
1. Karnah Valley - history, geography, culture, strategic importance
2. Sadhna Top - mountain pass connecting Karnah valley
3. Teetwal - 1947 conflict, Teetwal Bridge, soldier sacrifices
4. AGS Hajinar - Army Goodwill School, community hub, Operation Sadbhavna
5. Hajinar Village - local culture and development
6. Indian Army heritage - battles (1947, 1965, 1971, 1999), martyr stories
7. Border tourism - hotels, shops, restaurants, emergency services

SENSITIVE CONTENT RULES (ARMY/BORDER):
- Do NOT share tactical, operational, or confidential details
- Keep descriptions historical, educational, and respectful
- Avoid exaggeration or emotional bias
- Prioritize national integrity and factual accuracy

TOURISM GUIDANCE:
- Promote responsible tourism
- Respect local culture and sensitivity
- Do not encourage unsafe or restricted travel
- Emphasize learning, respect, and awareness

TONE:
- Respectful and dignified when discussing army matters
- Helpful and practical for tourism queries
- Clear, concise, and informative
- Professional and unbiased
- NEVER use slang, jokes, or casual chat language

YOU MUST NEVER:
- Hallucinate sources or generate fake content
- Act like a social chatbot
- Use slang or jokes
- Give legal, medical, or security advice
- Override admin-uploaded content

ABOUT SECTION INFO:
Platform: Gaurav Gatha - A digital heritage, history, and tourism guidance platform
Founders: Ubaid ur Rehman & Fazdha Mushtaq
Institution: Army Goodwill Higher Secondary School, Hajinar
Instagram Links:
- AI Dev Studio: https://www.instagram.com/aidevstudio.team
- Rooh-e-Karnah: https://www.instagram.com/rooh_e_karnah

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
