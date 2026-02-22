// src/pages/mockinterviews/ScheduleSession.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Check, Calendar,
  Clock, Video, Star, Zap, ArrowLeft,
  CheckCircle, X, User, BookOpen, AlertCircle
} from 'lucide-react';

// ─── Static Data ─────────────────────────────────────────────────────────────

const SESSION_TYPES = [
  {
    id: 'technical',
    label: 'Technical Interview',
    emoji: '💻',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    description: 'Data structures, algorithms, and coding problems',
    durations: ['45 min', '60 min', '90 min'],
    topics: ['Arrays & Strings','Linked Lists','Trees & Graphs','Dynamic Programming','Sorting & Searching','Recursion','Hash Maps','Bit Manipulation','Greedy Algorithms','Backtracking'],
  },
  {
    id: 'behavioral',
    label: 'Behavioral Interview',
    emoji: '🎯',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    description: 'STAR method, leadership, teamwork & conflict resolution',
    durations: ['30 min', '45 min', '60 min'],
    topics: ['Leadership','Conflict Resolution','Teamwork','Failure Stories','Achievements','Career Goals','STAR Method','Communication','Decision Making','Mentorship'],
  },
  {
    id: 'system-design',
    label: 'System Design',
    emoji: '🏗️',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    description: 'Scalable systems, architecture & distributed design',
    durations: ['60 min', '90 min', '120 min'],
    topics: ['Load Balancing','Caching','Databases','Microservices','Message Queues','CDN','Rate Limiting','API Design','Consistency Models','Sharding'],
  },
  {
    id: 'frontend',
    label: 'Frontend Interview',
    emoji: '🎨',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'React, JavaScript, CSS, performance & accessibility',
    durations: ['45 min', '60 min', '75 min'],
    topics: ['React Hooks','State Management','CSS Architecture','Performance','Accessibility','Testing','TypeScript','Build Tools','Browser APIs','Component Design'],
  },
];

const INTERVIEWERS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Software Engineer',
    company: 'Google',
    avatar: '👩‍💼',
    rating: 4.9,
    sessions: 512,
    specialties: ['technical', 'system-design'],
    bio: '10+ years in software engineering. Expert in DSA, system design, and distributed systems.',
    availability: 'High',
    languages: ['Python', 'Java', 'C++'],
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Engineering Manager',
    company: 'Amazon',
    avatar: '👨‍💼',
    rating: 4.8,
    sessions: 387,
    specialties: ['behavioral', 'technical'],
    bio: 'Engineering Manager with 8 years of leadership. Expert in behavioral interviews and Amazon leadership principles.',
    availability: 'Medium',
    languages: ['Java', 'Python'],
  },
  {
    id: 3,
    name: 'Alex Rivera',
    role: 'Staff Engineer',
    company: 'Netflix',
    avatar: '👨‍🔬',
    rating: 4.95,
    sessions: 274,
    specialties: ['system-design', 'technical'],
    bio: 'Staff Engineer specializing in distributed systems. Built systems serving 200M+ users.',
    availability: 'Low',
    languages: ['Scala', 'Java', 'Go'],
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    role: 'Lead Frontend Engineer',
    company: 'Meta',
    avatar: '👩‍💻',
    rating: 4.87,
    sessions: 318,
    specialties: ['frontend', 'technical'],
    bio: 'Frontend expert with deep React, TypeScript, and web performance knowledge.',
    availability: 'High',
    languages: ['JavaScript', 'TypeScript', 'React'],
  },
  {
    id: 5,
    name: 'Jordan Kim',
    role: 'Principal Engineer',
    company: 'Microsoft',
    avatar: '🧑‍💻',
    rating: 4.92,
    sessions: 441,
    specialties: ['system-design', 'behavioral'],
    bio: 'Principal Engineer leading cloud infrastructure. Expert in large-scale system design.',
    availability: 'Medium',
    languages: ['C#', 'Python', 'Go'],
  },
];

const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM',
];
const UNAVAILABLE = new Set(['9:30 AM','11:00 AM','2:30 PM','4:00 PM']);

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const DIFFICULTY_OPTS = [
  { label: 'Easy',   color: '#10b981', desc: 'Foundation concepts' },
  { label: 'Medium', color: '#f59e0b', desc: 'Standard difficulty'  },
  { label: 'Hard',   color: '#ef4444', desc: 'Senior-level topics'  },
];

const STEPS = ['Session Type', 'Interviewer', 'Date & Time', 'Topics', 'Review'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const availBadge = (a) =>
  ({ High: '#10b981', Medium: '#f59e0b', Low: '#ef4444' })[a] || '#94a3b8';

const formatDate = (d) =>
  d ? d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '—';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SessionTypeStep({ value, onChange }) {
  return (
    <div>
      <h2 className="sch-step-title">What type of interview?</h2>
      <p className="sch-step-sub">Choose the format that best matches your target role.</p>
      <div className="sch-type-grid">
        {SESSION_TYPES.map(type => {
          const sel = value?.id === type.id;
          return (
            <button
              key={type.id}
              className="sch-type-card"
              onClick={() => onChange(type)}
              style={{
                borderColor: sel ? type.color : type.border,
                background: sel ? type.bg : '#fff',
                boxShadow: sel ? `0 0 0 3px ${type.color}25` : '0 1px 4px rgba(0,0,0,0.06)',
                transform: sel ? 'translateY(-2px)' : 'none',
              }}
            >
              <div className="sch-type-card-top">
                <span className="sch-type-emoji">{type.emoji}</span>
                {sel && (
                  <span className="sch-check-circle" style={{ background: type.color }}>
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="sch-type-label" style={{ color: sel ? type.color : '#1e293b' }}>{type.label}</div>
              <div className="sch-type-desc">{type.description}</div>
              <div className="sch-type-durations">
                {type.durations.map(d => (
                  <span key={d} className="sch-dur-pill" style={{ background: type.bg, color: type.color, borderColor: type.border }}>{d}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InterviewerStep({ sessionType, value, onChange }) {
  const recommended = INTERVIEWERS.filter(i => sessionType && i.specialties.includes(sessionType.id));
  const others = INTERVIEWERS.filter(i => !sessionType || !i.specialties.includes(sessionType.id));

  const renderGroup = (label, items) => items.length === 0 ? null : (
    <div key={label} style={{ marginBottom: 28 }}>
      <div className="sch-group-label">{label}</div>
      <div className="sch-iv-list">
        {items.map(iv => {
          const sel = value?.id === iv.id;
          return (
            <button
              key={iv.id}
              className="sch-iv-card"
              onClick={() => onChange(iv)}
              style={{
                borderColor: sel ? '#3b82f6' : '#e2e8f0',
                background: sel ? '#eff6ff' : '#fff',
                boxShadow: sel ? '0 0 0 3px #3b82f622' : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div className="sch-iv-avatar">{iv.avatar}</div>
              <div className="sch-iv-info">
                <div className="sch-iv-name-row">
                  <span className="sch-iv-name">{iv.name}</span>
                  <span className="sch-iv-avail" style={{ color: availBadge(iv.availability) }}>
                    ● {iv.availability}
                  </span>
                </div>
                <div className="sch-iv-role">{iv.role} @ <strong>{iv.company}</strong></div>
                <div className="sch-iv-bio">{iv.bio}</div>
                <div className="sch-iv-meta">
                  <span className="sch-iv-stat"><Star size={12} color="#f59e0b" fill="#f59e0b" /> {iv.rating}</span>
                  <span className="sch-iv-stat"><Video size={12} color="#64748b" /> {iv.sessions} sessions</span>
                  {iv.languages.map(l => <span key={l} className="sch-lang-tag">{l}</span>)}
                </div>
              </div>
              {sel && (
                <span className="sch-check-circle" style={{ background: '#3b82f6', flexShrink: 0 }}>
                  <Check size={13} color="#fff" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="sch-step-title">Select your interviewer</h2>
      <p className="sch-step-sub">All interviewers are experienced professionals from top tech companies.</p>
      <div style={{ marginTop: 24 }}>
        {renderGroup(`✨ Recommended for ${sessionType?.label || 'this type'}`, recommended)}
        {renderGroup('Other interviewers', others)}
      </div>
    </div>
  );
}

function DateTimeStep({ sessionType, value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selDate, setSelDate] = useState(value?.date || null);
  const [selTime, setSelTime] = useState(value?.time || null);
  const [selDur, setSelDur] = useState(value?.duration || sessionType?.durations?.[1] || '60 min');

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const isDisabled = (d) => {
    const dt = new Date(year, month, d);
    return dt < today || dt.getDay() === 0 || dt.getDay() === 6;
  };

  const pickDate = (d) => {
    if (isDisabled(d)) return;
    const dt = new Date(year, month, d);
    setSelDate(dt);
    setSelTime(null);
    onChange({ date: dt, time: null, duration: selDur });
  };

  const pickTime = (t) => {
    if (UNAVAILABLE.has(t)) return;
    setSelTime(t);
    onChange({ date: selDate, time: t, duration: selDur });
  };

  const pickDur = (d) => {
    setSelDur(d);
    onChange({ date: selDate, time: selTime, duration: d });
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div>
      <h2 className="sch-step-title">Pick a date & time</h2>
      <p className="sch-step-sub">Weekdays only. Times shown in your local timezone.</p>

      <div className="sch-datetime-grid">
        {/* Calendar */}
        <div className="sch-cal-card">
          <div className="sch-cal-nav">
            <button className="sch-nav-btn" onClick={prevMonth}><ChevronLeft size={17} /></button>
            <span className="sch-cal-month">{MONTHS[month]} {year}</span>
            <button className="sch-nav-btn" onClick={nextMonth}><ChevronRight size={17} /></button>
          </div>
          <div className="sch-cal-weekdays">
            {WEEKDAYS.map(d => <div key={d} className="sch-cal-wd">{d}</div>)}
          </div>
          <div className="sch-cal-grid">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dt = new Date(year, month, day);
              const disabled = isDisabled(day);
              const isToday = dt.toDateString() === today.toDateString();
              const selected = selDate && dt.toDateString() === selDate.toDateString();
              return (
                <button
                  key={day}
                  onClick={() => pickDate(day)}
                  disabled={disabled}
                  className="sch-cal-day"
                  style={{
                    background: selected ? '#3b82f6' : isToday ? '#eff6ff' : 'transparent',
                    color: selected ? '#fff' : disabled ? '#cbd5e1' : isToday ? '#3b82f6' : '#1e293b',
                    border: isToday && !selected ? '2px solid #3b82f6' : '2px solid transparent',
                    fontWeight: selected || isToday ? 700 : 400,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="sch-cal-legend">
            <span><span className="sch-legend-dot" style={{ background: '#3b82f6' }} /> Selected</span>
            <span><span className="sch-legend-dot" style={{ border: '2px solid #3b82f6', background: 'transparent' }} /> Today</span>
            <span><span className="sch-legend-dot" style={{ background: '#e2e8f0' }} /> Unavailable</span>
          </div>
        </div>

        {/* Duration + Time */}
        <div className="sch-right-col">
          <div className="sch-side-card">
            <div className="sch-side-title"><Clock size={14} color="#3b82f6" /> Duration</div>
            <div className="sch-dur-row">
              {(sessionType?.durations || ['45 min', '60 min', '90 min']).map(d => (
                <button
                  key={d}
                  onClick={() => pickDur(d)}
                  className="sch-dur-btn"
                  style={{
                    background: selDur === d ? '#3b82f6' : '#f8fafc',
                    color: selDur === d ? '#fff' : '#475569',
                    borderColor: selDur === d ? '#3b82f6' : '#e2e8f0',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="sch-side-card sch-time-card">
            <div className="sch-side-title">
              <Calendar size={14} color="#3b82f6" />
              {selDate ? `Times for ${selDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Select a date first'}
            </div>
            {selDate ? (
              <div className="sch-time-grid">
                {TIME_SLOTS.map(t => {
                  const unavail = UNAVAILABLE.has(t);
                  const sel = selTime === t;
                  return (
                    <button
                      key={t}
                      onClick={() => pickTime(t)}
                      disabled={unavail}
                      className="sch-time-btn"
                      style={{
                        background: sel ? '#3b82f6' : unavail ? '#f1f5f9' : '#fff',
                        color: sel ? '#fff' : unavail ? '#cbd5e1' : '#334155',
                        borderColor: sel ? '#3b82f6' : '#e2e8f0',
                        cursor: unavail ? 'not-allowed' : 'pointer',
                        textDecoration: unavail ? 'line-through' : 'none',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="sch-empty-slots">
                <Calendar size={30} color="#cbd5e1" />
                <span>Pick a date to see available slots</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicsStep({ sessionType, value, onChange }) {
  const topics = sessionType?.topics || [];
  const [selected, setSelected] = useState(value?.topics || []);
  const [difficulty, setDifficulty] = useState(value?.difficulty || 'Medium');
  const [notes, setNotes] = useState(value?.notes || '');

  const toggle = (t) => {
    const next = selected.includes(t) ? selected.filter(x => x !== t) : [...selected, t];
    setSelected(next);
    onChange({ topics: next, difficulty, notes });
  };

  const pickDiff = (d) => {
    setDifficulty(d);
    onChange({ topics: selected, difficulty: d, notes });
  };

  const updateNotes = (n) => {
    setNotes(n);
    onChange({ topics: selected, difficulty, notes: n });
  };

  return (
    <div>
      <h2 className="sch-step-title">Customize your session</h2>
      <p className="sch-step-sub">Select focus topics and difficulty. Leave topics empty to let the interviewer choose.</p>

      <div className="sch-topics-grid">
        {/* Topics */}
        <div className="sch-cal-card">
          <div className="sch-side-title" style={{ marginBottom: 14 }}>
            <BookOpen size={14} color={sessionType?.color || '#3b82f6'} />
            Focus Topics
            <span style={{ marginLeft: 6, color: '#94a3b8', fontWeight: 400, fontSize: 13 }}>({selected.length} selected)</span>
          </div>
          <div className="sch-topics-wrap">
            {topics.map(t => {
              const sel = selected.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className="sch-topic-btn"
                  style={{
                    background: sel ? sessionType?.color || '#3b82f6' : '#f8fafc',
                    color: sel ? '#fff' : '#475569',
                    borderColor: sel ? sessionType?.color || '#3b82f6' : '#e2e8f0',
                  }}
                >
                  {sel && <Check size={11} strokeWidth={3} style={{ marginRight: 4 }} />}
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sch-right-col">
          {/* Difficulty */}
          <div className="sch-side-card">
            <div className="sch-side-title"><Zap size={14} color="#f59e0b" /> Difficulty Level</div>
            <div className="sch-diff-row">
              {DIFFICULTY_OPTS.map(d => (
                <button
                  key={d.label}
                  onClick={() => pickDiff(d.label)}
                  className="sch-diff-btn"
                  style={{
                    borderColor: difficulty === d.label ? d.color : '#e2e8f0',
                    background: difficulty === d.label ? `${d.color}18` : '#f8fafc',
                    color: difficulty === d.label ? d.color : '#64748b',
                    fontWeight: difficulty === d.label ? 700 : 500,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{d.label}</span>
                  <span style={{ fontSize: 11, marginTop: 3, fontWeight: 400 }}>{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="sch-side-card" style={{ flex: 1 }}>
            <div className="sch-side-title"><AlertCircle size={14} color="#8b5cf6" /> Special Requests / Notes</div>
            <textarea
              className="sch-notes"
              rows={5}
              placeholder="e.g. Focus on binary trees, I'm preparing for FAANG interviews, please be strict with timing..."
              value={notes}
              onChange={e => updateNotes(e.target.value)}
            />
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{notes.length}/500 characters</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ form, onEdit }) {
  const { sessionType, interviewer, dateTime, topics: topicsData } = form;
  const accentColor = sessionType?.color || '#3b82f6';

  const rows = [
    { label: 'Session Type', value: `${sessionType?.emoji} ${sessionType?.label}`, step: 0 },
    { label: 'Interviewer', value: interviewer ? `${interviewer.avatar} ${interviewer.name} (${interviewer.role} @ ${interviewer.company})` : '—', step: 1 },
    { label: 'Date', value: formatDate(dateTime?.date), step: 2 },
    { label: 'Time', value: dateTime?.time || '—', step: 2 },
    { label: 'Duration', value: dateTime?.duration || '—', step: 2 },
    { label: 'Difficulty', value: topicsData?.difficulty || '—', step: 3 },
    { label: 'Focus Topics', value: topicsData?.topics?.length ? topicsData.topics.join(', ') : 'Interviewer will choose', step: 3 },
    { label: 'Notes', value: topicsData?.notes || 'None', step: 3 },
  ];

  return (
    <div>
      <h2 className="sch-step-title">Review your session</h2>
      <p className="sch-step-sub">Double-check everything before confirming your booking.</p>

      <div className="sch-review-banner" style={{ borderColor: accentColor, background: `${accentColor}10` }}>
        <div className="sch-review-banner-icon" style={{ background: `${accentColor}20` }}>
          <span style={{ fontSize: 32 }}>{sessionType?.emoji}</span>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: '#1e293b' }}>{sessionType?.label}</div>
          <div style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
            {formatDate(dateTime?.date)} · {dateTime?.time} · {dateTime?.duration}
          </div>
        </div>
      </div>

      <div className="sch-review-table">
        {rows.map(row => (
          <div key={row.label} className="sch-review-row">
            <span className="sch-review-label">{row.label}</span>
            <span className="sch-review-val">{row.value}</span>
            <button className="sch-edit-btn" onClick={() => onEdit(row.step)}>Edit</button>
          </div>
        ))}
      </div>

      <div className="sch-confirm-notes">
        <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Booking notes:</strong> A confirmation email and calendar invite will be sent once confirmed.
          You can cancel up to 2 hours before the session starts.
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ form, onReset }) {
  const navigate = useNavigate();
  return (
    <div className="sch-success">
      <div className="sch-success-icon">🎉</div>
      <h2 className="sch-success-title">Session Booked!</h2>
      <p className="sch-success-sub">
        Your <strong>{form.sessionType?.label}</strong> with <strong>{form.interviewer?.name}</strong> is confirmed for{' '}
        <strong>{formatDate(form.dateTime?.date)}</strong> at <strong>{form.dateTime?.time}</strong>.
      </p>
      <div className="sch-success-details">
        <div className="sch-success-row">
          <Calendar size={16} color="#3b82f6" />
          <span>{formatDate(form.dateTime?.date)} · {form.dateTime?.time}</span>
        </div>
        <div className="sch-success-row">
          <Clock size={16} color="#3b82f6" />
          <span>{form.dateTime?.duration}</span>
        </div>
        <div className="sch-success-row">
          <User size={16} color="#3b82f6" />
          <span>{form.interviewer?.name} — {form.interviewer?.role} @ {form.interviewer?.company}</span>
        </div>
      </div>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
        A confirmation email and calendar invite has been sent to your inbox.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="sch-btn-primary" onClick={() => navigate('/dashboard/mockinterviews')}>
          Back to Dashboard
        </button>
        <button className="sch-btn-outline" onClick={onReset}>Schedule Another</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScheduleSession() {
  const [step, setStep] = useState(0);
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({
    sessionType: null,
    interviewer: null,
    dateTime: null,
    topics: null,
  });

  const updateForm = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!form.sessionType;
    if (step === 1) return !!form.interviewer;
    if (step === 2) return !!form.dateTime?.date && !!form.dateTime?.time;
    if (step === 3) return !!form.topics?.difficulty;
    return true;
  };

  const next = () => { if (canNext()) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));
  const confirm = () => setBooked(true);
  const reset = () => { setForm({ sessionType: null, interviewer: null, dateTime: null, topics: null }); setStep(0); setBooked(false); };

  if (booked) return (
    <>
      <style>{CSS}</style>
      <div className="sch-wrap"><SuccessScreen form={form} onReset={reset} /></div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="sch-wrap">
        {/* Header */}
        <div className="sch-header">
          <Link to="/dashboard/mockinterviews" className="sch-back-link">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="sch-page-title">Schedule a Mock Interview</h1>
          <p className="sch-page-sub">Book a personalized practice session with a top-tier interviewer</p>
        </div>

        {/* Stepper */}
        <div className="sch-stepper">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <React.Fragment key={label}>
                <div className="sch-step-item">
                  <div
                    className="sch-step-circle"
                    style={{
                      background: done ? '#10b981' : active ? '#3b82f6' : '#e2e8f0',
                      color: done || active ? '#fff' : '#94a3b8',
                      boxShadow: active ? '0 0 0 4px #3b82f625' : 'none',
                    }}
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </div>
                  <span className="sch-step-label" style={{ color: active ? '#3b82f6' : done ? '#10b981' : '#94a3b8', fontWeight: active ? 700 : 500 }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="sch-step-line" style={{ background: done ? '#10b981' : '#e2e8f0' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="sch-card">
          {step === 0 && <SessionTypeStep value={form.sessionType} onChange={v => updateForm('sessionType', v)} />}
          {step === 1 && <InterviewerStep sessionType={form.sessionType} value={form.interviewer} onChange={v => updateForm('interviewer', v)} />}
          {step === 2 && <DateTimeStep sessionType={form.sessionType} value={form.dateTime} onChange={v => updateForm('dateTime', v)} />}
          {step === 3 && <TopicsStep sessionType={form.sessionType} value={form.topics} onChange={v => updateForm('topics', v)} />}
          {step === 4 && <ReviewStep form={form} onEdit={s => setStep(s)} />}
        </div>

        {/* Footer Nav */}
        <div className="sch-footer">
          <button className="sch-btn-outline" onClick={back} disabled={step === 0}>
            <ChevronLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4, background: i === step ? '#3b82f6' : i < step ? '#10b981' : '#e2e8f0', transition: 'all 0.25s' }} />
            ))}
          </div>
          {step < STEPS.length - 1 ? (
            <button className="sch-btn-primary" onClick={next} disabled={!canNext()}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button className="sch-btn-primary sch-btn-confirm" onClick={confirm}>
              <CheckCircle size={16} /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .sch-wrap {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 20px 60px;
    color: #1e293b;
  }

  /* Header */
  .sch-back-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: #64748b; font-size: 14px; font-weight: 500;
    text-decoration: none; margin-bottom: 20px;
    transition: color 0.15s;
  }
  .sch-back-link:hover { color: #3b82f6; }
  .sch-page-title { font-size: 30px; font-weight: 800; margin: 0 0 6px; color: #0f172a; }
  .sch-page-sub { color: #64748b; font-size: 15px; margin: 0 0 32px; }

  /* Stepper */
  .sch-stepper {
    display: flex; align-items: center; gap: 0;
    background: #fff; border-radius: 16px;
    padding: 20px 28px; margin-bottom: 24px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
    overflow-x: auto;
  }
  .sch-step-item { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
  .sch-step-circle {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; transition: all 0.25s;
  }
  .sch-step-label { font-size: 12px; white-space: nowrap; transition: color 0.2s; }
  .sch-step-line { flex: 1; height: 2px; min-width: 24px; margin: 0 8px; margin-bottom: 22px; transition: background 0.3s; }

  /* Card */
  .sch-card {
    background: #fff; border-radius: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    padding: 36px;
    margin-bottom: 20px;
  }

  /* Step headings */
  .sch-step-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
  .sch-step-sub { color: #64748b; font-size: 14px; margin: 0; }

  /* Session Type */
  .sch-type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 14px; margin-top: 24px; }
  .sch-type-card {
    padding: 20px; border-radius: 14px; border: 2px solid #e2e8f0;
    text-align: left; cursor: pointer; transition: all 0.2s;
    background: #fff;
  }
  .sch-type-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .sch-type-emoji { font-size: 30px; }
  .sch-type-label { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .sch-type-desc { font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 12px; }
  .sch-type-durations { display: flex; flex-wrap: wrap; gap: 6px; }
  .sch-dur-pill { padding: 3px 10px; border-radius: 20px; border: 1px solid; font-size: 12px; font-weight: 600; }
  .sch-check-circle { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; }

  /* Interviewer */
  .sch-group-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
  .sch-iv-list { display: flex; flex-direction: column; gap: 10px; }
  .sch-iv-card {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px; border-radius: 14px; border: 2px solid #e2e8f0;
    cursor: pointer; text-align: left; transition: all 0.2s;
    width: 100%;
  }
  .sch-iv-avatar { font-size: 36px; flex-shrink: 0; }
  .sch-iv-info { flex: 1; }
  .sch-iv-name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .sch-iv-name { font-weight: 700; font-size: 16px; color: #0f172a; }
  .sch-iv-avail { font-size: 12px; font-weight: 600; }
  .sch-iv-role { font-size: 13px; color: #64748b; margin: 2px 0 6px; }
  .sch-iv-bio { font-size: 13px; color: #475569; line-height: 1.5; }
  .sch-iv-meta { display: flex; align-items: center; gap: 14px; margin-top: 8px; flex-wrap: wrap; }
  .sch-iv-stat { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #64748b; font-weight: 600; }
  .sch-lang-tag { padding: 2px 8px; background: #f1f5f9; color: #475569; border-radius: 6px; font-size: 12px; font-weight: 600; }

  /* DateTime */
  .sch-datetime-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
  .sch-cal-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; }
  .sch-cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .sch-nav-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #475569; transition: all 0.15s;
  }
  .sch-nav-btn:hover { background: #3b82f6; color: #fff; border-color: #3b82f6; }
  .sch-cal-month { font-weight: 700; font-size: 15px; color: #0f172a; }
  .sch-cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 6px; }
  .sch-cal-wd { text-align: center; font-size: 11px; font-weight: 700; color: #94a3b8; padding: 4px 0; }
  .sch-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .sch-cal-day {
    aspect-ratio: 1; border-radius: 8px; font-size: 13px;
    border: 2px solid transparent; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .sch-cal-day:not(:disabled):hover { background: #dbeafe !important; }
  .sch-cal-legend { display: flex; gap: 14px; margin-top: 12px; font-size: 12px; color: #64748b; flex-wrap: wrap; }
  .sch-cal-legend span { display: flex; align-items: center; gap: 5px; }
  .sch-legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }

  .sch-right-col { display: flex; flex-direction: column; gap: 16px; }
  .sch-side-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
  .sch-time-card { flex: 1; }
  .sch-side-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
  .sch-dur-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .sch-dur-btn { padding: 8px 16px; border-radius: 10px; border: 1.5px solid; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .sch-time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .sch-time-btn { padding: 8px 4px; border-radius: 8px; border: 1.5px solid; font-size: 12px; font-weight: 600; transition: all 0.15s; }
  .sch-time-btn:not(:disabled):hover { border-color: #3b82f6; color: #3b82f6; }
  .sch-empty-slots { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 32px 0; color: #94a3b8; font-size: 13px; }

  /* Topics */
  .sch-topics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
  .sch-topics-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
  .sch-topic-btn { padding: 7px 14px; border-radius: 20px; border: 1.5px solid; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; }
  .sch-diff-row { display: flex; gap: 10px; }
  .sch-diff-btn { flex: 1; padding: 12px 8px; border-radius: 12px; border: 2px solid; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.15s; }
  .sch-notes {
    width: 100%; resize: vertical; border: 1.5px solid #e2e8f0;
    border-radius: 10px; padding: 10px 12px; font-size: 13px;
    font-family: inherit; color: #334155; line-height: 1.5;
    transition: border-color 0.15s; box-sizing: border-box;
  }
  .sch-notes:focus { outline: none; border-color: #3b82f6; }

  /* Review */
  .sch-review-banner {
    display: flex; align-items: center; gap: 16px;
    border: 2px solid; border-radius: 16px; padding: 20px;
    margin-bottom: 24px; margin-top: 24px;
  }
  .sch-review-banner-icon { width: 64px; height: 64px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sch-review-table { border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
  .sch-review-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
  .sch-review-row:last-child { border-bottom: none; }
  .sch-review-label { min-width: 120px; font-size: 13px; font-weight: 700; color: #64748b; padding-top: 1px; }
  .sch-review-val { flex: 1; font-size: 14px; color: #1e293b; line-height: 1.5; }
  .sch-edit-btn { font-size: 12px; color: #3b82f6; background: none; border: none; cursor: pointer; font-weight: 700; padding: 0; white-space: nowrap; }
  .sch-edit-btn:hover { text-decoration: underline; }
  .sch-confirm-notes {
    display: flex; align-items: flex-start; gap: 10px;
    background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px;
    padding: 14px 16px; margin-top: 20px; font-size: 13px; color: #065f46; line-height: 1.5;
  }

  /* Footer */
  .sch-footer {
    display: flex; align-items: center; justify-content: space-between;
    background: #fff; border-radius: 16px; border: 1px solid #e2e8f0;
    padding: 16px 24px; box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  }
  .sch-btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; background: #3b82f6; color: #fff;
    border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
  }
  .sch-btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
  .sch-btn-primary:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }
  .sch-btn-confirm { background: linear-gradient(135deg, #10b981, #059669); }
  .sch-btn-confirm:hover { background: linear-gradient(135deg, #059669, #047857); }
  .sch-btn-outline {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 20px; background: #fff; color: #475569;
    border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; font-family: inherit;
    text-decoration: none;
  }
  .sch-btn-outline:hover { background: #f8fafc; border-color: #cbd5e1; }
  .sch-btn-outline:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Success */
  .sch-success {
    text-align: center; padding: 60px 40px;
    background: #fff; border-radius: 20px; border: 1px solid #e2e8f0;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .sch-success-icon { font-size: 64px; margin-bottom: 16px; }
  .sch-success-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 12px; }
  .sch-success-sub { font-size: 16px; color: #475569; margin: 0 0 24px; line-height: 1.6; }
  .sch-success-details {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px;
    padding: 20px; display: inline-flex; flex-direction: column; gap: 12px;
    margin-bottom: 20px; text-align: left;
  }
  .sch-success-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #334155; font-weight: 500; }

  @media (max-width: 640px) {
    .sch-card { padding: 20px; }
    .sch-datetime-grid, .sch-topics-grid { grid-template-columns: 1fr; }
    .sch-stepper { padding: 14px 16px; }
    .sch-step-label { display: none; }
    .sch-type-grid { grid-template-columns: 1fr 1fr; }
    .sch-diff-row { flex-direction: column; }
  }
`;