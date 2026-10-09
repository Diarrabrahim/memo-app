import React, { useMemo, useState, useRef, useEffect } from "react";

const tabs = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "memo", label: "Memo IA", icon: "spark" },
  { id: "settings", label: "Paramètres", icon: "settings" },
];

const courses = [
  { name: "Epidemiology", accent: "#6bc7ff", icon: "book" },
  { name: "Biostatistics", accent: "#7ef0c1", icon: "chart" },
];

const learningActions = [
  { label: "Générer un Résumé", icon: "summary" },
  { label: "Traduction Phrase par Phrase", icon: "translate" },
  { label: "Fiches de Révision", icon: "flashcard" },
];

const waveformBars = Array.from({ length: 15 }, () => Math.floor(Math.random() * 24) + 12);

function App() {
  const [activeTab, setActiveTab] = useState("memo");
  const [isRecording, setIsRecording] = useState(false);
  const recordingIntervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        // Animation trigger for waveform can be managed via CSS
      }, 100);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [isRecording]);

  const renderContent = useMemo(() => {
    if (activeTab === "home") {
      return (
        <div className="screen home-screen">
          <div className="topbar">
            <div className="title-group">
              <span className="eyebrow">Bienvenue</span>
              <h1>Bonjour Alex, ravi de vous retrouver</h1>
            </div>
            <button className="icon-button" aria-label="Notifications">
              <BellIcon />
            </button>
          </div>

          <div className="sync-card">
            <div className="status-dot" />
            <div>
              <span className="sync-label">Synchronisation</span>
              <strong>Espace à jour</strong>
            </div>
          </div>

          <div className="section-header">
            <h2>Mes dossiers</h2>
            <button className="link-button">Voir tout →</button>
          </div>

          <div className="folder-grid">
            {courses.map((course) => (
              <div className="folder-card" key={course.name}>
                <div className="folder-illustration" style={{ "--accent": course.accent }}>
                  {course.icon === "book" && <BookIcon />}
                  {course.icon === "chart" && <ChartIcon />}
                </div>
                <div className="folder-meta">
                  <span className="folder-name">{course.name}</span>
                  <small>12 fichiers</small>
                </div>
              </div>
            ))}
          </div>

          <div className="activity-card">
            <div className="mini-tag">Suivi</div>
            <h3>Progression hebdomadaire</h3>
            <div className="progress-row">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "78%" }} />
              </div>
              <strong>78%</strong>
            </div>
          </div>

          <div style={{ height: "12px" }} />
        </div>
      );
    }

    if (activeTab === "settings") {
      return (
        <div className="screen settings-screen">
          <div className="topbar">
            <div className="title-group">
              <span className="eyebrow">Compte</span>
              <h1>Paramètres</h1>
            </div>
          </div>

          <div className="profile-card">
            <div className="avatar">A</div>
            <div>
              <h3>Alex Martin</h3>
              <small>alex.martin@memo.app</small>
            </div>
          </div>

          <div className="section-header" style={{ marginTop: "16px" }}>
            <h2>Préférences</h2>
          </div>

          <div className="settings-list">
            <SettingRow label="Notifications" value="Activées" />
            <SettingRow label="Langue" value="Français" />
            <SettingRow label="Mode sombre" value="Automatique" />
            <SettingRow label="Téléchargements" value="5 Go" />
            <SettingRow label="Thème IA" value="Moderne" />
          </div>

          <div className="section-header" style={{ marginTop: "20px" }}>
            <h2>À propos</h2>
          </div>

          <div className="settings-list">
            <SettingRow label="Version" value="2.1.0" />
            <SettingRow label="Politique de confidentialité" value="Lire" />
            <SettingRow label="Conditions d'utilisation" value="Lire" />
          </div>

          <button className="logout-button">
            <LogoutIcon />
            Se déconnecter
          </button>

          <div style={{ height: "12px" }} />
        </div>
      );
    }

    return (
      <div className="screen memo-screen">
        <div className="topbar topbar-search">
          <div className="search-shell">
            <SearchIcon />
            <input type="text" placeholder="Rechercher dans votre contenu..." />
          </div>
          <button className="icon-button" aria-label="Filtrer">
            <FilterIcon />
          </button>
        </div>

        <div className="recording-panel">
          <button
            className={`record-button ${isRecording ? "recording" : ""}`}
            aria-label="Record audio"
            onClick={() => setIsRecording(!isRecording)}
          >
            <div className="recording-wave" aria-hidden="true">
              {waveformBars.map((height, index) => (
                <span
                  key={index}
                  className="wave-bar"
                  style={{
                    height: `${height}px`,
                    "--delay": `${index * 0.08}s`,
                    "--playing": isRecording ? "1" : "0",
                  }}
                />
              ))}
            </div>
            <MicIcon />
          </button>

          <div className="record-message">
            <span>{isRecording ? "Enregistrement en cours..." : "Enregistrer un cours"}</span>
            <small>{isRecording ? "Appuyez pour arrêter" : "Prêt à analyser"}</small>
          </div>
        </div>

        <div className="action-grid">
          {learningActions.map((action, index) => (
            <button key={action.label} className={`action-button ${index === 0 ? "primary" : ""}`}>
              <div className="action-content">
                <div className="action-icon">
                  {action.icon === "summary" && <SummaryIcon />}
                  {action.icon === "translate" && <TranslateIcon />}
                  {action.icon === "flashcard" && <FlashcardIcon />}
                </div>
                <span>{action.label}</span>
              </div>
              <ArrowRightIcon />
            </button>
          ))}
        </div>

        <div className="insights-card">
          <div className="mini-tag">Assistant IA</div>
          <h3>Dernière analyse</h3>
          <p>
            Les points clés de votre cours de biostatistique ont été résumés avec un focus
            sur la variance, l'intervalle de confiance et les tests de corrélation.
          </p>
          <button className="view-button">Voir l'analyse complète →</button>
        </div>

        <div style={{ height: "12px" }} />
      </div>
    );
  }, [activeTab, isRecording]);

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="status-bar">
          <span className="time">09:41</span>
          <div className="status-icons">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        <div className="content">{renderContent}</div>

        <nav className="bottom-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">
                {tab.icon === "home" && <HomeIcon />}
                {tab.icon === "spark" && <SparkIcon />}
                {tab.icon === "settings" && <SettingsIcon />}
              </span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// SVG Icons with complete implementations

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21L16.65 16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 1 22 1 22 8" />
      <polyline points="9 23 2 23 2 16" />
      <path d="M16 2L2 16" />
      <path d="M8 22L22 8" />
    </svg>
  );
}

function FlashcardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <line x1="7" y1="15" x2="17" y2="15" />
      <line x1="7" y1="10" x2="17" y2="10" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <rect x="1" y="6" width="22" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="2" y="7" width="20" height="10" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export default App;
