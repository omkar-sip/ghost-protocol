'use client';

import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    if (!cursor || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    function animateTrail() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail!.style.left = tx + 'px';
      trail!.style.top = ty + 'px';
      requestAnimationFrame(animateTrail);
    }

    document.addEventListener('mousemove', onMouseMove);
    animateTrail();

    // Hover state for interactive elements
    const interactiveEls = document.querySelectorAll('a, button, [role="button"]');
    const addHover = () => cursor.classList.add('hovering');
    const removeHover = () => cursor.classList.remove('hovering');

    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />
    </>
  );
}
