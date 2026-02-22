import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle,
  CheckCircle2, Shield, Code, Github, Chrome,
  ArrowRight, Sparkles, Zap, Trophy, Check, X
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   SCROLL ARCHITECTURE — why this works even if the host app
   has overflow:hidden / height:100vh on html, body, or #root

   ┌── shell (position:fixed, inset:0, display:flex) ──────────┐
   │  This takes over the entire viewport as its own layer.    │
   │  Nothing outside it can clip its children.                │
   │                                                           │
   │  ┌─ aside (flex-shrink:0) ─┐  ┌─ main ─────────────────┐ │
   │  │  sticky branding panel  │  │  flex:1                 │ │
   │  │  overflow-y:auto        │  │  minHeight:0  ← KEY     │ │
   │  │                         │  │  overflow-y:auto        │ │
   │  │  min-height:0  ← KEY    │  │                         │ │
   │  └─────────────────────────┘  │  scrollable form content│ │
   │                               └─────────────────────────┘ │
   └───────────────────────────────────────────────────────────┘

   The KEY fix: in a flex container, children default to
   min-height:auto which lets them grow taller than the container.
   Setting min-height:0 constrains them to the container height
   so overflow-y:auto actually kicks in and scrolling works.
───────────────────────────────────────────────────────────── */

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass]     = useState(false);
  const [showConf, setShowConf]     = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState('');

  /* Lock html/body so the fixed shell is the only scroll context */
  useEffect(() => {
    const s = document.documentElement.style;
    const b = document.body.style;
    const prev = { sOv: s.overflow, sH: s.height, bOv: b.overflow, bH: b.height };
    s.overflow = 'hidden'; s.height = '100%';
    b.overflow = 'hidden'; b.height = '100%';
    return () => {
      s.overflow = prev.sOv; s.height = prev.sH;
      b.overflow = prev.bOv; b.height = prev.bH;
    };
  }, []);

  const change = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setError(''); setSuccess('');
  };

  const reqs = [
    { label: 'At least 8 characters',  ok: formData.password.length >= 8 },
    { label: 'One uppercase letter',    ok: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter',    ok: /[a-z]/.test(formData.password) },
    { label: 'One number',              ok: /\d/.test(formData.password) },
    { label: 'One special character',   ok: /[^a-zA-Z0-9]/.test(formData.password) },
  ];
  const metCount = reqs.filter(r => r.ok).length;
  const strength = metCount === 0 ? null
    : metCount <= 2 ? { label:'Weak',   bar:'#ef4444', pct:metCount/5 }
    : metCount === 3 ? { label:'Fair',   bar:'#eab308', pct:3/5 }
    : metCount === 4 ? { label:'Good',   bar:'#3b82f6', pct:4/5 }
    : { label:'Strong', bar:'#10b981', pct:1 };

  const initUser = uid => {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const mos  = ['Jan','Feb','Mar','Apr','May','Jun'];
    localStorage.setItem(`userStats_${uid}`, JSON.stringify({
      totalSolved:0,totalPoints:0,currentStreak:0,rank:0,
      weeklyProgress:0,accuracy:0,lastWeekSolved:0,thisWeekSolved:0,lastActivityDate:null }));
    localStorage.setItem(`weeklyData_${uid}`,     JSON.stringify(days.map(d=>({day:d,problems:0,points:0,percentage:0,change:'+0%'}))));
    localStorage.setItem(`monthlyProgress_${uid}`,JSON.stringify(mos.map(m=>({month:m,solved:0,percentage:0,growth:0}))));
    localStorage.setItem(`skillDistribution_${uid}`,JSON.stringify([
      {name:'Arrays',value:0,color:'bg-cyan-500',problems:0,avgTime:'0 min',accuracy:0},
      {name:'DP',value:0,color:'bg-violet-500',problems:0,avgTime:'0 min',accuracy:0},
      {name:'Trees',value:0,color:'bg-emerald-500',problems:0,avgTime:'0 min',accuracy:0},
      {name:'Graphs',value:0,color:'bg-amber-500',problems:0,avgTime:'0 min',accuracy:0},
      {name:'Others',value:0,color:'bg-pink-500',problems:0,avgTime:'0 min',accuracy:0},
    ]));
    localStorage.setItem(`recentActivity_${uid}`, JSON.stringify([]));
    localStorage.setItem(`skillProgress_${uid}`, JSON.stringify([
      {name:'Arrays',progress:0,problems:0,color:'from-cyan-400 to-blue-500',trend:'+0%'},
      {name:'Dynamic Programming',progress:0,problems:0,color:'from-violet-400 to-purple-500',trend:'+0%'},
      {name:'Trees & Graphs',progress:0,problems:0,color:'from-emerald-400 to-green-500',trend:'+0%'},
    ]));
    localStorage.setItem(`userPreferences_${uid}`, JSON.stringify({darkMode:false,notifications:0}));
  };

  const submit = async e => {
    e.preventDefault();
    const fail = msg => { setError(msg); setLoading(false); };
    setError(''); setSuccess(''); setLoading(true);

    const { username, email, password, confirmPassword } = formData;
    if (!username||!email||!password||!confirmPassword) return fail('Please fill in all fields');
    if (username.length < 3)                             return fail('Username must be at least 3 characters');
    if (!/^[a-zA-Z0-9_]+$/.test(username))              return fail('Username: letters, numbers, underscores only');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))      return fail('Please enter a valid email address');
    if (metCount < 3)                                    return fail('Password too weak — aim for at least "Fair"');
    if (password !== confirmPassword)                    return fail('Passwords do not match');

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email.toLowerCase()===email.toLowerCase() || u.username.toLowerCase()===username.toLowerCase()))
        return fail('Email or username already exists');

      const user = { id:Date.now().toString(), username:username.trim(),
        email:email.trim().toLowerCase(), password, role:'user',
        createdAt:new Date().toISOString(), avatar:username.charAt(0).toUpperCase() };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      initUser(user.id);
      // Do NOT set token/user here — let the user log in manually
      // so route guards don't auto-redirect to dashboard
      setSuccess('✅ Account created! Please sign in to continue…');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } catch { fail('Registration failed. Please try again.'); }
  };

  /* ── shared styles ── */
  const inp = (name) => ({
    width:'100%', boxSizing:'border-box',
    paddingLeft:42, paddingRight: name==='email' ? 16 : 46,
    paddingTop:12, paddingBottom:12,
    background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.2)',
    borderRadius:14, color:'#fff', fontSize:'0.875rem', outline:'none',
    transition:'border-color .2s, box-shadow .2s',
  });
  const focusStyle  = { borderColor:'#22d3ee', boxShadow:'0 0 0 3px rgba(34,211,238,.2)' };
  const blurStyle   = { borderColor:'rgba(255,255,255,.2)', boxShadow:'none' };
  const iconStyle   = (name) => ({
    position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
    width:16, height:16, pointerEvents:'none',
    color: focused===name ? '#22d3ee' : '#a78bfa', transition:'color .2s',
  });
  const eyeBtn = { position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
    background:'none', border:'none', cursor:'pointer', padding:0,
    color:'#a78bfa', display:'flex', alignItems:'center' };

  return (
    <>
      <style>{`
        @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-44px) scale(1.1)}66%{transform:translate(-18px,18px) scale(.9)}}
        @keyframes floatIcon{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
        @keyframes shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .r-blob{animation:blob 7s ease-in-out infinite}
        .r-bd1{animation-delay:2s}.r-bd2{animation-delay:4s}
        .r-float{animation:floatIcon 3s ease-in-out infinite}
        .r-fade{animation:fadeUp .45s ease-out both}
        .r-d1{animation-delay:.06s}.r-d2{animation-delay:.12s}.r-d3{animation-delay:.18s}
        .r-d4{animation-delay:.24s}.r-d5{animation-delay:.30s}.r-d6{animation-delay:.36s}
        .r-shake{animation:shake .4s ease-out}
        .r-shimmer{background:linear-gradient(90deg,#06b6d4,#7c3aed,#06b6d4);background-size:200% 100%;animation:shimmer 2.4s linear infinite}
        .r-spin{animation:spin .75s linear infinite}
        /* scrollbar */
        .r-scroll::-webkit-scrollbar{width:5px}
        .r-scroll::-webkit-scrollbar-track{background:transparent}
        .r-scroll::-webkit-scrollbar-thumb{background:rgba(139,92,246,.45);border-radius:99px}
        .r-scroll::-webkit-scrollbar-thumb:hover{background:rgba(139,92,246,.75)}
        /* placeholder */
        .r-inp::placeholder{color:#a78bfa;opacity:1}
      `}</style>

      {/* ══ FIXED SHELL — owns the full viewport ══ */}
      <div style={{
        position:'fixed', inset:0, zIndex:100,
        display:'flex', flexDirection:'row',
        background:'linear-gradient(135deg,#0f172a 0%,#3b0764 55%,#0f172a 100%)',
        overflow:'hidden',
      }}>

        {/* decorative layer */}
        <div aria-hidden style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
          <div className="r-blob"     style={{position:'absolute',top:'-10rem',left:'-10rem',width:'22rem',height:'22rem',borderRadius:'50%',background:'rgba(139,92,246,.22)',filter:'blur(72px)',mixBlendMode:'screen'}}/>
          <div className="r-blob r-bd1" style={{position:'absolute',top:'-8rem',right:'-8rem',width:'22rem',height:'22rem',borderRadius:'50%',background:'rgba(6,182,212,.2)',filter:'blur(72px)',mixBlendMode:'screen'}}/>
          <div className="r-blob r-bd2" style={{position:'absolute',bottom:'-8rem',left:'42%',width:'22rem',height:'22rem',borderRadius:'50%',background:'rgba(236,72,153,.17)',filter:'blur(72px)',mixBlendMode:'screen'}}/>
          <div style={{position:'absolute',inset:0,opacity:.18,backgroundImage:'radial-gradient(circle at 2px 2px,rgba(139,92,246,.9) 1px,transparent 0)',backgroundSize:'36px 36px'}}/>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 28%,rgba(2,0,20,.7) 100%)'}}/>
        </div>

        {/* ══ LEFT PANEL — hidden on mobile, min-height:0 is the key ══ */}
        <aside className="r-scroll" style={{
          display:'none',   /* overridden by the ref below for lg+ */
          flexDirection:'column', justifyContent:'space-between',
          width:'41%', minWidth:340, flexShrink:0,
          minHeight:0,        /* ← KEY: flex child can shrink to enable scroll */
          overflowY:'auto',
          padding:'2.8rem 3rem',
          position:'relative', zIndex:1,
        }}
          ref={el => {
            if (!el) return;
            const mq = window.matchMedia('(min-width:1024px)');
            const apply = () => { el.style.display = mq.matches ? 'flex' : 'none'; };
            apply(); mq.addEventListener('change', apply);
          }}
        >
          <div>
            {/* Logo */}
            <div className="r-fade" style={{display:'flex',alignItems:'center',gap:12,marginBottom:'3rem'}}>
              <div style={{background:'linear-gradient(135deg,#22d3ee,#7c3aed)',width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(124,58,237,.4)'}}>
                <Code style={{width:28,height:28,color:'#fff'}}/>
              </div>
              <div>
                <h1 style={{color:'#fff',fontWeight:800,fontSize:'1.4rem',margin:0}}>CodeMaster</h1>
                <p style={{color:'#c4b5fd',fontSize:'0.72rem',margin:0}}>Elite Problem Solving</p>
              </div>
            </div>

            {/* Headline */}
            <div className="r-fade r-d2" style={{marginBottom:'2.2rem'}}>
              <h2 style={{color:'#fff',fontWeight:800,fontSize:'clamp(1.55rem,2.4vw,2.1rem)',lineHeight:1.25,margin:'0 0 10px'}}>
                Master Algorithms.<br/>
                <span style={{background:'linear-gradient(90deg,#22d3ee,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Ace Interviews.
                </span>
              </h2>
              <p style={{color:'#ddd6fe',fontSize:'0.88rem',lineHeight:1.65,margin:0}}>
                Join 100,000+ developers preparing for their dream tech jobs.
              </p>
            </div>

            {/* Features */}
            <div className="r-fade r-d3" style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                {icon:Shield,   title:'Personalized Learning',   desc:'AI-powered recommendations tailored to your skill level'},
                {icon:Trophy,   title:'Real Interview Questions', desc:'Practice with problems from Google, Meta, Amazon & more'},
                {icon:Zap,      title:'Track Your Progress',      desc:'Detailed analytics and performance insights'},
                {icon:Sparkles, title:'Premium Features',         desc:'Mock interviews, resume builder, and career guidance'},
              ].map(({icon:Ic,title,desc},i)=>(
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:14,padding:'13px 15px',borderRadius:16,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',cursor:'default',transition:'background .25s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.06)'}>
                  <div style={{background:'linear-gradient(135deg,#22d3ee,#7c3aed)',width:38,height:38,borderRadius:10,display:'flex',flexShrink:0,alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(124,58,237,.3)'}}>
                    <Ic style={{width:19,height:19,color:'#fff'}}/>
                  </div>
                  <div>
                    <p style={{color:'#fff',fontWeight:600,fontSize:'0.82rem',margin:'0 0 2px'}}>{title}</p>
                    <p style={{color:'#c4b5fd',fontSize:'0.73rem',lineHeight:1.5,margin:0}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="r-fade r-d5" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,paddingTop:24,marginTop:28,borderTop:'1px solid rgba(255,255,255,.12)'}}>
            {[['100K+','Active Users'],['5,000+','Problems'],['95%','Success Rate']].map(([v,l])=>(
              <div key={l}>
                <div style={{color:'#fff',fontWeight:800,fontSize:'1.5rem',marginBottom:2}}>{v}</div>
                <div style={{color:'#c4b5fd',fontSize:'0.72rem'}}>{l}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ══ RIGHT PANEL — the scrollable form area ══
            flex:1        → takes remaining width
            minHeight:0   → KEY: allows flex child to shrink below content size
            overflowY:auto → scroll kicks in because height is now constrained
        ══ */}
        <main className="r-scroll" style={{
          flex:1,
          minHeight:0,     /* ← THE FIX */
          overflowY:'auto',
          overflowX:'hidden',
          position:'relative', zIndex:1,
          display:'flex', flexDirection:'column',
          alignItems:'center',
          padding:'2.5rem 1rem 3rem',
        }}>
          <div style={{width:'100%', maxWidth:440}}>

            {/* Mobile logo */}
            <div className="r-fade" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:28}}
              ref={el=>{
                if(!el) return;
                const mq = window.matchMedia('(min-width:1024px)');
                const a = () => { el.style.display = mq.matches ? 'none' : 'flex'; };
                a(); mq.addEventListener('change',a);
              }}
            >
              <div style={{background:'linear-gradient(135deg,#22d3ee,#7c3aed)',width:44,height:44,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Code style={{width:24,height:24,color:'#fff'}}/>
              </div>
              <div>
                <h1 style={{color:'#fff',fontWeight:800,fontSize:'1.2rem',margin:0}}>CodeMaster</h1>
                <p style={{color:'#c4b5fd',fontSize:'0.7rem',margin:0}}>Elite Problem Solving</p>
              </div>
            </div>

            {/* ── CARD ── */}
            <div className="r-fade r-d1" style={{
              background:'rgba(255,255,255,.08)',
              backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
              borderRadius:28, border:'1px solid rgba(255,255,255,.14)',
              boxShadow:'0 32px 64px rgba(0,0,0,.5)',
              padding:'2rem 1.75rem',
            }}>

              {/* Card header */}
              <div style={{textAlign:'center',marginBottom:24}}>
                <div className="r-float" style={{background:'linear-gradient(135deg,#06b6d4,#7c3aed)',width:64,height:64,borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 12px 32px rgba(124,58,237,.4)'}}>
                  <UserPlus style={{width:32,height:32,color:'#fff'}}/>
                </div>
                <h2 style={{color:'#fff',fontWeight:800,fontSize:'1.65rem',margin:'0 0 4px'}}>Create Account</h2>
                <p style={{color:'#c4b5fd',fontSize:'0.85rem',margin:0}}>Start your coding journey today</p>
              </div>

              {/* Alerts */}
              {success && (
                <div className="r-fade" style={{marginBottom:14,padding:'11px 13px',background:'rgba(16,185,129,.18)',border:'1px solid rgba(16,185,129,.38)',borderRadius:13,display:'flex',alignItems:'flex-start',gap:9}}>
                  <CheckCircle2 style={{width:15,height:15,color:'#34d399',flexShrink:0,marginTop:1}}/>
                  <p style={{color:'#6ee7b7',fontSize:'0.76rem',fontWeight:600,margin:0}}>{success}</p>
                </div>
              )}
              {error && (
                <div key={error} className="r-shake" style={{marginBottom:14,padding:'11px 13px',background:'rgba(239,68,68,.18)',border:'1px solid rgba(239,68,68,.35)',borderRadius:13,display:'flex',alignItems:'flex-start',gap:9}}>
                  <AlertCircle style={{width:15,height:15,color:'#f87171',flexShrink:0,marginTop:1}}/>
                  <p style={{color:'#fca5a5',fontSize:'0.76rem',margin:0}}>{error}</p>
                </div>
              )}

              {/* ── FORM ── */}
              <form onSubmit={submit} noValidate style={{display:'flex',flexDirection:'column',gap:14}}>

                {/* Username */}
                <div className="r-fade r-d2">
                  <label htmlFor="reg-username" style={{display:'block',color:'#fff',fontWeight:600,fontSize:'0.74rem',marginBottom:6,letterSpacing:'0.05em'}}>USERNAME</label>
                  <div style={{position:'relative'}}>
                    <User style={iconStyle('username')}/>
                    <input id="reg-username" name="username" type="text" className="r-inp"
                      value={formData.username} onChange={change}
                      onFocus={()=>setFocused('username')} onBlur={()=>setFocused('')}
                      placeholder="Choose a unique username" autoComplete="username" required
                      style={inp('username')}
                      onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                      onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                    />
                    {formData.username.length>=3 && <CheckCircle2 style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'#34d399',pointerEvents:'none'}}/>}
                  </div>
                  {formData.username.length>0 && formData.username.length<3 && (
                    <p style={{margin:'5px 0 0',fontSize:'0.71rem',color:'#fca5a5',display:'flex',alignItems:'center',gap:4}}><X style={{width:11,height:11}}/>Must be at least 3 characters</p>
                  )}
                </div>

                {/* Email */}
                <div className="r-fade r-d2">
                  <label htmlFor="reg-email" style={{display:'block',color:'#fff',fontWeight:600,fontSize:'0.74rem',marginBottom:6,letterSpacing:'0.05em'}}>EMAIL ADDRESS</label>
                  <div style={{position:'relative'}}>
                    <Mail style={iconStyle('email')}/>
                    <input id="reg-email" name="email" type="email" className="r-inp"
                      value={formData.email} onChange={change}
                      onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')}
                      placeholder="you@example.com" autoComplete="email" required
                      style={inp('email')}
                      onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                      onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="r-fade r-d3">
                  <label htmlFor="reg-password" style={{display:'block',color:'#fff',fontWeight:600,fontSize:'0.74rem',marginBottom:6,letterSpacing:'0.05em'}}>PASSWORD</label>
                  <div style={{position:'relative'}}>
                    <Lock style={iconStyle('password')}/>
                    <input id="reg-password" name="password" type={showPass?'text':'password'} className="r-inp"
                      value={formData.password} onChange={change}
                      onFocus={()=>setFocused('password')} onBlur={()=>setFocused('')}
                      placeholder="Create a strong password" autoComplete="new-password" required
                      style={inp('password')}
                      onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                      onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                    />
                    <button type="button" style={eyeBtn} onClick={()=>setShowPass(!showPass)}>
                      {showPass ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {formData.password && strength && (
                    <div style={{marginTop:9}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:7}}>
                        <div style={{flex:1,height:5,background:'rgba(255,255,255,.1)',borderRadius:99,overflow:'hidden'}}>
                          <div style={{height:'100%',borderRadius:99,background:strength.bar,width:`${strength.pct*100}%`,transition:'width .4s ease'}}/>
                        </div>
                        <span style={{color:'#fff',fontWeight:700,fontSize:'0.7rem',minWidth:38,textAlign:'right'}}>{strength.label}</span>
                      </div>
                      <div style={{display:'grid',gap:3}}>
                        {reqs.map((r,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:7,fontSize:'0.71rem'}}>
                            {r.ok ? <Check style={{width:11,height:11,color:'#34d399',flexShrink:0}}/> : <X style={{width:11,height:11,color:'#a78bfa',flexShrink:0}}/>}
                            <span style={{color:r.ok?'#6ee7b7':'#c4b5fd'}}>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="r-fade r-d4">
                  <label htmlFor="reg-confirm" style={{display:'block',color:'#fff',fontWeight:600,fontSize:'0.74rem',marginBottom:6,letterSpacing:'0.05em'}}>CONFIRM PASSWORD</label>
                  <div style={{position:'relative'}}>
                    <Lock style={iconStyle('confirmPassword')}/>
                    <input id="reg-confirm" name="confirmPassword" type={showConf?'text':'password'} className="r-inp"
                      value={formData.confirmPassword} onChange={change}
                      onFocus={()=>setFocused('confirmPassword')} onBlur={()=>setFocused('')}
                      placeholder="Confirm your password" autoComplete="new-password" required
                      style={{...inp('confirmPassword'), paddingRight: formData.confirmPassword && formData.password===formData.confirmPassword ? 72 : 46}}
                      onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                      onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                    />
                    {formData.confirmPassword && formData.password===formData.confirmPassword && (
                      <CheckCircle2 style={{position:'absolute',right:42,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'#34d399',pointerEvents:'none'}}/>
                    )}
                    <button type="button" style={eyeBtn} onClick={()=>setShowConf(!showConf)}>
                      {showConf ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password!==formData.confirmPassword && (
                    <p style={{margin:'5px 0 0',fontSize:'0.71rem',color:'#fca5a5',display:'flex',alignItems:'center',gap:4}}><X style={{width:11,height:11}}/>Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <div className="r-fade r-d5" style={{display:'flex',alignItems:'flex-start',gap:11,paddingTop:2}}>
                  <input id="reg-terms" type="checkbox" required style={{marginTop:2,width:15,height:15,flexShrink:0,cursor:'pointer',accentColor:'#22d3ee'}}/>
                  <label htmlFor="reg-terms" style={{fontSize:'0.77rem',color:'#c4b5fd',cursor:'pointer',lineHeight:1.6}}>
                    I agree to the{' '}
                    <a href="/terms"   style={{color:'#22d3ee',fontWeight:600,textDecoration:'none'}}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" style={{color:'#22d3ee',fontWeight:600,textDecoration:'none'}}>Privacy Policy</a>
                  </label>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className={loading ? '' : 'r-shimmer'}
                  style={{
                    width:'100%', padding:'13px', borderRadius:14, border:'none',
                    color:'#fff', fontWeight:700, fontSize:'0.9rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:9,
                    boxShadow:'0 8px 24px rgba(6,182,212,.28)',
                    opacity: loading ? .6 : 1,
                    background: loading ? 'linear-gradient(90deg,#0891b2,#6d28d9)' : undefined,
                    transition:'opacity .2s',
                    marginTop:4,
                  }}>
                  {loading ? (
                    <><div className="r-spin" style={{width:15,height:15,border:'2px solid rgba(255,255,255,.35)',borderTopColor:'#fff',borderRadius:'50%'}}/>Creating account…</>
                  ) : (
                    <>Create Account <ArrowRight style={{width:16,height:16}}/></>
                  )}
                </button>
              </form>

              {/* Sign in link */}
              <p className="r-fade r-d6" style={{textAlign:'center',marginTop:22,color:'#c4b5fd',fontSize:'0.86rem'}}>
                Already have an account?{' '}
                <Link to="/login" style={{color:'#22d3ee',fontWeight:700,textDecoration:'none'}}>Sign In</Link>
              </p>
            </div>
            {/* /card */}

            {/* Security badge */}
            <div className="r-fade r-d6" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,color:'#a78bfa',fontSize:'0.74rem',marginTop:18,paddingBottom:8}}>
              <Shield style={{width:13,height:13}}/> Your data is secure and encrypted
            </div>

          </div>
        </main>
        {/* /right panel */}

      </div>
      {/* /shell */}
    </>
  );
};

export default Register;