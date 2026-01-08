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

    // Fetch ALL active knowledge resources with full content
    const { data: resources, error: resourcesError } = await supabase
      .from("knowledge_resources")
      .select("title, content, category, media_type, media_url")
      .eq("is_active", true);

    if (resourcesError) {
      console.error("Error fetching resources:", resourcesError);
    }

    console.log("Loaded", resources?.length || 0, "knowledge resources");

    // Build comprehensive knowledge context
    let knowledgeContext = "";
    if (resources && resources.length > 0) {
      knowledgeContext = "\n\n## YOUR COMPLETE KNOWLEDGE BASE (USE ALL THIS DATA):\n";
      knowledgeContext += "You MUST use the information below to answer questions. This is your ONLY source of truth.\n\n";
      
      // Group by category for better organization
      const categories: Record<string, typeof resources> = {};
      resources.forEach((r) => {
        if (!categories[r.category]) categories[r.category] = [];
        categories[r.category].push(r);
      });

      for (const [category, items] of Object.entries(categories)) {
        knowledgeContext += `\n### Category: ${category.toUpperCase()}\n`;
        items.forEach((r) => {
          knowledgeContext += `\n**${r.title}**\n`;
          knowledgeContext += `${r.content}\n`;
          if (r.media_url) {
            knowledgeContext += `📎 Source/Media: ${r.media_url}\n`;
          }
        });
      }
      
      knowledgeContext += "\n\n---END OF KNOWLEDGE BASE---\n";
      knowledgeContext += "IMPORTANT: Answer questions using ONLY the above data. If asked about something not covered above, say it's not in your knowledge base.";
    }

    const systemPrompt = `You are Gaurav Gatha AI Guide - a knowledgeable digital guide for Gaurav Gatha – Karnah Border Heritage & Tourism Platform.

YOUR PURPOSE:
Educate, guide, and inform users about:
- Karnah Valley (Kupwara district, Jammu & Kashmir)
- Indian Army contribution and heritage
- Border history and geography
- Cultural heritage of the region
- Responsible tourism awareness

PLATFORM IDENTITY:
- Platform Name: Gaurav Gatha ("Pride Story" / "Veerata Ki Kahani")
- Developed by: Students of Army Goodwill Higher Secondary School, Hajinar
- Founders: Ubaid ur Rehman & Fazdha Mushtaq

HOW TO USE KNOWLEDGE BASE:
1. SEARCH the knowledge base below thoroughly for relevant information
2. COMBINE information from multiple entries when answering
3. PROVIDE comprehensive answers using ALL relevant data
4. If the user asks about a topic that IS in your knowledge base, give a DETAILED answer
5. ONLY say "not available" if the topic is genuinely NOT covered in ANY knowledge entry

RESPONSE FORMAT:
🔹 **Title** - Clear heading for the topic
🔹 **Explanation** - Detailed, well-structured information from your knowledge base
🔹 **Sources** - Mention PDF/document sources if available

CRITICAL RULES:
- NEVER say "Jai Hind" or any religious/nationalist greetings
- Use neutral greetings: "Hello!", "Welcome!", "Welcome to Gaurav Gatha!"
- Be helpful and provide as much relevant information as possible
- If information IS available, share it fully - don't hold back
- Only say "not in knowledge base" for genuinely missing topics
- For missing topics, say: "This information is not currently in my knowledge base. For more details, please DM us on Instagram: @aidevstudio.team"

ABOUT SECTION INFO:
Platform: Gaurav Gatha - Digital heritage, history & tourism platform
Founders: Ubaid ur Rehman & Fazdha Mushtaq
Institution: Army Goodwill Higher Secondary School, Hajinar
Instagram: @aidevstudio.team, @rooh_e_karnah

${knowledgeContext || "Note: Knowledge base is being populated. For detailed information, please DM @aidevstudio.team on Instagram."}`;

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
