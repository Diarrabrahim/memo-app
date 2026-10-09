import React, { useMemo, useState, useRef, useEffect } from "react";

const tabs = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "memo", label: "Memo IA", icon: "spark" },
  { id: "files", label: "Fichiers", icon: "files" },
  { id: "planning", label: "Planning", icon: "calendar" },
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

const specialties = [
  { id: "epid", label: "Épidémiologie", color: "#6bc7ff" },
  { id: "biostat", label: "Biostatistique", color: "#7ef0c1" },
  { id: "method", label: "Méthodologie", color: "#ffa066" },
];

const documentsData = [
  {
    id: 1,
    title: "Introduction à l'Épidémiologie",
    specialty: "epid",
    date: "2026-10-08",
    duration: "45 min",
    type: "audio",
  },
  {
    id: 2,
    title: "Tests Statistiques Avancés",
    specialty: "biostat",
    date: "2026-10-07",
    duration: "62 min",
    type: "audio",
  },
  {
    id: 3,
    title: "Méthodologie de Recherche",
    specialty: "method",
    date: "2026-10-06",
    duration: "38 min",
    type: "audio",
  },
  {
    id: 4,
    title: "Épidémiologie des Maladies Infectieuses",
    specialty: "epid",
    date: "2026-10-05",
    duration: "55 min",
    type: "audio",
  },
  {
    id: 5,
    title: "Analyse de Variance (ANOVA)",
    specialty: "biostat",
    date: "2026-10-04",
    duration: "41 min",
    type: "audio",
  },
  {
    id: 6,
    title: "Design d'Études Cliniques",
    specialty: "method",
    date: "2026-10-03",
    duration: "58 min",
    type: "audio",
  },
];

const waveformBars = Array.from({ length: 15 }, (_, index) => 16 + ((index * 9) % 22));

function App() {
  const [activeTab, setActiveTab] = useState("memo");
  const [isRecording, setIsRecording] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, course: "Épidémiologie", date: "2026-10-10", time: "14:00", status: "active" },
    { id: 2, course: "Biostatistique", date: "2026-10-11", time: "10:30", status: "active" },
  ]);
  const [formData, setFormData] = useState({ course: "", date: "", time: "" });
  const [notification, setNotification] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const animationKeyRef = useRef(0);
  const reminderTimerRef = useRef(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split("T")[0]) return "Aujourd'hui";
    if (dateStr === tomorrow.toISOString().split("T")[0]) return "Demain";
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const filteredDocuments = useMemo(() => {
    if (!selectedSpecialty) return documentsData;
    return documentsData.filter((doc) => doc.specialty === selectedSpecialty);
  }, [selectedSpecialty]);

  useEffect(() => {
    if (!reminders.length) return;

    const checkReminders = () => {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      reminders.forEach((reminder) => {
        if (
          reminder.status === "active" &&
          reminder.date === currentDate &&
          reminder.time === currentTime
        ) {
          setNotification({
            id: reminder.id,
            course: reminder.course,
          });

          setReminders((prev) =>
            prev.map((r) =>
              r.id === reminder.id ? { ...r, status: "triggered" } : r
            )
          );

          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Rappel Memo", {
              body: `C'est l'heure de réviser ${reminder.course} !`,
              icon:
                "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238ad9ff'><path d='M12 2L14.9 8.1L21 11L14.9 13.9L12 20L9.1 13.9L3 11L9.1 8.1L12 2Z'/></svg>",
            });
          }

          setTimeout(() => setNotification(null), 5000);
        }
      });
    };

    reminderTimerRef.current = setInterval(checkReminders, 30000);
    checkReminders();

    return () => {
      if (reminderTimerRef.current) clearInterval(reminderTimerRef.current);
    };
  }, [reminders]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleAddReminder = () => {
    if (!formData.course || !formData.date || !formData.time) return;

    const newReminder = {
      id: Date.now(),
      course: formData.course,
      date: formData.date,
      time: formData.time,
      status: "active",
    };

    setReminders((prev) => [...prev, newReminder]);
    setFormData({ course: "", date: "", time: "" });
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDismissNotification = () => {
    setNotification(null);
  };

  const getSpecialtyLabel = (specialtyId) => {
    return specialties.find((s) => s.id === specialtyId)?.label || "";
  };

  const getSpecialtyColor = (specialtyId) => {
    return specialties.find((s) => s.id === specialtyId)?.color || "#999";
  };

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
                <div
                  className="folder-illustration"
                  style={{ "--accent": course.accent }}
                >
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

          <div className="spacer" />
        </div>
      );
    }

    if (activeTab === "files") {
      return (
        <div className="screen files-screen">
          <div className="topbar">
            <div className="title-group">
              <span className="eyebrow">Documents</span>
              <h1>Mes Fichiers</h1>
            </div>
          </div>

          <div className="filter-section">
            <button
              className={`filter-badge ${selectedSpecialty === null ? "active" : ""}`}
              onClick={() => setSelectedSpecialty(null)}
            >
              Tous
            </button>
            {specialties.map((specialty) => (
              <button
                key={specialty.id}
                className={`filter-badge ${selectedSpecialty === specialty.id ? "active" : ""}`}
                onClick={() => setSelectedSpecialty(specialty.id)}
                style={{
                  "--badge-color": specialty.color,
                }}
              >
                {specialty.label}
              </button>
            ))}
          </div>

          <div className="documents-section">
            <div className="section-header">
              <h2>
                {selectedSpecialty
                  ? getSpecialtyLabel(selectedSpecialty)
                  : "Tous les documents"}
              </h2>
              <span className="badge">{filteredDocuments.length}</span>
            </div>

            <div className="documents-list">
              {filteredDocuments.length === 0 ? (
                <div className="empty-state">
                  <FileEmptyIcon />
                  <p>Aucun document trouvé</p>
                  <small>Enregistrez un cours pour commencer</small>
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`document-card ${expandedDoc === doc.id ? "expanded" : ""}`}
                  >
                    <div className="document-header">
                      <div className="document-icon">
                        <AudioIcon />
                      </div>

                      <div className="document-info">
                        <h4>{doc.title}</h4>
                        <p>
                          {formatDate(doc.date)} • {doc.duration}
                        </p>
                      </div>

                      <span
                        className="specialty-badge"
                        style={{ "--specialty-color": getSpecialtyColor(doc.specialty) }}
                      >
                        {getSpecialtyLabel(doc.specialty)}
                      </span>
                    </div>

                    {expandedDoc === doc.id && (
                      <div className="document-actions">
                        <button className="action-link">
                          <TranscriptIcon />
                          Lire la transcription
                        </button>
                        <button className="action-link">
                          <SummarySmallIcon />
                          Voir le résumé
                        </button>
                      </div>
                    )}

                    <button
                      className="expand-btn"
                      onClick={() =>
                        setExpandedDoc(expandedDoc === doc.id ? null : doc.id)
                      }
                    >
                      <ChevronIcon />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="spacer" />
        </div>
      );
    }

    if (activeTab === "planning") {
      return (
        <div className="screen planning-screen">
          <div className="topbar">
            <div className="title-group">
              <span className="eyebrow">Organisation</span>
              <h1>Planification</h1>
            </div>
          </div>

          <div className="planning-form-card">
            <h3>Programmer un rappel</h3>

            <div className="form-group">
              <label htmlFor="course-input">Titre du cours</label>
              <input
                id="course-input"
                type="text"
                placeholder="Ex: Révision Biostatistique"
                value={formData.course}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, course: e.target.value }))
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date-input">Date</label>
                <input
                  id="date-input"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="time-input">Heure</label>
                <input
                  id="time-input"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>
            </div>

            <button
              className="submit-button"
              onClick={handleAddReminder}
              disabled={!formData.course || !formData.date || !formData.time}
            >
              <PlusIcon />
              Ajouter le rappel
            </button>
          </div>

          <div className="section-header">
            <h2>Rappels programmés</h2>
            <span className="badge">
              {reminders.filter((r) => r.status === "active").length}
            </span>
          </div>

          <div className="reminders-list">
            {reminders.length === 0 ? (
              <div className="empty-state">
                <CalendarEmptyIcon />
                <p>Aucun rappel programmé</p>
                <small>Créez un rappel pour rester organisé</small>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`reminder-card ${
                    reminder.status === "triggered" ? "triggered" : ""
                  }`}
                >
                  <div className="reminder-content">
                    <div className="reminder-icon">
                      <ClockIcon />
                    </div>

                    <div className="reminder-details">
                      <h4>{reminder.course}</h4>
                      <p>
                        {formatDate(reminder.date)} à {reminder.time}
                      </p>
                      {reminder.status === "triggered" && (
                        <span className="triggered-badge">Déclenché</span>
                      )}
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    aria-label="Supprimer le rappel"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="spacer" />
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

          <div className="section-header section-top">
            <h2>Préférences</h2>
          </div>

          <div className="settings-list">
            <SettingRow label="Notifications" value="Activées" />
            <SettingRow label="Langue" value="Français" />
            <SettingRow label="Mode sombre" value="Automatique" />
            <SettingRow label="Téléchargements" value="5 Go" />
            <SettingRow label="Thème IA" value="Moderne" />
          </div>

          <div className="section-header section-top">
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

          <div className="spacer" />
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
                  key={`${index}-${animationKeyRef.current}`}
                  className="wave-bar"
                  style={{
                    height: `${isRecording ? height + (index % 3) * 10 : height}px`,
                    animationDelay: `${index * 0.06}s`,
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
            <button
              key={action.label}
              className={`action-button ${index === 0 ? "primary" : ""}`}
            >
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
            Les points clés de votre cours de biostatistique ont été résumés avec un
            focus sur la variance, l'intervalle de confiance et les tests de corrélation.
          </p>
          <button className="view-button">Voir l'analyse complète →</button>
        </div>

        <div className="spacer" />
      </div>
    );
  }, [activeTab, isRecording, animationKeyRef.current, reminders, formData, selectedSpecialty, expandedDoc, filteredDocuments]);

  return (
    <div className="app-shell">
      {notification && (
        <div className="notification-overlay">
          <div className="notification-toast">
            <div className="notification-icon">
              <BellAlertIcon />
            </div>
            <div className="notification-content">
              <h4>Rappel</h4>
              <p>
                C'est l'heure de réviser <strong>{notification.course}</strong> !
              </p>
            </div>
            <button className="notification-close" onClick={handleDismissNotification}>
              ✕
            </button>
          </div>
        </div>
      )}

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
                {tab.icon === "files" && <FilesIcon />}
                {tab.icon === "calendar" && <CalendarIcon />}
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

// SVG Icons

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L21 21" />
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

function BellAlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20H14C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20ZM20 16.35C21.15 15.13 22 13.33 22 11.5C22 7.91 19.6 4.95 16.29 4.3C15.58 2.6 14.04 1.35 12.16 1.35C9.97 1.35 8.15 2.75 7.72 4.6C4.5 5.3 2 8.09 2 11.5C2 13.33 2.85 15.13 4 16.35V20C4 20.55 4.45 21 5 21H19C19.55 21 20 20.55 20 20V16.35Z" />
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
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2h-4v-8H9v8H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.9 8.1L21 11L14.9 13.9L12 20L9.1 13.9L3 11L9.1 8.1L12 2Z" />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function CalendarEmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="48" height="48" opacity="0.5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function FileEmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="48" height="48" opacity="0.5">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .7 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.7 1.7 0 0 0-1.8-.7 1.7 1.7 0 0 0-1 1.6V20a1.9 1.9 0 1 1-3.8 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.8.7l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.7 1.7 0 0 0 .7-1.8 1.7 1.7 0 0 0-1.6-1H4a1.9 1.9 0 1 1 0-3.8h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.7-1.8l-.1-.1A1.9 1.9 0 1 1 7.7 3.6l.1.1a1.7 1.7 0 0 0 1.8.7 1.7 1.7 0 0 0 1-1.6V2.5a1.9 1.9 0 1 1 3.8 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.8-.7l.1-.1A1.9 1.9 0 1 1 20.4 7.3l-.1.1a1.7 1.7 0 0 0-.7 1.8 1.7 1.7 0 0 0 1.6 1H21a1.9 1.9 0 1 1 0 3.8h-.2a1.7 1.7 0 0 0-1.6 1z" />
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19V6m7 13V10m7 9V4" />
      <path d="M3 19h18" />
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

function SummarySmallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  );
}

function TranscriptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="19" x2="8" y2="19" />
      <line x1="16" y1="13" x2="8" y2="13" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h7l3 7h2L15 5h5" />
      <path d="M9 9h8" />
      <path d="M3 19h7l3-7h8" />
    </svg>
  );
}

function FlashcardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h10M7 13h10" />
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
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <rect x="20" y="10" width="2" height="4" rx="1" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 5.47a7 7 0 0 1 0 9.93" />
      <path d="M17.65 3.36a11 11 0 0 1 0 15.68" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default App;
