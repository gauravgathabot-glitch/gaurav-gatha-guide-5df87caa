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

    // Fetch active knowledge resources (our ONLY allowed knowledge source)
    const { data: resources, error: resourcesError } = await supabase
      .from("knowledge_resources")
      .select("title, content, category, media_type, media_url, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    if (resourcesError) {
      console.error("Error fetching resources:", resourcesError);
    }

    console.log("Loaded", resources?.length || 0, "knowledge resources");

    // Build a SMALL, RELEVANT context (avoid sending the whole database to the model)
    const normalize = (s: string) => (s || "").toLowerCase();

    const lastUserText = [...(messages || [])]
      .reverse()
      .find((m: any) => m?.role === "user")?.content as string | undefined;

    const prevUserText = [...(messages || [])]
      .reverse()
      .slice(1)
      .find((m: any) => m?.role === "user")?.content as string | undefined;

    const isFollowUp = (t: string) => {
      const x = normalize(t).trim();
      if (!x) return false;
      if (x.length > 30) return false;
      const follow = [
        "aur batao",
        "or batao",
        "aur btao",
        "more",
        "tell me more",
        "details",
        "detail",
        "aage",
        "further",
      ];
      return follow.some((p) => x.includes(p));
    };

    const effectiveQuery =
      lastUserText && isFollowUp(lastUserText) && prevUserText
        ? `${prevUserText}\n\n(User is asking to elaborate further)`
        : (lastUserText || "");

    const tokens = normalize(effectiveQuery)
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean)
      .filter((w) => w.length > 2)
      .slice(0, 24);

    const scored = (resources || []).map((r: any) => {
      const title = normalize(r.title);
      const cat = normalize(r.category);
      const content = normalize(r.content);
      let score = 0;
      for (const tok of tokens) {
        if (title.includes(tok)) score += 8;
        if (cat.includes(tok)) score += 3;
        if (content.includes(tok)) score += 1;
      }
      return { r, score };
    });

    const selectedResources = scored
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.r);

    const contextResources = selectedResources.length > 0
      ? selectedResources
      : (resources || []).slice(0, 6);

    let knowledgeContext = "";
    if (contextResources.length > 0) {
      knowledgeContext += "\n\n## VERIFIED KNOWLEDGE (USE THIS ONLY)\n";
      knowledgeContext += `User query: ${effectiveQuery || "(empty)"}\n\n`;

      for (const r of contextResources) {
        const maxChars = r.media_type === "pdf" ? 6000 : 2500;
        const snippet = (r.content || "").slice(0, maxChars);

        knowledgeContext += `\n### ${r.title}\n`;
        knowledgeContext += `Category: ${r.category}\n`;
        knowledgeContext += `Type: ${r.media_type || "text"}\n`;
        if (r.media_url) knowledgeContext += `Source URL: ${r.media_url}\n`;
        knowledgeContext += `Content (excerpt):\n${snippet}\n`;
      }

      const sources = contextResources
        .filter((r: any) => !!r.media_url)
        .map((r: any) => `- ${r.title}: ${r.media_url}`)
        .join("\n");

      if (sources) {
        knowledgeContext += "\n## SOURCES & REFERENCES (links you can include)\n";
        knowledgeContext += sources + "\n";
      }

      knowledgeContext += "\n--- END VERIFIED KNOWLEDGE ---\n";
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
1. SEARCH the provided knowledge context thoroughly for relevant information
2. COMBINE information from multiple entries when answering
3. PROVIDE comprehensive answers using ALL relevant data
4. If the user asks a follow-up like "aur batao" / "more", EXPAND using the SAME topic and the same sources

RESPONSE FORMAT:
🔹 **Title** - Clear heading for the topic
🔹 **Explanation** - Detailed, well-structured information from the knowledge base
🔹 **Sources & References** - List any relevant PDF/link sources (URLs) that appear in the knowledge context

CRITICAL RULES:
- NEVER say "Jai Hind" or any religious/nationalist greetings
- Use neutral greetings: "Hello!", "Welcome!", "Welcome to Gaurav Gatha!"
- Be helpful and provide as much relevant information as possible
- If information IS available in the provided knowledge context, share it fully - don't hold back
- If information is NOT available in the provided knowledge context, clearly say it is not currently available in the knowledge base (do NOT ask users to DM).

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
