import mermaid from 'mermaid';
import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiMaximize2,
  FiMinus,
  FiPlus,
  FiRefreshCw,
} from 'react-icons/fi';

interface MermaidDiagramProps {
  chart: string;
  isDark: boolean;
}

const MermaidDiagram: FC<MermaidDiagramProps> = ({ chart, isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgCache = useRef<Record<string, string>>({});
  const [scale, setScale] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      logLevel: 5,
      suppressErrorRendering: true,
    });
  }, [isDark]);

  const cacheKey = useMemo(() => `${isDark ? 'dark' : 'light'}-${chart}`, [chart, isDark]);

  useEffect(() => {
    if (!containerRef.current || !chart || isCollapsed) return;

    const container = containerRef.current;
    const renderId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    let isCancelled = false;

    const cachedSvg = svgCache.current[cacheKey];
    if (cachedSvg) {
      container.innerHTML = cachedSvg;
      applyScale(container, scale);
      return;
    }

    container.innerHTML = '';
    mermaid
      .render(renderId, chart)
      .then(({ svg }) => {
        if (isCancelled) return;
        svgCache.current[cacheKey] = svg;
        container.innerHTML = svg;
        applyScale(container, scale);
      })
      .catch(err => {
        if (isCancelled) return;
        console.error('Mermaid rendering error:', err);
        container.innerHTML = `<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          <strong>Mermaid Error:</strong> ${err instanceof Error ? err.message : String(err)}
        </div>`;
      });

    return () => {
      isCancelled = true;
    };
  }, [cacheKey, chart, isCollapsed, isDark, scale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isCollapsed) return;
    requestAnimationFrame(() => applyScale(container, scale));
  }, [scale, isCollapsed]);

  useEffect(() => {
    if (!containerRef.current || !isMobile || isCollapsed) return;

    const container = containerRef.current;
    let initialDistance: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDistance = getTouchDistance(e.touches);
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance !== null) {
        const currentDistance = getTouchDistance(e.touches);
        const scaleChange = currentDistance / initialDistance;

        setScale(prev => Math.max(0.5, Math.min(prev * scaleChange, 3)));
        initialDistance = currentDistance;
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      initialDistance = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isMobile, isCollapsed]);

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  };

  const increaseSize = () => setScale(prev => Math.min(prev + 0.1, 3));
  const decreaseSize = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetSize = () => setScale(1);
  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-border-light bg-surface-light/50 shadow-sm backdrop-blur-sm transition-all dark:border-border-dark dark:bg-surface-dark/50">
      {/* Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 flex gap-1 rounded-xl border border-border-light bg-white/80 p-1 shadow-sm backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/80">
        <button
          onClick={toggleCollapse}
          className="rounded-lg p-1.5 text-text-secondary-light transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
          title={isCollapsed ? 'Expand Diagram' : 'Collapse Diagram'}
        >
          {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
        </button>

        {!isCollapsed && (
          <>
            <div className="mx-0.5 w-px bg-border-light dark:bg-border-dark"></div>
            <button
              onClick={decreaseSize}
              className="rounded-lg p-1.5 text-text-secondary-light transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
              title="Zoom Out"
            >
              <FiMinus />
            </button>
            <button
              onClick={resetSize}
              className="rounded-lg p-1.5 text-text-secondary-light transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
              title="Reset Zoom"
            >
              <FiRefreshCw size={14} />
            </button>
            <button
              onClick={increaseSize}
              className="rounded-lg p-1.5 text-text-secondary-light transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
              title="Zoom In"
            >
              <FiPlus />
            </button>
          </>
        )}
      </div>

      {!isCollapsed ? (
        <div className="relative flex min-h-[150px] flex-col overflow-hidden">
          <div
            ref={containerRef}
            className={`flex w-full items-center justify-center pt-16 pb-8 transition-transform ${
              isMobile ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}
            style={{ touchAction: isMobile ? 'none' : 'auto' }}
          />

          {isMobile && (
            <div className="border-t border-border-light/50 bg-background-light/80 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-text-secondary-light backdrop-blur-sm dark:border-border-dark/50 dark:bg-background-dark/80 dark:text-text-secondary-dark">
              Pinch to zoom • Drag to pan
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={toggleCollapse}
          className="flex w-full items-center justify-center gap-2 py-6 text-sm font-bold text-text-secondary-light transition-all hover:bg-primary-50 hover:text-primary-600 dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
        >
          <FiMaximize2 />
          Mermaid Diagram (Click to expand)
        </button>
      )}
    </div>
  );
};

function applyScale(container: HTMLDivElement, scale: number) {
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.style.transform = `scale(${scale})`;
    svgEl.style.transformOrigin = 'center center';
    svgEl.style.transition = 'transform 0.2s ease-out';
  }
}

export default memo(MermaidDiagram, (prev, next) => {
  return prev.chart === next.chart && prev.isDark === next.isDark;
});
