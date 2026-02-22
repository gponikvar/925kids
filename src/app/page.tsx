"use client";

import { useState, useMemo } from "react";

const LISTINGS = [
  { id: 1, name: "Recreational Soccer", provider: "AYSO Region 130", category: "Sports", description: "Co-ed recreational soccer for all skill levels. Focuses on teamwork, fun, and fundamentals. Walnut Creek's most popular youth league.", ageMin: 4, ageMax: 14, city: "Walnut Creek", costTier: "low", costLabel: "~$120/season", days: ["Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: true },
  { id: 2, name: "Young Artists Studio", provider: "Diablo Valley Art Academy", category: "Arts", description: "Weekly painting, drawing, and mixed media classes in a nurturing studio environment. Small class sizes, all materials included.", ageMin: 5, ageMax: 13, city: "Walnut Creek", costTier: "medium", costLabel: "~$180/month", days: ["Tue", "Thu"], sessionTypes: ["after-school"], website: "#", featured: false },
  { id: 3, name: "Scratch & Python Coding", provider: "Code Ninjas Walnut Creek", category: "STEM", description: "Kids learn real coding skills through game development. Progress at their own pace through a structured belt system.", ageMin: 7, ageMax: 14, city: "Walnut Creek", costTier: "medium", costLabel: "~$200/month", days: ["Mon", "Wed", "Fri", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: true },
  { id: 4, name: "Ballet & Creative Movement", provider: "Lamorinda Dance Center", category: "Dance", description: "Classical ballet training for beginners through advanced. Caring instructors, annual recital. Located in Lafayette.", ageMin: 3, ageMax: 16, city: "Lafayette", costTier: "medium", costLabel: "~$160/month", days: ["Mon", "Wed", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false },
  { id: 5, name: "Math Enrichment", provider: "Mathnasium of Walnut Creek", category: "Academic", description: "Personalized math tutoring and enrichment. Works for kids who are struggling and those looking to get ahead.", ageMin: 5, ageMax: 18, city: "Walnut Creek", costTier: "medium", costLabel: "~$250/month", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false },
  { id: 6, name: "Junior Rangers Nature Program", provider: "Save Mount Diablo", category: "Outdoor", description: "Hands-on nature education on local trails. Kids learn wildlife identification, conservation, and stewardship of East Bay open spaces.", ageMin: 6, ageMax: 12, city: "Walnut Creek", costTier: "low", costLabel: "~$60/program", days: ["Sat", "Sun"], sessionTypes: ["weekend"], website: "#", featured: false },
  { id: 7, name: "Piano & Guitar Lessons", provider: "Orinda Music Academy", category: "Music", description: "Private and group lessons for all levels. Patient instructors specializing in kids who have never touched an instrument before.", ageMin: 5, ageMax: 17, city: "Orinda", costTier: "medium", costLabel: "~$140/month", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false },
  { id: 8, name: "Summer Science Camp", provider: "Mad Science East Bay", category: "STEM", description: "Week-long summer camps focused on hands-on experiments, rockets, slime, and real science. Kids go home excited about learning.", ageMin: 5, ageMax: 12, city: "Moraga", costTier: "medium", costLabel: "~$350/week", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], sessionTypes: ["summer"], website: "#", featured: false },
  { id: 9, name: "Youth Theater Workshop", provider: "Town Hall Theatre", category: "Theater", description: "Walnut Creek's beloved community theater runs year-round youth programs. Build confidence, memorization, and stage presence.", ageMin: 7, ageMax: 16, city: "Walnut Creek", costTier: "low", costLabel: "~$95/session", days: ["Sat"], sessionTypes: ["weekend", "summer"], website: "#", featured: true },
  { id: 10, name: "Hip Hop & Contemporary Dance", provider: "Moraga Dance Academy", category: "Dance", description: "High-energy classes in hip hop, jazz, and contemporary styles. Performance opportunities throughout the year.", ageMin: 5, ageMax: 15, city: "Moraga", costTier: "medium", costLabel: "~$150/month", days: ["Tue", "Thu", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false },
  { id: 11, name: "Lafayette Swim Lessons", provider: "Lafayette Community Pool", category: "Sports", description: "Year-round swim lessons for all levels, from water introduction through competitive stroke development.", ageMin: 3, ageMax: 14, city: "Lafayette", costTier: "low", costLabel: "~$80/month", days: ["Mon", "Wed", "Fri", "Sat", "Sun"], sessionTypes: ["after-school", "weekend", "summer"], website: "#", featured: false },
  { id: 12, name: "Spanish Immersion", provider: "Habla Language Academy", category: "Academic", description: "Conversational Spanish for kids using games, songs, and stories. No prior experience needed. Classes held in Lafayette.", ageMin: 4, ageMax: 12, city: "Lafayette", costTier: "low", costLabel: "~$85/month", days: ["Wed", "Sat"], sessionTypes: ["after-school", "weekend"], website: "#", featured: false },
];

const CATEGORIES = ["All", "Sports", "Arts", "STEM", "Dance", "Academic", "Outdoor", "Music", "Theater"];
const CITIES = ["All Areas", "Walnut Creek", "Lafayette", "Moraga", "Orinda"];
const COST_TIERS = [{ value: "all", label: "Any Budget" }, { value: "low", label: "Under $100/mo" }, { value: "medium", label: "$100–$300/mo" }, { value: "high", label: "$300+/mo" }];
const AGE_RANGES = [{ value: "all", label: "Any Age" }, { value: "0-5", label: "Under 5" }, { value: "5-8", label: "5–8" }, { value: "8-12", label: "8–12" }, { value: "12-18", label: "12+" }];
const SESSION_TYPES = [{ value: "after-school", label: "After School" }, { value: "weekend", label: "Weekends" }, { value: "summer", label: "Summer" }];
const CATEGORY_ICONS: Record<string, string> = { Sports: "⚽", Arts: "🎨", STEM: "🔬", Dance: "💃", Academic: "📚", Outdoor: "🌿", Music: "🎵", Theater: "🎭" };

const QUIZ_STEPS = [
  { id: "interest", question: "What is your kid into?", subtitle: "Pick as many as you'd like", type: "multi", options: CATEGORIES.slice(1).map(c => ({ value: c, label: `${CATEGORY_ICONS[c]} ${c}` })) },
  { id: "age", question: "How old is your kid?", type: "single", options: AGE_RANGES.slice(1) },
  { id: "when", question: "When are you looking for?", type: "multi", options: SESSION_TYPES },
  { id: "area", question: "Which area works for your family?", type: "single", options: CITIES.map(c => ({ value: c, label: c })) },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
  :root { --cream: #FBF7F0; --warm-white: #FFFCF7; --ink: #1C1917; --ink-light: #57534E; --ink-muted: #A8A29E; --sage: #4A7C59; --sage-light: #EAF2EC; --amber: #D97706; --amber-light: #FEF3C7; --border: #E7E0D8; --shadow-hover: 0 4px 16px rgba(28,25,23,0.12), 0 8px 32px rgba(28,25,23,0.08); }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .app { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; }
  .site-header { background: var(--warm-white); border-bottom: 1px solid var(--border); padding: 0 24px; position: sticky; top: 0; z-index: 100; }
  .header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink); letter-spacing: -0.5px; }
  .logo-accent { color: var(--sage); }
  .nav-pill { background: var(--sage); color: white; border: none; border-radius: 100px; padding: 8px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; }
  .hero { background: var(--warm-white); padding: 0; text-align: center; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .hero-img-wrap { position: relative; width: 100%; height: 300px; overflow: hidden; }
  .hero-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
  .hero-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(251,247,240,0) 30%, rgba(251,247,240,1) 100%); }
  .hero-content { position: relative; padding: 0 24px 48px; }
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
  .filters-bar { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; margin-bottom: 28px; display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
  .filter-group { display: flex; flex-direction: column; gap: 6px; min-width: 140px; flex: 1; }
  .filter-label { font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: var(--ink-muted); }
  .filter-select { appearance: none; background: var(--cream); border: 1.5px solid var(--border); border-radius: 10px; padding: 9px 32px 9px 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23A8A29E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
  .filter-select:focus { outline: none; border-color: var(--sage); }
  .filter-reset { background: none; border: 1.5px solid var(--border); border-radius: 10px; padding: 9px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--ink-muted); cursor: pointer; white-space: nowrap; }
  .session-toggles { display: flex; gap: 8px; flex-wrap: wrap; }
  .session-toggle { border: 1.5px solid var(--border); background: var(--cream); border-radius: 100px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: var(--ink-light); font-family: 'DM Sans', sans-serif; }
  .session-toggle.active { background: var(--sage-light); border-color: var(--sage); color: var(--sage); }
  .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .results-count { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--ink); }
  .results-count span { color: var(--sage); }
  .listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .listing-card { background: var(--warm-white); border: 1px solid var(--border); border-radius: 16px; padding: 22px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 12px; position: relative; }
  .listing-card:hover { border-color: var(--sage); box-shadow: var(--shadow-hover); transform: translateY(-2px); }
  .listing-card.featured { border-color: var(--amber); background: linear-gradient(135deg, var(--warm-white) 0%, #FFFBF0 100%); }
  .featured-badge { position: absolute; top: 14px; right: 14px; background: var(--amber-light); color: var(--amber); font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; padding: 3px 8px; border-radius: 100px; }
  .card-header { display: flex; align-items: flex-start; gap: 12px; }
  .card-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--sage-light); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .card-title { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; color: var(--ink); letter-spacing: -0.2px; line-height: 1.3; }
  .card-provider { font-size: 12px; color: var(--ink-muted); margin-top: 2px; }
  .card-description { font-size: 13px; color: var(--ink-light); line-height: 1.55; }
  .card-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
  .meta-chip { background: var(--cream); border: 1px solid var(--border); border-radius: 100px; padding: 4px 10px; font-size: 12px; color: var(--ink-light); font-weight: 500; }
  .meta-chip.age { background: var(--sage-light); border-color: var(--sage-light); color: var(--sage); }
  .meta-chip.cost { background: var(--amber-light); border-color: var(--amber-light); color: var(--amber); }
  .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border); }
  .card-city { font-size: 12px; color: var(--ink-muted); }
  .card-link { font-size: 13px; font-weight: 600; color: var(--sage); text-decoration: none; }
  .empty-state { text-align: center; padding: 60px 24px; color: var(--ink-light); }
  .empty-state-icon { font-size: 40px; margin-bottom: 16px; }
  .empty-state h3 { font-family: 'Fraunces', serif; font-size: 20px; color: var(--ink); margin-bottom: 8px; }
  .site-footer { border-top: 1px solid var(--border); background: var(--warm-white); margin-top: 60px; padding: 40px 24px; text-align: center; }
  .footer-logo { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .footer-tagline { color: var(--ink-muted); font-size: 13px; margin-bottom: 16px; }
  .footer-story { max-width: 480px; margin: 0 auto 20px; font-size: 13px; color: var(--ink-light); line-height: 1.6; font-style: italic; }
  .suggest-link { display: inline-block; border: 1.5px solid var(--border); border-radius: 100px; padding: 9px 20px; font-size: 13px; font-weight: 600; color: var(--sage); cursor: pointer; background: none; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
  .suggest-link:hover { border-color: var(--sage); background: var(--sage-light); }
`;

export default function Home() {
  const [view, setView] = useState("directory");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCity, setFilterCity] = useState("All Areas");
  const [filterAge, setFilterAge] = useState("all");
  const [filterCost, setFilterCost] = useState("all");
  const [filterSessions, setFilterSessions] = useState<string[]>([]);

  const resetFilters = () => { setFilterCategory("All"); setFilterCity("All Areas"); setFilterAge("all"); setFilterCost("all"); setFilterSessions([]); };
  const toggleSession = (val: string) => setFilterSessions(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const filtered = useMemo(() => LISTINGS.filter(l => {
    if (filterCategory !== "All" && l.category !== filterCategory) return false;
    if (filterCity !== "All Areas" && l.city !== filterCity) return false;
    if (filterCost !== "all" && l.costTier !== filterCost) return false;
    if (filterSessions.length > 0 && !filterSessions.some(s => l.sessionTypes.includes(s))) return false;
    if (filterAge !== "all") { const [min, max] = filterAge.split("-").map(Number); if (l.ageMax < min || l.ageMin > max) return false; }
    return true;
  }), [filterCategory, filterCity, filterAge, filterCost, filterSessions]);

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
    if (quizAnswers.area && quizAnswers.area !== "All Areas") setFilterCity(quizAnswers.area as string);
    setView("directory"); setQuizStep(0); setQuizAnswers({});
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="site-header">
          <div className="header-inner">
            <span className="logo">925<span className="logo-accent">Kids</span></span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { setView("quiz"); setQuizStep(0); setQuizAnswers({}); }}>Find by Quiz ✨</button>
              <button className="nav-pill">+ List Your Program</button>
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-img-wrap">
            <img src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1400&q=80" alt="Kids playing outdoors in a park" />
            <div className="hero-img-overlay" />
          </div>
          <div className="hero-content">
            <div className="hero-tag">Walnut Creek · Lafayette · Moraga · Orinda</div>
            <h1>Find what your kid<br /><em>actually</em> loves doing.</h1>
            <p className="hero-sub">Every after-school and summer program in the 925, in one place. Filter by age, interest, and neighborhood—no more 12 open tabs.</p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={() => { setView("quiz"); setQuizStep(0); setQuizAnswers({}); }}>Help me find something ✨</button>
              <button className="btn-secondary">Browse all programs</button>
            </div>
          </div>
        </section>

        {view === "quiz" && (
          <div className="quiz-overlay" onClick={() => setView("directory")}>
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
                  <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => { if (quizStep < QUIZ_STEPS.length - 1) setQuizStep(q => q + 1); else applyQuizAnswers(); }}>{quizStep < QUIZ_STEPS.length - 1 ? "Next →" : "Show me programs →"}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="main-container">
          <div className="filters-bar">
            <div className="filter-group"><label className="filter-label">Category</label><select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="filter-group"><label className="filter-label">Area</label><select className="filter-select" value={filterCity} onChange={e => setFilterCity(e.target.value)}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="filter-group"><label className="filter-label">Kid&apos;s Age</label><select className="filter-select" value={filterAge} onChange={e => setFilterAge(e.target.value)}>{AGE_RANGES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}</select></div>
            <div className="filter-group"><label className="filter-label">Budget</label><select className="filter-select" value={filterCost} onChange={e => setFilterCost(e.target.value)}>{COST_TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
            <div className="filter-group" style={{ minWidth: 200 }}>
              <label className="filter-label">When</label>
              <div className="session-toggles">{SESSION_TYPES.map(s => <button key={s.value} className={`session-toggle ${filterSessions.includes(s.value) ? "active" : ""}`} onClick={() => toggleSession(s.value)}>{s.label}</button>)}</div>
            </div>
            <button className="filter-reset" onClick={resetFilters}>Reset</button>
          </div>

          <div className="results-header"><p className="results-count"><span>{filtered.length}</span> program{filtered.length !== 1 ? "s" : ""} found</p></div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🔍</div><h3>No programs match your filters</h3><p>Try adjusting your filters or <button onClick={resetFilters} style={{ background: "none", border: "none", color: "var(--sage)", fontWeight: 600, cursor: "pointer", fontSize: "inherit", fontFamily: "inherit" }}>reset to see all</button>.</p></div>
          ) : (
            <div className="listings-grid">
              {filtered.map(listing => (
                <div key={listing.id} className={`listing-card ${listing.featured ? "featured" : ""}`}>
                  {listing.featured && <span className="featured-badge">⭐ Featured</span>}
                  <div className="card-header">
                    <div className="card-icon">{CATEGORY_ICONS[listing.category]}</div>
                    <div><div className="card-title">{listing.name}</div><div className="card-provider">{listing.provider}</div></div>
                  </div>
                  <p className="card-description">{listing.description}</p>
                  <div className="card-meta">
                    <span className="meta-chip age">Ages {listing.ageMin}–{listing.ageMax}</span>
                    <span className="meta-chip cost">{listing.costLabel}</span>
                    <span className="meta-chip">{listing.days.slice(0, 3).join(", ")}{listing.days.length > 3 ? "…" : ""}</span>
                  </div>
                  <div className="card-footer"><span className="card-city">📍 {listing.city}</span><a href={listing.website} className="card-link">View details →</a></div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="site-footer">
          <div className="footer-logo">925Kids</div>
          <p className="footer-tagline">Walnut Creek · Lafayette · Moraga · Orinda</p>
          <p className="footer-story">&ldquo;If you&apos;ve ever tried to find after-school programs in the 925, you know the drill—twelve browser tabs, a Facebook thread you can&apos;t find again, and still no clear picture. I got frustrated enough to do something about it. No big business behind this. Just a local parent.&rdquo;</p>
          <button className="suggest-link">+ Suggest a program</button>
        </footer>
      </div>
    </>
  );
}