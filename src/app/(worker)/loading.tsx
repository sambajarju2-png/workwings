export default function Loading() {
  return (
    <div className="px-4 py-6 space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="h-4 w-64 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-20 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
        ))}
      </div>
      <div className="space-y-3 mt-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-16 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }} />
        ))}
      </div>
    </div>
  );
}
