export async function onRequest() {
  return new Response("CLOUDFLARE FUNCTION IS WORKING", {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  });
}