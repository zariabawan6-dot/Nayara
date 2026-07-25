// Safe wrapper around Meta Pixel calls.
// Prevents crashes if an ad blocker strips fbq from the page.
export const fbTrack = (eventName, params) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", eventName, params);
    } catch (err) {
      console.error("Meta Pixel tracking error:", err);
    }
  }
};
