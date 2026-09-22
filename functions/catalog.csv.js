export async function onRequest(context) {
  const upstreamUrl =
    "https://dioqjijhqewpznwxwqap.supabase.co/functions/v1/clever-api";

  try {
    const res = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store",
        "Pragma": "no-cache",
      },
      cf: {
        cacheTtl: 0,
        cacheEverything: false,
      },
    });

    const csv = await res.text();

    return new Response(csv, {
      status: res.status,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "inline",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch catalog",
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}