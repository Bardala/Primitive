import mermaid from 'mermaid';
import { FC, useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  isDark: boolean;
}

const containerStyle: React.CSSProperties = {
  background: 'var(--code-block-background)',
  border: '1px solid var(--code-block-border)',
  borderRadius: 'var(--border-radius-md)',
  padding: 'var(--spacing-md)',
  margin: 'var(--spacing-lg) 0',
  overflow: 'hidden',
  position: 'relative',
};

const controlsContainerStyle: React.CSSProperties = {
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
};

const buttonStyle: React.CSSProperties = {
  background: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--border-radius-sm)',
  cursor: 'pointer',
  padding: '4px 8px',
  fontSize: '12px',
};

const diagramContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  overflowX: 'auto',
  minHeight: '100px',
  paddingTop: '40px',
  touchAction: 'none',
};

const collapsedContainerStyle: React.CSSProperties = {
  padding: '20px',
  textAlign: 'center',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
};

// Mermaid component with resize, pinch zoom, wheel zoom, and collapse
export const MermaidDiagram: FC<MermaidDiagramProps> = ({ chart, isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastTouchDistance = useRef<number | null>(null);

  // Re-render diagram whenever chart, theme, collapse state, or scale changes
  useEffect(() => {
    const applyScale = () => {
      const svgElement = containerRef.current?.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `scale(${scale})`;
        svgElement.style.transformOrigin = 'top left';
      }
    };

    if (containerRef.current && chart && !isCollapsed) {
      const container = containerRef.current;

      container.innerHTML = ''; // Clear previous content

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-family-mono)',
        logLevel: 0,
        suppressErrorRendering: true,
      });

      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

      mermaid
        .render(id, chart)
        .then(({ svg }) => {
          container.innerHTML = svg;
          applyScale();
        })
        .catch(error => {
          console.error('Mermaid rendering error:', error);
          container.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; border-radius: var(--border-radius-md);">
           Mermaid diagram error: ${error instanceof Error ? error.message : String(error)}
         </div>`;
        });
    }
  }, [chart, isDark, isCollapsed, scale]);

  // Handle mouse wheel / trackpad zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey) {
      const delta = -e.deltaY * 0.001; // Control zoom sensitivity
      setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
    }
  };

  // Handle pinch zoom on touch screens
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [touch1, touch2] = Array.from(e.touches);

      const distance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);

      if (lastTouchDistance.current !== null) {
        const diff = distance - lastTouchDistance.current;
        const zoomFactor = diff * 0.005; // Adjust pinch sensitivity
        setScale(prev => Math.min(Math.max(prev + zoomFactor, 0.5), 3));
      }
      lastTouchDistance.current = distance;
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
  };

  const increaseSize = () => setScale(prev => Math.min(prev + 0.1, 3));
  const decreaseSize = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetSize = () => setScale(1);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div style={containerStyle}>
      {/* Control buttons */}
      <div style={controlsContainerStyle}>
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand diagram' : 'Collapse diagram'}
          style={buttonStyle}
        >
          {isCollapsed ? '↔' : '✕'}
        </button>

        {!isCollapsed && (
          <>
            <button onClick={decreaseSize} title="Decrease size" style={buttonStyle}>
              -
            </button>
            <button onClick={resetSize} title="Reset size" style={buttonStyle}>
              ↺
            </button>
            <button onClick={increaseSize} title="Increase size" style={buttonStyle}>
              +
            </button>
          </>
        )}
      </div>

      {/* Diagram container with touch/scroll zoom support */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          ...diagramContainerStyle,
          display: isCollapsed ? 'none' : 'block',
        }}
      />

      {isCollapsed && (
        <div style={collapsedContainerStyle} onClick={toggleCollapse}>
          Mermaid diagram (click to expand)
        </div>
      )}
    </div>
  );
};
