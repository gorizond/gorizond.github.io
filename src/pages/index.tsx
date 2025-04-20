import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const translations = {
  ru: {
    title: "Простейший способ развернуть и управлять",
    k3s: " кластерами с VPN через headscale (Tailscale) и P2P-сетью batman по Wi-Fi — оптимизировано для Raspberry Pi и других одноплатных решений с Wi-Fi.",
    free: "Бесплатный план: 1 воркер • Платный план: безлимит",
    simplicity: "Простота запуска",
    simplicityDesc: "Один CLI — и кластер готов. Gorizond берет на себя всю сложность настройки.",
    vpn: "VPN по умолчанию",
    vpnDesc: "Встроенный Headscale создаёт mesh-сеть без NAT и портов.",
    iot: "IoT ready",
    iotDesc: "Низкие требования и отказоустойчивость — для периферии и Raspberry Pi.",
    p2p: "P2P Wi‑Fi",
    p2pDesc: "batman-adv mesh по Wi‑Fi для прямых P2P-соединений.",
    github: "GitHub →",
    toApp: "Приложение →"

  },
  en: {
    title: "The simplest way to launch and manage",
    k3s: " clusters with VPN via headscale (Tailscale) and batman Wi‑Fi mesh — optimized for Raspberry Pi and other Wi‑Fi enabled SBCs.",
    free: "Free: 1 worker • Paid: unlimited",
    simplicity: "Easy to launch",
    simplicityDesc: "One CLI and your cluster is ready. Gorizond handles the hard stuff.",
    vpn: "VPN by default",
    vpnDesc: "Built-in Headscale forms a NAT-less mesh network.",
    iot: "IoT ready",
    iotDesc: "Low resource usage and high resiliency — great for the edge.",
    p2p: "P2P Wi‑Fi",
    p2pDesc: "batman-adv mesh over Wi‑Fi for true peer-to-peer networking.",
    github: "GitHub →",
    toApp: "App →"
  }
};

const Logo = () => (
    <svg width="120" height="80" viewBox="0 0 120 80" className="mb-8">
      <path d="M0,60 Q60,20 120,60" fill="none" stroke="#fff" strokeWidth="4" />
      <g transform="translate(70,30) rotate(-30)">
        <circle cx="0" cy="0" r="6" fill="none" stroke="#fff" strokeWidth="2" />
        <rect x="-18" y="-4" width="12" height="8" fill="#fff" />
        <rect x="6" y="-4" width="12" height="8" fill="#fff" />
        <line x1="-6" y1="-6" x2="6" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="6" y1="-6" x2="-6" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="0" y1="-10" x2="0" y2="-20" stroke="#fff" strokeWidth="2" />
        <circle cx="0" cy="-25" r="2" fill="#fff" />
      </g>
    </svg>
);

const palettes = {
  satellite: ["#88c0d0", "#81a1c1", "#8fbcbb"],
  car: ["#bf616a", "#d08770", "#ebcb8b"],
  robot: ["#a3be8c", "#b48ead", "#e5e9f0"],
};

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export default function Home() {

  const canvasRef = useRef(null);
  const [lang, setLang] = useState("ru");
  const t = translations[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sprites = [];
    const count = { satellite: 15, car: 5, robot: 5 };
    const rand = (min, max) => min + Math.random() * (max - min);

    const minY = 0;

    for (let i = 0; i < count.satellite; i++) {
      const speed = rand(0.3, 1);
      const angle = rand(0, Math.PI * 2);
      sprites.push({
        type: "satellite",
        x: rand(0, canvas.width),
        y: rand(minY, canvas.height * 0.5),
        size: rand(30, 50),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        bodyColor: pick(palettes.satellite),
        panelColor: pick(palettes.satellite),
      });
    }

    for (let i = 0; i < count.car; i++) {
      sprites.push({
        type: "car",
        x: rand(0, canvas.width),
        y: canvas.height - 60,
        size: rand(50, 80),
        dx: rand(1, 1.5),
        dy: 0,
        bodyColor: pick(palettes.car),
      });
    }

    for (let i = 0; i < count.robot; i++) {
      sprites.push({
        type: "robot",
        x: rand(0, canvas.width),
        y: canvas.height - 140,
        size: rand(40, 60),
        dx: rand(0.8, 1.3),
        dy: 0,
        bodyColor: pick(palettes.robot),
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const maxY = canvas.height * 0.5;

      sprites.forEach(s => {
        let { x, y, size, dx, dy, type, bodyColor, panelColor } = s;
        const scale = size / 100;

        if (type === 'satellite') {
          if (y + dy > maxY) s.dy = -Math.abs(s.dy);
          if (y + dy < minY) s.dy = Math.abs(s.dy);
        }

        s.x += s.dx;
        s.y += s.dy;

        if (s.x > canvas.width + s.size) s.x = -s.size;
        if (s.x < -s.size) s.x = canvas.width + s.size;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(scale, scale);

        if (type === "satellite") {
          ctx.fillStyle = bodyColor;
          ctx.fillRect(10, 40, 80, 20);
          ctx.fillStyle = panelColor;
          ctx.fillRect(0, 30, 20, 10);
          ctx.fillRect(80, 30, 20, 10);
        } else if (type === "car") {
          ctx.fillStyle = bodyColor;
          ctx.fillRect(0, 20, 100, 20);
          ctx.fillStyle = "#2d3748";
          ctx.beginPath(); ctx.arc(25, 45, 7, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(75, 45, 7, 0, Math.PI * 2); ctx.fill();
        } else if (type === "robot") {
          ctx.fillStyle = bodyColor;
          ctx.fillRect(20, 40, 60, 60);
          ctx.globalAlpha = 0.8;
          ctx.fillRect(40, 10, 20, 30);
          ctx.globalAlpha = 1;
          ctx.fillRect(0, 60, 20, 10);
          ctx.fillRect(80, 60, 20, 10);
          ctx.fillRect(30, 100, 10, 20);
          ctx.fillRect(60, 100, 10, 20);
          ctx.fillStyle = "#2d3748";
          ctx.beginPath(); ctx.arc(50, 60, 8, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
      <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto bg-gray-900 text-white">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button variant="outline" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>
            <span className="text-xl">{lang === 'ru' ? '🇬🇧' : '🇷🇺'}</span>
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-12">
          <Logo />
          <div className="bg-gray-800 bg-opacity-70 p-6 rounded-2xl max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">gorizond</h1>
            <p className="text-xl md:text-2xl mb-4">
              {t.title} <span className="text-blue-400">k3s</span> {t.k3s}
            </p>
            <p className="text-sm text-gray-400 mb-6">{t.free}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left text-lg mb-8">
              <div className="bg-gray-700 bg-opacity-60 p-4 rounded-xl">
                <h2 className="text-blue-300 font-semibold">{t.simplicity}</h2>
                <p>{t.simplicityDesc}</p>
              </div>
              <div className="bg-gray-700 bg-opacity-60 p-4 rounded-xl">
                <h2 className="text-blue-300 font-semibold">{t.vpn}</h2>
                <p>{t.vpnDesc}</p>
              </div>
              <div className="bg-gray-700 bg-opacity-60 p-4 rounded-xl">
                <h2 className="text-blue-300 font-semibold">{t.iot}</h2>
                <p>{t.iotDesc}</p>
              </div>
              <div className="bg-gray-700 bg-opacity-60 p-4 rounded-xl">
                <h2 className="text-blue-300 font-semibold">{t.p2p}</h2>
                <p>{t.p2pDesc}</p>
              </div>
            </div>
            <a href="https://github.com/gorizond" target="_blank" rel="noopener noreferrer">
              <button className="text-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 mr-4">
                {t.github}
              </button>
            </a>

            <a href="https://gorizond.negash.ru" target="_blank" rel="noopener noreferrer">
              <button className="text-lg px-6 py-3 bg-green-600 hover:bg-green-700">
                {t.toApp}
              </button>
            </a>
          </div>
        </div>
      </div>
  );
}
