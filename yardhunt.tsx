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
  },
  async deleteSale(id: number) {
    await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  },
  async getReviews(saleId: number) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?sale_id=eq.${saleId}&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async addReview(review: any) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(review)
    });
    return res.json();
  },
  async getAllSales() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sales?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getAllSubscribers() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getAllReviews() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async subscribe(email: string, city: string, province: string) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ email, city, province })
    });
    return res.json();
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
  const [nearMe, setNearMe] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subCity, setSubCity] = useState("");
  const [subProvince, setSubProvince] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [allSales, setAllSales] = useState<any[]>([]);
  const [allSubscribers, setAllSubscribers] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [unlockedSales, setUnlockedSales] = useState<number[]>([]);
  const [photoPackUnlocked, setPhotoPackUnlocked] = useState(false);
  const [form, setForm] = useState({ title:"",name:"",address:"",city:"",province:"",date:"",startTime:"",endTime:"",description:"",tags:[] as string[],photos:[] as string[] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSales().then(() => {
      // Check if URL has a sale ID to open directly (from shared links)
      const params = new URLSearchParams(window.location.search);
      const saleId = params.get("sale");
      if (saleId) {
        // Will be handled after sales load
        sessionStorage.setItem("openSaleId", saleId);
      }
    });
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
      const salesData = Array.isArray(data) ? data : [];
      setSales(salesData);
      // Open shared sale if coming from a shared link
      const openId = sessionStorage.getItem("openSaleId");
      if (openId) {
        const sale = salesData.find((s: any) => String(s.id) === openId);
        if (sale) { setSelectedSale(sale); setView("browse"); }
        sessionStorage.removeItem("openSaleId");
      }
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
    const matchNear = !nearMe || s.city?.toLowerCase().includes(nearMe.toLowerCase()) || s.province?.toLowerCase().includes(nearMe.toLowerCase());
    return matchSearch && matchProv && matchNear;
  });

  const mySales = sales.filter(s => user && s.user_id === user.id);

  const loadAdminData = async () => {
    setAdminLoading(true);
    try {
      const [s, sub, rev] = await Promise.all([api.getAllSales(), api.getAllSubscribers(), api.getAllReviews()]);
      setAllSales(Array.isArray(s) ? s : []);
      setAllSubscribers(Array.isArray(sub) ? sub : []);
      setAllReviews(Array.isArray(rev) ? rev : []);
    } catch(e) {}
    setAdminLoading(false);
  };

  // Check for /admin URL
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('admin');
    }
  }, []);

  const loadReviews = async (saleId: number) => {
    try {
      const data = await api.getReviews(saleId);
      setReviews(Array.isArray(data) ? data : []);
    } catch(e) { setReviews([]); }
  };

  const handleDelete = async (id: number) => {
    await api.deleteSale(id);
    await loadSales();
    setDeleteConfirm(null);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#fdf6ec" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        :root {
          --crimson: #b91c1c;
          --crimson-dark: #7f1d1d;
          --crimson-light: #fecaca;
          --gold: #d97706;
          --gold-light: #fef3c7;
          --cream: #fdfaf5;
          --cream-dark: #f5efe3;
          --bark: #292524;
          --bark-mid: #44403c;
          --bark-light: #78716c;
          --bark-pale: #e7e5e4;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--cream); font-family: 'DM Sans', sans-serif; }

        /* Typography */
        .font-display { font-family: 'Cormorant Garamond', serif; }

        /* Cards */
        .card { background: white; border-radius: 12px; border: 1px solid var(--bark-pale); transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor: pointer; overflow: hidden; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(41,37,36,0.12); border-color: var(--crimson-light); }

        /* Buttons */
        .btn-primary { background: var(--crimson); color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; cursor: pointer; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 17px; letter-spacing: 0.3px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(185,28,28,0.3); }
        .btn-primary:hover { background: var(--crimson-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(185,28,28,0.4); }
        .btn-primary:active { transform: translateY(0); }
        .btn-secondary { background: white; color: var(--bark); border: 1.5px solid var(--bark-pale); padding: 11px 22px; border-radius: 8px; font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.2s; }
        .btn-secondary:hover { border-color: var(--crimson); color: var(--crimson); }

        /* Inputs */
        input[type=text], input[type=email], input[type=password], input[type=date], input[type=time], select, textarea {
          width: 100%; padding: 11px 16px; border: 1.5px solid var(--bark-pale); border-radius: 8px;
          background: white; font-size: 15px; color: var(--bark); outline: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(185,28,28,0.08); }
        label { display: block; font-size: 12px; font-weight: 600; color: var(--bark-light); margin-bottom: 6px; letter-spacing: 0.8px; text-transform: uppercase; }

        /* Tags */
        .tag-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; letter-spacing: 0.3px; }

        /* Photo upload */
        .photo-thumb { position: relative; width: 88px; height: 88px; border-radius: 8px; overflow: hidden; border: 2px solid var(--bark-pale); flex-shrink: 0; }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .photo-remove { position: absolute; top: 4px; right: 4px; background: rgba(41,37,36,0.7); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .upload-zone { border: 2px dashed var(--bark-pale); border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--cream); }
        .upload-zone:hover { border-color: var(--crimson); background: #fff5f5; }

        /* Nav */
        .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); color: white; font-size: 24px; cursor: pointer; border: none; background: rgba(255,255,255,0.15); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); transition: background 0.2s; }
        .lightbox-nav:hover { background: rgba(255,255,255,0.3); }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 36px; height: 36px; border: 3px solid var(--bark-pale); border-top-color: var(--crimson); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto; }

        /* Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        /* Menu overlay */
        .menu-overlay { position: fixed; inset: 0; background: rgba(41,37,36,0.5); z-index: 98; backdrop-filter: blur(2px); }

        /* Section headers */
        .section-divider { display: flex; align-items: center; gap: 16px; margin: 40px 0 24px; }
        .section-divider::before, .section-divider::after { content: ''; flex: 1; height: 1px; background: var(--bark-pale); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--cream); }
        ::-webkit-scrollbar-thumb { background: var(--bark-pale); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#1c1009", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "relative", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { setView("browse"); setSelectedSale(null); setMenuOpen(false); }}>
          <span style={{ fontSize: 24 }}>🍁</span>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#f5ddb4", letterSpacing: 0.5 }}>Yardhunt</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "#d97706" }}>.ca</span>
          </div>
        </div>
        <button onClick={() => setMenuOpen(m => !m)} style={{ background: menuOpen ? "rgba(185,28,28,0.2)" : "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4, transition: "all 0.2s" }}>
          <span style={{ display: "block", width: 20, height: 1.5, background: "#f5ddb4", transition: "all 0.25s", opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ display: "block", width: 20, height: 1.5, background: "#f5ddb4", transition: "all 0.25s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }}></span>
          <span style={{ display: "block", width: 20, height: 1.5, background: "#f5ddb4", transition: "all 0.25s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }}></span>
        </button>
      </header>

      {/* Menu Overlay */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Dropdown Menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, right: 0, width: "min(300px, 100vw)", background: "#1c1009", zIndex: 99, borderLeft: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", boxShadow: "-8px 8px 40px rgba(0,0,0,0.5)", borderBottomLeftRadius: 16 }}>
          <div style={{ padding: "8px 0" }}>
            {[
              { label: "Browse Sales", icon: "🏠", view: "browse", action: () => { setView("browse"); setSelectedSale(null); } },
              { label: "Categories", icon: "🗂️", view: "categories", action: () => setView("categories") },
              { label: "Map View", icon: "🗺️", view: "map", action: () => setView("map") },
            ].map(item => (
              <button key={item.view} onClick={() => { item.action(); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: view === item.view ? "rgba(185,28,28,0.2)" : "transparent", color: view === item.view ? "#fca5a5" : "#f5ddb4", border: "none", padding: "14px 20px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, borderLeft: view === item.view ? "3px solid #b91c1c" : "3px solid transparent", transition: "all 0.15s" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "8px 0" }}>
            {user ? (
              <>
                <div style={{ padding: "10px 20px 6px" }}>
                  <p style={{ fontSize: 11, color: "#78716c", letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 600 }}>My Account</p>
                </div>
                <button onClick={() => { setView("post"); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: view === "post" ? "rgba(185,28,28,0.2)" : "transparent", color: view === "post" ? "#fca5a5" : "#f5ddb4", border: "none", padding: "14px 20px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, borderLeft: view === "post" ? "3px solid #b91c1c" : "3px solid transparent" }}>
                  <span style={{ fontSize: 18 }}>➕</span> Post a Sale
                </button>
                <button onClick={() => { setView("dashboard"); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: view === "dashboard" ? "rgba(185,28,28,0.2)" : "transparent", color: view === "dashboard" ? "#fca5a5" : "#f5ddb4", border: "none", padding: "14px 20px", textAlign: "left", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, borderLeft: view === "dashboard" ? "3px solid #b91c1c" : "3px solid transparent" }}>
                  <span style={{ fontSize: 18 }}>📋</span> My Sales
                </button>
                <div style={{ padding: "8px 20px 12px" }}>
                  <p style={{ fontSize: 12, color: "#78716c", marginBottom: 8 }}>Signed in as {user.email}</p>
                  <button onClick={() => { handleSignOut(); setMenuOpen(false); }} style={{ fontSize: 13, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>Sign out →</button>
                </div>
              </>
            ) : (
              <div style={{ padding: "12px 20px" }}>
                <button onClick={() => { setView("auth"); setAuthMode("signup"); setMenuOpen(false); }} className="btn-primary" style={{ width: "100%", marginBottom: 10 }}>🍁 Post Your Sale Free</button>
                <button onClick={() => { setView("auth"); setAuthMode("login"); setMenuOpen(false); }} className="btn-secondary" style={{ width: "100%" }}>Sign In</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth View */}
      {view === "auth" && (
        <main style={{ maxWidth: 420, margin: "0 auto", padding: "50px 20px" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "40px 32px", boxShadow: "0 8px 48px rgba(41,37,36,0.12)", border: "1px solid #e7e5e4" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🍁</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: "#292524", marginBottom: 6 }}>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
              <p style={{ color: "#78716c", fontSize: 15 }}>{authMode === "login" ? "Sign in to post your sale" : "Join Canada's garage sale community"}</p>
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
        <div style={{ background: "linear-gradient(160deg, #1c1009 0%, #3b0f0f 50%, #7f1d1d 100%)", padding: "56px 24px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(185,28,28,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(217,119,6,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>🍁</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#f5ddb4", fontSize: 14, letterSpacing: 1.5 }}>Canada's Garage Sale Community</p>
              <span style={{ fontSize: 14 }}>🍁</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 7vw, 60px)", color: "#fff", fontWeight: 600, lineHeight: 1.1, marginBottom: 8, letterSpacing: -0.5 }}>
              Garage Sales &amp; Yard Sales
            </h1>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 4vw, 32px)", color: "#d97706", fontWeight: 400, fontStyle: "italic", marginBottom: 36, letterSpacing: 0.5 }}>
              Across Canada 🍁
            </h2>
            <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
                  <input type="text" placeholder="Search sales, items, cities…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 10, fontSize: 15, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }} />
                </div>
                <select value={provFilter} onChange={e => setProvFilter(e.target.value)} style={{ width: 140, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 10, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <option value="">All Provinces</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.code} – {p.name}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📍</span>
                  <input type="text" placeholder="Near me — type your city…" value={nearMe} onChange={e => setNearMe(e.target.value)} style={{ paddingLeft: 40, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: 10, fontSize: 14 }} />
                </div>
                {nearMe && <button onClick={() => setNearMe("")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "11px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>✕ Clear</button>}
              </div>
            </div>
            <p style={{ color: "rgba(245,221,180,0.6)", fontSize: 13, marginTop: 20 }}>
              <span style={{ color: "#d97706", fontWeight: 600 }}>{sales.length}</span> active sale{sales.length !== 1 ? "s" : ""} across Canada • Listings expire automatically
            </p>
          </div>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ color: "#78716c", fontSize: 14 }}><span style={{ color: "#b91c1c", fontWeight: 600 }}>{filtered.length}</span> upcoming sale{filtered.length !== 1 ? "s" : ""} found across Canada</p>
                <p style={{ color: "#78716c", fontSize: 12, fontStyle: "italic" }}>Sorted by date</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                {filtered.map(sale => (
                  <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setPhotoIndex(0); loadReviews(sale.id); setReviewSuccess(false); setReviewComment(''); setReviewRating(5); }} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #e8d9c4" }}>
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

          {/* Notify Me Section */}
          <div style={{ marginTop: 40, background: "linear-gradient(135deg, #1a0a05, #6b1a1a)", borderRadius: 12, padding: "32px 28px", textAlign: "center" }}>
            <span style={{ fontSize: 36 }}>🔔</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: "white", marginTop: 10, marginBottom: 8 }}>Get Notified of Sales Near You</h3>
            <p style={{ color: "#f5ddb4", fontSize: 14, marginBottom: 24, fontStyle: "italic" }}>Enter your city and we'll email you when new garage sales are posted nearby!</p>
            {subSuccess ? (
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "16px", color: "white" }}>
                <p style={{ fontSize: 20, marginBottom: 6 }}>🎉 You're subscribed!</p>
                <p style={{ fontSize: 14, color: "#f5ddb4" }}>We'll email you when new sales are posted in {subCity}!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto" }}>
                <input type="email" placeholder="Your email address" value={subEmail} onChange={e => setSubEmail(e.target.value)} style={{ padding: "12px 16px", borderRadius: 6, border: "none", fontSize: 15, fontFamily: "'Source Serif 4', serif" }} />
                <input type="text" placeholder="Your city (e.g. Toronto, Calgary)" value={subCity} onChange={e => setSubCity(e.target.value)} style={{ padding: "12px 16px", borderRadius: 6, border: "none", fontSize: 15, fontFamily: "'Source Serif 4', serif" }} />
                <select value={subProvince} onChange={e => setSubProvince(e.target.value)} style={{ padding: "12px 16px", borderRadius: 6, border: "none", fontSize: 15, fontFamily: "'Source Serif 4', serif", color: subProvince ? "#3a2c1a" : "#888" }}>
                  <option value="">Select your province (optional)</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
                <button onClick={async () => {
                  if (!subEmail || !subCity) return;
                  setSubLoading(true);
                  await api.subscribe(subEmail, subCity, subProvince);
                  setSubSuccess(true);
                  setSubLoading(false);
                }} disabled={subLoading || !subEmail || !subCity} style={{ background: "#c0392b", color: "white", border: "none", padding: "13px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: subLoading || !subEmail || !subCity ? 0.6 : 1 }}>
                  {subLoading ? "Subscribing…" : "🔔 Notify Me of Sales Near Me"}
                </button>
                <p style={{ fontSize: 11, color: "#f5ddb455" }}>No spam. Unsubscribe anytime. 🍁</p>
              </div>
            )}
          </div>
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
                  <img src={selectedSale.photos[Math.min(photoIndex, (unlockedSales.includes(selectedSale.id) ? selectedSale.photos.length : Math.min(selectedSale.photos.length, 6)) - 1)]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {selectedSale.photos.length > 1 && (
                    <>
                      <button className="lightbox-nav" style={{ left: 12 }} onClick={e => { e.stopPropagation(); const max = unlockedSales.includes(selectedSale.id) ? selectedSale.photos.length : Math.min(selectedSale.photos.length, 6); setPhotoIndex(i => (i-1+max)%max); }}>‹</button>
                      <button className="lightbox-nav" style={{ right: 12 }} onClick={e => { e.stopPropagation(); const max = unlockedSales.includes(selectedSale.id) ? selectedSale.photos.length : Math.min(selectedSale.photos.length, 6); setPhotoIndex(i => (i+1)%max); }}>›</button>
                      <span style={{ position: "absolute", bottom: 10, right: 14, background: "rgba(0,0,0,0.55)", color: "white", fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>{photoIndex+1} / {unlockedSales.includes(selectedSale.id) ? selectedSale.photos.length : Math.min(selectedSale.photos.length, 6)}</span>
                    </>
                  )}
                </div>
                {selectedSale.photos.length > 1 && (
                  <div style={{ display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto", background: "#f5ece0" }}>
                    {selectedSale.photos.slice(0, unlockedSales.includes(selectedSale.id) ? selectedSale.photos.length : 6).map((p:string, i:number) => (
                      <div key={i} onClick={() => setPhotoIndex(i)} style={{ width: 56, height: 56, borderRadius: 4, overflow: "hidden", cursor: "pointer", border: i===photoIndex ? "2px solid #b91c1c" : "2px solid transparent", flexShrink: 0 }}>
                        <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                    {!unlockedSales.includes(selectedSale.id) && selectedSale.photos.length > 6 && (
                      <div style={{ width: 56, height: 56, borderRadius: 4, flexShrink: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #d97706" }}>
                        <span style={{ color: "#d97706", fontSize: 10, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>+{selectedSale.photos.length - 6} more</span>
                      </div>
                    )}
                  </div>
                )}
                {!unlockedSales.includes(selectedSale.id) && selectedSale.photos.length > 6 && (
                  <div style={{ background: "linear-gradient(135deg, #1c1009, #3b0f0f)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "white", marginBottom: 2 }}>🔒 {selectedSale.photos.length - 6} more photos locked</p>
                      <p style={{ fontSize: 12, color: "#f5ddb499" }}>Unlock all for just $1.99</p>
                    </div>
                    <a href="https://buy.stripe.com/9B66oH3Kp3aS2UNdZy1Jm03" target="_blank" rel="noreferrer" onClick={() => setTimeout(() => setUnlockedSales(u => [...u, selectedSale.id]), 3000)} style={{ background: "#d97706", color: "white", padding: "10px 18px", borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>📸 Unlock All — $1.99</a>
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
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <button onClick={() => {
                  const url = `${window.location.origin}?sale=${selectedSale.id}`;
                  const text = `Check out this garage sale: ${selectedSale.title} in ${selectedSale.city}, ${selectedSale.province} on ${new Date(selectedSale.date + "T12:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })} — ${url}`;
                  if (navigator.share) {
                    navigator.share({ title: selectedSale.title, text, url });
                  } else {
                    navigator.clipboard.writeText(url);
                    alert("Link copied to clipboard!");
                  }
                }} style={{ flex: 1, background: "#c0392b", color: "white", border: "none", padding: "12px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  📤 Share This Sale
                </button>
                <button onClick={() => {
                  const url = `${window.location.origin}?sale=${selectedSale.id}`;
                  navigator.clipboard.writeText(url);
                  alert("Link copied!");
                }} style={{ background: "#fdf6ec", color: "#7a5c3a", border: "1px solid #e8d9c4", padding: "12px 16px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
                  🔗 Copy Link
                </button>
              </div>
              {user && selectedSale.user_id === user.id && (
                <div style={{ marginTop: 16, padding: "20px", background: "linear-gradient(135deg, #fdf6ec, #fff8e7)", borderRadius: 8, border: "2px solid #f5c27a" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#2d1b0e", marginBottom: 6, textAlign: "center" }}>🚀 Boost Your Listing</p>
                  <p style={{ fontSize: 13, color: "#7a5c3a", marginBottom: 16, textAlign: "center" }}>Stand out from the crowd and get more shoppers at your sale!</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "white", borderRadius: 8, padding: "16px", border: "2px solid #f5c27a", textAlign: "center" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#7a5c3a", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Basic</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#2d1b0e", marginBottom: 4 }}>$9.99</p>
                      <p style={{ fontSize: 11, color: "#7a5c3a", marginBottom: 12 }}>CAD one-time</p>
                      <ul style={{ fontSize: 12, color: "#5a4030", textAlign: "left", marginBottom: 14, paddingLeft: 16 }}>
                        <li>⭐ Featured badge</li>
                        <li>📌 Pinned to top</li>
                        <li>3 day boost</li>
                      </ul>
                      <a href="https://buy.stripe.com/fZu7sLdkZ12K1QJbRq1Jm00" target="_blank" rel="noreferrer" style={{ display: "block", background: "#f5a623", color: "white", padding: "10px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>⭐ Get Basic</a>
                    </div>
                    <div style={{ background: "linear-gradient(135deg, #2d1b0e, #c0392b)", borderRadius: 8, padding: "16px", border: "2px solid #c0392b", textAlign: "center", position: "relative" }}>
                      <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#c0392b", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>BEST VALUE</div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#f5ddb4", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Premium</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4 }}>$14.99</p>
                      <p style={{ fontSize: 11, color: "#f5ddb4", marginBottom: 12 }}>CAD one-time</p>
                      <ul style={{ fontSize: 12, color: "#f5ddb4", textAlign: "left", marginBottom: 14, paddingLeft: 16 }}>
                        <li>🌟 Premium badge</li>
                        <li>📌 #1 position</li>
                        <li>7 day boost</li>
                        <li>Bold highlighted card</li>
                      </ul>
                      <a href="https://buy.stripe.com/cNi4gzep3dPwcvn08I1Jm01" target="_blank" rel="noreferrer" style={{ display: "block", background: "white", color: "#c0392b", padding: "10px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>🌟 Get Premium</a>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#2d1b0e", marginBottom: 16 }}>⭐ Reviews & Comments</h3>
                {user && selectedSale.user_id !== user.id && (
                  <div style={{ background: "#fdf6ec", borderRadius: 8, padding: "20px", border: "1px solid #e8d9c4", marginBottom: 20 }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#2d1b0e", marginBottom: 12 }}>Leave a Review</p>
                    {reviewSuccess ? (
                      <p style={{ color: "#166534", background: "#f0fdf4", padding: "10px 14px", borderRadius: 6, fontSize: 14 }}>✅ Thanks for your review!</p>
                    ) : (
                      <>
                        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                          {[1,2,3,4,5].map(star => (
                            <button key={star} onClick={() => setReviewRating(star)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 28, opacity: star <= reviewRating ? 1 : 0.3 }}>⭐</button>
                          ))}
                        </div>
                        <textarea rows={3} placeholder="Share your experience at this sale…" value={reviewComment} onChange={e => setReviewComment(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #d6c4a8", borderRadius: 4, fontSize: 14, fontFamily: "'Source Serif 4', serif", resize: "vertical", marginBottom: 10 }} />
                        <button onClick={async () => {
                          if (!reviewComment.trim()) return;
                          setReviewSubmitting(true);
                          await api.addReview({ sale_id: selectedSale.id, user_id: user.id, user_email: user.email, rating: reviewRating, comment: reviewComment });
                          await loadReviews(selectedSale.id);
                          setReviewSuccess(true);
                          setReviewComment("");
                          setReviewSubmitting(false);
                        }} disabled={reviewSubmitting || !reviewComment.trim()} className="btn-primary" style={{ opacity: reviewSubmitting ? 0.7 : 1 }}>
                          {reviewSubmitting ? "Posting…" : "Post Review"}
                        </button>
                      </>
                    )}
                  </div>
                )}
                {!user && (
                  <p style={{ fontSize: 14, color: "#7a5c3a", fontStyle: "italic", marginBottom: 16 }}>
                    <span style={{ color: "#c0392b", cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("auth")}>Sign in</span> to leave a review
                  </p>
                )}
                {reviews.length === 0 ? (
                  <p style={{ fontSize: 14, color: "#a08060", fontStyle: "italic" }}>No reviews yet — be the first!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {reviews.map(r => (
                      <div key={r.id} style={{ background: "white", borderRadius: 8, padding: "14px 16px", border: "1px solid #e8d9c4" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 16 }}>{"⭐".repeat(r.rating)}</span>
                          <span style={{ fontSize: 11, color: "#a08060" }}>{new Date(r.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</span>
                        </div>
                        <p style={{ fontSize: 14, color: "#3a2c1a", lineHeight: 1.5 }}>{r.comment}</p>
                        <p style={{ fontSize: 11, color: "#a08060", marginTop: 6 }}>{r.user_email?.split("@")[0] || "Anonymous"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                  {form.photos.length < (photoPackUnlocked ? 20 : 6) && (
                    <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                      <p style={{ fontSize: 14, color: "#78716c", fontWeight: 600 }}>Click to upload photos</p>
                      <p style={{ fontSize: 12, color: "#78716c", marginTop: 3 }}>{photoPackUnlocked ? "🌟 Premium" : "Free"} • {(photoPackUnlocked ? 20 : 6) - form.photos.length} remaining</p>
                    </div>
                  )}
                  {!photoPackUnlocked && form.photos.length >= 6 && (
                    <div style={{ background: "linear-gradient(135deg, #fef3c7, #fff8e7)", borderRadius: 10, padding: "16px", border: "2px solid #d97706", textAlign: "center", marginTop: 8 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: "#292524", marginBottom: 4 }}>📸 Want More Photos?</p>
                      <p style={{ fontSize: 13, color: "#78716c", marginBottom: 12 }}>Upgrade to upload up to <strong>20 photos</strong> for just $1.99!</p>
                      <a href="https://buy.stripe.com/6oU28ra8N26O3YR2gQ1Jm02" target="_blank" rel="noreferrer" onClick={() => setTimeout(() => setPhotoPackUnlocked(true), 3000)} style={{ display: "inline-block", background: "#d97706", color: "white", padding: "10px 20px", borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>📸 Unlock 20 Photos — $1.99</a>
                      <p style={{ fontSize: 11, color: "#a08060", marginTop: 8 }}>After payment, tap the button again to unlock</p>
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

      {/* Seller Dashboard */}
      {view === "dashboard" && user && (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "36px 20px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: "#2d1b0e", marginBottom: 6 }}>My Sales</h2>
          <p style={{ color: "#7a5c3a", fontSize: 14, fontStyle: "italic", marginBottom: 28 }}>Manage your listings — {mySales.length} active sale{mySales.length !== 1 ? "s" : ""}</p>
          {mySales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 8, border: "1px solid #e8d9c4" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#7a5c3a" }}>No sales posted yet</p>
              <p style={{ color: "#a08060", marginTop: 8, marginBottom: 20 }}>Post your first sale and it will appear here!</p>
              <button className="btn-primary" onClick={() => setView("post")}>🍁 Post a Sale</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mySales.map(sale => (
                <div key={sale.id} style={{ background: "white", borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #e8d9c4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 24 }}>{sale.emoji || "🏠"}</span>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#2d1b0e" }}>{sale.title}</p>
                      </div>
                      <p style={{ fontSize: 13, color: "#7a5c3a" }}>📍 {sale.address}, {sale.city}, {sale.province}</p>
                      <p style={{ fontSize: 13, color: "#7a5c3a" }}>📅 {new Date(sale.date + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}</p>
                      {sale.start_time && <p style={{ fontSize: 13, color: "#7a5c3a" }}>⏰ {sale.start_time} – {sale.end_time}</p>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                        {(sale.tags || []).map((tag: string) => (
                          <span key={tag} className="tag-pill" style={{ background: (tagColors[tag] || "#a08060") + "22", color: tagColors[tag] || "#a08060", border: `1px solid ${tagColors[tag] || "#a08060"}55` }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => { setSelectedSale(sale); setView("browse"); }} style={{ background: "#fdf6ec", color: "#7a5c3a", border: "1px solid #e8d9c4", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>👁 View</button>
                      <a href="https://buy.stripe.com/fZu7sLdkZ12K1QJbRq1Jm00" target="_blank" rel="noreferrer" style={{ background: "#f5a623", color: "white", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>⭐ $9.99</a>
                      <a href="https://buy.stripe.com/cNi4gzep3dPwcvn08I1Jm01" target="_blank" rel="noreferrer" style={{ background: "#c0392b", color: "white", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>🌟 $14.99</a>
                      {deleteConfirm === sale.id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleDelete(sale.id)} style={{ background: "#e74c3c", color: "white", border: "none", padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Yes, delete</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ background: "#fdf6ec", color: "#7a5c3a", border: "1px solid #e8d9c4", padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(sale.id)} style={{ background: "transparent", color: "#e74c3c", border: "1px solid #e74c3c55", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>🗑 Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <button className="btn-primary" onClick={() => setView("post")}>🍁 Post Another Sale</button>
              </div>
            </div>
          )}
        </main>
      )}


      {/* Categories View */}
      {view === "categories" && (
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: "#2d1b0e", marginBottom: 8 }}>🗂️ Browse by Category</h2>
          <p style={{ color: "#7a5c3a", fontSize: 14, fontStyle: "italic", marginBottom: 28 }}>Find exactly what you're looking for across Canada</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
            {tagOptions.map(tag => {
              const count = sales.filter(s => (s.tags || []).includes(tag)).length;
              const color = tagColors[tag] || "#a08060";
              return (
                <div key={tag} className="card-hover" onClick={() => { setSearch(tag); setView("browse"); setSelectedSale(null); }} style={{ background: "white", borderRadius: 10, padding: "20px 16px", textAlign: "center", border: `2px solid ${color}33`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: color + "22", border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 22 }}>
                    {tag === "Furniture" ? "🛋️" : tag === "Clothes" ? "👕" : tag === "Tools" ? "🔧" : tag === "Toys" ? "🧸" : tag === "Antiques" ? "🏺" : tag === "Jewelry" ? "💍" : tag === "Art" ? "🎨" : tag === "Books" ? "📚" : tag === "Electronics" ? "💻" : tag === "Sports" ? "⚽" : tag === "Baby" ? "🍼" : tag === "Hockey Gear" ? "🏒" : "📦"}
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: "#2d1b0e", marginBottom: 4 }}>{tag}</p>
                  <p style={{ fontSize: 12, color: color, fontWeight: 600 }}>{count} sale{count !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
          </div>

          {/* Featured categories with sales */}
          {tagOptions.map(tag => {
            const catSales = sales.filter(s => (s.tags || []).includes(tag));
            if (catSales.length === 0) return null;
            const color = tagColors[tag] || "#a08060";
            return (
              <div key={tag} style={{ marginBottom: 36 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#2d1b0e" }}>
                    <span style={{ color }}>{tag === "Furniture" ? "🛋️" : tag === "Clothes" ? "👕" : tag === "Tools" ? "🔧" : tag === "Toys" ? "🧸" : tag === "Antiques" ? "🏺" : tag === "Jewelry" ? "💍" : tag === "Art" ? "🎨" : tag === "Books" ? "📚" : tag === "Electronics" ? "💻" : tag === "Sports" ? "⚽" : tag === "Baby" ? "🍼" : tag === "Hockey Gear" ? "🏒" : "📦"}</span> {tag}
                  </h3>
                  <button onClick={() => { setSearch(tag); setView("browse"); }} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: 13, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>See all →</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {catSales.slice(0, 3).map(sale => (
                    <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setView("browse"); setPhotoIndex(0); loadReviews(sale.id); }} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: `1px solid ${color}33` }}>
                      <div style={{ background: `linear-gradient(135deg, ${color}33, ${color}55)`, padding: "14px 16px", borderBottom: `2px solid ${color}33` }}>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#2d1b0e" }}>{sale.title}</p>
                        <p style={{ fontSize: 12, color: "#7a5c3a", marginTop: 3 }}>📍 {sale.city}, {sale.province} • 📅 {new Date(sale.date + "T12:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
                      </div>
                      <div style={{ padding: "10px 16px" }}>
                        <p style={{ fontSize: 13, color: "#5a4030", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>{sale.description || "Come check it out!"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {sales.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#7a5c3a" }}>No sales yet</p>
              <p style={{ color: "#a08060", marginTop: 8 }}>Be the first to post a sale! 🍁</p>
              {user && <button className="btn-primary" onClick={() => setView("post")} style={{ marginTop: 16 }}>🍁 Post a Sale</button>}
            </div>
          )}
        </main>
      )}


      {/* Map View */}
      {view === "map" && (
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: "#2d1b0e", marginBottom: 8 }}>🗺️ Sales Near You</h2>
          <p style={{ color: "#7a5c3a", fontSize: 14, fontStyle: "italic", marginBottom: 20 }}>Browse garage sales across Canada</p>
          {sales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#7a5c3a" }}>No sales on the map yet</p>
              <p style={{ color: "#a08060", marginTop: 8 }}>Be the first to post a sale! 🍁</p>
            </div>
          ) : (
            <>
              <div style={{ background: "#fff3e0", border: "1px solid #f5c27a", borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "#7a4a00" }}>🍁 Showing {sales.length} upcoming sale{sales.length !== 1 ? "s" : ""} across Canada. Click a listing to see details!</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {sales.map(sale => (
                  <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setView("browse"); }} style={{ background: "white", borderRadius: 8, padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e8d9c4", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 24 }}>{sale.emoji || "🏠"}</span>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#2d1b0e" }}>{sale.title}</p>
                      <p style={{ fontSize: 13, color: "#7a5c3a", marginTop: 2 }}>📍 {sale.city}, {sale.province}</p>
                      <p style={{ fontSize: 13, color: "#7a5c3a" }}>📅 {new Date(sale.date + "T12:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      )}


      {/* Admin Panel */}
      {view === "admin" && (
        <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
          {!adminUnlocked ? (
            <div style={{ maxWidth: 400, margin: "60px auto", background: "white", borderRadius: 16, padding: "40px 32px", boxShadow: "0 8px 48px rgba(41,37,36,0.12)", border: "1px solid #e7e5e4", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#292524", marginBottom: 8 }}>Admin Access</h2>
              <p style={{ color: "#78716c", fontSize: 14, marginBottom: 24 }}>Enter your admin password to continue</p>
              {adminError && <p style={{ color: "#b91c1c", fontSize: 14, marginBottom: 12 }}>{adminError}</p>}
              <input type="password" placeholder="Admin password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { if (adminPassword === "@Sainii999") { setAdminUnlocked(true); loadAdminData(); } else { setAdminError("Incorrect password"); } } }} style={{ marginBottom: 14 }} />
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => { if (adminPassword === "@Sainii999") { setAdminUnlocked(true); loadAdminData(); } else { setAdminError("Incorrect password"); } }}>
                🔐 Enter Admin Panel
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: "#292524" }}>📊 Admin Panel</h2>
                  <p style={{ color: "#78716c", fontSize: 14, marginTop: 4 }}>Yardhunt.ca Dashboard</p>
                </div>
                <button onClick={loadAdminData} className="btn-secondary" disabled={adminLoading}>{adminLoading ? "Loading…" : "🔄 Refresh"}</button>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 36 }}>
                {[
                  { label: "Total Listings", value: allSales.length, icon: "🏠", color: "#b91c1c" },
                  { label: "Active Today", value: allSales.filter(s => s.date >= new Date().toISOString().split("T")[0]).length, icon: "📅", color: "#d97706" },
                  { label: "Subscribers", value: allSubscribers.length, icon: "🔔", color: "#059669" },
                  { label: "Reviews", value: allReviews.length, icon: "⭐", color: "#7c3aed" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "white", borderRadius: 12, padding: "20px", border: "1px solid #e7e5e4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                    <p style={{ fontSize: 28, fontWeight: 700, color: stat.color, fontFamily: "'Cormorant Garamond', serif" }}>{stat.value}</p>
                    <p style={{ fontSize: 12, color: "#78716c", fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Summary */}
              <div style={{ background: "linear-gradient(135deg, #1c1009, #3b0f0f)", borderRadius: 12, padding: "24px", marginBottom: 32, color: "white" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 16 }}>💰 Revenue Streams</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {[
                    { label: "Basic Featured", price: "$9.99", icon: "⭐" },
                    { label: "Premium Featured", price: "$14.99", icon: "🌟" },
                    { label: "Extra Photos", price: "$1.99", icon: "📸" },
                    { label: "Photo Unlock", price: "$1.99", icon: "🔓" },
                  ].map(r => (
                    <div key={r.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px" }}>
                      <p style={{ fontSize: 18, marginBottom: 4 }}>{r.icon}</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "#d97706" }}>{r.price}</p>
                      <p style={{ fontSize: 11, color: "#f5ddb499" }}>{r.label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#f5ddb455", marginTop: 14 }}>💡 Check Stripe dashboard for actual payment totals</p>
              </div>

              {/* All Listings */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>🏠 All Listings ({allSales.length})</h3>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e7e5e4", overflow: "hidden" }}>
                  {allSales.length === 0 ? <p style={{ padding: "20px", color: "#78716c", textAlign: "center" }}>No listings yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#fdfaf5", borderBottom: "1px solid #e7e5e4" }}>
                          {["Title", "City", "Province", "Date", "Posted"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allSales.map((s, i) => (
                          <tr key={s.id} style={{ borderBottom: "1px solid #f5f5f4", background: i % 2 === 0 ? "white" : "#fdfaf5" }}>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#292524", fontWeight: 500 }}>{s.title}</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#78716c" }}>{s.city}</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#78716c" }}>{s.province}</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#78716c" }}>{s.date}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#a8a29e" }}>{new Date(s.created_at).toLocaleDateString("en-CA")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* All Subscribers */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>🔔 Subscribers ({allSubscribers.length})</h3>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e7e5e4", overflow: "hidden" }}>
                  {allSubscribers.length === 0 ? <p style={{ padding: "20px", color: "#78716c", textAlign: "center" }}>No subscribers yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#fdfaf5", borderBottom: "1px solid #e7e5e4" }}>
                          {["Email", "City", "Province", "Joined"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allSubscribers.map((s, i) => (
                          <tr key={s.id} style={{ borderBottom: "1px solid #f5f5f4", background: i % 2 === 0 ? "white" : "#fdfaf5" }}>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#292524" }}>{s.email}</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#78716c" }}>{s.city}</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#78716c" }}>{s.province || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#a8a29e" }}>{new Date(s.created_at).toLocaleDateString("en-CA")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* All Reviews */}
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>⭐ Reviews ({allReviews.length})</h3>
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e7e5e4", overflow: "hidden" }}>
                  {allReviews.length === 0 ? <p style={{ padding: "20px", color: "#78716c", textAlign: "center" }}>No reviews yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#fdfaf5", borderBottom: "1px solid #e7e5e4" }}>
                          {["Rating", "Comment", "By", "Date"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allReviews.map((r, i) => (
                          <tr key={r.id} style={{ borderBottom: "1px solid #f5f5f4", background: i % 2 === 0 ? "white" : "#fdfaf5" }}>
                            <td style={{ padding: "12px 16px", fontSize: 16 }}>{"⭐".repeat(r.rating)}</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#292524" }}>{r.comment}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#78716c" }}>{r.user_email?.split("@")[0]}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12, color: "#a8a29e" }}>{new Date(r.created_at).toLocaleDateString("en-CA")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      )}


      <footer style={{ background: "#1c1009", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", marginTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>🍁</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#f5ddb4" }}>Yardhunt<span style={{ color: "#d97706" }}>.ca</span></span>
            </div>
            <p style={{ color: "#78716c", fontSize: 13, fontStyle: "italic", maxWidth: 240 }}>Canada's community marketplace for garage sales & yard sales.</p>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#f5ddb4", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Explore</p>
              {["Browse Sales", "Categories", "Map View"].map(item => (
                <p key={item} style={{ color: "#78716c", fontSize: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => { setView(item === "Browse Sales" ? "browse" : item === "Categories" ? "categories" : "map"); setSelectedSale(null); }}>{item}</p>
              ))}
            </div>
            <div>
              <p style={{ color: "#f5ddb4", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Sellers</p>
              {["Post a Sale", "Featured Listings", "My Dashboard"].map(item => (
                <p key={item} style={{ color: "#78716c", fontSize: 14, marginBottom: 8, cursor: "pointer" }} onClick={() => { if (item === "Post a Sale") setView("post"); else if (item === "My Dashboard") setView("dashboard"); }}>{item}</p>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "28px auto 0", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#44403c", fontSize: 12 }}>© 2026 Yardhunt.ca · All rights reserved</p>
          <p style={{ color: "#44403c", fontSize: 12, fontStyle: "italic" }}>Connecting Canadians, one great deal at a time 🍁</p>
        </div>
      </footer>
    </div>
  );
}
