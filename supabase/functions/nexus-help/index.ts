Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Please send a question." }), { status: 405, headers: { "content-type": "application/json" } });
  }

  try {
    const { question } = await req.json();
    const text = typeof question === "string" ? question.trim() : "";
    if (!text) {
      return new Response(JSON.stringify({ error: "Please enter a question." }), { status: 400, headers: { "content-type": "application/json" } });
    }

    // Keep model credentials server-side. The model/knowledge provider can be configured
    // here without exposing a secret key to the website.
    return new Response(
      JSON.stringify({
        answer: "Nexus Help is ready to use, but its knowledge service still needs to be connected. Please use the Contact page for direct support for now."
      }),
      { headers: { "content-type": "application/json" } }
    );
  } catch {
    return new Response(JSON.stringify({ error: "We could not process your question right now." }), { status: 400, headers: { "content-type": "application/json" } });
  }
});