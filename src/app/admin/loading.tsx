export default function Loading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-40 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-4 w-56 rounded mt-2" style={{ background: "rgba(255,255,255,0.03)" }} />
        </div>
        <div className="h-10 w-32 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-24 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }} />
        ))}
      </div>
      <div className="h-64 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }} />
    </div>
  );
}
