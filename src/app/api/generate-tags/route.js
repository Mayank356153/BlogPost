export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400 }
      );
    }

    // Call Hugging Face model (zero-shot classification or text generation)
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: content,
          parameters: {
            candidate_labels: ["technology", "health", "finance", "education", "travel", "food", "lifestyle", "science"],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch from Hugging Face", details: error }),
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract best matching labels as "tags"
    const tags = data.labels?.slice(0, 5) || [];

    return new Response(JSON.stringify({ tags }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500 }
    );
  }
}
