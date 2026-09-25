'use client';

import { useEffect, useRef } from 'react';

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Node system inspired by interconnected networks
    const nodeCount = 60;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
      });
    }

    // Three key dots representing ideas, technology, impact
    const keyDots = [
      { x: width * 0.15, y: height * 0.5, r: 5 },
      { x: width * 0.5, y: height * 0.5, r: 5 },
      { x: width * 0.85, y: height * 0.5, r: 5 },
    ];

    const maxDist = 130;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(0, 200, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && !prefersReducedMotion) {
          const force = (1 - dist / 100) * 0.5;
          node.vx -= (dx / dist) * force * 0.02;
          node.vy -= (dy / dist) * force * 0.02;
        }

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
        }

        // Bounce
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Friction
        node.vx *= 0.99;
        node.vy *= 0.99;

        ctx.fillStyle = `rgba(0, 200, 255, 0.5)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw infinity-inspired curve connecting 3 key dots
      const pulse = prefersReducedMotion ? 0.5 : Math.sin(frame * 0.02) * 0.15 + 0.5;
      ctx.strokeStyle = `rgba(0, 200, 255, ${0.3 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const k = keyDots;
      // Left loop
      ctx.moveTo(k[0].x, k[0].y);
      ctx.bezierCurveTo(
        k[0].x + 80, k[0].y - 60,
        k[1].x - 40, k[1].y - 60,
        k[1].x, k[1].y
      );
      // Right loop
      ctx.bezierCurveTo(
        k[1].x + 40, k[1].y + 60,
        k[2].x - 80, k[2].y + 60,
        k[2].x, k[2].y
      );
      ctx.stroke();

      // Draw 3 key dots
      for (const dot of keyDots) {
        const glow = prefersReducedMotion ? 0.6 : Math.sin(frame * 0.03 + dot.x) * 0.2 + 0.6;
        // Glow
        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 20);
        gradient.addColorStop(0, `rgba(0, 200, 255, ${0.4 * glow})`);
        gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 20, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = `rgba(0, 200, 255, ${glow})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame++;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => resize();
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouse);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
