"use client";

import { useEffect, useRef } from "react";

type PixelRevealCanvasProps = {
  src: string;
  className?: string;
  revealSize?: number;
  fadeDuration?: number;
};

type PointerPoint = {
  x: number;
  y: number;
};

export function PixelRevealCanvas({
  src,
  className,
  revealSize = 160,
  fadeDuration = 800
}: PixelRevealCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerPoint | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const lastInteractionRef = useRef<number>(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) {
      return;
    }

    const wrapperElement = wrapper;
    const canvasElement = canvas;
    const mediaQuery = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const ctx = canvasElement.getContext("2d");
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    const image = new Image();

    if (!ctx || !maskCtx) {
      return;
    }

    const canvasContext = ctx;
    const maskContext = maskCtx;
    image.src = src;
    imageRef.current = image;
    maskRef.current = maskCanvas;

    function resize() {
      const rect = wrapperElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.max(1, Math.floor(rect.width * dpr));
      canvasElement.height = Math.max(1, Math.floor(rect.height * dpr));
      maskCanvas.width = canvasElement.width;
      maskCanvas.height = canvasElement.height;
      canvasElement.style.width = `${rect.width}px`;
      canvasElement.style.height = `${rect.height}px`;
      maskContext.setTransform(1, 0, 0, 1, 0, 0);
      maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    function drawImageCover(targetCtx: CanvasRenderingContext2D) {
      if (!imageRef.current?.complete) {
        return;
      }

      const img = imageRef.current;
      const scale = Math.max(canvasElement.width / img.naturalWidth, canvasElement.height / img.naturalHeight) * 1.05;
      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;
      const x = (canvasElement.width - width) / 2;
      const y = (canvasElement.height - height) / 2;
      targetCtx.drawImage(img, x, y, width, height);
    }

    function paintReveal(point: PointerPoint) {
      if (!mediaQuery.matches) {
        return;
      }

      const rect = wrapperElement.getBoundingClientRect();
      const dpr = canvasElement.width / Math.max(1, rect.width);
      const centerX = point.x * dpr;
      const centerY = point.y * dpr;
      const radius = (revealSize * dpr) / 2;
      const gradient = maskContext.createRadialGradient(centerX, centerY, radius * 0.24, centerX, centerY, radius);
      maskContext.globalCompositeOperation = "source-over";
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.58, "rgba(255,255,255,0.86)");
      gradient.addColorStop(0.82, "rgba(255,255,255,0.24)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      maskContext.fillStyle = gradient;
      maskContext.beginPath();
      maskContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
      maskContext.fill();
    }

    function render(timestamp: number) {
      const dt = lastFrameRef.current ? timestamp - lastFrameRef.current : 16;
      lastFrameRef.current = timestamp;

      if (pointerRef.current) {
        paintReveal(pointerRef.current);
        pointerRef.current = null;
      }

      const fadeAlpha = Math.min(0.18, dt / fadeDuration);
      maskContext.globalCompositeOperation = "destination-out";
      maskContext.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      drawImageCover(canvasContext);
      canvasContext.fillStyle = "rgba(0,0,0,0.08)";
      canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
      canvasContext.globalCompositeOperation = "destination-in";
      canvasContext.drawImage(maskCanvas, 0, 0);
      canvasContext.globalCompositeOperation = "source-over";

      if (timestamp - lastInteractionRef.current > fadeDuration + 160) {
        maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
        frameRef.current = null;
        lastFrameRef.current = 0;
        return;
      }

      frameRef.current = window.requestAnimationFrame(render);
    }

    function startAnimation() {
      if (frameRef.current) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(render);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !mediaQuery.matches) {
        return;
      }

      const rect = wrapperElement.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      lastInteractionRef.current = performance.now();
      startAnimation();
    }

    function handlePointerLeave() {
      pointerRef.current = null;
    }

    resize();
    image.addEventListener("load", resize);
    wrapperElement.addEventListener("pointermove", handlePointerMove);
    wrapperElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      image.removeEventListener("load", resize);
      wrapperElement.removeEventListener("pointermove", handlePointerMove);
      wrapperElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [fadeDuration, revealSize, src]);

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
