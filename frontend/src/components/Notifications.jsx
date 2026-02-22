import { useState, useMemo, useEffect, useRef } from "react";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 2, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  x:           "M18 6 6 18M6 6l12 12",
  bell:        "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  bellOff:     ["M13.73 21a2 2 0 0 1-3.46 0","M18.63 13A17.89 17.89 0 0 1 18 8","M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14","M18 8a6 6 0 0 0-9.33-5","M1 1l22 22"],
  search:      "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  filter:      "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  trash:       ["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  check:       "M20 6 9 17l-5-5",
  checkCheck:  ["M18 6 7 17l-5-5","M22 10 13 19l-2.5-2.5"],
  archive:     ["M21 8v13H3V8","M23 3H1v5h22V3z","M10 12h4"],
  star:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  pin:         ["M12 17v5","M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17"],
  share:       ["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8","M16 6l-4-4-4 4","M12 2v13"],
  download:    ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  chevDown:    "M6 9l6 6 6-6",
  chevUp:      "M18 15l-6-6-6 6",
  chevRight:   "M9 18l6-6-6-6",
  chevLeft:    "M15 18l-6-6 6-6",
  settings:    ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  barChart:    ["M12 20V10","M18 20V4","M6 20v-6"],
  users:       ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M16 3.13a4 4 0 0 1 0 7.75"],
  zap:         "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  flame:       ["M12 2c0 0 4.5 5.5 4.5 9a4.5 4.5 0 0 1-9 0C7.5 7.5 12 2 12 2z","M9.5 11c0 1.38 1.12 2.5 2.5 2.5S14.5 12.38 14.5 11"],
  calendar:    ["M3 9h18","M8 2v4","M16 2v4","M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"],
  clock:       ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"],
  trophy:      ["M6 9H3.5a2.5 2.5 0 0 1 0-5H6","M18 9h2.5a2.5 2.5 0 0 0 0-5H18","M4 22h16","M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22","M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22","M18 2H6v7a6 6 0 0 0 12 0V2z"],
  award:       ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  gift:        ["M20 12v10H4V12","M2 7h20v5H2z","M12 22V7","M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z","M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"],
  target:      ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  userPlus:    ["M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M20 8v6","M23 11h-6"],
  checkCircle: ["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4 12 14.01l-3-3"],
  alertCircle: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 8v4","M12 16h.01"],
  hash:        ["M4 9h16","M4 15h16","M10 3l-4 18","M14 3l-4 18"],
  circle:      "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  eye:         ["M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  lock:        ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"],
  refresh:     "M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  mail:        ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  phone:       "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mapPin:      ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z","M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  user:        ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  save:        ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z","M17 21v-8H7v8","M7 3v5h8"],
  upload:      ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  copy:        ["M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z","M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1"],
  info:        ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 16v-4","M12 8h.01"],
  volume:      ["M11 5 6 9H2v6h4l5 4V5z","M15.54 8.46a5 5 0 0 1 0 7.07"],
  volumeX:     ["M11 5 6 9H2v6h4l5 4V5z","M23 9l-6 6","M17 9l6 6"],
  logOut:      ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"],
  fileText:    ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  link:        ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71","M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  code:        ["M16 18l6-6-6-6","M8 6l-6 6 6 6"],
  sparkles:    ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z","M5 18l.75 2.25L8 21l-2.25.75L5 24l-.75-2.25L2 21l2.25-.75L5 18z","M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5L19 2z"],
  moon:        "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun:         ["M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42","M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"],
};

const Ic = ({ name, size = 16, className = "", fill = "none" }) => {
  const d = icons[name];
  if (!d) return null;
  return <Icon d={d} size={size} className={className} fill={fill} />;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  const colors = { success: "#0ea5e9", error: "#ef4444", info: "#7c3aed" };
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 9999,
      background: "#fff", border: `2px solid ${colors[type]}`,
      borderRadius: 14, padding: "12px 18px", boxShadow: "0 8px 32px rgba(14,165,233,0.18)",
      display: "flex", alignItems: "center", gap: 10, minWidth: 220,
      animation: "toastIn .3s ease",
    }}>
      <span style={{ fontSize: 18 }}>{type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}</span>
      <span style={{ fontSize: 13, color: "#0f2a4a", fontWeight: 600 }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
        <Ic name="x" size={14} />
      </button>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Notifications({ isOpen = true, onClose }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [showArchived, setShowArchived] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState("");
  const [filteredByTag, setFilteredByTag] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [expandedNotifications, setExpandedNotifications] = useState([]);
  const [bookmarkedNotifications, setBookmarkedNotifications] = useState([]);
  const [pinnedNotifications, setPinnedNotifications] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState(["weekly-sprint-042"]);
  const [toast, setToast] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [regForm, setRegForm] = useState({
    name: "", email: "", phone: "", github: "", teamName: "", teamSize: "1", experience: "beginner", bio: "", agreeTerms: false
  });
  const [regErrors, setRegErrors] = useState({});
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    sound: true, desktopNotifications: true, emailDigest: true,
    pushNotifications: true, badgeCount: true, autoArchiveRead: false,
  });

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Notification Data ──────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([
    {
      id: 1, type: "contest", category: "contest", icon: "🏆",
      title: "Weekly Code Sprint Live!", message: "Join now - 1000 XP prize pool",
      time: "Just now", timestamp: Date.now(), read: false, archived: false, priority: "high", urgency: "live",
      details: "The weekly coding competition has started! Solve algorithm challenges, compete with developers worldwide, and climb the leaderboard. Top 50 participants get special badges and XP rewards.",
      event: {
        id: "weekly-sprint-042", name: "Weekly Code Sprint #42", type: "contest", status: "live",
        difficulty: "Medium-Hard", participants: 1524, maxParticipants: 5000, timeLeft: "6 days 23 hours",
        duration: "7 days", fee: 0, xpReward: 1000, registrationRequired: false,
        prizes: ["1st Place: 500 XP + Gold Badge + $100 Amazon Gift Card","2nd Place: 300 XP + Silver Badge","3rd Place: 200 XP + Bronze Badge","Top 10: Special Profile Frame"],
        rules: ["Individual participation only","No plagiarism allowed","5 problems to solve","Time limit: 2 hours per problem"],
        tags: ["algorithms","data-structures","competitive","weekly"],
        organizers: ["CodeQuest","TechLeague"], sponsor: "Google Cloud",
      }
    },
    {
      id: 2, type: "hackathon", category: "hackathon", icon: "🚀",
      title: "24-Hour AI Hackathon", message: "Build AI solutions - $5000 prize",
      time: "Starting tomorrow", timestamp: Date.now() + 24 * 3600000, read: false, archived: false, priority: "high", urgency: "upcoming",
      details: "Join our biggest AI hackathon of the year! Build innovative AI solutions, work in teams of up to 4, and compete for cash prizes, internships, and VC meetings.",
      event: {
        id: "ai-hackathon-spring-2024", name: "Spring AI Hackathon 2024", type: "hackathon", status: "upcoming",
        difficulty: "Advanced", participants: 327, maxParticipants: 1000, timeLeft: "Registration closes in 2 days",
        duration: "24 hours", fee: 0, xpReward: 2500, registrationRequired: true,
        registrationDeadline: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
        prizes: ["1st Place: $5000 + Internship Offers","2nd Place: $2000 + Tech Gadgets","3rd Place: $1000 + Premium Courses","All Participants: Completion Certificate"],
        rules: ["Teams of 2-4 participants","AI/ML project required","Open-source encouraged","Live demo required"],
        tags: ["ai","machine-learning","hackathon","team","premium"],
        organizers: ["AI Tech Group","ML Labs"], sponsor: "Microsoft Azure",
        requirements: "Basic ML knowledge, GitHub account", teamSize: "2-4 members", techStack: "Any (Python preferred)",
        mentors: ["Dr. Sarah Chen","Alex ML Expert","Tech VC Partner"],
      }
    },
    {
      id: 3, type: "achievement", category: "achievement", icon: "🌟",
      title: "50 Problems Solved!", message: "You're now in top 10%",
      time: "5 min ago", timestamp: Date.now() - 5 * 60 * 1000, read: false, archived: false, priority: "medium", urgency: "normal",
      details: "Congratulations on reaching this milestone! You've demonstrated exceptional problem-solving skills and consistency.",
      reward: { xp: 500, badge: "Problem Solver Pro", tier: "gold", perks: ["Profile badge","+10% XP boost for 7 days","Early access to contests"] }
    },
    {
      id: 4, type: "streak", category: "streak", icon: "🔥",
      title: "7-Day Streak Maintained!", message: "Keep going - 3 more days for bonus",
      time: "1 hour ago", timestamp: Date.now() - 3600000, read: true, archived: false, priority: "medium", urgency: "normal",
      details: "Amazing consistency! You've solved at least one problem every day for 7 days. Maintain your streak for 3 more days to unlock the Dedicated Coder badge.",
      reward: { xp: 150, badge: "7-Day Streak", tier: "silver", perks: ["Streak badge","XP multiplier x1.2"] }
    },
    {
      id: 5, type: "workshop", category: "workshop", icon: "🎓",
      title: "System Design Workshop", message: "Free 3-hour live session - Seats filling fast",
      time: "2 hours ago", timestamp: Date.now() - 7200000, read: true, archived: false, priority: "medium", urgency: "upcoming",
      details: "A comprehensive workshop covering system design fundamentals: scalability, databases, caching, and load balancing. Perfect for interview prep.",
      event: {
        id: "sysdesign-workshop-01", name: "System Design Fundamentals Workshop", type: "workshop", status: "upcoming",
        difficulty: "Intermediate", participants: 456, maxParticipants: 500, timeLeft: "Starts in 4 hours",
        duration: "3 hours", fee: 0, xpReward: 300, registrationRequired: true,
        tags: ["system-design","interviews","architecture","scalability"],
        organizers: ["TechMentor"], sponsor: "AWS",
      }
    },
    {
      id: 6, type: "system", category: "system", icon: "⚙️",
      title: "Platform Update v3.2", message: "New features: AI hints, dark mode, more",
      time: "Yesterday", timestamp: Date.now() - 86400000, read: true, archived: false, priority: "low", urgency: "normal",
      details: "We've shipped a major update with AI-powered hints, improved dark mode, faster load times, and a revamped leaderboard. Check out what's new!",
    },
    {
      id: 7, type: "contest", category: "contest", icon: "🎯",
      title: "Algorithm Marathon", message: "Starting in 3 days - Register now!",
      time: "3 hours ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, read: false, archived: false, priority: "high", urgency: "registration",
      details: "A 5-hour intensive algorithm contest with challenging problems. Test your skills against the best algorithmists in the community.",
      event: {
        id: "algo-marathon-015", name: "Algorithm Marathon #15", type: "contest", status: "registration",
        difficulty: "Hard", participants: 842, maxParticipants: 2000, timeLeft: "Registration closes in 2 days",
        duration: "5 hours", fee: 0, xpReward: 800, registrationRequired: true,
        registrationDeadline: new Date(Date.now() + 2 * 24 * 3600000).toISOString(),
        prizes: ["1st: 800 XP + Gold Trophy","2nd: 500 XP + Silver Trophy","3rd: 300 XP + Bronze Trophy","Top 20: Special Recognition"],
        rules: ["Individual participation","No external help","8 problems of varying difficulty","Real-time leaderboard"],
        tags: ["algorithms","competitive","intensive","premium"],
        organizers: ["AlgoExperts"], specialNote: "Previous winners get automatic qualification",
      }
    },
    {
      id: 8, type: "reminder", category: "reminder", icon: "⏰",
      title: "Contest Ends Tomorrow", message: "Monthly Challenge - Submit your solution",
      time: "4 hours ago", timestamp: Date.now() - 4 * 3600000, read: false, archived: false, priority: "high", urgency: "normal",
      details: "Don't forget — the Monthly Algorithm Challenge closes in 24 hours. Submit your solution to claim your XP and badge!",
    },
  ]);

  // ── Categories & Filters ───────────────────────────────────────────────────
  const categories = [
    { id: "all", name: "All", icon: "📢", color: "lb" },
    { id: "contest", name: "Contests", icon: "🏆", color: "amber" },
    { id: "hackathon", name: "Hackathons", icon: "🚀", color: "violet" },
    { id: "achievement", name: "Achievements", icon: "🌟", color: "emerald" },
    { id: "streak", name: "Streaks", icon: "🔥", color: "orange" },
    { id: "workshop", name: "Workshops", icon: "🎓", color: "indigo" },
    { id: "system", name: "System", icon: "⚙️", color: "slate" },
    { id: "reminder", name: "Reminders", icon: "⏰", color: "pink" },
  ];

  const quickFilters = [
    { id: "unread", name: "Unread", icon: "bell", color: "#2fa2f5" },
    { id: "high-priority", name: "High Priority", icon: "zap", color: "#ef4444" },
    { id: "live", name: "Live Events", icon: "flame", color: "#f97316" },
    { id: "bookmarked", name: "Bookmarked", icon: "star", color: "#eab308" },
    { id: "pinned", name: "Pinned", icon: "pin", color: "#10b981" },
    { id: "registered", name: "Registered", icon: "checkCircle", color: "#8b5cf6" },
  ];

  // ── Filtered & Sorted ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = notifications.filter(n => n.archived === showArchived);
    if (filterCategory !== "all") result = result.filter(n => n.category === filterCategory);
    if (filteredByTag) {
      if (filteredByTag === "unread") result = result.filter(n => !n.read);
      else if (filteredByTag === "high-priority") result = result.filter(n => n.priority === "high");
      else if (filteredByTag === "live") result = result.filter(n => n.urgency === "live");
      else if (filteredByTag === "bookmarked") result = result.filter(n => bookmarkedNotifications.includes(n.id));
      else if (filteredByTag === "pinned") result = result.filter(n => pinnedNotifications.includes(n.id));
      else if (filteredByTag === "registered") result = result.filter(n => n.event && registeredEvents.includes(n.event.id));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        (n.details && n.details.toLowerCase().includes(q)) ||
        (n.event?.tags && n.event.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    const pMap = { time: (a,b) => b.timestamp-a.timestamp, unread: (a,b) => a.read===b.read?0:a.read?1:-1, priority: (a,b) => ({high:0,medium:1,low:2}[a.priority]-{high:0,medium:1,low:2}[b.priority]) };
    result = [...result].sort(pMap[sortBy] || pMap.time);
    result.sort((a,b) => {
      const ap = pinnedNotifications.includes(a.id), bp = pinnedNotifications.includes(b.id);
      return ap===bp ? 0 : ap ? -1 : 1;
    });
    return result;
  }, [notifications, filterCategory, searchQuery, sortBy, showArchived, filteredByTag, bookmarkedNotifications, pinnedNotifications, registeredEvents]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const all = notifications.filter(n => !n.archived);
    return {
      total: all.length, unread: all.filter(n=>!n.read).length, read: all.filter(n=>n.read).length,
      highPriority: all.filter(n=>n.priority==="high").length, live: all.filter(n=>n.urgency==="live").length,
      bookmarked: bookmarkedNotifications.length,
    };
  }, [notifications, bookmarkedNotifications]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const openDetails = n => {
    setNotifications(p => p.map(x => x.id===n.id ? {...x, read:true} : x));
    setShowDetailModal(n);
  };
  const markAsRead = (id, e) => { e?.stopPropagation(); setNotifications(p=>p.map(n=>n.id===id?{...n,read:true}:n)); };
  const markAsUnread = (id, e) => { e?.stopPropagation(); setNotifications(p=>p.map(n=>n.id===id?{...n,read:false}:n)); };
  const markAllAsRead = () => { setNotifications(p=>p.map(n=>({...n,read:true}))); showToast("All marked as read"); };
  const deleteNotification = (id, e) => { e?.stopPropagation(); setNotifications(p=>p.filter(n=>n.id!==id)); if(showDetailModal?.id===id) setShowDetailModal(null); showToast("Notification deleted"); };
  const archiveNotification = (id, e) => { e?.stopPropagation(); setNotifications(p=>p.map(n=>n.id===id?{...n,archived:true}:n)); if(showDetailModal?.id===id) setShowDetailModal(null); showToast("Archived"); };
  const unarchiveNotification = (id, e) => { e?.stopPropagation(); setNotifications(p=>p.map(n=>n.id===id?{...n,archived:false}:n)); showToast("Restored"); };
  const toggleBookmark = (id, e) => { e?.stopPropagation(); setBookmarkedNotifications(p=>p.includes(id)?p.filter(b=>b!==id):[...p,id]); };
  const togglePin = (id, e) => { e?.stopPropagation(); setPinnedNotifications(p=>p.includes(id)?p.filter(b=>b!==id):[...p,id]); };
  const toggleExpand = (id, e) => { e?.stopPropagation(); setExpandedNotifications(p=>p.includes(id)?p.filter(b=>b!==id):[...p,id]); };

  const shareNotification = (n, e) => {
    e?.stopPropagation();
    const text = `${n.title} — ${n.message}`;
    navigator.clipboard?.writeText(text).then(() => showToast("Copied to clipboard!")).catch(() => showToast("Copy failed","error"));
  };

  const selectAllVisible = () => {
    if (isAllSelected) { setSelectedNotifications([]); setIsAllSelected(false); }
    else { setSelectedNotifications(filtered.map(n=>n.id)); setIsAllSelected(true); }
  };

  const performBulkAction = (action) => {
    const ids = selectedNotifications;
    if (action==="mark-read") setNotifications(p=>p.map(n=>ids.includes(n.id)?{...n,read:true}:n));
    else if (action==="mark-unread") setNotifications(p=>p.map(n=>ids.includes(n.id)?{...n,read:false}:n));
    else if (action==="archive") setNotifications(p=>p.map(n=>ids.includes(n.id)?{...n,archived:true}:n));
    else if (action==="delete") setNotifications(p=>p.filter(n=>!ids.includes(n.id)));
    else if (action==="bookmark") setBookmarkedNotifications(p=>[...new Set([...p,...ids])]);
    setSelectedNotifications([]); setIsAllSelected(false); setShowBulkActions(false);
    showToast(`Bulk action applied to ${ids.length} items`);
  };

  const confirmClearAll = () => {
    setNotifications(p=>p.map(n=>(!n.archived ? {...n,archived:true} : n)));
    setShowConfirm(false); setShowDetailModal(null);
    showToast(showArchived ? "Archived cleared" : "All notifications archived");
  };

  const exportNotifications = (format) => {
    let data, ext;
    if (format==="csv") {
      const hdr = "Title,Message,Category,Time,Read,Priority";
      const rows = notifications.map(n=>`"${n.title}","${n.message}","${n.category}","${n.time}","${n.read?'Yes':'No'}","${n.priority}"`);
      data = [hdr,...rows].join("\n"); ext="csv";
    } else { data=JSON.stringify(notifications,null,2); ext="json"; }
    const blob = new Blob([data],{type:"text/plain"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`notifications.${ext}`; a.click();
    setShowExportOptions(false); showToast(`Exported as ${format.toUpperCase()}`);
  };

  const importNotifications = () => {
    try {
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) { setNotifications(p=>[...parsed,...p]); setShowImportModal(false); setImportData(""); showToast(`Imported ${parsed.length} notifications`); }
      else showToast("Invalid format — expected array","error");
    } catch { showToast("Invalid JSON","error"); }
  };

  // ── Registration Form ──────────────────────────────────────────────────────
  const validateReg = () => {
    const err = {};
    if (!regForm.name.trim()) err.name = "Name is required";
    if (!regForm.email.trim() || !/\S+@\S+\.\S+/.test(regForm.email)) err.email = "Valid email required";
    if (!regForm.phone.trim() || !/^\+?[\d\s\-()]{7,}$/.test(regForm.phone)) err.phone = "Valid phone required";
    if (!regForm.agreeTerms) err.agreeTerms = "You must agree to the terms";
    return err;
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const err = validateReg();
    if (Object.keys(err).length) { setRegErrors(err); return; }
    setRegSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    const eventId = showRegistrationModal.id;
    setRegisteredEvents(p => [...new Set([...p, eventId])]);
    const newN = {
      id: Date.now(), type:"system", category:"system", icon:"✅",
      title:"Registration Confirmed", message:`You're registered for ${showRegistrationModal.name}`,
      time:"Just now", timestamp:Date.now(), read:false, archived:false, priority:"medium", urgency:"normal",
      details:`Your registration for ${showRegistrationModal.name} is confirmed. Check your email at ${regForm.email} for details.`,
    };
    setNotifications(p=>[newN,...p]);
    setRegSubmitting(false);
    setShowRegistrationModal(null);
    setRegForm({ name:"", email:"", phone:"", github:"", teamName:"", teamSize:"1", experience:"beginner", bio:"", agreeTerms:false });
    setRegErrors({});
    showToast(`Successfully registered for ${showRegistrationModal?.name || "event"}! 🎉`);
  };

  const participateInChallenge = (event) => {
    if (event.registrationRequired && !registeredEvents.includes(event.id)) {
      setShowRegistrationModal(event);
    } else {
      setShowChallengeModal(event);
    }
  };

  // ── UI Helpers ─────────────────────────────────────────────────────────────
  const urgencyBadge = (urgency) => {
    const map = {
      live: { bg:"#fee2e2", color:"#dc2626", border:"#fca5a5", icon:"flame", label:"LIVE" },
      registration: { bg:"#dbeafe", color:"#2563eb", border:"#93c5fd", icon:"clock", label:"REGISTER" },
      upcoming: { bg:"#fef9c3", color:"#ca8a04", border:"#fde047", icon:"calendar", label:"SOON" },
      scheduled: { bg:"#ede9fe", color:"#7c3aed", border:"#c4b5fd", icon:"clock", label:"SCHEDULED" },
    };
    const m = map[urgency]; if (!m) return null;
    return (
      <span style={{ background:m.bg, color:m.color, border:`1px solid ${m.border}`, padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700, display:"inline-flex", alignItems:"center", gap:3 }}>
        <Ic name={m.icon} size={10} /> {m.label}
      </span>
    );
  };

  const catColors = {
    contest:"#fef3c7", hackathon:"#ede9fe", achievement:"#d1fae5",
    streak:"#ffedd5", workshop:"#e0e7ff", system:"#f1f5f9",
    reminder:"#fce7f3", announcement:"#fee2e2", update:"#cffafe", all:"#dbeafe"
  };

  const priorityDot = p => ({ high:"#ef4444", medium:"#f59e0b", low:"#10b981" }[p] || "#94a3b8");

  if (!isOpen) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // Shared modal backdrop + close behavior
  const ModalBackdrop = ({ onClose, children, zIndex = 200 }) => (
    <div style={{ position:"fixed",inset:0,zIndex,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(15,42,80,0.55)",backdropFilter:"blur(4px)" }} />
      <div style={{ position:"relative",zIndex:1 }}>{children}</div>
    </div>
  );

  const modalCard = {
    background:"#fff", borderRadius:20, padding:28,
    width:"min(460px,95vw)", maxHeight:"90vh", overflowY:"auto",
    boxShadow:"0 24px 64px rgba(14,165,233,0.18), 0 4px 16px rgba(0,0,0,0.1)",
    border:"1px solid #bae6fd",
  };

  // ─── Styles (inline system) ───────────────────────────────────────────────
  const s = {
    panel: {
      position:"fixed", top:0, right:0, width:"min(440px,100vw)", height:"100dvh",
      background:"linear-gradient(170deg,#f0f9ff 0%,#e0f2fe 100%)",
      boxShadow:"-8px 0 48px rgba(14,165,233,0.15)", zIndex:100,
      display:"flex", flexDirection:"column", fontFamily:"system-ui,sans-serif",
      borderLeft:"1px solid #bae6fd", animation:"slideInPanel .32s cubic-bezier(.4,0,.2,1)",
    },
    header: {
      padding:"16px 18px", borderBottom:"1px solid #bae6fd",
      background:"rgba(240,249,255,.95)", backdropFilter:"blur(10px)",
      display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0,
    },
    iconBtn: (active=false) => ({
      background: active ? "#dbeafe" : "none", border:"none", cursor:"pointer",
      padding:8, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
      color: active ? "#2fa2f5" : "#64748b", transition:"all .2s",
    }),
    pill: (active, bg="#2fa2f5", fgActive="#fff", fgOff="#475569") => ({
      padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer",
      border:"none", display:"inline-flex", alignItems:"center", gap:5, transition:"all .18s",
      background: active ? bg : "#fff", color: active ? fgActive : fgOff,
      boxShadow: active ? `0 2px 10px ${bg}44` : "0 0 0 1px #cbd5e1",
    }),
    nCard: (isRead, isPinned, isSelected) => ({
      padding:"13px 14px", borderRadius:14, cursor:"pointer",
      border: isSelected ? "2px solid #2fa2f5" : isPinned ? "2px solid #fbbf24" : `1px solid ${isRead?"#e0f2fe":"#93d3fc"}`,
      background: isSelected ? "#dbeafe" : isRead ? "#fff" : "linear-gradient(135deg,#f0f9ff,#dbeafe)",
      transition:"all .2s", position:"relative", overflow:"hidden",
      boxShadow: isRead ? "none" : "0 2px 12px rgba(47,162,245,0.1)",
    }),
    input: (hasErr=false) => ({
      width:"100%", padding:"9px 12px", borderRadius:10, fontSize:13,
      border:`1.5px solid ${hasErr?"#ef4444":"#bae6fd"}`, outline:"none",
      background:"#f0f9ff", color:"#0f2a4a", fontFamily:"inherit",
      boxSizing:"border-box",
    }),
    label: { fontSize:12, fontWeight:600, color:"#0369a1", marginBottom:4, display:"block" },
    primaryBtn: { padding:"11px 20px", borderRadius:12, background:"linear-gradient(135deg,#2fa2f5,#0ea5e9)", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:8, transition:"all .2s" },
    secondaryBtn: { padding:"10px 18px", borderRadius:12, background:"#f0f9ff", color:"#0369a1", border:"1px solid #bae6fd", cursor:"pointer", fontWeight:600, fontSize:13, transition:"all .2s" },
    dangerBtn: { padding:"10px 18px", borderRadius:12, background:"#fef2f2", color:"#dc2626", border:"1px solid #fca5a5", cursor:"pointer", fontWeight:600, fontSize:13, transition:"all .2s" },
    errText: { color:"#ef4444", fontSize:11, marginTop:3 },
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes slideInPanel { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes toastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .notif-card:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(47,162,245,0.14) !important; }
        .icon-btn-hover:hover { background:#dbeafe !important; color:#2fa2f5 !important; }
        .pill-hover:hover { filter:brightness(.96); }
        .scroll-thin::-webkit-scrollbar{width:4px} .scroll-thin::-webkit-scrollbar-track{background:#f0f9ff} .scroll-thin::-webkit-scrollbar-thumb{background:#bae6fd;border-radius:4px}
        input:focus, textarea:focus, select:focus { border-color:#2fa2f5 !important; box-shadow:0 0 0 3px rgba(47,162,245,.15) !important; }
      `}</style>

      {/* Overlay */}
      <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(15,42,80,0.3)",backdropFilter:"blur(2px)",zIndex:99 }} />

      {/* Panel */}
      <div style={s.panel}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <span style={{ fontSize:24 }}>🔔</span>
              {stats.unread > 0 && (
                <span style={{ position:"absolute",top:-4,right:-4,background:"#ef4444",color:"#fff",fontSize:9,fontWeight:800,minWidth:17,height:17,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",animation:"livePulse 2s infinite" }}>
                  {stats.unread}
                </span>
              )}
            </div>
            <div>
              <h2 style={{ margin:0,fontSize:17,fontWeight:800,color:"#0f2a4a" }}>Notifications</h2>
              <p style={{ margin:0,fontSize:11,color:"#64748b" }}>{showArchived?"Archived":"Active"} • {filtered.length} items</p>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <button className="icon-btn-hover" style={s.iconBtn(showStats)} onClick={() => setShowStats(v=>!v)} title="Stats"><Ic name="barChart" size={17} /></button>
            <button className="icon-btn-hover" style={s.iconBtn(showSettings)} onClick={() => setShowSettings(v=>!v)} title="Settings"><Ic name="settings" size={17} /></button>
            <button className="icon-btn-hover" style={s.iconBtn(showQuickFilters)} onClick={() => setShowQuickFilters(v=>!v)} title="Quick Filters"><Ic name="filter" size={17} /></button>
            <button className="icon-btn-hover" style={{ ...s.iconBtn(), marginLeft:4 }} onClick={onClose} title="Close"><Ic name="x" size={18} /></button>
          </div>
        </div>

        {/* ── Stats Panel ── */}
        {showStats && (
          <div style={{ background:"#fff", borderBottom:"1px solid #bae6fd", padding:"12px 18px", flexShrink:0, animation:"fadeUp .25s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#0369a1" }}>OVERVIEW</span>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowStats(false)}><Ic name="x" size={14} /></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {[
                { label:"Total",        val:stats.total,       bg:"#f0f9ff", c:"#0369a1" },
                { label:"Unread",       val:stats.unread,      bg:"#dbeafe", c:"#1d4ed8" },
                { label:"High Priority",val:stats.highPriority,bg:"#fee2e2", c:"#dc2626" },
                { label:"Live Events",  val:stats.live,        bg:"#ffedd5", c:"#c2410c" },
                { label:"Bookmarked",   val:stats.bookmarked,  bg:"#fef9c3", c:"#a16207" },
                { label:"Pinned",       val:pinnedNotifications.length, bg:"#d1fae5", c:"#065f46" },
              ].map(({ label, val, bg, c }) => (
                <div key={label} style={{ background:bg, borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:c }}>{val}</div>
                  <div style={{ fontSize:10, color:"#64748b", marginTop:1 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Filters ── */}
        {showQuickFilters && (
          <div style={{ background:"#f0f9ff", borderBottom:"1px solid #bae6fd", padding:"10px 18px", flexShrink:0, animation:"fadeUp .25s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#0369a1" }}>QUICK FILTERS</span>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowQuickFilters(false)}><Ic name="x" size={14} /></button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {quickFilters.map(f => (
                <button key={f.id} className="pill-hover" style={s.pill(filteredByTag===f.id, f.color)}
                  onClick={() => { setFilteredByTag(filteredByTag===f.id ? null : f.id); setFilterCategory("all"); }}>
                  <Ic name={f.icon} size={12} /> {f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Search + Category Tabs ── */}
        <div style={{ background:"#fff", borderBottom:"1px solid #bae6fd", padding:"10px 14px", flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <div style={{ flex:1, position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}><Ic name="search" size={15} /></span>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search notifications..."
                style={{ ...s.input(), paddingLeft:32, width:"100%", boxSizing:"border-box" }} />
              {searchQuery && (
                <button onClick={()=>setSearchQuery("")} style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:2 }}>
                  <Ic name="x" size={12} />
                </button>
              )}
            </div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
              style={{ ...s.input(), width:"auto", paddingLeft:8, paddingRight:8, cursor:"pointer" }}>
              <option value="time">Newest</option>
              <option value="unread">Unread first</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div style={{ display:"flex", gap:5, overflowX:"auto", paddingBottom:2 }} className="scroll-thin">
            {categories.map(cat => (
              <button key={cat.id} className="pill-hover" style={{ ...s.pill(filterCategory===cat.id,"#2fa2f5"), whiteSpace:"nowrap", flexShrink:0 }}
                onClick={() => { setFilterCategory(cat.id); setFilteredByTag(null); }}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bulk Actions Bar ── */}
        {showBulkActions && selectedNotifications.length > 0 && (
          <div style={{ background:"#dbeafe", borderBottom:"1px solid #93d3fc", padding:"8px 14px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", animation:"fadeUp .2s ease" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#1d4ed8" }}>{selectedNotifications.length} selected</span>
            <div style={{ display:"flex", gap:4 }}>
              {[
                { action:"mark-read", icon:"checkCheck", title:"Mark Read" },
                { action:"mark-unread", icon:"circle", title:"Mark Unread" },
                { action:"bookmark", icon:"star", title:"Bookmark" },
                { action:"archive", icon:"archive", title:"Archive" },
                { action:"delete", icon:"trash", title:"Delete" },
              ].map(a => (
                <button key={a.action} className="icon-btn-hover" style={{ ...s.iconBtn(), background:a.action==="delete"?"#fee2e2":"none", color:a.action==="delete"?"#dc2626":"#2563eb" }}
                  onClick={() => performBulkAction(a.action)} title={a.title}>
                  <Ic name={a.icon} size={15} />
                </button>
              ))}
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => { setShowBulkActions(false); setSelectedNotifications([]); setIsAllSelected(false); }}><Ic name="x" size={15} /></button>
            </div>
          </div>
        )}

        {/* ── Notification List ── */}
        <div className="scroll-thin" style={{ flex:1, overflowY:"auto", padding:"10px 12px 16px", display:"flex", flexDirection:"column", gap:8 }}>

          {/* Select All row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:4 }}>
            <button style={s.pill(isAllSelected,"#2fa2f5")} onClick={selectAllVisible}>
              <Ic name="checkCheck" size={11} /> {isAllSelected ? "Deselect All" : "Select All"}
            </button>
            {selectedNotifications.length > 0 && (
              <button style={s.pill(true,"#0369a1")} onClick={() => setShowBulkActions(true)}>
                Bulk Actions ({selectedNotifications.length})
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"56px 20px", color:"#94a3b8" }}>
              <div style={{ fontSize:44, marginBottom:12 }}>🔕</div>
              <p style={{ fontSize:15, fontWeight:700, margin:"0 0 6px", color:"#64748b" }}>No notifications</p>
              <p style={{ fontSize:12, margin:0 }}>Try adjusting your filters</p>
            </div>
          ) : filtered.map((n, idx) => {
            const isExpanded = expandedNotifications.includes(n.id);
            const isSelected = selectedNotifications.includes(n.id);
            const isBookmarked = bookmarkedNotifications.includes(n.id);
            const isPinned = pinnedNotifications.includes(n.id);
            const isRegistered = n.event && registeredEvents.includes(n.event.id);

            /* ─ accent color for left border ─ */
            const accentColor = isPinned ? "#fbbf24" : !n.read ? "#2fa2f5" : "#e2e8f0";

            return (
              <div
                key={n.id}
                className="notif-card"
                style={{
                  borderRadius: 14,
                  background: isSelected
                    ? "#e0f2fe"
                    : n.read ? "#ffffff" : "linear-gradient(160deg,#f8fcff 0%,#edf6ff 100%)",
                  border: `1px solid ${isSelected ? "#38bdf8" : isPinned ? "#fde68a" : n.read ? "#dde9f5" : "#bae6fd"}`,
                  borderLeft: `4px solid ${accentColor}`,
                  cursor: "pointer",
                  transition: "box-shadow .16s, transform .16s",
                  animationDelay: `${idx * .045}s`,
                  animation: "fadeUp .3s ease both",
                  boxShadow: n.read
                    ? "0 1px 3px rgba(14,165,233,0.05)"
                    : "0 2px 10px rgba(47,162,245,0.10)",
                }}
                onClick={() => {
                  if (showBulkActions) setSelectedNotifications(p => p.includes(n.id) ? p.filter(x=>x!==n.id) : [...p,n.id]);
                  else openDetails(n);
                }}
              >
                {/* ══ TOP SECTION: icon + content ══ */}
                <div style={{ display:"flex", alignItems:"flex-start", padding:"12px 12px 0 12px", gap:12 }}>

                  {/* Checkbox (bulk mode) */}
                  {(showBulkActions || isSelected) && (
                    <div style={{ paddingTop:2, flexShrink:0 }} onClick={e=>{e.stopPropagation();setSelectedNotifications(p=>p.includes(n.id)?p.filter(x=>x!==n.id):[...p,n.id]);}}>
                      <div style={{ width:18,height:18,borderRadius:5,border:`2px solid ${isSelected?"#2fa2f5":"#93c5fd"}`,background:isSelected?"#2fa2f5":"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                        {isSelected && <Ic name="check" size={10} style={{ color:"#fff" }} />}
                      </div>
                    </div>
                  )}

                  {/* Emoji badge */}
                  <div style={{ width:42, height:42, borderRadius:12, background:catColors[n.category]||"#f0f9ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                    {n.icon}
                  </div>

                  {/* Text block — full remaining width, NO truncation */}
                  <div style={{ flex:1, minWidth:0, paddingBottom:10 }}>

                    {/* Title row */}
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:4 }}>
                      <span style={{ fontWeight:700, fontSize:14, color:"#0c2340", lineHeight:1.35, flex:1 }}>
                        {n.title}
                      </span>
                      {/* Tiny status indicators — top right, never crowding text */}
                      <div style={{ display:"flex", gap:4, alignItems:"center", flexShrink:0, paddingTop:2 }}>
                        {!n.read && (
                          <span style={{ width:8, height:8, borderRadius:"50%", background:"#2fa2f5", display:"block", boxShadow:"0 0 6px #2fa2f5" }} title="Unread" />
                        )}
                        <div style={{ width:7, height:7, borderRadius:"50%", background:priorityDot(n.priority), display:"block" }} title={`${n.priority} priority`} />
                      </div>
                    </div>

                    {/* Message — full text, wraps, never clipped */}
                    <p style={{ margin:"0 0 8px", fontSize:13, color:"#4a5568", lineHeight:1.55, wordBreak:"break-word", whiteSpace:"normal" }}>
                      {n.message}
                    </p>

                    {/* Meta row */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                      <span style={{ fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                        <Ic name="clock" size={10}/> {n.time}
                      </span>
                      {n.event?.participants && (
                        <span style={{ fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                          <Ic name="users" size={10}/> {n.event.participants.toLocaleString()}
                        </span>
                      )}
                      {urgencyBadge(n.urgency)}
                      {isPinned && <span style={{ fontSize:10, background:"#fef9c3", color:"#92400e", border:"1px solid #fde68a", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>📌 Pinned</span>}
                      {isBookmarked && <span style={{ fontSize:10, background:"#fffbeb", color:"#92400e", border:"1px solid #fde68a", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>⭐ Saved</span>}
                      {isRegistered && <span style={{ fontSize:10, background:"#dcfce7", color:"#166534", border:"1px solid #86efac", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>✓ Joined</span>}
                    </div>
                  </div>
                </div>

                {/* ══ BOTTOM ACTION ROW — always visible, full width ══ */}
                <div
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 12px 8px 12px", borderTop:"1px solid #f0f8ff", marginTop:2 }}
                  onClick={e=>e.stopPropagation()}
                >
                  {/* Left: quick action icons */}
                  <div style={{ display:"flex", gap:2 }}>
                    <button className="icon-btn-hover" style={{ background:"none", border:"none", cursor:"pointer", padding:"5px 7px", borderRadius:8, display:"flex", alignItems:"center", gap:4, fontSize:11, color: isPinned ? "#d97706" : "#94a3b8", transition:"all .15s" }}
                      onClick={e=>togglePin(n.id,e)} title={isPinned?"Unpin":"Pin"}>
                      <Ic name="pin" size={13}/> {isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button className="icon-btn-hover" style={{ background:"none", border:"none", cursor:"pointer", padding:"5px 7px", borderRadius:8, display:"flex", alignItems:"center", gap:4, fontSize:11, color: isBookmarked ? "#d97706" : "#94a3b8", transition:"all .15s" }}
                      onClick={e=>toggleBookmark(n.id,e)} title="Bookmark">
                      <Ic name="star" size={13} fill={isBookmarked?"#fbbf24":"none"}/> {isBookmarked ? "Saved" : "Save"}
                    </button>
                    <button className="icon-btn-hover" style={{ background:"none", border:"none", cursor:"pointer", padding:"5px 7px", borderRadius:8, display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8", transition:"all .15s" }}
                      onClick={e=>archiveNotification(n.id,e)} title="Archive">
                      <Ic name="archive" size={13}/>
                    </button>
                    <button className="icon-btn-hover" style={{ background:"none", border:"none", cursor:"pointer", padding:"5px 7px", borderRadius:8, display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#f87171", transition:"all .15s" }}
                      onClick={e=>deleteNotification(n.id,e)} title="Delete">
                      <Ic name="trash" size={13}/>
                    </button>
                  </div>

                  {/* Right: expand toggle */}
                  <button className="icon-btn-hover" style={{ background: isExpanded ? "#dbeafe" : "#f0f9ff", border:"1px solid #bae6fd", cursor:"pointer", padding:"4px 10px", borderRadius:8, display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#0369a1", fontWeight:600, transition:"all .15s" }}
                    onClick={e=>toggleExpand(n.id,e)}>
                    {isExpanded ? "Less" : "Details"} <Ic name={isExpanded?"chevUp":"chevDown"} size={12}/>
                  </button>
                </div>

                {/* ══ EXPANDED PANEL ══ */}
                {isExpanded && (
                  <div
                    style={{ borderTop:"1px dashed #bae6fd", background:"#f6fbff", padding:"14px 14px 14px", animation:"fadeUp .22s ease" }}
                    onClick={e=>e.stopPropagation()}
                  >
                    <p style={{ fontSize:13, color:"#334155", margin:"0 0 12px", lineHeight:1.65 }}>{n.details}</p>

                    {n.event?.tags && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                        {n.event.tags.map((t,i) => (
                          <span key={i} style={{ background:"#dbeafe", color:"#1e40af", fontSize:11, padding:"2px 9px", borderRadius:10, fontWeight:600 }}>#{t}</span>
                        ))}
                      </div>
                    )}

                    {n.reward && (
                      <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:20 }}>🏅</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:"#065f46" }}>+{n.reward.xp} XP earned</div>
                          <div style={{ fontSize:11, color:"#4ade80" }}>{n.reward.badge}</div>
                        </div>
                      </div>
                    )}

                    {/* Expanded action buttons */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {n.event && (
                        <button style={{ ...s.primaryBtn, padding:"9px 16px", fontSize:13 }} onClick={() => participateInChallenge(n.event)}>
                          <Ic name="zap" size={14}/> {isRegistered ? "Enter Challenge" : n.event.registrationRequired ? "Register Now" : "Join Now"}
                        </button>
                      )}
                      <button style={{ ...s.secondaryBtn, padding:"8px 14px", fontSize:13, display:"flex", alignItems:"center", gap:6 }} onClick={e=>shareNotification(n,e)}>
                        <Ic name="share" size={13}/> Share
                      </button>
                      {n.read
                        ? <button style={{ ...s.secondaryBtn, padding:"8px 14px", fontSize:13 }} onClick={e=>markAsUnread(n.id,e)}>Mark Unread</button>
                        : <button style={{ ...s.secondaryBtn, padding:"8px 14px", fontSize:13 }} onClick={e=>markAsRead(n.id,e)}>Mark Read</button>
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div style={{ borderTop:"1px solid #bae6fd", padding:"10px 14px", background:"rgba(240,249,255,.95)", backdropFilter:"blur(10px)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:4 }}>
            <button className="icon-btn-hover" style={s.iconBtn(showArchived)} onClick={() => setShowArchived(v=>!v)} title={showArchived?"Show Active":"Show Archived"}><Ic name={showArchived?"bell":"archive"} size={16} /></button>
            <button className="icon-btn-hover" style={s.iconBtn()} onClick={markAllAsRead} title="Mark All Read"><Ic name="checkCheck" size={16} /></button>
            <div style={{ position:"relative" }}>
              <button className="icon-btn-hover" style={s.iconBtn(showExportOptions)} onClick={() => setShowExportOptions(v=>!v)} title="Export"><Ic name="download" size={16} /></button>
              {showExportOptions && (
                <div style={{ position:"absolute",bottom:"calc(100% + 6px)",left:0,background:"#fff",border:"1px solid #bae6fd",borderRadius:12,boxShadow:"0 8px 24px rgba(14,165,233,.15)",padding:6,zIndex:50,minWidth:140,animation:"fadeUp .2s ease" }}>
                  <div style={{ display:"flex",justifyContent:"flex-end",padding:"0 2px 4px" }}><button className="icon-btn-hover" style={s.iconBtn()} onClick={()=>setShowExportOptions(false)}><Ic name="x" size={12} /></button></div>
                  {["json","csv"].map(f=>(
                    <button key={f} style={{ display:"block",width:"100%",padding:"7px 12px",fontSize:12,fontWeight:600,color:"#0f2a4a",background:"none",border:"none",cursor:"pointer",borderRadius:8,textAlign:"left" }}
                      onMouseOver={e=>e.target.style.background="#f0f9ff"} onMouseOut={e=>e.target.style.background="none"}
                      onClick={()=>exportNotifications(f)}>
                      Export as {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowConfirm(true)} title="Clear All"><Ic name="trash" size={16} /></button>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button style={s.secondaryBtn} onClick={() => setShowImportModal(true)}><Ic name="upload" size={13} /> Import</button>
            <button style={s.primaryBtn} onClick={() => showToast("Share link copied!","success")}><Ic name="share" size={13} /> Share</button>
          </div>
        </div>

        {/* ── Settings Dropdown ── */}
        {showSettings && (
          <div style={{ position:"absolute",top:54,right:14,width:260,background:"#fff",borderRadius:16,boxShadow:"0 12px 40px rgba(14,165,233,.18)",border:"1px solid #bae6fd",padding:16,zIndex:200,animation:"fadeUp .22s ease" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#0f2a4a", display:"flex", alignItems:"center", gap:6 }}><Ic name="settings" size={14} /> Settings</span>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowSettings(false)}><Ic name="x" size={14} /></button>
            </div>
            {Object.entries(notificationSettings).map(([key, val]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f0f9ff" }}>
                <span style={{ fontSize:12, color:"#475569" }}>{key.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase())}</span>
                <button onClick={() => setNotificationSettings(p=>({...p,[key]:!val}))}
                  style={{ width:38,height:21,borderRadius:20,border:"none",cursor:"pointer",background:val?"#2fa2f5":"#e2e8f0",position:"relative",transition:"all .25s" }}>
                  <div style={{ width:17,height:17,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:val?18:2,transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.15)" }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────── Detail Modal ──────────── */}
      {showDetailModal && (
        <ModalBackdrop onClose={() => setShowDetailModal(null)} zIndex={300}>
          <div style={{ ...modalCard, width:"min(520px,95vw)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:50,height:50,borderRadius:14,background:catColors[showDetailModal.category]||"#f0f9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>{showDetailModal.icon}</div>
                <div>
                  <h3 style={{ margin:0,fontSize:17,fontWeight:800,color:"#0f2a4a" }}>{showDetailModal.title}</h3>
                  <p style={{ margin:"2px 0 0",fontSize:12,color:"#64748b" }}>{showDetailModal.time} · {showDetailModal.category}</p>
                </div>
              </div>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowDetailModal(null)}><Ic name="x" size={18} /></button>
            </div>

            <div style={{ marginBottom:14 }}>{urgencyBadge(showDetailModal.urgency)}</div>
            <p style={{ fontSize:14, color:"#334155", lineHeight:1.6, margin:"0 0 16px" }}>{showDetailModal.details}</p>

            {showDetailModal.event && (
              <div style={{ background:"#f0f9ff", borderRadius:14, padding:14, marginBottom:14, border:"1px solid #bae6fd" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    ["Difficulty", showDetailModal.event.difficulty],
                    ["Duration", showDetailModal.event.duration],
                    ["Participants", showDetailModal.event.participants?.toLocaleString()],
                    ["XP Reward", `+${showDetailModal.event.xpReward} XP`],
                    ["Sponsor", showDetailModal.event.sponsor],
                    ["Fee", showDetailModal.event.fee === 0 ? "Free" : `$${showDetailModal.event.fee}`],
                  ].filter(([,v])=>v).map(([k,v])=>(
                    <div key={k} style={{ background:"#fff",borderRadius:8,padding:"7px 10px" }}>
                      <div style={{ fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase" }}>{k}</div>
                      <div style={{ fontSize:13,fontWeight:700,color:"#0f2a4a",marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {showDetailModal.event.prizes && (
                  <div style={{ marginTop:12 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#0369a1",marginBottom:6 }}>PRIZES</div>
                    {showDetailModal.event.prizes.map((p,i)=>(
                      <div key={i} style={{ fontSize:12,color:"#334155",padding:"3px 0",display:"flex",alignItems:"center",gap:6 }}>
                        <span style={{ fontSize:14 }}>{["🥇","🥈","🥉","🏅","🎖️"][i]||"•"}</span>{p}
                      </div>
                    ))}
                  </div>
                )}
                {showDetailModal.event.tags && (
                  <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginTop:10 }}>
                    {showDetailModal.event.tags.map((t,i)=><span key={i} style={{ background:"#dbeafe",color:"#1e40af",fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:600 }}>#{t}</span>)}
                  </div>
                )}
              </div>
            )}

            {showDetailModal.reward && (
              <div style={{ background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:12,padding:12,marginBottom:14,display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:28 }}>🏅</span>
                <div>
                  <div style={{ fontSize:13,fontWeight:700,color:"#065f46" }}>+{showDetailModal.reward.xp} XP · {showDetailModal.reward.badge}</div>
                  {showDetailModal.reward.perks?.map((p,i)=><div key={i} style={{ fontSize:11,color:"#166534" }}>✓ {p}</div>)}
                </div>
              </div>
            )}

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {showDetailModal.event && (
                <button style={s.primaryBtn} onClick={() => { participateInChallenge(showDetailModal.event); setShowDetailModal(null); }}>
                  <Ic name="zap" size={15} />
                  {registeredEvents.includes(showDetailModal.event.id) ? "Enter Challenge" : showDetailModal.event.registrationRequired ? "Register Now" : "Join Now"}
                </button>
              )}
              <button style={s.secondaryBtn} onClick={e=>shareNotification(showDetailModal,e)}><Ic name="share" size={13} /> Share</button>
              <button style={s.secondaryBtn} onClick={e=>toggleBookmark(showDetailModal.id,e)}>
                <Ic name="star" size={13} fill={bookmarkedNotifications.includes(showDetailModal.id)?"#fbbf24":"none"} />
                {bookmarkedNotifications.includes(showDetailModal.id) ? "Saved" : "Save"}
              </button>
              <button style={{ ...s.secondaryBtn, marginLeft:"auto" }} onClick={e=>{archiveNotification(showDetailModal.id,e);setShowDetailModal(null);}}>
                <Ic name="archive" size={13} /> Archive
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ──────────── Registration Modal ──────────── */}
      {showRegistrationModal && (
        <ModalBackdrop onClose={() => setShowRegistrationModal(null)} zIndex={350}>
          <div style={{ ...modalCard, maxWidth:"min(500px,95vw)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <div>
                <h3 style={{ margin:0,fontSize:18,fontWeight:800,color:"#0f2a4a",display:"flex",alignItems:"center",gap:8 }}><Ic name="userPlus" size={20} style={{ color:"#2fa2f5" }} /> Register</h3>
                <p style={{ margin:"4px 0 0",fontSize:12,color:"#64748b" }}>{showRegistrationModal.name}</p>
              </div>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowRegistrationModal(null)}><Ic name="x" size={18} /></button>
            </div>

            {/* Event summary strip */}
            <div style={{ background:"linear-gradient(90deg,#dbeafe,#e0f2fe)",borderRadius:12,padding:"10px 14px",marginBottom:16,display:"flex",gap:16,flexWrap:"wrap" }}>
              {[["📅",showRegistrationModal.duration||"TBD"],["⭐",showRegistrationModal.difficulty||"Open"],["💰",showRegistrationModal.fee===0?"Free":`$${showRegistrationModal.fee}`],[" ✨",`+${showRegistrationModal.xpReward} XP`]].map(([icon,val],i)=>(
                <span key={i} style={{ fontSize:12,fontWeight:600,color:"#0369a1" }}>{icon} {val}</span>
              ))}
            </div>

            <form onSubmit={handleRegistrationSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* Name + Email */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={s.label}>Full Name *</label>
                  <input style={s.input(!!regErrors.name)} value={regForm.name} onChange={e=>setRegForm(p=>({...p,name:e.target.value}))} placeholder="Jane Doe" />
                  {regErrors.name && <div style={s.errText}>{regErrors.name}</div>}
                </div>
                <div>
                  <label style={s.label}>Email *</label>
                  <input style={s.input(!!regErrors.email)} value={regForm.email} onChange={e=>setRegForm(p=>({...p,email:e.target.value}))} placeholder="jane@example.com" type="email" />
                  {regErrors.email && <div style={s.errText}>{regErrors.email}</div>}
                </div>
              </div>

              {/* Phone + GitHub */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={s.label}>Phone *</label>
                  <input style={s.input(!!regErrors.phone)} value={regForm.phone} onChange={e=>setRegForm(p=>({...p,phone:e.target.value}))} placeholder="+1 234 567 8900" type="tel" />
                  {regErrors.phone && <div style={s.errText}>{regErrors.phone}</div>}
                </div>
                <div>
                  <label style={s.label}>GitHub Username</label>
                  <input style={s.input()} value={regForm.github} onChange={e=>setRegForm(p=>({...p,github:e.target.value}))} placeholder="@username" />
                </div>
              </div>

              {/* Team fields (only for hackathons) */}
              {showRegistrationModal.type === "hackathon" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <label style={s.label}>Team Name</label>
                    <input style={s.input()} value={regForm.teamName} onChange={e=>setRegForm(p=>({...p,teamName:e.target.value}))} placeholder="Awesome Team" />
                  </div>
                  <div>
                    <label style={s.label}>Team Size</label>
                    <select style={s.input()} value={regForm.teamSize} onChange={e=>setRegForm(p=>({...p,teamSize:e.target.value}))}>
                      {["1","2","3","4"].map(n=><option key={n} value={n}>{n} {n==="1"?"(Solo)":"member"}{n>"1"?"s":""}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Experience */}
              <div>
                <label style={s.label}>Experience Level</label>
                <select style={s.input()} value={regForm.experience} onChange={e=>setRegForm(p=>({...p,experience:e.target.value}))}>
                  <option value="beginner">🌱 Beginner (0-1 yr)</option>
                  <option value="intermediate">🌿 Intermediate (1-3 yrs)</option>
                  <option value="advanced">🌳 Advanced (3-5 yrs)</option>
                  <option value="expert">🚀 Expert (5+ yrs)</option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label style={s.label}>Short Bio / Motivation</label>
                <textarea style={{ ...s.input(), resize:"vertical", minHeight:70 }} value={regForm.bio}
                  onChange={e=>setRegForm(p=>({...p,bio:e.target.value}))} placeholder="Tell us a bit about yourself..." />
              </div>

              {/* Terms */}
              <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                <input type="checkbox" checked={regForm.agreeTerms} onChange={e=>setRegForm(p=>({...p,agreeTerms:e.target.checked}))}
                  style={{ width:16,height:16,marginTop:2,accentColor:"#2fa2f5",flexShrink:0 }} />
                <span style={{ fontSize:12, color:"#475569" }}>
                  I agree to the <span style={{ color:"#2fa2f5",textDecoration:"underline",cursor:"pointer" }}>Terms & Conditions</span> and <span style={{ color:"#2fa2f5",textDecoration:"underline",cursor:"pointer" }}>Code of Conduct</span> for this event.
                </span>
              </label>
              {regErrors.agreeTerms && <div style={{ ...s.errText, marginTop:-6 }}>{regErrors.agreeTerms}</div>}

              {/* Buttons */}
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" style={{ ...s.secondaryBtn, flex:1 }} onClick={() => setShowRegistrationModal(null)}>Cancel</button>
                <button type="submit" style={{ ...s.primaryBtn, flex:2, justifyContent:"center", opacity:regSubmitting?.4:1 }} disabled={regSubmitting}>
                  {regSubmitting ? (
                    <><span style={{ display:"inline-block",animation:"livePulse 1s infinite" }}>⏳</span> Registering...</>
                  ) : (
                    <><Ic name="checkCircle" size={16} /> Complete Registration</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </ModalBackdrop>
      )}

      {/* ──────────── Challenge Modal ──────────── */}
      {showChallengeModal && (
        <ModalBackdrop onClose={() => setShowChallengeModal(null)} zIndex={350}>
          <div style={modalCard}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ margin:0,fontSize:17,fontWeight:800,color:"#0f2a4a",display:"flex",alignItems:"center",gap:8 }}>
                <Ic name="target" size={20} style={{ color:"#2fa2f5" }} /> {showChallengeModal.name}
              </h3>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowChallengeModal(null)}><Ic name="x" size={18} /></button>
            </div>
            <div style={{ background:"#f0f9ff",borderRadius:12,padding:14,marginBottom:16 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                {[["Difficulty",showChallengeModal.difficulty],["Duration",showChallengeModal.duration],["Max Participants",showChallengeModal.maxParticipants?.toLocaleString()],["XP Reward",`+${showChallengeModal.xpReward} XP`]].map(([k,v])=>v&&(
                  <div key={k} style={{ background:"#fff",borderRadius:8,padding:"7px 10px" }}>
                    <div style={{ fontSize:10,color:"#94a3b8",fontWeight:700 }}>{k}</div>
                    <div style={{ fontSize:13,fontWeight:700,color:"#0f2a4a",marginTop:2 }}>{v}</div>
                  </div>
                ))}
              </div>
              {showChallengeModal.rules && (
                <div style={{ marginTop:12 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:"#0369a1",marginBottom:6 }}>RULES</div>
                  {showChallengeModal.rules.map((r,i)=><div key={i} style={{ fontSize:12,color:"#334155",padding:"2px 0" }}>• {r}</div>)}
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...s.secondaryBtn, flex:1 }} onClick={() => setShowChallengeModal(null)}>Cancel</button>
              <button style={{ ...s.primaryBtn, flex:2, justifyContent:"center" }} onClick={() => { setShowChallengeModal(null); showToast("Redirecting to challenge... Good luck! 🎉"); }}>
                <Ic name="zap" size={16} /> Start Challenge
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ──────────── Confirm Clear Modal ──────────── */}
      {showConfirm && (
        <ModalBackdrop onClose={() => setShowConfirm(false)} zIndex={350}>
          <div style={{ ...modalCard, maxWidth:380 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0,fontSize:17,fontWeight:800,color:"#0f2a4a" }}>Clear All Notifications</h3>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowConfirm(false)}><Ic name="x" size={18} /></button>
            </div>
            <p style={{ fontSize:13,color:"#64748b",margin:"0 0 20px",lineHeight:1.5 }}>
              All visible notifications will be archived. You can restore them from the Archived section.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...s.secondaryBtn, flex:1 }} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button style={{ ...s.dangerBtn, flex:1 }} onClick={confirmClearAll}>Archive All</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ──────────── Import Modal ──────────── */}
      {showImportModal && (
        <ModalBackdrop onClose={() => setShowImportModal(false)} zIndex={350}>
          <div style={{ ...modalCard, maxWidth:440 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ margin:0,fontSize:17,fontWeight:800,color:"#0f2a4a" }}><Ic name="upload" size={17} /> Import Notifications</h3>
              <button className="icon-btn-hover" style={s.iconBtn()} onClick={() => setShowImportModal(false)}><Ic name="x" size={18} /></button>
            </div>
            <textarea value={importData} onChange={e=>setImportData(e.target.value)} placeholder="Paste JSON array of notifications here..."
              style={{ ...s.input(), resize:"vertical", minHeight:160, fontFamily:"monospace", fontSize:12 }} />
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button style={{ ...s.secondaryBtn, flex:1 }} onClick={() => setShowImportModal(false)}>Cancel</button>
              <button style={{ ...s.primaryBtn, flex:1, justifyContent:"center" }} onClick={importNotifications}><Ic name="save" size={14} /> Import</button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ──────────── Toast ──────────── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}