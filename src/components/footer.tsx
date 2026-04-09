export function Footer() {
  return (
    <footer style={{ background: "#012A3E" }} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Het freelance shift platform van Nederland. Werk op jouw voorwaarden.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Voor Freelancers</h4>
            <div className="space-y-2">
              {["Vind Shifts", "Hoe het werkt", "Verdiensten", "Verzekering", "FAQ"].map(l => (
                <a key={l} href="#" className="block text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Voor Bedrijven</h4>
            <div className="space-y-2">
              {["Vind Personeel", "Pricing", "Features", "Integraties", "Dashboard"].map(l => (
                <a key={l} href="#" className="block text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-4">WorkWings</h4>
            <div className="space-y-2">
              {["Over Ons", "Newsroom", "Careers", "Privacy Policy", "Algemene Voorwaarden"].map(l => (
                <a key={l} href="#" className="block text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 WorkWings B.V. · KVK 12345678 · Alle rechten voorbehouden
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Made in the Netherlands</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
