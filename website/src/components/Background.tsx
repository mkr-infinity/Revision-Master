import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Light mode backgrounds (cozy / warm anime scenes)
import bgLight1 from '@assets/bg-light-1.jpg';
import bgLight2 from '@assets/bg-light-2.jpg';
// Dark mode backgrounds (night / cyberpunk anime scenes)
import bgDark1 from '@assets/bg-dark-1.jpg';
import bgDark2 from '@assets/bg-dark-2.jpg';

const lightBgs = [bgLight1, bgLight2];
const darkBgs  = [bgDark1, bgDark2];

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pick random image once per page-load (stable via ref)
  const lightIdx = useRef(Math.floor(Math.random() * lightBgs.length));
  const darkIdx  = useRef(Math.floor(Math.random() * darkBgs.length));

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 22 });
  const bgX = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const bgY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth  - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  // Floating dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    class Dust {
      x=0; y=0; r=0; vx=0; vy=0; alpha=0; color='';
      constructor() { this.reset(true); }
      reset(init=false) {
        const w = canvas!.width, h = canvas!.height;
        this.x = Math.random() * w;
        this.y = init ? Math.random() * h : h + 10;
        this.r = Math.random() * 2 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = -(Math.random() * 0.4 + 0.1);
        const p = ['#c4b5fd','#67e8f9','#f9a8d4','#fde68a','#ffffff','#a5f3fc'];
        this.color = p[Math.floor(Math.random() * p.length)];
        this.alpha = Math.random() * 0.45 + 0.06;
      }
      update() { this.x+=this.vx; this.y+=this.vy; if(this.y<-6) this.reset(); }
      draw(c: CanvasRenderingContext2D) {
        c.save(); c.globalAlpha=this.alpha;
        c.beginPath(); c.arc(this.x,this.y,this.r,0,Math.PI*2);
        c.fillStyle=this.color; c.shadowBlur=10; c.shadowColor=this.color;
        c.fill(); c.restore();
      }
    }

    let dust: Dust[] = [];
    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      dust = Array.from({ length: window.innerWidth < 768 ? 22 : 60 }, () => new Dust());
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dust.forEach(d => { d.update(); d.draw(ctx); });
      raf = requestAnimationFrame(animate);
    };
    init(); animate();
    window.addEventListener('resize', init);
    return () => { window.removeEventListener('resize', init); cancelAnimationFrame(raf); };
  }, []);

  const BgImage = ({ src, className }: { src: string; className: string }) => (
    <div className={`absolute inset-0 ${className}`}>
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-6%] w-[112%] h-[112%]">
        <motion.img
          src={src}
          alt=""
          className="w-full h-full object-cover object-center select-none"
          animate={{ scale: [1, 1.055, 1] }}
          transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
          draggable={false}
        />
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">

      {/* ── LIGHT MODE background ── */}
      <BgImage src={lightBgs[lightIdx.current]} className="dark:hidden" />
      <div className="absolute inset-0 dark:hidden bg-[#F7F3ED]/52" />
      <div className="absolute inset-0 dark:hidden bg-gradient-to-b from-[#F5EFE6]/30 via-transparent to-[#F7F3ED]/65" />

      {/* ── DARK MODE background ── */}
      <BgImage src={darkBgs[darkIdx.current]} className="hidden dark:block" />
      <div className="absolute inset-0 hidden dark:block bg-[#030408]/68" />
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-[hsl(262,55%,5%)]/55 via-transparent to-[#030408]/78" />

      {/* Ambient color pools (dark only) */}
      <motion.div className="absolute top-[8%] left-[4%] w-[550px] h-[550px] rounded-full blur-[200px] opacity-0 dark:opacity-100"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)' }}
        animate={{ x:[0,45,-20,0], y:[0,-30,18,0] }}
        transition={{ repeat:Infinity, duration:14, ease:'easeInOut' }}
      />
      <motion.div className="absolute bottom-[15%] right-[4%] w-[450px] h-[450px] rounded-full blur-[170px] opacity-0 dark:opacity-100"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 70%)' }}
        animate={{ x:[0,-30,12,0], y:[0,22,-16,0] }}
        transition={{ repeat:Infinity, duration:11, ease:'easeInOut', delay:2 }}
      />
      <motion.div className="absolute top-[35%] right-[22%] w-[380px] h-[380px] rounded-full blur-[180px] opacity-0 dark:opacity-100"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)' }}
        animate={{ x:[0,18,-28,0], y:[0,-18,10,0] }}
        transition={{ repeat:Infinity, duration:17, ease:'easeInOut', delay:5 }}
      />

      {/* Dust particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[2]" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-[38vh] bg-gradient-to-t from-background to-transparent z-[3]" />

      {/* Edge vignette */}
      <div className="absolute inset-0 z-[3]"
        style={{ background: 'radial-gradient(ellipse 95% 95% at 50% 50%, transparent 38%, hsl(var(--background)/0.5) 100%)' }}
      />
    </div>
  );
}
