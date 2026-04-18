import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  layer: number; // 0 = far, 1 = mid, 2 = near (parallax)
  trail: { x: number; y: number }[];
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

const COLORS = [
  "56, 189, 248",   // blue
  "168, 85, 247",   // purple
  "34, 211, 238",   // cyan
  "236, 72, 153",   // pink
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -10000, y: -10000, px: -10000, py: -10000 });
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.min(Math.floor((w * h) / 9000), 160);
    particlesRef.current = Array.from({ length: count }, () => {
      const layer = Math.floor(Math.random() * 3);
      const speedScale = 0.2 + layer * 0.25;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speedScale,
        vy: (Math.random() - 0.5) * speedScale,
        size: 0.8 + layer * 0.9 + Math.random() * 1.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.25 + layer * 0.2 + Math.random() * 0.2,
        layer,
        trail: [],
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = window.innerWidth;
    let h = window.innerHeight;

    const setSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    initParticles(w, h);

    const onResize = () => {
      setSize();
      initParticles(w, h);
    };
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -10000;
      mouseRef.current.y = -10000;
    };
    const onClick = (e: MouseEvent) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 0.6,
      });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("click", onClick);

    const draw = () => {
      // Soft fade for motion trails
      ctx.fillStyle = "rgba(8, 10, 22, 0.18)";
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update + draw particles
      for (const p of particles) {
        // Mouse repulsion (parallax-aware)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = 180 + p.layer * 40;
        if (dist < influence && dist > 0) {
          const force = ((influence - dist) / influence) * (0.04 + p.layer * 0.02);
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Ripple push
        for (const r of ripplesRef.current) {
          const rdx = p.x - r.x;
          const rdy = p.y - r.y;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy);
          if (Math.abs(rd - r.radius) < 30 && rd > 0) {
            const f = (1 - Math.abs(rd - r.radius) / 30) * 0.8;
            p.vx += (rdx / rd) * f;
            p.vy += (rdy / rd) * f;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Trail (only for near layer)
        if (p.layer === 2) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 6) p.trail.shift();
          for (let i = 0; i < p.trail.length; i++) {
            const t = p.trail[i];
            const ta = (i / p.trail.length) * p.alpha * 0.4;
            ctx.beginPath();
            ctx.arc(t.x, t.y, p.size * (i / p.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${ta})`;
            ctx.fill();
          }
        }

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        glow.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        glow.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.min(1, p.alpha + 0.4)})`;
        ctx.fill();
      }

      // Connections (only between similar layers for depth)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          if (Math.abs(a.layer - b.layer) > 1) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130 + a.layer * 20;
          if (dist < maxDist) {
            const alpha = ((maxDist - dist) / maxDist) * 0.18;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `rgba(${a.color}, ${alpha})`);
            grad.addColorStop(1, `rgba(${b.color}, ${alpha})`);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Cursor connection lines
      if (mouse.x > -1000) {
        for (const p of particles) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = ((160 - dist) / 160) * 0.35;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw + update ripples
      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.radius += 4;
        r.alpha *= 0.96;
        const grad = ctx.createRadialGradient(r.x, r.y, Math.max(0, r.radius - 20), r.x, r.y, r.radius + 20);
        grad.addColorStop(0, `rgba(56, 189, 248, 0)`);
        grad.addColorStop(0.5, `rgba(168, 85, 247, ${r.alpha})`);
        grad.addColorStop(1, `rgba(56, 189, 248, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        return r.alpha > 0.02 && r.radius < 600;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("click", onClick);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
