/**
 * Lightweight page-view tracking.
 *
 * On every route change we POST a page view to `/api/track` (serverless),
 * which stores it in Firebase together with country (Vercel header) and
 * device type. A per-browser session id lets the admin count unique visits
 * and average session length.
 */

const SESSION_KEY = "myicon_session_id";

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

let lastPath = "";

/** Record a page view (fire-and-forget; never blocks navigation). */
export function trackPageView(path: string, referrer?: string): void {
  if (path === lastPath) return;
  lastPath = path;
  try {
    const payload = {
      path,
      sessionId: getSessionId(),
      ref: referrer ?? "",
    };
    // sendBeacon survives page unload; fall back to keepalive fetch.
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/track", blob);
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch {
    /* tracking must never break the app */
  }
}
