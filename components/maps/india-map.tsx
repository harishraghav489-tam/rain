"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, MapPin, Layers } from "lucide-react";
import { useMapStore } from "@/store/map-store";
import { useForecastStore } from "@/store/forecast-store";
import { useFilterStore } from "@/store/filter-store";
import { getIndiaGrids, findGridById } from "@/lib/grid-generator";
import { GridCell } from "@/types/grid";
import { MapLegend } from "./map-legend";
import { MapToolbar } from "./map-toolbar";
import { REGIME_COLORS } from "@/lib/constants";
import { getRainfallColor, formatRainfall, formatLatLon } from "@/lib/formatting";
import { INDIA_COASTLINE_BOUNDS, REGION_CENTERS } from "@/lib/india-geo";

export const IndiaMap: React.FC = () => {
  const { selectedGridId, selectGrid, selectedLayer, isInspectorOpen } = useMapStore();
  const { displayMode } = useForecastStore();
  const { selectedRegion } = useFilterStore();

  const [hoveredGrid, setHoveredGrid] = useState<GridCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const grids = useMemo(() => getIndiaGrids(), []);

  // Update center when selectedRegion changes
  useEffect(() => {
    const reg = REGION_CENTERS[selectedRegion];
    if (reg) {
      if (selectedRegion === "All India") {
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      } else {
        setZoomLevel(1.4);
        // Approximate offset based on region
        if (selectedRegion === "Northwest India") setPanOffset({ x: 60, y: 60 });
        else if (selectedRegion === "Central India") setPanOffset({ x: 0, y: 0 });
        else if (selectedRegion === "South Peninsula") setPanOffset({ x: 0, y: -70 });
        else if (selectedRegion === "East & Northeast India") setPanOffset({ x: -90, y: 30 });
      }
    }
  }, [selectedRegion]);

  // Coordinate projection from [lon, lat] to SVG coordinate space
  // India bounds: lon 68 to 97, lat 8 to 37
  const project = (lon: number, lat: number, width: number, height: number) => {
    const minLon = 67.5;
    const maxLon = 97.5;
    const minLat = 7.0;
    const maxLat = 37.5;

    const x = ((lon - minLon) / (maxLon - minLon)) * (width * 0.88) + width * 0.06;
    // Invert lat for SVG Y
    const y = ((maxLat - lat) / (maxLat - minLat)) * (height * 0.88) + height * 0.06;
    return { x, y };
  };

  const coastlinePath = useMemo(() => {
    const w = 700;
    const h = 720;
    const pts = INDIA_COASTLINE_BOUNDS.map(([lon, lat]) => {
      const p = project(lon, lat, w, h);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  }, []);

  const getCellColor = (grid: GridCell) => {
    if (selectedLayer === "regime") {
      return REGIME_COLORS[grid.regime] || "#64748B";
    }
    if (selectedLayer === "transition") {
      if (!grid.isTransitioning) return "#E2E8F0";
      return grid.transitionProbability && grid.transitionProbability > 0.7 ? "#7566D8" : "#F2A93B";
    }
    if (selectedLayer === "uncertainty") {
      const spread = grid.p90Mm - grid.p10Mm;
      if (spread < 20) return "#E0F2FE";
      if (spread < 50) return "#7DD3FC";
      if (spread < 90) return "#0284C7";
      return "#312E81";
    }
    // Rainfall
    const mm =
      displayMode === "nwp"
        ? grid.nwpRainfallMm
        : displayMode === "bias_corrected"
        ? grid.correctedRainfallMm
        : Math.abs(grid.anomalyMm);
    return getRainfallColor(mm);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex flex-col w-full h-[620px] rounded-3xl bg-[#F0F6FA] border border-white/80 shadow-clay overflow-hidden select-none">
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <MapToolbar />
      </div>

      {/* Main Interactive Map Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full relative overflow-hidden flex items-center justify-center ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <svg
          viewBox="0 0 700 720"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          {/* Water Bodies & Ocean Context */}
          <rect width="700" height="720" fill="#EAF3FA" />

          {/* Geographic Labels */}
          <text x="90" y="440" fill="#90AFC9" fontSize="13" fontWeight="600" letterSpacing="2">
            ARABIAN SEA
          </text>
          <text x="510" y="450" fill="#90AFC9" fontSize="13" fontWeight="600" letterSpacing="2">
            BAY OF BENGAL
          </text>
          <text x="260" y="680" fill="#90AFC9" fontSize="13" fontWeight="600" letterSpacing="2">
            INDIAN OCEAN
          </text>

          {/* India Continental Base Outline */}
          <path
            d={coastlinePath}
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Island Groups */}
          {/* Andaman & Nicobar */}
          <g>
            <rect x="580" y="480" width="8" height="24" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <rect x="590" y="550" width="6" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="600" y="520" fill="#94A3B8" fontSize="9" fontWeight="500">
              Andaman & Nicobar
            </text>
          </g>
          {/* Lakshadweep */}
          <g>
            <circle cx="160" cy="510" r="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="155" cy="525" r="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="95" y="525" fill="#94A3B8" fontSize="9" fontWeight="500">
              Lakshadweep
            </text>
          </g>

          {/* 0.25° India Rainfall Grids */}
          <g className="grids-layer">
            {grids.map((grid) => {
              const { x, y } = project(grid.lon, grid.lat, 700, 720);
              const isSelected = selectedGridId === grid.id;
              const color = getCellColor(grid);
              const cellSize = Math.max(5.5, 6.2 * zoomLevel);

              return (
                <g key={grid.id} transform={`translate(${x - cellSize / 2}, ${y - cellSize / 2})`}>
                  <rect
                    width={cellSize}
                    height={cellSize}
                    rx={1.2}
                    fill={color}
                    stroke={isSelected ? "#08213D" : "rgba(255,255,255,0.4)"}
                    strokeWidth={isSelected ? 2 : 0.4}
                    className="cursor-pointer transition-colors duration-150 hover:stroke-[#0B2A4A] hover:stroke-[1.5]"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectGrid(grid.id);
                    }}
                    onMouseEnter={(e) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                      setHoveredGrid(grid);
                    }}
                    onMouseLeave={() => setHoveredGrid(null)}
                  />
                  {isSelected && (
                    <circle
                      cx={cellSize / 2}
                      cy={cellSize / 2}
                      r={cellSize + 2}
                      fill="none"
                      stroke="#2F80D9"
                      strokeWidth="1.8"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoveredGrid && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none p-3 bg-[#0B2A4A]/95 text-white rounded-xl shadow-xl backdrop-blur-xs text-xs border border-white/20 -translate-x-1/2 -translate-y-full mb-3"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="flex items-center justify-between gap-3 font-semibold border-b border-white/15 pb-1 mb-1.5">
              <span className="text-brand-blue-light">{hoveredGrid.id}</span>
              <span className="text-[10px] text-slate-300">
                {formatLatLon(hoveredGrid.lat, hoveredGrid.lon)}
              </span>
            </div>
            <div className="text-slate-200 font-medium">
              {hoveredGrid.district}, {hoveredGrid.state}
            </div>
            <div className="mt-1 flex items-center justify-between gap-4">
              <span className="text-slate-300">Regime:</span>
              <span className="font-semibold text-emerald-300">{hoveredGrid.regime}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Rainfall:</span>
              <span className="font-bold text-amber-300">
                {formatRainfall(hoveredGrid.correctedRainfallMm)}
              </span>
            </div>
            {hoveredGrid.isTransitioning && (
              <div className="mt-1 text-[10px] text-purple-300 font-medium">
                ⚡ Transition: {hoveredGrid.regime} → {hoveredGrid.transitionTarget} (
                {Math.round((hoveredGrid.transitionProbability || 0) * 100)}%)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Zoom & Map Controls */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-white/80 shadow-md">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2.8, z + 0.25))}
          className="p-2 rounded-lg text-navy hover:bg-slate-100 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
          className="p-2 rounded-lg text-navy hover:bg-slate-100 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-lg text-navy hover:bg-slate-100 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute left-4 bottom-4 z-20 max-w-lg">
        <MapLegend layer={selectedLayer} />
      </div>

      {/* Operational Map Status Badge */}
      <div className="absolute right-4 bottom-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/80 shadow-sm text-xs font-semibold text-navy">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>17,415 Grid Domain Active</span>
        <span className="text-slate-400 font-normal">| 0.25° Res</span>
      </div>
    </div>
  );
};
