export async function GET(
    _req: Request,
    { params }: { params: { puuid: string } }
  ) {
    const BACKEND_URL = process.env.BACKEND_URL!;
    const puuid = params.puuid;
  
    const url = `${BACKEND_URL}/api/matches/${puuid}?count=20`;
  
    const res = await fetch(url);
    const text = await res.text();
  
    if (!res.ok) {
      console.error("Backend error:", res.status, text);
      return new Response(text, { status: res.status });
    }
  
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  