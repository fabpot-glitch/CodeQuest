import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Code2, Target, Zap, Clock,
  Award, Activity, Flame, CheckCircle2, AlertCircle,
  BookOpen, Trophy, Star, User, Home,
  GitBranch, Terminal, Sparkles,
  RefreshCw, TrendingDown, FileText, Briefcase,
  GraduationCap, BarChart3, LineChart,
  Brain, Cpu, LogOut, Sun, Moon,
  ChevronDown, Download,
  HelpCircle, Search, Trash2, MoreVertical,
  Play, Pause, Maximize2, Minimize2,
  Info, Globe,
  GitCompare, Settings,
  CheckCheck, BrainCircuit,
  Eye, FilterIcon, SortAsc, Timer
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   CRYSTAL SKY  —  cohesive light-blue design system
   ═══════════════════════════════════════════════════════════════════ */

const L = {
  page:      'bg-gradient-to-br from-sky-50 via-white to-cyan-50/50',
  glass:     'bg-white/90 backdrop-blur-xl',
  glassAlt:  'bg-sky-50/70 backdrop-blur-md',
  border:    'border-sky-100',
  borderMd:  'border-sky-200',
  text:      'text-slate-800',
  textSec:   'text-slate-500',
  textMut:   'text-slate-400',
  input:     'bg-white border-sky-200 text-slate-700 placeholder:text-slate-400 focus:ring-sky-400 focus:border-sky-400',
  hover:     'hover:bg-sky-50',
  rowHov:    'hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50/40',
  tag:       'bg-sky-100 text-sky-700',
  divider:   'divide-sky-50',
  shadow:    'shadow-sky-100/80',
};

const D = {
  page:      'bg-[#060E1E]',
  glass:     'bg-[#0D1929]/95 backdrop-blur-xl',
  glassAlt:  'bg-[#142235]',
  border:    'border-[#1A2D48]',
  borderMd:  'border-[#203656]',
  text:      'text-slate-100',
  textSec:   'text-slate-400',
  textMut:   'text-slate-500',
  input:     'bg-[#0D1929] border-[#1A2D48] text-slate-100 placeholder:text-slate-500 focus:ring-sky-500 focus:border-sky-500',
  hover:     'hover:bg-sky-500/10',
  rowHov:    'hover:bg-sky-500/8',
  tag:       'bg-sky-500/15 text-sky-300',
  divider:   'divide-[#1A2D48]',
  shadow:    'shadow-black/30',
};

/* ── Particle Canvas Component ── */
const ParticleCanvas = ({ darkMode }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 55;
    for (let i = 0; i < COUNT; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = darkMode ? '56,189,248' : '14,165,233';

      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i], p2 = particles.current[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${color},${(1 - dist / 120) * (darkMode ? 0.12 : 0.08)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      particles.current.forEach(p => {
        p.pulse += p.pulseSpeed;
        const pulse = Math.sin(p.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.opacity * pulse})`;
        ctx.fill();

        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [darkMode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: darkMode ? 0.9 : 0.65 }} />;
};

/* ── Ripple Hook ── */
const useRipple = () => {
  const [ripples, setRipples] = useState([]);
  const trigger = useCallback((e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const r = { id: Date.now() + id, x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples(prev => [...prev, r]);
    setTimeout(() => setRipples(prev => prev.filter(rp => rp.id !== r.id)), 700);
  }, []);
  return [ripples, trigger];
};

/* ── Typewriter Hook ── */
const useTypewriter = (phrases, speed = 60, pause = 2400) => {
  const [text, setText] = useState('');
  const [idx, setIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const phrase = phrases[idx % phrases.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < phrase.length) setText(phrase.slice(0, text.length + 1));
        else setTimeout(() => setDeleting(true), pause);
      } else {
        if (text.length > 0) setText(text.slice(0, -1));
        else { setDeleting(false); setIdx(i => i + 1); }
      }
    }, deleting ? speed / 2.5 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, phrases, speed, pause]);
  return text;
};

/* ── Tilt Card Hook ── */
const useTilt = () => {
  const ref = useRef(null);
  const handleMove = useCallback(e => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
    ref.current.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
  }, []);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)';
  }, []);
  return [ref, handleMove, handleLeave];
};

/* ── Animated Number ── */
const AnimNum = ({ value, duration = 1400 }) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current, end = typeof value === 'number' ? value : 0;
    prev.current = end;
    let startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(start + (end - start) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return display;
};

const Dashboard = () => {
  const [user, setUser]         = useState(null);
  const [streak, setStreak]     = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted]   = useState(false);

  const [animatedStats, setAnimatedStats] = useState({
    totalSolved:0, totalPoints:0, rank:0,
    currentStreak:0, weeklyProgress:0, accuracy:0
  });

  const [hoveredDay, setHoveredDay]     = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activityFilter, setActivityFilter]       = useState('all');
  const [searchQuery, setSearchQuery]             = useState('');
  const [mobileMenuOpen, setMobileMenuOpen]       = useState(false);
  const [screenWidth, setScreenWidth]             = useState(window.innerWidth);
  const [isFullscreen, setIsFullscreen]           = useState(false);
  const [autoRefresh, setAutoRefresh]             = useState(true);
  const [lastRefreshTime, setLastRefreshTime]     = useState(new Date());
  const [refreshCountdown, setRefreshCountdown]   = useState(3600);

  const [showSkillDetails, setShowSkillDetails]           = useState(null);
  const [showSkillMasteryModal, setShowSkillMasteryModal] = useState(null);
  const [showSkillComparison, setShowSkillComparison]     = useState(false);
  const [skillSortBy, setSkillSortBy]                     = useState('importance');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all');
  const [selectedSkillsForComparison, setSelectedSkillsForComparison] = useState([]);
  const [showUserMenu, setShowUserMenu]   = useState(false);
  const [showSearch, setShowSearch]       = useState(false);

  const [showNotifications, setShowNotifications]   = useState(false);
  const [notificationCount, setNotificationCount]   = useState(3);
  const [xpBarValue, setXpBarValue]                 = useState(0);
  const [showXPToast, setShowXPToast]               = useState(false);
  const [xpToastAmount, setXpToastAmount]           = useState(0);
  const [activeTab, setActiveTab]                   = useState('overview');
  const [showQuickPractice, setShowQuickPractice]   = useState(false);
  const [showHelp, setShowHelp]                     = useState(false);
  const [helpSearch, setHelpSearch]                 = useState('');
  const [helpTab, setHelpTab]                       = useState('faq');
  const [helpTicket, setHelpTicket]                 = useState({ subject:'', message:'', email:'' });
  const [helpTicketSent, setHelpTicketSent]         = useState(false);
  const [expandedFaq, setExpandedFaq]               = useState(null);
  const [heatmapData]                               = useState(() =>
    Array.from({ length: 52 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => ({
        val: Math.random() > 0.35 ? Math.floor(Math.random() * 9) : 0,
        date: new Date(Date.now() - ((51-w)*7 + (6-d)) * 86400000)
      }))
    )
  );
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [morphStage, setMorphStage] = useState(0);
  const [cardRipples, triggerRipple] = useRipple();
  const heroText = useTypewriter(['Keep shipping! 🚀', 'You\'re on fire! 🔥', 'Crushing it! 💪', 'Stay consistent! ⚡'], 65, 2200);

  const navigate = useNavigate();
  const T = darkMode ? D : L;

  useEffect(() => {
    const move = e => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setMorphStage(s => (s + 1) % 4), 3500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setXpBarValue(72), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(()=>{ setTimeout(()=>setMounted(true),120); },[]);

  useEffect(()=>{
    const h=()=>setScreenWidth(window.innerWidth);
    window.addEventListener('resize',h);
    return()=>window.removeEventListener('resize',h);
  },[]);

  useEffect(()=>{
    if(!autoRefresh) return;
    const iv=setInterval(()=>{ refreshStats(); setLastRefreshTime(new Date()); setRefreshCountdown(3600); },3600000);
    return()=>clearInterval(iv);
  },[autoRefresh]);

  useEffect(()=>{
    if(!autoRefresh) return;
    const iv=setInterval(()=>setRefreshCountdown(p=>p<=1?3600:p-1),1000);
    return()=>clearInterval(iv);
  },[autoRefresh]);

  useEffect(()=>{
    const loadUser = () => {
      const raw = localStorage.getItem('user');
      if(raw){
        try { setUser(JSON.parse(raw)); }
        catch(e){ localStorage.removeItem('user'); navigate('/login'); }
      } else {
        const u = localStorage.getItem('currentUser') || localStorage.getItem('loggedInUser');
        if(u){ try{ setUser(JSON.parse(u)); }catch(e){} }
      }
      setTimeout(()=>setIsLoading(false), 900);
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  },[]);

  const stats = {
    totalSolved:    user?.solved   || user?.totalSolved   || 142,
    totalPoints:    user?.points   || user?.totalPoints   || 8420,
    currentStreak:  streak,
    rank:           user?.rank     || user?.globalRank    || 247,
    weeklyProgress: user?.weeklyProgress || 12,
    accuracy:       user?.accuracy || 87,
    thisWeekSolved: user?.thisWeekSolved || 11,
  };

  useEffect(()=>{
    const steps=60, dur=1500;
    let cur=0;
    const iv=setInterval(()=>{
      cur++;
      const p=cur/steps;
      setAnimatedStats({
        totalSolved:Math.floor(stats.totalSolved*p),
        totalPoints:Math.floor(stats.totalPoints*p),
        rank:Math.floor(stats.rank+(1-p)*100),
        currentStreak:Math.floor(stats.currentStreak*p),
        weeklyProgress:Math.floor(stats.weeklyProgress*p),
        accuracy:Math.floor(stats.accuracy*p)
      });
      if(cur>=steps){ clearInterval(iv); setAnimatedStats({ totalSolved:stats.totalSolved, totalPoints:stats.totalPoints, rank:stats.rank, currentStreak:stats.currentStreak, weeklyProgress:stats.weeklyProgress, accuracy:stats.accuracy }); }
    }, dur/steps);
    return()=>clearInterval(iv);
  },[]);

  const handleLogout=()=>{ localStorage.removeItem('user'); localStorage.removeItem('token'); navigate('/login'); };
  const refreshStats=useCallback(()=>{
    setIsLoading(true);
    setTimeout(()=>{
      setStreak(p=>p+Math.floor(Math.random()*2));
      setLastRefreshTime(new Date());
      setRefreshCountdown(3600);
      setIsLoading(false);
      const xp = Math.floor(Math.random()*50)+20;
      setXpToastAmount(xp);
      setShowXPToast(true);
      setTimeout(()=>setShowXPToast(false), 2800);
    },800);
  },[]);

  const formatTime=()=>{ const h=Math.floor(refreshCountdown/3600),m=Math.floor((refreshCountdown%3600)/60),s=refreshCountdown%60; return h>0?`${h}h ${m}m`:`${m}m ${s}s`; };
  const toggleFullscreen=()=>{ if(!document.fullscreenElement){ document.documentElement.requestFullscreen(); setIsFullscreen(true); } else { document.exitFullscreen(); setIsFullscreen(false); } };
  const exportData=()=>{ const blob=new Blob([JSON.stringify({user,stats},null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`codemaster-${new Date().toISOString().split('T')[0]}.json`; a.click(); };
  const toggleSkillComparison=(skill)=>setSelectedSkillsForComparison(prev=>{ const ex=prev.find(s=>s.name===skill.name); if(ex) return prev.filter(s=>s.name!==skill.name); if(prev.length<3) return[...prev,skill]; return prev; });

  const morphPaths = [
    '50% 50% 50% 50% / 50% 50% 50% 50%',
    '60% 40% 55% 45% / 45% 55% 40% 60%',
    '45% 55% 60% 40% / 55% 45% 65% 35%',
    '55% 45% 40% 60% / 40% 60% 55% 45%',
  ];

  // ── Data ─────────────────────────────────────────────────────────
  const weeklyData=[
    {day:'Mon',problems:5,points:250,pct:33,change:'+20%',up:true},
    {day:'Tue',problems:8,points:420,pct:53,change:'+60%',up:true},
    {day:'Wed',problems:6,points:310,pct:40,change:'-25%',up:false},
    {day:'Thu',problems:12,points:680,pct:80,change:'+100%',up:true},
    {day:'Fri',problems:9,points:480,pct:60,change:'-25%',up:false},
    {day:'Sat',problems:15,points:820,pct:100,change:'+67%',up:true},
    {day:'Sun',problems:11,points:590,pct:73,change:'-27%',up:false},
  ];

  const monthlyProgress=[
    {month:'Jan',solved:45,pct:53,growth:0},
    {month:'Feb',solved:52,pct:61,growth:15.6},
    {month:'Mar',solved:48,pct:56,growth:-7.7},
    {month:'Apr',solved:65,pct:76,growth:35.4},
    {month:'May',solved:71,pct:84,growth:9.2},
    {month:'Jun',solved:85,pct:100,growth:19.7},
  ];

  const notifications = [
    { id:1, icon:'🏆', title:'New Achievement!', desc:'Solved 100+ problems milestone', time:'2 min ago', unread:true, color:'amber' },
    { id:2, icon:'🔥', title:'Streak Warning', desc:'Complete 1 problem to maintain your streak', time:'1 hr ago', unread:true, color:'rose' },
    { id:3, icon:'⚡', title:'New Contest', desc:'Weekly Challenge starting in 2 hours', time:'3 hr ago', unread:true, color:'sky' },
    { id:4, icon:'📈', title:'Rank Update', desc:'You moved up 12 positions!', time:'1 day ago', unread:false, color:'emerald' },
  ];

  const skillDistribution=[
    { name:'Arrays & Hashing', value:35, grad:'from-sky-500 to-cyan-400', dot:'bg-sky-500',
      problems:28, avgTime:'12 min', accuracy:92, category:'Data Structures', importance:'High',
      categoryType:'data-structures', masteryLevel:'Advanced', realWorldUse:95, interviewFrequency:98,
      companies:['Google','Amazon','Facebook','Microsoft','Apple'], salaryImpact:'+15%', difficulty:'Easy',
      learningPath:[{step:'Basic Array Operations',completed:true},{step:'Hash Table Fundamentals',completed:true},{step:'Advanced Patterns',completed:true},{step:'Optimization Techniques',completed:false}] },
    { name:'Dynamic Programming', value:25, grad:'from-violet-500 to-purple-400', dot:'bg-violet-500',
      problems:18, avgTime:'25 min', accuracy:78, category:'Algorithms', importance:'Critical',
      categoryType:'algorithms', masteryLevel:'Intermediate', realWorldUse:85, interviewFrequency:95,
      companies:['Google','Amazon','Facebook','Netflix','Uber'], salaryImpact:'+25%', difficulty:'Hard',
      learningPath:[{step:'Understand Recursion',completed:true},{step:'Learn Memoization',completed:true},{step:'Master DP Patterns',completed:false},{step:'Solve Complex Problems',completed:false}] },
    { name:'Trees & Graphs', value:20, grad:'from-emerald-500 to-teal-400', dot:'bg-emerald-500',
      problems:22, avgTime:'18 min', accuracy:85, category:'Data Structures', importance:'High',
      categoryType:'data-structures', masteryLevel:'Intermediate', realWorldUse:90, interviewFrequency:92,
      companies:['Facebook','LinkedIn','Google','Amazon','Twitter'], salaryImpact:'+20%', difficulty:'Medium',
      learningPath:[{step:'Tree Basics',completed:true},{step:'Traversal Algorithms',completed:true},{step:'Graph Fundamentals',completed:false},{step:'Advanced Algorithms',completed:false}] },
    { name:'Sliding Window', value:15, grad:'from-amber-500 to-orange-400', dot:'bg-amber-500',
      problems:15, avgTime:'30 min', accuracy:72, category:'Patterns', importance:'Medium',
      categoryType:'patterns', masteryLevel:'Beginner', realWorldUse:80, interviewFrequency:88,
      companies:['Amazon','Microsoft','Google','Bloomberg'], salaryImpact:'+10%', difficulty:'Medium',
      learningPath:[{step:'Fixed Size Windows',completed:true},{step:'Variable Size Windows',completed:false},{step:'Optimization Techniques',completed:false},{step:'Complex Problems',completed:false}] },
    { name:'Two Pointers', value:5, grad:'from-rose-500 to-pink-400', dot:'bg-rose-500',
      problems:8, avgTime:'15 min', accuracy:88, category:'Patterns', importance:'Medium',
      categoryType:'patterns', masteryLevel:'Advanced', realWorldUse:75, interviewFrequency:82,
      companies:['Google','Facebook','Amazon','Apple'], salaryImpact:'+8%', difficulty:'Easy',
      learningPath:[{step:'Basic Two Pointers',completed:true},{step:'Fast & Slow Pointers',completed:true},{step:'Complex Combinations',completed:true},{step:'Optimization Patterns',completed:false}] },
  ];

  const recentActivity=[
    {id:1,problem:'Two Sum',difficulty:'Easy',status:'solved',points:50,time:'2 hours ago',duration:'8 min',language:'Python',category:'Arrays & Hashing'},
    {id:2,problem:'Binary Search',difficulty:'Medium',status:'solved',points:100,time:'5 hours ago',duration:'15 min',language:'JavaScript',category:'Binary Search'},
    {id:3,problem:'Merge Intervals',difficulty:'Hard',status:'attempted',points:0,time:'1 day ago',duration:'45 min',language:'Python',category:'Arrays & Hashing'},
    {id:4,problem:'Longest Substring',difficulty:'Medium',status:'solved',points:100,time:'2 days ago',duration:'20 min',language:'Java',category:'Sliding Window'},
    {id:5,problem:'LRU Cache',difficulty:'Hard',status:'solved',points:150,time:'3 days ago',duration:'30 min',language:'Python',category:'Design'},
  ];

  const skillProgress=[
    { name:'Arrays & Hashing', progress:85, problems:34, grad:'from-sky-400 to-cyan-500', trend:'+5%', target:40,
      weeklyGrowth:3, projectedCompletion:'1 week', strengthAreas:['Hash Maps','Frequency Counting','Array Manipulation'],
      weaknessAreas:['Collision Handling','Space Optimization'], timeInvested:'15 hours', avgSessionTime:'45 min',
      milestones:[{name:'First 10 Problems',completed:true,date:'2 weeks ago',progress:100},{name:'Mastered Basic Patterns',completed:true,date:'1 week ago',progress:100},{name:'Solved 30 Problems',completed:false,date:null,progress:90},{name:'Complete All Easy Problems',completed:false,date:null,progress:40},{name:'Achieve 90% Accuracy',completed:false,date:null,progress:85}] },
    { name:'Dynamic Programming', progress:60, problems:18, grad:'from-violet-400 to-purple-500', trend:'+12%', target:30,
      weeklyGrowth:2, projectedCompletion:'3 weeks', strengthAreas:['Memoization','Basic Patterns'],
      weaknessAreas:['Tabulation','State Optimization','2D DP'], timeInvested:'20 hours', avgSessionTime:'60 min',
      milestones:[{name:'Understand Recursion',completed:true,date:'3 weeks ago',progress:100},{name:'Solve 5 DP Problems',completed:true,date:'2 weeks ago',progress:100},{name:'Master Memoization',completed:false,date:null,progress:80},{name:'Complete 20 Problems',completed:false,date:null,progress:60},{name:'Solve Hard DP Problems',completed:false,date:null,progress:30}] },
    { name:'Trees & Graphs', progress:72, problems:28, grad:'from-emerald-400 to-teal-500', trend:'+8%', target:35,
      weeklyGrowth:4, projectedCompletion:'2 weeks', strengthAreas:['Tree Traversal','Basic BFS/DFS'],
      weaknessAreas:['Graph Algorithms','Complex Structures'], timeInvested:'25 hours', avgSessionTime:'50 min',
      milestones:[{name:'Master Tree Traversal',completed:true,date:'2 weeks ago',progress:100},{name:'Solve 15 Tree Problems',completed:true,date:'1 week ago',progress:100},{name:'Understand Graphs',completed:false,date:null,progress:70},{name:'Complete 30 Problems',completed:false,date:null,progress:72},{name:'Master Graph Algorithms',completed:false,date:null,progress:40}] },
    { name:'Sliding Window', progress:45, problems:12, grad:'from-amber-400 to-orange-500', trend:'+15%', target:20,
      weeklyGrowth:5, projectedCompletion:'2 weeks', strengthAreas:['Fixed Windows'],
      weaknessAreas:['Variable Windows','Optimization'], timeInvested:'8 hours', avgSessionTime:'35 min',
      milestones:[{name:'Understand Basic Pattern',completed:true,date:'1 week ago',progress:100},{name:'Solve 5 Easy Problems',completed:true,date:'3 days ago',progress:100},{name:'Master Fixed Windows',completed:false,date:null,progress:80},{name:'Learn Variable Windows',completed:false,date:null,progress:30},{name:'Complete 20 Problems',completed:false,date:null,progress:45}] },
    { name:'Two Pointers', progress:65, problems:15, grad:'from-rose-400 to-pink-500', trend:'+3%', target:20,
      weeklyGrowth:2, projectedCompletion:'3 weeks', strengthAreas:['Basic Pointers','Array Problems'],
      weaknessAreas:['Linked List Problems','Complex Patterns'], timeInvested:'12 hours', avgSessionTime:'40 min',
      milestones:[{name:'Learn Basic Pattern',completed:true,date:'2 weeks ago',progress:100},{name:'Solve 10 Problems',completed:true,date:'1 week ago',progress:100},{name:'Master Array Pointers',completed:false,date:null,progress:90},{name:'Learn Linked List Pointers',completed:false,date:null,progress:40},{name:'Complete Pattern Mastery',completed:false,date:null,progress:65}] },
  ];

  const filteredSkills = skillDistribution
    .filter(s=>{
      const ms=s.name.toLowerCase().includes(searchQuery.toLowerCase())||s.category.toLowerCase().includes(searchQuery.toLowerCase());
      const mc=selectedSkillCategory==='all'||s.categoryType===selectedSkillCategory;
      return ms&&mc;
    })
    .sort((a,b)=>{
      if(skillSortBy==='importance'){ const o={Critical:3,High:2,Medium:1}; return o[b.importance]-o[a.importance]; }
      if(skillSortBy==='problems')   return b.problems-a.problems;
      if(skillSortBy==='accuracy')   return b.accuracy-a.accuracy;
      return 0;
    });

  const filteredActivity = activityFilter==='all' ? recentActivity : recentActivity.filter(a=>a.status===activityFilter);

  const diffBadge=(d)=>{
    if(d==='Easy')   return darkMode?'text-emerald-400 bg-emerald-400/12 border-emerald-500/30':'text-emerald-700 bg-emerald-50 border-emerald-200';
    if(d==='Medium') return darkMode?'text-amber-400 bg-amber-400/12 border-amber-500/30':'text-amber-700 bg-amber-50 border-amber-200';
    return darkMode?'text-red-400 bg-red-400/12 border-red-500/30':'text-red-700 bg-red-50 border-red-200';
  };

  const isDesktop = screenWidth>=1024;

  // ── Complete navigation pages list (used for Enter-key nav & dropdown) ──
  const allNavPages = [
    {label:'Dashboard',       path:'/dashboard',              icon:'🏠', desc:'Your main overview'},
    {label:'Problems',        path:'/dashboard/problems',     icon:'💻', desc:'Practice coding problems'},
    {label:'Courses',         path:'/dashboard/courses',      icon:'📚', desc:'Structured learning paths'},
    {label:'Contests',        path:'/dashboard/contests',     icon:'🎯', desc:'Live coding contests & challenges'},
    {label:'Daily Challenge', path:'/dashboard/contests',     icon:'📅', desc:'Today\'s featured challenge'},
    {label:'Leaderboard',     path:'/dashboard/leaderboard',  icon:'🏆', desc:'Global rankings'},
    {label:'Achievements',    path:'/dashboard/achievements', icon:'🎖️', desc:'Badges & milestones'},
    {label:'Profile',         path:'/dashboard/profile',      icon:'👤', desc:'Your public profile'},
    {label:'Mock Interview',  path:'/dashboard/interview',    icon:'🎙️', desc:'Simulate real FAANG interviews'},
    {label:'Submissions',     path:'/dashboard/submissions',  icon:'📋', desc:'Your submission history'},
    {label:'Settings',        path:'/dashboard/settings',     icon:'⚙️', desc:'Account & preferences'},
  ];

  if(isLoading) return(
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode?'bg-[#060E1E]':'bg-gradient-to-br from-sky-50 to-cyan-50'}`}>
      <div className="relative mb-8">
        <div className="absolute inset-0 w-28 h-28 rounded-full border border-sky-300/20 animate-[ping_2s_ease-out_infinite]"></div>
        <div className="absolute inset-2 w-24 h-24 rounded-full border border-sky-400/30 animate-[ping_2s_ease-out_0.4s_infinite]"></div>
        <div className="w-28 h-28 rounded-full border-[3px] border-sky-100 border-t-sky-500 border-r-cyan-400 animate-spin" style={{animationDuration:'1.2s'}}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="w-11 h-11 text-sky-500 animate-pulse"/>
        </div>
      </div>
      <div className="text-center space-y-2 mb-6">
        <p className="text-sky-600 font-black text-2xl tracking-tight">CodeMaster.AI</p>
        <p className={`text-sm ${darkMode?'text-sky-400':'text-sky-500'} font-medium`}>Initializing your workspace…</p>
      </div>
      <div className={`w-48 h-1 ${darkMode?'bg-[#1A2D48]':'bg-sky-100'} rounded-full overflow-hidden`}>
        <div className="h-1 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full animate-[loadBar_1s_ease-in-out_forwards]"></div>
      </div>
      <div className="flex gap-2 mt-6">
        {[0,1,2,3].map(i=>(
          <div key={i} className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{animationDelay:`${i*120}ms`}}></div>
        ))}
      </div>
    </div>
  );

  const MB   = darkMode?'bg-[#0D1929]':'bg-white';
  const MBrd = darkMode?'border-[#1A2D48]':'border-sky-100';

  return (
    <div className={`min-h-screen ${T.page} relative overflow-x-hidden transition-colors duration-500`}>

      <ParticleCanvas darkMode={darkMode} />

      {/* Aurora Layer */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="aurora-blob-1 absolute rounded-full"
          style={{width:'900px',height:'600px',top:'-200px',left:'-200px',
            background:darkMode
              ?'radial-gradient(ellipse, rgba(14,165,233,0.35) 0%, rgba(6,182,212,0.2) 35%, rgba(8,145,178,0.1) 60%, transparent 80%)'
              :'radial-gradient(ellipse, rgba(125,211,252,0.55) 0%, rgba(186,230,253,0.4) 40%, rgba(224,242,254,0.2) 70%, transparent 90%)',
            filter:'blur(75px)'}}></div>
        <div className="aurora-blob-2 absolute rounded-full"
          style={{width:'700px',height:'500px',top:'25%',right:'-150px',
            background:darkMode
              ?'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.18) 35%, rgba(6,182,212,0.1) 70%, transparent 90%)'
              :'radial-gradient(ellipse, rgba(199,210,254,0.5) 0%, rgba(221,214,254,0.3) 40%, rgba(224,242,254,0.15) 70%, transparent 90%)',
            filter:'blur(85px)'}}></div>
        <div className="aurora-blob-3 absolute rounded-full"
          style={{width:'600px',height:'450px',bottom:'-100px',left:'30%',
            background:darkMode
              ?'radial-gradient(ellipse, rgba(20,184,166,0.2) 0%, rgba(6,182,212,0.12) 40%, transparent 80%)'
              :'radial-gradient(ellipse, rgba(153,246,228,0.45) 0%, rgba(186,230,253,0.3) 50%, transparent 85%)',
            filter:'blur(70px)'}}></div>
      </div>

      {/* Custom Cursor */}
      <div className="cursor-spotlight fixed pointer-events-none z-[1000] transition-all duration-100"
        style={{ left: cursorPos.x - 200, top: cursorPos.y - 200, opacity: isHoveringCard ? 0.7 : 0.3 }}>
      </div>

      {/* XP Toast */}
      {showXPToast && (
        <div className={`xp-toast fixed top-24 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${darkMode?'bg-[#0D1929] border-amber-500/40':'bg-white border-amber-200'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30 flex-shrink-0">
            <Zap className="w-5 h-5 text-white"/>
          </div>
          <div>
            <p className={`text-sm font-black ${T.text}`}>+{xpToastAmount} XP Earned!</p>
            <p className={`text-xs ${T.textSec}`}>Stats refreshed successfully</p>
          </div>
        </div>
      )}

      {/* ── SKILL DETAILS MODAL ── */}
      {showSkillDetails&&(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={()=>setShowSkillDetails(null)}>
          <div className={`${MB} rounded-3xl shadow-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto modal-enter`} onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 p-6 rounded-t-3xl text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black mb-2">{showSkillDetails.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{showSkillDetails.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${showSkillDetails.importance==='Critical'?'bg-red-500/30 border-red-400/40':showSkillDetails.importance==='High'?'bg-amber-500/30 border-amber-400/40':'bg-sky-500/30 border-sky-400/40'}`}>{showSkillDetails.importance}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{showSkillDetails.masteryLevel}</span>
                  </div>
                </div>
                <button onClick={()=>setShowSkillDetails(null)} className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-5 pt-4 border-t border-white/20">
                {[['Problems',showSkillDetails.problems],['Accuracy',showSkillDetails.accuracy+'%'],['Avg Time',showSkillDetails.avgTime],['Difficulty',showSkillDetails.difficulty]].map(([l,v])=>(
                  <div key={l} className="text-center"><p className="text-xl font-black">{v}</p><p className="text-xs text-sky-100 mt-0.5">{l}</p></div>
                ))}
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className={`${darkMode?'bg-sky-500/8 border-sky-500/20':'bg-sky-50 border-sky-200'} border rounded-2xl p-5`}>
                <h3 className={`font-black ${T.text} mb-3 flex items-center gap-2 text-sm uppercase tracking-widest`}><Globe className="w-4 h-4 text-sky-500"/>Top Companies</h3>
                <div className="flex flex-wrap gap-2">
                  {showSkillDetails.companies.map((c,i)=>(
                    <span key={i} className={`${T.tag} px-3 py-1.5 rounded-full text-sm font-semibold`}>{c}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['Real-world Use',showSkillDetails.realWorldUse+'%','sky'],['Interview Freq',showSkillDetails.interviewFrequency+'%','cyan'],['Salary Impact',showSkillDetails.salaryImpact,'emerald']].map(([l,v,c])=>(
                  <div key={l} className={`${darkMode?`bg-${c}-500/10`:`bg-${c}-50`} rounded-2xl p-4 text-center`}>
                    <p className={`text-2xl font-black text-${c}-${darkMode?'400':'600'}`}>{v}</p>
                    <p className={`text-xs ${T.textSec} mt-1`}>{l}</p>
                  </div>
                ))}
              </div>
              <div className={`${darkMode?'bg-emerald-500/8 border-emerald-500/20':'bg-emerald-50 border-emerald-200'} border rounded-2xl p-5`}>
                <h3 className={`font-black ${T.text} mb-4 text-sm uppercase tracking-widest`}>Learning Path</h3>
                <div className="space-y-3">
                  {showSkillDetails.learningPath.map((step,i)=>(
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${step.completed?'bg-emerald-500 text-white':'bg-sky-100 text-sky-600'}`}>{step.completed?'✓':i+1}</div>
                      <span className={`text-sm ${step.completed?'line-through '+T.textMut:T.text}`}>{step.step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{setShowSkillDetails(null);navigate('/dashboard/problems',{state:{filter:showSkillDetails.name}});}}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2">
                  <Code2 className="w-4 h-4"/>Practice Now
                </button>
                <button onClick={()=>{toggleSkillComparison(showSkillDetails);setShowSkillDetails(null);}}
                  className={`px-5 py-3 ${darkMode?'bg-violet-500/20 text-violet-300':'bg-violet-50 text-violet-700'} rounded-xl font-bold transition-all`}>Compare</button>
                <button onClick={()=>setShowSkillDetails(null)}
                  className={`px-5 py-3 ${darkMode?'bg-[#1A2D48] text-slate-300':'bg-slate-100 text-slate-600'} rounded-xl font-bold transition-all`}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MASTERY MODAL ── */}
      {showSkillMasteryModal&&(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={()=>setShowSkillMasteryModal(null)}>
          <div className={`${MB} rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto modal-enter`} onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">{showSkillMasteryModal.name}</h2>
                  <p className="text-purple-100 text-sm mt-1">{showSkillMasteryModal.progress}% mastery · {showSkillMasteryModal.problems}/{showSkillMasteryModal.target} problems</p>
                </div>
                <button onClick={()=>setShowSkillMasteryModal(null)} className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className={T.textSec}>Mastery Progress</span>
                  <span className="font-black text-violet-500">{showSkillMasteryModal.progress}%</span>
                </div>
                <div className={`${darkMode?'bg-[#1A2D48]':'bg-sky-100'} rounded-full h-3 overflow-hidden`}>
                  <div className={`bg-gradient-to-r ${showSkillMasteryModal.grad} h-3 rounded-full transition-all duration-1000`} style={{width:`${showSkillMasteryModal.progress}%`}}></div>
                </div>
              </div>
              <div>
                <h3 className={`font-black ${T.text} mb-3 text-sm uppercase tracking-widest`}>Milestones</h3>
                <div className="space-y-2">
                  {showSkillMasteryModal.milestones.map((m,i)=>(
                    <div key={i} className={`flex items-center gap-3 p-3 ${darkMode?'bg-[#142235]':'bg-sky-50'} rounded-xl`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${m.completed?'bg-emerald-500 text-white':m.progress>0?'bg-sky-500 text-white':'bg-slate-200 text-slate-500'}`}>
                        {m.completed?'✓':m.progress>0?m.progress+'%':i+1}
                      </div>
                      <div className="flex-1"><p className={`text-sm font-semibold ${T.text}`}>{m.name}</p>{m.date&&<p className={`text-xs ${T.textMut}`}>{m.date}</p>}</div>
                      {m.completed&&<CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0"/>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={`${darkMode?'bg-emerald-500/10':'bg-emerald-50'} rounded-2xl p-4`}>
                  <p className="text-xs font-black text-emerald-600 mb-2 uppercase tracking-wider">Strengths</p>
                  {showSkillMasteryModal.strengthAreas.map((s,i)=><p key={i} className={`text-sm ${T.textSec}`}>• {s}</p>)}
                </div>
                <div className={`${darkMode?'bg-rose-500/10':'bg-rose-50'} rounded-2xl p-4`}>
                  <p className="text-xs font-black text-rose-500 mb-2 uppercase tracking-wider">To Improve</p>
                  {showSkillMasteryModal.weaknessAreas.map((s,i)=><p key={i} className={`text-sm ${T.textSec}`}>• {s}</p>)}
                </div>
              </div>
              <button onClick={()=>{setShowSkillMasteryModal(null);navigate('/dashboard/problems',{state:{filter:showSkillMasteryModal.name}});}}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPARE MODAL ── */}
      {showSkillComparison&&selectedSkillsForComparison.length>0&&(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={()=>setShowSkillComparison(false)}>
          <div className={`${MB} rounded-3xl shadow-2xl max-w-4xl w-full max-h-[88vh] overflow-y-auto modal-enter`} onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 text-white p-6 rounded-t-3xl flex items-center justify-between">
              <div><h2 className="text-2xl font-black">Skill Comparison</h2><p className="text-sky-100 text-sm mt-1">{selectedSkillsForComparison.length} skills selected</p></div>
              <div className="flex gap-2">
                <button onClick={()=>setSelectedSkillsForComparison([])} className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold">Clear All</button>
                <button onClick={()=>setShowSkillComparison(false)} className="p-2 bg-white/15 hover:bg-white/30 rounded-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className={`grid ${selectedSkillsForComparison.length===1?'grid-cols-1':selectedSkillsForComparison.length===2?'grid-cols-2':'grid-cols-3'} gap-4 mb-6`}>
                {selectedSkillsForComparison.map((sk,i)=>(
                  <div key={i} className={`${darkMode?'bg-[#142235] border-[#1A2D48]':'bg-sky-50 border-sky-200'} border rounded-2xl p-4`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-black text-sm ${T.text}`}>{sk.name}</h3>
                      <button onClick={()=>toggleSkillComparison(sk)} className={`p-1 ${T.hover} rounded-lg`}><Trash2 className={`w-3.5 h-3.5 ${T.textMut}`}/></button>
                    </div>
                    <div className={`h-1.5 ${darkMode?'bg-[#1A2D48]':'bg-sky-200'} rounded-full mb-3`}>
                      <div className={`bg-gradient-to-r ${sk.grad} h-1.5 rounded-full`} style={{width:`${sk.value}%`}}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[['Problems',sk.problems],['Accuracy',sk.accuracy+'%'],['Avg Time',sk.avgTime],['Interview',sk.interviewFrequency+'%']].map(([l,v])=>(
                        <div key={l} className={`${darkMode?'bg-[#0D1929]':'bg-white'} rounded-xl p-2`}>
                          <p className={T.textMut}>{l}</p><p className={`font-black ${T.text}`}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{setShowSkillComparison(false);navigate('/dashboard/problems');}}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-sky-500/25">
                  Practice Selected Skills
                </button>
                <button onClick={()=>setShowSkillComparison(false)}
                  className={`px-6 py-3 ${darkMode?'bg-[#1A2D48] text-slate-300':'bg-slate-100 text-slate-600'} rounded-xl font-bold`}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HELP MODAL ── */}
      {showHelp && (()=>{
        const faqs = [
          { q:'How is my accuracy calculated?', a:'Accuracy = (problems solved on first attempt / total attempts) × 100. Only your first submission per problem counts toward accuracy.' },
          { q:'What counts toward my streak?', a:'Solving at least 1 problem per calendar day keeps your streak alive. The streak resets at midnight in your local timezone if you miss a day.' },
          { q:'How are points awarded?', a:'Easy = 50 pts, Medium = 100 pts, Hard = 150 pts. Bonus multipliers apply for speed (under avg time) and contest wins. First-solve bonuses add 20%.' },
          { q:'How is my global rank calculated?', a:'Rank is based on total points earned. It updates every hour. Ties are broken by number of problems solved, then by account age.' },
          { q:'What is the XP system?', a:'XP is separate from points. You gain XP for daily logins, solving problems, maintaining streaks, and completing courses. XP determines your Level (1–50).' },
          { q:'How do I compare skills?', a:'Check up to 3 skills in the Skill Distribution section using the checkboxes, then click "Compare". A side-by-side breakdown will appear.' },
          { q:'Can I export my data?', a:'Yes! Click Export in the footer or in the user menu. Your stats and solved problems are saved as a JSON file you can open in any spreadsheet app.' },
          { q:'How does auto-refresh work?', a:'Auto-refresh syncs your stats every 60 minutes. You can toggle it with the Play/Pause button in the navbar. Manual refresh is always available.' },
          { q:'What languages are supported?', a:'Currently Python, JavaScript, Java, C++, Go, Rust, TypeScript, and C. More languages are added monthly. Each problem shows supported languages.' },
          { q:'How do mock interviews work?', a:'Mock Interviews simulate real FAANG-style interviews with a 45-min timer, curated problem sets, and a post-session performance report.' },
        ];
        const guides = [
          { icon:'🚀', title:'Getting Started', desc:'Set up your profile, pick a study plan, and solve your first problem in under 10 minutes.', time:'5 min read' },
          { icon:'🧠', title:'Learning Paths', desc:'Follow structured paths for FAANG prep, competitive programming, or system design mastery.', time:'8 min read' },
          { icon:'📊', title:'Reading Your Dashboard', desc:'Understand every chart, metric, and indicator shown on your personal dashboard.', time:'4 min read' },
          { icon:'🏆', title:'Contests Guide', desc:'How to register, compete, and maximize your score in weekly and biweekly contests.', time:'6 min read' },
          { icon:'⚡', title:'Speed Optimization', desc:'Tips to write faster, cleaner solutions and beat the time complexity benchmarks.', time:'10 min read' },
          { icon:'🎯', title:'Interview Prep Roadmap', desc:'A 12-week structured plan to go from beginner to FAANG-ready with daily targets.', time:'15 min read' },
        ];
        const filteredFaqs = helpSearch
          ? faqs.filter(f => f.q.toLowerCase().includes(helpSearch.toLowerCase()) || f.a.toLowerCase().includes(helpSearch.toLowerCase()))
          : faqs;
        const filteredGuides = helpSearch
          ? guides.filter(g => g.title.toLowerCase().includes(helpSearch.toLowerCase()) || g.desc.toLowerCase().includes(helpSearch.toLowerCase()))
          : guides;

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] flex items-center justify-center p-4" onClick={()=>{ setShowHelp(false); setHelpTicketSent(false); setHelpSearch(''); }}>
            <div className={`${MB} rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col modal-enter`} onClick={e=>e.stopPropagation()}>
              <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 p-6 rounded-t-3xl text-white flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Help & Support</h2>
                    <p className="text-sky-100 text-sm">Find answers, read guides, or contact our team</p>
                  </div>
                  <button onClick={()=>{ setShowHelp(false); setHelpTicketSent(false); setHelpSearch(''); }}
                    className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition-all flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"/>
                  <input type="text" placeholder="Search FAQs, guides, topics…" value={helpSearch} onChange={e=>setHelpSearch(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white/25"/>
                  {helpSearch && <button onClick={()=>setHelpSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs">✕</button>}
                </div>
                <div className="flex gap-2 mt-4">
                  {[['faq','❓ FAQ'],['guides','📚 Guides'],['contact','✉️ Contact']].map(([id,label])=>(
                    <button key={id} onClick={()=>setHelpTab(id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${helpTab===id?'bg-white text-sky-600 shadow-lg':'bg-white/20 text-white hover:bg-white/30'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {helpTab==='faq' && (
                  <div className="space-y-2">
                    {filteredFaqs.length===0 && (
                      <div className="text-center py-12">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className={`font-bold ${T.textSec}`}>No results for "<span className="text-sky-500">{helpSearch}</span>"</p>
                        <p className={`text-sm mt-1 ${T.textMut}`}>Try a different keyword or browse the guides tab</p>
                      </div>
                    )}
                    {filteredFaqs.map((faq, i)=>(
                      <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${darkMode?'border-[#1A2D48]':'border-sky-100'}`}>
                        <button onClick={()=>setExpandedFaq(expandedFaq===i?null:i)}
                          className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${expandedFaq===i?(darkMode?'bg-sky-500/10':'bg-sky-50'):(darkMode?'hover:bg-sky-500/5':'hover:bg-sky-50/60')}`}>
                          <span className={`text-sm font-black ${T.text} pr-4`}>{faq.q}</span>
                          <span className={`text-sky-500 font-black text-lg flex-shrink-0 transition-transform duration-200 ${expandedFaq===i?'rotate-45':'rotate-0'}`}>+</span>
                        </button>
                        {expandedFaq===i && (
                          <div className={`px-5 pb-4 ${darkMode?'bg-sky-500/5':'bg-sky-50/40'}`}>
                            <p className={`text-sm ${T.textSec} leading-relaxed`}>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className={`mt-4 pt-4 border-t ${darkMode?'border-[#1A2D48]':'border-sky-100'} flex items-center justify-between text-xs ${T.textMut}`}>
                      <span>Showing {filteredFaqs.length} of {faqs.length} questions</span>
                      <button onClick={()=>setHelpTab('contact')} className="text-sky-500 font-black hover:text-sky-600">Can't find it? Contact us →</button>
                    </div>
                  </div>
                )}
                {helpTab==='guides' && (
                  <div>
                    {filteredGuides.length===0 && (
                      <div className="text-center py-12">
                        <p className="text-4xl mb-3">📚</p>
                        <p className={`font-bold ${T.textSec}`}>No guides match "<span className="text-sky-500">{helpSearch}</span>"</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredGuides.map((g,i)=>(
                        <button key={i}
                          className={`text-left p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg group ${darkMode?'border-[#1A2D48] hover:border-sky-500/30 hover:bg-sky-500/5':'border-sky-100 hover:border-sky-200 hover:bg-sky-50'}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{g.icon}</span>
                            <div className="min-w-0">
                              <p className={`text-sm font-black ${T.text} group-hover:text-sky-500 transition-colors`}>{g.title}</p>
                              <p className={`text-xs ${T.textSec} mt-1 leading-relaxed`}>{g.desc}</p>
                              <span className={`inline-block mt-2 text-xs font-bold ${darkMode?'text-sky-400':'text-sky-600'} bg-sky-100/50 px-2 py-0.5 rounded-full`}>⏱ {g.time}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className={`mt-6 p-4 rounded-2xl border ${darkMode?'border-sky-500/20 bg-sky-500/8':'border-sky-200 bg-sky-50'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                          <p className={`text-sm font-black ${T.text}`}>Pro Tip: Use the Search above</p>
                          <p className={`text-xs ${T.textSec} mt-0.5`}>Type any topic (e.g. "streak", "export", "rank") to filter both FAQs and guides instantly.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {helpTab==='contact' && (
                  <div>
                    {helpTicketSent ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-400/30">
                          <CheckCircle2 className="w-10 h-10 text-white"/>
                        </div>
                        <h3 className={`text-xl font-black ${T.text} mb-2`}>Message Sent! ✅</h3>
                        <p className={`text-sm ${T.textSec} mb-6`}>We'll get back to you within 24 hours at <span className="font-bold text-sky-500">{helpTicket.email || 'your email'}</span>.</p>
                        <button onClick={()=>{ setHelpTicketSent(false); setHelpTicket({ subject:'', message:'', email:'' }); }}
                          className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-black text-sm hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg shadow-sky-400/25">
                          Send Another
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          {[
                            {icon:'💬',label:'Live Chat',desc:'Avg 2 min reply',color:'sky'},
                            {icon:'📧',label:'Email Support',desc:'24h response',color:'violet'},
                            {icon:'🐛',label:'Report Bug',desc:'Help us improve',color:'rose'},
                          ].map((item,i)=>(
                            <button key={i} className={`p-3 rounded-2xl border text-center transition-all hover:-translate-y-1 ${darkMode?`border-${item.color}-500/20 bg-${item.color}-500/8 hover:bg-${item.color}-500/15`:`border-${item.color}-200 bg-${item.color}-50 hover:bg-${item.color}-100`}`}>
                              <p className="text-2xl mb-1">{item.icon}</p>
                              <p className={`text-xs font-black text-${item.color}-${darkMode?'400':'600'}`}>{item.label}</p>
                              <p className={`text-xs ${T.textMut} mt-0.5`}>{item.desc}</p>
                            </button>
                          ))}
                        </div>
                        <div className={`border-t ${darkMode?'border-[#1A2D48]':'border-sky-100'} pt-4`}>
                          <h3 className={`font-black ${T.text} mb-3 text-sm`}>Send a Support Ticket</h3>
                          <div className="space-y-3">
                            <div>
                              <label className={`text-xs font-black uppercase tracking-wider ${T.textMut} mb-1 block`}>Your Email</label>
                              <input type="email" placeholder={user?.email || 'you@example.com'} value={helpTicket.email} onChange={e=>setHelpTicket(p=>({...p,email:e.target.value}))}
                                className={`w-full px-4 py-2.5 ${T.input} border rounded-xl text-sm focus:outline-none focus:ring-2`}/>
                            </div>
                            <div>
                              <label className={`text-xs font-black uppercase tracking-wider ${T.textMut} mb-1 block`}>Subject</label>
                              <select value={helpTicket.subject} onChange={e=>setHelpTicket(p=>({...p,subject:e.target.value}))}
                                className={`w-full px-4 py-2.5 ${T.input} border rounded-xl text-sm focus:outline-none focus:ring-2`}>
                                <option value="">Select a topic…</option>
                                <option>Account & Login Issues</option>
                                <option>Billing & Subscription</option>
                                <option>Problem / Content Error</option>
                                <option>Feature Request</option>
                                <option>Bug Report</option>
                                <option>Performance Issue</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <div>
                              <label className={`text-xs font-black uppercase tracking-wider ${T.textMut} mb-1 block`}>Message</label>
                              <textarea placeholder="Describe your issue in detail…" rows={4} value={helpTicket.message} onChange={e=>setHelpTicket(p=>({...p,message:e.target.value}))}
                                className={`w-full px-4 py-2.5 ${T.input} border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none`}/>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={()=>{ if(!helpTicket.message.trim() || !helpTicket.subject) return; setHelpTicketSent(true); }}
                                disabled={!helpTicket.message.trim() || !helpTicket.subject}
                                className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl font-black text-sm hover:from-sky-600 hover:to-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-400/20">
                                Send Message ✉️
                              </button>
                              <button onClick={()=>setHelpTab('faq')}
                                className={`px-5 py-3 ${darkMode?'bg-[#1A2D48] text-slate-300':'bg-slate-100 text-slate-600'} rounded-xl font-black text-sm transition-all`}>
                                Back
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className={`px-6 py-3.5 border-t ${darkMode?'border-[#1A2D48] bg-[#0A1520]':'border-sky-100 bg-sky-50/60'} rounded-b-3xl flex items-center justify-between flex-shrink-0`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className={`text-xs ${T.textMut}`}>Support team online · Avg response 2h</span>
                </div>
                <div className="flex gap-4 text-xs">
                  {['Privacy Policy','Terms of Use','Status Page'].map(l=>(
                    <button key={l} className={`${T.textMut} hover:text-sky-500 transition-colors font-medium`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Practice Modal */}
      {showQuickPractice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={()=>setShowQuickPractice(false)}>
          <div className={`${MB} rounded-3xl shadow-2xl max-w-lg w-full modal-enter`} onClick={e=>e.stopPropagation()}>
            <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-6 rounded-t-3xl text-white">
              <h2 className="text-xl font-black mb-1">⚡ Quick Practice</h2>
              <p className="text-sky-100 text-sm">Pick a problem to solve right now</p>
            </div>
            <div className="p-5 space-y-2">
              {recentActivity.slice(0,4).map((a,i)=>(
                <button key={i} onClick={()=>{navigate(`/dashboard/problems/${a.id}`);setShowQuickPractice(false);}}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${T.hover} ${darkMode?'border-[#1A2D48]':'border-sky-100'} hover:-translate-y-0.5 hover:shadow-lg group`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-sky-400/25 group-hover:scale-110 transition-transform`}>
                    <Code2 className="w-5 h-5 text-white"/>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-black ${T.text}`}>{a.problem}</p>
                    <p className={`text-xs ${T.textSec}`}>{a.category} · {a.duration}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg border font-bold ${diffBadge(a.difficulty)}`}>{a.difficulty}</span>
                </button>
              ))}
              <button onClick={()=>{navigate('/dashboard/problems');setShowQuickPractice(false);}}
                className="w-full mt-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg shadow-sky-400/25">
                Browse All Problems →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="plasma-blob-tr absolute blur-[100px] transition-all duration-[4000ms] ease-in-out"
          style={{
            width:'720px', height:'580px', top:'-180px', right:'-160px',
            background: darkMode
              ? 'conic-gradient(from 0deg at 50% 50%, rgba(14,165,233,0.25) 0deg, rgba(6,182,212,0.15) 90deg, rgba(99,102,241,0.1) 180deg, rgba(14,165,233,0.2) 270deg, rgba(14,165,233,0.25) 360deg)'
              : 'conic-gradient(from 0deg at 50% 50%, rgba(125,211,252,0.5) 0deg, rgba(186,230,253,0.35) 90deg, rgba(199,210,254,0.25) 180deg, rgba(125,211,252,0.45) 270deg, rgba(125,211,252,0.5) 360deg)',
            borderRadius: morphPaths[morphStage],
            filter:'blur(90px)',
          }}></div>
        <div className="plasma-blob-bl absolute blur-[80px] transition-all duration-[5500ms] ease-in-out"
          style={{
            width:'580px', height:'480px', bottom:'-120px', left:'-100px',
            background: darkMode
              ? 'conic-gradient(from 120deg at 50% 50%, rgba(20,184,166,0.2) 0deg, rgba(6,182,212,0.15) 120deg, rgba(14,165,233,0.1) 240deg, rgba(20,184,166,0.2) 360deg)'
              : 'conic-gradient(from 120deg at 50% 50%, rgba(153,246,228,0.45) 0deg, rgba(186,230,253,0.35) 120deg, rgba(224,242,254,0.2) 240deg, rgba(153,246,228,0.45) 360deg)',
            borderRadius: morphPaths[(morphStage+2)%4],
            filter:'blur(75px)',
          }}></div>
        <div className="crystal-orb absolute"
          style={{width:'320px',height:'320px',top:'35%',left:'55%',
            background: darkMode
              ?'radial-gradient(circle at 35% 35%, rgba(56,189,248,0.18) 0%, rgba(14,165,233,0.08) 50%, transparent 75%)'
              :'radial-gradient(circle at 35% 35%, rgba(186,230,253,0.6) 0%, rgba(125,211,252,0.25) 50%, transparent 75%)',
            filter:'blur(55px)',borderRadius:'60% 40% 55% 45% / 45% 55% 40% 60%'}}></div>
        <svg className="absolute inset-0 w-full h-full" style={{opacity: darkMode?0.04:0.065}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexgrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 17 L60 35 L30 52 L0 35 L0 17 Z" fill="none" stroke={darkMode?'#38bdf8':'#0284c7'} strokeWidth="0.8"/>
            </pattern>
            <radialGradient id="hexFade" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopOpacity="1"/>
              <stop offset="100%" stopOpacity="0"/>
            </radialGradient>
            <mask id="hexMask">
              <rect width="100%" height="100%" fill="url(#hexFade)"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexgrid)" mask="url(#hexMask)"/>
        </svg>
        <div className="light-ray-1 absolute pointer-events-none"
          style={{width:'3px',height:'70vh',top:'0',left:'18%',
            background:darkMode?'linear-gradient(180deg,transparent,rgba(56,189,248,0.12) 40%,rgba(6,182,212,0.08) 70%,transparent)':'linear-gradient(180deg,transparent,rgba(125,211,252,0.35) 40%,rgba(186,230,253,0.2) 70%,transparent)',
            transform:'rotate(18deg) translateY(-10%)',filter:'blur(3px)',borderRadius:'99px'}}></div>
        <div className="light-ray-2 absolute pointer-events-none"
          style={{width:'2px',height:'50vh',top:'10%',left:'72%',
            background:darkMode?'linear-gradient(180deg,transparent,rgba(99,102,241,0.1) 40%,rgba(56,189,248,0.07) 70%,transparent)':'linear-gradient(180deg,transparent,rgba(199,210,254,0.4) 40%,rgba(186,230,253,0.2) 70%,transparent)',
            transform:'rotate(-12deg)',filter:'blur(2px)',borderRadius:'99px'}}></div>
        <div className="light-ray-3 absolute pointer-events-none"
          style={{width:'2px',height:'40vh',bottom:'5%',left:'45%',
            background:darkMode?'linear-gradient(180deg,transparent,rgba(20,184,166,0.1) 40%,transparent)':'linear-gradient(180deg,transparent,rgba(153,246,228,0.35) 40%,transparent)',
            transform:'rotate(6deg)',filter:'blur(2px)',borderRadius:'99px'}}></div>
        <svg className="circuit-svg absolute inset-0 w-full h-full" style={{opacity:darkMode?0.06:0.08}} viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <g stroke={darkMode?'#38bdf8':'#0284c7'} fill="none" strokeWidth="1">
            <path className="circuit-path-1" d="M0,200 L120,200 L120,350 L280,350 L280,200 L440,200"/>
            <path className="circuit-path-2" d="M1440,400 L1300,400 L1300,250 L1150,250 L1150,400 L1000,400"/>
            <path className="circuit-path-3" d="M200,900 L200,750 L380,750 L380,650 L550,650"/>
            <circle className="circuit-dot-1" cx="120" cy="200" r="3" fill={darkMode?'#38bdf8':'#0284c7'}/>
            <circle className="circuit-dot-2" cx="280" cy="350" r="3" fill={darkMode?'#38bdf8':'#0284c7'}/>
            <circle className="circuit-dot-3" cx="1300" cy="400" r="3" fill={darkMode?'#38bdf8':'#0284c7'}/>
            <circle className="circuit-dot-4" cx="380" cy="750" r="3" fill={darkMode?'#38bdf8':'#0284c7'}/>
          </g>
        </svg>
        {['{}','</>','[]','=>','&&','fn()','//','0x','++','AI'].map((sym,i)=>(
          <span key={i} className={`code-token absolute font-mono font-black select-none pointer-events-none ${darkMode?'text-sky-400/20':'text-sky-600/25'}`}
            style={{fontSize:`${12+i%4*3}px`,left:`${5+i*9.5}%`,animationDelay:`${i*1.0}s`,animationDuration:`${8+i*1.6}s`}}>
            {sym}
          </span>
        ))}
        {[...Array(18)].map((_,i)=>(
          <div key={i} className={`sparkle absolute ${i%3===0?'w-1.5 h-1.5':'w-1 h-1'} rounded-full ${darkMode?'bg-sky-300/35':'bg-sky-500/40'}`}
            style={{left:`${4+i*5.4}%`,top:`${8+((i*37)%85)}%`,animationDelay:`${i*0.45}s`,animationDuration:`${2.5+i%4*0.8}s`,
              boxShadow:darkMode?`0 0 ${4+i%3*3}px rgba(56,189,248,0.5)`:`0 0 ${4+i%3*3}px rgba(14,165,233,0.4)`}}></div>
        ))}
        <div className="scan-line absolute left-0 right-0 h-[1.5px] pointer-events-none"
          style={{background:darkMode?'linear-gradient(90deg,transparent 0%,rgba(56,189,248,0.08) 20%,rgba(56,189,248,0.25) 50%,rgba(56,189,248,0.08) 80%,transparent 100%)':'linear-gradient(90deg,transparent 0%,rgba(14,165,233,0.06) 20%,rgba(14,165,233,0.2) 50%,rgba(14,165,233,0.06) 80%,transparent 100%)'}}></div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{background:darkMode?'radial-gradient(circle at top right, rgba(14,165,233,0.12) 0%, transparent 70%)':'radial-gradient(circle at top right, rgba(186,230,253,0.6) 0%, transparent 65%)',filter:'blur(20px)',transform:'translate(30%,-30%)'}}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{background:darkMode?'radial-gradient(circle at bottom left, rgba(20,184,166,0.1) 0%, transparent 70%)':'radial-gradient(circle at bottom left, rgba(153,246,228,0.5) 0%, transparent 65%)',filter:'blur(20px)',transform:'translate(-30%,30%)'}}></div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 space-y-5 z-10 ${mounted?'dash-enter':''}`}>

        {/* NAV BAR */}
        <nav className={`relative z-50 ${T.glass} ${T.border} border rounded-2xl shadow-xl ${T.shadow}`}>
          <div className="h-[3px] bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 animate-stripe rounded-t-2xl"></div>
          <div className="flex items-center justify-between px-5 py-3.5 gap-3">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-xl ${T.hover} transition-all`}>
                <MoreVertical className="w-5 h-5 text-sky-500"/>
              </button>
              <button onClick={()=>navigate('/dashboard')} className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 group-hover:scale-105 transition-all duration-300">
                    <BrainCircuit className="w-6 h-6 text-white"/>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="hidden md:block">
                  <span className={`text-xl font-black ${T.text}`}>Code</span>
                  <span className="text-xl font-black text-sky-500">Master</span>
                  <span className={`text-xl font-black ${T.textMut}`}>.AI</span>
                </div>
              </button>
            </div>

            {/* Search + Timeframe */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 gap-3">
              <div className="relative flex-1">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${T.textMut} z-10`}/>
                <input
                  type="text"
                  placeholder="Search problems, skills, courses…"
                  value={searchQuery}
                  onChange={e=>{ setSearchQuery(e.target.value); setShowSearch(e.target.value.length>0); }}
                  onFocus={()=>{ if(searchQuery.length>0) setShowSearch(true); }}
                  onBlur={()=>setTimeout(()=>setShowSearch(false),180)}
                  onKeyDown={e=>{
                    if(e.key==='Enter' && searchQuery.trim()){
                      const q = searchQuery.toLowerCase();
                      // ── Find matching page from the shared allNavPages list ──
                      const pg = allNavPages.find(p =>
                        p.label.toLowerCase().includes(q) ||
                        p.desc.toLowerCase().includes(q)
                      );
                      navigate(pg ? pg.path : '/dashboard/problems');
                      setSearchQuery('');
                      setShowSearch(false);
                    }
                    if(e.key==='Escape'){ setSearchQuery(''); setShowSearch(false); }
                  }}
                  className={`w-full pl-10 pr-8 py-2.5 ${T.input} border rounded-xl focus:outline-none focus:ring-2 text-sm transition-all`}/>
                {searchQuery&&<button onClick={()=>{ setSearchQuery(''); setShowSearch(false); }} className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${T.textMut} hover:text-sky-500 transition-colors`}>✕</button>}

                {/* ── Live Search Dropdown ── */}
                {showSearch&&searchQuery.length>0&&(()=>{
                  const q = searchQuery.toLowerCase();
                  const skillResults = skillDistribution.filter(s=>s.name.toLowerCase().includes(q)||s.category.toLowerCase().includes(q));
                  const problemResults = recentActivity.filter(a=>a.problem.toLowerCase().includes(q)||a.category.toLowerCase().includes(q));
                  // ── Uses the shared allNavPages for consistent results ──
                  const navResults = allNavPages.filter(n=>
                    n.label.toLowerCase().includes(q) ||
                    n.desc.toLowerCase().includes(q)
                  );
                  const total = skillResults.length+problemResults.length+navResults.length;
                  if(total===0) return(
                    <div className={`absolute top-full left-0 right-0 mt-2 ${darkMode?'bg-[#0D1929] border-[#1A2D48]':'bg-white border-sky-100'} border rounded-2xl shadow-2xl z-50 p-4 drop-anim`}>
                      <p className={`text-sm text-center ${T.textMut}`}>No results for "<span className="font-bold">{searchQuery}</span>"</p>
                    </div>
                  );
                  return(
                    <div className={`absolute top-full left-0 right-0 mt-2 ${darkMode?'bg-[#0D1929] border-[#1A2D48]':'bg-white border-sky-100'} border rounded-2xl shadow-2xl z-50 overflow-hidden drop-anim`}>
                      {skillResults.length>0&&(<div>
                        <p className={`px-4 pt-3 pb-1 text-xs font-black uppercase tracking-widest ${T.textMut}`}>Skills</p>
                        {skillResults.slice(0,3).map((sk,i)=>(
                          <button key={i} onMouseDown={()=>{setShowSkillDetails(sk);setSearchQuery('');setShowSearch(false);}}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 ${T.hover} transition-all text-left`}>
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${sk.grad} flex items-center justify-center flex-shrink-0`}><Code2 className="w-3.5 h-3.5 text-white"/></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold ${T.text} truncate`}>{sk.name}</p>
                              <p className={`text-xs ${T.textSec}`}>{sk.category} · {sk.problems} problems · {sk.accuracy}% acc</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${sk.importance==='Critical'?'bg-red-50 text-red-600':sk.importance==='High'?'bg-amber-50 text-amber-600':'bg-sky-50 text-sky-600'}`}>{sk.importance}</span>
                          </button>
                        ))}
                      </div>)}
                      {navResults.length>0&&(<div>
                        <p className={`px-4 pt-3 pb-1 text-xs font-black uppercase tracking-widest ${T.textMut} ${skillResults.length>0?`border-t ${T.border}`:''}`}>Pages</p>
                        <div className="px-2 pb-2 space-y-0.5">
                          {navResults.map((n,i)=>(
                            <button key={i} onMouseDown={()=>{navigate(n.path);setSearchQuery('');setShowSearch(false);}}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${T.hover} transition-all text-left`}>
                              <span className="text-lg w-7 text-center flex-shrink-0">{n.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${T.text}`}>{n.label}</p>
                                <p className={`text-xs ${T.textSec}`}>{n.desc}</p>
                              </div>
                              <span className="text-xs font-bold text-sky-500 flex-shrink-0">Go →</span>
                            </button>
                          ))}
                        </div>
                      </div>)}
                      <div className={`px-4 py-2.5 border-t ${T.border} ${darkMode?'bg-[#0A1520]':'bg-sky-50'} flex items-center justify-between`}>
                        <p className={`text-xs ${T.textMut}`}>{total} result{total!==1?'s':''} found</p>
                        <button onMouseDown={()=>{navigate('/dashboard/problems');setSearchQuery('');setShowSearch(false);}} className="text-xs font-bold text-sky-500 hover:text-sky-600">View all →</button>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <select value={selectedTimeframe} onChange={e=>setSelectedTimeframe(e.target.value)}
                className={`px-3 py-2.5 ${T.input} border rounded-xl focus:outline-none focus:ring-2 text-sm flex-shrink-0`}>
                <option value="week">This Week</option><option value="month">This Month</option><option value="quarter">This Quarter</option><option value="year">This Year</option>
              </select>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
              <button onClick={()=>setShowQuickPractice(true)} title="Quick Practice"
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black transition-all ${darkMode?'bg-sky-500/12 text-sky-400 border-sky-500/25 hover:bg-sky-500/20':'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100'}`}>
                <Zap className="w-3.5 h-3.5"/>Quick
              </button>
              <button onClick={()=>setShowHelp(true)} title="Help & Support"
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-black transition-all ${darkMode?'bg-violet-500/12 text-violet-400 border-violet-500/25 hover:bg-violet-500/20':'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100'}`}>
                <HelpCircle className="w-3.5 h-3.5"/>Help
              </button>
              <button onClick={()=>setAutoRefresh(!autoRefresh)} title={autoRefresh?'Pause Auto-refresh':'Start Auto-refresh'}
                className={`relative p-2.5 rounded-xl border transition-all ${autoRefresh?darkMode?'bg-emerald-500/15 text-emerald-400 border-emerald-500/30':'bg-emerald-50 text-emerald-600 border-emerald-200':darkMode?'bg-[#142235] text-slate-400 border-[#1A2D48]':'bg-sky-50 text-sky-400 border-sky-200'}`}>
                {autoRefresh?<Play className="w-4 h-4"/>:<Pause className="w-4 h-4"/>}
                {autoRefresh&&<span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center"><Timer className="w-2 h-2 text-white"/></span>}
              </button>
              <button onClick={refreshStats} title="Refresh Now"
                className={`p-2.5 rounded-xl border transition-all ${darkMode?'bg-sky-500/12 text-sky-400 border-sky-500/25 hover:bg-sky-500/20':'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100'}`}>
                <RefreshCw className="w-4 h-4"/>
              </button>
              <button onClick={toggleFullscreen} className={`hidden md:block p-2.5 rounded-xl border transition-all ${darkMode?'bg-slate-700/60 text-slate-300 border-slate-600/60 hover:bg-slate-700':'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                {isFullscreen?<Minimize2 className="w-4 h-4"/>:<Maximize2 className="w-4 h-4"/>}
              </button>
              <button onClick={()=>setDarkMode(!darkMode)} title={darkMode?'Light Mode':'Dark Mode'}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-sm border transition-all duration-300 ${darkMode?'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25':'sky-toggle-active text-white border-sky-500 shadow-lg shadow-sky-400/30 hover:shadow-sky-400/50'}`}>
                {darkMode?<><Sun className="w-3.5 h-3.5"/>Light</>:<><Moon className="w-3.5 h-3.5"/>Dark</>}
              </button>
              {selectedSkillsForComparison.length>0&&(
                <button onClick={()=>setShowSkillComparison(true)}
                  className={`relative p-2.5 rounded-xl border transition-all ${darkMode?'bg-violet-500/15 text-violet-400 border-violet-500/30':'bg-violet-50 text-violet-600 border-violet-200'}`}>
                  <GitCompare className="w-4 h-4"/>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center font-black">{selectedSkillsForComparison.length}</span>
                </button>
              )}

              {/* User Menu */}
              <div className="relative">
                <button onClick={()=>setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-all duration-200 ${T.border} ${T.hover}`}>
                  <div className="bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg w-8 h-8 flex items-center justify-center shadow-md shadow-sky-400/25 flex-shrink-0">
                    <span className="text-sm font-black text-white">{user?.username ? user.username[0].toUpperCase() : '?'}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-xs font-black leading-tight ${T.text}`}>{user?.username || 'Loading…'}</p>
                    <p className="text-xs font-bold leading-tight text-sky-500">Rank #{user?.rank || stats.rank}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${T.textMut} ${showUserMenu?'rotate-180':''}`}/>
                </button>
                {showUserMenu&&(
                  <>
                    <div className="fixed inset-0 z-[998]" onClick={()=>setShowUserMenu(false)}/>
                    <div className="absolute right-0 top-full mt-2 w-72 z-[999] rounded-2xl shadow-2xl overflow-hidden drop-anim"
                      style={{background:darkMode?'#0D1929':'#ffffff',border:`1.5px solid ${darkMode?'#1E3A5F':'#bae6fd'}`}}>
                      <div style={{background:darkMode?'rgba(14,165,233,0.07)':'linear-gradient(135deg,#f0f9ff,#ecfeff)',borderBottom:`1px solid ${darkMode?'#1A2D48':'#bae6fd'}`}} className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg shadow-sky-400/30 flex-shrink-0">
                            <span className="text-xl font-black text-white">{user?.username ? user.username[0].toUpperCase() : '?'}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-black text-sm leading-tight truncate ${T.text}`}>{user?.username || 'Unknown User'}</p>
                            <p className={`text-xs leading-tight truncate mt-0.5 ${T.textSec}`}>{user?.email || 'No email set'}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs font-black text-sky-500">🏆 Rank #{user?.rank || stats.rank}</span>
                              <span className={`text-xs ${T.textMut}`}>·</span>
                              <span className="text-xs font-bold text-orange-500">{stats.currentStreak} 🔥 streak</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={T.textMut}>Level 12 Progress</span>
                            <span className="font-black text-sky-500">72%</span>
                          </div>
                          <div className={`h-1.5 ${darkMode?'bg-[#1A2D48]':'bg-sky-100'} rounded-full overflow-hidden`}>
                            <div className="h-1.5 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full transition-all duration-1000" style={{width:`${xpBarValue}%`}}></div>
                          </div>
                          <p className={`text-xs ${T.textMut} mt-1`}>2,840 / 4,000 XP to Level 13</p>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mt-3">
                          {[
                            {label:'Solved',value:user?.solved||stats.totalSolved,color:'sky'},
                            {label:'Points',value:(user?.points||stats.totalPoints).toLocaleString(),color:'violet'},
                            {label:'Accuracy',value:`${stats.accuracy}%`,color:'emerald'},
                          ].map(({label,value,color})=>(
                            <div key={label} className={`rounded-xl px-2 py-2 text-center ${darkMode?`bg-${color}-500/10`:`bg-${color}-50`}`}>
                              <p className={`text-sm font-black text-${color}-${darkMode?'400':'600'} leading-none`}>{value}</p>
                              <p className={`text-xs mt-0.5 ${T.textMut}`}>{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="py-1.5">
                        {[
                          {label:'My Profile',Icon:User,desc:'Badges & achievements',fn:()=>navigate('/dashboard/profile')},
                          {label:'Leaderboard',Icon:Trophy,desc:'Your global ranking',fn:()=>navigate('/dashboard/leaderboard')},
                          {label:'Export Data',Icon:Download,desc:'Download dashboard data',fn:exportData},
                        ].map(({label,Icon,desc,fn})=>(
                          <button key={label} onClick={()=>{fn();setShowUserMenu(false);}}
                            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-150"
                            onMouseEnter={e=>e.currentTarget.style.background=darkMode?'rgba(14,165,233,0.09)':'rgba(224,242,254,0.8)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode?'bg-sky-500/15':'bg-sky-100'}`}>
                              <Icon className="w-4 h-4 text-sky-500"/>
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <p className={`text-sm font-bold leading-tight ${T.text}`}>{label}</p>
                              <p className={`text-xs leading-tight ${T.textMut}`}>{desc}</p>
                            </div>
                          </button>
                        ))}
                        <div className={`h-px mx-4 my-1.5 ${darkMode?'bg-[#1A2D48]':'bg-sky-100'}`}/>
                        <button onClick={()=>{handleLogout();setShowUserMenu(false);}}
                          className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150"
                          onMouseEnter={e=>e.currentTarget.style.background=darkMode?'rgba(239,68,68,0.1)':'#fff1f1'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                            <LogOut className="w-4 h-4 text-rose-500"/>
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-black text-rose-500 leading-tight">Logout</p>
                            <p className={`text-xs leading-tight ${T.textMut}`}>Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                      <div className="px-4 py-2.5 flex items-center justify-between"
                        style={{borderTop:`1px solid ${darkMode?'#1A2D48':'#bae6fd'}`,background:darkMode?'rgba(13,25,41,0.8)':'rgba(240,249,255,0.9)'}}>
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-orange-500"/>
                          <span className={`text-xs font-black ${T.text}`}>{stats.currentStreak}-day streak</span>
                        </div>
                        <span className={`text-xs ${T.textMut}`}>Refreshed {lastRefreshTime.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen&&(
          <div className={`md:hidden ${T.glass} ${T.border} border rounded-2xl shadow-xl p-4 drop-anim`}>
            <div className="grid grid-cols-3 gap-2">
              {[[Home,'Dashboard','/dashboard'],[Code2,'Problems','/dashboard/problems'],[BookOpen,'Courses','/dashboard/courses'],[TrendingUp,'Progress','/dashboard/progress'],[Trophy,'Leaderboard','/dashboard/leaderboard'],[Settings,'Settings','/dashboard/settings']].map(([Icon,l,p])=>(
                <button key={p} onClick={()=>{navigate(p);setMobileMenuOpen(false);}}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${T.hover} transition-all`}>
                  <Icon className="w-5 h-5 text-sky-500"/>
                  <span className={`text-xs font-semibold ${T.text}`}>{l}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HERO BANNER */}
        <div className="relative z-0 overflow-hidden rounded-3xl shadow-2xl shadow-sky-400/20">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500"></div>
          <div className="absolute inset-0">
            <div className="hero-mesh-1 absolute w-72 h-72 bg-white/10 rounded-full blur-3xl -top-20 -right-20"></div>
            <div className="hero-mesh-2 absolute w-56 h-56 bg-white/8 rounded-full blur-2xl -bottom-12 left-1/4"></div>
            <div className="hero-mesh-3 absolute w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl top-1/2 right-1/4"></div>
          </div>
          <div className="absolute top-6 right-1/3 w-6 h-6 bg-white/25 rounded-full animate-bounce" style={{animationDelay:'0.3s'}}></div>
          <div className="absolute bottom-6 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-bounce" style={{animationDelay:'0.9s'}}></div>
          <div className="absolute top-8 left-1/2 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{animationDelay:'0.6s'}}></div>
          {[...Array(8)].map((_,i)=>(
            <div key={i} className="hero-star absolute w-1 h-1 bg-white/40 rounded-full"
              style={{left:`${10+i*12}%`,top:`${15+i%3*30}%`,animationDelay:`${i*0.5}s`}}></div>
          ))}
          <div className="absolute inset-0 hero-sweep pointer-events-none"></div>
          <div className="relative px-6 md:px-8 py-8 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-white/30 animate-[ping_2s_ease-out_infinite] scale-110"></div>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-xl text-white text-3xl font-black relative z-10">
                    {user?.username ? user.username[0].toUpperCase() : '?'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 z-20 bg-emerald-400 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                    Welcome back, <span className="text-cyan-100">{user?.username || 'there'}</span>! 👋
                  </h1>
                  <p className="text-sky-100/90 text-sm mt-1 mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse flex-shrink-0"/>
                    <span className="font-medium">{heroText}<span className="animate-pulse">|</span></span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-white border border-white/30">🏆 Rank #{stats.rank} globally</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-white border border-white/30 flex items-center gap-1"><Sparkles className="w-3 h-3 text-yellow-300 animate-pulse"/>{stats.currentStreak}-day streak!</span>
                    <span className="bg-emerald-400/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-white border border-emerald-300/30">{stats.accuracy}% accuracy</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <div className={`bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-black">Level 12 · 2,840 XP</span>
                    <span className="text-cyan-100 text-xs font-bold">72% → Lv.13</span>
                  </div>
                  <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="xp-bar-fill h-2 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full shadow-lg shadow-yellow-300/40" style={{width:`${xpBarValue}%`}}></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>navigate('/dashboard/problems')}
                    className="btn-shimmer bg-white text-sky-600 px-6 py-2.5 rounded-xl font-black hover:bg-sky-50 transition-all hover:scale-105 shadow-xl text-sm relative overflow-hidden">
                    <span className="relative z-10">⚡ Practice Now</span>
                  </button>
                  <button onClick={()=>navigate('/dashboard/contests')}
                    className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-2.5 rounded-xl font-black hover:bg-white/30 transition-all hover:scale-105 text-sm">
                    🎯 Daily Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {title:'Problems Solved',value:animatedStats.totalSolved,change:'+50%',icon:CheckCircle2,grad:'from-sky-500 to-cyan-500',subtitle:`+${stats.thisWeekSolved} this week`},
            {title:'Total Points',value:animatedStats.totalPoints.toLocaleString(),change:'+12%',icon:Star,grad:'from-violet-500 to-purple-500',subtitle:'Top 15% globally'},
            {title:'Global Rank',value:`#${animatedStats.rank}`,change:'+5 ranks',icon:Trophy,grad:'from-amber-500 to-orange-500',subtitle:'Climbing fast! 🚀'},
            {title:'Current Streak',value:`${animatedStats.currentStreak} days`,change:'Active',icon:Flame,grad:'from-rose-500 to-pink-500',subtitle:'Keep the fire going! 🔥'},
          ].map((s,i)=>(
            <div key={i} onClick={e=>{ triggerRipple(e,i); navigate('/dashboard/progress'); }}
              onMouseEnter={()=>setIsHoveringCard(true)}
              onMouseLeave={()=>setIsHoveringCard(false)}
              className={`stat-card ${T.glass} ${T.border} border rounded-2xl cursor-pointer group transition-all duration-300 shadow-lg ${T.shadow} relative overflow-hidden`}
              style={{animationDelay:`${i*100}ms`, minHeight:'156px'}}>
              {cardRipples.map(r=>(
                <span key={r.id} className="ripple-effect absolute rounded-full pointer-events-none"
                  style={{left:r.x,top:r.y,background:'rgba(56,189,248,0.25)'}}></span>
              ))}
              <div className="stat-glow absolute inset-0 rounded-2xl pointer-events-none"></div>
              <div className="stat-border-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className={`h-1 w-full bg-gradient-to-r ${s.grad} rounded-t-2xl`}></div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 bg-gradient-to-br ${s.grad} rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`}>
                    <s.icon className="w-5 h-5 text-white"/>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border whitespace-nowrap ${darkMode?'text-emerald-400 bg-emerald-500/12 border-emerald-500/30':'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>↑ {s.change}</span>
                </div>
                <p className={`text-xs font-black uppercase tracking-widest ${T.textMut} mb-1.5`}>{s.title}</p>
                <p className={`font-black ${T.text} tabular-nums leading-tight mb-1`} style={{fontSize:'clamp(1.75rem, 3vw, 2.5rem)'}}>
                  {s.value}
                </p>
                <p className={`text-xs ${T.textSec}`}>{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Heatmap */}
        <div className={`${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-sky-500 to-teal-500 p-2.5 rounded-xl shadow-md shadow-sky-400/20">
                <Activity className="w-4 h-4 text-white"/>
              </div>
              <div>
                <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Coding Activity</h2>
                <p className={`text-xs ${T.textSec} mt-0.5`}>365-day contribution graph · {stats.totalSolved} problems solved</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={T.textMut}>Less</span>
              {[0,2,4,6,8].map(v=>(
                <div key={v} className="w-3 h-3 rounded-sm transition-all" style={{
                  background: v===0?(darkMode?'#1A2D48':'#e0f2fe'):`rgba(14,165,233,${v/10})`,
                }}></div>
              ))}
              <span className={T.textMut}>More</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {heatmapData.map((week,wi)=>(
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day,di)=>(
                    <div key={di} title={`${day.val} problems · ${day.date.toLocaleDateString()}`}
                      className="heatmap-cell w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125 hover:ring-1 hover:ring-sky-400"
                      style={{
                        background: day.val===0?(darkMode?'#1A2D48':'#e0f2fe'):day.val<3?`rgba(56,189,248,0.35)`:day.val<6?`rgba(14,165,233,0.65)`:`rgba(14,165,233,0.95)`,
                        animationDelay:`${(wi*7+di)*8}ms`,
                      }}>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-6 mt-3 text-xs">
            {[['Total Days',`${heatmapData.flat().filter(d=>d.val>0).length}`,'sky'],['Best Streak',`${stats.currentStreak} days`,'amber'],['This Month','23 problems','emerald']].map(([l,v,c])=>(
              <div key={l} className="flex items-center gap-1.5">
                <span className={`font-black text-${c}-${darkMode?'400':'600'}`}>{v}</span>
                <span className={T.textMut}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className={`lg:col-span-3 ${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} p-5`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-2.5 rounded-xl shadow-md shadow-sky-400/20">
                  <BarChart3 className="w-4 h-4 text-white"/>
                </div>
                <div>
                  <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Weekly Performance</h2>
                  <p className={`text-xs ${T.textSec} mt-0.5`}>Problems solved per day</p>
                </div>
              </div>
              <select value={selectedTimeframe} onChange={e=>setSelectedTimeframe(e.target.value)}
                className={`px-3 py-1.5 text-xs font-bold ${T.input} border rounded-lg focus:outline-none focus:ring-2`}>
                <option value="week">This Week</option><option value="month">This Month</option><option value="year">This Year</option>
              </select>
            </div>
            <div className="space-y-3.5">
              {weeklyData.map((d,i)=>(
                <div key={i} onMouseEnter={()=>setHoveredDay(i)} onMouseLeave={()=>setHoveredDay(null)} className="group/bar">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-black w-8 ${T.text}`}>{d.day}</span>
                      <span className={`text-xs ${T.textSec} transition-all`}>
                        {hoveredDay===i?`${d.problems} problems · ${d.points} pts`:d.up?'↑ Great day':'↓ Rest day'}
                      </span>
                    </div>
                    <span className={`text-xs font-black ${d.up?'text-emerald-500':'text-slate-400'}`}>{d.change}</span>
                  </div>
                  <div className={`w-full ${darkMode?'bg-[#1A2D48]':'bg-sky-100'} rounded-full h-2 overflow-hidden`}>
                    <div className={`h-2 rounded-full transition-all duration-700 ease-out bar-fill ${d.up?'bg-gradient-to-r from-sky-400 to-cyan-500':'bg-gradient-to-r from-slate-300 to-slate-400'}`}
                      style={{width:`${hoveredDay===i?Math.min(d.pct+4,100):d.pct}%`,animationDelay:`${i*80}ms`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`lg:col-span-2 ${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} p-5 flex flex-col`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-xl shadow-md shadow-violet-400/20">
                <Brain className="w-4 h-4 text-white"/>
              </div>
              <div>
                <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Intelligence</h2>
                <p className={`text-xs ${T.textSec} mt-0.5`}>Solving accuracy score</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative w-36 h-36">
                <svg className="absolute inset-0 w-36 h-36 -rotate-90 opacity-20" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="68" stroke={darkMode?'#38bdf8':'#0ea5e9'} strokeWidth="1" fill="none" strokeDasharray="4 8"/>
                </svg>
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="62" stroke={darkMode?'#1A2D48':'#e0f2fe'} strokeWidth="11" fill="none"/>
                  <circle cx="72" cy="72" r="62" stroke="url(#skyRingGrad)" strokeWidth="11" fill="none"
                    strokeDasharray={`${2*Math.PI*62}`}
                    strokeDashoffset={`${2*Math.PI*62*(1-animatedStats.accuracy/100)}`}
                    strokeLinecap="round" style={{transition:'stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)',filter:'drop-shadow(0 0 8px rgba(56,189,248,0.6))'}}/>
                  <defs>
                    <linearGradient id="skyRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className={`text-3xl font-black ${T.text}`}>{animatedStats.accuracy}%</p>
                  <p className={`text-xs ${T.textSec}`}>Accuracy</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {[
                  {icon:Cpu,label:'Fast Learner',val:'92%',c:'sky'},
                  {icon:Target,label:'Focused',val:'85%',c:'violet'},
                  {icon:TrendingUp,label:'Improving',val:'+15%',c:'emerald'},
                  {icon:Zap,label:'Efficiency',val:'78%',c:'amber'},
                ].map((m,i)=>(
                  <div key={i} className={`${darkMode?`bg-${m.c}-500/10`:`bg-${m.c}-50`} rounded-xl p-2.5 text-center hover:scale-105 transition-all cursor-pointer group`}>
                    <m.icon className={`w-4 h-4 text-${m.c}-500 mx-auto mb-1 group-hover:scale-110 transition-transform`}/>
                    <p className={`text-xs font-bold ${T.text}`}>{m.label}</p>
                    <p className={`text-sm font-black text-${m.c}-${darkMode?'400':'600'}`}>{m.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SKILL DISTRIBUTION */}
        <div className={`${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} p-5`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 rounded-xl shadow-md shadow-teal-400/20">
                <Terminal className="w-4 h-4 text-white"/>
              </div>
              <div>
                <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Skill Distribution</h2>
                <p className={`text-xs ${T.textSec} mt-0.5`}>Your coding expertise breakdown</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={selectedSkillCategory} onChange={e=>setSelectedSkillCategory(e.target.value)}
                className={`px-3 py-1.5 text-xs font-bold ${T.input} border rounded-lg focus:outline-none focus:ring-2`}>
                <option value="all">All Categories</option>
                <option value="data-structures">Data Structures</option>
                <option value="algorithms">Algorithms</option>
                <option value="patterns">Patterns</option>
              </select>
              <select value={skillSortBy} onChange={e=>setSkillSortBy(e.target.value)}
                className={`px-3 py-1.5 text-xs font-bold ${T.input} border rounded-lg focus:outline-none focus:ring-2`}>
                <option value="importance">By Importance</option>
                <option value="problems">By Problems</option>
                <option value="accuracy">By Accuracy</option>
              </select>
              {selectedSkillsForComparison.length>0&&(
                <button onClick={()=>setShowSkillComparison(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg text-xs font-black hover:from-sky-600 hover:to-cyan-600 flex items-center gap-1.5 shadow-md shadow-sky-400/20">
                  <GitCompare className="w-3.5 h-3.5"/>Compare ({selectedSkillsForComparison.length})
                </button>
              )}
            </div>
          </div>
          <div className="mb-5">
            <div className={`w-full ${darkMode?'bg-[#1A2D48]':'bg-sky-100'} rounded-full h-8 overflow-hidden flex relative`}>
              {filteredSkills.map((sk,i)=>(
                <div key={i} className={`relative bg-gradient-to-r ${sk.grad} transition-all duration-500 hover:brightness-110 cursor-pointer`}
                  style={{width:`${sk.value}%`}}
                  onMouseEnter={()=>setHoveredSkill(i)} onMouseLeave={()=>setHoveredSkill(null)}
                  onClick={()=>setShowSkillDetails(sk)}>
                  {i>0&&<div className="absolute left-0 top-0 bottom-0 w-px bg-white/30"></div>}
                  {hoveredSkill===i&&(
                    <div className={`absolute -top-24 left-1/2 -translate-x-1/2 z-20 ${MB} border ${MBrd} rounded-2xl shadow-2xl px-4 py-3 min-w-52 pointer-events-none`}>
                      <p className={`text-sm font-black ${T.text} mb-2`}>{sk.name}</p>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[['Problems',sk.problems],['Accuracy',sk.accuracy+'%'],['Avg Time',sk.avgTime],['Interview',sk.interviewFrequency+'%']].map(([l,v])=>(
                          <div key={l}><p className={T.textMut}>{l}</p><p className={`font-black ${T.text}`}>{v}</p></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {filteredSkills.map((sk,i)=>(
              <div key={i}
                onMouseEnter={()=>setHoveredSkill(i)} onMouseLeave={()=>setHoveredSkill(null)}
                className={`skill-row flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${hoveredSkill===i?darkMode?'bg-sky-500/8 border-sky-500/30':'bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200':darkMode?`border-[#1A2D48]`:`border-sky-100`}`}
                style={{animationDelay:`${i*60}ms`}}>
                <input type="checkbox" checked={selectedSkillsForComparison.some(s=>s.name===sk.name)}
                  onChange={()=>toggleSkillComparison(sk)}
                  className="w-4 h-4 rounded accent-sky-500 flex-shrink-0"
                  disabled={selectedSkillsForComparison.length>=3&&!selectedSkillsForComparison.some(s=>s.name===sk.name)}/>
                <div className={`w-2.5 h-2.5 ${sk.dot} rounded-full shadow-sm flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-sm font-black ${T.text}`}>{sk.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sk.importance==='Critical'?darkMode?'bg-red-500/15 text-red-400':'bg-red-50 text-red-600':sk.importance==='High'?darkMode?'bg-amber-500/15 text-amber-400':'bg-amber-50 text-amber-600':darkMode?'bg-sky-500/15 text-sky-400':'bg-sky-50 text-sky-600'}`}>{sk.importance}</span>
                  </div>
                  <p className={`text-xs ${T.textSec}`}>{sk.problems} problems · Avg {sk.avgTime} · <span className="text-emerald-500 font-bold">{sk.accuracy}% acc.</span></p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-lg font-black ${T.text}`}>{sk.value}%</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={e=>{e.stopPropagation();setShowSkillDetails(sk);}}
                      className={`p-1.5 rounded-lg ${darkMode?'bg-sky-500/15 text-sky-400':'bg-sky-100 text-sky-600'} hover:scale-110 transition-all`}>
                      <Info className="w-3.5 h-3.5"/>
                    </button>
                    <button onClick={e=>{e.stopPropagation();navigate('/dashboard/problems',{state:{filter:sk.name}});}}
                      className={`p-1.5 rounded-lg ${darkMode?'bg-emerald-500/15 text-emerald-400':'bg-emerald-100 text-emerald-600'} hover:scale-110 transition-all`}>
                      <Code2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-4 pt-4 border-t ${darkMode?'border-[#1A2D48]':'border-sky-100'} flex flex-wrap items-center gap-3 text-xs ${T.textSec}`}>
            {[['bg-red-500','Critical'],['bg-amber-500','High'],['bg-sky-500','Medium']].map(([c,l])=>(
              <span key={l} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 ${c} rounded-sm`}></span>{l}</span>
            ))}
            <span className={`ml-auto ${T.textMut}`}>Select up to 3 to compare</span>
          </div>
        </div>

        {/* MONTHLY PROGRESS + RECENT ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className={`lg:col-span-2 ${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} p-5`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl shadow-md shadow-emerald-400/20">
                <LineChart className="w-4 h-4 text-white"/>
              </div>
              <div>
                <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Monthly Progress</h2>
                <p className={`text-xs ${T.textSec} mt-0.5`}>Problems solved trend</p>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2.5 h-44 items-end">
              {monthlyProgress.map((m,i)=>(
                <div key={i} className="flex flex-col items-center gap-1.5"
                  onMouseEnter={()=>setHoveredMonth(i)} onMouseLeave={()=>setHoveredMonth(null)}>
                  <div className="w-full flex flex-col justify-end relative" style={{height:'148px'}}>
                    {hoveredMonth===i&&(
                      <div className={`absolute -top-11 left-1/2 -translate-x-1/2 ${MB} border ${MBrd} rounded-xl shadow-2xl px-3 py-2 z-10 whitespace-nowrap`}>
                        <p className={`text-xs font-black ${T.text}`}>{m.solved} problems</p>
                        {m.growth!==0&&<p className={`text-xs font-bold ${m.growth>0?'text-emerald-500':'text-red-400'}`}>{m.growth>0?'+':''}{m.growth}%</p>}
                      </div>
                    )}
                    <div className={`w-full rounded-t-xl transition-all duration-700 cursor-pointer month-bar ${m.growth>=0?'bg-gradient-to-t from-sky-500 to-cyan-400 shadow-sky-500/20':darkMode?'bg-gradient-to-t from-slate-500 to-slate-400':'bg-gradient-to-t from-slate-300 to-slate-200'} ${hoveredMonth===i?'shadow-lg':''}`}
                      style={{height:`${hoveredMonth===i?Math.min(m.pct+5,100):m.pct}%`,animationDelay:`${i*120}ms`}}></div>
                  </div>
                  <span className={`text-xs font-bold ${T.textSec}`}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} overflow-hidden`}>
            <div className={`p-4 border-b ${T.border} flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-sky-500 to-cyan-500 p-2 rounded-lg shadow-md shadow-sky-400/20">
                  <Activity className="w-4 h-4 text-white"/>
                </div>
                <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Recent Activity</h2>
              </div>
              <select value={activityFilter} onChange={e=>setActivityFilter(e.target.value)}
                className={`px-2.5 py-1.5 text-xs font-bold ${T.input} border rounded-lg focus:outline-none`}>
                <option value="all">All</option><option value="solved">Solved</option><option value="attempted">Tried</option>
              </select>
            </div>
            <div className={`divide-y ${T.divider} max-h-80 overflow-y-auto`}>
              {filteredActivity.map((a,idx)=>(
                <div key={a.id}
                  className={`p-3.5 ${T.rowHov} transition-all cursor-pointer group activity-item`}
                  style={{animationDelay:`${idx*80}ms`}}
                  onClick={()=>navigate(`/dashboard/problems/${a.id}`)}>
                  <div className="flex items-start gap-3">
                    <div className={`${a.status==='solved'?darkMode?'bg-emerald-500/15':'bg-emerald-50':'bg-amber-50'} p-1.5 rounded-lg mt-0.5 flex-shrink-0`}>
                      {a.status==='solved'?<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/>:<AlertCircle className="w-3.5 h-3.5 text-amber-500"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-black ${T.text} group-hover:text-sky-500 transition-colors truncate`}>{a.problem}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border font-bold flex-shrink-0 ${diffBadge(a.difficulty)}`}>{a.difficulty}</span>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${T.textSec}`}>
                        <span>{a.time}</span><span>·</span><span>{a.language}</span>
                        {a.status==='solved'&&<span className="text-emerald-500 font-black ml-auto">+{a.points} pts</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SKILL MASTERY PROGRESS */}
        <div className={`${T.glass} ${T.border} border rounded-2xl shadow-lg ${T.shadow} p-5`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-xl shadow-md shadow-violet-400/20">
                <Code2 className="w-4 h-4 text-white"/>
              </div>
              <div>
                <h2 className={`text-sm font-black uppercase tracking-wide ${T.text}`}>Skill Mastery Progress</h2>
                <p className={`text-xs ${T.textSec} mt-0.5`}>Avg session 48 min · Weekly growth +3.2 problems</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {skillProgress.map((sk,i)=>(
              <div key={i} className={`skill-mastery-card group rounded-2xl border ${darkMode?'border-[#1A2D48] hover:border-sky-500/30':'border-sky-100 hover:border-sky-200'} p-4 transition-all`}
                style={{animationDelay:`${i*100}ms`}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <GitBranch className="w-4 h-4 text-sky-500 flex-shrink-0"/>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-black ${T.text}`}>{sk.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sk.progress>=80?darkMode?'bg-emerald-500/15 text-emerald-400':'bg-emerald-50 text-emerald-600':sk.progress>=60?darkMode?'bg-sky-500/15 text-sky-400':'bg-sky-50 text-sky-600':darkMode?'bg-amber-500/15 text-amber-400':'bg-amber-50 text-amber-600'}`}>
                          {sk.milestones.filter(m=>m.completed).length}/{sk.milestones.length} milestones
                        </span>
                      </div>
                      <p className={`text-xs ${T.textSec} mt-0.5`}>{sk.problems}/{sk.target} problems · {sk.timeInvested}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-black ${sk.trend.startsWith('+')?'text-emerald-500':'text-rose-400'}`}>{sk.trend}/wk</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={()=>setShowSkillMasteryModal(sk)}
                        className={`p-1.5 rounded-lg ${darkMode?'bg-violet-500/15 text-violet-400':'bg-violet-50 text-violet-600'} hover:scale-110 transition-all`}>
                        <Eye className="w-3.5 h-3.5"/>
                      </button>
                      <button onClick={()=>navigate('/dashboard/problems',{state:{filter:sk.name}})}
                        className={`p-1.5 rounded-lg ${darkMode?'bg-sky-500/15 text-sky-400':'bg-sky-50 text-sky-600'} hover:scale-110 transition-all`}>
                        <Code2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex-1 ${darkMode?'bg-[#1A2D48]':'bg-sky-100'} rounded-full h-2.5 overflow-hidden`}>
                    <div className={`mastery-bar bg-gradient-to-r ${sk.grad} h-2.5 rounded-full`}
                      style={{width:`${sk.progress}%`,animationDelay:`${i*150}ms`}}></div>
                  </div>
                  <span className={`text-sm font-black ${T.text} w-10 text-right`}>{sk.progress}%</span>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {sk.milestones.map((m,j)=>(
                    <div key={j} title={m.name}
                      className={`flex-1 h-1 rounded-full transition-all ${m.completed?'bg-emerald-500':m.progress>0?'bg-sky-400/60':darkMode?'bg-[#1A2D48]':'bg-sky-100'}`}></div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {[
                    ['💪 Strengths',sk.strengthAreas.slice(0,2).join(', '),'sky'],
                    ['⚡ Improve',sk.weaknessAreas[0],'amber'],
                    ['📅 ETA',sk.projectedCompletion,'emerald'],
                    ['⏱ Avg',sk.avgSessionTime,'violet'],
                  ].map(([l,v,c])=>(
                    <div key={l} className={`${darkMode?`bg-${c}-500/10 border-${c}-500/20`:`bg-${c}-50 border-${c}-100`} border rounded-xl p-2.5`}>
                      <p className={`font-bold ${T.textSec} mb-0.5`}>{l}</p>
                      <p className={`text-${c}-${darkMode?'400':'600'} font-black truncate`}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {title:'Practice Problems',desc:'500+ curated problems',icon:Code2,grad:'from-sky-500 to-cyan-500',glow:'hover:shadow-sky-400/20',path:'/dashboard/problems',badge:'500+'},
            {title:'My Profile',desc:'Badges & achievements',icon:Briefcase,grad:'from-violet-500 to-purple-500',glow:'hover:shadow-violet-400/20',path:'/dashboard/profile',badge:'15 badges'},
            {title:'Live Contests',desc:'Join coding challenges',icon:GraduationCap,grad:'from-rose-500 to-pink-500',glow:'hover:shadow-rose-400/20',path:'/dashboard/contests',badge:'3 live'},
            {title:'Leaderboard',desc:'Your global standing',icon:Trophy,grad:'from-amber-500 to-orange-500',glow:'hover:shadow-amber-400/20',path:'/dashboard/leaderboard',badge:'Top 15%'},
          ].map((a,i)=>(
            <button key={i} onClick={()=>navigate(a.path)}
              onMouseEnter={()=>setIsHoveringCard(true)}
              onMouseLeave={()=>setIsHoveringCard(false)}
              className={`qa-card relative overflow-hidden ${T.glass} ${T.border} border rounded-2xl p-5 text-left group transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-300 shadow-lg ${T.shadow} ${a.glow} hover:shadow-xl`}
              style={{animationDelay:`${i*80}ms`}}>
              <div className="absolute -bottom-3 -right-3 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity">
                <a.icon className="w-20 h-20"/>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{background:`linear-gradient(135deg, transparent 40%, rgba(56,189,248,0.06) 100%)`}}></div>
              <div className={`bg-gradient-to-br ${a.grad} p-2.5 rounded-xl inline-flex mb-3.5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <a.icon className="w-5 h-5 text-white"/>
              </div>
              <h3 className={`text-sm font-black ${T.text} mb-1`}>{a.title}</h3>
              <p className={`text-xs ${T.textSec} mb-3`}>{a.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-500 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">Explore →</span>
                <span className={`text-xs font-bold ${T.tag} px-2 py-0.5 rounded-lg`}>{a.badge}</span>
              </div>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${a.grad} w-0 group-hover:w-full transition-all duration-500`}></div>
            </button>
          ))}
        </div>

        {/* FOOTER */}
        <div className={`${T.glass} ${T.border} border rounded-2xl shadow-md p-4`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className={`text-xs ${T.textSec}`}>
              <span className="font-black">Last updated:</span> {lastRefreshTime.toLocaleTimeString()} ·
              <span className="ml-1.5">Auto-refresh: <span className={`font-black ${autoRefresh?'text-emerald-500':'text-slate-400'}`}>{autoRefresh?`ON (${formatTime()})`:'OFF'}</span></span>
            </p>
            <div className="flex items-center gap-5">
              <button onClick={refreshStats} className="flex items-center gap-1.5 text-xs font-black text-sky-500 hover:text-sky-600 transition-colors"><RefreshCw className="w-3.5 h-3.5"/>Refresh</button>
              <button onClick={exportData} className="flex items-center gap-1.5 text-xs font-black text-violet-500 hover:text-violet-600 transition-colors"><Download className="w-3.5 h-3.5"/>Export</button>
              <button onClick={()=>setShowHelp(true)} className={`flex items-center gap-1.5 text-xs font-black ${T.textSec} hover:text-sky-500 transition-colors`}><HelpCircle className="w-3.5 h-3.5"/>Help</button>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL ANIMATION STYLES */}
      <style jsx>{`
        @keyframes dashEnter { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .dash-enter{animation:dashEnter 0.6s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes statIn{from{opacity:0;transform:translateY(30px) scale(0.94)} to{opacity:1;transform:translateY(0) scale(1)}}
        .stat-card{opacity:0;animation:statIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards}
        .stat-card:nth-child(1){animation-delay:0.05s}.stat-card:nth-child(2){animation-delay:0.15s}.stat-card:nth-child(3){animation-delay:0.25s}.stat-card:nth-child(4){animation-delay:0.35s}
        .stat-glow{background:radial-gradient(ellipse at 50% -10%,rgba(14,165,233,0.1),transparent 65%);opacity:0;transition:opacity 0.35s}
        .stat-card:hover .stat-glow{opacity:1}
        @keyframes rippleOut{from{width:0;height:0;opacity:0.6;transform:translate(-50%,-50%)} to{width:200px;height:200px;opacity:0;transform:translate(-50%,-50%)}}
        .ripple-effect{animation:rippleOut 0.7s ease-out forwards}
        @keyframes heroSweep{0%{transform:translateX(-100%) skewX(-15deg)} 100%{transform:translateX(300%) skewX(-15deg)}}
        .hero-sweep{background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);width:40%;animation:heroSweep 4s ease-in-out infinite;animation-delay:1.5s}
        @keyframes heroMesh1{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,15px) scale(1.08)}}
        @keyframes heroMesh2{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(15px,-20px) scale(1.06)}}
        @keyframes heroMesh3{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-10px,10px) scale(1.04)}}
        .hero-mesh-1{animation:heroMesh1 8s ease-in-out infinite}.hero-mesh-2{animation:heroMesh2 11s ease-in-out infinite}.hero-mesh-3{animation:heroMesh3 9s ease-in-out infinite}
        @keyframes heroStar{0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.4)}}
        .hero-star{animation:heroStar ease-in-out infinite;animation-duration:calc(2s + var(--i,0)*0.7s)}
        @keyframes xpFill{from{width:0%} to{width:72%}}
        .xp-bar-fill{animation:xpFill 1.4s cubic-bezier(0.22,1,0.36,1) 0.8s both}
        @keyframes xpToast{0%{opacity:0;transform:translateX(50px) scale(0.9)} 15%{opacity:1;transform:translateX(0) scale(1.05)} 80%{opacity:1;transform:translateX(0) scale(1)} 100%{opacity:0;transform:translateX(20px) scale(0.95)}}
        .xp-toast{animation:xpToast 2.8s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes barFill{from{width:0}}
        .bar-fill{animation:barFill 0.8s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes monthBarIn{from{height:0!important;opacity:0}}
        .month-bar{animation:monthBarIn 0.7s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes masteryBarIn{from{width:0!important}}
        .mastery-bar{animation:masteryBarIn 1.2s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes heatmapIn{from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)}}
        .heatmap-cell{animation:heatmapIn 0.3s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes skillRowIn{from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)}}
        .skill-row{animation:skillRowIn 0.4s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes activityIn{from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)}}
        .activity-item{animation:activityIn 0.4s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes masteryCardIn{from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)}}
        .skill-mastery-card{animation:masteryCardIn 0.5s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes qaCardIn{from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)}}
        .qa-card{animation:qaCardIn 0.5s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes codeRise{0%{transform:translateY(110vh) rotate(-5deg);opacity:0} 8%{opacity:1} 92%{opacity:0.6} 100%{transform:translateY(-8vh) rotate(8deg);opacity:0}}
        .code-token{animation:codeRise linear infinite;position:absolute}
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:0.8;transform:scale(1.3)}}
        .sparkle{animation:twinkle ease-in-out infinite}
        @keyframes auroraBlob1{0%,100%{transform:translate(0,0) scale(1) rotate(0deg);border-radius:60% 40% 55% 45%/45% 55% 40% 60%} 25%{transform:translate(40px,-30px) scale(1.08) rotate(8deg);border-radius:45% 55% 40% 60%/60% 40% 55% 45%} 50%{transform:translate(-20px,50px) scale(0.95) rotate(-5deg);border-radius:55% 45% 65% 35%/35% 65% 45% 55%} 75%{transform:translate(60px,20px) scale(1.05) rotate(12deg);border-radius:40% 60% 50% 50%/55% 45% 60% 40%}}
        @keyframes auroraBlob2{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 33%{transform:translate(-50px,40px) scale(1.1) rotate(-10deg)} 66%{transform:translate(30px,-60px) scale(0.92) rotate(15deg)}}
        @keyframes auroraBlob3{0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,-30px) scale(1.07)}}
        .aurora-blob-1{animation:auroraBlob1 18s ease-in-out infinite}.aurora-blob-2{animation:auroraBlob2 24s ease-in-out infinite}.aurora-blob-3{animation:auroraBlob3 30s ease-in-out infinite}
        @keyframes plasmaBlob1{0%,100%{transform:translate(0,0) rotate(0deg) scale(1)} 20%{transform:translate(-30px,40px) rotate(25deg) scale(1.06)} 40%{transform:translate(50px,-20px) rotate(-15deg) scale(0.96)} 60%{transform:translate(-20px,60px) rotate(35deg) scale(1.04)} 80%{transform:translate(40px,10px) rotate(-8deg) scale(0.98)}}
        @keyframes plasmaBlob2{0%,100%{transform:translate(0,0) rotate(0deg) scale(1)} 30%{transform:translate(40px,-50px) rotate(-20deg) scale(1.08)} 60%{transform:translate(-60px,30px) rotate(30deg) scale(0.94)}}
        .plasma-blob-tr{animation:plasmaBlob1 22s ease-in-out infinite}.plasma-blob-bl{animation:plasmaBlob2 28s ease-in-out infinite}
        @keyframes crystalOrb{0%,100%{transform:translate(0,0) scale(1);opacity:0.7} 33%{transform:translate(-30px,-20px) scale(1.1);opacity:0.9} 66%{transform:translate(20px,30px) scale(0.9);opacity:0.6}}
        .crystal-orb{animation:crystalOrb 16s ease-in-out infinite}
        @keyframes lightRay1{0%,100%{opacity:0;transform:rotate(18deg) translateY(-10%) scaleY(0.8)} 30%{opacity:1;transform:rotate(18deg) translateY(-10%) scaleY(1)} 70%{opacity:0.7;transform:rotate(22deg) translateY(-5%) scaleY(1.1)}}
        @keyframes lightRay2{0%,100%{opacity:0;transform:rotate(-12deg) scaleY(0.7)} 40%{opacity:0.8;transform:rotate(-12deg) scaleY(1)} 80%{opacity:0.5;transform:rotate(-8deg) scaleY(1.15)}}
        @keyframes lightRay3{0%,100%{opacity:0} 50%{opacity:0.9}}
        .light-ray-1{animation:lightRay1 10s ease-in-out infinite;animation-delay:1s}.light-ray-2{animation:lightRay2 13s ease-in-out infinite;animation-delay:3s}.light-ray-3{animation:lightRay3 9s ease-in-out infinite;animation-delay:5s}
        @keyframes circuitPath{from{stroke-dashoffset:600} to{stroke-dashoffset:0}}
        @keyframes circuitDot{0%,100%{r:3;opacity:0.5} 50%{r:5;opacity:1;filter:drop-shadow(0 0 4px rgba(56,189,248,0.8))}}
        .circuit-path-1{stroke-dasharray:600;animation:circuitPath 12s linear infinite}.circuit-path-2{stroke-dasharray:500;animation:circuitPath 15s linear infinite;animation-delay:4s}.circuit-path-3{stroke-dasharray:450;animation:circuitPath 18s linear infinite;animation-delay:8s}
        .circuit-dot-1{animation:circuitDot 3s ease-in-out infinite}.circuit-dot-2{animation:circuitDot 3s ease-in-out infinite;animation-delay:1s}.circuit-dot-3{animation:circuitDot 3s ease-in-out infinite;animation-delay:2s}.circuit-dot-4{animation:circuitDot 3s ease-in-out infinite;animation-delay:0.5s}
        @keyframes stripeShimmer{0%{background-position:0% 50%} 100%{background-position:200% 50%}}
        .animate-stripe{background:linear-gradient(90deg,#38bdf8,#06b6d4,#14b8a6,#38bdf8);background-size:200% 100%;animation:stripeShimmer 4s linear infinite}
        @keyframes modalIn{from{opacity:0;transform:scale(0.92) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)}}
        .modal-enter{animation:modalIn 0.35s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)}}
        .drop-anim{animation:dropIn 0.22s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes btnShimmer{0%{background-position:-200% center} 100%{background-position:200% center}}
        .btn-shimmer::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,rgba(255,255,255,0.3) 50%,transparent 70%);background-size:200% 100%;animation:btnShimmer 2.5s ease-in-out infinite;border-radius:inherit}
        .cursor-spotlight{width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,0.12) 0%,transparent 70%);pointer-events:none;transition:opacity 0.3s}
        @keyframes scanLine{0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:0.5} 100%{top:100%;opacity:0}}
        .scan-line{animation:scanLine 12s linear infinite}
        @keyframes loadBar{from{width:0} to{width:100%}}
        .sky-toggle-active{background:linear-gradient(135deg,#38bdf8,#06b6d4);animation:togglePulse 3s ease-in-out infinite}
        @keyframes togglePulse{0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0.4),0 4px 14px rgba(56,189,248,0.3)} 50%{box-shadow:0 0 0 6px rgba(56,189,248,0),0 4px 20px rgba(56,189,248,0.5)}}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#bae6fd;border-radius:99px}::-webkit-scrollbar-thumb:hover{background:#7dd3fc}
      `}</style>
    </div>
  );
};

export default Dashboard;