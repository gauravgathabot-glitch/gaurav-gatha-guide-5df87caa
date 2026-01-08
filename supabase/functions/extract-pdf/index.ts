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
    const { pdfUrl, resourceId } = await req.json();
    
    if (!pdfUrl || !resourceId) {
      return new Response(
        JSON.stringify({ error: "pdfUrl and resourceId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Extracting text from PDF:", pdfUrl);

    // Fetch the PDF file
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBytes = new Uint8Array(pdfBuffer);

    // Simple PDF text extraction - look for text streams
    let extractedText = "";
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const pdfString = decoder.decode(pdfBytes);

    // Extract text between BT and ET markers (PDF text objects)
    const textMatches = pdfString.match(/BT[\s\S]*?ET/g) || [];
    
    for (const match of textMatches) {
      // Look for text in parentheses (literal strings)
      const literalStrings = match.match(/\(([^)]*)\)/g) || [];
      for (const str of literalStrings) {
        const text = str.slice(1, -1); // Remove parentheses
        if (text.length > 0 && !/^[\x00-\x1F]+$/.test(text)) {
          extractedText += text + " ";
        }
      }
      
      // Look for hex strings
      const hexStrings = match.match(/<([0-9A-Fa-f]+)>/g) || [];
      for (const hex of hexStrings) {
        try {
          const hexContent = hex.slice(1, -1);
          let decoded = "";
          for (let i = 0; i < hexContent.length; i += 2) {
            const charCode = parseInt(hexContent.substr(i, 2), 16);
            if (charCode > 31 && charCode < 127) {
              decoded += String.fromCharCode(charCode);
            }
          }
          if (decoded.length > 0) {
            extractedText += decoded + " ";
          }
        } catch (e) {
          // Skip invalid hex
        }
      }
    }

    // Also try to extract from stream objects
    const streamMatches = pdfString.match(/stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g) || [];
    for (const stream of streamMatches) {
      const content = stream.replace(/stream[\r\n]+/, "").replace(/[\r\n]+endstream/, "");
      // Extract readable ASCII text
      const readableText = content.replace(/[^\x20-\x7E\n\r]/g, " ").replace(/\s+/g, " ").trim();
      if (readableText.length > 20) {
        extractedText += readableText + " ";
      }
    }

    // Clean up extracted text
    extractedText = extractedText
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.,!?;:'"()\-–—]/g, " ")
      .trim();

    // If extraction is minimal, use AI to help understand the PDF
    if (extractedText.length < 100) {
      console.log("Minimal text extracted, PDF may be scanned or have complex encoding");
      extractedText = "[PDF content - text extraction limited. See PDF file for full details.]";
    }

    console.log("Extracted text length:", extractedText.length);

    // Update the knowledge resource with extracted text
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from("knowledge_resources")
      .update({ content: extractedText.substring(0, 50000) }) // Limit to 50k chars
      .eq("id", resourceId);

    if (updateError) {
      console.error("Failed to update resource:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save extracted text", details: updateError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedLength: extractedText.length,
        preview: extractedText.substring(0, 200) + "..."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("PDF extraction error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
