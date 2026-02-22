import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LogIn, Mail, Lock, Eye, EyeOff, AlertCircle,
  CheckCircle2, Shield, Code, ArrowRight,
  Zap, Trophy, Sparkles, User, RefreshCw
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData]       = useState({ emailOrUsername: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [focused, setFocused]         = useState('');
  const [shake, setShake]             = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgot, setShowForgot]   = useState(false);
  const [resetEmail, setResetEmail]   = useState('');
  const [resetSent, setResetSent]     = useState(false);

  /* Lock html/body — same pattern as Register */
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

  /* Pre-fill if rememberMe was saved */
  useEffect(() => {
    const saved = localStorage.getItem('rememberedUser');
    if (saved) {
      setFormData(p => ({ ...p, emailOrUsername: saved }));
      setRememberMe(true);
    }
  }, []);

  const change = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError(''); setIsLoading(true);

    if (!formData.emailOrUsername || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false); triggerShake(); return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      setError('No accounts found. Please register first.');
      setIsLoading(false); triggerShake(); return;
    }

    const input = formData.emailOrUsername.trim().toLowerCase();
    const user  = users.find(u =>
      (u.email?.toLowerCase() === input || u.username?.toLowerCase() === input) &&
      u.password === formData.password
    );

    if (!user) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      setError(attempts >= 3
        ? 'Too many failed attempts. Please check your credentials or reset your password.'
        : 'Invalid email/username or password.'
      );
      setIsLoading(false); triggerShake(); return;
    }

    /* Init missing user data if needed */
    if (!localStorage.getItem(`userStats_${user.id}`)) {
      localStorage.setItem(`userStats_${user.id}`, JSON.stringify({
        totalSolved:0,totalPoints:0,currentStreak:0,rank:0,
        weeklyProgress:0,accuracy:0,lastWeekSolved:0,thisWeekSolved:0,lastActivityDate:null
      }));
    }

    if (rememberMe) localStorage.setItem('rememberedUser', formData.emailOrUsername.trim());
    else            localStorage.removeItem('rememberedUser');

    localStorage.setItem('token', btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() })));
    localStorage.setItem('user', JSON.stringify(user));

    setSuccess(`Welcome back, ${user.username}! Redirecting…`);
    setTimeout(() => { window.location.href = '/dashboard'; }, 1200);
  };

  const handleForgotPassword = e => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user  = users.find(u => u.email?.toLowerCase() === resetEmail.trim().toLowerCase());
    /* Always show "sent" to avoid email enumeration */
    setResetSent(true);
  };

  /* ── shared style helpers (same as Register) ── */
  const inp = name => ({
    width:'100%', boxSizing:'border-box',
    paddingLeft:42, paddingRight: name==='emailOrUsername' ? 16 : 46,
    paddingTop:12, paddingBottom:12,
    background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.2)',
    borderRadius:14, color:'#fff', fontSize:'0.875rem', outline:'none',
    transition:'border-color .2s, box-shadow .2s',
  });
  const focusStyle = { borderColor:'#22d3ee', boxShadow:'0 0 0 3px rgba(34,211,238,.2)' };
  const blurStyle  = { borderColor:'rgba(255,255,255,.2)', boxShadow:'none' };
  const iconStyle  = name => ({
    position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
    width:16, height:16, pointerEvents:'none',
    color: focused===name ? '#22d3ee' : '#a78bfa', transition:'color .2s',
  });
  const eyeBtn = {
    position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
    background:'none', border:'none', cursor:'pointer', padding:0,
    color:'#a78bfa', display:'flex', alignItems:'center',
  };

  return (
    <>
      <style>{`
        @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-44px) scale(1.1)}66%{transform:translate(-18px,18px) scale(.9)}}
        @keyframes floatIcon{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
        @keyframes shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulseRing{0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(34,211,238,.4)}70%{transform:scale(1);box-shadow:0 0 0 10px rgba(34,211,238,0)}100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(34,211,238,0)}}
        .l-blob{animation:blob 7s ease-in-out infinite}
        .l-bd1{animation-delay:2s}.l-bd2{animation-delay:4s}
        .l-float{animation:floatIcon 3s ease-in-out infinite}
        .l-fade{animation:fadeUp .45s ease-out both}
        .l-d1{animation-delay:.06s}.l-d2{animation-delay:.12s}.l-d3{animation-delay:.18s}
        .l-d4{animation-delay:.24s}.l-d5{animation-delay:.30s}
        .l-shake{animation:shake .45s ease-out}
        .l-shimmer{background:linear-gradient(90deg,#06b6d4,#7c3aed,#06b6d4);background-size:200% 100%;animation:shimmer 2.4s linear infinite}
        .l-spin{animation:spin .75s linear infinite}
        .l-pulse{animation:pulseRing 2s infinite}
        .l-scroll::-webkit-scrollbar{width:5px}
        .l-scroll::-webkit-scrollbar-track{background:transparent}
        .l-scroll::-webkit-scrollbar-thumb{background:rgba(139,92,246,.45);border-radius:99px}
        .l-scroll::-webkit-scrollbar-thumb:hover{background:rgba(139,92,246,.75)}
        .l-inp::placeholder{color:#a78bfa;opacity:1}
        .l-check:checked{accent-color:#22d3ee}
        .feat-card:hover{background:rgba(255,255,255,.1)!important;border-color:rgba(255,255,255,.2)!important}
        .social-stat:hover .stat-val{color:#22d3ee}
      `}</style>

      {/* ══ FIXED SHELL ══ */}
      <div style={{
        position:'fixed', inset:0, zIndex:100,
        display:'flex', flexDirection:'row',
        background:'linear-gradient(135deg,#0f172a 0%,#3b0764 55%,#0f172a 100%)',
        overflow:'hidden',
      }}>

        {/* Decorative blobs */}
        <div aria-hidden style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
          <div className="l-blob"     style={{position:'absolute',top:'-10rem',left:'-10rem',width:'22rem',height:'22rem',borderRadius:'50%',background:'rgba(139,92,246,.22)',filter:'blur(72px)',mixBlendMode:'screen'}}/>
          <div className="l-blob l-bd1" style={{position:'absolute',top:'-8rem',right:'-8rem',width:'22rem',height:'22rem',borderRadius:'50%',background:'rgba(6,182,212,.2)',filter:'blur(72px)',mixBlendMode:'screen'}}/>
          <div className="l-blob l-bd2" style={{position:'absolute',bottom:'-8rem',left:'42%',width:'22rem',height:'22rem',borderRadius:'50%',background:'rgba(236,72,153,.17)',filter:'blur(72px)',mixBlendMode:'screen'}}/>
          <div style={{position:'absolute',inset:0,opacity:.18,backgroundImage:'radial-gradient(circle at 2px 2px,rgba(139,92,246,.9) 1px,transparent 0)',backgroundSize:'36px 36px'}}/>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center,transparent 28%,rgba(2,0,20,.7) 100%)'}}/>
        </div>

        {/* ══ LEFT PANEL ══ */}
        <aside className="l-scroll" style={{
          display:'none',
          flexDirection:'column', justifyContent:'space-between',
          width:'41%', minWidth:340, flexShrink:0,
          minHeight:0, overflowY:'auto',
          padding:'2.8rem 3rem',
          position:'relative', zIndex:1,
        }}
          ref={el=>{
            if(!el) return;
            const mq = window.matchMedia('(min-width:1024px)');
            const apply = ()=>{ el.style.display = mq.matches ? 'flex' : 'none'; };
            apply(); mq.addEventListener('change', apply);
          }}
        >
          <div>
            {/* Logo */}
            <div className="l-fade" style={{display:'flex',alignItems:'center',gap:12,marginBottom:'3rem'}}>
              <div style={{background:'linear-gradient(135deg,#22d3ee,#7c3aed)',width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(124,58,237,.4)'}}>
                <Code style={{width:28,height:28,color:'#fff'}}/>
              </div>
              <div>
                <h1 style={{color:'#fff',fontWeight:800,fontSize:'1.4rem',margin:0}}>CodeMaster</h1>
                <p style={{color:'#c4b5fd',fontSize:'0.72rem',margin:0}}>Elite Problem Solving</p>
              </div>
            </div>

            {/* Headline */}
            <div className="l-fade l-d2" style={{marginBottom:'2.2rem'}}>
              <h2 style={{color:'#fff',fontWeight:800,fontSize:'clamp(1.55rem,2.4vw,2.1rem)',lineHeight:1.25,margin:'0 0 10px'}}>
                Welcome Back,<br/>
                <span style={{background:'linear-gradient(90deg,#22d3ee,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Keep Grinding.
                </span>
              </h2>
              <p style={{color:'#ddd6fe',fontSize:'0.88rem',lineHeight:1.65,margin:0}}>
                Your progress is waiting. Sign in and pick up right where you left off.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="l-fade l-d3" style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                {icon:Trophy,   title:'Your Streak Continues',   desc:'Don\'t break your daily coding streak — log in to keep it alive'},
                {icon:Zap,      title:'Personalized Problems',    desc:'AI-curated challenges based on your skill gaps and goals'},
                {icon:Sparkles, title:'Contest Leaderboard',      desc:'See where you rank among 100,000+ active coders today'},
                {icon:Shield,   title:'Progress Never Lost',      desc:'All your submissions, notes, and stats are safely stored'},
              ].map(({icon:Ic,title,desc},i)=>(
                <div key={i} className="feat-card" style={{display:'flex',alignItems:'flex-start',gap:14,padding:'13px 15px',borderRadius:16,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',cursor:'default',transition:'all .25s'}}>
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
          <div className="l-fade l-d5" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,paddingTop:24,marginTop:28,borderTop:'1px solid rgba(255,255,255,.12)'}}>
            {[['100K+','Active Users'],['5,000+','Problems'],['95%','Success Rate']].map(([v,l])=>(
              <div key={l} className="social-stat" style={{cursor:'default',transition:'all .2s'}}>
                <div className="stat-val" style={{color:'#fff',fontWeight:800,fontSize:'1.5rem',marginBottom:2,transition:'color .2s'}}>{v}</div>
                <div style={{color:'#c4b5fd',fontSize:'0.72rem'}}>{l}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ══ RIGHT PANEL — scrollable ══ */}
        <main className="l-scroll" style={{
          flex:1, minHeight:0,
          overflowY:'auto', overflowX:'hidden',
          position:'relative', zIndex:1,
          display:'flex', flexDirection:'column', alignItems:'center',
          padding:'2.5rem 1rem 3rem',
        }}>
          <div style={{width:'100%', maxWidth:440}}>

            {/* Mobile logo */}
            <div className="l-fade" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:28}}
              ref={el=>{
                if(!el) return;
                const mq = window.matchMedia('(min-width:1024px)');
                const a = ()=>{ el.style.display = mq.matches ? 'none' : 'flex'; };
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
            <div className={`l-fade l-d1 ${shake ? 'l-shake' : ''}`} style={{
              background:'rgba(255,255,255,.08)',
              backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
              borderRadius:28, border:'1px solid rgba(255,255,255,.14)',
              boxShadow:'0 32px 64px rgba(0,0,0,.5)',
              padding:'2rem 1.75rem',
            }}>

              {!showForgot ? (
                <>
                  {/* Header */}
                  <div style={{textAlign:'center',marginBottom:24}}>
                    <div className="l-float l-pulse" style={{background:'linear-gradient(135deg,#06b6d4,#7c3aed)',width:64,height:64,borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 12px 32px rgba(124,58,237,.4)'}}>
                      <LogIn style={{width:30,height:30,color:'#fff'}}/>
                    </div>
                    <h2 style={{color:'#fff',fontWeight:800,fontSize:'1.65rem',margin:'0 0 4px'}}>Sign In</h2>
                    <p style={{color:'#c4b5fd',fontSize:'0.85rem',margin:0}}>Welcome back — let's continue</p>
                  </div>

                  {/* Alerts */}
                  {success && (
                    <div className="l-fade" style={{marginBottom:14,padding:'11px 13px',background:'rgba(16,185,129,.18)',border:'1px solid rgba(16,185,129,.38)',borderRadius:13,display:'flex',alignItems:'flex-start',gap:9}}>
                      <CheckCircle2 style={{width:15,height:15,color:'#34d399',flexShrink:0,marginTop:1}}/>
                      <p style={{color:'#6ee7b7',fontSize:'0.76rem',fontWeight:600,margin:0}}>{success}</p>
                    </div>
                  )}
                  {error && (
                    <div style={{marginBottom:14,padding:'11px 13px',background:'rgba(239,68,68,.18)',border:'1px solid rgba(239,68,68,.35)',borderRadius:13,display:'flex',alignItems:'flex-start',gap:9}}>
                      <AlertCircle style={{width:15,height:15,color:'#f87171',flexShrink:0,marginTop:1}}/>
                      <p style={{color:'#fca5a5',fontSize:'0.76rem',margin:0}}>{error}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:14}}>

                    {/* Email / Username */}
                    <div className="l-fade l-d2">
                      <label htmlFor="l-id" style={{display:'block',color:'#fff',fontWeight:600,fontSize:'0.74rem',marginBottom:6,letterSpacing:'0.05em'}}>EMAIL OR USERNAME</label>
                      <div style={{position:'relative'}}>
                        <User style={iconStyle('emailOrUsername')}/>
                        <input id="l-id" name="emailOrUsername" type="text" className="l-inp"
                          value={formData.emailOrUsername} onChange={change}
                          onFocus={()=>setFocused('emailOrUsername')} onBlur={()=>setFocused('')}
                          placeholder="Enter email or username"
                          autoComplete="username" required
                          style={inp('emailOrUsername')}
                          onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                          onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="l-fade l-d3">
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <label htmlFor="l-pw" style={{color:'#fff',fontWeight:600,fontSize:'0.74rem',letterSpacing:'0.05em'}}>PASSWORD</label>
                        <button type="button" onClick={()=>setShowForgot(true)}
                          style={{background:'none',border:'none',cursor:'pointer',color:'#22d3ee',fontSize:'0.72rem',fontWeight:600,padding:0,transition:'color .2s'}}
                          onMouseEnter={e=>e.target.style.color='#67e8f9'}
                          onMouseLeave={e=>e.target.style.color='#22d3ee'}>
                          Forgot password?
                        </button>
                      </div>
                      <div style={{position:'relative'}}>
                        <Lock style={iconStyle('password')}/>
                        <input id="l-pw" name="password" type={showPassword?'text':'password'} className="l-inp"
                          value={formData.password} onChange={change}
                          onFocus={()=>setFocused('password')} onBlur={()=>setFocused('')}
                          placeholder="Enter your password"
                          autoComplete="current-password" required
                          style={inp('password')}
                          onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                          onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                        />
                        <button type="button" style={eyeBtn} onClick={()=>setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                        </button>
                      </div>
                    </div>

                    {/* Remember me */}
                    <div className="l-fade l-d4" style={{display:'flex',alignItems:'center',gap:10}}>
                      <input id="l-remember" type="checkbox" className="l-check"
                        checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)}
                        style={{width:15,height:15,cursor:'pointer',flexShrink:0,accentColor:'#22d3ee'}}
                      />
                      <label htmlFor="l-remember" style={{color:'#c4b5fd',fontSize:'0.78rem',cursor:'pointer',userSelect:'none'}}>
                        Remember me on this device
                      </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={isLoading || !!success}
                      className={isLoading || success ? '' : 'l-shimmer'}
                      style={{
                        width:'100%', padding:'13px', borderRadius:14, border:'none',
                        color:'#fff', fontWeight:700, fontSize:'0.9rem',
                        cursor: (isLoading||success) ? 'not-allowed' : 'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center', gap:9,
                        boxShadow:'0 8px 24px rgba(6,182,212,.28)',
                        opacity: (isLoading||success) ? .7 : 1,
                        background: (isLoading||success) ? 'linear-gradient(90deg,#0891b2,#6d28d9)' : undefined,
                        transition:'opacity .2s', marginTop:4,
                      }}>
                      {isLoading ? (
                        <><div className="l-spin" style={{width:15,height:15,border:'2px solid rgba(255,255,255,.35)',borderTopColor:'#fff',borderRadius:'50%'}}/>Signing in…</>
                      ) : success ? (
                        <><CheckCircle2 style={{width:16,height:16}}/>Redirecting to dashboard…</>
                      ) : (
                        <>Sign In <ArrowRight style={{width:16,height:16}}/></>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div style={{position:'relative',margin:'20px 0 16px'}}>
                    <div style={{position:'absolute',top:'50%',left:0,right:0,borderTop:'1px solid rgba(255,255,255,.12)'}}/>
                    <div style={{position:'relative',display:'flex',justifyContent:'center'}}>
                      <span style={{padding:'0 14px',color:'#c4b5fd',fontSize:'0.72rem'}}>new here?</span>
                    </div>
                  </div>

                  {/* Register CTA */}
                  <Link to="/register" style={{
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    padding:'11px', borderRadius:14, textDecoration:'none',
                    background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.15)',
                    color:'#e0d7ff', fontWeight:600, fontSize:'0.86rem',
                    transition:'all .2s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.13)';e.currentTarget.style.borderColor='rgba(255,255,255,.25)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.borderColor='rgba(255,255,255,.15)';}}>
                    Create a free account →
                  </Link>
                </>
              ) : (
                /* ── FORGOT PASSWORD PANEL ── */
                <>
                  <div style={{textAlign:'center',marginBottom:22}}>
                    <div style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)',width:56,height:56,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',boxShadow:'0 10px 28px rgba(245,158,11,.35)'}}>
                      <RefreshCw style={{width:26,height:26,color:'#fff'}}/>
                    </div>
                    <h2 style={{color:'#fff',fontWeight:800,fontSize:'1.4rem',margin:'0 0 4px'}}>Reset Password</h2>
                    <p style={{color:'#c4b5fd',fontSize:'0.82rem',margin:0}}>Enter your email and we'll send a reset link</p>
                  </div>

                  {!resetSent ? (
                    <form onSubmit={handleForgotPassword} noValidate style={{display:'flex',flexDirection:'column',gap:14}}>
                      <div>
                        <label htmlFor="l-reset" style={{display:'block',color:'#fff',fontWeight:600,fontSize:'0.74rem',marginBottom:6,letterSpacing:'0.05em'}}>EMAIL ADDRESS</label>
                        <div style={{position:'relative'}}>
                          <Mail style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,pointerEvents:'none',color:'#a78bfa'}}/>
                          <input id="l-reset" type="email" className="l-inp"
                            value={resetEmail} onChange={e=>setResetEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            style={{...inp('emailOrUsername')}}
                            onFocusCapture={e=>Object.assign(e.target.style,focusStyle)}
                            onBlurCapture={e=>Object.assign(e.target.style,blurStyle)}
                          />
                        </div>
                      </div>
                      <button type="submit" style={{
                        width:'100%', padding:'13px', borderRadius:14, border:'none',
                        background:'linear-gradient(90deg,#f59e0b,#ef4444)',
                        color:'#fff', fontWeight:700, fontSize:'0.9rem', cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                        boxShadow:'0 8px 24px rgba(245,158,11,.3)',
                      }}>
                        Send Reset Link <ArrowRight style={{width:16,height:16}}/>
                      </button>
                      <button type="button" onClick={()=>{setShowForgot(false);setResetEmail('');setResetSent(false);}}
                        style={{background:'none',border:'none',cursor:'pointer',color:'#c4b5fd',fontSize:'0.8rem',padding:0,textAlign:'center',marginTop:4,transition:'color .2s'}}
                        onMouseEnter={e=>e.target.style.color='#fff'}
                        onMouseLeave={e=>e.target.style.color='#c4b5fd'}>
                        ← Back to Sign In
                      </button>
                    </form>
                  ) : (
                    <div style={{textAlign:'center'}}>
                      <div style={{width:56,height:56,background:'rgba(16,185,129,.2)',border:'2px solid rgba(16,185,129,.4)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
                        <CheckCircle2 style={{width:28,height:28,color:'#34d399'}}/>
                      </div>
                      <p style={{color:'#6ee7b7',fontWeight:700,fontSize:'0.95rem',margin:'0 0 6px'}}>Check your inbox!</p>
                      <p style={{color:'#c4b5fd',fontSize:'0.8rem',lineHeight:1.6,margin:'0 0 18px'}}>
                        If an account with <strong style={{color:'#fff'}}>{resetEmail}</strong> exists, a reset link has been sent.
                      </p>
                      <button type="button" onClick={()=>{setShowForgot(false);setResetEmail('');setResetSent(false);}}
                        style={{background:'none',border:'1px solid rgba(255,255,255,.2)',borderRadius:12,cursor:'pointer',color:'#c4b5fd',fontSize:'0.82rem',padding:'10px 20px',transition:'all .2s'}}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='#fff';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='#c4b5fd';}}>
                        ← Back to Sign In
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            {/* /card */}

            {/* Security badge */}
            <div className="l-fade l-d5" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,color:'#a78bfa',fontSize:'0.74rem',marginTop:18,paddingBottom:8}}>
              <Shield style={{width:13,height:13}}/> Secure encrypted connection
            </div>

          </div>
        </main>

      </div>
    </>
  );
};

export default Login;