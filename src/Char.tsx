import { useRef, useEffect } from "react";
import { S, Sequence, clearCanvas, drawSequence } from "./Character";

interface CharProps {
  sequence: Sequence;
  position: "top" | "bottom";
}

const Char = ({ sequence, position }: CharProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (canvasRef.current && ctx) {
      clearCanvas(canvasRef.current);
      drawSequence(ctx, sequence, position);
    }
  }, [canvasRef, sequence, position]);

  return (
    <canvas ref={canvasRef} className="h-12 w-auto" height={S} width={S} />
  );
};
export default Char;
