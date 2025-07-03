// src/components/Background.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Background = ({ children }: { children?: React.ReactNode }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    const loadVanta = async () => {
      const VANTA = await import("vanta/dist/vanta.cells.min.js");

      if (!vantaEffect) {
        const effect = VANTA.default({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          size: 1.00,
          color1:0x118ab2,
          color2:0x118ab2,
        });
        setVantaEffect(effect);
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="min-h-screen text-white">
      {children}
    </div>
  );
};

export default Background;
