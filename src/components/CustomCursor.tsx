// src/components/CustomCursor.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add a class to the body to hide the default cursor
    document.body.classList.add('custom-cursor-active');

    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;

    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let animationFrameId: number;

    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };

    const animateOutline = () => {
      // Linear interpolation for smooth trailing effect
      outlineX += (mouseX - outlineX) * 0.1;
      outlineY += (mouseY - outlineY) * 0.1;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      
      animationFrameId = requestAnimationFrame(animateOutline);
    };

    const addHoverEffect = () => cursorOutline.classList.add('cursor-hover');
    const removeHoverEffect = () => cursorOutline.classList.remove('cursor-hover');

    // Add listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"], [role="tab"], [role="checkbox"], select, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHoverEffect);
      el.addEventListener('mouseleave', removeHoverEffect);
    });

    window.addEventListener('mousemove', mouseMoveHandler);
    animationFrameId = requestAnimationFrame(animateOutline);

    // Cleanup function
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
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-blue-600 rounded-full z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={cursorOutlineRef}
        className={cn(
          "fixed top-0 left-0 w-10 h-10 border-2 border-blue-600 rounded-full z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out",
          "cursor-hover:scale-150 cursor-hover:border-blue-400"
        )}
      />
    </>
  );
};
