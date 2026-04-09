"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("ww_cookies")) setShow(true);
  }, []);

  function accept() { localStorage.setItem("ww_cookies", "all"); setShow(false); }
  function necessary() { localStorage.setItem("ww_cookies", "necessary"); setShow(false); }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 safe-area-bottom">
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-2xl p-4 shadow-lg">
        <p className="text-sm text-foreground mb-3">
          Wij gebruiken cookies om WorkWings goed te laten werken en te verbeteren.{" "}
          <Link href="/cookies" className="font-semibold" style={{ color: "#EF476F" }}>Meer info</Link>
        </p>
        <div className="flex gap-2">
          <button onClick={accept} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold" style={{ background: "#EF476F" }}>Alles accepteren</button>
          <button onClick={necessary} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-border text-foreground">Alleen noodzakelijk</button>
        </div>
      </div>
    </div>
  );
}
