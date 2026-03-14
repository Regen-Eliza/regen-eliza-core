import { useEffect, useRef, useState } from 'react';
import { TalkingHead } from 'talkinghead';

interface AvatarBaseProps {
  avatarUrl: string; // The URL to the .glb 3D avatar file
}

export const AvatarBase = ({ avatarUrl }: AvatarBaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [head, setHead] = useState<any>(null);

  useEffect(() => {
    let active = true;

    const initAvatar = async () => {
      if (!containerRef.current) return;

      // Initialize the TalkingHead instance on the container node
      try {
        const talkingHead = new TalkingHead(containerRef.current, {
          cameraView: 'upper',
          shadows: true,
        });

        if (!active) return;
        
        await talkingHead.showAvatar({
          url: avatarUrl,
          body: 'F', // standard body option (M | F)
        });
        
        setHead(talkingHead);
      } catch (error) {
        console.error("Error loading TalkingHead avatar:", error);
      }
    };

    initAvatar();

    return () => {
      active = false;
      // In a robust implementation, you should destroy/cleanup the TalkingHead instance if supported
    };
  }, [avatarUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px', // or dynamic sizing based on standard CSS
        backgroundColor: '#111', // default dark background matching cyberdeck aesthetic
        borderRadius: '8px',
      }}
    />
  );
};
