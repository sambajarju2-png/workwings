import { UtensilsCrossed, ShoppingBag, Package, PartyPopper, Sparkles, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SectorKey = "horeca" | "retail" | "logistics" | "events" | "cleaning" | "delivery";

export interface SectorConfig {
  value: SectorKey;
  label: string;
  Icon: LucideIcon;
}

export const SECTORS: SectorConfig[] = [
  { value: "horeca", label: "Horeca", Icon: UtensilsCrossed },
  { value: "retail", label: "Retail", Icon: ShoppingBag },
  { value: "logistics", label: "Logistiek", Icon: Package },
  { value: "events", label: "Events", Icon: PartyPopper },
  { value: "cleaning", label: "Schoonmaak", Icon: Sparkles },
  { value: "delivery", label: "Bezorging", Icon: Truck },
];

export const SECTOR_LABELS: Record<string, string> = {
  horeca: "Horeca", retail: "Retail", logistics: "Logistiek",
  events: "Events", cleaning: "Schoonmaak", delivery: "Bezorging",
};
