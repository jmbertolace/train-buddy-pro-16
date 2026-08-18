import { useEffect, useRef, useState } from "react";
import type { DemoPattern } from "@/lib/types";

/**
 * Animação demonstrativa offline (SVG) coerente com o padrão de movimento
 * do exercício. Se houver GIF/imagem/vídeo cadastrado, ele tem prioridade.
 */
export function ExerciseDemo({
  padrao = "supino",
  gifUrl,
  imagem,
  videoUrl,
  nome,
  playing = true,
  className = "",
}: {
  padrao?: DemoPattern | undefined;
  gifUrl?: string | undefined;
  imagem?: string | undefined;
  videoUrl?: string | undefined;
  nome: string;
  playing?: boolean | undefined;
  className?: string | undefined;
}) {
  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        className={`w-full rounded-xl bg-card ${className}`}
        controls
        loop
        muted
        playsInline
      />
    );
  }
  const src = gifUrl ?? imagem;
  if (src) {
    return (
      <img
        src={src}
        alt={`Demonstração do exercício ${nome}`}
        className={`w-full rounded-xl bg-card object-contain ${className}`}
        loading="lazy"
      />
    );
  }
  return <StickFigure padrao={padrao} playing={playing} className={className} />;
}

const SPEED = 1400;

function StickFigure({
  padrao,
  playing,
  className,
}: {
  padrao: DemoPattern;
  playing: boolean;
  className?: string;
}) {
  const [t, setT] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let start: number | null = null;
    const step = (now: number) => {
      if (start === null) start = now;
      const phase = ((now - start) % SPEED) / SPEED;
      setT(0.5 - 0.5 * Math.cos(phase * Math.PI * 2));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const p = poses(padrao, t);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-card ${className}`}
    >
      <svg viewBox="0 0 200 140" className="h-full w-full">
        <line
          x1="0"
          y1="128"
          x2="200"
          y2="128"
          stroke="currentColor"
          className="text-border"
          strokeWidth="2"
        />
        <g
          stroke="currentColor"
          className="text-primary"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        >
          <circle
            cx={p.head[0]}
            cy={p.head[1]}
            r="9"
            fill="currentColor"
            stroke="none"
          />
          <polyline points={p.spine.map((c) => c.join(",")).join(" ")} />
          <polyline points={p.arm.map((c) => c.join(",")).join(" ")} />
          <polyline points={p.leg.map((c) => c.join(",")).join(" ")} />
        </g>
        {p.bar && (
          <g
            stroke="currentColor"
            className="text-accent-foreground"
            strokeWidth="6"
            strokeLinecap="round"
          >
            <line x1={p.bar[0] - 22} y1={p.bar[1]} x2={p.bar[0] + 22} y2={p.bar[1]} />
          </g>
        )}
      </svg>
    </div>
  );
}

type Pose = {
  head: [number, number];
  spine: [number, number][];
  arm: [number, number][];
  leg: [number, number][];
  bar?: [number, number];
};

function poses(padrao: DemoPattern, t: number): Pose {
  switch (padrao) {
    case "supino": {
      const y = 58 + t * 26;
      return {
        head: [64, 76],
        spine: [
          [74, 80],
          [128, 80],
        ],
        arm: [
          [88, 80],
          [90, y + 8],
          [96, y],
        ],
        leg: [
          [128, 80],
          [150, 100],
          [150, 126],
        ],
        bar: [96, y],
      };
    }
    case "puxada": {
      const y = 40 + t * 26;
      return {
        head: [100, 62],
        spine: [
          [100, 72],
          [100, 104],
        ],
        arm: [
          [100, 78],
          [86, y + 14],
          [92, y],
        ],
        leg: [
          [100, 104],
          [116, 116],
          [116, 126],
        ],
        bar: [100, y],
      };
    }
    case "remada": {
      const x = 116 - t * 22;
      return {
        head: [78, 56],
        spine: [
          [86, 62],
          [120, 82],
        ],
        arm: [
          [92, 66],
          [x + 8, 92],
          [x, 100],
        ],
        leg: [
          [120, 82],
          [126, 104],
          [126, 126],
        ],
        bar: [x, 100],
      };
    }
    case "agachamento":
    case "gluteo": {
      const y = 46 + t * 30;
      return {
        head: [100, y - 14],
        spine: [
          [100, y - 4],
          [100, y + 30],
        ],
        arm: [
          [100, y + 2],
          [84, y + 4],
        ],
        leg: [
          [100, y + 30],
          [82 + t * 8, y + 52],
          [100, 126],
        ],
        bar: [100, y + 2],
      };
    }
    case "levantamento": {
      const y = 46 + t * 30;
      return {
        head: [100, y - 14],
        spine: [
          [100, y - 4],
          [100, y + 32],
        ],
        arm: [
          [100, y + 2],
          [100, 100 + t * 12],
        ],
        leg: [
          [100, y + 32],
          [96, 112],
          [100, 126],
        ],
        bar: [100, 100 + t * 12],
      };
    }
    case "rosca": {
      const y = 104 - t * 34;
      return {
        head: [100, 40],
        spine: [
          [100, 50],
          [100, 96],
        ],
        arm: [
          [100, 58],
          [100, 82],
          [92, y],
        ],
        leg: [
          [100, 96],
          [92, 112],
          [92, 126],
        ],
        bar: [92, y],
      };
    }
    case "triceps": {
      const y = 74 + t * 26;
      return {
        head: [100, 40],
        spine: [
          [100, 50],
          [100, 96],
        ],
        arm: [
          [100, 58],
          [104, 78],
          [100, y],
        ],
        leg: [
          [100, 96],
          [92, 112],
          [92, 126],
        ],
        bar: [100, y],
      };
    }
    case "desenvolvimento": {
      const y = 60 - t * 22;
      return {
        head: [100, 46],
        spine: [
          [100, 56],
          [100, 98],
        ],
        arm: [
          [100, 62],
          [84, y + 16],
          [90, y],
        ],
        leg: [
          [100, 98],
          [92, 112],
          [92, 126],
        ],
        bar: [90, y],
      };
    }
    case "elevacao": {
      const x = 118 + t * 20;
      const y = 96 - t * 40;
      return {
        head: [100, 40],
        spine: [
          [100, 50],
          [100, 96],
        ],
        arm: [
          [100, 58],
          [x - 8, y + 6],
          [x, y],
        ],
        leg: [
          [100, 96],
          [92, 112],
          [92, 126],
        ],
        bar: [x, y],
      };
    }
    case "panturrilha": {
      const y = 126 - t * 12;
      return {
        head: [100, 40],
        spine: [
          [100, 50],
          [100, 96],
        ],
        arm: [
          [100, 58],
          [116, 84],
        ],
        leg: [
          [100, 96],
          [100, y - 4],
          [110, y],
        ],
      };
    }
    case "abdominal": {
      const lift = t * 22;
      return {
        head: [70 + lift * 0.6, 104 - lift],
        spine: [
          [78 + lift * 0.5, 108 - lift * 0.8],
          [116, 118],
        ],
        arm: [
          [82 + lift * 0.5, 108 - lift * 0.8],
          [74 + lift * 0.6, 98 - lift],
        ],
        leg: [
          [116, 118],
          [136, 100],
          [150, 122],
        ],
      };
    }
    default:
      return poses("supino", t);
  }
}