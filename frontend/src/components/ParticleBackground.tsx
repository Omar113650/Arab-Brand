import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    // ✅ resize برّا try عشان الـ cleanup يشيلها صح
    const resize = () => {
      canvas.width = window.innerWidth || 1000;
      canvas.height = window.innerHeight || 800;
    };
    resize();
    window.addEventListener("resize", resize);

    try {
      const W = () => canvas.width;
      const H = () => canvas.height;

      /* particles */
      const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * W(), y: Math.random() * H(),
        r: Math.random() * 2 + 0.3,
        dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
        o: Math.random() * 0.4 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        gold: Math.random() > 0.6,
      }));

      /* glowing lines */
      const drawLines = () => {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.12;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = particles[i].gold
                ? `rgba(212,168,71,${alpha})`
                : `rgba(139,92,246,${alpha * 0.7})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      };

      /* wave lines */
      const drawWaves = () => {
        for (let w = 0; w < 3; w++) {
          ctx.beginPath();
          const amp = 18 + w * 8;
          const freq = 0.006 + w * 0.002;
          const phase = t * 0.4 + w * 1.2;
          const yBase = H() * (0.25 + w * 0.25);
          for (let x = 0; x <= W(); x += 4) {
            const y = yBase + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 0.5 + phase * 0.7) * amp * 0.4;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          const alpha = 0.04 - w * 0.01;
          ctx.strokeStyle = w % 2 === 0 ? `rgba(212,168,71,${alpha})` : `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };

      /* stars */
      const stars = Array.from({ length: 500 }, () => ({
        x: Math.random() * W(),
        y: Math.random() * H(),
        r: Math.random() * 1.3 + 0.15,
        o: Math.random() * 0.8 + 0.15,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        gold: Math.random() > 0.75,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.5,
      }));

      const drawSparkle = (x: number, y: number, size: number, alpha: number, gold: boolean) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = gold ? "#E8C46A" : "#ffffff";
        ctx.lineWidth = size * 0.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.4;
        ctx.lineWidth = size * 0.25;
        const d = size * 0.55;
        ctx.beginPath();
        ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
        ctx.stroke();
        ctx.restore();
      };

      const drawStars = () => {
        stars.forEach(s => {
          s.x += s.dx; s.y += s.dy;
          if (s.x < 0) s.x = W(); if (s.x > W()) s.x = 0;
          if (s.y < 0) s.y = H(); if (s.y > H()) s.y = 0;

          const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
          const alpha = s.o * twinkle;

          if (s.r > 0.7) {
            drawSparkle(s.x, s.y, s.r * 2.5, alpha, s.gold);
          } else {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.gold
              ? `rgba(232,196,106,${alpha})`
              : `rgba(255,255,255,${alpha * 0.8})`;
            ctx.fill();
          }
        });
      };

      /* floating orbs */
      const orbs = [
        { x: 0.2, y: 0.3, r: 160, color: "212,168,71", speed: 0.0008 },
        { x: 0.8, y: 0.6, r: 120, color: "139,92,246", speed: 0.0012 },
        { x: 0.5, y: 0.8, r: 90,  color: "212,168,71", speed: 0.001  },
      ];

      const drawOrbs = () => {
        orbs.forEach((orb, i) => {
          const cx = (orb.x + Math.sin(t * orb.speed + i) * 0.08) * W();
          const cy = (orb.y + Math.cos(t * orb.speed * 1.3 + i) * 0.06) * H();
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(orb.r, 1));
          grad.addColorStop(0, `rgba(${orb.color},0.06)`);
          grad.addColorStop(1, `rgba(${orb.color},0)`);
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(orb.r, 1), 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      };

      const draw = () => {
        t++;
        ctx.clearRect(0, 0, W(), H());

        drawOrbs();
        drawWaves();
        drawLines();
        drawStars();

        particles.forEach(p => {
          p.x += p.dx; p.y += p.dy;
          p.pulse += 0.03;
          if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0;
          if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
          const pulsedR = Math.max(p.r + Math.sin(p.pulse) * 0.5, 0.1);
          const pulsedO = Math.max(p.o + Math.sin(p.pulse * 0.7) * 0.08, 0);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, pulsedR), 0, Math.PI * 2);
          ctx.fillStyle = p.gold ? `rgba(212,168,71,${pulsedO})` : `rgba(139,92,246,${pulsedO * 0.6})`;
          ctx.fill();
          if (p.gold && p.r > 1.2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, pulsedR * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212,168,71,${pulsedO * 0.06})`;
            ctx.fill();
          }
        });

        animId = requestAnimationFrame(draw);
      };

      draw();
    } catch (e) {
      console.error("Particle background error:", e);
    }

    // ✅ cleanup صح - بيشيل الـ resize listener بنفس الـ reference
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "fixed", top: "-15%", left: "50%", width: 600, height: 500, background: "radial-gradient(ellipse,rgba(212,168,71,.10),transparent 65%)", filter: "blur(50px)", pointerEvents: "none", animation: "orbFloat 9s ease-in-out infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "5%", right: "3%", width: 320, height: 320, background: "radial-gradient(circle,rgba(139,92,246,.09),transparent 70%)", filter: "blur(35px)", pointerEvents: "none", animation: "orbFloat2 11s ease-in-out infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "20%", left: "8%", width: 200, height: 200, background: "radial-gradient(circle,rgba(212,168,71,.06),transparent 70%)", filter: "blur(25px)", pointerEvents: "none", animation: "orbFloat3 13s ease-in-out infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(212,168,71,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,71,.03) 1px,transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)", zIndex: 0 }} />
    </>
  );
}




