import React, { useEffect, useRef } from "react";

export function MonitorFrame({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fitMonitor = () => {
      const stage = stageRef.current;
      const unit = unitRef.current;
      if (!stage || !unit) return;
      if (window.innerWidth <= 1050) {
        const scale = Math.min(1, Math.max(280, stage.clientWidth) / 1360);
        unit.style.width = "1360px";
        unit.style.position = "absolute";
        unit.style.top = "0";
        unit.style.left = "50%";
        unit.style.transform = `translateX(-50%) scale(${scale})`;
        unit.style.transformOrigin = "top center";
        requestAnimationFrame(() => {
          if (stage && unit) {
            stage.style.height = `${Math.ceil(unit.getBoundingClientRect().height)}px`;
          }
        });
      } else {
        unit.style.width = "100%";
        unit.style.position = "static";
        unit.style.transform = "none";
        stage.style.height = "auto";
      }
    };

    fitMonitor();
    window.addEventListener("resize", fitMonitor, { passive: true });
    return () => window.removeEventListener("resize", fitMonitor);
  });

  return (
    <div className="monitor-stage" ref={stageRef}>
      <div className="monitor-unit" ref={unitRef}>
        <div className="monitor-frame">{children}</div>
        <div className="monitor-stand">
          <span />
        </div>
      </div>
    </div>
  );
}
