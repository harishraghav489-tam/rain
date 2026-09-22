"use client";

import React from "react";
import { Cloud, Calendar, Filter, Clock, Bell, Radio } from "lucide-react";
import { useFilterStore } from "@/store/filter-store";
import { useForecastStore } from "@/store/forecast-store";
import { ForecastLeadTime } from "@/types/forecast";
import { INDIAN_REGIONS } from "@/lib/constants";
import { ClayBadge } from "@/components/ui/clay-badge";

export const Header: React.FC = () => {
  const { selectedSeason, setSelectedSeason, selectedRegion, setSelectedRegion } = useFilterStore();
  const { leadTime, setLeadTime } = useForecastStore();

  const leadTimes: ForecastLeadTime[] = ["T+6h", "T+12h", "T+24h", "T+48h", "T+72h"];

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title & Operational Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-bold text-navy tracking-tight">
            India Rainfall Monitoring &amp; Forecasting System
          </h1>
          <ClayBadge variant="success" size="sm" dot>
            00Z OPERATIONAL
          </ClayBadge>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          NWP + AI + Regime Intelligence + Adaptive Bias Correction (NCMRWF / IMD Grid Domain)
        </p>
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

        {/* Lead Time Toggle Group */}
        <div className="flex items-center bg-[#EEF4FA] p-0.5 rounded-xl border border-slate-200/60">
          <span className="text-[11px] text-slate-400 px-2 font-medium hidden sm:inline">Lead:</span>
          {leadTimes.map((lt) => (
            <button
              key={lt}
              type="button"
              onClick={() => setLeadTime(lt)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                leadTime === lt
                  ? "bg-brand-blue text-white shadow-xs"
                  : "text-slate-600 hover:text-navy hover:bg-white/50"
              }`}
            >
              {lt}
            </button>
          ))}
        </div>

        {/* Live Ingestion Indicator */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/50">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>NWP: LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
