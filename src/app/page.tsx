"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";

/* ─── Data ───────────────────────────────────────────────────────────── */

interface Listing {
  id: number;
  name: string;
  provider: string;
  category: string;
  description: string;
  ageMin: number;
  ageMax: number;
  city: string;
  costTier: string;
  costLabel: string;
  costAmount: number;
  costPeriod: "month" | "week" | "season" | "program";
  hoursPerSession: number;
  sessionsPerWeek: number;
  days: string[];
  sessionTypes: string[];
  website: string;
  featured: boolean;
  lat: number;
  lng: number;
}

const LISTINGS: Listing[] = [
  { id: 1, name: "Recreational Soccer", provider: "AYSO Region 130", category: "Sports", description: "Co-ed recreational soccer for all skill levels. Focuses on teamwork, fun, and fundamentals. Walnut Creek's most popular youth league.", ageMin: 4, ageMax: 14, city: "Walnut Creek", costTier: "low", costLabel: "~$120/season", costAmount: 120, costPeriod: "season", hoursPerSession: 1.5, sessionsPerWeek: 1, days: ["Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: true, lat: 37.9063, lng: -122.0574 },
  { id: 2, name: "Young Artists Studio", provider: "Diablo Valley Art Academy", category: "Arts", description: "Weekly painting, drawing, and mixed media classes in a nurturing studio environment. Small class sizes, all materials included.", ageMin: 5, ageMax: 13, city: "Walnut Creek", costTier: "medium", costLabel: "~$180/month", costAmount: 180, costPeriod: "month", hoursPerSession: 1.5, sessionsPerWeek: 2, days: ["Tue", "Thu"], sessionTypes: ["after-school"], website: "#", featured: false, lat: 37.9016, lng: -122.0636 },
  { id: 3, name: "Scratch & Python Coding", provider: "Code Ninjas Walnut Creek", category: "STEM", description: "Kids learn real coding skills through game development. Progress at their own pace through a structured belt system.", ageMin: 7, ageMax: 14, city: "Walnut Creek", costTier: "medium", costLabel: "~$200/month", costAmount: 200, costPeriod: "month", hoursPerSession: 1, sessionsPerWeek: 2, days: ["Mon", "Wed", "Fri", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: true, lat: 37.8933, lng: -122.0594 },
  { id: 4, name: "Ballet & Creative Movement", provider: "Lamorinda Dance Center", category: "Dance", description: "Classical ballet training for beginners through advanced. Caring instructors, annual recital. Located in Lafayette.", ageMin: 3, ageMax: 16, city: "Lafayette", costTier: "medium", costLabel: "~$160/month", costAmount: 160, costPeriod: "month", hoursPerSession: 1, sessionsPerWeek: 2, days: ["Mon", "Wed", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false, lat: 37.8858, lng: -122.1178 },
  { id: 5, name: "Math Enrichment", provider: "Mathnasium of Walnut Creek", category: "Academic", description: "Personalized math tutoring and enrichment. Works for kids who are struggling and those looking to get ahead.", ageMin: 5, ageMax: 18, city: "Walnut Creek", costTier: "medium", costLabel: "~$250/month", costAmount: 250, costPeriod: "month", hoursPerSession: 1, sessionsPerWeek: 2, days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false, lat: 37.8956, lng: -122.0510 },
  { id: 6, name: "Junior Rangers Nature Program", provider: "Save Mount Diablo", category: "Outdoor", description: "Hands-on nature education on local trails. Kids learn wildlife identification, conservation, and stewardship of East Bay open spaces.", ageMin: 6, ageMax: 12, city: "Walnut Creek", costTier: "low", costLabel: "~$60/program", costAmount: 60, costPeriod: "program", hoursPerSession: 3, sessionsPerWeek: 1, days: ["Sat", "Sun"], sessionTypes: ["weekend"], website: "#", featured: false, lat: 37.8816, lng: -121.9742 },
  { id: 7, name: "Piano & Guitar Lessons", provider: "Orinda Music Academy", category: "Music", description: "Private and group lessons for all levels. Patient instructors specializing in kids who have never touched an instrument before.", ageMin: 5, ageMax: 17, city: "Orinda", costTier: "medium", costLabel: "~$140/month", costAmount: 140, costPeriod: "month", hoursPerSession: 1, sessionsPerWeek: 1, days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false, lat: 37.8771, lng: -122.1797 },
  { id: 8, name: "Summer Science Camp", provider: "Mad Science East Bay", category: "STEM", description: "Week-long summer camps focused on hands-on experiments, rockets, slime, and real science. Kids go home excited about learning.", ageMin: 5, ageMax: 12, city: "Moraga", costTier: "medium", costLabel: "~$350/week", costAmount: 350, costPeriod: "week", hoursPerSession: 6, sessionsPerWeek: 5, days: ["Mon", "Tue", "Wed", "Thu", "Fri"], sessionTypes: ["summer"], website: "#", featured: false, lat: 37.8349, lng: -122.1297 },
  { id: 9, name: "Youth Theater Workshop", provider: "Town Hall Theatre", category: "Theater", description: "Walnut Creek's beloved community theater runs year-round youth programs. Build confidence, memorization, and stage presence.", ageMin: 7, ageMax: 16, city: "Walnut Creek", costTier: "low", costLabel: "~$95/session", costAmount: 95, costPeriod: "season", hoursPerSession: 2, sessionsPerWeek: 1, days: ["Sat"], sessionTypes: ["weekend", "summer"], website: "#", featured: true, lat: 37.9024, lng: -122.0600 },
  { id: 10, name: "Hip Hop & Contemporary Dance", provider: "Moraga Dance Academy", category: "Dance", description: "High-energy classes in hip hop, jazz, and contemporary styles. Performance opportunities throughout the year.", ageMin: 5, ageMax: 15, city: "Moraga", costTier: "medium", costLabel: "~$150/month", costAmount: 150, costPeriod: "month", hoursPerSession: 1, sessionsPerWeek: 2, days: ["Tue", "Thu", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false, lat: 37.8355, lng: -122.1302 },
  { id: 11, name: "Lafayette Swim Lessons", provider: "Lafayette Community Pool", category: "Sports", description: "Year-round swim lessons for all levels, from water introduction through competitive stroke development.", ageMin: 3, ageMax: 14, city: "Lafayette", costTier: "low", costLabel: "~$80/month", costAmount: 80, costPeriod: "month", hoursPerSession: 0.75, sessionsPerWeek: 3, days: ["Mon", "Wed", "Fri", "Sat", "Sun"], sessionTypes: ["after-school", "weekend", "summer"], website: "#", featured: false, lat: 37.8862, lng: -122.1185 },
  { id: 12, name: "Spanish Immersion", provider: "Habla Language Academy", category: "Academic", description: "Conversational Spanish for kids using games, songs, and stories. No prior experience needed. Classes held in Lafayette.", ageMin: 4, ageMax: 12, city: "Lafayette", costTier: "low", costLabel: "~$85/month", costAmount: 85, costPeriod: "month", hoursPerSession: 1, sessionsPerWeek: 1, days: ["Wed", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false, lat: 37.8913, lng: -122.1186 },
];

const CATEGORIES = ["All", "Sports", "Arts", "STEM", "Dance", "Academic", "Outdoor", "Music", "Theater"];
const CITY_GROUPS = [
  { label: "Lamorinda", cities: ["Walnut Creek", "Lafayette", "Moraga", "Orinda"] },
  { label: "Tri-Valley", cities: ["Danville", "San Ramon", "Alamo"] },
  { label: "Central Contra Costa", cities: ["Concord", "Pleasant Hill", "Martinez", "Clayton"] },
  { label: "East Contra Costa", cities: ["Antioch", "Pittsburg", "Brentwood", "Oakley", "Bay Point", "Discovery Bay"] },
];
const CITIES = ["All Areas", ...CITY_GROUPS.flatMap(g => g.cities)];
const COST_TIERS = [{ value: "all", label: "Any Budget" }, { value: "low", label: "Under $100/mo" }, { value: "medium", label: "$100\u2013$300/mo" }, { value: "high", label: "$300+/mo" }];
const AGE_RANGES = [{ value: "all", label: "Any Age" }, { value: "0-5", label: "Under 5" }, { value: "5-8", label: "5\u20138" }, { value: "8-12", label: "8\u201312" }, { value: "12-18", label: "12+" }];
const SESSION_TYPES = [{ value: "after-school", label: "After School" }, { value: "weekend", label: "Weekends" }, { value: "summer", label: "Summer" }];
const CATEGORY_ICONS: Record<string, string> = { Sports: "\u26BD", Arts: "\uD83C\uDFA8", STEM: "\uD83D\uDD2C", Dance: "\uD83D\uDC83", Academic: "\uD83D\uDCDA", Outdoor: "\uD83C\uDF3F", Music: "\uD83C\uDFB5", Theater: "\uD83C\uDFAD" };
const AVATAR_OPTIONS = ["\uD83E\uDD95", "\uD83D\uDE80", "\uD83C\uDFA8", "\u26BD", "\uD83E\uDD84", "\uD83C\uDF08", "\uD83C\uDFB8", "\uD83D\uDD2C", "\uD83D\uDC36", "\uD83C\uDF0A", "\uD83C\uDFC0", "\uD83E\uDD8B", "\uD83C\uDFAD", "\uD83C\uDF1F", "\uD83D\uDC31", "\uD83C\uDFAA", "\uD83C\uDFD4\uFE0F", "\uD83C\uDFB9", "\uD83D\uDC38", "\uD83C\uDF55", "\uD83D\uDEF9"];
const ACCENT_COLORS = [
  { value: "#4A7C59", label: "Sage" },
  { value: "#2563EB", label: "Sky" },
  { value: "#7C3AED", label: "Grape" },
  { value: "#DC2626", label: "Berry" },
  { value: "#D97706", label: "Honey" },
  { value: "#0891B2", label: "Teal" },
  { value: "#BE185D", label: "Rose" },
  { value: "#EA580C", label: "Tangerine" },
];
const CALENDAR_COLORS = ["#4A7C59", "#D97706", "#2563EB", "#DC2626", "#7C3AED", "#0891B2", "#BE185D", "#65A30D", "#EA580C", "#4338CA"];
const DAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

interface PresetLocation { label: string; city: string; lat: number; lng: number }

const PRESET_LOCATIONS: PresetLocation[] = [
  // Walnut Creek
  { label: "Walnut Creek BART", city: "Walnut Creek", lat: 37.9055, lng: -122.0674 },
  { label: "Heather Farm Park", city: "Walnut Creek", lat: 37.9063, lng: -122.0574 },
  { label: "Broadway Plaza", city: "Walnut Creek", lat: 37.8998, lng: -122.0615 },
  { label: "Northgate High School", city: "Walnut Creek", lat: 37.9183, lng: -122.0497 },
  { label: "Walnut Creek Intermediate", city: "Walnut Creek", lat: 37.9024, lng: -122.0541 },
  { label: "Parkmead Elementary", city: "Walnut Creek", lat: 37.9100, lng: -122.0497 },
  { label: "Buena Vista Elementary", city: "Walnut Creek", lat: 37.8988, lng: -122.0705 },
  // Lafayette
  { label: "Lafayette BART", city: "Lafayette", lat: 37.8934, lng: -122.1246 },
  { label: "Lafayette Reservoir", city: "Lafayette", lat: 37.8848, lng: -122.1421 },
  { label: "Downtown Lafayette", city: "Lafayette", lat: 37.8934, lng: -122.1178 },
  { label: "Acalanes High School", city: "Lafayette", lat: 37.8886, lng: -122.1114 },
  { label: "Stanley Middle School", city: "Lafayette", lat: 37.8927, lng: -122.1076 },
  { label: "Lafayette Elementary", city: "Lafayette", lat: 37.8927, lng: -122.1186 },
  { label: "Happy Valley Elementary", city: "Lafayette", lat: 37.8790, lng: -122.1120 },
  // Moraga
  { label: "Moraga Commons Park", city: "Moraga", lat: 37.8353, lng: -122.1298 },
  { label: "Campolindo High School", city: "Moraga", lat: 37.8498, lng: -122.1309 },
  { label: "Joaquin Moraga Intermediate", city: "Moraga", lat: 37.8380, lng: -122.1250 },
  { label: "Rheem Elementary", city: "Moraga", lat: 37.8507, lng: -122.1259 },
  // Orinda
  { label: "Orinda BART", city: "Orinda", lat: 37.8784, lng: -122.1836 },
  { label: "Orinda Village", city: "Orinda", lat: 37.8768, lng: -122.1792 },
  { label: "Miramonte High School", city: "Orinda", lat: 37.8698, lng: -122.1835 },
  { label: "Orinda Intermediate School", city: "Orinda", lat: 37.8780, lng: -122.1756 },
  { label: "Glorietta Elementary", city: "Orinda", lat: 37.8717, lng: -122.1713 },
  // Danville
  { label: "Downtown Danville", city: "Danville", lat: 37.8216, lng: -121.9999 },
  { label: "Monte Vista High School", city: "Danville", lat: 37.8060, lng: -121.9810 },
  { label: "Osage Station Park", city: "Danville", lat: 37.8030, lng: -122.0080 },
  // San Ramon
  { label: "San Ramon City Center", city: "San Ramon", lat: 37.7799, lng: -121.9780 },
  { label: "California High School", city: "San Ramon", lat: 37.7620, lng: -121.9590 },
  { label: "Dougherty Valley High School", city: "San Ramon", lat: 37.7690, lng: -121.9250 },
  { label: "Central Park (San Ramon)", city: "San Ramon", lat: 37.7650, lng: -121.9540 },
  // Alamo
  { label: "Alamo Plaza", city: "Alamo", lat: 37.8500, lng: -122.0320 },
  { label: "Rancho Romero Elementary", city: "Alamo", lat: 37.8480, lng: -122.0240 },
  // Concord
  { label: "Concord BART", city: "Concord", lat: 37.9740, lng: -122.0290 },
  { label: "Todos Santos Plaza", city: "Concord", lat: 37.9779, lng: -122.0311 },
  { label: "Mt. Diablo High School", city: "Concord", lat: 37.9695, lng: -122.0195 },
  { label: "Concord Community Park", city: "Concord", lat: 37.9680, lng: -122.0080 },
  // Pleasant Hill
  { label: "Pleasant Hill BART", city: "Pleasant Hill", lat: 37.9284, lng: -122.0560 },
  { label: "College Park High School", city: "Pleasant Hill", lat: 37.9543, lng: -122.0656 },
  { label: "Pleasant Hill Park", city: "Pleasant Hill", lat: 37.9530, lng: -122.0740 },
  // Martinez
  { label: "Downtown Martinez", city: "Martinez", lat: 38.0194, lng: -122.1341 },
  { label: "Alhambra High School", city: "Martinez", lat: 38.0040, lng: -122.1230 },
  // Clayton
  { label: "Clayton Town Center", city: "Clayton", lat: 37.9410, lng: -121.9360 },
  // Antioch
  { label: "Downtown Antioch", city: "Antioch", lat: 38.0049, lng: -121.8058 },
  { label: "Antioch High School", city: "Antioch", lat: 37.9930, lng: -121.8050 },
  // Pittsburg
  { label: "Pittsburg/Bay Point BART", city: "Pittsburg", lat: 38.0189, lng: -121.9453 },
  { label: "Downtown Pittsburg", city: "Pittsburg", lat: 38.0280, lng: -121.8840 },
  // Brentwood
  { label: "Downtown Brentwood", city: "Brentwood", lat: 37.9319, lng: -121.6958 },
  { label: "Heritage High School", city: "Brentwood", lat: 37.9220, lng: -121.7050 },
  // Oakley
  { label: "Downtown Oakley", city: "Oakley", lat: 37.9974, lng: -121.7127 },
  // Bay Point
  { label: "Ambrose Community Center", city: "Bay Point", lat: 38.0290, lng: -121.9610 },
  // Discovery Bay
  { label: "Discovery Bay Town Center", city: "Discovery Bay", lat: 37.9085, lng: -121.6020 },
  // Private & Charter Schools
  { label: "Seven Hills School", city: "Walnut Creek", lat: 37.9050, lng: -122.0555 },
  { label: "Berean Christian High School", city: "Walnut Creek", lat: 37.9100, lng: -122.0620 },
  { label: "Valle Verde Elementary", city: "Walnut Creek", lat: 37.9130, lng: -122.0420 },
  { label: "The Athenian School", city: "Danville", lat: 37.8360, lng: -122.0180 },
  { label: "Saklan Valley School", city: "Moraga", lat: 37.8340, lng: -122.1260 },
  { label: "Orinda Academy", city: "Orinda", lat: 37.8780, lng: -122.1800 },
  { label: "Holden High School", city: "Orinda", lat: 37.8771, lng: -122.1790 },
  { label: "Bentley School", city: "Lafayette", lat: 37.8835, lng: -122.1203 },
  { label: "St. Perpetua School", city: "Lafayette", lat: 37.8935, lng: -122.1180 },
  { label: "Meher Schools", city: "Lafayette", lat: 37.8900, lng: -122.1240 },
  { label: "De La Salle High School", city: "Concord", lat: 37.9550, lng: -122.0300 },
  { label: "Carondelet High School", city: "Concord", lat: 37.9540, lng: -122.0310 },
  { label: "Clayton Valley Charter High School", city: "Clayton", lat: 37.9410, lng: -121.9370 },
];

const SCHOOLS = PRESET_LOCATIONS.filter(p => /Elementary|Middle|Intermediate|High School/.test(p.label)).map(p => ({ label: p.label, city: p.city }));

const QUIZ_STEPS = [
  { id: "interest", question: "What is your kid into?", subtitle: "Pick as many as you\u2019d like", type: "multi", options: CATEGORIES.slice(1).map(c => ({ value: c, label: `${CATEGORY_ICONS[c]} ${c}` })) },
  { id: "age", question: "How old is your kid?", type: "single", options: AGE_RANGES.slice(1) },
  { id: "when", question: "When are you looking for?", type: "multi", options: SESSION_TYPES },
  { id: "area", question: "Which area works for your family?", type: "single", options: [{ value: "All Areas", label: "All Areas" }, ...CITY_GROUPS.map(g => ({ value: g.label, label: g.label }))] },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function ageToFilterValue(age: number): string {
  if (age < 5) return "0-5";
  if (age <= 8) return "5-8";
  if (age <= 12) return "8-12";
  return "12-18";
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function computeCostPerHour(l: Listing): number {
  switch (l.costPeriod) {
    case "month": return l.costAmount / (l.hoursPerSession * l.sessionsPerWeek * 4.3);
    case "week": return l.costAmount / (l.hoursPerSession * l.sessionsPerWeek);
    case "season": return l.costAmount / (l.hoursPerSession * l.sessionsPerWeek * 12);
    case "program": return l.costAmount / l.hoursPerSession;
  }
}

function hoursPerWeekLabel(l: Listing): string {
  if (l.costPeriod === "program") return `${l.hoursPerSession}hr total`;
  const hw = l.hoursPerSession * l.sessionsPerWeek;
  return `${hw % 1 === 0 ? hw : hw.toFixed(1)}hr/wk`;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; label: string } | null> {
  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lng), label: data[0].display_name.split(",").slice(0, 3).join(",").trim() };
    }
  } catch { /* geocoding failed silently */ }
  return null;
}

/* ─── Styles ─────────────────────────────────────────────────────────── */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
  :root { --cream: #FBF7F0; --warm-white: #FFFCF7; --ink: #1C1917; --ink-light: #57534E; --ink-muted: #A8A29E; --sage: #4A7C59; --sage-light: #EAF2EC; --amber: #D97706; --amber-light: #FEF3C7; --border: #E7E0D8; --shadow-hover: 0 4px 16px rgba(28,25,23,0.12), 0 8px 32px rgba(28,25,23,0.08); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .app { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; }
  .site-header { background: var(--warm-white); border-bottom: 1px solid var(--border); padding: 0 24px; position: sticky; top: 0; z-index: 100; }
  .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .logo { cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .logo-icon { vertical-align: middle; }
  .logo-text { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); vertical-align: middle; }
  .nav-pill { background: var(--sage); color: white; border: none; border-radius: 100px; padding: 8px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
  .hero { background: var(--warm-white); padding: 0; text-align: center; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .hero-img-wrap { position: relative; width: 100%; height: 360px; overflow: hidden; }
  .hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center 45%; display: block; }
  .hero-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(251,247,240,0) 60%, rgba(251,247,240,0.85) 100%); }
  .hero-content { position: relative; padding: 24px 24px 48px; }
  .hero-content::before { content: ''; position: absolute; top: -40px; right: -60px; width: 300px; height: 300px; background: radial-gradient(circle, var(--sage-light) 0%, transparent 70%); pointer-events: none; }
  .hero-content::after { content: ''; position: absolute; bottom: -60px; left: -40px; width: 250px; height: 250px; background: radial-gradient(circle, var(--amber-light) 0%, transparent 70%); pointer-events: none; }
  .hero-tag { display: inline-block; background: var(--sage-light); color: var(--sage); font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; margin-bottom: 16px; }
  .hero h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; line-height: 1.1; letter-spacing: -1px; color: var(--ink); max-width: 640px; margin: 0 auto 16px; }
  .hero h1 em { font-style: italic; color: var(--sage); }
  .hero-sub { color: var(--ink-light); font-size: 16px; max-width: 480px; margin: 0 auto 32px; line-height: 1.6; }
  .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-primary { background: var(--sage); color: white; border: none; border-radius: 100px; padding: 14px 28px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; box-shadow: 0 2px 8px rgba(74,124,89,0.3); }
  .btn-primary:hover { background: #3d6b4c; transform: translateY(-1px); }
  .btn-secondary { background: var(--warm-white); color: var(--ink); border: 1.5px solid var(--border); border-radius: 100px; padding: 14px 28px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .btn-secondary:hover { border-color: var(--ink-muted); }
  .main-container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
  .quiz-overlay { position: fixed; inset: 0; background: rgba(28,25,23,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(4px); }
  .quiz-card { background: var(--warm-white); border-radius: 20px; padding: 40px; max-width: 540px; width: 100%; box-shadow: 0 20px 60px rgba(28,25,23,0.2); }
  .quiz-progress { display: flex; gap: 6px; margin-bottom: 28px; }
  .quiz-progress-dot { height: 4px; flex: 1; border-radius: 100px; background: var(--border); transition: background 0.2s; }
  .quiz-progress-dot.active { background: var(--sage); }
  .quiz-progress-dot.done { background: var(--sage); opacity: 0.4; }
  .quiz-question { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; color: var(--ink); margin-bottom: 6px; letter-spacing: -0.3px; }
  .quiz-subtitle { color: var(--ink-muted); font-size: 14px; margin-bottom: 24px; }
  .quiz-options { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
  .quiz-option { border: 1.5px solid var(--border); background: var(--cream); color: var(--ink); border-radius: 100px; padding: 10px 18px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .quiz-option.selected { border-color: var(--sage); background: var(--sage-light); color: var(--sage); }
  .quiz-footer { display: flex; justify-content: space-between; align-items: center; }
  .quiz-skip { background: none; border: none; color: var(--ink-muted); font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .filters-bar { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
  .filter-group { display: flex; flex-direction: column; gap: 6px; min-width: 140px; flex: 1; }
  .filter-label { font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--ink-muted); }
  .filter-select { appearance: none; background: var(--cream); border: 1.5px solid var(--border); border-radius: 10px; padding: 9px 32px 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A8A29E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
  .filter-select:focus { outline: none; border-color: var(--sage); }
  .filter-reset { background: none; border: 1.5px solid var(--border); border-radius: 10px; padding: 9px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink-muted); cursor: pointer; white-space: nowrap; }
  .session-toggles { display: flex; gap: 8px; flex-wrap: wrap; }
  .session-toggle { border: 1.5px solid var(--border); background: var(--cream); border-radius: 100px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: var(--ink-light); font-family: 'DM Sans', sans-serif; }
  .session-toggle.active { background: var(--sage-light); border-color: var(--sage); color: var(--sage); }
  .address-bar { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 16px 24px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .address-bar-icon { font-size: 18px; flex-shrink: 0; }
  .address-input { flex: 1; min-width: 200px; border: 1.5px solid var(--border); border-radius: 10px; padding: 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); background: var(--cream); }
  .address-input:focus { outline: none; border-color: var(--sage); }
  .address-btn { background: var(--sage); color: white; border: none; border-radius: 10px; padding: 9px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .address-btn:hover { background: #3d6b4c; }
  .address-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .address-active { font-size: 13px; color: var(--ink-light); display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; }
  .address-clear { background: none; border: none; color: var(--ink-muted); font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: underline; }
  .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .results-count { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--ink); }
  .results-count span { color: var(--sage); }
  .results-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .shortlist-toggle { border: 1.5px solid var(--border); background: var(--cream); border-radius: 100px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: var(--ink-light); font-family: 'DM Sans', sans-serif; }
  .shortlist-toggle.active { background: var(--sage-light); border-color: var(--sage); color: var(--sage); }
  .sort-btn { border: 1.5px solid var(--border); background: var(--cream); border-radius: 100px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: var(--ink-light); font-family: 'DM Sans', sans-serif; }
  .sort-btn.active { background: var(--sage-light); border-color: var(--sage); color: var(--sage); }
  .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .listing-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 22px; cursor: default; transition: all 0.2s; display: flex; flex-direction: column; gap: 12px; position: relative; }
  .listing-card:hover { border-color: var(--sage); box-shadow: var(--shadow-hover); transform: translateY(-2px); }
  .listing-card.featured { border-color: var(--border); }
  .featured-bar { background: var(--amber-light); margin: -22px -22px 12px -22px; padding: 6px 22px; border-radius: 15px 15px 0 0; display: flex; align-items: center; gap: 6px; }
  .featured-bar-label { font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: var(--amber); }
  .card-header { display: flex; align-items: flex-start; gap: 12px; }
  .card-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--sage-light); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .card-title-wrap { flex: 1; min-width: 0; }
  .card-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: var(--ink); letter-spacing: -0.2px; line-height: 1.3; }
  .card-provider { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
  .rating-select { appearance: none; background: var(--cream); border: 1.5px solid var(--border); border-radius: 8px; padding: 5px 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink-muted); cursor: pointer; flex-shrink: 0; transition: all 0.15s; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A8A29E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; padding-right: 24px; }
  .rating-select:focus { outline: none; border-color: var(--sage); }
  .rating-select.rated { border-color: var(--sage); color: var(--ink); background-color: var(--sage-light); }
  .listing-card.liked { border-color: var(--sage); }
  .listing-card.noped { opacity: 0.45; border-style: dashed; }
  .card-description { font-size: 13px; color: var(--ink-light); line-height: 1.55; }
  .card-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
  .meta-chip { background: var(--cream); border: 1px solid var(--border); border-radius: 100px; padding: 4px 10px; font-size: 12px; color: var(--ink-light); font-weight: 500; }
  .meta-chip.age { background: var(--sage-light); border-color: var(--sage-light); color: var(--sage); }
  .meta-chip.cost { background: var(--amber-light); border-color: var(--amber-light); color: var(--amber); }
  .meta-chip.rate { background: #FFF7ED; border-color: #FFF7ED; color: #C2410C; }
  .meta-chip.distance { background: #EFF6FF; border-color: #EFF6FF; color: #2563EB; }
  .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); }
  .card-city { font-size: 12px; color: var(--ink-muted); }
  .card-link { font-size: 13px; font-weight: 600; color: var(--sage); text-decoration: none; }
  .card-notes { border-top: 1px solid var(--border); padding-top: 10px; }
  .note-toggle { background: none; border: none; font-size: 12px; color: var(--ink-muted); cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; display: flex; align-items: center; gap: 4px; }
  .note-toggle:hover { color: var(--sage); }
  .note-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--sage); }
  .note-area { width: 100%; border: 1.5px solid var(--border); border-radius: 10px; padding: 8px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink); background: var(--cream); resize: vertical; min-height: 60px; margin-top: 8px; line-height: 1.5; }
  .note-area:focus { outline: none; border-color: var(--sage); }
  .empty-state { text-align: center; padding: 60px 24px; color: var(--ink-light); }
  .empty-state-icon { font-size: 40px; margin-bottom: 16px; }
  .empty-state h3 { font-family: 'Fraunces', serif; font-size: 20px; color: var(--ink); margin-bottom: 8px; }
  .site-footer { border-top: 1px solid var(--border); background: var(--warm-white); margin-top: 60px; padding: 40px 24px; text-align: center; }
  .footer-logo { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .footer-tagline { color: var(--ink-muted); font-size: 13px; margin-bottom: 16px; }
  .footer-story { max-width: 480px; margin: 0 auto 20px; font-size: 13px; color: var(--ink-light); line-height: 1.6; font-style: italic; }
  .suggest-link { display: inline-block; border: 1.5px solid var(--border); border-radius: 100px; padding: 9px 20px; font-size: 13px; font-weight: 600; color: var(--sage); cursor: pointer; background: none; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .suggest-link:hover { border-color: var(--sage); background: var(--sage-light); }
  .profile-switcher { display: flex; align-items: center; gap: 6px; }
  .profile-select { appearance: none; background: var(--sage-light); border: 1.5px solid var(--sage); border-radius: 100px; padding: 6px 28px 6px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--sage); cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234A7C59' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
  .profile-select:focus { outline: none; }
  .profile-manage-btn { background: none; border: 1.5px solid var(--border); border-radius: 100px; padding: 5px 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--sage); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .profile-manage-btn:hover { border-color: var(--sage); background: var(--sage-light); }
  .profile-list { display: flex; flex-direction: column; gap: 10px; }
  .profile-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--cream); border: 1px solid var(--border); border-radius: 12px; }
  .profile-list-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
  .profile-list-name { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; color: var(--ink); }
  .profile-list-detail { font-size: 12px; color: var(--ink-muted); }
  .profile-list-actions { display: flex; gap: 6px; }
  .profile-edit-btn { background: none; border: 1px solid var(--border); border-radius: 8px; padding: 4px 10px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--sage); cursor: pointer; }
  .profile-edit-btn:hover { border-color: var(--sage); background: var(--sage-light); }
  .profile-delete-btn { background: none; border: 1px solid var(--border); border-radius: 8px; padding: 4px 10px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #DC2626; cursor: pointer; }
  .profile-delete-btn:hover { border-color: #DC2626; background: #FEF2F2; }
  .profile-form { padding-top: 12px; }
  .profile-active-banner { background: var(--sage-light); border: 1px solid var(--sage); border-radius: 12px; padding: 10px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: var(--sage); font-weight: 500; flex-wrap: wrap; gap: 8px; }
  .multi-add-btn { background: var(--cream); border: 1.5px solid var(--border); border-radius: 8px; width: 28px; height: 28px; font-size: 14px; font-weight: 600; color: var(--ink-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
  .multi-add-btn:hover { border-color: var(--sage); color: var(--sage); }
  .multi-add-wrap { position: relative; }
  .multi-add-popover { position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--warm-white); border: 1px solid var(--border); border-radius: 12px; padding: 8px; min-width: 160px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 50; }
  .multi-add-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ink-muted); padding: 4px 8px; margin-bottom: 4px; }
  .multi-add-option { display: block; width: 100%; text-align: left; background: none; border: none; padding: 6px 8px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink); cursor: pointer; }
  .multi-add-option:hover { background: var(--sage-light); }
  .multi-add-option.has-rating { color: var(--sage); }
  .avatar-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .avatar-btn { width: 44px; height: 44px; border-radius: 12px; border: 2px solid var(--border); background: var(--cream); font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .avatar-btn:hover { border-color: var(--sage); transform: scale(1.1); }
  .avatar-btn.selected { border-color: var(--sage); background: var(--sage-light); box-shadow: 0 0 0 2px var(--sage-light); }
  .color-swatch-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .color-swatch { width: 36px; height: 36px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all 0.15s; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); }
  .color-swatch:hover { transform: scale(1.15); }
  .color-swatch.selected { border-color: var(--ink); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1), 0 0 0 2px var(--warm-white), 0 0 0 4px var(--ink); }
  .header-nav-btn { background: none; border: 1.5px solid transparent; border-radius: 100px; padding: 6px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--ink-light); cursor: pointer; transition: all 0.15s; }
  .header-nav-btn:hover { color: var(--ink); }
  .header-nav-btn.active { background: var(--sage-light); border-color: var(--sage); color: var(--sage); }
  .header-breadcrumb { display: flex; align-items: center; gap: 6px; background: var(--amber-light); border-radius: 100px; padding: 5px 14px; font-size: 13px; font-weight: 600; color: var(--amber); }
  .dashboard-header { text-align: center; margin-bottom: 32px; }
  .dashboard-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: var(--ink); }
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; max-width: 720px; margin: 0 auto; }
  .dashboard-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 28px 20px; text-align: center; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .dashboard-card:hover { border-color: var(--sage); box-shadow: var(--shadow-hover); transform: translateY(-2px); }
  .dashboard-card-avatar { font-size: 56px; line-height: 1; }
  .dashboard-card-name { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--ink); }
  .dashboard-card-age { font-size: 13px; color: var(--ink-muted); }
  .dashboard-card-school { font-size: 12px; color: var(--ink-muted); }
  .dashboard-card-about { font-size: 13px; color: var(--ink-light); line-height: 1.5; }
  .dashboard-card-stats { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
  .dashboard-stat { font-size: 12px; color: var(--ink-light); font-weight: 500; }
  .dashboard-add-card { border-style: dashed; border-color: var(--ink-muted); }
  .dashboard-add-card:hover { border-color: var(--sage); border-style: solid; }
  .dashboard-add-icon { font-size: 36px; color: var(--ink-muted); line-height: 1; margin-bottom: 4px; }
  .kid-hero { padding: 48px 24px; text-align: center; border-bottom: 1px solid var(--border); }
  .kid-hero-inner { max-width: 600px; margin: 0 auto; }
  .kid-hero-avatar { display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: white; border-radius: 20px; font-size: 56px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); margin-bottom: 16px; }
  .kid-hero-title { font-family: 'Fraunces', serif; font-size: clamp(24px, 4vw, 36px); font-weight: 700; color: var(--ink); letter-spacing: -0.5px; margin-bottom: 8px; }
  .kid-hero-detail { color: var(--ink-light); font-size: 15px; margin-bottom: 20px; line-height: 1.5; }
  .kid-hero-about { color: var(--ink-light); font-size: 14px; margin-bottom: 12px; line-height: 1.5; font-style: italic; }
  .kid-hero-interests { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px; }
  .kid-interest-chip { background: rgba(255,255,255,0.7); border: 1px solid var(--border); border-radius: 100px; padding: 4px 12px; font-size: 12px; font-weight: 500; color: var(--ink-light); }
  .kid-hero-actions { display: flex; gap: 10px; justify-content: center; }
  .calendar-section { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; margin-bottom: 16px; }
  .calendar-header { display: flex; align-items: center; justify-content: space-between; }
  .calendar-toggle { background: none; border: none; font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--ink); cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .calendar-badge { background: var(--sage); color: white; border-radius: 100px; padding: 2px 8px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; }
  .calendar-nav { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 16px 0; }
  .calendar-nav-btn { background: none; border: 1.5px solid var(--border); border-radius: 8px; padding: 4px 12px; font-size: 16px; cursor: pointer; color: var(--ink-light); font-family: 'DM Sans', sans-serif; }
  .calendar-nav-btn:hover { border-color: var(--sage); color: var(--sage); }
  .calendar-month-label { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: var(--ink); min-width: 160px; text-align: center; }
  .calendar-legend { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; padding: 8px 0; }
  .calendar-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-light); }
  .calendar-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .calendar-day-header { text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ink-muted); padding: 8px 4px; }
  .calendar-cell { min-height: 56px; padding: 4px; border: 1px solid transparent; border-radius: 8px; background: var(--cream); position: relative; }
  .calendar-cell.empty { background: transparent; }
  .calendar-cell.today { border-color: var(--sage); background: var(--sage-light); }
  .calendar-cell.has-programs { cursor: pointer; }
  .calendar-cell.has-programs:hover { border-color: var(--sage); }
  .calendar-date { font-size: 12px; font-weight: 600; color: var(--ink); display: block; margin-bottom: 2px; }
  .calendar-pills { display: flex; flex-wrap: wrap; gap: 2px; }
  .calendar-pill { width: 18px; height: 4px; border-radius: 2px; }
  .calendar-overflow { font-size: 9px; color: var(--ink-muted); line-height: 1; }
  .calendar-expanded { background: var(--cream); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; margin-top: 8px; }
  .calendar-expanded-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px; color: var(--ink); }
  .calendar-expanded-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px; color: var(--ink-light); border-top: 1px solid var(--border); }
  .calendar-empty { text-align: center; padding: 24px; color: var(--ink-muted); font-size: 14px; font-style: italic; }
  @media (max-width: 640px) {
    .header-inner { flex-wrap: wrap; height: auto; padding: 10px 0; gap: 8px; }
    .dashboard-grid { grid-template-columns: 1fr; }
    .kid-hero { padding: 32px 16px; }
    .kid-hero-avatar { width: 72px; height: 72px; font-size: 40px; }
    .calendar-cell { min-height: 44px; }
    .calendar-day-header { font-size: 10px; }
  }
`;

/* ─── Component ──────────────────────────────────────────────────────── */

export default function Home() {
  const [view, setView] = useState<"search" | "dashboard" | "kid">("search");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCity, setFilterCity] = useState("All Areas");
  const [filterAge, setFilterAge] = useState("all");
  const [filterCost, setFilterCost] = useState("all");
  const [filterSessions, setFilterSessions] = useState<string[]>([]);

  // Ratings & notes (persisted, compound keys: "global:listingId" or "profileId:listingId")
  type Rating = "love" | "like" | "maybe" | "nope";
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Kid profiles (persisted)
  interface KidProfile { id: string; name: string; avatar: string; birthdate: string; about: string; accentColor: string; school: string; createdAt: number }
  const [profiles, setProfiles] = useState<KidProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Compound key helpers
  const ratingPrefix = activeProfileId ? `${activeProfileId}:` : "global:";
  const ratingKey = useCallback((id: number) => `${activeProfileId ? activeProfileId : "global"}:${id}`, [activeProfileId]);
  const getRating = useCallback((id: number): Rating | undefined => ratings[ratingKey(id)], [ratings, ratingKey]);
  const getNote = useCallback((id: number): string => notes[ratingKey(id)] || "", [notes, ratingKey]);

  // Profile UI state
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [profileFormName, setProfileFormName] = useState("");
  const [profileFormAvatar, setProfileFormAvatar] = useState("\uD83E\uDD95");
  const [profileFormBirthdate, setProfileFormBirthdate] = useState("");
  const [profileFormAbout, setProfileFormAbout] = useState("");
  const [profileFormColor, setProfileFormColor] = useState("#4A7C59");
  const [profileFormSchool, setProfileFormSchool] = useState("");
  const [profileFormSchoolCustom, setProfileFormSchoolCustom] = useState(false);
  const [multiAddOpen, setMultiAddOpen] = useState<number | null>(null);

  // UI-only state
  const [filterRating, setFilterRating] = useState<"all" | Rating>("all");
  const [showNoped, setShowNoped] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [addressInput, setAddressInput] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [showCustomAddress, setShowCustomAddress] = useState(false);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState({ year: 2026, month: 1 }); // 0-indexed, Feb 2026
  const [showCalendar, setShowCalendar] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Hydrate from localStorage (with migration from old numeric keys to compound keys)
  useEffect(() => {
    try {
      const r = localStorage.getItem("925kids-ratings");
      if (r) {
        const parsed = JSON.parse(r);
        const needsMigration = Object.keys(parsed).length > 0 && Object.keys(parsed).some(k => !k.includes(":"));
        if (needsMigration) {
          const migrated: Record<string, Rating> = {};
          for (const [k, v] of Object.entries(parsed)) migrated[k.includes(":") ? k : `global:${k}`] = v as Rating;
          setRatings(migrated);
        } else { setRatings(parsed); }
      }
      const n = localStorage.getItem("925kids-notes");
      if (n) {
        const parsed = JSON.parse(n);
        const needsMigration = Object.keys(parsed).length > 0 && Object.keys(parsed).some(k => !k.includes(":"));
        if (needsMigration) {
          const migrated: Record<string, string> = {};
          for (const [k, v] of Object.entries(parsed)) migrated[k.includes(":") ? k : `global:${k}`] = v as string;
          setNotes(migrated);
        } else { setNotes(parsed); }
      }
      const loc = localStorage.getItem("925kids-location");
      if (loc) setUserLocation(JSON.parse(loc));
      const p = localStorage.getItem("925kids-profiles");
      if (p) setProfiles(JSON.parse(p));
      const ap = localStorage.getItem("925kids-active-profile");
      if (ap) {
        const parsed = JSON.parse(ap);
        if (parsed) {
          setActiveProfileId(parsed);
          setView("kid");
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => { if (hydrated) localStorage.setItem("925kids-ratings", JSON.stringify(ratings)); }, [ratings, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("925kids-notes", JSON.stringify(notes)); }, [notes, hydrated]);
  useEffect(() => { if (hydrated && userLocation) localStorage.setItem("925kids-location", JSON.stringify(userLocation)); }, [userLocation, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("925kids-profiles", JSON.stringify(profiles)); }, [profiles, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("925kids-active-profile", JSON.stringify(activeProfileId)); }, [activeProfileId, hydrated]);

  // Guard: if on kid view but no active profile, redirect
  useEffect(() => {
    if (view === "kid" && !activeProfileId) {
      setView(profiles.length > 0 ? "dashboard" : "search");
    }
  }, [view, activeProfileId, profiles.length]);

  const setRatingForId = useCallback((id: number, rating: Rating | "") => {
    const key = ratingKey(id);
    setRatings(prev => {
      if (!rating) { const next = { ...prev }; delete next[key]; return next; }
      return { ...prev, [key]: rating };
    });
  }, [ratingKey]);

  const updateNote = useCallback((id: number, text: string) => {
    const key = ratingKey(id);
    setNotes(prev => {
      if (!text.trim()) { const next = { ...prev }; delete next[key]; return next; }
      return { ...prev, [key]: text };
    });
  }, [ratingKey]);

  const toggleNoteExpanded = useCallback((id: number) => {
    setExpandedNotes(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const handlePresetSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__custom__") { setShowCustomAddress(true); return; }
    if (!val) return;
    const preset = PRESET_LOCATIONS.find(p => p.label === val);
    if (preset) {
      setUserLocation({ lat: preset.lat, lng: preset.lng, label: preset.label });
      setShowCustomAddress(false);
    }
  }, []);

  const handleGeocode = useCallback(async () => {
    if (!addressInput.trim()) return;
    setGeocoding(true);
    const result = await geocodeAddress(addressInput.trim());
    if (result) {
      setUserLocation(result);
      setAddressInput("");
      setShowCustomAddress(false);
    } else {
      alert("Could not find that address. Try including city and state.");
    }
    setGeocoding(false);
  }, [addressInput]);

  const clearLocation = useCallback(() => {
    setUserLocation(null);
    setSortByDistance(false);
    localStorage.removeItem("925kids-location");
  }, []);

  const resetFilters = () => { setFilterCategory("All"); setFilterCity("All Areas"); setFilterAge("all"); setFilterCost("all"); setFilterSessions([]); setFilterRating("all"); };
  const toggleSession = (val: string) => setFilterSessions(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  // Profile management
  const handleProfileSwitch = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    setView("kid");
    setExpandedDay(null);
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      const age = calculateAge(profile.birthdate);
      setFilterAge(ageToFilterValue(age));
      setFilterCategory("All");
      // Auto-set location from school/neighborhood
      if (profile.school && profile.school !== "No school yet") {
        const preset = PRESET_LOCATIONS.find(p => p.label === profile.school);
        if (preset) {
          setUserLocation({ lat: preset.lat, lng: preset.lng, label: preset.label });
        }
      }
    }
  }, [profiles]);

  const startNewProfile = useCallback(() => {
    setEditingProfileId("__new__");
    setProfileFormName("");
    setProfileFormAvatar("\uD83E\uDD95");
    setProfileFormBirthdate("");
    setProfileFormAbout("");
    setProfileFormColor("#4A7C59");
    setProfileFormSchool("");
    setProfileFormSchoolCustom(false);
    setQuizAnswers({});
  }, []);

  const startEditProfile = useCallback((profile: KidProfile) => {
    setEditingProfileId(profile.id);
    setProfileFormName(profile.name);
    setProfileFormAvatar(profile.avatar || "\uD83E\uDD95");
    setProfileFormBirthdate(profile.birthdate);
    setProfileFormAbout(profile.about || "");
    setProfileFormColor(profile.accentColor || "#4A7C59");
    setProfileFormSchool(profile.school || "");
    setProfileFormSchoolCustom(profile.school ? !PRESET_LOCATIONS.some(p => p.label === profile.school) && profile.school !== "No school yet" : false);
  }, []);

  const handleSaveProfile = useCallback(() => {
    if (!profileFormName.trim() || !profileFormBirthdate) return;
    if (editingProfileId && editingProfileId !== "__new__") {
      setProfiles(prev => prev.map(p =>
        p.id === editingProfileId ? { ...p, name: profileFormName.trim(), avatar: profileFormAvatar, birthdate: profileFormBirthdate, about: profileFormAbout, accentColor: profileFormColor, school: profileFormSchool } : p
      ));
    } else {
      const newProfile: KidProfile = { id: generateId(), name: profileFormName.trim(), avatar: profileFormAvatar, birthdate: profileFormBirthdate, about: profileFormAbout, accentColor: profileFormColor, school: profileFormSchool, createdAt: Date.now() };
      setProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
      setView("kid");
      const age = calculateAge(newProfile.birthdate);
      setFilterAge(ageToFilterValue(age));
      // Apply onboarding quiz answers as filters
      const interest = quizAnswers.interest as string[] | undefined;
      const when = quizAnswers.when as string[] | undefined;
      if (interest?.length) setFilterCategory(interest[0]);
      if (when?.length) setFilterSessions(when);
      if (quizAnswers.area && quizAnswers.area !== "All Areas") {
        const group = CITY_GROUPS.find(g => g.label === quizAnswers.area);
        if (group) { setFilterCity(group.cities[0]); } else { setFilterCity(quizAnswers.area as string); }
      }
    }
    setEditingProfileId(null);
    setProfileFormName(""); setProfileFormAvatar("\uD83E\uDD95"); setProfileFormBirthdate(""); setProfileFormAbout(""); setProfileFormColor("#4A7C59"); setProfileFormSchool(""); setProfileFormSchoolCustom(false); setQuizAnswers({});
  }, [editingProfileId, profileFormName, profileFormAvatar, profileFormBirthdate, profileFormAbout, profileFormColor, profileFormSchool, quizAnswers]);

  const handleDeleteProfile = useCallback((profileId: string) => {
    if (!confirm("Delete this kid profile? Their ratings and notes will be kept.")) return;
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    if (activeProfileId === profileId) { setActiveProfileId(null); resetFilters(); }
  }, [activeProfileId]);

  const addToKidList = useCallback((profileId: string, listingId: number) => {
    const key = `${profileId}:${listingId}`;
    setRatings(prev => prev[key] ? prev : { ...prev, [key]: "like" as Rating });
    setMultiAddOpen(null);
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const nopedCount = useMemo(() => Object.entries(ratings).filter(([k, v]) => k.startsWith(ratingPrefix) && v === "nope").length, [ratings, ratingPrefix]);
  const ratedCount = useMemo(() => Object.keys(ratings).filter(k => k.startsWith(ratingPrefix)).length, [ratings, ratingPrefix]);

  const filtered = useMemo(() => {
    let results = LISTINGS.filter(l => {
      const key = `${ratingPrefix}${l.id}`;
      if (!showNoped && ratings[key] === "nope") return false;
      if (filterCategory !== "All" && l.category !== filterCategory) return false;
      if (filterCity !== "All Areas" && l.city !== filterCity) return false;
      if (filterCost !== "all" && l.costTier !== filterCost) return false;
      if (filterSessions.length > 0 && !filterSessions.some(s => l.sessionTypes.includes(s))) return false;
      if (filterAge !== "all") { const [min, max] = filterAge.split("-").map(Number); if (l.ageMax < min || l.ageMin > max) return false; }
      if (filterRating !== "all" && ratings[key] !== filterRating) return false;
      return true;
    });
    if (sortByDistance && userLocation) {
      results = [...results].sort((a, b) =>
        haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    }
    return results;
  }, [filterCategory, filterCity, filterAge, filterCost, filterSessions, filterRating, ratings, ratingPrefix, showNoped, sortByDistance, userLocation]);

  const currentQuizStep = QUIZ_STEPS[quizStep];

  const handleQuizOption = (stepId: string, value: string, type: string) => {
    if (type === "single") { setQuizAnswers(prev => ({ ...prev, [stepId]: value })); }
    else {
      setQuizAnswers(prev => {
        const current = (prev[stepId] as string[]) || [];
        return { ...prev, [stepId]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
      });
    }
  };

  const isOptionSelected = (stepId: string, value: string, type: string) =>
    type === "single" ? quizAnswers[stepId] === value : ((quizAnswers[stepId] as string[]) || []).includes(value);

  const applyQuizAnswers = () => {
    const interest = quizAnswers.interest as string[];
    const when = quizAnswers.when as string[];
    if (interest?.length) setFilterCategory(interest[0]);
    if (quizAnswers.age) setFilterAge(quizAnswers.age as string);
    if (when?.length) setFilterSessions(when);
    if (quizAnswers.area && quizAnswers.area !== "All Areas") {
      const group = CITY_GROUPS.find(g => g.label === quizAnswers.area);
      if (group) { setFilterCity(group.cities[0]); } else { setFilterCity(quizAnswers.area as string); }
    }
    setShowQuiz(false); setQuizStep(0); setQuizAnswers({});
  };

  const getDistance = (l: Listing): number | null => {
    if (!userLocation) return null;
    return haversineDistance(userLocation.lat, userLocation.lng, l.lat, l.lng);
  };

  // Kid interests (derived from rated programs)
  const kidInterests = useMemo(() => {
    if (!activeProfileId) return [];
    const cats = new Set<string>();
    LISTINGS.forEach(l => {
      const r = ratings[`${activeProfileId}:${l.id}`];
      if (r === "love" || r === "like") cats.add(l.category);
    });
    return Array.from(cats);
  }, [activeProfileId, ratings]);

  // Calendar computed values
  const calendarPrograms = useMemo(() => {
    if (!activeProfileId) return [];
    return LISTINGS.filter(l => {
      const r = ratings[`${activeProfileId}:${l.id}`];
      return r === "love" || r === "like";
    });
  }, [activeProfileId, ratings]);

  const programColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    calendarPrograms.forEach((p, i) => { map[p.id] = CALENDAR_COLORS[i % CALENDAR_COLORS.length]; });
    return map;
  }, [calendarPrograms]);

  const calendarGrid = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const cells: Array<{ date: number; dateStr: string; isToday: boolean; programs: Listing[] }> = [];
    for (let i = 0; i < firstDay; i++) cells.push({ date: 0, dateStr: "", isToday: false, programs: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayOfWeek = new Date(year, month, d).getDay();
      const dayPrograms = calendarPrograms.filter(p => p.days.some(day => DAY_MAP[day] === dayOfWeek));
      cells.push({ date: d, dateStr, isToday: dateStr === todayStr, programs: dayPrograms });
    }
    return cells;
  }, [calendarMonth, calendarPrograms]);

  const calendarMonthLabel = useMemo(() => {
    const { year, month } = calendarMonth;
    return new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
  }, [calendarMonth]);

  // Shared render helpers
  const renderFiltersBar = () => (
    <div className="filters-bar">
      <div className="filter-group"><label className="filter-label">Category</label><select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      <div className="filter-group"><label className="filter-label">Area</label><select className="filter-select" value={filterCity} onChange={e => setFilterCity(e.target.value)}><option>All Areas</option>{CITY_GROUPS.map(g => <optgroup key={g.label} label={g.label}>{g.cities.map(c => <option key={c}>{c}</option>)}</optgroup>)}</select></div>
      <div className="filter-group"><label className="filter-label">Kid&apos;s Age</label><select className="filter-select" value={filterAge} onChange={e => setFilterAge(e.target.value)}>{AGE_RANGES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}</select></div>
      <div className="filter-group"><label className="filter-label">Budget</label><select className="filter-select" value={filterCost} onChange={e => setFilterCost(e.target.value)}>{COST_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
      <div className="filter-group" style={{ minWidth: 200 }}>
        <label className="filter-label">When</label>
        <div className="session-toggles">{SESSION_TYPES.map(s => <button key={s.value} className={`session-toggle ${filterSessions.includes(s.value) ? "active" : ""}`} onClick={() => toggleSession(s.value)}>{s.label}</button>)}</div>
      </div>
      <button className="filter-reset" onClick={resetFilters}>Reset</button>
    </div>
  );

  const renderKidFiltersBar = () => (
    <div className="filters-bar">
      <div className="filter-group"><label className="filter-label">Kid&apos;s Age</label><select className="filter-select" value={filterAge} onChange={e => setFilterAge(e.target.value)}>{AGE_RANGES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}</select></div>
      <div className="filter-group" style={{ minWidth: 200 }}>
        <label className="filter-label">When</label>
        <div className="session-toggles">{SESSION_TYPES.map(s => <button key={s.value} className={`session-toggle ${filterSessions.includes(s.value) ? "active" : ""}`} onClick={() => toggleSession(s.value)}>{s.label}</button>)}</div>
      </div>
      <button className="filter-reset" onClick={resetFilters}>Reset</button>
    </div>
  );

  const renderAddressBar = () => (
    <div className="address-bar">
      <span className="address-bar-icon">{"\uD83D\uDCCD"}</span>
      {userLocation ? (
        <div className="address-active">
          <span>Showing distances from <strong>{userLocation.label}</strong></span>
          <button className="address-clear" onClick={clearLocation}>Clear</button>
        </div>
      ) : showCustomAddress ? (
        <>
          <input className="address-input" placeholder="Type your address, city, state..." value={addressInput} onChange={e => setAddressInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleGeocode(); }} autoFocus />
          <button className="address-btn" onClick={handleGeocode} disabled={geocoding || !addressInput.trim()}>{geocoding ? "Finding..." : "Set"}</button>
          <button className="address-clear" onClick={() => setShowCustomAddress(false)}>Back</button>
        </>
      ) : (
        <select className="filter-select" style={{ flex: 1, minWidth: 200 }} defaultValue="" onChange={handlePresetSelect}>
          <option value="" disabled>Pick your school or neighborhood...</option>
          {CITY_GROUPS.map(g => <optgroup key={g.label} label={g.label}>{PRESET_LOCATIONS.filter(p => g.cities.includes(p.city)).map(p => <option key={p.label} value={p.label}>{p.label}</option>)}</optgroup>)}
          <optgroup label="Other"><option value="__custom__">Enter a custom address...</option></optgroup>
        </select>
      )}
    </div>
  );

  const renderResultsAndGrid = () => (
    <>
      <div className="results-header">
        <p className="results-count"><span>{filtered.length}</span> program{filtered.length !== 1 ? "s" : ""} found{activeProfile ? ` for ${activeProfile.avatar || "\uD83E\uDD95"} ${activeProfile.name}` : ""}</p>
        <div className="results-actions">
          {userLocation && (
            <button className={`sort-btn ${sortByDistance ? "active" : ""}`} onClick={() => setSortByDistance(prev => !prev)}>
              {sortByDistance ? "\u2713 " : ""}Sort by distance
            </button>
          )}
          {ratedCount > 0 && (
            <>
              {(["love", "like", "maybe"] as const).map(r => {
                const count = Object.entries(ratings).filter(([k, v]) => k.startsWith(ratingPrefix) && v === r).length;
                if (!count) return null;
                const labels = { love: "\u2764\uFE0F Love it", like: "\uD83D\uDC4D Like it", maybe: "\uD83E\uDD14 Maybe" };
                return (
                  <button key={r} className={`sort-btn ${filterRating === r ? "active" : ""}`} onClick={() => setFilterRating(prev => prev === r ? "all" : r)}>
                    {labels[r]} ({count})
                  </button>
                );
              })}
            </>
          )}
          {nopedCount > 0 && (
            <button className={`sort-btn ${showNoped ? "active" : ""}`} onClick={() => setShowNoped(prev => !prev)}>
              {showNoped ? "\u2713 " : ""}{nopedCount} hidden
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">{"\uD83D\uDD0D"}</div><h3>No programs match your filters</h3><p>Try adjusting your filters or <button onClick={resetFilters} style={{ background: "none", border: "none", color: "var(--sage)", fontWeight: 600, cursor: "pointer", fontSize: "inherit", fontFamily: "inherit" }}>reset to see all</button>.</p></div>
      ) : (
        <div className="listings-grid">
          {filtered.map(listing => {
            const costPerHr = computeCostPerHour(listing);
            const dist = getDistance(listing);
            const rating = getRating(listing.id);
            const isNoped = rating === "nope";
            const hasNote = !!getNote(listing.id);
            const noteExpanded = expandedNotes.has(listing.id);

            return (
              <div key={listing.id} className={`listing-card ${listing.featured ? "featured" : ""} ${rating === "love" || rating === "like" ? "liked" : ""} ${isNoped ? "noped" : ""}`}>
                {listing.featured && !isNoped && (
                  <div className="featured-bar">
                    <span style={{ fontSize: 13 }}>{"\uD83C\uDFF7\uFE0F"}</span>
                    <span className="featured-bar-label">Featured program</span>
                  </div>
                )}
                <div className="card-header">
                  <div className="card-icon">{CATEGORY_ICONS[listing.category]}</div>
                  <div className="card-title-wrap">
                    <div className="card-title">{listing.name}</div>
                    <div className="card-provider">{listing.provider}</div>
                  </div>
                  <select
                    className={`rating-select ${rating ? "rated" : ""}`}
                    value={rating || ""}
                    onChange={e => setRatingForId(listing.id, e.target.value as Rating | "")}
                    title="Rate this program"
                  >
                    <option value="">{"\u2022\u2022\u2022"}</option>
                    <option value="love">{"\u2764\uFE0F"} Love it</option>
                    <option value="like">{"\uD83D\uDC4D"} Like it</option>
                    <option value="maybe">{"\uD83E\uDD14"} Maybe</option>
                    <option value="nope">{"\u2715"} Nope</option>
                  </select>
                  {profiles.length > 0 && (
                    <div className="multi-add-wrap">
                      <button className="multi-add-btn" title={`Add to a kid\u2019s list`} onClick={() => setMultiAddOpen(prev => prev === listing.id ? null : listing.id)}>+</button>
                      {multiAddOpen === listing.id && (
                        <div className="multi-add-popover">
                          <div className="multi-add-title">Add to list:</div>
                          {profiles.map(p => {
                            const otherKey = `${p.id}:${listing.id}`;
                            const otherRating = ratings[otherKey];
                            return (
                              <button key={p.id} className={`multi-add-option ${otherRating ? "has-rating" : ""}`} onClick={() => addToKidList(p.id, listing.id)}>
                                {p.avatar || "\uD83E\uDD95"} {p.name} {otherRating ? `(${otherRating})` : ""}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="card-description">{listing.description}</p>
                <div className="card-meta">
                  <span className="meta-chip age">Ages {listing.ageMin}{"\u2013"}{listing.ageMax}</span>
                  <span className="meta-chip cost">{listing.costLabel}</span>
                  <span className="meta-chip rate">~${Math.round(costPerHr)}/hr {"\u00B7"} {hoursPerWeekLabel(listing)}</span>
                  {dist !== null && <span className="meta-chip distance">{dist < 0.1 ? "<0.1" : dist.toFixed(1)} mi</span>}
                  <span className="meta-chip">{listing.days.slice(0, 3).join(", ")}{listing.days.length > 3 ? "\u2026" : ""}</span>
                </div>
                <div className="card-footer">
                  <span className="card-city">{"\uD83D\uDCCD"} {listing.city}</span>
                  <a href={listing.website} className="card-link">View details {"\u2192"}</a>
                </div>
                <div className="card-notes">
                  <button className="note-toggle" onClick={() => toggleNoteExpanded(listing.id)}>
                    {hasNote && <span className="note-dot" />}
                    {noteExpanded ? "Hide note" : hasNote ? "View note" : "Add note"}
                  </button>
                  {noteExpanded && (
                    <textarea
                      className="note-area"
                      placeholder="Your private notes about this program..."
                      value={getNote(listing.id)}
                      onChange={e => updateNote(listing.id, e.target.value)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const renderCalendar = () => (
    <div className="calendar-section">
      <div className="calendar-header">
        <button className="calendar-toggle" onClick={() => setShowCalendar(prev => !prev)}>
          Monthly Planner
          {calendarPrograms.length > 0 && <span className="calendar-badge">{calendarPrograms.length}</span>}
          <span style={{ fontSize: 12, marginLeft: 4 }}>{showCalendar ? "\u25BC" : "\u25B6"}</span>
        </button>
      </div>
      {showCalendar && (
        <>
          <div className="calendar-nav">
            <button className="calendar-nav-btn" onClick={() => { setCalendarMonth(prev => { const m = prev.month - 1; return m < 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: m }; }); setExpandedDay(null); }}>{"\u2190"}</button>
            <span className="calendar-month-label">{calendarMonthLabel}</span>
            <button className="calendar-nav-btn" onClick={() => { setCalendarMonth(prev => { const m = prev.month + 1; return m > 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: m }; }); setExpandedDay(null); }}>{"\u2192"}</button>
          </div>
          {calendarPrograms.length > 0 && (
            <div className="calendar-legend">
              {calendarPrograms.map(p => (
                <span key={p.id} className="calendar-legend-item">
                  <span className="calendar-legend-dot" style={{ background: programColorMap[p.id] }} />
                  {p.name}
                </span>
              ))}
            </div>
          )}
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
            {calendarGrid.map((cell, i) => (
              <div key={i} className={`calendar-cell ${cell.date === 0 ? "empty" : ""} ${cell.isToday ? "today" : ""} ${cell.programs.length > 0 ? "has-programs" : ""}`}
                onClick={() => cell.programs.length > 0 && setExpandedDay(prev => prev === cell.dateStr ? null : cell.dateStr)}>
                {cell.date > 0 && (
                  <>
                    <span className="calendar-date">{cell.date}</span>
                    <div className="calendar-pills">
                      {cell.programs.slice(0, 3).map(p => (
                        <span key={p.id} className="calendar-pill" style={{ background: programColorMap[p.id] }} title={p.name} />
                      ))}
                      {cell.programs.length > 3 && <span className="calendar-overflow">+{cell.programs.length - 3}</span>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {expandedDay && (() => {
            const cell = calendarGrid.find(c => c.dateStr === expandedDay);
            if (!cell || cell.programs.length === 0) return null;
            return (
              <div className="calendar-expanded">
                <div className="calendar-expanded-header">
                  <strong>{new Date(expandedDay + "T12:00:00").toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}</strong>
                  <button className="address-clear" onClick={() => setExpandedDay(null)}>Close</button>
                </div>
                {cell.programs.map(p => {
                  const r = ratings[`${activeProfileId}:${p.id}`];
                  return (
                    <div key={p.id} className="calendar-expanded-item">
                      <span className="calendar-legend-dot" style={{ background: programColorMap[p.id] }} />
                      <span>{p.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: 14 }}>{r === "love" ? "\u2764\uFE0F" : "\uD83D\uDC4D"}</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
          {calendarPrograms.length === 0 && (
            <div className="calendar-empty">
              Rate programs as &ldquo;Love it&rdquo; or &ldquo;Like it&rdquo; and they will appear here
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* ── Header ── */}
        <header className="site-header" style={view === "kid" && activeProfile?.accentColor ? { borderTop: `3px solid ${activeProfile.accentColor}` } : undefined}>
          <div className="header-inner">
            <span className="logo" onClick={() => { setView("search"); setActiveProfileId(null); resetFilters(); }}>
              <svg className="logo-icon" width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="8" fill="var(--sage)" />
                <text x="19" y="16.5" textAnchor="middle" fill="white" fontFamily="'DM Sans', sans-serif" fontSize="13" fontWeight="700">925</text>
              </svg>
              <span className="logo-text">Kids</span>
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button className={`header-nav-btn ${view === "search" ? "active" : ""}`} onClick={() => { setView("search"); setActiveProfileId(null); resetFilters(); }}>Browse Programs</button>
              {profiles.length > 0 && (
                <button className={`header-nav-btn ${view === "dashboard" ? "active" : ""}`} onClick={() => { setView("dashboard"); setActiveProfileId(null); }}>My Kids</button>
              )}
              {view === "kid" && activeProfile && (
                <span className="header-breadcrumb">{activeProfile.avatar || "\uD83E\uDD95"} {activeProfile.name}</span>
              )}
              <button className="nav-pill">+ List</button>
            </div>
          </div>
        </header>

        {/* ── Quiz Overlay ── */}
        {showQuiz && (
          <div className="quiz-overlay" onClick={() => setShowQuiz(false)}>
            <div className="quiz-card" onClick={e => e.stopPropagation()}>
              <div className="quiz-progress">
                {QUIZ_STEPS.map((_, i) => <div key={i} className={`quiz-progress-dot ${i === quizStep ? "active" : i < quizStep ? "done" : ""}`} />)}
              </div>
              <h2 className="quiz-question">{currentQuizStep.question}</h2>
              {currentQuizStep.subtitle && <p className="quiz-subtitle">{currentQuizStep.subtitle}</p>}
              <div className="quiz-options">
                {currentQuizStep.options.map(opt => (
                  <button key={opt.value} className={`quiz-option ${isOptionSelected(currentQuizStep.id, opt.value, currentQuizStep.type) ? "selected" : ""}`} onClick={() => handleQuizOption(currentQuizStep.id, opt.value, currentQuizStep.type)}>{opt.label}</button>
                ))}
              </div>
              <div className="quiz-footer">
                <button className="quiz-skip" onClick={() => { if (quizStep < QUIZ_STEPS.length - 1) setQuizStep(q => q + 1); else applyQuizAnswers(); }}>Skip</button>
                <div style={{ display: "flex", gap: 10 }}>
                  {quizStep > 0 && <button className="btn-secondary" style={{ padding: "10px 18px", fontSize: 14 }} onClick={() => setQuizStep(q => q - 1)}>Back</button>}
                  <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => { if (quizStep < QUIZ_STEPS.length - 1) setQuizStep(q => q + 1); else applyQuizAnswers(); }}>{quizStep < QUIZ_STEPS.length - 1 ? "Next \u2192" : "Show me programs \u2192"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile Manager Modal ── */}
        {showProfileManager && (
          <div className="quiz-overlay" onClick={() => setShowProfileManager(false)}>
            <div className="quiz-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <h2 className="quiz-question">{editingProfileId ? (editingProfileId === "__new__" ? "Add a Kid" : `Edit ${profiles.find(p => p.id === editingProfileId)?.name || "Profile"}`) : profiles.length === 0 ? "Add Your First Kid" : "Manage Kids"}</h2>
              <p className="quiz-subtitle">{editingProfileId ? "Enter their info below" : profiles.length === 0 ? "Create a profile to track activities per kid" : "Select a kid to edit, or add a new one"}</p>

              {!editingProfileId ? (
                <div className="profile-list">
                  {profiles.map(p => (
                    <div key={p.id} className="profile-list-item">
                      <span style={{ fontSize: 28, lineHeight: 1 }}>{p.avatar || "\uD83E\uDD95"}</span>
                      <div className="profile-list-info">
                        <span className="profile-list-name">{p.name}</span>
                        <span className="profile-list-detail">Age {calculateAge(p.birthdate)}{p.about ? ` \u00B7 ${p.about.length > 50 ? p.about.slice(0, 50) + "\u2026" : p.about}` : ""}</span>
                      </div>
                      <div className="profile-list-actions">
                        <button className="profile-edit-btn" onClick={() => startEditProfile(p)}>Edit</button>
                        <button className="profile-delete-btn" onClick={() => handleDeleteProfile(p.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                  <button className="btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={startNewProfile}>+ Add a Kid</button>
                </div>
              ) : (
                <div className="profile-form">
                  <div className="filter-group" style={{ marginBottom: 16 }}>
                    <label className="filter-label">Pick an avatar</label>
                    <div className="avatar-grid">
                      {AVATAR_OPTIONS.map(emoji => (
                        <button key={emoji} className={`avatar-btn ${profileFormAvatar === emoji ? "selected" : ""}`} onClick={() => setProfileFormAvatar(emoji)} type="button">{emoji}</button>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group" style={{ marginBottom: 16 }}>
                    <label className="filter-label">Accent color</label>
                    <div className="color-swatch-grid">
                      {ACCENT_COLORS.map(c => (
                        <button key={c.value} className={`color-swatch ${profileFormColor === c.value ? "selected" : ""}`} style={{ background: c.value }} onClick={() => setProfileFormColor(c.value)} type="button" title={c.label} />
                      ))}
                    </div>
                  </div>
                  <div className="filter-group" style={{ marginBottom: 16 }}>
                    <label className="filter-label">Name or Initials</label>
                    <input className="address-input" placeholder="e.g. Maya, or M.P." value={profileFormName} onChange={e => setProfileFormName(e.target.value)} autoFocus />
                  </div>
                  <div className="filter-group" style={{ marginBottom: 16 }}>
                    <label className="filter-label">Birthday</label>
                    <input type="date" className="address-input" value={profileFormBirthdate} onChange={e => setProfileFormBirthdate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="filter-group" style={{ marginBottom: 16 }}>
                    <label className="filter-label">School or Neighborhood</label>
                    {profileFormSchoolCustom ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input className="address-input" placeholder="School or location name..." value={profileFormSchool} onChange={e => setProfileFormSchool(e.target.value)} />
                        <button className="address-clear" onClick={() => { setProfileFormSchoolCustom(false); setProfileFormSchool(""); }}>Back</button>
                      </div>
                    ) : (
                      <select className="filter-select" value={profileFormSchool} onChange={e => { if (e.target.value === "__other__") { setProfileFormSchoolCustom(true); setProfileFormSchool(""); } else { setProfileFormSchool(e.target.value); } }}>
                        <option value="">Select a school or neighborhood...</option>
                        <option value="No school yet">No school yet (younger kids)</option>
                        {CITY_GROUPS.map(g => {
                          const groupLocations = PRESET_LOCATIONS.filter(p => g.cities.includes(p.city));
                          if (groupLocations.length === 0) return null;
                          return <optgroup key={g.label} label={g.label}>{groupLocations.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}</optgroup>;
                        })}
                        <option value="__other__">Other</option>
                      </select>
                    )}
                  </div>
                  <div className="filter-group" style={{ marginBottom: 16 }}>
                    <label className="filter-label">About {"\u2014"} what are they into?</label>
                    <textarea className="note-area" style={{ minHeight: 80 }} placeholder={"e.g. Loves dinosaurs, building with Legos, and running around outside. Shy at first but warms up fast. Looking for something creative after school\u2026"} value={profileFormAbout} onChange={e => setProfileFormAbout(e.target.value)} />
                  </div>
                  {editingProfileId === "__new__" && (
                    <>
                      <div style={{ borderTop: "1px solid var(--border)", margin: "20px 0 16px", paddingTop: 16 }}>
                        <p className="quiz-subtitle" style={{ marginBottom: 0, fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>Help us find programs {"\u2728"}</p>
                        <p className="quiz-subtitle" style={{ marginBottom: 16 }}>Optional — you can always change filters later</p>
                      </div>
                      <div className="filter-group" style={{ marginBottom: 16 }}>
                        <label className="filter-label">What are they into?</label>
                        <div className="quiz-options" style={{ marginTop: 4 }}>
                          {CATEGORIES.slice(1).map(c => (
                            <button key={c} className={`quiz-option ${((quizAnswers.interest as string[]) || []).includes(c) ? "selected" : ""}`} onClick={() => handleQuizOption("interest", c, "multi")} type="button">{CATEGORY_ICONS[c]} {c}</button>
                          ))}
                        </div>
                      </div>
                      <div className="filter-group" style={{ marginBottom: 16 }}>
                        <label className="filter-label">When are you looking?</label>
                        <div className="quiz-options" style={{ marginTop: 4 }}>
                          {SESSION_TYPES.map(s => (
                            <button key={s.value} className={`quiz-option ${((quizAnswers.when as string[]) || []).includes(s.value) ? "selected" : ""}`} onClick={() => handleQuizOption("when", s.value, "multi")} type="button">{s.label}</button>
                          ))}
                        </div>
                      </div>
                      <div className="filter-group" style={{ marginBottom: 16 }}>
                        <label className="filter-label">Which area?</label>
                        <div className="quiz-options" style={{ marginTop: 4 }}>
                          {[{ value: "All Areas", label: "Anywhere" }, ...CITY_GROUPS.map(g => ({ value: g.label, label: g.label }))].map(opt => (
                            <button key={opt.value} className={`quiz-option ${quizAnswers.area === opt.value ? "selected" : ""}`} onClick={() => handleQuizOption("area", opt.value, "single")} type="button">{opt.label}</button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <button className="btn-secondary" onClick={() => setEditingProfileId(null)}>Cancel</button>
                    <button className="btn-primary" onClick={handleSaveProfile} disabled={!profileFormName.trim() || !profileFormBirthdate}>{editingProfileId === "__new__" ? "Add Kid" : "Save Changes"}</button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <button className="quiz-skip" onClick={() => setShowProfileManager(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Search View ── */}
        {view === "search" && (
          <>
            <section className="hero">
              <div className="hero-img-wrap">
                <img src="https://images.unsplash.com/photo-1647843123250-e3c1e0937e87?w=1400&q=80" alt="Lafayette hills with Mount Diablo in the background" />
                <div className="hero-img-overlay" />
              </div>
              <div className="hero-content">
                <div className="hero-tag">Lamorinda {"\u00B7"} Tri-Valley {"\u00B7"} Central & East Contra Costa</div>
                <h1>Find what your kid<br /><em>actually</em> loves doing.</h1>
                <p className="hero-sub">Every after-school and summer program in the 925, in one place. Filter by age, interest, and neighborhood{"\u2014"}no more 12 open tabs.</p>
                <div className="hero-ctas">
                  <button className="btn-primary" onClick={() => { setShowQuiz(true); setQuizStep(0); setQuizAnswers({}); }}>Help me find something {"\u2728"}</button>
                  <button className="btn-secondary">Browse all programs</button>
                </div>
              </div>
            </section>
            <main className="main-container">
              {renderFiltersBar()}
              {renderAddressBar()}
              {renderResultsAndGrid()}
            </main>
          </>
        )}

        {/* ── Dashboard View ── */}
        {view === "dashboard" && (
          <main className="main-container">
            <div className="dashboard-header">
              <h1 className="dashboard-title">My Kids</h1>
            </div>
            <div className="dashboard-grid">
              {profiles.map(p => {
                const age = calculateAge(p.birthdate);
                const lovedCount = LISTINGS.filter(l => ratings[`${p.id}:${l.id}`] === "love").length;
                const likedCount = LISTINGS.filter(l => ratings[`${p.id}:${l.id}`] === "like").length;
                const kidRatedCount = LISTINGS.filter(l => ratings[`${p.id}:${l.id}`]).length;
                return (
                  <div key={p.id} className="dashboard-card" onClick={() => handleProfileSwitch(p.id)}>
                    <div className="dashboard-card-avatar">{p.avatar || "\uD83E\uDD95"}</div>
                    <div className="dashboard-card-name">{p.name}</div>
                    <div className="dashboard-card-age">Age {age}</div>
                    {p.school && <div className="dashboard-card-school">{p.school}</div>}
                    {p.about && <div className="dashboard-card-about">{p.about.length > 80 ? p.about.slice(0, 80) + "\u2026" : p.about}</div>}
                    <div className="dashboard-card-stats">
                      {lovedCount > 0 && <span className="dashboard-stat">{"\u2764\uFE0F"} {lovedCount}</span>}
                      {likedCount > 0 && <span className="dashboard-stat">{"\uD83D\uDC4D"} {likedCount}</span>}
                      {kidRatedCount > 0 && <span className="dashboard-stat">{kidRatedCount} rated</span>}
                    </div>
                  </div>
                );
              })}
              <div className="dashboard-card dashboard-add-card" onClick={() => { setShowProfileManager(true); startNewProfile(); }}>
                <div className="dashboard-add-icon">+</div>
                <div className="dashboard-card-name">Add a Kid</div>
              </div>
            </div>
          </main>
        )}

        {/* ── Kid View ── */}
        {view === "kid" && activeProfile && (() => {
          const [ar, ag, ab] = hexToRgb(activeProfile.accentColor || "#4A7C59");
          return <>
            <section className="kid-hero" style={{ background: `linear-gradient(135deg, rgba(${ar},${ag},${ab},0.12) 0%, #FBF7F0 50%, rgba(${ar},${ag},${ab},0.08) 100%)` }}>
              <div className="kid-hero-inner">
                <div className="kid-hero-avatar" style={{ boxShadow: `0 4px 16px rgba(${ar},${ag},${ab},0.15)` }}>{activeProfile.avatar || "\uD83E\uDD95"}</div>
                <h1 className="kid-hero-title">{activeProfile.name}&apos;s Programs</h1>
                <p className="kid-hero-detail">Age {calculateAge(activeProfile.birthdate)}{activeProfile.school ? ` \u00B7 ${activeProfile.school}` : ""}</p>
                {activeProfile.about && <p className="kid-hero-about">{activeProfile.about}</p>}
                {kidInterests.length > 0 && (
                  <div className="kid-hero-interests">
                    {kidInterests.map(cat => <span key={cat} className="kid-interest-chip">{CATEGORY_ICONS[cat]} {cat}</span>)}
                  </div>
                )}
                <div className="kid-hero-actions">
                  <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { setView("dashboard"); setActiveProfileId(null); }}>{"\u2190"} All Kids</button>
                  <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { setShowProfileManager(true); startEditProfile(activeProfile); }}>Edit Profile</button>
                </div>
              </div>
            </section>
            <main className="main-container">
              {renderKidFiltersBar()}
              {renderCalendar()}
              {renderResultsAndGrid()}
            </main>
          </>;
        })()}

        <footer className="site-footer">
          <div className="footer-logo">925Kids</div>
          <p className="footer-tagline">Activities across the 925</p>
          <p className="footer-story">&ldquo;If you&apos;ve ever tried to find after-school programs in the 925, you know the drill{"\u2014"}twelve browser tabs, a Facebook thread you can&apos;t find again, and still no clear picture. I got frustrated enough to do something about it. No big business behind this. Just a local parent.&rdquo;</p>
          <button className="suggest-link">+ Suggest a program</button>
        </footer>
      </div>
    </>
  );
}
