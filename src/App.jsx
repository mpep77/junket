import { useState } from "react";
import "./index.css";

const QUICK_DESTINATIONS = [
  { label: "The Berkshires" },
  { label: "Boston" },
  { label: "Northampton, MA" },
  { label: "Portland, ME" },
];

async function callAPI(prompt) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── LANDING ──
function Landing({ onSearch }) {
  const [place, setPlace] = useState("");
  const go = () => { if (place.trim()) onSearch(place.trim()); };

  return (
    <div className="wrap">
      <p className="eyebrow">Berkshires · Boston · Beyond</p>
      <h1 className="hero-title">
        Stop planning.<br /><em>Start going.</em>
      </h1>
      <p className="hero-sub">
        Drop a destination. We'll build a weekend worth leaving for — real picks,
        local knowledge, zero tourist-trap filler.
      </p>
      <div className="input-row">
        <input
          className="j-input"
          placeholder="Berkshires, Northampton, Portland…"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          autoFocus
        />
        <button className="btn-go" onClick={go} disabled={!place.trim()}>
          Plan it →
        </button>
      </div>
      <p className="quick-label">Popular Junkets</p>
      <div className="quick-grid">
        {QUICK_DESTINATIONS.map((d) => (
          <button key={d.label} className="quick-pill" onClick={() => onSearch(d.label)}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── LOADING ──
function LoadingView({ title, sub }) {
  return (
    <div className="wrap">
      <div className="loading-view">
        <div className="spinner" />
        <p className="loading-title">{title}</p>
        <p className="loading-sub">{sub}</p>
      </div>
    </div>
  );
}

// ── OPTIONS ──
function OptionsView({ place, data, onChoose, onBack }) {
  return (
    <div className="wrap">
      <p className="view-label">Choose your weekend</p>
      <h2 className="view-title">Your weekend in {place}</h2>
      <p className="view-sub">{data.premise}</p>
      {data.options.map((opt, i) => (
        <div key={i} className="opt-card">
          <p className="opt-tag">{opt.tag}</p>
          <h3 className="opt-title">{opt.title}</h3>
          <p className="opt-story">{opt.story}</p>
          <button className="btn-choose" onClick={() => onChoose(opt)}>
            Choose this weekend →
          </button>
        </div>
      ))}
      <button className="btn-ghost" style={{ marginTop: 20 }} onClick={onBack}>
        ← Back
      </button>
    </div>
  );
}

// ── ITINERARY ──
function ItineraryView({ place, option, data, onRegen, onHome }) {
  return (
    <div className="wrap">
      <span className="itin-tag">{place} · {option.tag}</span>
      <h2 className="itin-title">{data.title}</h2>
      <p className="itin-sub">{data.subtitle}</p>
      <div className="itin-actions">
        <button className="btn-ghost" onClick={onHome}>← Start over</button>
        <button className="btn-ghost" onClick={onRegen}>Try another</button>
      </div>
      {data.days.map((day) => (
        <div key={day.day} className="day-section">
          <p className="day-label">{day.day}</p>
          {day.stops.map((stop, i) => (
            <div key={i} className="stop-card">
              <p className="stop-time">{stop.time}</p>
              <h3 className="stop-name">{stop.name}</h3>
              <p className="stop-type">{stop.type}</p>
              <p className="stop-desc">{stop.description}</p>
              <div className="stop-tip">
                <span className="tip-label">Local tip → </span>{stop.tip}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── ROOT ──
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [loadingMsg, setLoadingMsg] = useState({ title: "", sub: "" });
  const [place, setPlace] = useState("");
  const [optionsData, setOptionsData] = useState(null);
  const [chosenOption, setChosenOption] = useState(null);
  const [itineraryData, setItineraryData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const goHome = () => {
    setScreen("landing");
    setPlace("");
    setOptionsData(null);
    setChosenOption(null);
    setItineraryData(null);
    setErrorMsg("");
  };

  const handleSearch = async (destination) => {
    setPlace(destination);
    setScreen("loading");
    setLoadingMsg({ title: `Scoping out ${destination}…`, sub: "Coming up with your weekend options." });

    try {
      const data = await callAPI(
        `You are Junket, a hyper-local weekend travel planner. Generate 3 distinct weekend vibe options for: ${destination}.

Return ONLY valid JSON — no markdown fences, no preamble, nothing else:
{
  "premise": "One evocative sentence about what a weekend in ${destination} actually feels like. Specific and atmospheric, not generic.",
  "options": [
    {
      "tag": "2-3 word vibe label",
      "title": "Evocative 3-5 word weekend title",
      "story": "2 sentences. What kind of weekend is this? Be specific to ${destination}."
    }
  ]
}

Make the 3 options genuinely different: one slow/atmospheric, one food and drink forward, one active or outdoorsy. Be specific to ${destination}'s actual character and real places.`
      );
      setOptionsData(data);
      setScreen("options");
    } catch (e) {
      setErrorMsg("Couldn't load weekend options. Check your connection and try again.");
      setScreen("error");
    }
  };

  const fetchItinerary = async (opt) => {
    setScreen("loading");
    setLoadingMsg({ title: "Writing your weekend…", sub: "Real places, real picks. Almost there." });
    try {
      const data = await callAPI(
        `You are Junket — a hyper-local weekend travel planner with deep insider knowledge. Your voice is like a well-traveled local friend: warm, specific, a little witty. Never generic, never touristy.

Destination: ${place}
Weekend vibe: "${opt.title}" — ${opt.tag}
Description: ${opt.story}

Build a full Saturday + Sunday itinerary. Return ONLY valid JSON — no markdown fences, no preamble:
{
  "title": "Catchy editorial 4-6 word weekend title",
  "subtitle": "One sentence capturing the spirit of this specific weekend in ${place}",
  "days": [
    {
      "day": "Saturday",
      "stops": [
        {
          "time": "Morning",
          "name": "Real place name",
          "type": "Category · Neighborhood",
          "description": "2-3 sentences. Specific and warm. A detail that makes this feel real.",
          "tip": "One practical insider tip — what to order, when to go, what to skip."
        }
      ]
    },
    {
      "day": "Sunday",
      "stops": [...]
    }
  ]
}

Include 3-4 stops per day. Use real, specific places that match the vibe. For the Berkshires: Lenox, Stockbridge, Great Barrington, Williamstown, North Adams. For Boston: specific neighborhoods and real local favorites over tourist traps.`
      );
      setItineraryData(data);
      setScreen("itinerary");
    } catch (e) {
      setErrorMsg("Couldn't generate the itinerary. Try again.");
      setScreen("error");
    }
  };

  const handleChooseOption = (opt) => {
    setChosenOption(opt);
    fetchItinerary(opt);
  };

  return (
    <div className="root">
      <nav className="nav">
        <div className="logo" onClick={goHome}>
          Junket<span className="logo-dot">.</span>
        </div>
      </nav>

      {screen === "landing" && <Landing onSearch={handleSearch} />}
      {screen === "loading" && <LoadingView title={loadingMsg.title} sub={loadingMsg.sub} />}
      {screen === "options" && optionsData && (
        <OptionsView place={place} data={optionsData} onChoose={handleChooseOption} onBack={goHome} />
      )}
      {screen === "itinerary" && itineraryData && (
        <ItineraryView
          place={place}
          option={chosenOption}
          data={itineraryData}
          onRegen={() => fetchItinerary(chosenOption)}
          onHome={goHome}
        />
      )}
      {screen === "error" && (
        <div className="wrap">
          <div className="error-box">{errorMsg}</div>
          <button className="btn-ghost" style={{ marginTop: 20 }} onClick={goHome}>← Start over</button>
        </div>
      )}

      <footer className="footer">© 2026 Junket · Made for people who'd rather be somewhere else</footer>
    </div>
  );
}
