export async function GET(
  _request: Request,
  { params }: { params: { riotId: string } }
) {
  const riotId = params.riotId;

  // 🔧 backend Render par défaut si BACKEND_URL absent
  const backendBase =
    process.env.BACKEND_URL || "https://loltracker.onrender.com";

  const url = `${backendBase}/api/summoner/${encodeURIComponent(riotId)}`;

  try {
    console.log("[Next API] Fetching backend:", url);

    const res = await fetch(url);
    const text = await res.text();

    if (!res.ok) {
      console.error("[Next API] Backend error", res.status, text);
      return new Response(text, { status: res.status });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[Next API] Proxy error", err);
    return new Response(
      JSON.stringify({ error: "BACKEND_UNREACHABLE" }),
      { status: 500 }
    );
  }
}
