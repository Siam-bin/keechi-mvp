// Silently suppress favicon 404 requests
export async function GET(request) {
  return new Response(null, { status: 204 });
}
