import { useState, useRef, useEffect } from "react";

const SUPABASE_URL = "https://rcqlohlftafxicmfjkuf.supabase.co";
const SUPABASE_KEY = "sb_publishable_JdGpHviVF_vdT43VKOrAWQ_xzRpBNN7";

const api = {
  async getSales() {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sales?date=gte.${today}&order=date.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async insertSale(sale: any, token: string) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sales`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(sale)
    });
    return res.json();
  },
  async signUp(email: string, password: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  async signIn(email: string, password: string) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  async signOut(token: string) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
    });
  }
};

const tagColors: Record<string, string> = {
  Furniture: "#f59e0b", Clothes: "#ec4899", Tools: "#3b82f6", Toys: "#8b5cf6",
  Antiques: "#d97706", Jewelry: "#f43f5e", Art: "#06b6d4", Books: "#10b981",
  Electronics: "#6366f1", Sports: "#22c55e", Baby: "#fb923c", "Hockey Gear": "#e11d48",
};

const provinces = [
  { code: "AB", name: "Alberta" }, { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" }, { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" }, { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" }, { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" }, { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Québec" }, { code: "SK", name: "Saskatchewan" }, { code: "YT", name: "Yukon" },
];

const tagOptions = ["Furniture","Clothes","Tools","Toys","Antiques","Jewelry","Art","Books","Electronics","Sports","Baby","Hockey Gear","Other"];
const emojis = ["🏠","🌻","📦","🛋️","🔑","🧺","🏡","🌼"];

export default function App() {
  const [view, setView] = useState("browse");
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [provFilter, setProvFilter] = useState("");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [authMode, setAuthMode] = useState<"login"|"signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState("");
  const [form, setForm] = useState({ title:"",name:"",address:"",city:"",province:"",date:"",startTime:"",endTime:"",description:"",tags:[] as string[],photos:[] as string[] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSales();
    const saved = localStorage.getItem("yh_user");
    const savedToken = localStorage.getItem("yh_token");
    if (saved && savedToken) {
      setUser(JSON.parse(saved));
      setToken(savedToken);
    }
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await api.getSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (e) { setSales([]); }
    setLoading(false);
  };

  const handleAuth = async () => {
    setAuthError("");
    setAuthSuccess("");
    if (!authEmail || !authPassword) { setAuthError("Please fill in all fields."); return; }
    if (authPassword.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const data = await api.signUp(authEmail, authPassword);
        if (data.error) { setAuthError(data.error.message || data.msg || "Signup failed."); }
        else { setAuthSuccess("✅ Account created! Please check your email to confirm, then log in."); setAuthMode("login"); }
      } else {
        const data = await api.signIn(authEmail, authPassword);
        if (data.error || !data.access_token) { setAuthError(data.error?.message || data.error_description || "Invalid email or password."); }
        else {
          setUser(data.user);
          setToken(data.access_token);
          localStorage.setItem("yh_user", JSON.stringify(data.user));
          localStorage.setItem("yh_token", data.access_token);
          setView("browse");
          setAuthEmail(""); setAuthPassword("");
        }
      }
    } catch(e) { setAuthError("Something went wrong. Please try again."); }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await api.signOut(token);
    setUser(null); setToken("");
    localStorage.removeItem("yh_user");
    localStorage.removeItem("yh_token");
    setView("browse");
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => { setForm(f => ({ ...f, photos: [...f.photos, ev.target?.result as string].slice(0, 6) })); };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.address || !form.city || !form.province || !form.date) return;
    setSubmitting(true);
    try {
      await api.insertSale({
        title: form.title, name: form.name, address: form.address,
        city: form.city, province: form.province, date: form.date,
        start_time: form.startTime, end_time: form.endTime,
        description: form.description, tags: form.tags,
        photos: form.photos, emoji: emojis[Math.floor(Math.random() * emojis.length)],
        user_id: user?.id
      }, token);
      await loadSales();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false); setView("browse");
        setForm({ title:"",name:"",address:"",city:"",province:"",date:"",startTime:"",endTime:"",description:"",tags:[],photos:[] });
      }, 2500);
    } catch(e) { alert("Something went wrong. Please try again."); }
    setSubmitting(false);
  };

  const filtered = sales.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.title?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q) || (s.tags||[]).some((t:string)=>t.toLowerCase().includes(q));
    const matchProv = !provFilter || s.province === provFilter;
    return matchSearch && matchProv;
  });

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#fdf6ec" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fdf6ec; }
        .card-hover { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        input, select, textarea { font-family: 'Source Serif 4', serif; }
        .tag-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .btn-primary { background: #c0392b; color: white; border: none; padding: 12px 28px; border-radius: 4px; font-size: 15px; cursor: pointer; font-family: 'Playfair Display', serif; font-weight: 700; transition: background 0.2s; }
        .btn-primary:hover { background: #96281b; }
        input[type=text], input[type=email], input[type=password], input[type=date], input[type=time], select, textarea { width: 100%; padding: 10px 14px; border: 1.5px solid #d6c4a8; border-radius: 4px; background: #fffdf8; font-size: 15px; color: #3a2c1a; outline: none; transition: border-color 0.2s; }
        input:focus, select:focus, textarea:focus { border-color: #c0392b; }
        label { display: block; font-size: 13px; font-weight: 600; color: #7a5c3a; margin-bottom: 5px; letter-spacing: 0.5px; text-transform: uppercase; }
        .photo-thumb { position: relative; width: 90px; height: 90px; border-radius: 6px; overflow: hidden; border: 2px solid #e8d9c4; flex-shrink: 0; }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .photo-remove { position: absolute; top: 3px; right: 3px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .upload-zone { border: 2px dashed #d6c4a8; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: border-color 0.2s; background: #fffdf8; }
        .upload-zone:hover { border-color: #c0392b; background: #fff5f5; }
        .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); color: white; font-size: 28px; cursor: pointer; border: none; background: rgba(255,255,255,0.15); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 40px; height: 40px; border: 4px solid #e8d9c4; border-top-color: #c0392b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#1a0a05", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => { setView("browse"); setSelectedSale(null); }}>
          <span style={{ fontSize: 24 }}>🍁</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "#f5ddb4" }}>Yardhunt.ca</span>
        </div>
        <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => { setView("browse"); setSelectedSale(null); }} style={{ background: view==="browse" ? "#c0392b" : "transparent", color: view==="browse" ? "white" : "#f5ddb4", border: "none", padding: "7px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13 }}>Browse</button>
          {user ? (
            <>
              <button onClick={() => setView("post")} style={{ background: view==="post" ? "#c0392b" : "transparent", color: view==="post" ? "white" : "#f5ddb4", border: "none", padding: "7px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13 }}>+ Post</button>
              <button onClick={handleSignOut} style={{ background: "transparent", color: "#f5ddb4", border: "1px solid #f5ddb455", padding: "7px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Playfair Display', serif" }}>Log Out</button>
            </>
          ) : (
            <button onClick={() => setView("auth")} style={{ background: "#c0392b", color: "white", border: "none", padding: "7px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13 }}>Sign In</button>
          )}
        </nav>
      </header>

      {/* Auth View */}
      {view === "auth" && (
        <main style={{ maxWidth: 420, margin: "0 auto", padding: "50px 20px" }}>
          <div style={{ background: "white", borderRadius: 8, padding: "36px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1px solid #e8d9c4" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ fontSize: 40 }}>🍁</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#2d1b0e", marginTop: 8 }}>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
              <p style={{ color: "#7a5c3a", fontSize: 14, marginTop: 4 }}>{authMode === "login" ? "Sign in to post your sale" : "Join Yardhunt.ca for free"}</p>
            </div>
            {authSuccess && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 6, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#166534" }}>{authSuccess}</div>}
            {authError && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#991b1b" }}>{authError}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label>Email</label>
                <input type="email" placeholder="your@email.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
              </div>
              <div>
                <label>Password</label>
                <input type="password" placeholder="At least 6 characters" value={authPassword} onChange={e => setAuthPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} />
              </div>
              <button className="btn-primary" onClick={handleAuth} disabled={authLoading} style={{ width: "100%", padding: "13px", fontSize: 16, marginTop: 4, opacity: authLoading ? 0.7 : 1 }}>
                {authLoading ? "Please wait…" : authMode === "login" ? "🍁 Sign In" : "🍁 Create Account"}
              </button>
              <p style={{ textAlign: "center", fontSize: 14, color: "#7a5c3a" }}>
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <span style={{ color: "#c0392b", cursor: "pointer", fontWeight: 700 }} onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); setAuthSuccess(""); }}>
                  {authMode === "login" ? "Sign up free" : "Sign in"}
                </span>
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Hero */}
      {view === "browse" && !selectedSale && (
        <div style={{ background: "linear-gradient(135deg, #1a0a05 0%, #6b1a1a 55%, #c0392b 100%)", padding: "52px 24px 40px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🍁</span>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", color: "#f5ddb4", fontSize: 14, letterSpacing: 2 }}>Canada's garage sale community</p>
            <span style={{ fontSize: 18 }}>🍁</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 6vw, 52px)", color: "#fff", fontWeight: 900, lineHeight: 1.1, marginBottom: 28 }}>Garage Sales &amp;<br />Yard Sales Across Canada</h1>
          <div style={{ display: "flex", gap: 10, maxWidth: 620, margin: "0 auto", flexWrap: "wrap" }}>
            <input type="text" placeholder="Search by city, item, or keyword…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, background: "white", border: "none", fontSize: 15, padding: "13px 18px", borderRadius: 4 }} />
            <select value={provFilter} onChange={e => setProvFilter(e.target.value)} style={{ width: 130, background: "white", border: "none", fontSize: 14, padding: "13px 10px", borderRadius: 4, color: "#3a2c1a" }}>
              <option value="">All Provinces</option>
              {provinces.map(p => <option key={p.code} value={p.code}>{p.code} – {p.name}</option>)}
            </select>
          </div>
          <p style={{ color: "#f5ddb4", fontSize: 13, marginTop: 16, opacity: 0.8 }}>{sales.length} active sale{sales.length !== 1 ? "s" : ""} • listings expire automatically after sale date</p>
        </div>
      )}

      {/* Browse Grid */}
      {view === "browse" && !selectedSale && (
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div className="spinner" style={{ marginBottom: 16 }}></div>
              <p style={{ color: "#7a5c3a", fontStyle: "italic" }}>Loading sales across Canada…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍁</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#7a5c3a" }}>No sales found</p>
              <p style={{ color: "#a08060", marginTop: 8 }}>
                {user ? <span style={{ color: "#c0392b", cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("post")}>Post your sale</span> : <span style={{ color: "#c0392b", cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("auth")}>Sign in to post your sale</span>}
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: "#7a5c3a", fontSize: 14, marginBottom: 20, fontStyle: "italic" }}>{filtered.length} upcoming sale{filtered.length !== 1 ? "s" : ""} found across Canada</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                {filtered.map(sale => (
                  <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setPhotoIndex(0); }} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #e8d9c4" }}>
                    {sale.photos && sale.photos.length > 0 ? (
                      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                        <img src={sale.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {sale.photos.length > 1 && <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 11, padding: "3px 8px", borderRadius: 10 }}>+{sale.photos.length - 1} photos</span>}
                      </div>
                    ) : (
                      <div style={{ background: "linear-gradient(135deg, #6b1a1a, #c0392b)", padding: "20px 20px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ fontSize: 32 }}>{sale.emoji || "🏠"}</span>
                        <div>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{sale.title}</p>
                          <p style={{ color: "#f5ddb4", fontSize: 12, marginTop: 4 }}>📍 {sale.city}, {sale.province}</p>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: "16px 20px" }}>
                      {sale.photos && sale.photos.length > 0 && <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#2d1b0e", marginBottom: 6 }}>{sale.title}</p>}
                      <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, color: "#7a5c3a" }}>📍 {sale.city}, {sale.province}</span>
                        <span style={{ fontSize: 13, color: "#7a5c3a" }}>📅 {new Date(sale.date + "T12:00:00").toLocaleDateString("en-CA", { month:"short", day:"numeric" })}</span>
                        {sale.start_time && <span style={{ fontSize: 13, color: "#7a5c3a" }}>⏰ {sale.start_time}</span>}
                      </div>
                      <p style={{ fontSize: 14, color: "#5a4030", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>{sale.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {(sale.tags||[]).map((tag:string) => <span key={tag} className="tag-pill" style={{ background: (tagColors[tag]||"#a08060")+"22", color: tagColors[tag]||"#a08060", border: `1px solid ${tagColors[tag]||"#a08060"}55` }}>{tag}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!user && sales.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 40, padding: "28px", background: "white", borderRadius: 8, border: "1px solid #e8d9c4" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#2d1b0e", marginBottom: 8 }}>Have a sale coming up?</p>
              <p style={{ color: "#7a5c3a", fontSize: 14, marginBottom: 16 }}>Create a free account to post your sale and reach Canadians near you.</p>
              <button className="btn-primary" onClick={() => { setAuthMode("signup"); setView("auth"); }}>🍁 Post Your Sale Free</button>
            </div>
          )}
        </main>
      )}

      {/* Detail View */}
      {view === "browse" && selectedSale && (
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px" }}>
          <button onClick={() => setSelectedSale(null)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 14, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>← Back to listings</button>
          <div style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1px solid #e8d9c4" }}>
            {selectedSale.photos && selectedSale.photos.length > 0 ? (
              <div>
                <div style={{ position: "relative", height: 280, background: "#1a0a05" }}>
                  <img src={selectedSale.photos[photoIndex]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {selectedSale.photos.length > 1 && (
                    <>
                      <button className="lightbox-nav" style={{ left: 12 }} onClick={e => { e.stopPropagation(); setPhotoIndex(i => (i-1+selectedSale.photos.length)%selectedSale.photos.length); }}>‹</button>
                      <button className="lightbox-nav" style={{ right: 12 }} onClick={e => { e.stopPropagation(); setPhotoIndex(i => (i+1)%selectedSale.photos.length); }}>›</button>
                      <span style={{ position: "absolute", bottom: 10, right: 14, background: "rgba(0,0,0,0.55)", color: "white", fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>{photoIndex+1} / {selectedSale.photos.length}</span>
                    </>
                  )}
                </div>
                {selectedSale.photos.length > 1 && (
                  <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", background: "#f5ece0" }}>
                    {selectedSale.photos.map((p:string, i:number) => (
                      <div key={i} onClick={() => setPhotoIndex(i)} style={{ width: 56, height: 56, borderRadius: 4, overflow: "hidden", cursor: "pointer", border: i===photoIndex ? "2px solid #c0392b" : "2px solid transparent", flexShrink: 0 }}>
                        <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "linear-gradient(135deg, #1a0a05, #c0392b)", padding: "32px 28px" }}>
                <span style={{ fontSize: 48 }}>{selectedSale.emoji||"🏠"}</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "white", marginTop: 10 }}>{selectedSale.title}</h2>
                <p style={{ color: "#f5ddb4", marginTop: 6 }}>Hosted by {selectedSale.name||"Anonymous"}</p>
              </div>
            )}
            <div style={{ padding: "24px 28px" }}>
              {selectedSale.photos && selectedSale.photos.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: "#2d1b0e" }}>{selectedSale.title}</h2>
                  <p style={{ color: "#7a5c3a", fontSize: 14, marginTop: 3 }}>Hosted by {selectedSale.name||"Anonymous"}</p>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
                {[["📍 Address", `${selectedSale.address}, ${selectedSale.city}, ${selectedSale.province}`], ["📅 Date", new Date(selectedSale.date+"T12:00:00").toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})], ["⏰ Hours", selectedSale.start_time ? `${selectedSale.start_time} – ${selectedSale.end_time}` : "See description"]].map(([label,val])=>(
                  <div key={label} style={{ background: "#fdf6ec", padding: "12px 14px", borderRadius: 6, border: "1px solid #e8d9c4" }}>
                    <p style={{ fontSize: 11, color: "#7a5c3a", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 13, color: "#3a2c1a" }}>{val}</p>
                  </div>
                ))}
              </div>
              {selectedSale.description && <><h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#3a2c1a", marginBottom: 8 }}>About this Sale</h3><p style={{ fontSize: 15, color: "#5a4030", lineHeight: 1.7, marginBottom: 18 }}>{selectedSale.description}</p></>}
              {(selectedSale.tags||[]).length > 0 && (
                <>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#3a2c1a", marginBottom: 10 }}>What's Available</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {(selectedSale.tags||[]).map((tag:string) => <span key={tag} className="tag-pill" style={{ background: (tagColors[tag]||"#a08060")+"22", color: tagColors[tag]||"#a08060", border: `1px solid ${tagColors[tag]||"#a08060"}55`, padding: "6px 14px", fontSize: 13 }}>{tag}</span>)}
                  </div>
                </>
              )}
              <div style={{ marginTop: 24, padding: "14px", background: "#fff3e0", borderRadius: 6, border: "1px solid #f5c27a" }}>
                <p style={{ fontSize: 13, color: "#7a4a00", fontStyle: "italic" }}>🍁 Tip: Always confirm details with the seller before heading out. Sales can end early!</p>
              </div>
              {user && selectedSale.user_id === user.id && (
                <div style={{ marginTop: 16, padding: "20px", background: "linear-gradient(135deg, #fdf6ec, #fff8e7)", borderRadius: 8, border: "2px solid #f5c27a", textAlign: "center" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#2d1b0e", marginBottom: 6 }}>⭐ Boost Your Listing</p>
                  <p style={{ fontSize: 13, color: "#7a5c3a", marginBottom: 14 }}>Get pinned to the top of search results and stand out with a Featured badge. More shoppers = more sales!</p>
                  <a href="https://buy.stripe.com/fZu7sLdkZ12K1QJbRq1Jm00" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#f5a623", color: "white", padding: "12px 24px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>⭐ Feature This Listing — $9.99 CAD</a>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Post View */}
      {view === "post" && !user && (
        <main style={{ maxWidth: 420, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#2d1b0e", marginBottom: 8 }}>Sign in to Post</h2>
          <p style={{ color: "#7a5c3a", marginBottom: 24 }}>You need a free account to post your sale.</p>
          <button className="btn-primary" onClick={() => { setAuthMode("signup"); setView("auth"); }}>🍁 Create Free Account</button>
        </main>
      )}

      {view === "post" && user && (
        <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#3a2c1a" }}>Sale Posted!</h2>
              <p style={{ color: "#7a5c3a", marginTop: 8 }}>Your sale is now live! It will disappear automatically after your sale date. 🍁</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#2d1b0e", marginBottom: 6 }}>Post Your Sale</h2>
              <p style={{ color: "#7a5c3a", fontSize: 15, fontStyle: "italic", marginBottom: 30 }}>Posting as {user.email} • Listing expires automatically after sale date</p>
              <div style={{ background: "white", borderRadius: 8, padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e8d9c4", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label>📸 Photos (up to 6)</label>
                  {form.photos.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                      {form.photos.map((p, i) => (
                        <div key={i} className="photo-thumb"><img src={p} alt="" /><button className="photo-remove" onClick={() => setForm(f=>({...f,photos:f.photos.filter((_,idx)=>idx!==i)}))}>✕</button></div>
                      ))}
                    </div>
                  )}
                  {form.photos.length < 6 && (
                    <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                      <p style={{ fontSize: 14, color: "#7a5c3a", fontWeight: 600 }}>Click to upload photos</p>
                      <p style={{ fontSize: 12, color: "#a08060", marginTop: 3 }}>JPG, PNG • {6-form.photos.length} remaining</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhotos} />
                </div>
                <div><label>Sale Title *</label><input type="text" placeholder="e.g. Moving Sale – Everything Must Go!" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} /></div>
                <div><label>Your Name / Family Name</label><input type="text" placeholder="e.g. The Tremblay Family" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div><label>Street Address *</label><input type="text" placeholder="123 Maple Street" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} /></div>
                  <div><label>City *</label><input type="text" placeholder="City" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} /></div>
                </div>
                <div><label>Province / Territory *</label>
                  <select value={form.province} onChange={e=>setForm(f=>({...f,province:e.target.value}))}>
                    <option value="">Select province or territory…</option>
                    {provinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div><label>Date *</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></div>
                  <div><label>Start Time</label><input type="time" value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))} /></div>
                  <div><label>End Time</label><input type="time" value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} /></div>
                </div>
                <div><label>Description</label><textarea rows={4} placeholder="What's for sale? Any special deals?" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{ resize: "vertical" }} /></div>
                <div>
                  <label>Categories</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                    {tagOptions.map(tag=>(
                      <button key={tag} onClick={()=>toggleTag(tag)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${form.tags.includes(tag)?(tagColors[tag]||"#c0392b"):"#d6c4a8"}`, background: form.tags.includes(tag)?((tagColors[tag]||"#c0392b")+"22"):"transparent", color: form.tags.includes(tag)?(tagColors[tag]||"#c0392b"):"#7a5c3a", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{tag}</button>
                    ))}
                  </div>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <button className="btn-primary" onClick={handleSubmit} disabled={submitting} style={{ width: "100%", padding: "14px", fontSize: 17, opacity: submitting?0.7:1 }}>
                    {submitting ? "Posting…" : "🍁 Post My Sale"}
                  </button>
                  {(!form.title||!form.address||!form.city||!form.province||!form.date) && <p style={{ fontSize: 12, color: "#a08060", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>* Required fields must be filled</p>}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      <footer style={{ background: "#1a0a05", padding: "24px", textAlign: "center", marginTop: 60 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: "#f5ddb4", fontSize: 16, fontWeight: 700 }}>🍁 Yardhunt.ca</p>
        <p style={{ color: "#a08060", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>Connecting Canadians, one great deal at a time.</p>
      </footer>
    </div>
  );
}
