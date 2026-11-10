import React, { createContext, useContext, useEffect, useState } from 'react';

const LiquidGlassContext = createContext(null);

export function DeferredLiquidGlassStage({ children }) {
  const [LiquidGlassApi, setLiquidGlassApi] = useState(null);

  useEffect(() => {
    let disposed = false;
    let loading = false;
    const stage = document.querySelector('.current-stage');

    const load = async () => {
      if (disposed || loading) return;
      loading = true;
      try {
        const [glassModule, backdropModule] = await Promise.all([
          import('simple-liquid-glass'),
          import('simple-liquid-glass/backdrop')
        ]);
        if (!disposed) {
          setLiquidGlassApi({
            LiquidGlass: glassModule.LiquidGlass,
            LiquidGlassScene: backdropModule.LiquidGlassScene
          });
        }
      } catch {
        // CSS glass treatment remains available if the optional optics fail.
      }
    };

    stage?.addEventListener('pointerenter', load, { once: true, passive: true });
    stage?.addEventListener('focusin', load, { once: true });
    const timeout = window.setTimeout(load, 3600);

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      stage?.removeEventListener('pointerenter', load);
      stage?.removeEventListener('focusin', load);
    };
  }, []);

  const Scene = LiquidGlassApi?.LiquidGlassScene;
  return (
    <LiquidGlassContext.Provider value={LiquidGlassApi?.LiquidGlass || null}>
      {Scene ? <Scene>{children}</Scene> : children}
    </LiquidGlassContext.Provider>
  );
}

export function DeferredGlassCard({ children, className, style, ...props }) {
  const LiquidGlass = useContext(LiquidGlassContext);
  if (!LiquidGlass) {
    return <div className={className} style={style}>{children}</div>;
  }
  return (
    <LiquidGlass {...props} className={className} style={style}>
      {children}
    </LiquidGlass>
  );
}
