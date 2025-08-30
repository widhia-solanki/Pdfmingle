// src/components/CustomCursor.tsx

"use client";

import React, { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('custom-cursor-active');

    const container = cursorContainerRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    if (!container || !cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let animationFrameId: number;

    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const animateCursor = () => {
      // Position the entire container, and the dot/outline will be relative to it.
      // This simplifies positioning logic.
      const transformX = mouseX - container.offsetLeft;
      const transformY = mouseY - container.offsetTop;
      
      // Update dot position directly
      if (cursorDot) {
        cursorDot.style.transform = `translate(${transformX}px, ${transformY}px)`;
      }

      // Smoothly update outline position
      outlineX += (transformX - outlineX) * 0.1;
      outlineY += (transformY - outlineY) * 0.1;

      if (cursorOutline) {
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      }
      
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    const addHoverEffect = () => container.classList.add('cursor-container-hover');
    const removeHoverEffect = () => container.classList.remove('cursor-container-hover');

    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"], [role="tab"], [role="checkbox"], select, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });

    window.addEventListener('mousemove', mouseMoveHandler);
    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHoverEffect);
        el.removeEventListener('mouseleave', removeHoverEffect);
      });
    };
  }, []);

  return (
    <div ref={cursorContainerRef} className="fixed top-0 left-0 z-[9999] pointer-events-none">
      <div
        ref={cursorDotRef}
        className="cursor-dot w-2 h-2 bg-blue-600 rounded-full absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
      />
      <div
        ref={cursorOutlineRef}
        className="cursor-outline w-10 h-10 border-2 border-blue-600 rounded-full absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out"
      />
    </div>
  );
};
