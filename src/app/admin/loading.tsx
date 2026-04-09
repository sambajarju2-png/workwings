export default function Loading() {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div><div className="h-7 w-40 rounded-lg" style={{background:"#E8EDF2"}}/><div className="h-4 w-56 rounded mt-2" style={{background:"#F0F4F8"}}/></div>
        <div className="h-10 w-32 rounded-xl" style={{background:"#F0F4F8"}}/>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1,2,3,4].map(i=>(<div key={i} className="h-28 rounded-2xl bg-white border" style={{borderColor:"#E8EDF2"}}/>))}
      </div>
      <div className="h-64 rounded-2xl bg-white border" style={{borderColor:"#E8EDF2"}}/>
    </div>
  );
}
