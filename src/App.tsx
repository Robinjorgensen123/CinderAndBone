import { useEffect, useRef, useState } from "react";
import { Engine } from "./core/Engine";
import { Renderer } from "./renderer/Renderer";
Renderer;
export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const [, setTick] = useState(0);

  if (!engineRef.current) {
    engineRef.current = new Engine();
  }

  useEffect(() => {
    if (!canvasRef.current || !engineRef.current) return;
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(canvasRef.current, () => {
        if (engineRef.current && rendererRef.current) {
          rendererRef.current.render(engineRef.current);
          setTick((t) => t + 1);
        }
      });
    }
    rendererRef.current.render(engineRef.current);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const engine = engineRef.current;
    const renderer = rendererRef.current;
    const canvas = canvasRef.current;
    if (!engine || !renderer || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const worldX = (e.clientX - rect.left) * scaleX + renderer.cameraX;
    const worldY = (e.clientY - rect.top) * scaleY + renderer.cameraY;

    const tileX = Math.floor(worldX / renderer.tileSize);
    const tileY = Math.floor(worldY / renderer.tileSize);

    if (engine.handleTileTap(tileX, tileY)) {
      renderer.render(engine);
      setTick((t) => t + 1);
    }
  };

  const engine = engineRef.current;
  const player = engine.getPlayer();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex gap-6 text-sm font-mono">
        <span>Class: {player.name}</span>
        <span>
          HP: {player.hp}/{player.maxHp}
        </span>
        <span>Time: {player.time.toFixed(1)}</span>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="border border-slate-700 rounded cursor-pointer max-w-full touch-none"
      />

      <div className="w-full max-w-[720px] bg-slate-900 border border-slate-800 rounded p-3 font-mono text-xs space-y-1">
        {engine.logs.map((entry, idx) => (
          <div
            key={idx}
            className={idx === 0 ? "text-amber-300" : "text-slate-400"}
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
