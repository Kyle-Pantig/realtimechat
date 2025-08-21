export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response('Socket.IO endpoint - use Socket.IO client to connect', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    }
  });
}
