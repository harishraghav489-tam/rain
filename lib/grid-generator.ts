import { GridCell } from "@/types/grid";
import { RegimeType } from "./constants";

interface RegionTemplate {
  state: string;
  district: string;
  subdivision: string;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  elevation: number;
  baseRegime: RegimeType;
  baseRainfall: number;
  terrainFactor: number;
}

const REGIONAL_TEMPLATES: RegionTemplate[] = [
  // West Coast / Western Ghats (Orographic & Coastal)
  { state: "Maharashtra", district: "Ratnagiri", subdivision: "Konkan & Goa", latMin: 15.5, latMax: 18.2, lonMin: 72.8, lonMax: 74.0, elevation: 85, baseRegime: "Orographic", baseRainfall: 145.0, terrainFactor: 1.8 },
  { state: "Maharashtra", district: "Pune", subdivision: "Madhya Maharashtra", latMin: 18.0, latMax: 19.5, lonMin: 73.5, lonMax: 75.0, elevation: 560, baseRegime: "Orographic", baseRainfall: 68.0, terrainFactor: 1.3 },
  { state: "Goa", district: "North Goa", subdivision: "Konkan & Goa", latMin: 15.0, latMax: 15.8, lonMin: 73.7, lonMax: 74.3, elevation: 20, baseRegime: "Coastal", baseRainfall: 132.0, terrainFactor: 1.6 },
  { state: "Kerala", district: "Wayanad", subdivision: "Kerala & Mahe", latMin: 11.4, latMax: 12.0, lonMin: 75.8, lonMax: 76.4, elevation: 700, baseRegime: "Orographic", baseRainfall: 158.0, terrainFactor: 1.9 },
  { state: "Kerala", district: "Ernakulam", subdivision: "Kerala & Mahe", latMin: 9.8, latMax: 10.4, lonMin: 76.1, lonMax: 76.8, elevation: 15, baseRegime: "Coastal", baseRainfall: 88.0, terrainFactor: 1.2 },
  { state: "Karnataka", district: "Udupi", subdivision: "Coastal Karnataka", latMin: 13.1, latMax: 13.9, lonMin: 74.6, lonMax: 75.2, elevation: 35, baseRegime: "Coastal", baseRainfall: 140.0, terrainFactor: 1.7 },

  // East Coast & Bay of Bengal Low / Depression Track
  { state: "Odisha", district: "Puri", subdivision: "Odisha", latMin: 19.5, latMax: 20.3, lonMin: 85.5, lonMax: 86.4, elevation: 12, baseRegime: "Monsoon Low / Depression", baseRainfall: 112.0, terrainFactor: 1.4 },
  { state: "Odisha", district: "Balasore", subdivision: "Odisha", latMin: 21.2, latMax: 21.8, lonMin: 86.6, lonMax: 87.2, elevation: 18, baseRegime: "Monsoon Low / Depression", baseRainfall: 95.0, terrainFactor: 1.3 },
  { state: "West Bengal", district: "South 24 Parganas", subdivision: "Gangetic West Bengal", latMin: 21.8, latMax: 22.6, lonMin: 88.1, lonMax: 89.1, elevation: 9, baseRegime: "Monsoon Low / Depression", baseRainfall: 84.0, terrainFactor: 1.2 },
  { state: "Andhra Pradesh", district: "Visakhapatnam", subdivision: "Coastal Andhra Pradesh", latMin: 17.5, latMax: 18.2, lonMin: 83.1, lonMax: 83.7, elevation: 25, baseRegime: "Coastal", baseRainfall: 62.0, terrainFactor: 1.1 },

  // Central Monsoon Trough (Active Monsoon)
  { state: "Madhya Pradesh", district: "Hoshangabad", subdivision: "West Madhya Pradesh", latMin: 22.4, latMax: 23.2, lonMin: 77.4, lonMax: 78.4, elevation: 310, baseRegime: "Active Monsoon", baseRainfall: 76.0, terrainFactor: 1.0 },
  { state: "Chhattisgarh", district: "Raipur", subdivision: "Chhattisgarh", latMin: 21.0, latMax: 21.6, lonMin: 81.4, lonMax: 82.2, elevation: 295, baseRegime: "Active Monsoon", baseRainfall: 82.0, terrainFactor: 1.0 },
  { state: "Jharkhand", district: "Ranchi", subdivision: "Jharkhand", latMin: 23.1, latMax: 23.6, lonMin: 85.1, lonMax: 85.6, elevation: 650, baseRegime: "Active Monsoon", baseRainfall: 58.0, terrainFactor: 1.1 },

  // East & Northeast India (Heavy Orographic & Lows)
  { state: "Assam", district: "Kamrup", subdivision: "Assam & Meghalaya", latMin: 26.0, latMax: 26.6, lonMin: 91.4, lonMax: 92.1, elevation: 55, baseRegime: "Orographic", baseRainfall: 110.0, terrainFactor: 1.5 },
  { state: "Meghalaya", district: "East Khasi Hills", subdivision: "Assam & Meghalaya", latMin: 25.2, latMax: 25.7, lonMin: 91.6, lonMax: 92.2, elevation: 1400, baseRegime: "Orographic", baseRainfall: 210.0, terrainFactor: 2.2 },
  { state: "Bihar", district: "Patna", subdivision: "Bihar", latMin: 25.4, latMax: 25.9, lonMin: 85.0, lonMax: 85.4, elevation: 53, baseRegime: "Break Monsoon", baseRainfall: 24.0, terrainFactor: 0.8 },

  // Northwest India & Western Disturbances
  { state: "Rajasthan", district: "Jodhpur", subdivision: "West Rajasthan", latMin: 26.0, latMax: 26.7, lonMin: 72.8, lonMax: 73.5, elevation: 230, baseRegime: "Break Monsoon", baseRainfall: 4.5, terrainFactor: 0.4 },
  { state: "Gujarat", district: "Surat", subdivision: "Gujarat Region", latMin: 21.0, latMax: 21.4, lonMin: 72.7, lonMax: 73.2, elevation: 13, baseRegime: "Active Monsoon", baseRainfall: 78.0, terrainFactor: 1.1 },
  { state: "Himachal Pradesh", district: "Shimla", subdivision: "Himachal Pradesh", latMin: 31.0, latMax: 31.4, lonMin: 77.0, lonMax: 77.3, elevation: 2200, baseRegime: "Western Disturbance", baseRainfall: 48.0, terrainFactor: 1.4 },
  { state: "Uttarakhand", district: "Dehradun", subdivision: "Uttarakhand", latMin: 30.1, latMax: 30.6, lonMin: 77.9, lonMax: 78.2, elevation: 640, baseRegime: "Western Disturbance", baseRainfall: 72.0, terrainFactor: 1.5 },
  { state: "Uttar Pradesh", district: "Lucknow", subdivision: "East Uttar Pradesh", latMin: 26.7, latMax: 27.1, lonMin: 80.8, lonMax: 81.1, elevation: 123, baseRegime: "Break Monsoon", baseRainfall: 18.0, terrainFactor: 0.9 },

  // South Peninsula
  { state: "Tamil Nadu", district: "Chennai", subdivision: "Tamil Nadu, Puducherry & Karaikal", latMin: 12.9, latMax: 13.3, lonMin: 80.1, lonMax: 80.4, elevation: 10, baseRegime: "Break Monsoon", baseRainfall: 12.0, terrainFactor: 0.6 },
  { state: "Telangana", district: "Hyderabad", subdivision: "Telangana", latMin: 17.2, latMax: 17.6, lonMin: 78.3, lonMax: 78.7, elevation: 540, baseRegime: "Active Monsoon", baseRainfall: 36.0, terrainFactor: 0.9 },
  
  // Island groups
  { state: "Andaman and Nicobar", district: "South Andaman", subdivision: "Andaman & Nicobar Islands", latMin: 11.5, latMax: 12.0, lonMin: 92.6, lonMax: 93.0, elevation: 20, baseRegime: "Coastal", baseRainfall: 92.0, terrainFactor: 1.2 },
  { state: "Lakshadweep", district: "Kavaratti", subdivision: "Lakshadweep", latMin: 10.4, latMax: 10.8, lonMin: 72.5, lonMax: 72.9, elevation: 5, baseRegime: "Coastal", baseRainfall: 85.0, terrainFactor: 1.1 },
];

/**
 * Generates an operational slice of India's 0.25° grid cells.
 * Nominal step: 0.25° in latitude and longitude.
 */
export function generateIndiaGridDataset(step = 0.25): GridCell[] {
  const cells: GridCell[] = [];
  let gridCounter = 10001;

  for (const template of REGIONAL_TEMPLATES) {
    const latSteps = Math.max(2, Math.round((template.latMax - template.latMin) / step));
    const lonSteps = Math.max(2, Math.round((template.lonMax - template.lonMin) / step));

    for (let i = 0; i <= latSteps; i++) {
      for (let j = 0; j <= lonSteps; j++) {
        const lat = Number((template.latMin + i * step).toFixed(2));
        const lon = Number((template.lonMin + j * step).toFixed(2));

        // Spatial pseudorandom perturbation
        const seed = Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453;
        const rand = seed - Math.floor(seed);
        const rand2 = Math.cos(lat * 3.1415 + lon * 2.7182) * 0.5 + 0.5;

        // Realistic NWP simulation with bias
        const rawRainfall = Math.max(0, template.baseRainfall * (0.7 + rand * 0.6) * template.terrainFactor);
        
        // NWP models often underpredict heavy orographic / depression rainfall and overpredict drizzle
        let bias = 0;
        if (rawRainfall > 50) {
          bias = Math.round(15 + rand * 25); // NWP was underpredicting by 15-40mm
        } else if (rawRainfall > 15) {
          bias = Math.round((rand - 0.5) * 15);
        } else {
          bias = Math.round(-3 + rand * 2);
        }

        const correctedRainfall = Math.max(0, Number((rawRainfall + bias).toFixed(1)));
        const anomaly = Number((correctedRainfall - template.baseRainfall * 0.8).toFixed(1));

        // Regime transition conditions
        const isDepressionTrack = template.baseRegime === "Monsoon Low / Depression" || (template.baseRegime === "Active Monsoon" && rand > 0.65);
        const isTransitioning = rand > 0.72;
        let transitionTarget: RegimeType | undefined;
        let transitionProbability: number | undefined;

        if (isTransitioning) {
          if (template.baseRegime === "Active Monsoon") {
            transitionTarget = isDepressionTrack ? "Monsoon Low / Depression" : "Break Monsoon";
            transitionProbability = Number((0.65 + rand * 0.3).toFixed(2));
          } else if (template.baseRegime === "Monsoon Low / Depression") {
            transitionTarget = "Coastal";
            transitionProbability = Number((0.70 + rand * 0.25).toFixed(2));
          } else if (template.baseRegime === "Break Monsoon") {
            transitionTarget = "Active Monsoon";
            transitionProbability = Number((0.55 + rand * 0.35).toFixed(2));
          } else {
            transitionTarget = "Active Monsoon";
            transitionProbability = Number((0.60 + rand * 0.3).toFixed(2));
          }
        }

        // Uncertainty quantiles (P10, P50, P90)
        const spreadFactor = 0.35 + (template.terrainFactor - 1.0) * 0.2 + (rand * 0.15);
        const p50 = correctedRainfall;
        const p10 = Math.max(0, Number((p50 * (1 - spreadFactor)).toFixed(1)));
        const p90 = Number((p50 * (1 + spreadFactor * 1.3)).toFixed(1));

        // Shannon entropy based on transition & spread
        const entropy = Number((0.2 + (isTransitioning ? 0.45 : 0.1) + rand * 0.2).toFixed(2));
        const confidence: "High" | "Medium" | "Low" = entropy < 0.4 ? "High" : entropy < 0.7 ? "Medium" : "Low";

        cells.push({
          id: `G${gridCounter++}`,
          lat,
          lon,
          state: template.state,
          district: template.district,
          subdivision: template.subdivision,
          elevationM: Math.round(template.elevation + rand * 40),
          nwpRainfallMm: Number(rawRainfall.toFixed(1)),
          correctedRainfallMm: correctedRainfall,
          biasMm: bias,
          anomalyMm: anomaly,
          regime: template.baseRegime,
          regimeProbability: Number((0.75 + rand * 0.22).toFixed(2)),
          isTransitioning,
          transitionTarget,
          transitionProbability,
          nwpRegimeLagHours: isTransitioning ? (rand > 0.5 ? 6 : 12) : 0,
          neighbourConsistency: Number((0.78 + rand * 0.19).toFixed(2)),
          p10Mm: p10,
          p50Mm: p50,
          p90Mm: p90,
          entropy,
          confidence,
        });
      }
    }
  }

  return cells;
}

// Cached singleton instance
let cachedGrids: GridCell[] | null = null;

export function getIndiaGrids(): GridCell[] {
  if (!cachedGrids) {
    cachedGrids = generateIndiaGridDataset(0.25);
  }
  return cachedGrids;
}

export function findGridById(id: string): GridCell | undefined {
  const grids = getIndiaGrids();
  return grids.find((g) => g.id.toLowerCase() === id.toLowerCase());
}
