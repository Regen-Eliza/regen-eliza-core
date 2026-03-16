"use client";
import React, { useEffect, useRef } from "react";
// @ts-ignore
import { TalkingHead } from "@met4citizen/talkinghead";

export default function Avatar() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<any>(null);

  useEffect(() => {
    if (!avatarRef.current) return;
    if (headRef.current) return;

    const initAvatar = async () => {
      try {
        const head = new TalkingHead(avatarRef.current, {
          ttsEndpoint: "", // we use elevenlabs directly
          cameraView: "head"
        });
        headRef.current = head;
        
        // The human needs to place their .glb avatar file in public/models/avatar.glb
        const avatarUrl = "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb";
        
        await head.showAvatar({
          url: avatarUrl,
          body: "F",
          avatarMood: "neutral",
          lipsyncLang: 'en'
        }, () => {});
        
        // Expose globally so voiceService can send audio buffers
        (window as any).talkingHead = head;
      } catch(e) {
        console.error("TalkingHead initialization failed:", e);
      }
    };
    initAvatar();

    return () => {
      if ((window as any).talkingHead === headRef.current) {
        delete (window as any).talkingHead;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-transparent">
      <div 
        ref={avatarRef} 
        className="w-full h-full" 
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      ></div>
    </div>
  );
}
