import fs from 'fs';
import path from 'path';
import SentientDashboard from "@/components/SentientDashboard";

export default async function Home() {
  const skillPath = path.join(process.cwd(), 'public', 'skill.md');
  let skillContent = '';
  try {
    skillContent = fs.readFileSync(skillPath, 'utf8');
  } catch (e) {
    console.error("Could not read skill.md", e);
  }

  return (
    <SentientDashboard>
      {/* 
        By passing this content as children from a Server Component, 
        Next.js natively SSR's the HTML payload directly into the DOM
        without being blocked by the "use client" directives of the dashboard!
      */}
      <div className="w-full mt-4 flex flex-col items-center">
        <div className="border border-[#2a2a2a] bg-black/50 backdrop-blur-sm rounded-lg p-3 w-full max-w-2xl text-left">
          <div className="text-lg xl:text-xl font-bold uppercase tracking-widest mb-1 text-[#6ba368] font-mono">
             Protocol Manifest (skill.md)
          </div>
          <pre className="whitespace-pre-wrap font-mono text-[11px] md:text-[12px] text-[#e5e5e5]/80 mt-2">
            {skillContent}
          </pre>
        </div>
      </div>
    </SentientDashboard>
  );
}
