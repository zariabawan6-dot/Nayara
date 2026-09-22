export async function onRequest(context) {
  const res = await fetch(
    "https://dioqjijhqewpznwxwqap.supabase.co/functions/v1/clever-api"
  );
  const csv = await res.text();

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}