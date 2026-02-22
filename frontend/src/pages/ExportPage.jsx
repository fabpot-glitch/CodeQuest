// pages/ExportPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExportPage.css';

// ── Icons ──────────────────────────────────────────────────────
const BackIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);
const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const TemplateIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
const DownloadIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const PDFIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const DocIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const ShareIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);

// ── Mini resume thumbnail ──────────────────────────────────────
const MiniResume = () => (
  <div className="ep-mini">
    <div className="ep-mini-bar accent" />
    <div className="ep-mini-bar t" />
    <div className="ep-mini-bar s" />
    <div className="ep-mini-div" />
    <div className="ep-mini-bar l" />
    <div className="ep-mini-bar m" />
    <div className="ep-mini-bar sh" />
  </div>
);

// ── Data ──────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'modern',       cls: 't-modern',       name: 'Modern',       tag: 'Clean & Bold'       },
  { id: 'professional', cls: 't-professional', name: 'Professional', tag: 'Classic & Polished' },
  { id: 'executive',    cls: 't-executive',    name: 'Executive',    tag: 'Luxe & Formal'      },
  { id: 'minimal',      cls: 't-minimal',      name: 'Minimal',      tag: 'Pure & Simple'      },
];

const DOWNLOADS = [
  { id: 'pdf',   cls: 'pdf',   label: 'PDF Document',  meta: 'Print-ready · Vector text', badge: '.PDF',  icon: <PDFIcon />   },
  { id: 'docx',  cls: 'doc',   label: 'Word Document', meta: 'Editable · .docx format',   badge: '.DOCX', icon: <DocIcon />   },
  { id: 'share', cls: 'share', label: 'Copy Link',     meta: 'Share anywhere instantly',   badge: 'URL',   icon: <ShareIcon /> },
];

// ── Component ─────────────────────────────────────────────────
export default function ExportPage() {
  const navigate = useNavigate();
  const [selected, setSelected]   = useState('modern');
  const [exporting, setExporting] = useState(null);
  const [toast, setToast]         = useState({ show: false, msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleDownload = async (id) => {
    if (exporting) return;

    if (id === 'share') {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      showToast('Link copied to clipboard', 'success');
      return;
    }

    setExporting(id);
    await new Promise(r => setTimeout(r, 1800));
    setExporting(null);
    showToast(
      `${id.toUpperCase()} downloaded · ${TEMPLATES.find(t => t.id === selected)?.name} template`,
      'success'
    );
  };

  const selectedName = TEMPLATES.find(t => t.id === selected)?.name ?? '';

  return (
    <div className="export-page">

      {/* ── Topbar ── */}
      <div className="export-topbar">
        <button className="export-back" onClick={() => navigate(-1)}>
          <BackIcon /> Back
        </button>
        <div className="export-topbar-sep" />
        <span className="export-topbar-title">Export Résumé</span>
        <div className="export-topbar-space" />
        <span className="export-topbar-status">Ready</span>
      </div>

      {/* ── Body ── */}
      <div className="export-body">

        {/* Card 1 — Template */}
        <div className="export-card">
          <div className="export-card-header">
            <div className="export-card-icon purple"><TemplateIcon /></div>
            <div>
              <div className="export-card-title">Choose Template</div>
              <div className="export-card-desc">Select a layout for your résumé</div>
            </div>
          </div>

          <div className="export-template-grid">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                className={`export-tcard ${t.cls} ${selected === t.id ? 'active' : ''}`}
                onClick={() => setSelected(t.id)}
              >
                <div className="export-tcard-thumb">
                  <MiniResume />
                  {selected === t.id && (
                    <div className="export-tcard-check"><CheckIcon /></div>
                  )}
                </div>
                <div className="export-tcard-label">
                  <div className="export-tcard-name">{t.name}</div>
                  <div className="export-tcard-tag">{t.tag}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card 2 — Download */}
        <div className="export-card">
          <div className="export-card-header">
            <div className="export-card-icon slate"><DownloadIcon /></div>
            <div>
              <div className="export-card-title">Download</div>
              <div className="export-card-desc">
                Export as <strong style={{ color: '#6366f1' }}>{selectedName}</strong>
              </div>
            </div>
          </div>

          <div className="export-dl-list">
            {DOWNLOADS.map(d => (
              <button
                key={d.id}
                className={`export-dl-row ${d.cls}`}
                onClick={() => handleDownload(d.id)}
                disabled={!!exporting}
              >
                <div className="export-dl-icon">{d.icon}</div>
                <div className="export-dl-text">
                  <div className="export-dl-title">{d.label}</div>
                  <div className="export-dl-meta">{d.meta}</div>
                </div>
                {exporting === d.id
                  ? <div className="export-dl-spinner" />
                  : <span className="export-dl-badge">{d.badge}</span>
                }
              </button>
            ))}
          </div>
        </div>

      </div>

      <p className="export-note">Your data stays private · Generated in your browser</p>

      {/* Toast */}
      <div className={`export-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        <div className="export-toast-dot" />
        {toast.msg}
      </div>

    </div>
  );
}