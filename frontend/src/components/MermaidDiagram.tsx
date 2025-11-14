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

  // Initialize Mermaid once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'var(--font-family-mono)',
      logLevel: 5, // 0 to silence logs
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
      {/* Control Buttons */}
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
        <button onClick={toggleCollapse} title={isCollapsed ? 'Expand' : 'Collapse'}>
          {isCollapsed ? '↔' : '✕'}
        </button>
        {!isCollapsed && (
          <>
            <button onClick={decreaseSize}>-</button>
            <button onClick={resetSize}>↺</button>
            <button onClick={increaseSize}>+</button>
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
            paddingTop: '40px',
            touchAction: 'none',
          }}
        />
      ) : (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
          onClick={toggleCollapse}
        >
          Mermaid diagram (click to expand)
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
