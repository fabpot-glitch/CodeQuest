// src/pages/ContestRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, AlertCircle, Users,
  Calendar, Clock, Award, Shield, CreditCard,
  ChevronRight, Star, Plus, Trash2, Mail,
  Globe, Code, Trophy, Zap
} from 'lucide-react';

// ─── MOCK CONTEST DATA (mirrors ContestDetail) ────────────────────────────────
const contestsDB = {
  'code-challenge-2024': {
    id: 'code-challenge-2024',
    title: 'Code Challenge 2024',
    date: '2026-06-15',
    startTime: '10:00 AM',
    endTime: '6:00 PM',
    duration: '8 hours',
    registrationDeadline: '2026-06-14',
    registrationFee: 0,
    isFree: true,
    maxParticipants: 2000,
    currentParticipants: 1250,
    difficulty: 'Medium',
    category: 'Algorithm',
    allowsTeams: false,
    prizes: [
      { position: 1, amount: '$5,000', badge: '🥇' },
      { position: 2, amount: '$2,500', badge: '🥈' },
      { position: 3, amount: '$1,000', badge: '🥉' }
    ],
    languages: ['Python 3.9', 'Java 11', 'C++17', 'JavaScript ES6', 'Go 1.16'],
    requirements: [
      'Basic programming knowledge required',
      'Familiarity with data structures and algorithms',
      'Stable internet connection',
      'Valid CodeArena account'
    ],
    rules: [
      'Individual participation only — no teams',
      'No external code or libraries allowed (standard library only)',
      'All submissions must be original work',
      'Problems range from Easy to Hard difficulty',
      'Plagiarism results in immediate disqualification'
    ]
  },
  'ai-ml-hackathon': {
    id: 'ai-ml-hackathon',
    title: 'AI/ML Hackathon 2026',
    date: '2026-07-20',
    startTime: '9:00 AM',
    endTime: '9:00 AM (next day)',
    duration: '48 hours',
    registrationDeadline: '2026-07-19',
    registrationFee: 25,
    isFree: false,
    maxParticipants: 1000,
    currentParticipants: 850,
    difficulty: 'Hard',
    category: 'AI/ML',
    allowsTeams: true,
    maxTeamSize: 4,
    prizes: [
      { position: 1, amount: '$8,000', badge: '🥇' },
      { position: 2, amount: '$4,000', badge: '🥈' },
      { position: 3, amount: '$2,000', badge: '🥉' }
    ],
    languages: ['Python', 'R', 'Julia', 'Scala'],
    requirements: [
      'Intermediate ML knowledge recommended',
      'Familiarity with Python and ML frameworks',
      'GitHub account for submission',
      'Valid CodeArena account'
    ],
    rules: [
      'Teams of 1–4 members',
      'All code must be written during the hackathon',
      'Pre-trained models allowed but must be cited',
      'Final submission requires demo video + GitHub link',
      'Plagiarism results in immediate disqualification'
    ]
  },
  'cybersecurity-ctf': {
    id: 'cybersecurity-ctf',
    title: 'Cybersecurity CTF',
    date: '2026-04-12',
    startTime: '2:00 PM',
    endTime: '2:00 PM (next day)',
    duration: '24 hours',
    registrationDeadline: '2026-04-11',
    registrationFee: 0,
    isFree: true,
    maxParticipants: 800,
    currentParticipants: 450,
    difficulty: 'Hard',
    category: 'Security',
    allowsTeams: true,
    maxTeamSize: 3,
    prizes: [
      { position: 1, amount: '$10,000', badge: '🥇' },
      { position: 2, amount: '$5,000', badge: '🥈' },
      { position: 3, amount: '$2,500', badge: '🥉' }
    ],
    languages: ['Any language'],
    requirements: [
      'Basic knowledge of web and network security',
      'Familiarity with CTF concepts recommended',
      'VPN client installed (setup guide provided)',
      'Valid CodeArena account'
    ],
    rules: [
      'Individual or team (max 3 members)',
      'No attacks on contest infrastructure',
      'No social engineering against organizers',
      'Flags must be submitted in FLAG{...} format',
      'Writeups required from top 10 teams after contest'
    ]
  }
};

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
const SuccessScreen = ({ contest, formData, onViewContest }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="max-w-lg w-full text-center">
      <div className="bg-white rounded-3xl shadow-xl p-10">
        {/* Animated checkmark */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">You're In! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Your registration for <strong>{contest.title}</strong> is confirmed.
        </p>

        {/* Confirmation Details */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Contest</span>
            <span className="font-semibold text-gray-900">{contest.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-semibold text-gray-900">{contest.date} • {contest.startTime}</span>
          </div>
          {formData.teamName && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Team Name</span>
              <span className="font-semibold text-gray-900">{formData.teamName}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Language</span>
            <span className="font-semibold text-gray-900">{formData.language}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Entry Fee</span>
            <span className={`font-bold ${contest.isFree ? 'text-green-600' : 'text-gray-900'}`}>
              {contest.isFree ? 'Free ✓' : `$${contest.registrationFee} paid`}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 text-left mb-6">
          <p className="font-medium mb-1">📧 Confirmation email sent</p>
          <p className="text-blue-600 text-xs">Check your inbox for your registration confirmation and contest details. Add the contest to your calendar so you don't miss it!</p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/dashboard/contests"
            className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors text-sm"
          >
            Browse Contests
          </Link>
          <button
            onClick={onViewContest}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm"
          >
            View Contest →
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ContestRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    institution: '',
    teamName: '',
    participationType: 'individual',
    teamMembers: [''],
    language: '',
    experience: 'intermediate',
    termsAccepted: false,
    emailUpdates: true,
    codeOfConduct: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTimeout(() => {
      const found = contestsDB[id];
      if (found) {
        setContest(found);
        setForm(f => ({ ...f, language: found.languages[0] }));
        // Check if already registered
        const existing = localStorage.getItem(`registration_${id}`);
        if (existing) setAlreadyRegistered(true);
      } else {
        navigate('/dashboard/contests');
      }
      setLoading(false);
    }, 700);
  }, [id, navigate]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    }
    if (step === 2) {
      if (contest.allowsTeams && form.participationType === 'team' && !form.teamName.trim())
        e.teamName = 'Team name is required';
      if (!form.language) e.language = 'Please select a language';
    }
    if (step === 3) {
      if (!form.termsAccepted) e.termsAccepted = 'You must accept the terms';
      if (!form.codeOfConduct) e.codeOfConduct = 'You must accept the code of conduct';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validate()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      // Save registration to localStorage so ContestDetail can read it
      const registrationData = {
        contestId: id,
        registeredAt: new Date().toISOString(),
        ...form,
        teamMembers: form.participationType === 'team' ? form.teamMembers.filter(Boolean) : []
      };
      localStorage.setItem(`registration_${id}`, JSON.stringify(registrationData));

      // Also add to registered contests list
      const allRegistrations = JSON.parse(localStorage.getItem('allRegistrations') || '[]');
      if (!allRegistrations.includes(id)) {
        allRegistrations.push(id);
        localStorage.setItem('allRegistrations', JSON.stringify(allRegistrations));
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const addTeamMember = () => {
    const max = contest?.maxTeamSize || 4;
    if (form.teamMembers.length < max - 1) {
      set('teamMembers', [...form.teamMembers, '']);
    }
  };

  const removeTeamMember = (i) => {
    set('teamMembers', form.teamMembers.filter((_, idx) => idx !== i));
  };

  const updateTeamMember = (i, val) => {
    const updated = [...form.teamMembers];
    updated[i] = val;
    set('teamMembers', updated);
  };

  const stepLabels = ['Your Info', 'Preferences', 'Terms & Confirm'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (!contest) return null;

  if (isSuccess) {
    return (
      <SuccessScreen
        contest={contest}
        formData={form}
        onViewContest={() => navigate(`/dashboard/contests/${id}`)}
      />
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Registered</h2>
          <p className="text-gray-600 mb-6">You're already registered for <strong>{contest.title}</strong>.</p>
          <div className="flex gap-3">
            <Link to="/dashboard/contests" className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">Browse Contests</Link>
            <Link to={`/dashboard/contests/${id}`} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">View Contest</Link>
          </div>
        </div>
      </div>
    );
  }

  const spotsLeft = contest.maxParticipants - contest.currentParticipants;
  const fillPct = (contest.currentParticipants / contest.maxParticipants) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <Link to={`/dashboard/contests/${id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Contest
          </Link>

          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Register for {contest.title}</h1>
            <p className="text-white/70 mb-8">Complete your registration in just a few steps</p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
              {stepLabels.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      i + 1 < step ? 'bg-green-400 text-white' :
                      i + 1 === step ? 'bg-white text-blue-700' :
                      'bg-white/20 text-white/50'
                    }`}>
                      {i + 1 < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs ${i + 1 === step ? 'text-white' : 'text-white/50'}`}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-12 h-0.5 mb-5 transition-colors ${i + 1 < step ? 'bg-green-400' : 'bg-white/20'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

              {/* ─── STEP 1: Personal Info ─── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Your Information</h2>
                    <p className="text-gray-500 text-sm">Tell us who you are</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={form.fullName}
                        onChange={e => set('fullName', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Institution / Company <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. MIT, Google, Self-employed"
                      value={form.institution}
                      onChange={e => set('institution', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Contest quick details */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { icon: Calendar, label: 'Date', value: contest.date, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { icon: Clock, label: 'Duration', value: contest.duration, color: 'text-green-600', bg: 'bg-green-50' },
                      { icon: Users, label: 'Spots Left', value: `${spotsLeft} remaining`, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { icon: Trophy, label: 'Top Prize', value: contest.prizes[0].amount, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className={`${bg} rounded-xl p-3.5 flex items-center gap-3`}>
                        <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
                        <div>
                          <p className="text-xs text-gray-500">{label}</p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button onClick={nextStep} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: Preferences ─── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Preferences</h2>
                    <p className="text-gray-500 text-sm">Set up your participation details</p>
                  </div>

                  {/* Team / Individual */}
                  {contest.allowsTeams ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Participation Type</label>
                      <div className="flex gap-3">
                        {[
                          { value: 'individual', label: 'Individual', desc: 'Compete alone', icon: '👤' },
                          { value: 'team', label: 'Team', desc: `Up to ${contest.maxTeamSize} members`, icon: '👥' }
                        ].map(({ value, label, desc, icon }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => set('participationType', value)}
                            className={`flex-1 p-4 border-2 rounded-xl text-left transition-all ${
                              form.participationType === value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{icon}</div>
                            <p className={`font-semibold text-sm ${form.participationType === value ? 'text-blue-700' : 'text-gray-800'}`}>{label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-700">This contest is <strong>individual only</strong>. No team registration available.</p>
                    </div>
                  )}

                  {/* Team Name & Members */}
                  {contest.allowsTeams && form.participationType === 'team' && (
                    <div className="space-y-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. CodeCrusaders"
                          value={form.teamName}
                          onChange={e => set('teamName', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.teamName ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Team Members <span className="text-gray-400">(email)</span></label>
                        {form.teamMembers.map((member, i) => (
                          <div key={i} className="flex gap-2 mb-2">
                            <input
                              type="email"
                              value={member}
                              placeholder={`Member ${i + 2} email`}
                              onChange={e => updateTeamMember(i, e.target.value)}
                              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                            />
                            {form.teamMembers.length > 1 && (
                              <button onClick={() => removeTeamMember(i)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        {form.teamMembers.length < (contest.maxTeamSize - 1) && (
                          <button onClick={addTeamMember} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1.5 mt-1">
                            <Plus className="w-4 h-4" /> Add Member
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Language *</label>
                    <select
                      value={form.language}
                      onChange={e => set('language', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.language ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select a language</option>
                      {contest.languages.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'beginner', label: 'Beginner', emoji: '🌱', desc: '< 1 year' },
                        { value: 'intermediate', label: 'Intermediate', emoji: '🚀', desc: '1–3 years' },
                        { value: 'advanced', label: 'Advanced', emoji: '⚡', desc: '3+ years' }
                      ].map(({ value, label, emoji, desc }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set('experience', value)}
                          className={`p-3.5 border-2 rounded-xl text-center transition-all ${
                            form.experience === value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{emoji}</div>
                          <p className={`text-sm font-medium ${form.experience === value ? 'text-blue-700' : 'text-gray-700'}`}>{label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between">
                    <button onClick={prevStep} className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">← Back</button>
                    <button onClick={nextStep} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Terms & Confirm ─── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Confirm</h2>
                    <p className="text-gray-500 text-sm">Almost there — review your details</p>
                  </div>

                  {/* Summary */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h3 className="font-semibold text-gray-800 text-sm">Registration Summary</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {[
                        { label: 'Contest', value: contest.title },
                        { label: 'Date', value: `${contest.date} • ${contest.startTime}` },
                        { label: 'Name', value: form.fullName || '—' },
                        { label: 'Email', value: form.email || '—' },
                        { label: 'Language', value: form.language || '—' },
                        { label: 'Experience', value: form.experience },
                        ...(form.participationType === 'team' ? [{ label: 'Team', value: form.teamName || '—' }] : []),
                        { label: 'Entry Fee', value: contest.isFree ? 'Free' : `$${contest.registrationFee}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                          <span className="text-gray-500">{label}</span>
                          <span className={`font-medium ${label === 'Entry Fee' && contest.isFree ? 'text-green-600' : 'text-gray-900'} capitalize`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    {[
                      {
                        field: 'termsAccepted',
                        label: <>I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Contest Rules</a></>,
                        error: errors.termsAccepted
                      },
                      {
                        field: 'codeOfConduct',
                        label: <>I agree to the <a href="#" className="text-blue-600 hover:underline">Code of Conduct</a> and will compete with integrity</>,
                        error: errors.codeOfConduct
                      },
                      {
                        field: 'emailUpdates',
                        label: 'Send me email updates about this contest and future events',
                        error: null
                      }
                    ].map(({ field, label, error }) => (
                      <div key={field}>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={field}
                            checked={form[field]}
                            onChange={e => set(field, e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={field} className="text-sm text-gray-700 leading-relaxed cursor-pointer">{label}</label>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1 ml-7">{error}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Fee Banner */}
                  {contest.isFree ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Free Entry</p>
                        <p className="text-xs text-green-700">No payment required. Click below to complete your registration.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <CreditCard className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800">Entry Fee: ${contest.registrationFee}</p>
                        <p className="text-xs text-orange-700">You will be redirected to payment after confirming.</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-between">
                    <button onClick={prevStep} className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">← Back</button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-7 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Confirm Registration</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Spots */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Registration Status</h3>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">{contest.currentParticipants} registered</span>
                  <span className="font-medium text-gray-900">{contest.maxParticipants} max</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${fillPct}%` }} />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{spotsLeft}</div>
                  <div className="text-xs text-gray-500">Spots Left</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(fillPct)}%</div>
                  <div className="text-xs text-gray-500">Filled</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${contest.isFree ? 'text-green-600' : 'text-orange-600'}`}>
                    {contest.isFree ? 'Free' : `$${contest.registrationFee}`}
                  </div>
                  <div className="text-xs text-gray-500">Entry</div>
                </div>
              </div>
            </div>

            {/* Prizes */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Prizes
              </h3>
              <div className="space-y-2.5">
                {contest.prizes.map((prize, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{prize.badge}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {typeof prize.position === 'number' ? `${prize.position}${['st','nd','rd'][prize.position-1] || 'th'} Place` : prize.position}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">{prize.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {contest.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Rules */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Key Rules</h3>
              <ul className="space-y-2">
                {contest.rules.slice(0, 4).map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">Questions about registration or the contest?</p>
              <div className="space-y-2">
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">Contact Support</button>
                <Link to={`/dashboard/contests/${id}`} className="block w-full py-2 text-center border border-blue-300 hover:bg-blue-50 text-blue-600 rounded-xl text-sm font-medium transition-colors">
                  View Contest Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestRegistration;