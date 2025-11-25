import { NextResponse } from 'next/server';

type Params = {
  riotId: string;
};

export async function GET(_req: Request, { params }: { params: Params }) {
  try {
    const riotId = params.riotId;
    console.log('[Next API] /api/summoner/', riotId);

    const backendRes = await fetch(
      `http://localhost:4000/api/summoner/${encodeURIComponent(riotId)}`,
      { cache: 'no-store' }
    );

    const text = await backendRes.text();
    console.log(
      '[Next API] Backend status:',
      backendRes.status,
      'body:',
      text.slice(0, 200)
    );

    if (!backendRes.ok) {
      return new NextResponse(text, { status: backendRes.status });
    }

    // On renvoie tel quel mais en forçant le Content-Type JSON
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Next API] Error in /api/summoner:', err);
    return NextResponse.json(
      { error: 'Failed to fetch summoner' },
      { status: 500 }
    );
  }
}
