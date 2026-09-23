"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { useFilterStore } from "@/store/filter-store";

export const Header: React.FC = () => {
  const { selectedSeason, setSelectedSeason } = useFilterStore();

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title */}
      <div>
        <h1 className="text-base sm:text-lg font-bold text-navy tracking-tight">
          India Rainfall Monitoring &amp; Forecasting System
        </h1>
      </div>

      {/* Operational Controls & Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Season Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-navy">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="Monsoon 2026">Monsoon 2026 (JJAS)</option>
            <option value="Pre-Monsoon 2026">Pre-Monsoon 2026</option>
            <option value="Post-Monsoon 2025">Post-Monsoon 2025</option>
          </select>
        </div>
      </div>
    </header>
  );
};
