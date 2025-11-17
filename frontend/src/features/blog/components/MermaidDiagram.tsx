import mermaid from 'mermaid';
import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react';

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

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'var(--font-family-mono)',
      logLevel: 5,
      suppressErrorRendering: true,
    });
  }, [isDark]);

  // Cache key based on chart + theme
  const cacheKey = useMemo(() => `${isDark ? 'dark' : 'light'}-${chart}`, [chart, isDark]);

  // Render the mermaid diagram only when chart or theme changes
  useEffect(() => {
    if (!containerRef.current || !chart || isCollapsed) return;

    const container = containerRef.current;
    const renderId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    let isCancelled = false;

    // Use cached SVG if available
    const cachedSvg = svgCache.current[cacheKey];
    if (cachedSvg) {
      container.innerHTML = cachedSvg;
      applyScale(container, scale);
      return;
    }

    // Otherwise render new diagram
    container.innerHTML = '';
    mermaid
      .render(renderId, chart)
      .then(({ svg }) => {
        if (isCancelled) return;
        svgCache.current[cacheKey] = svg; // cache it
        container.innerHTML = svg;
        applyScale(container, scale);
      })
      .catch(err => {
        if (isCancelled) return;
        console.error('Mermaid rendering error:', err);
        container.innerHTML = `<div style="color:red;padding:10px;border:1px solid red;border-radius:4px">
          Mermaid diagram error: ${err instanceof Error ? err.message : String(err)}
        </div>`;
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, chart, isCollapsed, isDark]);

  // Scale effect runs independently — no re-render of diagram
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isCollapsed) return;

    requestAnimationFrame(() => applyScale(container, scale));
  }, [scale, isCollapsed]);

  // Touch gesture handling for mobile zoom
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

        setScale(prev => {
          const newScale = prev * scaleChange;
          return Math.max(0.5, Math.min(newScale, 3));
        });

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
    <div
      style={{
        background: 'var(--code-block-background)',
        border: '1px solid var(--code-block-border)',
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--spacing-md)',
        margin: 'var(--spacing-lg) 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Control Buttons - Hidden on mobile except collapse */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '4px',
          zIndex: 10,
          background: 'var(--code-block-background)',
          borderRadius: 'var(--border-radius-sm)',
          padding: '4px',
          border: '1px solid var(--code-block-border)',
        }}
      >
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand' : 'Collapse'}
          style={{ fontSize: '14px' }}
        >
          {isCollapsed ? '↔' : '✕'}
        </button>

        {/* Show resize buttons only on desktop */}
        {!isCollapsed && !isMobile && (
          <>
            <button onClick={decreaseSize} title="Zoom Out" style={{ fontSize: '14px' }}>
              -
            </button>
            <button onClick={resetSize} title="Reset Zoom" style={{ fontSize: '12px' }}>
              ↺
            </button>
            <button onClick={increaseSize} title="Zoom In" style={{ fontSize: '14px' }}>
              +
            </button>
          </>
        )}
      </div>

      {!isCollapsed ? (
        <div
          ref={containerRef}
          style={{
            textAlign: 'center',
            overflowX: 'auto',
            minHeight: '100px',
            paddingTop: isMobile ? '20px' : '40px',
            touchAction: isMobile ? 'none' : 'auto',
            cursor: isMobile ? 'grab' : 'default',
            userSelect: 'none',
          }}
          onTouchStart={e => {
            // Allow touch scrolling but prevent text selection
            if (e.touches.length === 1) {
              e.currentTarget.style.cursor = 'grabbing';
            }
          }}
          onTouchEnd={e => {
            e.currentTarget.style.cursor = 'grab';
          }}
        />
      ) : (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={toggleCollapse}
        >
          Mermaid diagram {isMobile ? '(tap to expand)' : '(click to expand)'}
        </div>
      )}

      {/* Mobile instructions */}
      {!isCollapsed && isMobile && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginTop: '8px',
            padding: '4px',
            background: 'var(--code-block-background)',
            borderTop: '1px solid var(--code-block-border)',
          }}
        >
          Pinch to zoom • Drag to pan
        </div>
      )}
    </div>
  );
};

function applyScale(container: HTMLDivElement, scale: number) {
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.style.transform = `scale(${scale})`;
    svgEl.style.transformOrigin = 'top left';
  }
}

export default memo(MermaidDiagram, (prev, next) => {
  return prev.chart === next.chart && prev.isDark === next.isDark;
});
