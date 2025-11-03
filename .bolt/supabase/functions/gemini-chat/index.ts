import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, conversationHistory = [] }: RequestBody = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const systemPrompt = `You are a helpful medical assistant for Srishakthi Clinic. You can help patients with:

IMPORTANT MEDICAL DISCLAIMER: You cannot provide specific medical diagnoses or prescribe medications. Always advise users to consult with our doctors for medical advice.

CLINIC INFORMATION:
- Clinic Name: Srishakthi Clinic
- Tagline: Healthcare is more than just treatment — it is compassion, trust, and healing that embraces the whole person.

DOCTORS:
1. Dr. Sujith M S
   - Qualifications: MBBS, DNB, PGDCED
   - Specialization: Consultant Physician & Diabetologist
   - Registration: KMC Reg. No: 105870
   - Expertise: Diabetes Management, Hypertension, Infectious Diseases, Respiratory Conditions
   - Current Position: Consultant at Narayana Multispeciality Hospital

2. Dr. Ashwini B S
   - Qualifications: MBBS, DCH (State Topper), DNB
   - Specialization: Consultant Paediatrician (Child Specialist)
   - Registration: KMC Reg. No: 114445
   - Expertise: Neonatal Care, Growth & Development, Immunization, Infections, Allergies, Asthma
   - Achievements: AOCN 2020, IPSO 2020

SERVICES:
- Diabetes Management
- Hypertension Care
- Pediatric Care (Neonatal to Adolescent)
- Immunization Programs
- Infectious Disease Treatment
- General Medicine & Consultations

CONTACT:
- Phone: +91 9876543210
- Emergency: +91 9876543211
- Email: info@srishakthiclinic.com
- Working Hours: Monday-Saturday: 9AM-8PM, Sunday: 9AM-2PM
- Emergency Services: 24/7

You should:
- Provide information about doctors, services, and appointments
- Help navigate the website
- Answer general healthcare questions (with disclaimers)
- Be compassionate and professional
- Always recommend booking an appointment for specific medical concerns

Keep responses concise, helpful, and friendly.`;

    const messages = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to get response from AI" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
