// src/hooks/useParallax.ts

import { useState, useEffect } from 'react';

// This hook calculates a transform style based on mouse position for a parallax effect.
// strength: A small number (e.g., 0.05) that controls how much the element moves.
export const useParallax = (strength: number) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // We store the target and current positions to create a smooth "easing" or "lag" effect.
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position relative to the center of the screen.
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // The 'target' is where the element *should* be.
      targetX = (clientX - centerX) * strength;
      targetY = (clientY - centerY) * strength;
    };

    // The animation loop continuously moves the 'current' position towards the 'target' position.
    const animate = () => {
      // Linear interpolation (lerp) for a smooth, trailing motion.
      currentX += (targetX - currentX) * 0.1; // The 0.1 is the smoothing factor.
      currentY += (targetY - currentY) * 0.1;

      setStyle({
        transform: `translate(${currentX}px, ${currentY}px)`,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup function to prevent memory leaks when the component unmounts.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [strength]);

  return style;
};
