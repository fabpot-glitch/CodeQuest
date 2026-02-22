import React, { useState, useRef, useEffect, useCallback } from 'react';

const RecordingPlayer = ({
  recording,
  onClose,
  onDownload,
  onShare,
  onAddBookmark,
  onRemoveBookmark,
  onAddNote,
  onUpdateProgress,
  bookmarks = [],
  notes = ''
}) => {
  const [isPlaying, setIsPlaying]     = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(recording?.duration || 0);
  const [volume, setVolume]           = useState(1);
  const [isMuted, setIsMuted]         = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffered, setBuffered]       = useState(0);
  const [activeTab, setActiveTab]     = useState('keyMoments');
  const [noteText, setNoteText]       = useState(notes);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [showBookmarkInput, setShowBookmarkInput] = useState(false);
  const [showRateMenu, setShowRateMenu] = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError]       = useState(false);
  const [retryCount, setRetryCount]   = useState(0);
  const [audioVisualizerBars] = useState(() =>
    Array.from({ length: 44 }, () => 15 + Math.random() * 70)
  );

  const mediaRef            = useRef(null);
  const playerContainerRef  = useRef(null);
  const progressBarRef      = useRef(null);
  const controlsTimerRef    = useRef(null);

  const isAudio = recording?.type === 'audio' || recording?.mediaType === 'audio' || recording?.format === 'mp3';
  
  // Working video URLs that definitely work with CORS
  const getMediaUrl = () => {
    if (isAudio) {
      // Working audio URLs
      switch(recording?.interviewerCompany) {
        case 'Google':
          return 'https://file-examples.com/storage/fe1c7eef05cfe64e7a1868c/2017/11/file_example_MP3_1MG.mp3';
        case 'Netflix':
          return 'https://file-examples.com/storage/fe1c7eef05cfe64e7a1868c/2017/11/file_example_MP3_2MG.mp3';
        case 'Meta':
          return 'https://file-examples.com/storage/fe1c7eef05cfe64e7a1868c/2017/11/file_example_MP3_5MG.mp3';
        case 'Amazon':
          return 'https://file-examples.com/storage/fe1c7eef05cfe64e7a1868c/2017/11/file_example_MP3_700KB.mp3';
        case 'Microsoft':
          return 'https://file-examples.com/storage/fe1c7eef05cfe64e7a1868c/2017/11/file_example_MP3_1MG.mp3';
        default:
          return 'https://file-examples.com/storage/fe1c7eef05cfe64e7a1868c/2017/11/file_example_MP3_1MG.mp3';
      }
    } else {
      // Working video URLs from various CDNs that support CORS
      const videoUrls = [
        'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
      ];
      
      // Use different videos based on company - all from Google's CDN which works
      switch(recording?.interviewerCompany) {
        case 'Google':
          return videoUrls[0]; // Big Buck Bunny
        case 'Netflix':
          return videoUrls[1]; // Elephants Dream
        case 'Meta':
          return videoUrls[2]; // For Bigger Blazes
        case 'Amazon':
          return videoUrls[3]; // For Bigger Escapes
        case 'Microsoft':
          return videoUrls[4]; // For Bigger Fun
        default:
          return videoUrls[0];
      }
    }
  };

  const mediaUrl = getMediaUrl();

  const resetControlsTimer = useCallback(() => {
    if (!isAudio) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = setTimeout(() => {
        if (isPlaying) { /* just let overlay fade naturally */ }
      }, 3000);
    }
  }, [isAudio, isPlaying]);

  // ── Media event wiring ──────────────────────────────────────────────────
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onTimeUpdate = () => {
      setCurrentTime(media.currentTime);
      if (media.duration && onUpdateProgress)
        onUpdateProgress(recording.id, Math.round((media.currentTime / media.duration) * 100));
    };
    const onLoaded = () => {
      setDuration(media.duration);
      setIsLoading(false);
      setHasError(false);
      if (recording.watchProgress > 0 && recording.watchProgress < 100)
        media.currentTime = (recording.watchProgress / 100) * media.duration;
    };
    const onEnded   = () => { setIsPlaying(false); onUpdateProgress?.(recording.id, 100); };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const onProgress = () => {
      if (media.buffered.length > 0 && media.duration)
        setBuffered((media.buffered.end(media.buffered.length - 1) / media.duration) * 100);
    };
    const onError = (e) => {
      console.error('Media error:', e);
      setIsLoading(false);
      setHasError(true);
    };

    media.addEventListener('timeupdate',    onTimeUpdate);
    media.addEventListener('loadedmetadata',onLoaded);
    media.addEventListener('ended',         onEnded);
    media.addEventListener('waiting',       onWaiting);
    media.addEventListener('canplay',       onCanPlay);
    media.addEventListener('progress',      onProgress);
    media.addEventListener('error',         onError);

    // Force load
    media.load();

    return () => {
      media.removeEventListener('timeupdate',    onTimeUpdate);
      media.removeEventListener('loadedmetadata',onLoaded);
      media.removeEventListener('ended',         onEnded);
      media.removeEventListener('waiting',       onWaiting);
      media.removeEventListener('canplay',       onCanPlay);
      media.removeEventListener('progress',      onProgress);
      media.removeEventListener('error',         onError);
    };
  }, [recording, onUpdateProgress, mediaUrl, retryCount]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (['TEXTAREA','INPUT'].includes(e.target.tagName)) return;
      if (e.key === ' ')          { e.preventDefault(); togglePlay(); }
      else if (e.key === 'ArrowRight') seekBy(10);
      else if (e.key === 'ArrowLeft')  seekBy(-10);
      else if (e.key === 'm')          toggleMute();
      else if (e.key === 'Escape')     onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const togglePlay = () => {
    const m = mediaRef.current;
    if (!m) return;
    if (isPlaying) {
      m.pause();
    } else {
      m.play().catch(err => {
        console.error('Play failed:', err);
        setHasError(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const seekBy = (s) => {
    const m = mediaRef.current;
    if (m) m.currentTime = Math.max(0, Math.min(m.currentTime + s, duration));
  };

  const toggleMute = () => {
    if (mediaRef.current) { mediaRef.current.muted = !isMuted; setIsMuted(!isMuted); }
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v); setIsMuted(v === 0);
    if (mediaRef.current) { mediaRef.current.volume = v; mediaRef.current.muted = v === 0; }
  };

  const handleProgressClick = (e) => {
    const bar = progressBarRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (mediaRef.current) mediaRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const changeRate = (rate) => {
    setPlaybackRate(rate);
    if (mediaRef.current) mediaRef.current.playbackRate = rate;
    setShowRateMenu(false);
  };

  const addBookmark = () => {
    onAddBookmark?.(recording.id, currentTime, bookmarkNote || `Bookmark at ${fmt(currentTime)}`);
    setBookmarkNote(''); setShowBookmarkInput(false);
  };

  const seekToMoment = (time) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      if (!isPlaying) { 
        mediaRef.current.play().catch(() => {
          setHasError(true);
        }); 
        setIsPlaying(true); 
      }
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
      : `${m}:${String(sec).padStart(2,'0')}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Key moments from the recording or use defaults
  const keyMoments = recording?.keyMoments || [
    { time: 30, description: 'ML basics' },
    { time: 180, description: 'Python implementation' },
    { time: 360, description: 'Statistics review' },
    { time: 540, description: 'Case studies' }
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    .rp-overlay {
      position:fixed;inset:0;z-index:9999;
      background:rgba(100,116,139,0.35);
      backdrop-filter:blur(8px);
      display:flex;align-items:center;justify-content:center;
      font-family:'Inter',sans-serif;
      animation:rpFI .18s ease;
    }
    @keyframes rpFI{from{opacity:0}to{opacity:1}}

    .rp-modal {
      width:min(980px,96vw);
      max-height:92vh;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      display:flex;
      flex-direction:column;
      box-shadow:0 20px 60px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.06);
      animation:rpSU .25s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes rpSU{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

    /* ── HEADER ── */
    .rp-hdr {
      display:flex;align-items:center;justify-content:space-between;
      padding:14px 20px;
      background:#f8fafc;
      border-bottom:1px solid #e2e8f0;
      flex-shrink:0;
    }
    .rp-hdr-l{display:flex;align-items:center;gap:12px;min-width:0}
    .rp-badge{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .rp-badge.v{background:#ede9fe}.rp-badge.a{background:#fae8ff}
    .rp-ttl{font-size:15px;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rp-sub{font-size:12px;color:#64748b;margin-top:2px}
    .rp-hdr-r{display:flex;align-items:center;gap:8px;flex-shrink:0}
    .rp-ibtn{
      width:34px;height:34px;border-radius:8px;border:1px solid #e2e8f0;
      cursor:pointer;background:#fff;color:#475569;
      display:flex;align-items:center;justify-content:center;font-size:15px;
      transition:.15s;
    }
    .rp-ibtn:hover{background:#f1f5f9;border-color:#cbd5e1;color:#0f172a}
    .rp-xbtn{
      width:34px;height:34px;border-radius:8px;border:1px solid #fecaca;
      cursor:pointer;background:#fff5f5;color:#ef4444;
      display:flex;align-items:center;justify-content:center;font-size:18px;
      transition:.15s;
    }
    .rp-xbtn:hover{background:#fee2e2;border-color:#ef4444}

    /* ── BODY ── */
    .rp-body{display:flex;flex:1;overflow:hidden;min-height:0}

    /* ── VIDEO ── */
    .rp-vsec{flex:1;display:flex;flex-direction:column;min-width:0;background:#0f172a}
    .rp-vwrap{
      position:relative;background:#000;
      flex-shrink:0;display:flex;align-items:center;justify-content:center;
      min-height:240px;max-height:390px;cursor:pointer;overflow:hidden;
    }
    .rp-vwrap video{width:100%;max-height:390px;display:block;object-fit:contain}
    .rp-vlay{
      position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,.25);transition:opacity .25s;
    }
    .rp-vlay.hidden{opacity:0;pointer-events:none}
    .rp-bigplay{
      width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;
      background:rgba(255,255,255,.92);
      display:flex;align-items:center;justify-content:center;transition:.15s;
    }
    .rp-bigplay:hover{transform:scale(1.1);background:#fff}
    .rp-bigplay svg{width:22px;height:22px;fill:#0f172a;margin-left:3px}
    .rp-spin{
      position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,.4);z-index:5;
    }
    .rp-ring{
      width:38px;height:38px;border-radius:50%;
      border:3px solid rgba(255,255,255,.15);
      border-top-color:#a78bfa;
      animation:rpR .8s linear infinite;
    }
    @keyframes rpR{to{transform:rotate(360deg)}}

    /* Error state */
    .rp-error{
      position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      background:#0f172a;color:#94a3b8;flex-direction:column;gap:12px;
      padding:20px;text-align:center;
    }
    .rp-error svg{width:48px;height:48px;fill:#94a3b8;margin-bottom:8px;}
    .rp-error h3{font-size:18px;font-weight:500;color:#f1f5f9;margin-bottom:8px;}
    .rp-error p{font-size:14px;color:#94a3b8;max-width:300px;margin-bottom:12px;}
    .rp-retry-btn{
      padding:8px 24px;border-radius:20px;border:none;cursor:pointer;
      background:#2563eb;color:#fff;font-size:14px;font-weight:500;
      transition:.15s;margin-top:8px;
    }
    .rp-retry-btn:hover{background:#1d4ed8}

    /* ── AUDIO ── */
    .rp-asec{flex:1;display:flex;flex-direction:column;min-width:0}
    .rp-avis{
      position:relative;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      background:linear-gradient(135deg,#6d28d9 0%,#4f46e5 50%,#0ea5e9 100%);
      padding:36px 24px 28px;min-height:260px;overflow:hidden;flex-shrink:0;
    }
    .rp-glow1{
      position:absolute;width:300px;height:300px;border-radius:50%;
      background:radial-gradient(circle,rgba(255,255,255,.15) 0%,transparent 70%);
      top:-120px;left:50%;transform:translateX(-50%);
    }
    .rp-glow2{
      position:absolute;width:180px;height:180px;border-radius:50%;
      background:radial-gradient(circle,rgba(14,165,233,.3) 0%,transparent 70%);
      bottom:-50px;right:5%;
    }
    .rp-aico{
      width:80px;height:80px;border-radius:50%;
      background:rgba(255,255,255,.2);backdrop-filter:blur(8px);
      display:flex;align-items:center;justify-content:center;font-size:36px;
      margin-bottom:16px;box-shadow:0 0 0 8px rgba(255,255,255,.1);
      position:relative;z-index:2;transition:.4s;
    }
    .rp-aico.pl{animation:rpPR 2s ease-in-out infinite}
    @keyframes rpPR{
      0%,100%{box-shadow:0 0 0 8px rgba(255,255,255,.1)}
      50%{box-shadow:0 0 0 16px rgba(255,255,255,.06),0 0 40px rgba(255,255,255,.2)}
    }
    .rp-attl{font-size:16px;font-weight:700;color:#fff;text-align:center;position:relative;z-index:2}
    .rp-aart{font-size:13px;color:rgba(255,255,255,.7);margin-top:5px;text-align:center;position:relative;z-index:2}
    .rp-wf{display:flex;align-items:center;gap:3px;height:48px;margin-top:22px;position:relative;z-index:2}
    .rp-wb{width:4px;border-radius:2px;background:rgba(255,255,255,.3);transition:.3s}
    .rp-wb.pl{
      background:rgba(255,255,255,.9);
      animation:rpWV 1s ease-in-out infinite alternate;
    }
    @keyframes rpWV{0%{transform:scaleY(.4)}100%{transform:scaleY(1)}}

    /* ── CONTROLS ── */
    .rp-ctrl{
      padding:12px 16px 14px;
      background:#f8fafc;
      border-top:1px solid #e2e8f0;
      flex-shrink:0;
    }
    .rp-pb{
      position:relative;height:5px;border-radius:3px;
      background:#e2e8f0;cursor:pointer;margin-bottom:12px;transition:.15s;
    }
    .rp-pb:hover{height:7px;margin-bottom:10px}
    .rp-buf{position:absolute;top:0;left:0;height:100%;border-radius:3px;background:#cbd5e1}
    .rp-pf{
      position:absolute;top:0;left:0;height:100%;border-radius:3px;
      background:linear-gradient(to right,#7c3aed,#4f46e5);pointer-events:none;
    }
    .rp-dot{
      position:absolute;top:50%;transform:translate(-50%,-50%);
      width:13px;height:13px;border-radius:50%;
      background:#7c3aed;box-shadow:0 2px 6px rgba(124,58,237,.4);
      opacity:0;pointer-events:none;transition:opacity .15s;
    }
    .rp-pb:hover .rp-dot{opacity:1}
    .rp-crow{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .rp-cl,.rp-cr{display:flex;align-items:center;gap:4px}
    .rp-cc{display:flex;align-items:center}
    .rp-cb{
      width:34px;height:34px;border-radius:8px;border:none;cursor:pointer;
      background:transparent;color:#475569;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;transition:.15s;
    }
    .rp-cb:hover:not(:disabled){background:#e2e8f0;color:#0f172a}
    .rp-cb:disabled{opacity:.35;cursor:default}
    .rp-pb2{
      width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;
      background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;transition:.15s;
      box-shadow:0 4px 14px rgba(124,58,237,.35);
    }
    .rp-pb2:hover:not(:disabled){transform:scale(1.06)}
    .rp-pb2:disabled{opacity:.4;cursor:default;transform:none}
    .rp-tm{font-family:'JetBrains Mono',monospace;font-size:12px;color:#94a3b8;white-space:nowrap}
    .rp-tm span{color:#334155}
    .rp-vols{
      -webkit-appearance:none;width:68px;height:4px;border-radius:2px;
      background:#e2e8f0;cursor:pointer;outline:none;
    }
    .rp-vols::-webkit-slider-thumb{
      -webkit-appearance:none;width:12px;height:12px;border-radius:50%;
      background:#7c3aed;cursor:pointer;
    }
    .rp-rw{position:relative}
    .rp-rb{
      padding:4px 10px;border-radius:6px;
      border:1px solid #e2e8f0;background:#fff;
      color:#475569;font-size:12px;font-family:'JetBrains Mono',monospace;
      cursor:pointer;transition:.15s;
    }
    .rp-rb:hover{background:#f1f5f9;border-color:#cbd5e1;color:#0f172a}
    .rp-rm{
      position:absolute;bottom:calc(100% + 8px);right:0;
      background:#fff;border:1px solid #e2e8f0;border-radius:10px;
      padding:6px;display:flex;flex-direction:column;gap:2px;
      min-width:74px;box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:10;
    }
    .rp-ri{
      padding:6px 10px;border-radius:6px;border:none;cursor:pointer;
      background:transparent;color:#475569;
      font-size:13px;font-family:'JetBrains Mono',monospace;
      text-align:center;transition:.1s;
    }
    .rp-ri:hover{background:#f1f5f9;color:#0f172a}
    .rp-ri.a{background:#ede9fe;color:#7c3aed}

    /* ── SIDEBAR ── */
    .rp-sb{
      width:288px;flex-shrink:0;display:flex;flex-direction:column;
      border-left:1px solid #e2e8f0;overflow:hidden;background:#fff;
    }
    .rp-tabs{display:flex;border-bottom:1px solid #e2e8f0;flex-shrink:0;background:#f8fafc}
    .rp-tab{
      flex:1;padding:12px 4px;border:none;cursor:pointer;
      background:transparent;color:#94a3b8;font-size:17px;
      border-bottom:2px solid transparent;transition:.15s;
    }
    .rp-tab.a{border-bottom-color:#7c3aed;color:#7c3aed}
    .rp-tab:hover:not(.a){color:#475569}
    .rp-pnl{flex:1;overflow-y:auto;padding:14px}
    .rp-pnl::-webkit-scrollbar{width:4px}
    .rp-pnl::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}

    /* Key moments */
    .rp-mom{
      display:flex;align-items:flex-start;gap:9px;padding:9px 10px;
      border-radius:8px;cursor:pointer;margin-bottom:6px;
      border:1px solid #f1f5f9;transition:.15s;
    }
    .rp-mom:hover{background:#f8fafc;border-color:#c4b5fd}
    .rp-mt{
      font-family:'JetBrains Mono',monospace;font-size:11px;
      color:#7c3aed;background:#ede9fe;padding:3px 7px;border-radius:5px;
      white-space:nowrap;flex-shrink:0;
    }
    .rp-md{font-size:13px;color:#475569;line-height:1.4}

    /* Bookmarks */
    .rp-bmadd{
      display:flex;flex-direction:column;gap:8px;margin-bottom:12px;
      padding:12px;background:#f8fafc;border-radius:10px;
      border:1px dashed #c4b5fd;
    }
    .rp-bmtime{font-family:'JetBrains Mono',monospace;font-size:12px;color:#7c3aed}
    .rp-bmin-field{
      background:#fff;border:1px solid #e2e8f0;border-radius:7px;
      padding:8px 10px;color:#0f172a;font-size:13px;
      font-family:'Inter',sans-serif;outline:none;width:100%;box-sizing:border-box;
    }
    .rp-bmin-field:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.1)}
    .rp-bmin-field::placeholder{color:#94a3b8}
    .rp-bmsave{
      align-self:flex-end;padding:5px 13px;border-radius:7px;border:none;
      background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;
      font-size:12px;font-weight:600;cursor:pointer;transition:.15s;
    }
    .rp-bmsave:hover{opacity:.85}
    .rp-bmadd-btn{
      width:100%;padding:9px;border-radius:8px;
      border:1px dashed #c4b5fd;background:#faf5ff;
      color:#7c3aed;font-size:13px;cursor:pointer;margin-bottom:12px;transition:.15s;
      font-family:'Inter',sans-serif;
    }
    .rp-bmadd-btn:hover{background:#ede9fe;border-color:#7c3aed}
    .rp-bmi{
      display:flex;align-items:flex-start;gap:8px;padding:9px;
      border-radius:8px;border:1px solid #f1f5f9;margin-bottom:6px;
      cursor:pointer;transition:.15s;
    }
    .rp-bmi:hover{background:#f8fafc;border-color:#c4b5fd}
    .rp-bmit{font-family:'JetBrains Mono',monospace;font-size:11px;color:#7c3aed;flex-shrink:0}
    .rp-bmin2{font-size:12px;color:#64748b;flex:1}
    .rp-bmx{
      width:20px;height:20px;border-radius:5px;border:none;cursor:pointer;
      background:#fee2e2;color:#ef4444;font-size:14px;
      display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:.15s;
    }
    .rp-bmx:hover{background:#fecaca}

    /* Notes */
    .rp-nt{
      width:100%;min-height:140px;padding:12px;
      background:#fff;border:1px solid #e2e8f0;border-radius:10px;
      color:#0f172a;font-size:13px;line-height:1.6;
      font-family:'Inter',sans-serif;resize:vertical;outline:none;box-sizing:border-box;
    }
    .rp-nt:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.1)}
    .rp-nt::placeholder{color:#94a3b8}
    .rp-sv{
      margin-top:10px;width:100%;padding:10px;border-radius:9px;border:none;
      background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;
      font-size:13px;font-weight:600;cursor:pointer;transition:.15s;
      font-family:'Inter',sans-serif;
    }
    .rp-sv:hover{opacity:.85}

    /* Feedback */
    .rp-fbl{
      font-size:11px;font-weight:600;text-transform:uppercase;
      letter-spacing:.06em;margin-bottom:7px;margin-top:14px;
    }
    .rp-fbl.s{color:#059669}.rp-fbl.i{color:#d97706}.rp-fbl.t{color:#4f46e5}
    .rp-fbitem{
      font-size:12px;color:#475569;padding:7px 10px;
      border-radius:7px;margin-bottom:4px;line-height:1.5;
    }
    .rp-fbitem.s{background:#f0fdf4;border-left:2px solid #10b981}
    .rp-fbitem.i{background:#fffbeb;border-left:2px solid #f59e0b}
    .rp-fbitem.t{background:#eef2ff;border-left:2px solid #6366f1}

    .rp-empty{color:#94a3b8;font-size:13px;text-align:center;padding:24px 0}
    .rp-canbtn{
      padding:5px 11px;border-radius:7px;border:1px solid #e2e8f0;
      cursor:pointer;background:#fff;color:#64748b;
      font-size:12px;font-family:'Inter',sans-serif;transition:.15s;
    }
    .rp-canbtn:hover{background:#f1f5f9}
  `;

  return (
    <>
      <style>{css}</style>
      <div className="rp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="rp-modal">

          {/* ── HEADER ── */}
          <div className="rp-hdr">
            <div className="rp-hdr-l">
              <div className={`rp-badge ${isAudio ? 'a' : 'v'}`}>{isAudio ? '🎧' : '🎬'}</div>
              <div style={{minWidth:0}}>
                <div className="rp-ttl">{recording?.title || 'Untitled'}</div>
                <div className="rp-sub">{recording?.interviewer} · {recording?.interviewerCompany} · {recording?.date}</div>
              </div>
            </div>
            <div className="rp-hdr-r">
              <button className="rp-ibtn" onClick={() => onDownload?.(recording)} title="Download">💾</button>
              <button className="rp-ibtn" onClick={() => onShare?.(recording)} title="Share">↗️</button>
              <button className="rp-xbtn" onClick={onClose} title="Close (Esc)">✕</button>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="rp-body">

            {/* ════════ AUDIO ════════ */}
            {isAudio ? (
              <div className="rp-asec">
                <audio ref={mediaRef} src={mediaUrl} preload="metadata" />
                <div className="rp-avis">
                  <div className="rp-glow1" />
                  <div className="rp-glow2" />
                  <div className={`rp-aico ${isPlaying ? 'pl' : ''}`}>🎧</div>
                  <div className="rp-attl">{recording?.title}</div>
                  <div className="rp-aart">{recording?.interviewer} — {recording?.interviewerCompany}</div>
                  <div className="rp-wf">
                    {audioVisualizerBars.map((h, i) => (
                      <div key={i} className={`rp-wb ${isPlaying ? 'pl' : ''}`}
                        style={{ height:`${h}%`, animationDelay:`${(i*0.05)%1}s`, animationDuration:`${0.5+(i%7)*0.07}s` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Audio controls */}
                <div className="rp-ctrl">
                  <div ref={progressBarRef} className="rp-pb" onClick={handleProgressClick}>
                    <div className="rp-buf" style={{width:`${buffered}%`}} />
                    <div className="rp-pf"  style={{width:`${progressPct}%`}} />
                    <div className="rp-dot" style={{left:`${progressPct}%`}} />
                  </div>
                  <div className="rp-crow">
                    <div className="rp-cl">
                      <button className="rp-cb" onClick={()=>seekBy(-10)} title="−10s">⏮</button>
                      <button className="rp-pb2" onClick={togglePlay}>{isPlaying?'⏸':'▶'}</button>
                      <button className="rp-cb" onClick={()=>seekBy(10)}  title="+10s">⏭</button>
                    </div>
                    <div className="rp-cc">
                      <span className="rp-tm"><span>{fmt(currentTime)}</span> / {fmt(duration)}</span>
                    </div>
                    <div className="rp-cr">
                      <button className="rp-cb" onClick={toggleMute}>
                        {isMuted||volume===0?'🔇':volume<0.5?'🔉':'🔊'}
                      </button>
                      <input type="range" min="0" max="1" step="0.05" value={isMuted?0:volume} onChange={handleVolumeChange} className="rp-vols"/>
                      <div className="rp-rw">
                        <button className="rp-rb" onClick={()=>setShowRateMenu(!showRateMenu)}>{playbackRate}×</button>
                        {showRateMenu&&(
                          <div className="rp-rm">
                            {rates.map(r=>(
                              <button key={r} className={`rp-ri ${playbackRate===r?'a':''}`} onClick={()=>changeRate(r)}>{r}×</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            ) : (
              /* ════════ VIDEO ════════ */
              <div className="rp-vsec">
                <div
                  ref={playerContainerRef}
                  className="rp-vwrap"
                  onMouseMove={resetControlsTimer}
                  onClick={togglePlay}
                >
                  {hasError ? (
                    <div className="rp-error">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <h3>Video failed to load</h3>
                      <p>This could be due to network issues or the video URL is not accessible.</p>
                      <button className="rp-retry-btn" onClick={handleRetry}>
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        key={retryCount}
                        ref={mediaRef}
                        src={mediaUrl}
                        preload="auto"
                        playsInline
                        crossOrigin="anonymous"
                        style={{width:'100%',maxHeight:390,display:'block',objectFit:'contain'}}
                      />

                      {isLoading && (
                        <div className="rp-spin"><div className="rp-ring"/></div>
                      )}

                      <div className={`rp-vlay ${isPlaying&&!isLoading?'hidden':''}`} style={{pointerEvents:'none'}}>
                        <button className="rp-bigplay" style={{pointerEvents:'all'}} onClick={e=>{e.stopPropagation();togglePlay();}}>
                          {isPlaying
                            ? <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                            : <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          }
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Video controls */}
                <div className="rp-ctrl">
                  <div ref={progressBarRef} className="rp-pb" onClick={handleProgressClick}>
                    <div className="rp-buf" style={{width:`${buffered}%`}} />
                    <div className="rp-pf"  style={{width:`${progressPct}%`}} />
                    <div className="rp-dot" style={{left:`${progressPct}%`}} />
                  </div>
                  <div className="rp-crow">
                    <div className="rp-cl">
                      <button className="rp-cb" onClick={()=>seekBy(-10)} title="−10s">⏮</button>
                      <button className="rp-pb2" onClick={togglePlay}>{isPlaying?'⏸':'▶'}</button>
                      <button className="rp-cb" onClick={()=>seekBy(10)}  title="+10s">⏭</button>
                    </div>
                    <div className="rp-cc">
                      <span className="rp-tm"><span>{fmt(currentTime)}</span> / {fmt(duration)}</span>
                    </div>
                    <div className="rp-cr">
                      <button className="rp-cb" onClick={toggleMute}>
                        {isMuted||volume===0?'🔇':volume<0.5?'🔉':'🔊'}
                      </button>
                      <input type="range" min="0" max="1" step="0.05" value={isMuted?0:volume} onChange={handleVolumeChange} className="rp-vols"/>
                      <div className="rp-rw">
                        <button className="rp-rb" onClick={()=>setShowRateMenu(!showRateMenu)}>{playbackRate}×</button>
                        {showRateMenu&&(
                          <div className="rp-rm">
                            {rates.map(r=>(
                              <button key={r} className={`rp-ri ${playbackRate===r?'a':''}`} onClick={()=>changeRate(r)}>{r}×</button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="rp-cb" onClick={toggleFullscreen} title="Fullscreen">⛶</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════ SIDEBAR ════════ */}
            <div className="rp-sb">
              <div className="rp-tabs">
                {[['keyMoments','⚡'],['bookmarks','🔖'],['notes','📝'],['feedback','💬']].map(([id,icon])=>(
                  <button key={id} className={`rp-tab ${activeTab===id?'a':''}`} onClick={()=>setActiveTab(id)} title={id}>{icon}</button>
                ))}
              </div>

              <div className="rp-pnl">

                {/* KEY MOMENTS */}
                {activeTab==='keyMoments'&&(
                  keyMoments.length>0
                    ? keyMoments.map((m,i)=>(
                        <div key={i} className="rp-mom" onClick={()=>seekToMoment(m.time)}>
                          <span className="rp-mt">{fmt(m.time)}</span>
                          <span className="rp-md">{m.description}</span>
                        </div>
                      ))
                    : <div className="rp-empty">No key moments available</div>
                )}

                {/* BOOKMARKS */}
                {activeTab==='bookmarks'&&(
                  <>
                    {showBookmarkInput?(
                      <div className="rp-bmadd">
                        <div className="rp-bmtime">📍 At {fmt(currentTime)}</div>
                        <input className="rp-bmin-field" placeholder="Bookmark note…"
                          value={bookmarkNote} onChange={e=>setBookmarkNote(e.target.value)}
                          onKeyDown={e=>e.key==='Enter'&&addBookmark()} />
                        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
                          <button className="rp-canbtn" onClick={()=>setShowBookmarkInput(false)}>Cancel</button>
                          <button className="rp-bmsave" onClick={addBookmark}>Save</button>
                        </div>
                      </div>
                    ):(
                      <button className="rp-bmadd-btn" onClick={()=>setShowBookmarkInput(true)}>
                        + Bookmark at {fmt(currentTime)}
                      </button>
                    )}
                    {bookmarks.length>0
                      ? bookmarks.map((bm,i)=>(
                          <div key={i} className="rp-bmi" onClick={()=>seekToMoment(bm.time)}>
                            <span className="rp-bmit">{fmt(bm.time)}</span>
                            <span className="rp-bmin2">{bm.note}</span>
                            <button className="rp-bmx" onClick={e=>{e.stopPropagation();onRemoveBookmark?.(recording.id,bm.id);}}>×</button>
                          </div>
                        ))
                      : !showBookmarkInput&&<div className="rp-empty">No bookmarks yet</div>
                    }
                  </>
                )}

                {/* NOTES */}
                {activeTab==='notes'&&(
                  <>
                    <textarea className="rp-nt" placeholder="Take notes while watching…"
                      value={noteText} onChange={e=>setNoteText(e.target.value)} />
                    <button className="rp-sv" onClick={()=>onAddNote?.(recording.id,noteText)}>Save Notes</button>
                  </>
                )}

                {/* FEEDBACK */}
                {activeTab==='feedback'&&(
                  recording?.feedback?(
                    <>
                      {recording.feedback.strengths?.length>0&&(
                        <><div className="rp-fbl s">✅ Strengths</div>
                        {recording.feedback.strengths.map((s,i)=><div key={i} className="rp-fbitem s">{s}</div>)}</>
                      )}
                      {recording.feedback.improvements?.length>0&&(
                        <><div className="rp-fbl i">⚠️ Improvements</div>
                        {recording.feedback.improvements.map((s,i)=><div key={i} className="rp-fbitem i">{s}</div>)}</>
                      )}
                      {recording.feedback.tips?.length>0&&(
                        <><div className="rp-fbl t">💡 Tips</div>
                        {recording.feedback.tips.map((s,i)=><div key={i} className="rp-fbitem t">{s}</div>)}</>
                      )}
                    </>
                  ):<div className="rp-empty">No feedback available</div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordingPlayer;