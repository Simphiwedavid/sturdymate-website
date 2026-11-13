"use client";
import { useEffect, useRef, useState } from "react";
import { CAPS_SUBJECTS, GRADES, CURRICULUMS } from "@/lib/subjects";
import {
  GraduationCap, Sparkles, MessageCircle, FileText, HelpCircle, Layers, CalendarDays, LayoutDashboard,
  LogOut, Flame, Target, BookOpen, Brain, Upload, Plus, Trash2, Check, X, Send, ChevronRight,
  Clock, Trophy, TrendingUp, Settings, Crown, Zap, Shield, Star, ArrowRight, RefreshCw, Eye,
  CheckCircle2, AlertCircle, Loader2, Search, User, CreditCard, BarChart3, Lightbulb, Timer
} from "lucide-react";

function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: size, height: size }} className="rounded-2xl grad-bg flex items-center justify-center shadow-lg shadow-purple-600/25 shrink-0">
        <GraduationCap className="text-white" style={{ width: size*0.62, height: size*0.62 }} />
      </div>
      <div className="leading-none">
        <div className="font-black text-[19px] tracking-tight text-[#0B1F4A]">Study<span className="grad-text">Mate</span></div>
        <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-0.5">AI Study Partner</div>
      </div>
    </div>
  );
}

function renderRich(text: string) {
  return text.split("\n").map((line, i) => {
    const boldParts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => p.startsWith("**") ? <strong key={j} className="font-semibold text-[#0B1F4A]">{p.replace(/\*\*/g,"")}</strong> : p);
    if (line.startsWith("## ")) return <h4 key={i} className="font-bold text-[15px] text-[#0B1F4A] mt-3 mb-1">{boldParts}</h4>;
    if (line.startsWith("---")) return <hr key={i} className="my-3 border-slate-200" />;
    if (!line.trim()) return <div key={i} className="h-2" />;
    return <p key={i} className="text-[14px] leading-relaxed text-slate-700">{boldParts}</p>;
  });
}

async function api(path: string, opts: any = {}) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [aiMode, setAiMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState("");
  const [dash, setDash] = useState<any>(null);

  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(""), 3500); };

  const loadMe = async () => {
    try { const d = await api("/api/auth/me"); setUser(d.user); setAiMode(d.aiMode||""); } catch {}
    setLoading(false);
  };
  useEffect(()=>{ loadMe(); },[]);
  const loadDash = async () => { try { const d = await api("/api/dashboard"); setDash(d); if (d.user) setUser((u:any)=>({...u, ...d.user})); } catch {} };
  useEffect(()=>{ if (user) loadDash(); },[user?.id, view]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-violet-600 mx-auto"/><p className="mt-3 text-sm text-slate-500 font-medium">Loading StudyMate…</p></div></div>;

  if (!user) return <Landing onAuth={(u:any)=>{ setUser(u); setView("dashboard"); }} showToast={showToast} toast={toast} />;

  const nav = [
    { id:"dashboard", label:"Dashboard", icon: LayoutDashboard },
    { id:"assistant", label:"AI Assistant", icon: MessageCircle },
    { id:"notes", label:"Smart Notes", icon: FileText },
    { id:"quizzes", label:"Quizzes", icon: HelpCircle },
    { id:"flashcards", label:"Flashcards", icon: Layers },
    { id:"exams", label:"Exam Prep", icon: CalendarDays },
    { id:"settings", label:"Settings & Plan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#0B1F4A] text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-2xl fade-up flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/>{toast}</div>}
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-[264px] shrink-0 bg-white border-r border-slate-200/80 min-h-screen sticky top-0 h-screen p-5">
        <Logo />
        <div className="mt-6 bg-gradient-to-br from-[#0B1F4A] to-violet-700 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-black text-lg">{user.name?.[0]?.toUpperCase()}</div>
            <div className="min-w-0"><div className="font-bold text-sm truncate">{user.name}</div><div className="text-[11px] text-white/70">Grade {user.grade} • {user.curriculum}</div></div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-300"/>{user.streak||0} day streak</span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${user.plan==="premium"?"bg-amber-400 text-amber-950":"bg-white/15"}`}>{user.plan==="premium"?"★ PREMIUM":"FREE"}</span>
          </div>
        </div>
        <nav className="mt-5 space-y-1 flex-1">
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${view===n.id?"bg-violet-600 text-white shadow-lg shadow-violet-600/25":"text-slate-600 hover:bg-slate-100"}`}>
              <n.icon className="w-[18px] h-[18px]"/>{n.label}
              {n.id==="assistant" && <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">AI</span>}
            </button>
          ))}
        </nav>
        <div className="text-[11px] text-slate-400 leading-relaxed px-1">{aiMode}<br/>Made for CAPS learners 🇿🇦</div>
        <button onClick={async()=>{ await api("/api/auth/logout",{method:"POST"}); setUser(null); }} className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2.5 rounded-xl"><LogOut className="w-4 h-4"/> Log out</button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-8">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Logo size={34} />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-full"><Flame className="w-3.5 h-3.5"/>{user.streak||0}</span>
            <button onClick={async()=>{ await api("/api/auth/logout",{method:"POST"}); setUser(null); }} className="p-2 text-slate-500"><LogOut className="w-5 h-5"/></button>
          </div>
        </header>
        <div className="hidden lg:flex items-center justify-between px-8 pt-6">
          <div>
            <h1 className="text-2xl font-black text-[#0B1F4A] capitalize">{nav.find(n=>n.id===view)?.label}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{aiMode}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${user.plan==="premium"?"bg-amber-100 text-amber-800":"bg-slate-100 text-slate-600"}`}>{user.plan==="premium"?"★ Premium":"Free plan"}</span>
            <button onClick={()=>setView("settings")} className="text-xs font-bold bg-[#0B1F4A] text-white px-4 py-2 rounded-full">{user.plan==="premium"?"Manage plan":"Upgrade"}</button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-[1100px] mx-auto w-full">
          {view==="dashboard" && <Dashboard user={user} dash={dash} go={setView} refresh={loadDash} />}
          {view==="assistant" && <Assistant user={user} showToast={showToast} />}
          {view==="notes" && <Notes user={user} showToast={showToast} go={setView} />}
          {view==="quizzes" && <Quizzes user={user} showToast={showToast} />}
          {view==="flashcards" && <Flashcards user={user} showToast={showToast} />}
          {view==="exams" && <Exams user={user} showToast={showToast} dash={dash} refresh={loadDash} />}
          {view==="settings" && <SettingsView user={user} setUser={setUser} showToast={showToast} />}
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 px-2 py-2 flex justify-around">
        {nav.slice(0,6).map(n=>(
          <button key={n.id} onClick={()=>setView(n.id)} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold ${view===n.id?"text-violet-600":"text-slate-400"}`}><n.icon className="w-5 h-5"/>{n.label.split(" ")[0]}</button>
        ))}
        <button onClick={()=>setView("settings")} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold ${view==="settings"?"text-violet-600":"text-slate-400"}`}><Settings className="w-5 h-5"/>Settings</button>
      </nav>
    </div>
  );
}

/* ---------------- LANDING ---------------- */
function Landing({ onAuth, showToast, toast }: any) {
  const [mode, setMode] = useState<"login"|"register">("register");
  const [form, setForm] = useState<any>({ name:"", email:"", password:"", country:"South Africa", grade:10, curriculum:"CAPS", subjects:["Mathematics","English","Life Sciences"] });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const toggleSubject = (s:string)=> setForm((f:any)=>({...f, subjects: f.subjects.includes(s)? f.subjects.filter((x:string)=>x!==s): [...f.subjects,s]}));
  const submit = async (e:any)=>{
    e.preventDefault(); setErr(""); setBusy(true);
    try { const d = await api(mode==="register"?"/api/auth/register":"/api/auth/login",{method:"POST",body:form}); onAuth(d.user); }
    catch(ex:any){ setErr(ex.message); } setBusy(false);
  };
  const features = [
    { icon: MessageCircle, title:"AI Study Assistant", desc:"Step-by-step explanations in simple language, at beginner, intermediate or advanced level. No question is too basic." },
    { icon: FileText, title:"Smart Notes", desc:"Upload PDFs or paste notes. Get summaries, key concepts and revision notes organised by subject." },
    { icon: HelpCircle, title:"Quiz Generator", desc:"Instant quizzes from your notes or any topic, with automatic marking and explanations for every answer." },
    { icon: Layers, title:"Flashcards", desc:"Generate flashcards from notes, flip to reveal answers, and practise difficult concepts until they stick." },
    { icon: CalendarDays, title:"Exam Preparation", desc:"Countdowns, study timetables, revision checklists and weak-topic detection powered by your quiz results." },
    { icon: BarChart3, title:"Progress Dashboard", desc:"Streaks, daily goals, quiz performance and learning progress — all in one personalised dashboard." },
  ];
  return (
    <div className="min-h-screen">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#0B1F4A] text-white text-sm px-5 py-3 rounded-2xl shadow-2xl">{toast}</div>}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-violet-600">Features</a><a href="#subjects" className="hover:text-violet-600">CAPS Subjects</a><a href="#pricing" className="hover:text-violet-600">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>{setMode("login"); document.getElementById("auth")?.scrollIntoView({behavior:"smooth"});}} className="text-sm font-bold text-slate-700 px-4 py-2">Log in</button>
            <button onClick={()=>{setMode("register"); document.getElementById("auth")?.scrollIntoView({behavior:"smooth"});}} className="text-sm font-bold bg-violet-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-violet-600/25">Start free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="grad-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 20% 20%, #7C3AED 0, transparent 40%), radial-gradient(circle at 85% 80%, #2563EB 0, transparent 40%)"}}/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-xs font-bold px-3 py-1.5 rounded-full"><Sparkles className="w-3.5 h-3.5 text-amber-300"/> Built for South African CAPS • Grades 8–12</span>
            <h1 className="mt-5 text-[42px] sm:text-6xl font-black leading-[1.02] tracking-tight">Your personal<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-sky-300">AI study partner.</span></h1>
            <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-lg">Understand any subject in simple language, turn notes into quizzes and flashcards, and walk into exams confident. StudyMate tailors every explanation to your grade and curriculum.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={()=>document.getElementById("auth")?.scrollIntoView({behavior:"smooth"})} className="bg-white text-[#0B1F4A] font-black px-7 py-3.5 rounded-full flex items-center gap-2 shadow-xl">Create free account <ArrowRight className="w-4 h-4"/></button>
              <a href="#features" className="border border-white/30 font-bold px-7 py-3.5 rounded-full">See how it works</a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-300"/> Secure accounts</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-300"/> Instant quizzes</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-300"/> Free to start</span>
            </div>
          </div>
          {/* Hero mock dashboard */}
          <div className="hidden lg:block fade-up">
            <div className="bg-white rounded-[28px] p-6 shadow-2xl text-slate-900 rotate-1">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Welcome back</p><p className="font-black text-xl text-[#0B1F4A]">Thandi • Grade 11</p></div><span className="bg-orange-50 text-orange-600 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1"><Flame className="w-3.5 h-3.5"/> 12 day streak</span></div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[["Quiz avg","84%"],["Notes","24"],["Flashcards","96"]].map(([l,v])=>(<div key={l} className="bg-slate-50 rounded-2xl p-3 text-center"><div className="font-black text-lg text-[#0B1F4A]">{v}</div><div className="text-[11px] font-semibold text-slate-400">{l}</div></div>))}
              </div>
              <div className="mt-4 bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-violet-700 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> AI Assistant</p>
                <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">“Photosynthesis is how plants cook their own food using sunlight — like a tiny kitchen in every leaf…”</p>
              </div>
              <div className="mt-4 space-y-2">
                {["Mathematics — Algebra","Life Sciences — Genetics","History — Apartheid Resistance"].map(s=>(<div key={s} className="flex items-center justify-between bg-slate-50 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700">{s}<ChevronRight className="w-4 h-4 text-slate-400"/></div>))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto"><span className="text-xs font-black tracking-widest text-violet-600 uppercase">Everything you need</span><h2 className="text-3xl sm:text-4xl font-black text-[#0B1F4A] mt-2">One partner for every subject</h2><p className="text-slate-500 mt-3">From first explanation to final exam — StudyMate stays with you at every step.</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {features.map(f=>(<div key={f.title} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"><div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center"><f.icon className="w-6 h-6"/></div><h3 className="font-black text-lg text-[#0B1F4A] mt-4">{f.title}</h3><p className="text-sm text-slate-500 leading-relaxed mt-2">{f.desc}</p></div>))}
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="bg-white border-y border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><span className="text-xs font-black tracking-widest text-violet-600 uppercase">CAPS Curriculum</span><h2 className="text-3xl font-black text-[#0B1F4A] mt-2">16 subjects. One app.</h2></div><p className="text-slate-500 text-sm max-w-sm">Choose your grade and subjects during sign-up — the AI tailors every explanation to your curriculum.</p></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-8">
            {CAPS_SUBJECTS.map(s=>(<div key={s.name} className="flex items-center gap-3 border border-slate-200 rounded-2xl p-3.5 hover:border-violet-300 hover:bg-violet-50/50 transition"><span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{background:s.color}}>{s.icon}</span><span className="font-bold text-sm text-[#0B1F4A] leading-tight">{s.name}</span></div>))}
          </div>
        </div>
      </section>

      {/* Auth */}
      <section id="auth" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2">
            <span className="text-xs font-black tracking-widest text-violet-600 uppercase">Get started</span>
            <h2 className="text-3xl font-black text-[#0B1F4A] mt-2">Create your free account</h2>
            <p className="text-slate-500 mt-3 leading-relaxed">Tell us your grade and subjects once — StudyMate personalises your dashboard, explanations and revision plan from day one.</p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-slate-600">
              {["20 AI questions per day on Free","Unlimited notes & flashcards","Quiz generator with instant marking","Exam countdowns & study timetables"].map(t=>(<li key={t} className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/>{t}</li>))}
            </ul>
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0"/><span><b>Google sign-in:</b> not configured in this deployment yet — please use email sign-up. Your data stays private and secure.</span></div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-[28px] border border-slate-200 shadow-xl p-6 sm:p-8">
            <div className="flex bg-slate-100 rounded-full p-1 mb-6">
              <button onClick={()=>setMode("register")} className={`flex-1 py-2.5 rounded-full text-sm font-black ${mode==="register"?"bg-white shadow text-[#0B1F4A]":"text-slate-500"}`}>Create account</button>
              <button onClick={()=>setMode("login")} className={`flex-1 py-2.5 rounded-full text-sm font-black ${mode==="login"?"bg-white shadow text-[#0B1F4A]":"text-slate-500"}`}>Log in</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              {mode==="register" && <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Thandi Mokoena" className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/></div>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/></div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label><input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min. 6 characters" className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/></div>
              </div>
              {mode==="register" && <>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Country</label><input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Grade</label><select value={form.grade} onChange={e=>setForm({...form,grade:Number(e.target.value)})} className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500">{GRADES.map(g=><option key={g} value={g}>Grade {g}</option>)}</select></div>
                  <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Curriculum</label><select value={form.curriculum} onChange={e=>setForm({...form,curriculum:e.target.value})} className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500">{CURRICULUMS.map(c=><option key={c}>{c}</option>)}</select></div>
                </div>
                <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your subjects (tap to select)</label>
                  <div className="mt-2 flex flex-wrap gap-2">{CAPS_SUBJECTS.map(s=>(<button type="button" key={s.name} onClick={()=>toggleSubject(s.name)} className={`text-xs font-bold px-3 py-2 rounded-full border transition ${form.subjects.includes(s.name)?"bg-violet-600 text-white border-violet-600":"border-slate-200 text-slate-600 hover:border-violet-300"}`}>{s.name}</button>))}</div>
                </div>
              </>}
              {err && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>{err}</div>}
              <button disabled={busy} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">{busy?<Loader2 className="w-5 h-5 animate-spin"/>:<Sparkles className="w-5 h-5"/>}{mode==="register"?"Create my free account":"Log in to StudyMate"}</button>
              <p className="text-[11px] text-slate-400 text-center">Your personal information is protected. Passwords are securely hashed and never shared.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white border-t border-slate-200/70 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center"><span className="text-xs font-black tracking-widest text-violet-600 uppercase">Pricing</span><h2 className="text-3xl font-black text-[#0B1F4A] mt-2">Start free. Upgrade when ready.</h2><p className="text-slate-500 mt-2">No payments are taken until our payment system is fully configured.</p></div>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="border-2 border-slate-200 rounded-[28px] p-8">
              <p className="font-black text-lg text-[#0B1F4A]">FREE</p><p className="text-4xl font-black mt-2">R0<span className="text-base font-semibold text-slate-400"> / forever</span></p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">{["20 AI questions per day","Basic quizzes & flashcards","Limited note summaries","Exam countdowns & checklists","Personal dashboard"].map(t=>(<li key={t} className="flex gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5"/>{t}</li>))}</ul>
              <button onClick={()=>document.getElementById("auth")?.scrollIntoView({behavior:"smooth"})} className="mt-8 w-full border-2 border-[#0B1F4A] text-[#0B1F4A] font-black py-3 rounded-xl">Start free</button>
            </div>
            <div className="border-2 border-violet-600 rounded-[28px] p-8 relative bg-gradient-to-b from-violet-50 to-white">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1"><Crown className="w-3.5 h-3.5"/> MOST POPULAR</span>
              <p className="font-black text-lg text-violet-700">PREMIUM</p><p className="text-4xl font-black mt-2">R49<span className="text-base font-semibold text-slate-400"> / month</span></p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">{["200 AI questions per day","Advanced study assistance","More document uploads","Advanced exam preparation","Detailed performance analytics","Weak-topic detection"].map(t=>(<li key={t} className="flex gap-2"><Check className="w-4 h-4 text-violet-600 mt-0.5"/>{t}</li>))}</ul>
              <button onClick={()=>document.getElementById("auth")?.scrollIntoView({behavior:"smooth"})} className="mt-8 w-full bg-violet-600 text-white font-black py-3 rounded-xl">Join Premium</button>
              <p className="text-[11px] text-slate-400 text-center mt-3">Payments coming soon — activate Premium free in Settings during beta.</p>
            </div>
          </div>
        </div>
      </section>
      <footer className="grad-bg text-white py-10"><div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4"><div className="flex items-center gap-2"><GraduationCap className="w-6 h-6"/><span className="font-black">StudyMate</span><span className="text-white/60 text-sm">— Your personal AI study partner</span></div><p className="text-white/50 text-xs">Made with care for learners across South Africa 🇿🇦 • Grades 8–12 CAPS</p></div></footer>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ user, dash, go, refresh }: any) {
  if (!dash) return <div className="flex items-center gap-2 text-slate-500 py-10"><Loader2 className="w-5 h-5 animate-spin"/> Loading your dashboard…</div>;
  const s = dash.stats;
  const hour = new Date().getHours();
  const greet = hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";
  const goalPct = Math.min(100, Math.round(((dash.recent?.length||0)/Math.max(1,user.dailyGoal||30))*100));
  const nextExam = dash.exams?.[0];
  const daysLeft = nextExam ? Math.ceil((new Date(nextExam.examDate).getTime()-Date.now())/86400000) : null;
  return (
    <div className="space-y-5 fade-up">
      <div className="grad-bg rounded-[28px] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-semibold">{greet},</p>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">{user.name} 👋</h2>
            <p className="text-white/70 text-sm mt-1">Grade {user.grade} • {user.curriculum} • {user.country}</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-center"><Flame className="w-5 h-5 text-orange-300 mx-auto"/><div className="font-black text-xl mt-1">{user.streak||0}</div><div className="text-[10px] font-bold text-white/60 uppercase">Day streak</div></div>
            <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-center"><Target className="w-5 h-5 text-emerald-300 mx-auto"/><div className="font-black text-xl mt-1">{user.dailyGoal||30}m</div><div className="text-[10px] font-bold text-white/60 uppercase">Daily goal</div></div>
          </div>
        </div>
        <div className="relative mt-5">
          <div className="flex justify-between text-xs font-bold text-white/70 mb-1.5"><span>Today's progress</span><span>{dash.recent?.length||0} activities</span></div>
          <div className="h-2.5 bg-white/15 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all" style={{width:`${Math.max(8,goalPct)}%`}}/></div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {icon: FileText, label:"Smart Notes", value:s.notes, color:"bg-violet-100 text-violet-700", action:()=>go("notes")},
          {icon: Layers, label:"Flashcards", value:s.flashcards, color:"bg-sky-100 text-sky-700", action:()=>go("flashcards")},
          {icon: HelpCircle, label:"Quiz average", value:s.avgScore+"%", color:"bg-emerald-100 text-emerald-700", action:()=>go("quizzes")},
          {icon: CalendarDays, label:"Upcoming exams", value:s.exams, color:"bg-amber-100 text-amber-700", action:()=>go("exams")},
        ].map(c=>(<button key={c.label} onClick={c.action} className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 text-left hover:shadow-lg transition"><div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center`}><c.icon className="w-5 h-5"/></div><div className="font-black text-2xl text-[#0B1F4A] mt-3">{c.value}</div><div className="text-xs font-bold text-slate-400">{c.label}</div></button>))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
            <div className="flex items-center justify-between"><h3 className="font-black text-[#0B1F4A]">My subjects</h3><button onClick={()=>go("settings")} className="text-xs font-bold text-violet-600">Edit subjects</button></div>
            <div className="flex flex-wrap gap-2 mt-4">
              {(user.subjects?.length? user.subjects : ["Add your subjects in Settings"]).map((sub:string)=>{ const meta=CAPS_SUBJECTS.find(x=>x.name===sub); return <span key={sub} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3.5 py-1.5 text-sm font-bold text-slate-700">{meta && <span className="w-6 h-6 rounded-full text-white text-[10px] font-black flex items-center justify-center" style={{background:meta.color}}>{meta.icon}</span>}{sub}</span>; })}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <button onClick={()=>go("assistant")} className="bg-violet-600 text-white rounded-2xl p-4 text-left hover:bg-violet-700 transition"><MessageCircle className="w-5 h-5"/><div className="font-black mt-2">Ask the AI Assistant</div><div className="text-xs text-white/70 mt-0.5">Explain any topic step-by-step</div></button>
              <button onClick={()=>go("quizzes")} className="bg-[#0B1F4A] text-white rounded-2xl p-4 text-left hover:bg-[#16295e] transition"><HelpCircle className="w-5 h-5"/><div className="font-black mt-2">Take a quiz</div><div className="text-xs text-white/70 mt-0.5">Test yourself & see explanations</div></button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
            <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-600"/> Quiz performance</h3>
            {dash.attempts?.length ? (
              <div className="mt-4 space-y-3">
                {dash.attempts.slice(0,5).map((a:any,i:number)=>{ const q=dash.quizzes?.find((x:any)=>x.id===a.quizId); const pct=a.total?Math.round(a.score/a.total*100):0; return (
                  <div key={a.id}><div className="flex justify-between text-xs font-bold text-slate-500 mb-1"><span>{q?.title||"Quiz"}</span><span>{a.score}/{a.total} • {pct}%</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct>=70?"bg-emerald-500":pct>=40?"bg-amber-500":"bg-red-400"}`} style={{width:pct+"%"}}/></div></div>);})}
              </div>
            ) : <p className="text-sm text-slate-400 mt-3">No quizzes yet — generate one in the Quizzes tab and your performance will appear here.</p>}
            {s.weakTopics?.length>0 && <div className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-4"><p className="text-xs font-black text-red-700 uppercase tracking-wide flex items-center gap-1.5"><Lightbulb className="w-4 h-4"/> Weak topics to focus on</p><div className="flex flex-wrap gap-2 mt-2">{s.weakTopics.map((w:any)=>(<span key={w.subject} className="text-xs font-bold bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full">{w.subject} • {w.pct}%</span>))}</div></div>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
            <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><Timer className="w-5 h-5 text-violet-600"/> Upcoming exams</h3>
            {nextExam ? (
              <div className="mt-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl p-4">
                <p className="font-black">{nextExam.title}</p><p className="text-xs text-white/70 mt-0.5">{nextExam.subject} • {new Date(nextExam.examDate).toLocaleDateString("en-ZA",{day:"numeric",month:"long",year:"numeric"})}</p>
                <div className="mt-3 flex items-end gap-2"><span className="text-4xl font-black">{daysLeft}</span><span className="text-sm text-white/70 mb-1">{daysLeft===1?"day":"days"} to go</span></div>
                <button onClick={()=>go("exams")} className="mt-3 bg-white text-violet-700 text-xs font-black px-4 py-2 rounded-full">Open exam prep</button>
              </div>
            ) : <div className="mt-3"><p className="text-sm text-slate-400">No exams scheduled yet.</p><button onClick={()=>go("exams")} className="mt-3 text-sm font-bold text-violet-600">+ Add an exam</button></div>}
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-500"><span>Revision checklist</span><span>{s.checklistDone}/{s.checklistTotal} done</span></div>
              <div className="h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-violet-600 rounded-full" style={{width: s.checklistTotal? (s.checklistDone/s.checklistTotal*100)+"%":"0%"}}/></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
            <h3 className="font-black text-[#0B1F4A]">Recent activity</h3>
            <div className="mt-3 space-y-3">
              {dash.recent?.length ? dash.recent.slice(0,6).map((a:any)=>(<div key={a.id} className="flex gap-3 text-sm"><span className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0"/><div><p className="text-slate-700 font-medium leading-snug">{a.label}</p><p className="text-[11px] text-slate-400">{new Date(a.createdAt).toLocaleString("en-ZA",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p></div></div>)) : <p className="text-sm text-slate-400">Your study activity will appear here. Ask a question, add a note or take a quiz to get started!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ASSISTANT ---------------- */
function Assistant({ user, showToast }: any) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const [subject, setSubject] = useState(user.subjects?.[0]||"Mathematics");
  const [level, setLevel] = useState("intermediate"); const [length, setLength] = useState("normal");
  const [remaining, setRemaining] = useState<number|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ api("/api/chat").then(d=>setMsgs(d.messages||[])).catch(()=>{}); },[]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,busy]);
  const send = async (q?:string)=>{
    const question = (q||input).trim(); if(!question||busy) return;
    setInput(""); setBusy(true);
    setMsgs(m=>[...m,{role:"user",content:question}]);
    try { const d = await api("/api/chat",{method:"POST",body:{question,subject,level,length}}); setMsgs(m=>[...m,{role:"assistant",content:d.answer}]); setRemaining(d.remaining); }
    catch(e:any){ showToast(e.message); setMsgs(m=>[...m,{role:"assistant",content:`⚠️ ${e.message}`} ]); }
    setBusy(false);
  };
  const prompts = ["Explain photosynthesis simply","Solve algebra equations step by step","What is Newton's second law?","Explain apartheid resistance","How does supply and demand work?","Help me write an essay"];
  return (
    <div className="fade-up">
      <div className="bg-white rounded-[28px] border border-slate-200/80 overflow-hidden flex flex-col" style={{height:"calc(100vh - 190px)",minHeight:480}}>
        <div className="grad-bg text-white px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center"><Sparkles className="w-5 h-5"/></div>
          <div className="flex-1"><div className="font-black">StudyMate AI Assistant</div><div className="text-xs text-white/70">Friendly • Step-by-step • Grade {user.grade} {user.curriculum}{remaining!==null?` • ${remaining} questions left today`:""}</div></div>
          <span className="text-[10px] font-black bg-emerald-400 text-emerald-950 px-2.5 py-1 rounded-full">NO QUESTION IS TOO BASIC 💜</span>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 items-center">
          <select value={subject} onChange={e=>setSubject(e.target.value)} className="text-xs font-bold border border-slate-200 rounded-full px-3 py-2 bg-white outline-none">{CAPS_SUBJECTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
          <select value={level} onChange={e=>setLevel(e.target.value)} className="text-xs font-bold border border-slate-200 rounded-full px-3 py-2 bg-white outline-none"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
          <select value={length} onChange={e=>setLength(e.target.value)} className="text-xs font-bold border border-slate-200 rounded-full px-3 py-2 bg-white outline-none"><option value="short">Short answer</option><option value="normal">Normal</option><option value="detailed">Detailed</option></select>
          <span className="text-[11px] text-slate-400 font-medium ml-auto hidden sm:block">Tip: try “Explain photosynthesis”</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAFAFE]">
          {msgs.length===0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-3xl grad-bg flex items-center justify-center mx-auto"><GraduationCap className="w-8 h-8 text-white"/></div>
              <h3 className="font-black text-xl text-[#0B1F4A] mt-4">Hi {user.name.split(" ")[0]}! What shall we learn today?</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">Ask about any school subject. I'll explain it step-by-step with examples — at your level, in simple language.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-lg mx-auto">{prompts.map(p=>(<button key={p} onClick={()=>send(p)} className="text-xs font-bold bg-white border border-slate-200 hover:border-violet-400 hover:text-violet-700 px-3.5 py-2 rounded-full transition">{p}</button>))}</div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[88%] sm:max-w-[75%] rounded-3xl px-5 py-4 ${m.role==="user"?"bg-violet-600 text-white rounded-br-lg":"bg-white border border-slate-200 rounded-bl-lg shadow-sm"}`}>
                {m.role==="assistant" ? renderRich(m.content) : <p className="text-sm leading-relaxed">{m.content}</p>}
              </div>
            </div>
          ))}
          {busy && <div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-3xl rounded-bl-lg px-5 py-4 flex gap-1.5"><span className="typing-dot w-2 h-2 bg-violet-500 rounded-full"/><span className="typing-dot w-2 h-2 bg-violet-500 rounded-full"/><span className="typing-dot w-2 h-2 bg-violet-500 rounded-full"/></div></div>}
          <div ref={bottomRef}/>
        </div>
        <form onSubmit={e=>{e.preventDefault();send();}} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask anything — no question is too basic…" className="flex-1 border border-slate-200 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
          <button disabled={busy} className="bg-violet-600 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 hover:bg-violet-700"><Send className="w-5 h-5"/></button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- NOTES ---------------- */
function Notes({ user, showToast, go }: any) {
  const [notes, setNotes] = useState<any[]>([]); const [open, setOpen] = useState<any>(null);
  const [form, setForm] = useState({title:"",subject:user.subjects?.[0]||"Mathematics",topic:"",content:""});
  const [busy, setBusy] = useState(false); const [search, setSearch] = useState("");
  const load = ()=> api("/api/notes").then(d=>setNotes(d.notes||[])).catch(()=>{});
  useEffect(()=>{load();},[]);
  const create = async (e:any)=>{
    e.preventDefault(); setBusy(true);
    try { const d = await api("/api/notes",{method:"POST",body:form}); setNotes(n=>[d.note,...n]); setOpen(d.note); setForm({title:"",subject:form.subject,topic:"",content:""}); showToast("Note saved & summarised!"); }
    catch(ex:any){ showToast(ex.message); } setBusy(false);
  };
  const onPdf = async (file:File)=>{
    if (!file.name.toLowerCase().endsWith(".pdf")) { showToast("Please choose a PDF file."); return; }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = async ()=>{
      const b64 = (reader.result as string).split(",")[1];
      try { const d = await api("/api/notes",{method:"POST",body:{pdfBase64:b64,fileName:file.name,subject:form.subject,topic:form.topic}}); setNotes(n=>[d.note,...n]); setOpen(d.note); showToast("PDF uploaded & summarised!"); }
      catch(ex:any){ showToast(ex.message); } setBusy(false);
    };
    reader.readAsDataURL(file);
  };
  const del = async (id:number)=>{ await api("/api/notes",{method:"DELETE",body:{id}}); setNotes(n=>n.filter(x=>x.id!==id)); if(open?.id===id) setOpen(null); showToast("Note deleted."); };
  const genCards = async (note:any)=>{ try { const d = await api("/api/flashcards",{method:"POST",body:{noteId:note.id}}); showToast(`${d.flashcards.length} flashcards created!`); go("flashcards"); } catch(e:any){ showToast(e.message); } };
  const genQuiz = async (note:any)=>{ try { const d = await api("/api/quizzes",{method:"POST",body:{noteId:note.id}}); showToast("Quiz generated from your note!"); go("quizzes"); } catch(e:any){ showToast(e.message); } };
  const filtered = notes.filter(n=> (n.title+n.subject+n.topic).toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="grid lg:grid-cols-5 gap-5 fade-up">
      <div className="lg:col-span-2 space-y-5">
        <form onSubmit={create} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
          <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><Plus className="w-5 h-5 text-violet-600"/> New note</h3>
          <div className="space-y-3 mt-4">
            <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Note title (e.g. Cell structure)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">{CAPS_SUBJECTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
              <input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="Topic (optional)" className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            </div>
            <textarea required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Paste your notes here… StudyMate will summarise them and extract key concepts." rows={6} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-y"/>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-violet-300 bg-violet-50 text-violet-700 font-bold text-sm rounded-xl py-3 cursor-pointer hover:bg-violet-100 transition">
              <Upload className="w-4 h-4"/> Upload PDF instead
              <input type="file" accept=".pdf" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) onPdf(f); }}/>
            </label>
            <button disabled={busy} className="w-full bg-violet-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">{busy?<Loader2 className="w-5 h-5 animate-spin"/>:<Sparkles className="w-5 h-5"/>} Save & summarise</button>
          </div>
        </form>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5"><Search className="w-4 h-4 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes…" className="flex-1 text-sm outline-none"/></div>
          <div className="mt-4 space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filtered.length? filtered.map(n=>(
              <div key={n.id} onClick={()=>setOpen(n)} className={`p-3.5 rounded-2xl border cursor-pointer transition ${open?.id===n.id?"border-violet-400 bg-violet-50":"border-slate-200 hover:border-violet-200"}`}>
                <div className="flex items-start justify-between gap-2"><div className="font-bold text-sm text-[#0B1F4A] leading-snug">{n.title}</div><button onClick={e=>{e.stopPropagation();del(n.id);}} className="text-slate-300 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button></div>
                <div className="text-[11px] font-bold text-slate-400 mt-1">{n.subject}{n.topic?` • ${n.topic}`:""}</div>
              </div>
            )) : <p className="text-sm text-slate-400 py-6 text-center">No notes yet. Paste your first note or upload a PDF!</p>}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        {open ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 fade-up">
            <span className="text-xs font-black bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full">{open.subject}{open.topic?` • ${open.topic}`:""}</span>
            <h2 className="text-2xl font-black text-[#0B1F4A] mt-3">{open.title}</h2>
            <div className="mt-5 bg-gradient-to-br from-violet-50 to-sky-50 border border-violet-100 rounded-2xl p-5">
              <p className="text-xs font-black text-violet-700 uppercase tracking-wide flex items-center gap-1.5"><Sparkles className="w-4 h-4"/> AI Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">{open.summary}</p>
            </div>
            <div className="mt-5"><p className="text-xs font-black text-slate-500 uppercase tracking-wide">Key concepts</p><div className="flex flex-wrap gap-2 mt-2">{(open.keyConcepts||[]).map((k:string)=>(<span key={k} className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full">★ {k}</span>))}</div></div>
            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={()=>genCards(open)} className="bg-[#0B1F4A] text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2"><Layers className="w-4 h-4"/> Make flashcards</button>
              <button onClick={()=>genQuiz(open)} className="bg-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Generate quiz</button>
              <button onClick={()=>{navigator.clipboard?.writeText(open.summary||""); showToast("Summary copied!");}} className="border border-slate-200 text-sm font-bold px-5 py-2.5 rounded-full">Copy summary</button>
            </div>
            <div className="mt-6"><p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Your original note</p><div className="bg-slate-50 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">{open.content}</div></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto"/><h3 className="font-black text-lg text-[#0B1F4A] mt-4">Select a note to view its summary</h3><p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">Paste notes or upload a PDF on the left. StudyMate will summarise them, extract key concepts, and turn them into flashcards and quizzes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- QUIZZES ---------------- */
function Quizzes({ user, showToast }: any) {
  const [quizzes, setQuizzes] = useState<any[]>([]); const [attempts, setAttempts] = useState<any[]>([]);
  const [form, setForm] = useState({subject:user.subjects?.[0]||"Mathematics",topic:"",difficulty:"medium",count:5,noteId:""});
  const [notes, setNotes] = useState<any[]>([]);
  const [active, setActive] = useState<any>(null); const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null); const [busy, setBusy] = useState(false);
  const load = ()=>{ api("/api/quizzes").then(d=>{setQuizzes(d.quizzes||[]);setAttempts(d.attempts||[]);}).catch(()=>{}); api("/api/notes").then(d=>setNotes(d.notes||[])).catch(()=>{}); };
  useEffect(()=>{load();},[]);
  const generate = async (e:any)=>{
    e.preventDefault(); setBusy(true);
    try { const d = await api("/api/quizzes",{method:"POST",body:{...form,noteId: form.noteId? Number(form.noteId): null, count:Number(form.count)}}); setQuizzes(q=>[d.quiz,...q]); showToast("Quiz generated!"); startQuiz(d.quiz); }
    catch(ex:any){ showToast(ex.message); } setBusy(false);
  };
  const startQuiz = (q:any)=>{ setActive(q); setAnswers(new Array(q.questions.length).fill("")); setResult(null); };
  const submit = async ()=>{
    if (answers.some(a=>!a)) { showToast("Please answer every question first."); return; }
    setBusy(true);
    try { const d = await api("/api/quizzes",{method:"PATCH",body:{quizId:active.id,answers}}); setResult(d); load(); }
    catch(e:any){ showToast(e.message); } setBusy(false);
  };
  return (
    <div className="grid lg:grid-cols-5 gap-5 fade-up">
      <div className="lg:col-span-2 space-y-5">
        <form onSubmit={generate} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
          <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-600"/> Generate a quiz</h3>
          <div className="space-y-3 mt-4">
            <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">{CAPS_SUBJECTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
            <input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="Topic (e.g. Photosynthesis, Algebra…)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            <select value={form.noteId} onChange={e=>setForm({...form,noteId:e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">
              <option value="">— Or generate from a note —</option>{notes.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})} className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
              <select value={form.count} onChange={e=>setForm({...form,count:Number(e.target.value)})} className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none"><option value={3}>3 questions</option><option value={5}>5 questions</option><option value={8}>8 questions</option></select>
            </div>
            <button disabled={busy} className="w-full bg-violet-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">{busy?<Loader2 className="w-5 h-5 animate-spin"/>:<Zap className="w-5 h-5"/>} Generate quiz</button>
          </div>
        </form>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
          <h3 className="font-black text-[#0B1F4A]">My quizzes</h3>
          <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
            {quizzes.length? quizzes.map(q=>{ const att=attempts.find(a=>a.quizId===q.id); return (
              <button key={q.id} onClick={()=>startQuiz(q)} className="w-full text-left border border-slate-200 hover:border-violet-300 rounded-2xl p-3.5 transition">
                <div className="font-bold text-sm text-[#0B1F4A]">{q.title}</div>
                <div className="text-[11px] font-bold text-slate-400 mt-0.5">{q.subject} • {q.questions?.length} questions • {q.difficulty}{att?` • Last: ${att.score}/${att.total}`:""}</div>
              </button>);}) : <p className="text-sm text-slate-400 py-4 text-center">No quizzes yet — generate your first one!</p>}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        {active ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 fade-up">
            <div className="flex items-center justify-between"><div><span className="text-xs font-black bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full">{active.subject} • {active.difficulty}</span><h2 className="text-xl font-black text-[#0B1F4A] mt-2.5">{active.title}</h2></div><button onClick={()=>setActive(null)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button></div>
            {result ? (
              <div className="mt-6">
                <div className="text-center bg-gradient-to-br from-violet-50 to-sky-50 border border-violet-100 rounded-3xl p-6">
                  <Trophy className="w-10 h-10 text-amber-500 mx-auto"/>
                  <div className="text-4xl font-black text-[#0B1F4A] mt-2">{result.score}/{result.total}</div>
                  <p className="text-sm text-slate-500 mt-1">{result.score===result.total?"Perfect score! Outstanding work! 🎉": result.score/result.total>=0.7?"Great job — keep it up!": result.score/result.total>=0.4?"Good effort — review the explanations below.":"Don't worry — every mistake teaches you something. Review below and try again!"}</p>
                  <button onClick={()=>startQuiz(active)} className="mt-4 bg-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Try again</button>
                </div>
                <div className="mt-5 space-y-3">
                  {result.results.map((r:any,i:number)=>(
                    <div key={i} className={`rounded-2xl border p-4 ${r.correct?"border-emerald-200 bg-emerald-50/60":"border-red-200 bg-red-50/60"}`}>
                      <p className="font-bold text-sm text-[#0B1F4A] flex gap-2">{r.correct?<CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"/>:<X className="w-4 h-4 text-red-500 shrink-0 mt-0.5"/>}{r.q}</p>
                      <p className="text-xs text-slate-600 mt-2">Your answer: <b>{r.yourAnswer}</b> • Correct: <b>{r.correctAnswer}</b></p>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">💡 {r.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {active.questions.map((q:any,i:number)=>(
                  <div key={i}>
                    <p className="font-bold text-[15px] text-[#0B1F4A]"><span className="text-violet-600 mr-2">{i+1}.</span>{q.q}</p>
                    <div className="grid sm:grid-cols-2 gap-2 mt-3">
                      {q.options.map((opt:string)=>(
                        <button key={opt} onClick={()=>setAnswers(a=>{const n=[...a];n[i]=opt;return n;})} className={`text-left text-sm font-medium border rounded-xl px-4 py-3 transition ${answers[i]===opt?"border-violet-600 bg-violet-50 text-violet-800":"border-slate-200 hover:border-violet-300 text-slate-600"}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button disabled={busy} onClick={submit} className="w-full bg-[#0B1F4A] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">{busy?<Loader2 className="w-5 h-5 animate-spin"/>:<Check className="w-5 h-5"/>} Submit & see results</button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto"/><h3 className="font-black text-lg text-[#0B1F4A] mt-4">Pick or generate a quiz</h3><p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">Generate from a topic or your own notes. Answers are marked automatically with explanations for every question.</p>
            {attempts.length>0 && <div className="mt-6 text-left max-w-md mx-auto"><p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Recent results</p>{attempts.slice(0,4).map(a=>{const q=quizzes.find(x=>x.id===a.quizId);return <div key={a.id} className="flex justify-between text-sm border-b border-slate-100 py-2"><span className="font-semibold text-slate-600">{q?.title||"Quiz"}</span><span className="font-black text-[#0B1F4A]">{a.score}/{a.total}</span></div>;})}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- FLASHCARDS ---------------- */
function Flashcards({ user, showToast }: any) {
  const [cards, setCards] = useState<any[]>([]); const [idx, setIdx] = useState(0); const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({front:"",back:"",subject:user.subjects?.[0]||"Mathematics"});
  const [notes, setNotes] = useState<any[]>([]); const [noteId, setNoteId] = useState("");
  const load = ()=>{ api("/api/flashcards").then(d=>setCards(d.flashcards||[])).catch(()=>{}); api("/api/notes").then(d=>setNotes(d.notes||[])).catch(()=>{}); };
  useEffect(()=>{load();},[]);
  const create = async (e:any)=>{ e.preventDefault(); try { const d = await api("/api/flashcards",{method:"POST",body:form}); setCards(c=>[d.flashcards[0],...c]); setForm({front:"",back:"",subject:form.subject}); showToast("Flashcard created!"); } catch(ex:any){ showToast(ex.message); } };
  const genFromNote = async ()=>{ if(!noteId){showToast("Choose a note first.");return;} try { const d = await api("/api/flashcards",{method:"POST",body:{noteId:Number(noteId)}}); setCards(c=>[...d.flashcards,...c]); showToast(`${d.flashcards.length} flashcards generated!`); } catch(e:any){ showToast(e.message); } };
  const mark = async (known:boolean)=>{ const card=cards[idx]; if(!card) return; try { const d = await api("/api/flashcards",{method:"PATCH",body:{id:card.id,known}}); setCards(c=>c.map(x=>x.id===card.id?d.card:x)); } catch {} setFlipped(false); setIdx(i=>(i+1)%cards.length); };
  const del = async (id:number)=>{ await api("/api/flashcards",{method:"DELETE",body:{id}}); setCards(c=>c.filter(x=>x.id!==id)); setIdx(0); };
  const knownCount = cards.filter(c=>c.known).length;
  const card = cards[idx];
  return (
    <div className="grid lg:grid-cols-5 gap-5 fade-up">
      <div className="lg:col-span-2 space-y-5">
        <form onSubmit={create} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
          <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><Plus className="w-5 h-5 text-violet-600"/> Create a flashcard</h3>
          <div className="space-y-3 mt-4">
            <input required value={form.front} onChange={e=>setForm({...form,front:e.target.value})} placeholder="Front — the question / prompt" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            <input required value={form.back} onChange={e=>setForm({...form,back:e.target.value})} placeholder="Back — the answer" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">{CAPS_SUBJECTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
            <button className="w-full bg-violet-600 text-white font-black py-3 rounded-xl">Add flashcard</button>
          </div>
        </form>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
          <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><Sparkles className="w-5 h-5 text-violet-600"/> Generate from notes</h3>
          <div className="flex gap-2 mt-4">
            <select value={noteId} onChange={e=>setNoteId(e.target.value)} className="flex-1 border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none"><option value="">Choose a note…</option>{notes.map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select>
            <button onClick={genFromNote} className="bg-[#0B1F4A] text-white text-sm font-bold px-4 rounded-xl">Generate</button>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-xs font-bold text-slate-500"><span>Mastered</span><span>{knownCount}/{cards.length}</span></div>
            <div className="h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{width: cards.length? (knownCount/cards.length*100)+"%":"0%"}}/></div>
          </div>
          <div className="mt-4 space-y-2 max-h-[260px] overflow-y-auto">
            {cards.map((c,i)=>(<div key={c.id} className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5"><button onClick={()=>{setIdx(i);setFlipped(false);}} className="flex-1 text-left text-xs font-semibold text-slate-600 truncate">{c.front}</button>{c.known&&<CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/>}<button onClick={()=>del(c.id)} className="text-slate-300 hover:text-red-500 shrink-0"><Trash2 className="w-3.5 h-3.5"/></button></div>))}
            {!cards.length && <p className="text-sm text-slate-400 text-center py-4">No flashcards yet.</p>}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        {card ? (
          <div>
            <div className="flex items-center justify-between mb-3"><span className="text-xs font-black text-slate-400 uppercase tracking-wide">Card {idx+1} of {cards.length} • {card.subject}</span><span className="text-xs font-bold text-slate-400">Tap card to flip</span></div>
            <div className="card-flip h-[340px] cursor-pointer" onClick={()=>setFlipped(f=>!f)}>
              <div className={`card-inner w-full h-full ${flipped?"card-flipped":""}`}>
                <div className="card-face absolute inset-0 grad-bg rounded-[28px] text-white flex flex-col items-center justify-center p-8 text-center shadow-2xl">
                  <span className="text-xs font-black tracking-widest text-white/60 uppercase">Question</span>
                  <p className="text-xl sm:text-2xl font-black leading-snug mt-4">{card.front}</p>
                  <span className="mt-6 text-xs font-bold bg-white/15 px-4 py-2 rounded-full flex items-center gap-1.5"><Eye className="w-3.5 h-3.5"/> Tap to reveal answer</span>
                </div>
                <div className="card-face card-back bg-white border-2 border-violet-200 rounded-[28px] flex flex-col items-center justify-center p-8 text-center shadow-2xl">
                  <span className="text-xs font-black tracking-widest text-violet-500 uppercase">Answer</span>
                  <p className="text-xl sm:text-2xl font-black text-[#0B1F4A] leading-snug mt-4">{card.back}</p>
                  <span className="mt-6 text-xs font-bold bg-violet-50 text-violet-700 px-4 py-2 rounded-full">Tap to flip back</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={()=>mark(false)} className="flex-1 border-2 border-red-200 text-red-600 font-black py-3.5 rounded-2xl hover:bg-red-50 flex items-center justify-center gap-2"><X className="w-5 h-5"/> Still learning</button>
              <button onClick={()=>mark(true)} className="flex-1 bg-emerald-600 text-white font-black py-3.5 rounded-2xl hover:bg-emerald-700 flex items-center justify-center gap-2"><Check className="w-5 h-5"/> I know this</button>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={()=>{setIdx(i=>(i-1+cards.length)%cards.length);setFlipped(false);}} className="text-xs font-bold border border-slate-200 bg-white px-4 py-2 rounded-full">← Previous</button>
              <button onClick={()=>{setIdx(i=>(i+1)%cards.length);setFlipped(false);}} className="text-xs font-bold border border-slate-200 bg-white px-4 py-2 rounded-full">Next →</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center"><Layers className="w-12 h-12 text-slate-300 mx-auto"/><h3 className="font-black text-lg text-[#0B1F4A] mt-4">No flashcards to practise</h3><p className="text-sm text-slate-400 mt-2">Create one manually or generate a set from your notes.</p></div>
        )}
      </div>
    </div>
  );
}

/* ---------------- EXAMS ---------------- */
function Exams({ user, showToast, dash, refresh }: any) {
  const [exams, setExams] = useState<any[]>([]); const [checklist, setChecklist] = useState<any[]>([]);
  const [examForm, setExamForm] = useState({title:"",subject:user.subjects?.[0]||"Mathematics",examDate:"",type:"Exam"});
  const [itemLabel, setItemLabel] = useState(""); const [itemSubject, setItemSubject] = useState(user.subjects?.[0]||"Mathematics");
  const [ttDays, setTtDays] = useState(7);
  const load = ()=> api("/api/exams").then(d=>{setExams(d.exams||[]);setChecklist(d.checklist||[]);}).catch(()=>{});
  useEffect(()=>{load();},[]);
  const addExam = async (e:any)=>{ e.preventDefault(); try { const d = await api("/api/exams",{method:"POST",body:{kind:"exam",...examForm}}); setExams(x=>[d.exam,...x]); setExamForm({title:"",subject:examForm.subject,examDate:"",type:"Exam"}); showToast("Exam added!"); refresh?.(); } catch(ex:any){ showToast(ex.message); } };
  const addItem = async (e:any)=>{ e.preventDefault(); if(!itemLabel.trim())return; try { const d = await api("/api/exams",{method:"POST",body:{kind:"checklist",label:itemLabel,subject:itemSubject}}); setChecklist(x=>[d.item,...x]); setItemLabel(""); } catch(ex:any){ showToast(ex.message); } };
  const toggle = async (it:any)=>{ const d = await api("/api/exams",{method:"PATCH",body:{id:it.id,done:!it.done}}); setChecklist(c=>c.map(x=>x.id===it.id?d.item:x)); };
  const del = async (kind:string,id:number)=>{ await api("/api/exams",{method:"DELETE",body:{kind,id}}); load(); };
  const timetable = async ()=>{ try { const d = await api("/api/exams",{method:"POST",body:{kind:"timetable",subjects:user.subjects?.length?user.subjects:["Mathematics","English"],days:ttDays}}); setChecklist(c=>[...d.items,...c]); showToast(`${ttDays}-day timetable added to your checklist!`); } catch(e:any){ showToast(e.message); } };
  return (
    <div className="grid lg:grid-cols-5 gap-5 fade-up">
      <div className="lg:col-span-2 space-y-5">
        <form onSubmit={addExam} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
          <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><CalendarDays className="w-5 h-5 text-violet-600"/> Add an exam / test</h3>
          <div className="space-y-3 mt-4">
            <input required value={examForm.title} onChange={e=>setExamForm({...examForm,title:e.target.value})} placeholder="e.g. Maths Paper 1" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            <select value={examForm.subject} onChange={e=>setExamForm({...examForm,subject:e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">{CAPS_SUBJECTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
            <div className="grid grid-cols-2 gap-3">
              <input required type="date" value={examForm.examDate} onChange={e=>setExamForm({...examForm,examDate:e.target.value})} className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none"/>
              <select value={examForm.type} onChange={e=>setExamForm({...examForm,type:e.target.value})} className="border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none"><option>Exam</option><option>Test</option><option>Assignment</option><option>Project</option></select>
            </div>
            <button className="w-full bg-violet-600 text-white font-black py-3 rounded-xl">Add exam</button>
          </div>
        </form>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
          <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><Clock className="w-5 h-5 text-violet-600"/> Study timetable</h3>
          <p className="text-xs text-slate-500 mt-1.5">Generate a day-by-day plan across your subjects.</p>
          <div className="flex gap-2 mt-3">
            <select value={ttDays} onChange={e=>setTtDays(Number(e.target.value))} className="flex-1 border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none"><option value={3}>3 days</option><option value={7}>7 days</option><option value={14}>14 days</option><option value={21}>21 days</option></select>
            <button onClick={timetable} className="bg-[#0B1F4A] text-white text-sm font-bold px-4 rounded-xl">Generate</button>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
          <h3 className="font-black text-[#0B1F4A]">My exams</h3>
          <div className="mt-3 space-y-2">
            {exams.length? exams.map(ex=>{ const days=Math.ceil((new Date(ex.examDate).getTime()-Date.now())/86400000); return (
              <div key={ex.id} className="flex items-center gap-3 border border-slate-200 rounded-2xl p-3.5">
                <div className="w-12 h-12 rounded-xl grad-bg text-white flex flex-col items-center justify-center shrink-0"><span className="font-black text-base leading-none">{days}</span><span className="text-[8px] font-bold text-white/70">DAYS</span></div>
                <div className="flex-1 min-w-0"><div className="font-bold text-sm text-[#0B1F4A] truncate">{ex.title}</div><div className="text-[11px] text-slate-400 font-semibold">{ex.subject} • {new Date(ex.examDate).toLocaleDateString("en-ZA",{day:"numeric",month:"short"})}</div></div>
                <button onClick={()=>del("exam",ex.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
              </div>);}) : <p className="text-sm text-slate-400 py-3 text-center">No exams yet — add your next one above.</p>}
          </div>
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
          <div className="flex items-center justify-between"><h3 className="font-black text-[#0B1F4A]">Revision checklist</h3><span className="text-xs font-bold text-slate-400">{checklist.filter(c=>c.done).length}/{checklist.length} done</span></div>
          <form onSubmit={addItem} className="flex gap-2 mt-4">
            <input value={itemLabel} onChange={e=>setItemLabel(e.target.value)} placeholder="e.g. Revise Chapter 5 — Algebra" className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/>
            <select value={itemSubject} onChange={e=>setItemSubject(e.target.value)} className="border border-slate-200 rounded-xl px-2 py-3 text-sm outline-none hidden sm:block">{CAPS_SUBJECTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
            <button className="bg-violet-600 text-white px-4 rounded-xl font-bold text-sm">Add</button>
          </form>
          <div className="mt-4 space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {checklist.length? checklist.map(it=>(
              <div key={it.id} className={`flex items-center gap-3 border rounded-2xl p-3.5 transition ${it.done?"border-emerald-200 bg-emerald-50/50":"border-slate-200"}`}>
                <button onClick={()=>toggle(it)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${it.done?"bg-emerald-500 border-emerald-500 text-white":"border-slate-300 text-transparent"}`}><Check className="w-4 h-4"/></button>
                <span className={`flex-1 text-sm font-semibold ${it.done?"line-through text-slate-400":"text-slate-700"}`}>{it.label}</span>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full shrink-0">{it.subject}</span>
                <button onClick={()=>del("checklist",it.id)} className="text-slate-300 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-10">Your checklist is empty. Add revision tasks or generate a timetable!</p>}
          </div>
          <div className="mt-5 bg-violet-50 border border-violet-100 rounded-2xl p-4 text-sm text-violet-900 flex gap-2"><Lightbulb className="w-5 h-5 shrink-0 text-violet-600"/><span><b>Exam tip:</b> revise in 45-minute focused blocks with 10-minute breaks, and test yourself with past papers — active recall beats re-reading every time.</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SETTINGS ---------------- */
function SettingsView({ user, setUser, showToast }: any) {
  const [form, setForm] = useState({name:user.name,country:user.country,grade:user.grade,curriculum:user.curriculum,dailyGoal:user.dailyGoal||30,subjects:user.subjects||[]});
  const toggleSubject = (s:string)=> setForm((f:any)=>({...f,subjects:f.subjects.includes(s)?f.subjects.filter((x:string)=>x!==s):[...f.subjects,s]}));
  const save = async (e:any)=>{ e.preventDefault(); try { const d = await api("/api/profile",{method:"PATCH",body:form}); setUser(d.user); showToast("Profile saved!"); } catch(ex:any){ showToast(ex.message); } };
  const setPlan = async (plan:string)=>{ try { const d = await api("/api/profile",{method:"PATCH",body:{plan}}); setUser(d.user); showToast(plan==="premium"?"Premium activated (beta — no payment taken).":"Switched to Free plan."); } catch(ex:any){ showToast(ex.message); } };
  return (
    <div className="grid lg:grid-cols-2 gap-5 fade-up">
      <form onSubmit={save} className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6">
        <h3 className="font-black text-[#0B1F4A] flex items-center gap-2"><User className="w-5 h-5 text-violet-600"/> My profile</h3>
        <div className="space-y-3 mt-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Country</label><input value={form.country} onChange={e=>setForm({...form,country:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"/></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Grade</label><select value={form.grade} onChange={e=>setForm({...form,grade:Number(e.target.value)})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">{GRADES.map(g=><option key={g} value={g}>Grade {g}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Curriculum</label><select value={form.curriculum} onChange={e=>setForm({...form,curriculum:e.target.value})} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none">{CURRICULUMS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Daily goal (min)</label><input type="number" min={5} max={300} value={form.dailyGoal} onChange={e=>setForm({...form,dailyGoal:Number(e.target.value)})} className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"/></div>
          </div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">My subjects</label><div className="flex flex-wrap gap-2 mt-2">{CAPS_SUBJECTS.map(s=>(<button type="button" key={s.name} onClick={()=>toggleSubject(s.name)} className={`text-xs font-bold px-3 py-2 rounded-full border ${form.subjects.includes(s.name)?"bg-violet-600 text-white border-violet-600":"border-slate-200 text-slate-600"}`}>{s.name}</button>))}</div></div>
          <button className="w-full bg-violet-600 text-white font-black py-3 rounded-xl">Save changes</button>
        </div>
      </form>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={`rounded-3xl border-2 p-6 ${user.plan==="free"?"border-violet-600 bg-violet-50/50":"border-slate-200 bg-white"}`}>
            <p className="font-black text-[#0B1F4A]">FREE</p><p className="text-3xl font-black mt-1">R0</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">{["20 AI questions / day","Basic quizzes & flashcards","Limited summaries"].map(t=>(<li key={t} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5"/>{t}</li>))}</ul>
            <button onClick={()=>setPlan("free")} className="mt-5 w-full border-2 border-slate-300 font-black py-2.5 rounded-xl text-sm disabled:opacity-50" disabled={user.plan==="free"}>{user.plan==="free"?"Current plan":"Switch to Free"}</button>
          </div>
          <div className={`rounded-3xl border-2 p-6 relative ${user.plan==="premium"?"border-violet-600 bg-gradient-to-b from-violet-50 to-white":"border-slate-200 bg-white"}`}>
            <p className="font-black text-violet-700 flex items-center gap-1"><Crown className="w-4 h-4"/> PREMIUM</p><p className="text-3xl font-black mt-1">R49<span className="text-sm text-slate-400 font-semibold">/mo</span></p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">{["200 AI questions / day","Advanced assistance","More uploads","Advanced exam prep","Detailed analytics"].map(t=>(<li key={t} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-violet-600 mt-0.5"/>{t}</li>))}</ul>
            <button onClick={()=>setPlan("premium")} className="mt-5 w-full bg-violet-600 text-white font-black py-2.5 rounded-xl text-sm disabled:opacity-50" disabled={user.plan==="premium"}>{user.plan==="premium"?"Current plan":"Activate Premium"}</button>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-sm text-amber-800 flex gap-2"><CreditCard className="w-5 h-5 shrink-0"/><span><b>Payments:</b> no charges are made until our payment system is properly configured. Premium can be activated free during beta.</span></div>
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5">
          <h3 className="font-black text-[#0B1F4A]">Privacy & security</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex gap-2"><Shield className="w-4 h-4 text-emerald-500 mt-0.5"/> Passwords are hashed — never stored in plain text</li>
            <li className="flex gap-2"><Shield className="w-4 h-4 text-emerald-500 mt-0.5"/> Your notes and progress are private to your account</li>
            <li className="flex gap-2"><Shield className="w-4 h-4 text-emerald-500 mt-0.5"/> API keys (if configured) stay on the server, never in the browser</li>
          </ul>
          <p className="text-xs text-slate-400 mt-4">Account: {user.email}</p>
        </div>
      </div>
    </div>
  );
}
