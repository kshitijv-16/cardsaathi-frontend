import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const API = "https://cardsaathi-backend.up.railway.app";

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, dark, toggleTheme, t }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Fake stored users in localStorage
  const getUsers = () => JSON.parse(localStorage.getItem("cs_users") || "{}");
  const saveUsers = (u) => localStorage.setItem("cs_users", JSON.stringify(u));

  const handle = () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (isSignup && !name)   { setError("Please enter your name."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (isSignup) {
        if (users[email]) { setError("Account already exists. Please log in."); setLoading(false); return; }
        users[email] = { name, password };
        saveUsers(users);
        onLogin(name);
      } else {
        const user = users[email];
        if (!user)                    { setError("No account found. Please sign up."); setLoading(false); return; }
        if (user.password !== password) { setError("Incorrect password."); setLoading(false); return; }
        onLogin(user.name);
      }
      setLoading(false);
    }, 700);
  };

  const inp = {
    width:"100%", padding:"12px 16px", borderRadius:12, fontSize:14,
    background:t.card, border:`1px solid ${t.border}`, color:t.text,
    outline:"none", fontFamily:"'Sora',sans-serif", marginBottom:12,
    transition:"border-color .2s", boxSizing:"border-box",
  };

  return (
    <div style={{minHeight:"100vh", background:t.bg, display:"flex", flexDirection:"column", fontFamily:"'Sora',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .login-card{animation:fadeUp .5s ease}
        input:focus{border-color:${t.accent} !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15)}
        button:hover{opacity:.88}
      `}</style>

      {/* Nav */}
      <nav style={{padding:"14px 28px", display:"flex", justifyContent:"space-between", alignItems:"center",
        borderBottom:`1px solid ${t.border}`, background:t.bg}}>
        <div style={{fontSize:20, fontWeight:800,
          background:`linear-gradient(135deg,#a78bfa,#e879f9)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
          💳 CardSaathi
        </div>
        <button onClick={toggleTheme} style={{background:"transparent", border:`1px solid ${t.border}`,
          borderRadius:20, padding:"6px 16px", fontSize:12, fontWeight:600,
          color:t.muted, cursor:"pointer", fontFamily:"'Sora',sans-serif"}}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>

      {/* Main */}
      <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px"}}>
        <div style={{width:"100%", maxWidth:420}}>

          {/* Logo area */}
          <div style={{textAlign:"center", marginBottom:32}} className="login-card">
            <div style={{fontSize:48, marginBottom:12, animation:"float 3s ease-in-out infinite"}}>💳</div>
            <h1 style={{fontSize:28, fontWeight:800, marginBottom:6,
              background:`linear-gradient(135deg,#a78bfa,#e879f9,#60a5fa)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
              CardSaathi
            </h1>
            <p style={{fontSize:13, color:t.muted}}>AI-Powered Credit Card Advisor for India</p>
          </div>

          {/* Card */}
          <div className="login-card" style={{background:t.surface, border:`1px solid ${t.border}`,
            borderRadius:20, padding:"28px 28px", boxShadow:`0 20px 60px rgba(0,0,0,0.2)`}}>

            {/* Toggle */}
            <div style={{display:"flex", background:t.card, borderRadius:12, padding:4, marginBottom:24}}>
              {["Login","Sign Up"].map((l,i) => (
                <button key={i} onClick={()=>{setIsSignup(i===1);setError("")}} style={{
                  flex:1, padding:"8px", borderRadius:10, border:"none", fontSize:13, fontWeight:700,
                  cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all .2s",
                  background: (i===1)===isSignup ? `linear-gradient(135deg,${t.accent},#a855f7)` : "transparent",
                  color: (i===1)===isSignup ? "#fff" : t.muted,
                  boxShadow: (i===1)===isSignup ? `0 4px 12px rgba(124,58,237,0.3)` : "none",
                }}>{l}</button>
              ))}
            </div>

            {/* Fields */}
            {isSignup && (
              <input style={inp} placeholder="👤 Your Full Name" value={name}
                onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            )}
            <input style={inp} placeholder="📧 Email Address" value={email} type="email"
              onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
            <input style={{...inp, marginBottom:error?8:20}} placeholder="🔒 Password" value={password} type="password"
              onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>

            {/* Error */}
            {error && (
              <div style={{fontSize:12, color:t.danger, background:`rgba(248,113,113,0.08)`,
                border:`1px solid rgba(248,113,113,0.2)`, borderRadius:8, padding:"8px 12px", marginBottom:16}}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button onClick={handle} disabled={loading} style={{
              width:"100%", padding:"13px", borderRadius:12, border:"none", fontSize:15, fontWeight:700,
              background:`linear-gradient(135deg,${t.accent},#a855f7)`, color:"#fff",
              cursor:loading?"not-allowed":"pointer", fontFamily:"'Sora',sans-serif",
              boxShadow:`0 4px 20px rgba(124,58,237,0.35)`, opacity:loading?0.7:1,
            }}>
              {loading ? "⏳ Please wait..." : isSignup ? "🚀 Create Account" : "✨ Login to CardSaathi"}
            </button>

            {/* Demo hint */}
            <div style={{textAlign:"center", marginTop:16, fontSize:11, color:t.muted}}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <span onClick={()=>{setIsSignup(!isSignup);setError("")}}
                style={{color:t.accentLight, cursor:"pointer", fontWeight:600}}>
                {isSignup ? "Login here" : "Sign up free"}
              </span>
            </div>

            {/* Demo credentials */}
            <div style={{marginTop:16, background:t.card, borderRadius:10, padding:"10px 14px",
              fontSize:11, color:t.muted, textAlign:"center"}}>
              💡 <strong style={{color:t.text}}>Demo:</strong> Use any email + any 4-char password to sign up
            </div>
          </div>

          {/* Footer */}
          <p style={{textAlign:"center", fontSize:11, color:t.muted, marginTop:20}}>
            🔒 Your data stays on your device · No server required
          </p>
        </div>
      </div>
    </div>
  );
}

const SPEND_CATS = [
  { key:"travel",        label:"✈️ Travel",           color:"#a78bfa", default:2000 },
  { key:"dining",        label:"🍽️ Dining & Food",    color:"#34d399", default:2000 },
  { key:"shopping",      label:"🛍️ Online Shopping",  color:"#60a5fa", default:3000 },
  { key:"grocery",       label:"🛒 Groceries",         color:"#fbbf24", default:2000 },
  { key:"entertainment", label:"🎬 Entertainment",     color:"#f472b6", default:1000 },
  { key:"fuel",          label:"⛽ Fuel",              color:"#fb923c", default:1000 },
  { key:"utilities",     label:"💡 Bills & Utilities", color:"#2dd4bf", default:1000 },
];

// ── THEME ─────────────────────────────────────────────────────────────────────
const DARK = {
  bg:"#050912", surface:"#0a0f1e", card:"#111827", border:"#1a2035",
  text:"#f1f5f9", muted:"#475569", accent:"#7c3aed", accentLight:"#a78bfa",
  success:"#34d399", warning:"#fbbf24", danger:"#f87171",
};
const LIGHT = {
  bg:"#f8fafc", surface:"#ffffff", card:"#f1f5f9", border:"#e2e8f0",
  text:"#0f172a", muted:"#64748b", accent:"#7c3aed", accentLight:"#8b5cf6",
  success:"#059669", warning:"#d97706", danger:"#dc2626",
};

// ── CREDIT CARD VISUAL ────────────────────────────────────────────────────────
function CreditCardVisual({ card, size="normal" }) {
  const [flipped, setFlipped] = useState(false);
  const w = size==="small"?180:260, h=size==="small"?110:160;
  const g = card.gradient || ["#7c3aed","#a855f7"];
  return (
    <div onClick={()=>setFlipped(!flipped)} style={{width:w,height:h,perspective:1000,cursor:"pointer",flexShrink:0}} title="Click to flip">
      <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",
        transition:"transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        transform:flipped?"rotateY(180deg)":"rotateY(0deg)"}}>
        {/* Front */}
        <div style={{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden",
          background:`linear-gradient(135deg,${g[0]},${g[1]})`,borderRadius:14,
          padding:size==="small"?"12px 14px":"16px 20px",
          boxShadow:"0 20px 40px rgba(0,0,0,0.35)",display:"flex",flexDirection:"column",
          justifyContent:"space-between",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",zIndex:1}}>
            <div style={{fontSize:size==="small"?9:11,color:"rgba(255,255,255,0.65)",letterSpacing:2,fontWeight:700}}>{card.bank?.toUpperCase()}</div>
            <div style={{fontSize:size==="small"?10:12,color:"rgba(255,255,255,0.8)",fontWeight:800}}>{card.network}</div>
          </div>
          <div style={{zIndex:1}}>
            <div style={{fontSize:size==="small"?8:10,color:"rgba(255,255,255,0.4)",marginBottom:4,letterSpacing:3}}>•••• •••• •••• 4242</div>
            <div style={{fontSize:size==="small"?12:15,fontWeight:800,color:"#fff",lineHeight:1.2}}>{card.name}</div>
            <div style={{fontSize:size==="small"?9:10,color:"rgba(255,255,255,0.45)",marginTop:3}}>
              {card.fee===0?"LIFETIME FREE":`₹${card.fee?.toLocaleString()}/yr`}
            </div>
          </div>
        </div>
        {/* Back */}
        <div style={{position:"absolute",width:"100%",height:"100%",backfaceVisibility:"hidden",
          background:`linear-gradient(135deg,${g[1]},${g[0]})`,borderRadius:14,
          transform:"rotateY(180deg)",padding:"12px 14px",
          boxShadow:"0 20px 40px rgba(0,0,0,0.35)",display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
          <div style={{height:size==="small"?28:36,background:"rgba(0,0,0,0.45)",borderRadius:4}}/>
          <div style={{textAlign:"right",paddingRight:10}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.45)"}}>CVV</div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:4}}>•••</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,0.45)"}}>
            <span>{card.lounge?"🛫 Lounge Access":card.cashback?"💰 Cashback":"🎁 Rewards"}</span>
            <span>Forex: {card.forex}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CREDIT SCORE GAUGE ────────────────────────────────────────────────────────
function CreditScoreGauge({ score, theme: t }) {
  const pct = (score-300)/600;
  const angle = -135 + pct*270;
  const color = score>=750?"#34d399":score>=700?"#fbbf24":score>=650?"#fb923c":"#f87171";
  const label = score>=750?"Excellent":score>=700?"Good":score>=650?"Fair":"Poor";
  return (
    <div style={{textAlign:"center"}}>
      <svg width={160} height={110} viewBox="0 0 160 110">
        <path d="M 20 100 A 60 60 0 1 1 140 100" fill="none" stroke={t.border} strokeWidth={12} strokeLinecap="round"/>
        <path d="M 20 100 A 60 60 0 1 1 140 100" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          strokeDasharray={`${pct*188.5} 188.5`} style={{transition:"all 0.8s ease"}}/>
        <g transform={`translate(80,100) rotate(${angle})`}>
          <line x1={0} y1={0} x2={0} y2={-52} stroke={color} strokeWidth={2.5} strokeLinecap="round"/>
          <circle cx={0} cy={0} r={5} fill={color}/>
        </g>
        <text x={80} y={88} textAnchor="middle" fontSize={26} fontWeight={800} fill={color}>{score}</text>
        <text x={80} y={104} textAnchor="middle" fontSize={11} fill={t.muted}>{label}</text>
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",width:140,margin:"-8px auto 0",fontSize:10,color:t.muted}}>
        <span>300</span><span>900</span>
      </div>
    </div>
  );
}

// ── SPENDING PIE CHART ────────────────────────────────────────────────────────
function SpendingChart({ spend, theme: t }) {
  const data = SPEND_CATS.map(c=>({name:c.label,value:spend[c.key]||0,color:c.color})).filter(d=>d.value>0);
  if (!data.length) return <div style={{color:t.muted,textAlign:"center",padding:24,fontSize:13}}>No spending entered yet</div>;
  return (
    <div>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
            {data.map((e,i)=><Cell key={i} fill={e.color}/>)}
          </Pie>
          <Tooltip formatter={v=>`₹${v.toLocaleString()}`}
            contentStyle={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,color:t.text,fontSize:12}}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{display:"flex",flexWrap:"wrap",gap:"4px 10px",justifyContent:"center"}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:t.muted}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:d.color,flexShrink:0}}/>
            <span>{d.name.split(" ").slice(1).join(" ")}</span>
            <span style={{color:t.text,fontWeight:600}}>₹{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── COMPARISON TABLE ──────────────────────────────────────────────────────────
function ComparisonTable({ results, theme: t }) {
  const top3 = results.slice(0,3);
  const rows = [
    {label:"Annual Fee",    fn:r=>r.fee===0?"FREE ✅":`₹${r.fee.toLocaleString()}`},
    {label:"Cashback",      fn:r=>r.cashback?"Yes ✅":"Points"},
    {label:"Lounge Access", fn:r=>r.lounge?(r.loungeN===999?"Unlimited ✅":`${r.loungeN}/yr ✅`):"No ❌"},
    {label:"Forex Markup",  fn:r=>`${r.forex}%${r.forex<=2?" 🌍":""}`},
    {label:"Min Salary",    fn:r=>`₹${(r.minSal/1000).toFixed(0)}K/mo`},
    {label:"Min Score",     fn:r=>`${r.minScore}+`},
    {label:"ML Match",      fn:r=>`${r.matchScore}%`},
  ];
  return (
    <div style={{overflowX:"auto",borderRadius:12,border:`1px solid ${t.border}`}}>
      <table style={{width:"100%",borderCollapse:"collapse",background:t.surface}}>
        <thead>
          <tr>
            <th style={{background:t.card,padding:"10px 14px",fontSize:12,fontWeight:700,color:t.accentLight,textAlign:"left",border:`1px solid ${t.border}`}}>Feature</th>
            {top3.map((r,i)=>(
              <th key={i} style={{background:t.card,padding:"10px 14px",fontSize:11,fontWeight:700,color:t.accentLight,textAlign:"center",border:`1px solid ${t.border}`}}>
                {i===0&&<div style={{fontSize:9,background:t.accent,color:"#fff",borderRadius:10,padding:"1px 8px",marginBottom:4}}>★ BEST</div>}
                {r.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i)=>(
            <tr key={i} style={{background:i%2===0?t.surface:t.card}}>
              <td style={{padding:"9px 14px",fontSize:12,color:t.muted,border:`1px solid ${t.border}`,fontWeight:600}}>{row.label}</td>
              {top3.map((r,j)=><td key={j} style={{padding:"9px 14px",fontSize:12,color:t.text,textAlign:"center",border:`1px solid ${t.border}`}}>{row.fn(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── CHAT BUBBLE ───────────────────────────────────────────────────────────────
function ChatBubble({ msg, theme: t }) {
  const isUser = msg.role==="user";
  const html = msg.content.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>");
  return (
    <div style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",marginBottom:10}}>
      {!isUser&&<div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${t.accent},#a855f7)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:8,marginTop:2}}>🤖</div>}
      <div style={{maxWidth:"78%",padding:"10px 14px",fontSize:13,lineHeight:1.7,
        borderRadius:isUser?"16px 16px 4px 16px":"16px 16px 16px 4px",
        background:isUser?`linear-gradient(135deg,${t.accent},#6d28d9)`:t.card,
        color:isUser?"#fff":t.text,border:isUser?"none":`1px solid ${t.border}`,
        boxShadow:isUser?`0 4px 12px rgba(124,58,237,0.3)`:"none"
      }} dangerouslySetInnerHTML={{__html:html}}/>
    </div>
  );
}

// ── API STATUS BADGE ──────────────────────────────────────────────────────────
function APIBadge({ status, theme: t }) {
  const configs = {
    checking: { color:"#fbbf24", label:"Checking API..." },
    online:   { color:"#34d399", label:"Flask API Online ✓" },
    offline:  { color:"#f87171", label:"Flask API Offline ✗" },
  };
  const c = configs[status] || configs.checking;
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:11,
      background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"4px 12px"}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:c.color,
        boxShadow:`0 0 6px ${c.color}`}}/>
      <span style={{color:t.muted}}>{c.label}</span>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]       = useState(true);
  const [user, setUser]       = useState(() => localStorage.getItem("cs_user") || null);
  const [page, setPage]       = useState("home");
  const [apiStatus, setApiStatus] = useState("checking");
  const [profile, setProfile] = useState({salary:50000,score:720,wantsLounge:false,wantsFree:false,wantsCashback:false});
  const [spend, setSpend]     = useState(Object.fromEntries(SPEND_CATS.map(c=>[c.key,c.default])));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chat, setChat]       = useState([]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const chatEndRef = useRef(null);
  const t = dark ? DARK : LIGHT;

  const handleLogin = (name) => { localStorage.setItem("cs_user", name); setUser(name); };
  const handleLogout = () => { localStorage.removeItem("cs_user"); setUser(null); setPage("home"); setResults([]); setChat([]); };

  // Show login page if not logged in
  if (!user) return <LoginPage onLogin={handleLogin} dark={dark} toggleTheme={()=>setDark(!dark)} t={t}/>;

  // Check API health on load
  useEffect(()=>{
    fetch(`${API}/health`)
      .then(r=>r.json())
      .then(()=>setApiStatus("online"))
      .catch(()=>setApiStatus("offline"));
  },[]);

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[chat]);

  const totalSpend = Object.values(spend).reduce((a,b)=>a+b,0);

  // ── Call /recommend API ──
  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/recommend`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          salary:   profile.salary,
          score:    profile.score,
          ...spend,
          wantsLounge:   profile.wantsLounge,
          wantsFree:     profile.wantsFree,
          wantsCashback: profile.wantsCashback,
        })
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setPage("results");
      } else {
        alert("Error from API: " + data.error);
      }
    } catch(e) {
      alert("❌ Could not connect to Flask API!\n\nMake sure you ran:\n  python app.py\n\nin your CardSaathi folder.");
    }
    setLoading(false);
  };

  // ── Call /chat API ──
  const sendMsg = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setChat(c=>[...c,{role:"user",content:q}]);
    setTyping(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          message:          q,
          topCard:          results[0]?.name || "",
          recommendedCards: results.map(r=>r.name),
        })
      });
      const data = await res.json();
      setChat(c=>[...c,{role:"bot",content:data.reply||"Sorry, I couldn't process that."}]);
    } catch(e) {
      setChat(c=>[...c,{role:"bot",content:"❌ Can't reach Flask API. Make sure `python app.py` is running!"}]);
    }
    setTyping(false);
  };

  const S = {
    app:{minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'Sora','DM Sans',system-ui,sans-serif",transition:"background 0.3s,color 0.3s"},
    btn:{background:`linear-gradient(135deg,${t.accent},#a855f7)`,color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 20px rgba(124,58,237,0.3)`,transition:"all 0.2s"},
    btnGhost:{background:"transparent",color:t.accentLight,border:`1px solid ${t.accentLight}`,borderRadius:12,padding:"10px 24px",fontSize:14,fontWeight:600,cursor:"pointer"},
    card:{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,padding:"20px 24px"},
    input:{background:t.card,border:`1px solid ${t.border}`,borderRadius:10,padding:"10px 14px",color:t.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"},
    range:{width:"100%",accentColor:t.accent,cursor:"pointer"},
  };

  // ── SHARED NAV + LAYOUT ──────────────────────────────────────────────────
  const steps = ["profile","spend","results","chat"];
  const stepLabels = ["1·Profile","2·Spending","3·Results","4·Ask AI"];

  const Layout = ({children,title,sub}) => (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fade-up{animation:fadeUp 0.4s ease forwards}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:${t.border};outline:none}
        input[type=range]::-webkit-slider-thumb{width:18px;height:18px;border-radius:50%;background:${t.accent};cursor:pointer;-webkit-appearance:none}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${t.bg}}::-webkit-scrollbar-thumb{background:${t.border};border-radius:2px}
        button:hover{opacity:0.88}
      `}</style>
      <nav style={{padding:"13px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:`1px solid ${t.border}`,background:t.bg,position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",fontSize:18,fontWeight:800,cursor:"pointer",
          background:`linear-gradient(135deg,${t.accentLight},#e879f9)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          💳 CardSaathi
        </button>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          {stepLabels.map((l,i)=>(
            <div key={i} onClick={()=>i<steps.indexOf(page)&&setPage(steps[i])}
              style={{fontSize:11,padding:"4px 10px",borderRadius:16,fontWeight:600,
                cursor:i<steps.indexOf(page)?"pointer":"default",
                background:steps[i]===page?`rgba(124,58,237,0.2)`:i<steps.indexOf(page)?"rgba(52,211,153,0.1)":"transparent",
                color:steps[i]===page?t.accentLight:i<steps.indexOf(page)?t.success:t.muted,
                border:`1px solid ${steps[i]===page?"rgba(124,58,237,0.4)":i<steps.indexOf(page)?"rgba(52,211,153,0.3)":t.border}`}}>
              {i<steps.indexOf(page)?"✓ "+l:l}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <APIBadge status={apiStatus} theme={t}/>
          <div style={{fontSize:13,fontWeight:600,color:t.accentLight,
            background:`rgba(124,58,237,0.1)`,border:`1px solid rgba(124,58,237,0.2)`,
            borderRadius:20,padding:"5px 14px"}}>
            👋 {user}
          </div>
          <button onClick={()=>setDark(!dark)} style={{...S.btnGhost,padding:"6px 14px",fontSize:12}}>{dark?"☀️":"🌙"}</button>
          <button onClick={handleLogout} style={{...S.btnGhost,padding:"6px 14px",fontSize:12,color:t.muted,borderColor:t.border}}>Logout</button>
        </div>
      </nav>
      <div style={{maxWidth:780,margin:"0 auto",padding:"30px 20px 60px"}}>
        <div className="fade-up">
          <h2 style={{fontSize:24,fontWeight:800,marginBottom:4}}>{title}</h2>
          <p style={{color:t.muted,fontSize:13,marginBottom:24}}>{sub}</p>
        </div>
        {apiStatus==="offline"&&(
          <div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:13,color:t.danger}}>
            ⚠️ Flask API is offline! Open a terminal and run: <code style={{background:t.card,padding:"2px 8px",borderRadius:6,marginLeft:6}}>python app.py</code>
          </div>
        )}
        {children}
      </div>
    </div>
  );

  // ── HOME PAGE ──────────────────────────────────────────────────────────────
  if (page==="home") return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .float{animation:float 4s ease-in-out infinite}
        .fade-up{animation:fadeUp 0.6s ease forwards;opacity:0}
        button:hover{opacity:0.88}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${t.bg}}::-webkit-scrollbar-thumb{background:${t.border};border-radius:2px}
      `}</style>
      <nav style={{padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:`1px solid ${t.border}`,position:"sticky",top:0,background:t.bg,zIndex:100}}>
        <div style={{fontSize:20,fontWeight:800,background:`linear-gradient(135deg,${t.accentLight},#e879f9)`,
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>💳 CardSaathi</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <APIBadge status={apiStatus} theme={t}/>
          <div style={{fontSize:13,fontWeight:600,color:t.accentLight,
            background:`rgba(124,58,237,0.1)`,border:`1px solid rgba(124,58,237,0.2)`,
            borderRadius:20,padding:"5px 14px"}}>
            👋 {user}
          </div>
          <button onClick={()=>setDark(!dark)} style={{...S.btnGhost,padding:"8px 16px",fontSize:12}}>{dark?"☀️ Light":"🌙 Dark"}</button>
          <button onClick={()=>setPage("profile")} style={{...S.btn,padding:"10px 22px",fontSize:14}}>Get Started →</button>
          <button onClick={handleLogout} style={{...S.btnGhost,padding:"8px 14px",fontSize:12,color:t.muted,borderColor:t.border}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:900,margin:"0 auto",padding:"56px 24px 40px",textAlign:"center"}}>
        <div className="fade-up" style={{animationDelay:"0.05s"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,
            background:dark?"rgba(124,58,237,0.1)":"rgba(124,58,237,0.07)",
            border:"1px solid rgba(124,58,237,0.3)",borderRadius:20,padding:"5px 16px",color:t.accentLight,marginBottom:22}}>
            🤖 Random Forest ML + TF-IDF NLP · Flask API Backend
          </div>
        </div>
        <div className="fade-up" style={{animationDelay:"0.1s"}}>
          <h1 style={{fontSize:"clamp(34px,5.5vw,60px)",fontWeight:800,lineHeight:1.1,marginBottom:18}}>
            Find Your Perfect<br/>
            <span style={{background:`linear-gradient(135deg,${t.accentLight},#e879f9,#60a5fa)`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Credit Card</span> with AI
          </h1>
        </div>
        <div className="fade-up" style={{animationDelay:"0.15s"}}>
          <p style={{fontSize:17,color:t.muted,marginBottom:32,maxWidth:520,margin:"0 auto 32px"}}>
            Enter your salary and spending habits. Our ML model recommends the best Indian credit card for you — then chat with our AI advisor.
          </p>
        </div>
        <div className="fade-up" style={{animationDelay:"0.2s",display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setPage("profile")} style={{...S.btn,fontSize:15,padding:"13px 32px"}}>🚀 Get My Recommendation</button>
          <button onClick={()=>setPage("chat")} style={{...S.btnGhost,fontSize:14,padding:"13px 26px"}}>💬 Ask AI Directly</button>
        </div>

        {/* Floating cards */}
        <div style={{display:"flex",gap:18,justifyContent:"center",marginTop:48,flexWrap:"wrap"}}>
          {[
            {name:"HDFC Millennia",bank:"HDFC Bank",fee:1000,lounge:true,loungeN:8,cashback:true,forex:3.5,network:"MC",gradient:["#004C97","#0D47A1"]},
            {name:"HDFC Regalia",bank:"HDFC Bank",fee:2500,lounge:true,loungeN:32,cashback:false,forex:2.0,network:"VISA",gradient:["#1A237E","#283593"]},
            {name:"Axis Magnus",bank:"Axis Bank",fee:12500,lounge:true,loungeN:999,cashback:false,forex:2.0,network:"MC",gradient:["#212121","#37474F"]},
          ].map((c,i)=>(
            <div key={i} className="float" style={{animationDelay:`${i*0.35}s`}}>
              <CreditCardVisual card={c} size="small"/>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:44,maxWidth:520,margin:"44px auto 0"}}>
          {[["10+","Indian Credit Cards"],["94%","ML Accuracy"],["NLP","TF-IDF Chatbot"]].map(([v,l],i)=>(
            <div key={i} style={{...S.card,textAlign:"center",padding:"16px"}}>
              <div style={{fontSize:24,fontWeight:800,color:t.accentLight}}>{v}</div>
              <div style={{fontSize:11,color:t.muted,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>

        {/* API status help */}
        {apiStatus==="offline"&&(
          <div style={{marginTop:28,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.25)",
            borderRadius:12,padding:"14px 20px",fontSize:13,color:t.danger,maxWidth:480,margin:"28px auto 0"}}>
            ⚠️ Flask backend is not running!<br/>
            <span style={{color:t.muted}}>Open a terminal in your CardSaathi folder and run:</span><br/>
            <code style={{background:t.card,padding:"4px 10px",borderRadius:6,display:"inline-block",marginTop:6,color:t.text}}>python app.py</code>
          </div>
        )}
      </div>
    </div>
  );

  // ── PROFILE PAGE ──────────────────────────────────────────────────────────
  if (page==="profile") return (
    <Layout title="👤 Your Financial Profile" sub="We use this to filter cards you're actually eligible for">
      <div style={{...S.card,marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:t.muted,marginBottom:10}}>💰 Monthly Salary</div>
            <input type="range" style={S.range} min={10000} max={500000} step={5000}
              value={profile.salary} onChange={e=>setProfile({...profile,salary:+e.target.value})}/>
            <div style={{textAlign:"center",fontSize:26,fontWeight:800,color:t.accentLight,marginTop:8}}>
              {profile.salary<100000?`₹${(profile.salary/1000).toFixed(0)}K`:`₹${(profile.salary/100000).toFixed(1)}L`}
              <span style={{fontSize:12,color:t.muted,fontWeight:400}}>/month</span>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:t.muted,marginBottom:6}}>📊 Credit Score</div>
            <CreditScoreGauge score={profile.score} theme={t}/>
            <input type="range" style={{...S.range,marginTop:2}} min={500} max={900} step={10}
              value={profile.score} onChange={e=>setProfile({...profile,score:+e.target.value})}/>
          </div>
        </div>
      </div>
      <div style={{...S.card,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:t.muted,marginBottom:12}}>✨ Preferences</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["wantsLounge","🛫 Lounge Access"],["wantsFree","🆓 No Annual Fee"],["wantsCashback","💰 Cashback"]].map(([k,l])=>(
            <button key={k} onClick={()=>setProfile({...profile,[k]:!profile[k]})} style={{
              padding:"8px 18px",borderRadius:20,fontSize:13,cursor:"pointer",fontWeight:600,transition:"all 0.2s",
              background:profile[k]?"rgba(124,58,237,0.2)":"transparent",
              color:profile[k]?t.accentLight:t.muted,
              border:`1px solid ${profile[k]?"rgba(124,58,237,0.5)":t.border}`}}>{l}</button>
          ))}
        </div>
      </div>
      <button onClick={()=>setPage("spend")} style={{...S.btn,width:"100%"}}>Next: Enter Spending →</button>
    </Layout>
  );

  // ── SPENDING PAGE ─────────────────────────────────────────────────────────
  if (page==="spend") return (
    <Layout title="💸 Monthly Spending" sub="Drag sliders — our ML model calculates exact rewards per card">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={S.card}>
          {SPEND_CATS.map(cat=>(
            <div key={cat.key} style={{marginBottom:13}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                <span style={{color:t.muted}}>{cat.label}</span>
                <span style={{fontWeight:700,color:cat.color}}>₹{(spend[cat.key]||0).toLocaleString()}</span>
              </div>
              <input type="range" style={{...S.range,accentColor:cat.color}} min={0} max={30000} step={500}
                value={spend[cat.key]||0} onChange={e=>setSpend({...spend,[cat.key]:+e.target.value})}/>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${t.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <span style={{color:t.muted,fontSize:13}}>Total monthly spend</span>
            <span style={{fontSize:20,fontWeight:800,color:t.accentLight}}>₹{totalSpend.toLocaleString()}</span>
          </div>
        </div>
        <div style={S.card}>
          <div style={{fontSize:13,fontWeight:600,color:t.muted,marginBottom:10}}>📊 Spending Breakdown</div>
          <SpendingChart spend={spend} theme={t}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setPage("profile")} style={S.btnGhost}>← Back</button>
        <button onClick={getRecommendations} disabled={loading} style={{...S.btn,flex:1,opacity:loading?0.7:1}}>
          {loading?"🤖 ML Model Running...":"🚀 Get My AI Recommendations"}
        </button>
      </div>
    </Layout>
  );

  // ── RESULTS PAGE ──────────────────────────────────────────────────────────
  if (page==="results") return (
    <Layout title="🎯 Your Recommendations" sub={`ML model matched ${results.length} cards to your profile`}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        {[
          {label:"Top Match",val:results[0]?.name,color:t.accentLight},
          {label:"Cards Eligible",val:`${results.length} / 10`,color:t.success},
          {label:"Top Card Fee",val:results[0]?.fee===0?"FREE ✅":`₹${results[0]?.fee?.toLocaleString()}`,color:t.warning},
        ].map(({label,val,color},i)=>(
          <div key={i} style={{...S.card,textAlign:"center",padding:"14px"}}>
            <div style={{fontSize:11,color:t.muted,marginBottom:4}}>{label}</div>
            <div style={{fontSize:14,fontWeight:800,color}}>{val}</div>
          </div>
        ))}
      </div>

      {results.map((r,i)=>(
        <div key={r.id} style={{...S.card,marginBottom:12,
          border:`1px solid ${i===0?"rgba(124,58,237,0.45)":t.border}`,
          boxShadow:i===0?`0 0 20px rgba(124,58,237,0.1)`:"none"}}>
          {i===0&&<div style={{background:`linear-gradient(90deg,${t.accent},#a855f7)`,borderRadius:"10px 10px 0 0",
            margin:"-20px -24px 14px",padding:"4px",textAlign:"center",fontSize:10,fontWeight:800,color:"#fff",letterSpacing:2}}>
            ★ BEST MATCH FOR YOUR PROFILE</div>}
          <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
            <CreditCardVisual card={r} size="small"/>
            <div style={{flex:1,minWidth:180}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800}}>{r.name}</div>
                  <div style={{fontSize:11,color:t.muted}}>{r.bank}</div>
                </div>
                <div style={{textAlign:"center",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,padding:"6px 12px"}}>
                  <div style={{fontSize:20,fontWeight:800,color:t.accentLight}}>{r.matchScore}%</div>
                  <div style={{fontSize:9,color:t.muted}}>ML match</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                {[["Fee",r.fee===0?"FREE":`₹${r.fee.toLocaleString()}`,r.fee===0?t.success:t.text],
                  ["Min Salary",`₹${(r.minSal/1000).toFixed(0)}K`,t.text],
                  ["Min Score",`${r.minScore}+`,t.text],
                  ["Forex",`${r.forex}%`,r.forex<=2?t.success:t.text]
                ].map(([l,v,c],j)=>(
                  <div key={j} style={{background:t.card,borderRadius:8,padding:"4px 10px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:t.muted}}>{l}</div>
                    <div style={{fontSize:12,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {r.cashback&&<span style={{fontSize:10,background:"rgba(52,211,153,0.1)",color:t.success,border:"1px solid rgba(52,211,153,0.25)",borderRadius:20,padding:"2px 9px"}}>💰 Cashback</span>}
                {r.fee===0&&<span style={{fontSize:10,background:"rgba(251,191,36,0.1)",color:t.warning,border:"1px solid rgba(251,191,36,0.25)",borderRadius:20,padding:"2px 9px"}}>🆓 Lifetime Free</span>}
                {r.lounge&&<span style={{fontSize:10,background:"rgba(124,58,237,0.1)",color:t.accentLight,border:"1px solid rgba(124,58,237,0.25)",borderRadius:20,padding:"2px 9px"}}>🛫 {r.loungeN===999?"Unlimited":r.loungeN+"/yr"} Lounge</span>}
                {r.best?.map((b,j)=><span key={j} style={{fontSize:10,background:t.card,color:t.muted,border:`1px solid ${t.border}`,borderRadius:20,padding:"2px 9px"}}>✓ {b}</span>)}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div style={{...S.card,marginTop:4,marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>📊 Top 3 Comparison</div>
        <ComparisonTable results={results} theme={t}/>
      </div>

      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setPage("spend")} style={S.btnGhost}>← Edit Spending</button>
        <button onClick={()=>setPage("chat")} style={{...S.btn,flex:1}}>💬 Ask CardSaathi AI →</button>
      </div>
    </Layout>
  );

  // ── CHAT PAGE ─────────────────────────────────────────────────────────────
  if (page==="chat") return (
    <Layout title="🤖 Ask CardSaathi AI" sub="Powered by Flask API · TF-IDF + Cosine Similarity NLP">
      {results.length>0&&(
        <div style={{...S.card,marginBottom:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",padding:"12px 16px"}}>
          <span style={{fontSize:12,color:t.muted}}>🎯 Your top picks:</span>
          {results.slice(0,3).map((r,i)=>(
            <span key={i} style={{fontSize:12,fontWeight:600,
              background:i===0?"rgba(124,58,237,0.15)":t.card,
              color:i===0?t.accentLight:t.muted,
              border:`1px solid ${i===0?"rgba(124,58,237,0.3)":t.border}`,
              borderRadius:20,padding:"3px 10px"}}>
              {i===0?"★ ":""}{r.name}
            </span>
          ))}
        </div>
      )}

      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:t.muted,marginBottom:7}}>💬 Quick questions:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {["Which card is best for travel?","Which card has no annual fee?","How to improve my credit score?","Best card for cashback?","What is credit utilization?","Should I pay minimum due?"].map((q,i)=>(
            <button key={i} onClick={()=>sendMsg(q)} style={{fontSize:11,background:t.card,color:t.muted,
              border:`1px solid ${t.border}`,borderRadius:20,padding:"5px 12px",cursor:"pointer"}}>
              {q}
            </button>
          ))}
        </div>
      </div>

      <div style={{...S.card,height:360,overflowY:"auto",marginBottom:10}}>
        {chat.length===0&&(
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${t.accent},#a855f7)`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🤖</div>
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:"16px 16px 16px 4px",
              padding:"10px 14px",fontSize:13,color:t.text,lineHeight:1.6}}>
              👋 Hi! I'm <strong>CardSaathi AI</strong> powered by your Flask backend.
              {results.length>0?<span> Your top card is <strong>{results[0].name}</strong>.</span>:null} Ask me anything!
            </div>
          </div>
        )}
        {chat.map((msg,i)=><ChatBubble key={i} msg={msg} theme={t}/>)}
        {typing&&(
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${t.accent},#a855f7)`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:"16px 16px 16px 4px",
              padding:"12px 16px",display:"flex",gap:4}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:t.accentLight,
                animation:"pulse 1s infinite",animationDelay:`${i*0.2}s`}}/>)}
            </div>
          </div>
        )}
        <div ref={chatEndRef}/>
      </div>

      <div style={{display:"flex",gap:8}}>
        <input style={S.input} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Ask anything about credit cards..."/>
        <button onClick={()=>sendMsg()} disabled={!input.trim()||typing}
          style={{...S.btn,padding:"10px 20px",opacity:input.trim()&&!typing?1:0.5}}>➤</button>
      </div>

      <div style={{display:"flex",gap:10,marginTop:10}}>
        <button onClick={()=>setPage("results")} style={S.btnGhost}>← Results</button>
        <button onClick={()=>{setPage("home");setChat([]);setResults([]);}} style={{...S.btnGhost,marginLeft:"auto"}}>🔄 Start Over</button>
      </div>
    </Layout>
  );
}
