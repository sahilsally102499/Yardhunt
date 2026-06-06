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
  async insertSale(sale, token) {
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
  async signUp(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  async resetPassword(email) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    return res.json();
  },
  async signOut(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
    });
  },
  async deleteSale(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  },
  async getReviews(saleId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?sale_id=eq.${saleId}&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async addReview(review) {
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
  async subscribe(email, city, province) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ email, city, province })
    });
    return res.json();
  },
  async markFeatured(id, level) {
    await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: level })
    });
  },
  async markVerified(userId) {
    await fetch(`${SUPABASE_URL}/rest/v1/sales?user_id=eq.${userId}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ is_verified: true })
    });
  },
  async markPhotoPackUnlocked(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ photo_pack_unlocked: true })
    });
  },
  async deleteReview(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/reviews?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  },
  async updateSale(id, data, token) {
    await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },
  async getSaleAnalytics(saleIds) {
    if (!saleIds.length) return [];
    const ids = saleIds.join(",");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sale_analytics?sale_id=in.(${ids})`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getSalesBySeller(userId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sales?user_id=eq.${userId}&order=date.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getQuestions(saleId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/questions?sale_id=eq.${saleId}&order=created_at.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async addQuestion(q) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(q)
    });
    return res.json();
  },
  async answerQuestion(id, answer) {
    await fetch(`${SUPABASE_URL}/rest/v1/questions?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ answer })
    });
  },
  async getAds() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ads?status=eq.active&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getAllAds() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ads?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async updateAdStatus(id, status) {
    await fetch(`${SUPABASE_URL}/rest/v1/ads?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  },
  async deleteAd(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/ads?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  },
  async getAdPricing() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ad_pricing?order=id.asc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async getListingPricing() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/listing_pricing?id=eq.1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return res.json();
  },
  async updateListingPricing(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/listing_pricing?id=eq.1`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    // If no row exists, insert one
    if (res.status === 404 || res.status === 204) {
      await fetch(`${SUPABASE_URL}/rest/v1/listing_pricing`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1, ...data })
      });
    }
  },
  async updateAdPricing(id, price) {
    await fetch(`${SUPABASE_URL}/rest/v1/ad_pricing?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ price })
    });
  },
  async getMyQuestions(saleIds) {
    if (!saleIds.length) return [];
    const ids = saleIds.join(",");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/questions?sale_id=in.(${ids})&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
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
  const [viewHistory, setViewHistory] = useState(["browse"]);
  const [seoCity, setSeoCity] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationName, setDonationName] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [seoProvince, setSeoProvince] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [provFilter, setProvFilter] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [nearMe, setNearMe] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [reviews, setReviews] = useState([]);
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
  const [allSales, setAllSales] = useState([]);
  const [allSubscribers, setAllSubscribers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState("");
  const [adminTab, setAdminTab] = useState("overview");
  const [bannedUsers, setBannedUsers] = useState([]);
  const [flaggedSales, setFlaggedSales] = useState([]);
  const [reportQueue, setReportQueue] = useState([]);
  const [notifLog, setNotifLog] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [goingList, setGoingList] = useState([]);
  const [verified, setVerified] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewCounts, setViewCounts] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [saleAnalytics, setSaleAnalytics] = useState({});
  const [unlockedSales, setUnlockedSales] = useState([]);
  const [photoPackUnlocked, setPhotoPackUnlocked] = useState(false);
  const [form, setForm] = useState({ title:"",name:"",address:"",city:"",province:"",date:"",startTime:"",endTime:"",description:"",tags:[],photos:[],extraDate:"",extraDateStart:"",extraDateEnd:"" });
  const [ads, setAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [adPricing, setAdPricing] = useState([]);
  const [listingPricing, setListingPricing] = useState({
    basic_featured: 9.99,
    premium_featured: 14.99,
    extra_photos: 1.99,
    photo_unlock: 1.99,
    verified_badge: 4.99
  });
  const [adForm, setAdForm] = useState({ business_name:"", description:"", website:"", city:"", province:"", logo_url:"", package_type:"Starter", billing_period:"monthly", email:"" });
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [adSuccess, setAdSuccess] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [dashTab, setDashTab] = useState("listings");
  const [questionText, setQuestionText] = useState("");
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState({});
  const [neighbourhoodFilter, setNeighbourhoodFilter] = useState("");
  const [favourites, setFavourites] = useState(() => { try { return JSON.parse(localStorage.getItem("yh_favs")||"[]"); } catch { return []; }});
  const [reminderSales, setReminderSales] = useState(() => { try { return JSON.parse(localStorage.getItem("yh_reminders")||"[]"); } catch { return []; }});
  const [editingSale, setEditingSale] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [sellerProfileId, setSellerProfileId] = useState(null);
  const fileInputRef = useRef(null);

  // Load seller questions when dashboard is viewed (mySales derived below, use sales + user)
  useEffect(() => {
    const myS = sales.filter(s => user && s.user_id === user.id);
    if (view === "dashboard" && user && myS.length > 0) {
      api.getMyQuestions(myS.map(s => s.id)).then(data => {
        setMyQuestions(Array.isArray(data) ? data : []);
      });
      api.getSaleAnalytics(myS.map(s => s.id)).then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(a => { map[a.sale_id] = a; });
          setSaleAnalytics(map);
        }
      });
    }
  }, [view, sales, user]);

  useEffect(() => {
    const init = async () => {
      loadAds();
      loadAdPricing();
      api.getListingPricing().then(data => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row) setListingPricing({
          basic_featured: row.basic_featured ?? 9.99,
          premium_featured: row.premium_featured ?? 14.99,
          extra_photos: row.extra_photos ?? 1.99,
          photo_unlock: row.photo_unlock ?? 1.99,
          verified_badge: row.verified_badge ?? 4.99
        });
      });

      // Check for ad success
      const params = new URLSearchParams(window.location.search);
      if (params.get("ad_success")) { setAdSuccess(true); setView("advertise"); }
    if (params.get("donation_success")) { setDonationSuccess(true); }

      // Handle listing payment success
      const product = params.get("product");
      const saleIdParam = params.get("sale_id");
      const savedUser = localStorage.getItem("yh_user");
      const savedUserObj = savedUser ? JSON.parse(savedUser) : null;

      if (product && product !== "") {
        if (product === "basic_featured" && saleIdParam) {
          await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${saleIdParam}`, {
            method: "PATCH",
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ is_featured: "basic" })
          });
        } else if (product === "premium_featured" && saleIdParam) {
          await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${saleIdParam}`, {
            method: "PATCH",
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ is_featured: "premium" })
          });
        } else if (product === "verified_badge" && savedUserObj?.id) {
          await fetch(`${SUPABASE_URL}/rest/v1/sales?user_id=eq.${savedUserObj.id}`, {
            method: "PATCH",
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ is_verified: true })
          });
          setVerified(true);
        } else if (product === "extra_photos" && saleIdParam) {
          await fetch(`${SUPABASE_URL}/rest/v1/sales?id=eq.${saleIdParam}`, {
            method: "PATCH",
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ photo_pack_unlocked: true })
          });
          setPhotoPackUnlocked(true);
        } else if (product === "photo_unlock" && saleIdParam) {
          setUnlockedSales(u => [...u, parseInt(saleIdParam)]);
        }
        window.history.replaceState({}, "", window.location.pathname);
        alert(`✅ Payment successful! Your ${product.replace(/_/g, " ")} is now active.`);
      }

      loadSales().then(() => {
        const params = new URLSearchParams(window.location.search);
        const saleId = params.get("sale");
        if (saleId) sessionStorage.setItem("openSaleId", saleId);
      });
      const saved = localStorage.getItem("yh_user");
      const savedToken = localStorage.getItem("yh_token");
      if (saved && savedToken) {
        setUser(JSON.parse(saved));
        setToken(savedToken);
      }
    };
    init();
  }, []);

  const createListingCheckout = async (product_type, sale_id = null) => {
    if (!user) { setView("auth"); setAuthMode("login"); return; }
    try {
      const res = await fetch("https://rcqlohlftafxicmfjkuf.supabase.co/functions/v1/create-listing-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ product_type, sale_id, user_id: user.id, email: user.email })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Something went wrong. Please try again.");
    } catch(e) { alert("Error. Please try again."); }
  };

  const loadAds = async () => {
    try {
      const data = await api.getAds();
      setAds(Array.isArray(data) ? data : []);
    } catch(e) { setAds([]); }
  };

  const loadAdPricing = async () => {
    try {
      const data = await api.getAdPricing();
      setAdPricing(Array.isArray(data) ? data : []);
    } catch(e) {}
  };

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await api.getSales();
      const salesData = Array.isArray(data) ? data : [];
      setSales(salesData);
      // Open shared sale if coming from a shared link
      const openId = sessionStorage.getItem("openSaleId");
      if (openId) {
        const sale = salesData.find((s) => String(s.id) === openId);
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

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => { setForm(f => ({ ...f, photos: [...f.photos, ev.target?.result].slice(0, 6) })); };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.address || !form.city || !form.province || !form.date) return;
    setSubmitting(true);
    try {
      const inserted = await api.insertSale({
        title: form.title, name: form.name, address: form.address,
        city: form.city, province: form.province, date: form.date,
        start_time: form.startTime, end_time: form.endTime,
        description: form.description, tags: form.tags,
        photos: form.photos, emoji: emojis[Math.floor(Math.random() * emojis.length)],
        user_id: user?.id,
        extra_date: form.extraDate || null,
        extra_date_end: form.extraDateEnd || null,
        neighbourhood: form.neighbourhood || null
      }, token);
      const insertedSale = Array.isArray(inserted) ? inserted[0] : inserted;
      await loadSales();
      setSubmitted(true);
      try {
        await fetch("https://rcqlohlftafxicmfjkuf.supabase.co/functions/v1/notify-subscribers", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ sale: { id: insertedSale?.id, title: form.title, address: form.address, city: form.city, province: form.province, date: form.date, start_time: form.startTime, end_time: form.endTime, description: form.description, tags: form.tags, photos: form.photos } })
        });
      } catch(e) { console.warn("Notify failed:", e); }
      setTimeout(() => {
        setSubmitted(false); setView("browse");
        setForm({ title:"",name:"",address:"",city:"",province:"",date:"",startTime:"",endTime:"",description:"",tags:[],photos:[] });
      }, 2500);
    } catch(e) { alert("Something went wrong. Please try again."); }
    setSubmitting(false);
  };

  const filtered = sales.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.title?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q) || (s.tags||[]).some((t)=>t.toLowerCase().includes(q));
    const matchProv = !provFilter || s.province === provFilter;
    const matchNear = !nearMe || s.city?.toLowerCase().includes(nearMe.toLowerCase()) || s.province?.toLowerCase().includes(nearMe.toLowerCase());
    const matchNeighbourhood = !neighbourhoodFilter || s.neighbourhood === neighbourhoodFilter;
    return matchSearch && matchProv && matchNear && matchNeighbourhood;
  }).sort((a, b) => {
    const rank = (s) => s.is_featured === "premium" ? 0 : s.is_featured === "basic" ? 1 : 2;
    return rank(a) - rank(b);
  });

  const mySales = sales.filter(s => user && s.user_id === user.id);

  // Countdown timer function
  const getCountdown = (dateStr, startTime) => {
    const saleDate = new Date(dateStr + "T" + (startTime || "08:00") + ":00");
    const now = new Date();
    const diff = saleDate.getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const loadAdminData = async () => {
    setAdminLoading(true);
    try {
      const [s, sub, rev, allAdsData] = await Promise.all([api.getAllSales(), api.getAllSubscribers(), api.getAllReviews(), api.getAllAds()]);
      setAllSales(Array.isArray(s) ? s : []);
      setAllSubscribers(Array.isArray(sub) ? sub : []);
      setAllReviews(Array.isArray(rev) ? rev : []);
      setAllAds(Array.isArray(allAdsData) ? allAdsData : []);
      // Fetch users via Supabase admin API
      const usersRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=500`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      const usersData = await usersRes.json();
      setAllUsers(Array.isArray(usersData.users) ? usersData.users : []);
    } catch(e) {}
    setAdminLoading(false);
  };

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Save favourites + reminders to localStorage
  useEffect(() => { localStorage.setItem("yh_favs", JSON.stringify(favourites)); }, [favourites]);
  useEffect(() => { localStorage.setItem("yh_reminders", JSON.stringify(reminderSales)); }, [reminderSales]);

  // Check for /admin URL
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setView('admin');
    }
    // SEO city/province pages e.g. /garage-sales/ontario or /garage-sales/toronto
    const path = window.location.pathname;
    const seoMatch = path.match(/^\/garage-sales\/([^/]+)(?:\/([^/]+))?/);
    if (seoMatch) {
      const segment1 = decodeURIComponent(seoMatch[1]).replace(/-/g, " ");
      const segment2 = seoMatch[2] ? decodeURIComponent(seoMatch[2]).replace(/-/g, " ") : "";
      // Check if segment1 is a province code or name
      const provinces2 = ["AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"];
      const provinceNames = ["alberta","british columbia","manitoba","new brunswick","newfoundland","nova scotia","northwest territories","nunavut","ontario","prince edward island","quebec","saskatchewan","yukon"];
      const isProvince = provinces2.includes(segment1.toUpperCase()) || provinceNames.includes(segment1.toLowerCase());
      if (isProvince) {
        setSeoProvince(segment1.toUpperCase().length <= 2 ? segment1.toUpperCase() : segment1);
        setSeoCity(segment2);
      } else {
        setSeoCity(segment1);
        setSeoProvince(segment2.toUpperCase());
      }
      setView("seo");
      // Update page title
      document.title = segment2
        ? `Garage Sales in ${segment1}, ${segment2} | Yardhunt.ca`
        : `Garage Sales in ${segment1} | Yardhunt.ca`;
    }
  }, []);

  // Generate search suggestions from existing sales
  const handleSearchInput = (val) => {
    setSearch(val);
    if (val.length < 2) { setSearchSuggestions([]); setShowSuggestions(false); return; }
    const q = val.toLowerCase();
    const cities = [...new Set(sales.map(s => s.city).filter(c => c?.toLowerCase().includes(q)))].slice(0, 3);
    const tags = tagOptions.filter(t => t.toLowerCase().includes(q)).slice(0, 2);
    const titles = [...new Set(sales.map(s => s.title).filter(t => t?.toLowerCase().includes(q)))].slice(0, 2);
    const suggestions = [...cities, ...tags, ...titles].slice(0, 5);
    setSearchSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  // Track view count when sale is opened
  const trackView = async (saleId) => {
    // Increment in Supabase
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_sale_view`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ sale_id_input: saleId })
      });
    } catch(e) {}
    setViewCounts(v => ({ ...v, [saleId]: (v[saleId] || Math.floor(Math.random() * 30) + 5) + 1 }));
  };

  const loadQuestions = async (saleId) => {
    try {
      const data = await api.getQuestions(saleId);
      setQuestions(Array.isArray(data) ? data : []);
    } catch(e) { setQuestions([]); }
  };

  const loadReviews = async (saleId) => {
    try {
      const data = await api.getReviews(saleId);
      setReviews(Array.isArray(data) ? data : []);
    } catch(e) { setReviews([]); }
  };

  const handleDelete = async (id) => {
    await api.deleteSale(id);
    await loadSales();
    setDeleteConfirm(null);
  };

  const navigateTo = (newView) => {
    setViewHistory(h => [...h.slice(-9), newView]);
    setView(newView);
    document.title = "Yardhunt.ca — Canada's Garage Sale Marketplace";
  };

  const goBack = () => {
    if (selectedSale) { setSelectedSale(null); return; }
    const prev = viewHistory.length > 1 ? viewHistory[viewHistory.length - 2] : "browse";
    setViewHistory(h => h.slice(0, -1));
    setView(prev);
  };

  const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = async (e) => {
    const diff = e.changedTouches[0].clientY - touchStartY;
    if (diff > 80 && window.scrollY === 0 && !isRefreshing) {
      setIsRefreshing(true);
      await loadSales();
      await loadAds();
      setIsRefreshing(false);
    }
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", paddingBottom: 70, position: "relative" }}>
      {/* Background image with overlay */}
      <div className="bg-image" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: "-20px",
          backgroundImage: "url('https://rcqlohlftafxicmfjkuf.supabase.co/storage/v1/object/public/assets/Gemini_Generated_Image_r7ys1er7ys1er7ys.png')",
          backgroundSize: "cover",
          backgroundPosition: "65% center",
          backgroundAttachment: "scroll",
          filter: darkMode ? "brightness(0.3) saturate(0.5)" : "brightness(0.85) saturate(0.8)",
          willChange: "transform",
          transform: "translateZ(0)",
        }} />
      </div>
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: darkMode ? "rgba(10,5,0,0.85)" : "rgba(28,16,9,0.55)" }} />
      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: "#1c1009", color: "#f5ddb4", padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
          🔄 Refreshing…
        </div>
      )}
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
        .card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 12px; border: 1px solid rgba(255,255,255,0.4); transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor: pointer; overflow: hidden; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(0,0,0,0.2); border-color: var(--crimson-light); background: rgba(255,255,255,0.92); }
        .glass { background: rgba(255,255,255,0.82); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.35); }
        .glass-dark { background: rgba(28,16,9,0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); }

        /* Buttons */
        .btn-primary { background: var(--crimson); color: white; border: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; cursor: pointer; font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 17px; letter-spacing: 0.3px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(185,28,28,0.3); }
        .btn-primary:hover { background: var(--crimson-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(185,28,28,0.4); }
        .btn-primary:active { transform: translateY(0); }
        .btn-secondary { background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: var(--bark); border: 1.5px solid rgba(255,255,255,0.5); padding: 11px 22px; border-radius: 8px; font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.2s; }
        .btn-secondary:hover { border-color: var(--crimson); color: var(--crimson); }

        /* Inputs */
        input[type=text], input[type=email], input[type=password], input[type=date], input[type=time], select, textarea {
          width: 100%; padding: 11px 16px; border: 1.5px solid var(--bark-pale); border-radius: 8px;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); font-size: 15px; color: var(--bark); outline: none;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--crimson); box-shadow: 0 0 0 3px rgba(185,28,28,0.08); }
        label { display: block; font-size: 12px; font-weight: 600; color: var(--bark-light); margin-bottom: 6px; letter-spacing: 0.8px; text-transform: uppercase; }

        /* Tags */
        .tag-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; letter-spacing: 0.3px; }

        /* Photo upload */
        .photo-thumb { position: relative; width: 88px; height: 88px; border-radius: 8px; overflow: hidden; border: 2px solid var(--bark-pale); flex-shrink: 0; }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
        @media (min-width: 769px) {
          .bg-image > div {
            background-position: center !important;
          }
        }
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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => setDarkMode(d => !d)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", padding: "8px 10px", fontSize: 16, transition: "all 0.2s" }} title="Toggle dark mode">
          {darkMode ? "☀️" : "🌙"}
        </button>
        <button onClick={() => setMenuOpen(m => !m)} style={{ background: menuOpen ? "rgba(185,28,28,0.2)" : "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4, transition: "all 0.2s" }}>
          <span style={{ display: "block", width: 20, height: 1.5, background: "#f5ddb4", transition: "all 0.25s", opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ display: "block", width: 20, height: 1.5, background: "#f5ddb4", transition: "all 0.25s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }}></span>
          <span style={{ display: "block", width: 20, height: 1.5, background: "#f5ddb4", transition: "all 0.25s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }}></span>
        </button>
        </div>
      </header>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div style={{ background: "#1c1009", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🍁</span>
            <div>
              <p style={{ color: "#f5ddb4", fontSize: 13, fontWeight: 600 }}>Add Yardhunt to your home screen!</p>
              <p style={{ color: "#78716c", fontSize: 11 }}>Browse sales like an app — fast & easy</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={async () => { if (installPrompt) { installPrompt.prompt(); setShowInstallBanner(false); } }} style={{ background: "#b91c1c", color: "white", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Install</button>
            <button onClick={() => setShowInstallBanner(false)} style={{ background: "transparent", color: "#78716c", border: "none", padding: "8px", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Dropdown Menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, right: 0, width: "min(300px, 100vw)", background: "#1c1009", zIndex: 99, borderLeft: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", boxShadow: "-8px 8px 40px rgba(0,0,0,0.5)", borderBottomLeftRadius: 16 }}>
          <div style={{ padding: "8px 0" }}>
            {[
              { label: "Browse Sales", icon: "🏠", view: "browse", action: () => { setView("browse"); setSelectedSale(null); } },
              { label: "Saved Sales", icon: "❤️", view: "favourites", action: () => setView("favourites") },
              { label: "Categories", icon: "🗂️", view: "categories", action: () => setView("categories") },
              { label: "Map View", icon: "🗺️", view: "map", action: () => setView("map") },
              { label: "Promote Your Business", icon: "📢", view: "advertise", action: () => setView("advertise") },
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
                <button onClick={() => { setView("auth"); setAuthMode("login"); setMenuOpen(false); }} className="btn-secondary" style={{ width: "100%", marginBottom: 10 }}>Sign In</button>
                <button onClick={() => { setView("auth"); setAuthMode("signup"); setMenuOpen(false); }} className="btn-secondary" style={{ width: "100%", borderColor: "#d97706", color: "#d97706" }}>✨ Create Free Account</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth View */}
      {view === "auth" && (
        <main style={{ maxWidth: 420, margin: "0 auto", padding: "50px 20px" }}>
          <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 16, padding: "40px 32px", boxShadow: "0 8px 48px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🍁</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: "#292524", marginBottom: 6 }}>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
              <p style={{ color: "#78716c", fontSize: 15 }}>{authMode === "login" ? "Sign in to post your sale" : "Join Canada's garage sale community"}</p>
            </div>
            {authSuccess && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#166534" }}>{authSuccess}</div>}
            {authError && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#991b1b" }}>{authError}</div>}

            {forgotMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 14, color: "#f5ddb4", textAlign: "center" }}>Enter your email and we'll send you a reset link</p>
                {forgotSuccess ? (
                  <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "16px", textAlign: "center" }}>
                    <p style={{ fontSize: 20, marginBottom: 8 }}>✅</p>
                    <p style={{ fontSize: 15, color: "#166534", fontWeight: 600 }}>Reset email sent!</p>
                    <p style={{ fontSize: 13, color: "#166534", marginTop: 4 }}>Check your inbox and follow the link to reset your password.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label>Email</label>
                      <input type="email" placeholder="your@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                    </div>
                    <button className="btn-primary" onClick={async () => { setForgotLoading(true); await api.resetPassword(forgotEmail); setForgotSuccess(true); setForgotLoading(false); }} disabled={forgotLoading || !forgotEmail} style={{ width: "100%", padding: "13px", fontSize: 16, opacity: forgotLoading || !forgotEmail ? 0.7 : 1 }}>
                      {forgotLoading ? "Sending…" : "📧 Send Reset Link"}
                    </button>
                  </>
                )}
                <p style={{ textAlign: "center", fontSize: 14, color: "#78716c", cursor: "pointer" }} onClick={() => { setForgotMode(false); setForgotSuccess(false); setForgotEmail(""); }}>← Back to Sign In</p>
              </div>
            ) : (
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
              {authMode === "login" && (
                <p style={{ textAlign: "center", fontSize: 14, color: "#78716c", cursor: "pointer" }} onClick={() => { setForgotMode(true); setAuthError(""); setAuthSuccess(""); }}>
                  Forgot your password?
                </p>
              )}
              <p style={{ textAlign: "center", fontSize: 14, color: "#78716c" }}>
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <span style={{ color: "#b91c1c", cursor: "pointer", fontWeight: 600 }} onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setAuthError(""); setAuthSuccess(""); setForgotMode(false); }}>
                  {authMode === "login" ? "Sign up free" : "Sign in"}
                </span>
              </p>
            </div>
            )}
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
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, zIndex: 2 }}>🔍</span>
                  <input type="text" placeholder="Search sales, items, cities…" value={search} onChange={e => handleSearchInput(e.target.value)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} onFocus={() => search.length >= 2 && setShowSuggestions(true)} style={{ paddingLeft: 40, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 10, fontSize: 15, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }} />
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 50, overflow: "hidden", marginTop: 4 }}>
                      {searchSuggestions.map((s, i) => (
                        <div key={i} onClick={() => { setSearch(s); setShowSuggestions(false); }} style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, color: "#292524", borderBottom: i < searchSuggestions.length - 1 ? "1px solid #f5f5f4" : "none", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "#78716c" }}>🔍</span> {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <select value={provFilter} onChange={e => setProvFilter(e.target.value)} style={{ width: 140, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 10, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <option value="">All Provinces</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.code} – {p.name}</option>)}
                </select>
                <button onClick={() => setView("favourites")} style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: favourites.length > 0 ? "#fff1f2" : "rgba(255,255,255,0.15)", color: favourites.length > 0 ? "#e11d48" : "white", fontSize: 13, cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  ❤️ {favourites.length > 0 ? favourites.length : ""} Saved
                </button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📍</span>
                  <input type="text" placeholder="Near me — type your city…" value={nearMe} onChange={e => setNearMe(e.target.value)} style={{ paddingLeft: 40, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: 10, fontSize: 14 }} />
                </div>
                {nearMe && <button onClick={() => setNearMe("")} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "11px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>✕ Clear</button>}
              </div>
              {/* Neighbourhood filter - only show if a city is typed */}
              {nearMe && (() => {
                const neighbourhoods = [...new Set(sales.filter(s => s.city?.toLowerCase().includes(nearMe.toLowerCase()) && s.neighbourhood).map(s => s.neighbourhood))];
                return neighbourhoods.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    <button onClick={() => setNeighbourhoodFilter("")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: !neighbourhoodFilter ? "white" : "rgba(255,255,255,0.2)", color: !neighbourhoodFilter ? "#292524" : "white", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>All</button>
                    {neighbourhoods.map(n => (
                      <button key={n} onClick={() => setNeighbourhoodFilter(n === neighbourhoodFilter ? "" : n)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: neighbourhoodFilter === n ? "white" : "rgba(255,255,255,0.2)", color: neighbourhoodFilter === n ? "#292524" : "white", fontSize: 12, cursor: "pointer" }}>{n}</button>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>
            <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 13, marginTop: 20, fontWeight: 600 }}>
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
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontStyle: "italic", fontWeight: 500 }}>Sorted by date</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                {filtered.reduce((acc, sale, idx) => {
                  // Insert a sponsored ad every 4 listings
                  if (idx > 0 && idx % 4 === 0) {
                    const cityAds = ads.filter(a => a.city?.toLowerCase() === (sale.city||"").toLowerCase() || !a.city);
                    const ad = cityAds[Math.floor(idx/4 - 1) % cityAds.length];
                    if (ad) acc.push(
                      <div key={`ad-${ad.id}-${idx}`} style={{ background: "linear-gradient(135deg, #1c1009, #2d1b0e)", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.15)", border: "2px solid #d97706", position: "relative" }}>
                        <div style={{ position: "absolute", top: 10, right: 10, background: "#d97706", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: 0.8 }}>SPONSORED</div>
                        {ad.logo_url && <img src={ad.logo_url} alt={ad.business_name} style={{ width: "100%", height: 140, objectFit: "cover", opacity: 0.9 }} />}
                        {!ad.logo_url && <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📢</div>}
                        <div style={{ padding: "16px 20px" }}>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#f5ddb4", marginBottom: 6 }}>{ad.business_name}</p>
                          <p style={{ fontSize: 13, color: "#a8a29e", marginBottom: 10, lineHeight: 1.5 }}>{ad.description}</p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: "#78716c" }}>📍 {ad.city}</span>
                            <a href={ad.website} target="_blank" rel="noreferrer" style={{ background: "#d97706", color: "white", padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Visit →</a>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  acc.push(
                  <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setPhotoIndex(0); loadReviews(sale.id); loadQuestions(sale.id); trackView(sale.id); setReviewSuccess(false); setReviewComment(''); setReviewRating(5); setQuestionText(""); }} style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 8, overflow: "hidden", boxShadow: sale.is_featured === "premium" ? "0 4px 20px rgba(185,28,28,0.35)" : sale.is_featured === "basic" ? "0 4px 16px rgba(217,119,6,0.3)" : "0 2px 16px rgba(0,0,0,0.15)", border: sale.is_featured === "premium" ? "2px solid #b91c1c" : sale.is_featured === "basic" ? "2px solid #d97706" : "1px solid rgba(255,255,255,0.5)", position: "relative" }}>
                    {sale.is_featured === "premium" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "linear-gradient(90deg, #b91c1c, #7f1d1d)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", textAlign: "center", letterSpacing: 1, zIndex: 2 }}>🌟 PREMIUM FEATURED</div>}
                    {sale.is_featured === "basic" && <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "linear-gradient(90deg, #d97706, #92400e)", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", textAlign: "center", letterSpacing: 1, zIndex: 2 }}>⭐ FEATURED</div>}
                    {sale.photos && sale.photos.length > 0 ? (
                      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                        <img src={sale.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {sale.photos.length > 1 && <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", fontSize: 11, padding: "3px 8px", borderRadius: 10 }}>+{sale.photos.length - 1} photos</span>}
                      </div>
                    ) : (
                      <div style={{ background: "linear-gradient(135deg, #6b1a1a, #c0392b)", padding: "20px 20px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <span style={{ fontSize: 32 }}>{sale.emoji || "🏠"}</span>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{sale.title}</p>
                            {sale.is_verified && <span style={{ background: "#059669", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, letterSpacing: 0.5 }}>✓ VERIFIED</span>}
                          </div>
                          <p style={{ color: "#f5ddb4", fontSize: 12, marginTop: 4 }}>📍 {sale.city}, {sale.province}</p>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: "16px 20px" }}>
                      {sale.photos && sale.photos.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "#2d1b0e" }}>{sale.title}</p>
                          {sale.is_verified && <span style={{ background: "#059669", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, letterSpacing: 0.5 }}>✓ VERIFIED</span>}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, color: "#7a5c3a" }}>📍 {sale.city}, {sale.province}</span>
                        <span style={{ fontSize: 13, color: "#7a5c3a" }}>📅 {new Date(sale.date + "T12:00:00").toLocaleDateString("en-CA", { month:"short", day:"numeric" })}</span>
                        {sale.start_time && <span style={{ fontSize: 13, color: "#7a5c3a" }}>⏰ {sale.start_time}</span>}
                        {getCountdown(sale.date, sale.start_time) && (
                          <span style={{ fontSize: 12, background: "#fef3c7", color: "#d97706", padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>⏱️ {getCountdown(sale.date, sale.start_time)}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 14, color: "#5a4030", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{sale.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                        {(sale.tags||[]).map((tag) => <span key={tag} className="tag-pill" style={{ background: (tagColors[tag]||"#a08060")+"22", color: tagColors[tag]||"#a08060", border: `1px solid ${tagColors[tag]||"#a08060"}55` }}>{tag}</span>)}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#a8a29e" }}>{viewCounts[sale.id] ? `👁️ ${viewCounts[sale.id]}` : ""}</span>
                        <button onClick={e => { e.stopPropagation(); setFavourites(f => f.includes(sale.id) ? f.filter(id=>id!==sale.id) : [...f, sale.id]); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "2px 4px" }}>
                          {favourites.includes(sale.id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
                  return acc;
                }, [])}
              </div>
            </>
          )}
          {!user && sales.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 40, padding: "28px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#2d1b0e", marginBottom: 8 }}>Have a sale coming up?</p>
              <p style={{ color: "#7a5c3a", fontSize: 14, marginBottom: 16 }}>Create a free account to post your sale and reach Canadians near you.</p>
              <button className="btn-primary" onClick={() => { setAuthMode("signup"); setView("auth"); }}>🍁 Post Your Sale Free</button>
            </div>
          )}

          {/* Donation Box */}
          <div style={{ marginTop: 40, background: "linear-gradient(135deg, #1c1009, #2d1b0e)", borderRadius: 12, padding: "32px 28px", textAlign: "center" }}>
            {donationSuccess ? (
              <div>
                <p style={{ fontSize: 48, marginBottom: 12 }}>💝</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#f5ddb4", marginBottom: 8 }}>Thank You So Much! 🍁</h3>
                <p style={{ color: "#a8a29e", fontSize: 15 }}>Your support means everything and helps keep Yardhunt.ca free for all Canadians.</p>
                <button onClick={() => setDonationSuccess(false)} style={{ marginTop: 16, background: "transparent", border: "1px solid #d97706", color: "#d97706", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>💝 Donate Again</button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 40, marginBottom: 10 }}>💝</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#f5ddb4", marginBottom: 8 }}>Support Yardhunt.ca</h3>
                <p style={{ color: "#a8a29e", fontSize: 14, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>Love using Yardhunt? Help keep it free for all Canadians with a small tip. Every dollar helps! 🍁</p>
                {/* Preset amounts */}
                <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  {[3, 5, 10, 25].map(amt => (
                    <button key={amt} onClick={() => setDonationAmount(String(amt))} style={{ padding: "10px 20px", borderRadius: 20, border: `2px solid ${donationAmount === String(amt) ? "#d97706" : "rgba(255,255,255,0.15)"}`, background: donationAmount === String(amt) ? "#d97706" : "transparent", color: donationAmount === String(amt) ? "white" : "#f5ddb4", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                      ${amt}
                    </button>
                  ))}
                </div>
                {/* Custom amount */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 280, margin: "0 auto 16px", background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "4px 16px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <span style={{ color: "#f5ddb4", fontSize: 18, fontWeight: 700 }}>$</span>
                  <input type="number" min="1" placeholder="Custom amount" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} style={{ background: "transparent", border: "none", color: "white", fontSize: 16, width: "100%", outline: "none", padding: "10px 0" }} />
                  <span style={{ color: "#78716c", fontSize: 13 }}>CAD</span>
                </div>
                {/* Optional name + message */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380, margin: "0 auto 20px" }}>
                  <input placeholder="Your name (optional)" value={donationName} onChange={e => setDonationName(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: 14 }} />
                  <input placeholder="Leave a message (optional)" value={donationMessage} onChange={e => setDonationMessage(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "white", fontSize: 14 }} />
                </div>
                <button disabled={donationLoading || !donationAmount || parseFloat(donationAmount) < 1} onClick={async () => {
                  setDonationLoading(true);
                  try {
                    const res = await fetch("https://rcqlohlftafxicmfjkuf.supabase.co/functions/v1/create-donation-checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_KEY}` },
                      body: JSON.stringify({ amount: parseFloat(donationAmount), name: donationName, message: donationMessage })
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                    else alert("Something went wrong. Please try again.");
                  } catch(e) { alert("Error. Please try again."); }
                  setDonationLoading(false);
                }} style={{ background: donationAmount && parseFloat(donationAmount) >= 1 ? "#d97706" : "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "14px 36px", borderRadius: 10, fontSize: 17, fontWeight: 700, cursor: donationAmount && parseFloat(donationAmount) >= 1 ? "pointer" : "default", fontFamily: "'Cormorant Garamond', serif", transition: "all 0.2s" }}>
                  {donationLoading ? "Setting up…" : `💝 Donate ${donationAmount ? "$"+donationAmount : ""} CAD`}
                </button>
                <p style={{ fontSize: 11, color: "#44403c", marginTop: 12 }}>🔒 Secure payment via Stripe · No account needed</p>
              </>
            )}
          </div>

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
          <button onClick={() => setSelectedSale(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>← Back to listings</button>
          <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.5)" }}>
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
                    {selectedSale.photos.slice(0, unlockedSales.includes(selectedSale.id) ? selectedSale.photos.length : 6).map((p, i) => (
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
                      <p style={{ fontSize: 12, color: "#f5ddb499" }}>Unlock all for just ${listingPricing.photo_unlock}</p>
                    </div>
                    <button onClick={() => createListingCheckout("photo_unlock", selectedSale.id)} style={{ background: "#d97706", color: "white", padding: "10px 18px", borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>{`📸 Unlock All — $${listingPricing.photo_unlock}`}</button>
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "#292524" }}>{selectedSale.title}</h2>
                    {selectedSale.is_verified && <span style={{ background: "#059669", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 10, letterSpacing: 0.5 }}>✓ VERIFIED SELLER</span>}
                  </div>
                  <p style={{ color: "#78716c", fontSize: 14 }}>Hosted by {selectedSale.name||"Anonymous"}</p>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
                {[["📍 Address", `${selectedSale.address}${selectedSale.neighbourhood ? ", "+selectedSale.neighbourhood : ""}, ${selectedSale.city}, ${selectedSale.province}`], ["📅 Date", new Date(selectedSale.date+"T12:00:00").toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})], ["⏰ Hours", selectedSale.start_time ? `${selectedSale.start_time} – ${selectedSale.end_time}` : "See description"],
                    ...(selectedSale.extra_date ? [["📅 Day 2", new Date(selectedSale.extra_date+"T12:00:00").toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})+(selectedSale.extra_date_end ? " until "+selectedSale.extra_date_end : "")]] : [])
                  ].map(([label,val])=>(
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
                    {(selectedSale.tags||[]).map((tag) => <span key={tag} className="tag-pill" style={{ background: (tagColors[tag]||"#a08060")+"22", color: tagColors[tag]||"#a08060", border: `1px solid ${tagColors[tag]||"#a08060"}55`, padding: "6px 14px", fontSize: 13 }}>{tag}</span>)}
                  </div>
                </>
              )}
              <div style={{ marginTop: 24, padding: "14px", background: "#fff3e0", borderRadius: 6, border: "1px solid #f5c27a" }}>
                <p style={{ fontSize: 13, color: "#7a4a00", fontStyle: "italic" }}>🍁 Tip: Always confirm details with the seller before heading out. Sales can end early!</p>
              </div>
              {/* Countdown timer in detail */}
              {getCountdown(selectedSale.date, selectedSale.start_time) && (
                <div style={{ marginTop: 16, background: "linear-gradient(135deg, #fef3c7, #fff8e7)", borderRadius: 10, padding: "14px 18px", border: "1px solid #d97706", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 12, color: "#92400e", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>Sale starts in</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#d97706" }}>⏱️ {getCountdown(selectedSale.date, selectedSale.start_time)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 12, color: "#92400e" }}>{new Date(selectedSale.date + "T12:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" })}</p>
                    {selectedSale.start_time && <p style={{ fontSize: 12, color: "#92400e" }}>Starts at {selectedSale.start_time}</p>}
                  </div>
                </div>
              )}

              {/* I'm Going button */}
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={() => setGoingList(g => g.includes(selectedSale.id) ? g.filter(id => id !== selectedSale.id) : [...g, selectedSale.id])} style={{ padding: "13px", borderRadius: 10, border: goingList.includes(selectedSale.id) ? "2px solid #059669" : "2px solid #e7e5e4", background: goingList.includes(selectedSale.id) ? "#f0fdf4" : "white", color: goingList.includes(selectedSale.id) ? "#059669" : "#78716c", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  {goingList.includes(selectedSale.id) ? "✅ Going!" : "👍 I'm Going!"}
                </button>
                <button onClick={() => setFavourites(f => { const n = f.includes(selectedSale.id) ? f.filter(id=>id!==selectedSale.id) : [...f, selectedSale.id]; return n; })} style={{ padding: "13px", borderRadius: 10, border: favourites.includes(selectedSale.id) ? "2px solid #e11d48" : "2px solid #e7e5e4", background: favourites.includes(selectedSale.id) ? "#fff1f2" : "white", color: favourites.includes(selectedSale.id) ? "#e11d48" : "#78716c", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  {favourites.includes(selectedSale.id) ? "❤️ Saved!" : "🤍 Save Sale"}
                </button>
              </div>
              {/* Get Directions + Reminder */}
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedSale.address+", "+selectedSale.city+", "+selectedSale.province)}`} target="_blank" rel="noreferrer" style={{ padding: "12px", borderRadius: 10, border: "2px solid #2563eb", background: "#eff6ff", color: "#2563eb", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block" }}>
                  🗺️ Get Directions
                </a>
                <button onClick={() => {
                  const isReminded = reminderSales.includes(selectedSale.id);
                  setReminderSales(r => isReminded ? r.filter(id=>id!==selectedSale.id) : [...r, selectedSale.id]);
                  if (!isReminded) alert("✅ Reminder set! We'll remind you the day before this sale.");
                }} style={{ padding: "12px", borderRadius: 10, border: reminderSales.includes(selectedSale.id) ? "2px solid #d97706" : "2px solid #e7e5e4", background: reminderSales.includes(selectedSale.id) ? "#fffbeb" : "white", color: reminderSales.includes(selectedSale.id) ? "#d97706" : "#78716c", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  {reminderSales.includes(selectedSale.id) ? "⏰ Reminded!" : "⏰ Remind Me"}
                </button>
              </div>
              {/* Share to WhatsApp/Facebook */}
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <a href={`https://wa.me/?text=${encodeURIComponent("Check out this garage sale: "+selectedSale.title+" in "+selectedSale.city+" — https://yardhunt.ca?sale="+selectedSale.id)}`} target="_blank" rel="noreferrer" style={{ padding: "11px", borderRadius: 10, border: "2px solid #25d366", background: "#f0fdf4", color: "#25d366", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block" }}>
                  💬 Share on WhatsApp
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://yardhunt.ca?sale="+selectedSale.id)}`} target="_blank" rel="noreferrer" style={{ padding: "11px", borderRadius: 10, border: "2px solid #1877f2", background: "#eff6ff", color: "#1877f2", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "block" }}>
                  📘 Share on Facebook
                </a>
              </div>
              {/* Seller Profile link */}
              {selectedSale.user_id && (
                <button onClick={() => setSellerProfileId(selectedSale.user_id)} style={{ marginTop: 10, width: "100%", padding: "11px", borderRadius: 10, border: "2px solid #e7e5e4", background: "white", color: "#78716c", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  👤 View Seller Profile
                </button>
              )}
              {/* View count */}
              {viewCounts[selectedSale.id] > 0 && (
                <p style={{ textAlign: "center", fontSize: 12, color: "#a8a29e", marginTop: 8 }}>👁️ {viewCounts[selectedSale.id]} view{viewCounts[selectedSale.id]>1?"s":""} this session</p>
              )}

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
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#2d1b0e", marginBottom: 4 }}>${listingPricing.basic_featured}</p>
                      <p style={{ fontSize: 11, color: "#7a5c3a", marginBottom: 12 }}>CAD one-time</p>
                      <ul style={{ fontSize: 12, color: "#5a4030", textAlign: "left", marginBottom: 14, paddingLeft: 16 }}>
                        <li>⭐ Featured badge</li>
                        <li>📌 Pinned to top</li>
                        <li>3 day boost</li>
                      </ul>
                      <button onClick={() => createListingCheckout("basic_featured", selectedSale.id)} style={{ display: "block", width: "100%", background: "#f5a623", color: "white", padding: "10px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>{`⭐ Get Basic — $${listingPricing.basic_featured}`}</button>
                    </div>
                    <div style={{ background: "linear-gradient(135deg, #2d1b0e, #c0392b)", borderRadius: 8, padding: "16px", border: "2px solid #c0392b", textAlign: "center", position: "relative" }}>
                      <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#c0392b", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10, whiteSpace: "nowrap" }}>BEST VALUE</div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#f5ddb4", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Premium</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4 }}>${listingPricing.premium_featured}</p>
                      <p style={{ fontSize: 11, color: "#f5ddb4", marginBottom: 12 }}>CAD one-time</p>
                      <ul style={{ fontSize: 12, color: "#f5ddb4", textAlign: "left", marginBottom: 14, paddingLeft: 16 }}>
                        <li>🌟 Premium badge</li>
                        <li>📌 #1 position</li>
                        <li>7 day boost</li>
                        <li>Bold highlighted card</li>
                      </ul>
                      <button onClick={() => createListingCheckout("premium_featured", selectedSale.id)} style={{ display: "block", width: "100%", background: "white", color: "#c0392b", padding: "10px", borderRadius: 6, fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>{`🌟 Get Premium — $${listingPricing.premium_featured}`}</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Q&A Section */}
              <div style={{ marginTop: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#2d1b0e", marginBottom: 16 }}>💬 Questions & Answers</h3>
                {/* Existing questions */}
                {questions.length > 0 && (
                  <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                    {questions.map(q => (
                      <div key={q.id} style={{ background: "rgba(253,250,245,0.7)", borderRadius: 10, padding: "14px 16px", border: "1px solid #e7e5e4" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <p style={{ fontSize: 14, color: "#292524", fontWeight: 600 }}>❓ {q.question}</p>
                          <span style={{ fontSize: 11, color: "#a8a29e", whiteSpace: "nowrap", marginLeft: 8 }}>{new Date(q.created_at).toLocaleDateString("en-CA")}</span>
                        </div>
                        {q.answer ? (
                          <p style={{ fontSize: 13, color: "#059669", background: "#f0fdf4", padding: "8px 12px", borderRadius: 6, marginTop: 6 }}>💬 <strong>Seller:</strong> {q.answer}</p>
                        ) : (
                          <p style={{ fontSize: 12, color: "#a8a29e", fontStyle: "italic" }}>Awaiting seller response…</p>
                        )}
                        {/* Seller can answer */}
                        {user && selectedSale.user_id === user.id && !q.answer && (
                          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                            <input placeholder="Type your answer…" value={answerText[q.id]||""} onChange={e => setAnswerText(a=>({...a,[q.id]:e.target.value}))} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #e7e5e4", fontSize: 13 }} />
                            <button onClick={async () => {
                              if (!answerText[q.id]) return;
                              await api.answerQuestion(q.id, answerText[q.id]);
                              setAnswerText(a=>({...a,[q.id]:""}));
                              loadQuestions(selectedSale.id);
                            }} style={{ background: "#059669", color: "white", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Reply</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {questions.length === 0 && <p style={{ fontSize: 13, color: "#a8a29e", marginBottom: 12, fontStyle: "italic" }}>No questions yet — be the first to ask!</p>}
                {/* Ask a question */}
                {user && selectedSale.user_id !== user.id && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input placeholder="Ask the seller a question…" value={questionText} onChange={e => setQuestionText(e.target.value)} onKeyDown={e => { if(e.key==="Enter" && questionText.trim()) document.getElementById("ask-btn").click(); }} style={{ flex: 1, padding: "11px 14px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 14 }} />
                    <button id="ask-btn" disabled={questionSubmitting || !questionText.trim()} onClick={async () => {
                      setQuestionSubmitting(true);
                      await api.addQuestion({ sale_id: selectedSale.id, user_id: user.id, user_email: user.email, question: questionText.trim(), answer: null });
                      setQuestionText("");
                      loadQuestions(selectedSale.id);
                      setQuestionSubmitting(false);
                    }} style={{ background: "#b91c1c", color: "white", border: "none", padding: "11px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>
                      {questionSubmitting ? "…" : "Ask"}
                    </button>
                  </div>
                )}
                {!user && <p style={{ fontSize: 13, color: "#78716c" }}><span style={{ color: "#c0392b", cursor: "pointer", textDecoration: "underline" }} onClick={() => { setAuthMode("login"); setView("auth"); }}>Sign in</span> to ask the seller a question</p>}
              </div>

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
                      <p style={{ fontSize: 13, color: "#78716c", marginBottom: 12 }}>Upgrade to upload up to <strong>20 photos</strong> for just ${listingPricing.extra_photos}!</p>
                      <button onClick={() => createListingCheckout("extra_photos")} style={{ display: "inline-block", background: "#d97706", color: "white", padding: "10px 20px", borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>{`📸 Unlock 20 Photos — $${listingPricing.extra_photos}`}</button>
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div><label style={{fontSize:10}}>Date *</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                  <div><label style={{fontSize:10}}>Start Time</label><input type="time" value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                  <div><label style={{fontSize:10}}>End Time</label><input type="time" value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                </div>
                {/* Second date for 2-day sales */}
                <div>
                  <label style={{ fontSize: 12, color: "#78716c", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={!!form.extraDate} onChange={e => setForm(f=>({...f, extraDate: e.target.checked ? f.date : "", extraDateEnd: ""}))} />
                    <span>📅 This is a 2-day sale (add second day)</span>
                  </label>
                  {form.extraDate !== undefined && form.extraDate !== "" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                      <div><label style={{fontSize:10}}>Day 2 Date</label><input type="date" value={form.extraDate} onChange={e=>setForm(f=>({...f,extraDate:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                      <div><label style={{fontSize:10}}>Day 2 Start Time</label><input type="time" value={form.extraDateStart||""} onChange={e=>setForm(f=>({...f,extraDateStart:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                      <div><label style={{fontSize:10}}>Day 2 End Time</label><input type="time" value={form.extraDateEnd} onChange={e=>setForm(f=>({...f,extraDateEnd:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                    </div>
                  )}
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
                  {(!form.title||!form.address||!form.city||!form.province||!form.date) && <p style={{ fontSize: 12, color: "#f5ddb4", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>* Required fields must be filled</p>}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {/* Seller Dashboard */}
      {view === "dashboard" && user && (
        <main style={{ maxWidth: 800, margin: "0 auto", padding: "36px 20px" }}>
          <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 20, padding: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: "white", marginBottom: 6, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>My Dashboard</h2>
          <p style={{ color: "#7a5c3a", fontSize: 14, fontStyle: "italic", marginBottom: 20 }}>Manage your listings & questions</p>
          {/* Dashboard Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            <button onClick={() => setDashTab("listings")} style={{ padding: "9px 20px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: dashTab === "listings" ? "#1c1009" : "#f5f5f4", color: dashTab === "listings" ? "#f5ddb4" : "#78716c" }}>
              🏠 My Listings ({mySales.length})
            </button>
            <button onClick={async () => { setDashTab("questions"); const data = await api.getMyQuestions(mySales.map(s=>s.id)); setMyQuestions(Array.isArray(data)?data:[]); }} style={{ padding: "9px 20px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: dashTab === "questions" ? "#1c1009" : "#f5f5f4", color: dashTab === "questions" ? "#f5ddb4" : "#78716c", position: "relative" }}>
              💬 Questions {myQuestions.filter(q=>!q.answer).length > 0 && <span style={{ background: "#b91c1c", color: "white", fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 10, marginLeft: 4 }}>{myQuestions.filter(q=>!q.answer).length}</span>}
            </button>
          </div>

          {dashTab === "listings" && <>{mySales.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#7a5c3a" }}>No sales posted yet</p>
              <p style={{ color: "#a08060", marginTop: 8, marginBottom: 20 }}>Post your first sale and it will appear here!</p>
              <button className="btn-primary" onClick={() => setView("post")}>🍁 Post a Sale</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mySales.map(sale => (
                <div key={sale.id} style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 8, padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.4)" }}>
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
                        {(sale.tags || []).map((tag) => (
                          <span key={tag} className="tag-pill" style={{ background: (tagColors[tag] || "#a08060") + "22", color: tagColors[tag] || "#a08060", border: `1px solid ${tagColors[tag] || "#a08060"}55` }}>{tag}</span>
                        ))}
                      </div>
                      {/* Analytics */}
                      {saleAnalytics[sale.id] && (
                        <div style={{ display: "flex", gap: 16, marginTop: 12, padding: "10px 14px", background: "rgba(253,250,245,0.7)", borderRadius: 8, border: "1px solid #e7e5e4" }}>
                          <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#b91c1c", fontFamily: "'Cormorant Garamond', serif" }}>{saleAnalytics[sale.id].views || 0}</p>
                            <p style={{ fontSize: 11, color: "#78716c" }}>👁️ Views</p>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#059669", fontFamily: "'Cormorant Garamond', serif" }}>{saleAnalytics[sale.id].saves || 0}</p>
                            <p style={{ fontSize: 11, color: "#78716c" }}>❤️ Saves</p>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#2563eb", fontFamily: "'Cormorant Garamond', serif" }}>{saleAnalytics[sale.id].going || 0}</p>
                            <p style={{ fontSize: 11, color: "#78716c" }}>👍 Going</p>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <p style={{ fontSize: 18, fontWeight: 700, color: "#d97706", fontFamily: "'Cormorant Garamond', serif" }}>{saleAnalytics[sale.id].directions || 0}</p>
                            <p style={{ fontSize: 11, color: "#78716c" }}>🗺️ Directions</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => { setSelectedSale(sale); setView("browse"); }} style={{ background: "#fdf6ec", color: "#7a5c3a", border: "1px solid #e8d9c4", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>👁 View</button>
                      <button onClick={() => { setEditingSale(sale.id); setEditForm({ title: sale.title, address: sale.address, city: sale.city, province: sale.province, date: sale.date, startTime: sale.start_time||"", endTime: sale.end_time||"", description: sale.description||"", tags: sale.tags||[], extraDate: sale.extra_date||"", extraDateStart: sale.extra_date_start||"", extraDateEnd: sale.extra_date_end||"" }); }} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>✏️ Edit</button>
                      <button onClick={() => createListingCheckout("basic_featured", sale.id)} style={{ background: "#f5a623", color: "white", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{`⭐ $${listingPricing.basic_featured}`}</button>
                      <button onClick={() => createListingCheckout("premium_featured", sale.id)} style={{ background: "#c0392b", color: "white", border: "none", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{`🌟 $${listingPricing.premium_featured}`}</button>
                      {deleteConfirm === sale.id ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleDelete(sale.id)} style={{ background: "#e74c3c", color: "white", border: "none", padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Yes, delete</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ background: "#fdf6ec", color: "#7a5c3a", border: "1px solid #e8d9c4", padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Cancel</button>
                        </div>
                      ) : (
                        <>
                        <button onClick={() => setDeleteConfirm(sale.id)} style={{ background: "transparent", color: "#e74c3c", border: "1px solid #e74c3c55", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>🗑 Delete</button>
                        <button onClick={async () => { await api.deleteSale(sale.id); await loadSales(); }} style={{ background: "#f5f5f4", color: "#78716c", border: "1px solid #e7e5e4", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>✅ Sale Ended</button>
                      </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Verified Seller Badge */}
              <div style={{ background: "linear-gradient(135deg, #ecfdf5, #d1fae5)", borderRadius: 12, padding: "20px 24px", border: "2px solid #6ee7b7", textAlign: "center" }}>
                {verified ? (
                  <>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>✅</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#059669" }}>You're a Verified Seller!</p>
                    <p style={{ fontSize: 13, color: "#065f46", marginTop: 4 }}>Your listings show the ✓ Verified badge — buyers trust you more!</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>🏅</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#292524", marginBottom: 6 }}>Get Verified Seller Badge</p>
                    <p style={{ fontSize: 13, color: "#78716c", marginBottom: 16 }}>Show buyers you're trustworthy! A ✓ green badge appears on ALL your listings for just ${listingPricing.verified_badge} one-time.</p>
                    <button onClick={() => createListingCheckout("verified_badge")} style={{ display: "inline-block", background: "#059669", color: "white", padding: "12px 24px", borderRadius: 8, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" }}>{`✓ Get Verified — $${listingPricing.verified_badge}`}</button>
                  </>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: 8 }}>
                <button className="btn-primary" onClick={() => setView("post")}>🍁 Post Another Sale</button>
              </div>
            </div>
          )}
          </>}

            {/* Questions Tab */}
            {dashTab === "questions" && (
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 6 }}>💬 Questions from Buyers</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>Buyers can ask questions about your listings. Answer them here!</p>
                {myQuestions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)" }}>
                    <p style={{ fontSize: 36, marginBottom: 10 }}>💬</p>
                    <p style={{ color: "#78716c", fontSize: 14 }}>No questions yet — they'll appear here when buyers ask!</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {myQuestions.map(q => {
                      const sale = mySales.find(s => s.id === q.sale_id);
                      return (
                        <div key={q.id} style={{ background: "white", borderRadius: 12, padding: "18px 20px", border: q.answer ? "1px solid #e7e5e4" : "2px solid #fca5a5", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              {sale && <p style={{ fontSize: 11, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Re: {sale.title}</p>}
                              <p style={{ fontSize: 15, color: "#292524", fontWeight: 600 }}>❓ {q.question}</p>
                              <p style={{ fontSize: 12, color: "#a8a29e", marginTop: 2 }}>Asked by {q.user_email?.split("@")[0]} · {new Date(q.created_at).toLocaleDateString("en-CA")}</p>
                            </div>
                            {!q.answer && <span style={{ background: "#fef2f2", color: "#b91c1c", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>Needs Reply</span>}
                            {q.answer && <span style={{ background: "#f0fdf4", color: "#059669", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>✅ Answered</span>}
                          </div>
                          {q.answer ? (
                            <p style={{ fontSize: 13, color: "#059669", background: "#f0fdf4", padding: "10px 14px", borderRadius: 8 }}>💬 Your reply: {q.answer}</p>
                          ) : (
                            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                              <input placeholder="Type your answer…" value={answerText[q.id]||""} onChange={e => setAnswerText(a=>({...a,[q.id]:e.target.value}))} onKeyDown={async e => { if(e.key==="Enter" && answerText[q.id]) { await api.answerQuestion(q.id, answerText[q.id]); setAnswerText(a=>({...a,[q.id]:""})); const data = await api.getMyQuestions(mySales.map(s=>s.id)); setMyQuestions(Array.isArray(data)?data:[]); }}} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 14 }} />
                              <button onClick={async () => {
                                if (!answerText[q.id]) return;
                                await api.answerQuestion(q.id, answerText[q.id]);
                                setAnswerText(a=>({...a,[q.id]:""}));
                                const data = await api.getMyQuestions(mySales.map(s=>s.id));
                                setMyQuestions(Array.isArray(data)?data:[]);
                              }} style={{ background: "#059669", color: "white", border: "none", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Reply</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
      )}


      {/* ===== ADVERTISE PAGE ===== */}
      {view === "advertise" && (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>
          <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 20, padding: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            ← Back
          </button>
          {adSuccess ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "2px solid #059669" }}>
              <p style={{ fontSize: 56, marginBottom: 16 }}>🎉</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#059669", marginBottom: 10 }}>Payment Successful!</h2>
              <p style={{ color: "#78716c", fontSize: 16, marginBottom: 24 }}>Your ad is being reviewed and will go live within 24 hours. We'll email you at {adForm.email} when it's active.</p>
              <button className="btn-primary" onClick={() => { setAdSuccess(false); setView("browse"); }}>Back to Browse 🍁</button>
            </div>
          ) : (
            <>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #1c1009, #3b0f0f)", borderRadius: 16, padding: "40px 32px", marginBottom: 40, textAlign: "center", color: "white" }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>📢</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: "#f5ddb4", marginBottom: 10 }}>Promote Your Business</h1>
              <p style={{ fontSize: 16, color: "#a8a29e", maxWidth: 560, margin: "0 auto 20px" }}>Reach thousands of Canadians actively browsing garage sales in your city. Your ad appears natively in the feed — no banners, no popups.</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
                {[["🎯", "City Targeted"], ["👥", "Active Buyers"], ["📱", "Mobile First"], ["🍁", "Canada Wide"]].map(([icon, label]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 24 }}>{icon}</p>
                    <p style={{ fontSize: 12, color: "#f5ddb4", fontWeight: 600 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#292524", marginBottom: 16, textAlign: "center" }}>Choose Your Package</h2>
            {/* Billing period toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", background: "#f5f5f4", borderRadius: 30, padding: 4, gap: 4 }}>
                <button onClick={() => setAdForm(f=>({...f, billing_period:"weekly"}))} style={{ padding: "8px 24px", borderRadius: 26, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: adForm.billing_period === "weekly" ? "white" : "transparent", color: adForm.billing_period === "weekly" ? "#292524" : "#78716c", boxShadow: adForm.billing_period === "weekly" ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
                  Weekly
                </button>
                <button onClick={() => setAdForm(f=>({...f, billing_period:"monthly"}))} style={{ padding: "8px 24px", borderRadius: 26, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: adForm.billing_period === "monthly" ? "white" : "transparent", color: adForm.billing_period === "monthly" ? "#292524" : "#78716c", boxShadow: adForm.billing_period === "monthly" ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
                  Monthly <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: 10, marginLeft: 4 }}>Save 20%</span>
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 40 }}>
              {[
                { type: "Starter", icon: "⭐", desc: "Perfect for local businesses just getting started", features: ["Appears in feed every 4 listings", "City targeted", "Business name + description", "Link to your website"], color: "#d97706" },
                { type: "City", icon: "🌟", desc: "More visibility across your entire city", features: ["2x more impressions", "City + neighbourhood targeted", "Logo/image support", "Priority placement"], color: "#7c3aed", best: true },
                { type: "Premium", icon: "💎", desc: "Maximum exposure across multiple cities", features: ["Province-wide reach", "Top of feed placement", "Logo + custom banner", "Weekly performance report"], color: "#b91c1c" },
              ].map(pkg => {
                const pricing = adPricing.find(p => p.package_type === pkg.type);
                const monthlyPrice = pricing?.price || (pkg.type === "Starter" ? 99 : pkg.type === "City" ? 149 : 199);
                const weeklyPrice = pricing?.weekly_price || Math.round(monthlyPrice / 4);
                const price = adForm.billing_period === "weekly" ? weeklyPrice : monthlyPrice;
                return (
                  <div key={pkg.type} onClick={() => setAdForm(f => ({...f, package_type: pkg.type}))} style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 12, padding: "24px", border: adForm.package_type === pkg.type ? `2px solid ${pkg.color}` : "1px solid #e7e5e4", cursor: "pointer", position: "relative", boxShadow: adForm.package_type === pkg.type ? `0 4px 20px ${pkg.color}33` : "none" }}>
                    {pkg.best && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#7c3aed", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                    <p style={{ fontSize: 28, marginBottom: 8 }}>{pkg.icon}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#292524", marginBottom: 4 }}>{pkg.type}</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: pkg.color, marginBottom: 4 }}>${price}<span style={{ fontSize: 14, color: "#78716c", fontWeight: 400 }}>/{adForm.billing_period === "weekly" ? "wk" : "mo"}</span></p>
                    <p style={{ fontSize: 13, color: "#78716c", marginBottom: 14 }}>{pkg.desc}</p>
                    <ul style={{ fontSize: 13, color: "#292524", paddingLeft: 16 }}>
                      {pkg.features.map(f => <li key={f} style={{ marginBottom: 4 }}>✓ {f}</li>)}
                    </ul>
                    {adForm.package_type === pkg.type && <div style={{ marginTop: 14, background: pkg.color, color: "white", textAlign: "center", padding: "6px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>✓ Selected</div>}
                  </div>
                );
              })}
            </div>

            {/* Ad Form */}
            <div style={{ background: "white", borderRadius: 16, padding: "32px", border: "1px solid #e7e5e4", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#292524", marginBottom: 6 }}>Your Business Details</h2>
              <p style={{ color: "#78716c", fontSize: 14, marginBottom: 24 }}>Fill in your info and we'll set up your ad automatically after payment.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label>Business Name *</label><input value={adForm.business_name} onChange={e=>setAdForm(f=>({...f,business_name:e.target.value}))} placeholder="e.g. John's Junk Removal" /></div>
                  <div><label>Your Email *</label><input type="email" value={adForm.email} onChange={e=>setAdForm(f=>({...f,email:e.target.value}))} placeholder="you@business.com" /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label>Target City *</label><input value={adForm.city} onChange={e=>setAdForm(f=>({...f,city:e.target.value}))} placeholder="e.g. Toronto" /></div>
                  <div><label>Province</label>
                    <select value={adForm.province} onChange={e=>setAdForm(f=>({...f,province:e.target.value}))}>
                      <option value="">Select province…</option>
                      {provinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div><label>Website URL *</label><input value={adForm.website} onChange={e=>setAdForm(f=>({...f,website:e.target.value}))} placeholder="https://yourbusiness.ca" /></div>
                <div><label>Ad Description *</label><textarea value={adForm.description} onChange={e=>setAdForm(f=>({...f,description:e.target.value}))} placeholder="Tell buyers what you offer in 1-2 sentences…" rows={3} style={{ padding:"12px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:14,width:"100%",boxSizing:"border-box",resize:"vertical" }} /></div>
                <div><label>Logo/Image URL <span style={{fontWeight:400,color:"#a8a29e"}}>(optional)</span></label><input value={adForm.logo_url} onChange={e=>setAdForm(f=>({...f,logo_url:e.target.value}))} placeholder="https://yourbusiness.ca/logo.png" /></div>

                {/* Preview */}
                {adForm.business_name && (
                  <div>
                    <label style={{ marginBottom: 8, display: "block" }}>Preview</label>
                    <div style={{ background: "linear-gradient(135deg, #1c1009, #2d1b0e)", borderRadius: 8, overflow: "hidden", border: "2px solid #d97706", maxWidth: 300, position: "relative" }}>
                      <div style={{ position: "absolute", top: 8, right: 8, background: "#d97706", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>SPONSORED</div>
                      {adForm.logo_url && <img src={adForm.logo_url} alt="" style={{ width: "100%", height: 100, objectFit: "cover" }} />}
                      {!adForm.logo_url && <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>📢</div>}
                      <div style={{ padding: "14px 16px" }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "#f5ddb4", marginBottom: 4 }}>{adForm.business_name}</p>
                        <p style={{ fontSize: 12, color: "#a8a29e", marginBottom: 8 }}>{adForm.description || "Your description here"}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#78716c" }}>📍 {adForm.city || "Your City"}</span>
                          <span style={{ background: "#d97706", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Visit →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button disabled={adSubmitting || !adForm.business_name || !adForm.email || !adForm.city || !adForm.website || !adForm.description} onClick={async () => {
                  setAdSubmitting(true);
                  try {
                    const pricing = adPricing.find(p => p.package_type === adForm.package_type);
                    const monthlyP = pricing?.price || (adForm.package_type === "Starter" ? 99 : adForm.package_type === "City" ? 149 : 199);
                    const weeklyP = pricing?.weekly_price || Math.round(monthlyP / 4);
                    const price = adForm.billing_period === "weekly" ? weeklyP : monthlyP;
                    const res = await fetch("https://rcqlohlftafxicmfjkuf.supabase.co/functions/v1/create-ad-checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_KEY}` },
                      body: JSON.stringify({ ...adForm, price, billing_period: adForm.billing_period })
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                    else alert("Something went wrong. Please try again.");
                  } catch(e) { alert("Error. Please try again."); }
                  setAdSubmitting(false);
                }} className="btn-primary" style={{ fontSize: 17, padding: "16px" }}>
                  {adSubmitting ? "Setting up checkout…" : `💳 Continue to Payment — ${adForm.package_type} (${adForm.billing_period === "weekly" ? "Weekly" : "Monthly"})`}
                </button>
                <p style={{ fontSize: 12, color: "#a8a29e", textAlign: "center" }}>🔒 Secure payment via Stripe · Cancel anytime · Ads reviewed within 24hrs</p>
              </div>
            </div>
            </>
          )}
        </main>
      )}

      {/* ===== SEO CITY/PROVINCE PAGE ===== */}
      {view === "seo" && (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>
          <button onClick={() => { setView("browse"); window.history.pushState({}, "", "/"); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, marginBottom: 20, padding: 0, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>← Back to all sales</button>

          {/* SEO Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#2d1b0e", marginBottom: 8 }}>
              🍁 Garage Sales {seoCity ? `in ${seoCity}` : ""}{seoProvince ? `, ${seoProvince}` : ""}
            </h1>
            <p style={{ color: "#78716c", fontSize: 16, marginBottom: 16 }}>
              Find the best garage sales and yard sales {seoCity ? `in ${seoCity}` : ""}{seoProvince ? ` ${seoProvince}` : ""} on Yardhunt.ca — Canada's garage sale marketplace.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(() => {
                const cityList = seoCity
                  ? sales.filter(s => s.city?.toLowerCase() === seoCity.toLowerCase())
                  : seoProvince
                  ? sales.filter(s => s.province?.toUpperCase() === seoProvince.toUpperCase())
                  : sales;
                return (
                  <>
                    <span style={{ background: "#fef3c7", color: "#d97706", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                      🏠 {cityList.length} active sale{cityList.length !== 1 ? "s" : ""}
                    </span>
                    {seoProvince && <span style={{ background: "#f0fdf4", color: "#059669", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>📍 {seoProvince}</span>}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Sale listings */}
          {(() => {
            const cityList = seoCity
              ? sales.filter(s => s.city?.toLowerCase() === seoCity.toLowerCase())
              : seoProvince
              ? sales.filter(s => s.province?.toUpperCase() === seoProvince.toUpperCase())
              : sales;
            return cityList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)" }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🏠</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 8 }}>No active sales right now</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 20 }}>Be the first to post a sale here!</p>
                <button className="btn-primary" onClick={() => { setView("post"); window.history.pushState({}, "", "/"); }}>🍁 Post a Sale Free</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {cityList.map(sale => (
                  <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setPhotoIndex(0); loadReviews(sale.id); loadQuestions(sale.id); trackView(sale.id); setView("browse"); window.history.pushState({}, "", "/"); }} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: sale.is_featured === "premium" ? "2px solid #b91c1c" : sale.is_featured === "basic" ? "2px solid #d97706" : "1px solid #e8d9c4" }}>
                    {sale.photos?.[0] ? <img src={sale.photos[0]} alt={sale.title} style={{ width: "100%", height: 160, objectFit: "cover" }} /> : <div style={{ background: "linear-gradient(135deg, #6b1a1a, #c0392b)", padding: "20px", display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 32 }}>{sale.emoji || "🏠"}</span><p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "white" }}>{sale.title}</p></div>}
                    <div style={{ padding: "14px 18px" }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "#2d1b0e", marginBottom: 6 }}>{sale.title}</p>
                      <p style={{ fontSize: 13, color: "#78716c", marginBottom: 4 }}>📍 {sale.address}, {sale.city}</p>
                      <p style={{ fontSize: 13, color: "#78716c" }}>📅 {new Date(sale.date+"T12:00:00").toLocaleDateString("en-CA", { weekday:"short", month:"short", day:"numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* SEO text block for Google */}
          <div style={{ marginTop: 48, padding: "28px", background: "rgba(253,250,245,0.7)", borderRadius: 12, border: "1px solid #e7e5e4" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#2d1b0e", marginBottom: 12 }}>About Garage Sales {seoCity ? `in ${seoCity}` : `in ${seoProvince}`}</h2>
            <p style={{ fontSize: 14, color: "#78716c", lineHeight: 1.8, marginBottom: 12 }}>
              Yardhunt.ca is Canada's dedicated garage sale and yard sale marketplace. Browse upcoming garage sales {seoCity ? `in ${seoCity}` : `across ${seoProvince}`}, find great deals on furniture, clothes, tools, electronics and more — all in one place.
            </p>
            <p style={{ fontSize: 14, color: "#78716c", lineHeight: 1.8, marginBottom: 16 }}>
              Posting a garage sale {seoCity ? `in ${seoCity}` : ""} is 100% free on Yardhunt.ca. Add photos, set your hours, and reach hundreds of local buyers. Subscribe to get email notifications when new sales are posted near you.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => { setView("post"); window.history.pushState({}, "", "/"); }}>🍁 Post a Free Sale</button>
              <button className="btn-secondary" onClick={() => { setView("browse"); window.history.pushState({}, "", "/"); }}>Browse All Sales</button>
            </div>
          </div>

          {/* Other cities in province */}
          {seoProvince && (
            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 16 }}>Other cities in {seoProvince}</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[...new Set(sales.filter(s => s.province?.toUpperCase() === seoProvince.toUpperCase()).map(s => s.city))].map(city => (
                  <a key={city} href={`/garage-sales/${city.toLowerCase().replace(/ /g, "-")}/${seoProvince.toLowerCase()}`} style={{ padding: "8px 16px", background: "white", border: "1px solid #e7e5e4", borderRadius: 20, fontSize: 13, color: "#292524", textDecoration: "none", fontWeight: 500 }}>
                    {city}
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Categories View */}
      {/* ===== SAVED SALES VIEW ===== */}
      {view === "favourites" && (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>
          <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 20, padding: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: "white", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>❤️ Saved Sales</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 28, fontWeight: 500 }}>Sales you've saved for later</p>
          {favourites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🤍</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 8 }}>No saved sales yet</p>
              <p style={{ color: "#78716c", fontSize: 14, marginBottom: 20 }}>Tap the 🤍 on any sale card to save it here</p>
              <button className="btn-primary" onClick={() => setView("browse")}>Browse Sales</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {sales.filter(s => favourites.includes(s.id)).map(sale => (
                <div key={sale.id} className="card-hover" onClick={() => { setSelectedSale(sale); setPhotoIndex(0); loadReviews(sale.id); trackView(sale.id); setView("browse"); }} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "2px solid #fecdd3" }}>
                  {sale.photos && sale.photos.length > 0 ? (
                    <img src={sale.photos[0]} alt="" style={{ width: "100%", height: 160, objectFit: "cover" }} />
                  ) : (
                    <div style={{ background: "linear-gradient(135deg, #6b1a1a, #c0392b)", padding: "20px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 32 }}>{sale.emoji || "🏠"}</span>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: "white" }}>{sale.title}</p>
                    </div>
                  )}
                  <div style={{ padding: "16px 20px" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "#2d1b0e", marginBottom: 6 }}>{sale.title}</p>
                    <p style={{ fontSize: 13, color: "#7a5c3a", marginBottom: 4 }}>📍 {sale.city}, {sale.province}</p>
                    <p style={{ fontSize: 13, color: "#7a5c3a", marginBottom: 10 }}>📅 {new Date(sale.date+"T12:00:00").toLocaleDateString("en-CA",{month:"short",day:"numeric"})}</p>
                    <button onClick={e => { e.stopPropagation(); setFavourites(f => f.filter(id=>id!==sale.id)); }} style={{ fontSize: 12, color: "#e11d48", background: "#fff1f2", border: "1px solid #fecdd3", padding: "4px 12px", borderRadius: 20, cursor: "pointer" }}>❤️ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ===== SELLER PROFILE MODAL ===== */}
      {sellerProfileId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSellerProfileId(null)}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 40 }}>👤</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#292524" }}>Seller Profile</h3>
              </div>
              <button onClick={() => setSellerProfileId(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#78716c" }}>✕</button>
            </div>
            <div>
              <p style={{ color: "#78716c", fontSize: 14, marginBottom: 16 }}>All sales from this seller:</p>
              {sales.filter(s => s.user_id === sellerProfileId).length === 0 ? (
                <p style={{ color: "#a8a29e", fontSize: 14 }}>No active sales from this seller.</p>
              ) : (
                sales.filter(s => s.user_id === sellerProfileId).map(sale => (
                  <div key={sale.id} onClick={() => { setSelectedSale(sale); setSellerProfileId(null); setPhotoIndex(0); loadReviews(sale.id); }} style={{ padding: "14px", borderRadius: 10, border: "1px solid #e7e5e4", marginBottom: 10, cursor: "pointer", background: "rgba(253,250,245,0.7)" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700, color: "#292524", marginBottom: 4 }}>{sale.title}</p>
                    <p style={{ fontSize: 13, color: "#78716c" }}>📍 {sale.city} · 📅 {new Date(sale.date+"T12:00:00").toLocaleDateString("en-CA",{month:"short",day:"numeric"})}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT LISTING MODAL ===== */}
      {editingSale && editForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setEditingSale(null)}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#292524" }}>✏️ Edit Listing</h3>
              <button onClick={() => setEditingSale(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#78716c" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label>Sale Title *</label><input value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label>Street Address</label><input value={editForm.address} onChange={e=>setEditForm(f=>({...f,address:e.target.value}))} /></div>
                <div><label>City</label><input value={editForm.city} onChange={e=>setEditForm(f=>({...f,city:e.target.value}))} /></div>
              </div>
              {/* Day 1 */}
              <div style={{ background: "rgba(253,250,245,0.7)", borderRadius: 8, padding: "14px", border: "1px solid #e7e5e4" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#78716c", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>📅 Day 1</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div><label style={{fontSize:11}}>Date *</label><input type="date" value={editForm.date} onChange={e=>setEditForm(f=>({...f,date:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                  <div><label style={{fontSize:11}}>Start Time</label><input type="time" value={editForm.startTime} onChange={e=>setEditForm(f=>({...f,startTime:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                  <div><label style={{fontSize:11}}>End Time</label><input type="time" value={editForm.endTime} onChange={e=>setEditForm(f=>({...f,endTime:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                </div>
              </div>
              {/* Day 2 */}
              <div style={{ background: "rgba(253,250,245,0.7)", borderRadius: 8, padding: "14px", border: "1px solid #e7e5e4" }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#78716c", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 10 }}>
                  <input type="checkbox" checked={!!editForm.extraDate} onChange={e => setEditForm(f=>({...f, extraDate: e.target.checked ? f.date : "", extraDateStart: "", extraDateEnd: ""}))} />
                  <span>📅 2-Day Sale — Add Second Day</span>
                </label>
                {editForm.extraDate && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div><label style={{fontSize:11}}>Day 2 Date</label><input type="date" value={editForm.extraDate} onChange={e=>setEditForm(f=>({...f,extraDate:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                    <div><label style={{fontSize:11}}>Start Time</label><input type="time" value={editForm.extraDateStart||""} onChange={e=>setEditForm(f=>({...f,extraDateStart:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                    <div><label style={{fontSize:11}}>End Time</label><input type="time" value={editForm.extraDateEnd||""} onChange={e=>setEditForm(f=>({...f,extraDateEnd:e.target.value}))} style={{fontSize:12,padding:"8px 6px"}} /></div>
                  </div>
                )}
              </div>
              <div><label>Description</label><textarea value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} rows={4} style={{ padding:"12px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:14,width:"100%",boxSizing:"border-box" }} /></div>
              <button disabled={editSubmitting} onClick={async () => {
                setEditSubmitting(true);
                await api.updateSale(editingSale, { title:editForm.title, address:editForm.address, city:editForm.city, province:editForm.province, date:editForm.date, start_time:editForm.startTime, end_time:editForm.endTime, description:editForm.description, tags:editForm.tags, extra_date: editForm.extraDate||null, extra_date_start: editForm.extraDateStart||null, extra_date_end: editForm.extraDateEnd||null }, token);
                await loadSales();
                setEditingSale(null);
                setEditSubmitting(false);
                alert("✅ Listing updated!");
              }} className="btn-primary" style={{ width: "100%" }}>
                {editSubmitting ? "Saving…" : "✅ Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "categories" && (
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px" }}>
          <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 20, padding: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: "white", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>🗂️ Browse by Category</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontStyle: "italic", marginBottom: 28, fontWeight: 500 }}>Find exactly what you're looking for across Canada</p>

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
                        <p style={{ fontSize: 13, color: "#5a4030", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{sale.description || "Come check it out!"}</p>
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
          <button onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 20, padding: 0, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
            ← Back
          </button>

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


      {/* Terms & Privacy View */}
      {view === "terms" && (
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
          <button onClick={goBack} style={{ background: "none", border: "none", color: "#b91c1c", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
          <div style={{ background: "white", borderRadius: 16, padding: "40px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #e7e5e4" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: "#292524", marginBottom: 8 }}>Terms & Privacy</h1>
            <p style={{ color: "#78716c", fontSize: 14, marginBottom: 32 }}>Last updated: June 2026</p>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 12 }}>Terms of Use</h2>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 16 }}>By using Yardhunt.ca you agree to these terms. This platform connects buyers and sellers for garage sales and yard sales across Canada.</p>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 16 }}>Sellers are responsible for the accuracy of their listings. Yardhunt.ca is not responsible for any transactions between buyers and sellers. All sales are final between the parties involved.</p>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 32 }}>You must not post false, misleading or inappropriate content. We reserve the right to remove any listing at any time.</p>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 12 }}>Privacy Policy</h2>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 16 }}>We collect only the information necessary to operate this platform — your email address, sale listing details, and subscription preferences.</p>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 16 }}>We do not sell your personal information to third parties. Your email is used only to send you account-related emails and sale notifications you have subscribed to.</p>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 16 }}>Payments are processed securely by Stripe. We do not store your payment details.</p>
            <p style={{ fontSize: 15, color: "#44403c", lineHeight: 1.8, marginBottom: 32 }}>You can delete your account and data at any time by contacting us.</p>


          </div>
        </main>
      )}


      {/* Admin Panel */}
      {view === "admin" && (
        <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
          {!adminUnlocked ? (
            <div style={{ maxWidth: 400, margin: "60px auto", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 16, padding: "40px 32px", boxShadow: "0 8px 48px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.4)", textAlign: "center" }}>
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
              {/* Admin Tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                {[
                  { id: "overview", label: "📊 Overview" },
                  { id: "analytics", label: "📈 Analytics" },
                  { id: "users", label: "👥 Users" },
                  { id: "listings", label: "🏠 Listings" },
                  { id: "subscribers", label: "🔔 Subscribers" },
                  { id: "broadcast", label: "📧 Broadcast" },
                  { id: "moderation", label: "🚨 Moderation" },
                  { id: "reviews", label: "⭐ Reviews" },
                  { id: "ads", label: "📢 Ads" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setAdminTab(tab.id)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: adminTab === tab.id ? "#1c1009" : "#f5f5f4", color: adminTab === tab.id ? "#f5ddb4" : "#78716c" }}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                <div></div>
              </div>

              {/* ===== OVERVIEW TAB ===== */}
              {adminTab === "overview" && <>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 36 }}>
                {[
                  { label: "Total Users", value: allUsers.length, icon: "👥", color: "#2563eb" },
                  { label: "Total Listings", value: allSales.length, icon: "🏠", color: "#b91c1c" },
                  { label: "Active Today", value: allSales.filter(s => s.date >= new Date().toISOString().split("T")[0]).length, icon: "📅", color: "#d97706" },
                  { label: "Subscribers", value: allSubscribers.length, icon: "🔔", color: "#059669" },
                  { label: "Reviews", value: allReviews.length, icon: "⭐", color: "#7c3aed" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 12, padding: "20px", border: "1px solid #e7e5e4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
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

              {/* Sales by City */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#292524", marginBottom: 14 }}>📍 Sales by City</h3>
                  {Object.entries(allSales.reduce((acc, s) => { acc[s.city] = (acc[s.city] || 0) + 1; return acc; }, {}))
                    .sort((a, b) => b[1] - a[1]).slice(0, 8)
                    .map(([city, count]) => (
                      <div key={city} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f4" }}>
                        <span style={{ fontSize: 13, color: "#292524" }}>{city}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c", background: "#fef2f2", padding: "2px 10px", borderRadius: 20 }}>{count}</span>
                      </div>
                    ))
                  }
                  {allSales.length === 0 && <p style={{ color: "#78716c", fontSize: 13 }}>No data yet</p>}
                </div>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#292524", marginBottom: 14 }}>🗺️ Sales by Province</h3>
                  {Object.entries(allSales.reduce((acc, s) => { acc[s.province] = (acc[s.province] || 0) + 1; return acc; }, {}))
                    .sort((a, b) => b[1] - a[1])
                    .map(([province, count]) => (
                      <div key={province} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f4" }}>
                        <span style={{ fontSize: 13, color: "#292524" }}>{province}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706", background: "#fffbeb", padding: "2px 10px", borderRadius: 20 }}>{count}</span>
                      </div>
                    ))
                  }
                  {allSales.length === 0 && <p style={{ color: "#78716c", fontSize: 13 }}>No data yet</p>}
                </div>
              </div>

              {/* Listing Pricing Controls */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 24, marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 6 }}>💰 Listing Feature Prices</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>Change prices — updates live on the site instantly. Press Enter or click outside to save.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                  {[
                    { key: "basic_featured", label: "⭐ Basic Featured", icon: "⭐" },
                    { key: "premium_featured", label: "🌟 Premium Featured", icon: "🌟" },
                    { key: "extra_photos", label: "📸 Extra Photos", icon: "📸" },
                    { key: "photo_unlock", label: "🔓 Photo Unlock", icon: "🔓" },
                    { key: "verified_badge", label: "✅ Verified Badge", icon: "✅" },
                  ].map(item => (
                    <div key={item.key} style={{ background: "rgba(253,250,245,0.7)", borderRadius: 10, padding: "14px", border: "1px solid #e7e5e4" }}>
                      <p style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#78716c", marginBottom: 8 }}>{item.label}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, color: "#78716c" }}>$</span>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={listingPricing[item.key]}
                          key={listingPricing[item.key]}
                          onBlur={async e => {
                            const newPrice = parseFloat(e.target.value);
                            if (isNaN(newPrice) || newPrice <= 0) return;
                            const updated = { ...listingPricing, [item.key]: newPrice };
                            setListingPricing(updated);
                            await api.updateListingPricing(updated);
                          }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 16, fontWeight: 700 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Purchases */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#292524", marginBottom: 14 }}>💰 Featured Listings</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {[
                    { label: "Basic Featured", icon: "⭐", price: "$9.99", count: allSales.filter(s => s.is_featured === "basic").length, color: "#d97706" },
                    { label: "Premium Featured", icon: "🌟", price: "$14.99", count: allSales.filter(s => s.is_featured === "premium").length, color: "#7c3aed" },
                    { label: "Verified Badge", icon: "✅", price: "$4.99", count: allSales.filter(s => s.is_verified).length, color: "#059669" },
                  ].map(item => (
                    <div key={item.label} style={{ background: "rgba(253,250,245,0.7)", borderRadius: 10, padding: "16px", border: "1px solid #e7e5e4", textAlign: "center" }}>
                      <p style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: item.color, fontFamily: "'Cormorant Garamond', serif" }}>{item.count}</p>
                      <p style={{ fontSize: 12, color: "#78716c", marginBottom: 2 }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "#a8a29e" }}>{item.price} each</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#a8a29e", marginTop: 14 }}>💡 Check Stripe dashboard for exact totals → <a href="https://dashboard.stripe.com" target="_blank" style={{ color: "#d97706" }}>dashboard.stripe.com</a></p>
                <div style={{ marginTop: 16, padding: "16px", background: "linear-gradient(135deg, #1c1009, #3b0f0f)", borderRadius: 10, color: "white" }}>
                  <p style={{ fontSize: 13, color: "#f5ddb4", marginBottom: 8, fontWeight: 600 }}>💰 Estimated Total Revenue</p>
                  {(() => {
                    const basic = allSales.filter(s => s.is_featured === "basic").length * 9.99;
                    const premium = allSales.filter(s => s.is_featured === "premium").length * 14.99;
                    const verified = allSales.filter(s => s.is_verified).length * 4.99;
                    const total = basic + premium + verified;
                    return (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#f5ddb499", marginBottom: 4 }}>
                          <span>Basic Featured ({allSales.filter(s => s.is_featured === "basic").length} × $9.99)</span>
                          <span>${basic.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#f5ddb499", marginBottom: 4 }}>
                          <span>Premium Featured ({allSales.filter(s => s.is_featured === "premium").length} × $14.99)</span>
                          <span>${premium.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#f5ddb499", marginBottom: 8 }}>
                          <span>Verified Badge ({allSales.filter(s => s.is_verified).length} × $4.99)</span>
                          <span>${verified.toFixed(2)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#d97706", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8 }}>
                          <span>Total Estimated</span>
                          <span>${total.toFixed(2)} CAD</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Popular Tags */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#292524", marginBottom: 14 }}>🏷️ Most Popular Categories</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {Object.entries(
                    allSales.flatMap(s => s.tags || []).reduce((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {})
                  ).sort((a, b) => b[1] - a[1]).map(([tag, count]) => (
                    <span key={tag} style={{ background: "rgba(253,250,245,0.7)", border: "1px solid #e7e5e4", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#292524" }}>
                      {tag} <strong style={{ color: "#b91c1c" }}>{count}</strong>
                    </span>
                  ))}
                  {allSales.length === 0 && <p style={{ color: "#78716c", fontSize: 13 }}>No data yet</p>}
                </div>
              </div>

              {/* Business Insights */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#292524", marginBottom: 14 }}>💡 Business Insights</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {[
                    { label: "Avg Sales per User", value: allUsers.length > 0 ? (allSales.length / allUsers.length).toFixed(1) : "0", icon: "📊" },
                    { label: "Subscriber Conversion", value: allUsers.length > 0 ? Math.round((allSubscribers.length / allUsers.length) * 100) + "%" : "0%", icon: "🔄" },
                    { label: "Cities Covered", value: new Set(allSales.map(s => s.city)).size, icon: "🏙️" },
                    { label: "Avg Reviews/Sale", value: allSales.length > 0 ? (allReviews.length / allSales.length).toFixed(1) : "0", icon: "⭐" },
                  ].map(item => (
                    <div key={item.label} style={{ background: "rgba(253,250,245,0.7)", borderRadius: 10, padding: "16px", border: "1px solid #e7e5e4" }}>
                      <p style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</p>
                      <p style={{ fontSize: 24, fontWeight: 700, color: "#292524", fontFamily: "'Cormorant Garamond', serif" }}>{item.value}</p>
                      <p style={{ fontSize: 12, color: "#78716c" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              </>}

              {/* ===== ANALYTICS TAB ===== */}
              {adminTab === "analytics" && <>

              {/* Sales per day chart */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 16 }}>📅 Sales Posted — Last 14 Days</h3>
                {(() => {
                  const days = Array.from({length: 14}, (_, i) => {
                    const d = new Date(); d.setDate(d.getDate() - (13 - i));
                    return d.toISOString().split("T")[0];
                  });
                  const counts = days.map(day => ({ day: day.slice(5), count: allSales.filter(s => s.created_at?.slice(0,10) === day).length }));
                  const max = Math.max(...counts.map(c => c.count), 1);
                  return (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
                      {counts.map(({ day, count }) => (
                        <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 10, color: "#b91c1c", fontWeight: 700 }}>{count > 0 ? count : ""}</span>
                          <div style={{ width: "100%", background: count > 0 ? "#b91c1c" : "#f5f5f4", borderRadius: 4, height: `${Math.max((count / max) * 90, 4)}px`, minHeight: 4 }} />
                          <span style={{ fontSize: 9, color: "#a8a29e", transform: "rotate(-45deg)", transformOrigin: "top", whiteSpace: "nowrap" }}>{day}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Opportunity Gap */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 6 }}>🎯 Opportunity Gap</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 16 }}>Cities with most subscribers but fewest sales — target these for marketing!</p>
                {(() => {
                  const subCities = allSubscribers.reduce((acc, s) => { acc[s.city] = (acc[s.city] || 0) + 1; return acc; }, {});
                  const saleCities = allSales.reduce((acc, s) => { acc[s.city] = (acc[s.city] || 0) + 1; return acc; }, {});
                  const gaps = Object.entries(subCities).map(([city, subs]) => ({ city, subs, sales: saleCities[city] || 0, gap: subs - (saleCities[city] || 0) })).sort((a, b) => b.gap - a.gap).slice(0, 8);
                  return gaps.length > 0 ? (
                    <div>
                      {gaps.map(({ city, subs, sales, gap }) => (
                        <div key={city} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f4" }}>
                          <span style={{ fontSize: 14, color: "#292524", fontWeight: 500 }}>{city}</span>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#059669" }}>🔔 {subs} subs</span>
                            <span style={{ fontSize: 12, color: "#78716c" }}>🏠 {sales} sales</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#b91c1c", background: "#fef2f2", padding: "2px 8px", borderRadius: 20 }}>+{gap} gap</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p style={{ color: "#78716c", fontSize: 13 }}>No data yet</p>;
                })()}
              </div>

              {/* Most Active Sellers */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 16 }}>🏆 Most Active Sellers</h3>
                {(() => {
                  const sellers = allSales.reduce((acc, s) => { const key = s.user_id || "guest"; acc[key] = (acc[key] || { count: 0, name: s.name || "Guest" }); acc[key].count++; return acc; }, {});
                  return Object.entries(sellers).sort((a, b) => b[1].count - a[1].count).slice(0, 10).map(([id, data], i) => (
                    <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f4" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{["🥇","🥈","🥉"][i] || "•"}</span>
                        <span style={{ fontSize: 14, color: "#292524" }}>{data.name}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706", background: "#fffbeb", padding: "2px 10px", borderRadius: 20 }}>{data.count} sale{data.count > 1 ? "s" : ""}</span>
                    </div>
                  ));
                })()}
                {allSales.length === 0 && <p style={{ color: "#78716c", fontSize: 13 }}>No data yet</p>}
              </div>

              {/* Peak Posting Times */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 16 }}>⏰ Peak Posting Days</h3>
                {(() => {
                  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                  const counts = days.map((day, i) => ({ day, count: allSales.filter(s => s.created_at && new Date(s.created_at).getDay() === i).length }));
                  const max = Math.max(...counts.map(c => c.count), 1);
                  return (
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
                      {counts.map(({ day, count }) => (
                        <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 11, color: "#b91c1c", fontWeight: 700 }}>{count > 0 ? count : ""}</span>
                          <div style={{ width: "100%", background: count > 0 ? "#d97706" : "#f5f5f4", borderRadius: 4, height: `${Math.max((count / max) * 80, 4)}px` }} />
                          <span style={{ fontSize: 11, color: "#78716c" }}>{day}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              </>}

              {/* ===== USERS TAB ===== */}
              {adminTab === "users" && <>
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>👥 Registered Users ({allUsers.length})</h3>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", overflow: "hidden" }}>
                  {allUsers.length === 0 ? <p style={{ padding: "20px", color: "#f5ddb4", textAlign: "center" }}>No users yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(253,250,245,0.7)", borderBottom: "1px solid #e7e5e4" }}>
                          {["Email", "Status", "Signed Up", "Last Sign In", "Action"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u, i) => (
                          <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f4", background: i % 2 === 0 ? "white" : "#fdfaf5" }}>
                            <td style={{ padding: "12px 16px", fontSize: 14, color: "#292524", fontWeight: 500 }}>{u.email}</td>
                            <td style={{ padding: "12px 16px", fontSize: 12 }}>
                              <span style={{ background: u.email_confirmed_at ? "#dcfce7" : "#fef9c3", color: u.email_confirmed_at ? "#15803d" : "#a16207", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>
                                {u.email_confirmed_at ? "✅ Confirmed" : "⏳ Pending"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#78716c" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-CA") : "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: 13, color: "#a8a29e" }}>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("en-CA") : "Never"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              </>}

              {/* ===== LISTINGS TAB ===== */}
              {adminTab === "listings" && <>
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>🏠 All Listings ({allSales.length})</h3>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", overflow: "hidden" }}>
                  {allSales.length === 0 ? <p style={{ padding: "20px", color: "#f5ddb4", textAlign: "center" }}>No listings yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(253,250,245,0.7)", borderBottom: "1px solid #e7e5e4" }}>
                          {["Title", "City", "Province", "Date", "Posted", "Actions"].map(h => (
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
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={async () => { await api.markFeatured(s.id, "basic"); loadAdminData(); }} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #d97706", background: "#fffbeb", color: "#d97706", cursor: "pointer" }}>⭐ Basic</button>
                                <button onClick={async () => { await api.markFeatured(s.id, "premium"); loadAdminData(); }} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #7c3aed", background: "#f5f3ff", color: "#7c3aed", cursor: "pointer" }}>🌟 Premium</button>
                                <button onClick={async () => { if(confirm("Delete this listing?")) { await api.deleteSale(s.id); loadAdminData(); } }} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #b91c1c", background: "#fef2f2", color: "#b91c1c", cursor: "pointer" }}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              </>}

              {/* ===== SUBSCRIBERS TAB ===== */}
              {adminTab === "subscribers" && <>
              {/* All Subscribers */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>🔔 Subscribers ({allSubscribers.length})</h3>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", overflow: "hidden" }}>
                  {allSubscribers.length === 0 ? <p style={{ padding: "20px", color: "#f5ddb4", textAlign: "center" }}>No subscribers yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(253,250,245,0.7)", borderBottom: "1px solid #e7e5e4" }}>
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

              </>}

              {/* ===== BROADCAST TAB ===== */}
              {adminTab === "broadcast" && <>
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 28, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 6 }}>📧 Broadcast Email</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>Send an email to all {allSubscribers.length} subscribers at once</p>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#78716c", textTransform: "uppercase", letterSpacing: 0.8 }}>Subject</label>
                <input value={broadcastSubject} onChange={e => setBroadcastSubject(e.target.value)} placeholder="e.g. 🍁 Big sales happening near you this weekend!" style={{ width: "100%", marginTop: 6, marginBottom: 16, boxSizing: "border-box" }} />
                <label style={{ fontSize: 12, fontWeight: 600, color: "#78716c", textTransform: "uppercase", letterSpacing: 0.8 }}>Message</label>
                <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} placeholder="Write your message to subscribers..." rows={6} style={{ width: "100%", marginTop: 6, marginBottom: 20, padding: "12px 14px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
                {broadcastResult && <p style={{ color: broadcastResult.includes("Sent") ? "#15803d" : "#b91c1c", fontSize: 14, marginBottom: 12 }}>{broadcastResult}</p>}
                <button disabled={broadcastSending || !broadcastSubject || !broadcastMessage} onClick={async () => {
                  setBroadcastSending(true); setBroadcastResult("");
                  try {
                    const res = await fetch("https://rcqlohlftafxicmfjkuf.supabase.co/functions/v1/notify-subscribers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_KEY}` },
                      body: JSON.stringify({ broadcast: true, subject: broadcastSubject, message: broadcastMessage, subscribers: allSubscribers })
                    });
                    const data = await res.json();
                    setBroadcastResult(`✅ Sent to ${data.sent || 0} subscribers!`);
                  } catch(e) { setBroadcastResult("❌ Failed to send. Try again."); }
                  setBroadcastSending(false);
                }} className="btn-primary" style={{ minWidth: 180 }}>
                  {broadcastSending ? "Sending…" : `📧 Send to All ${allSubscribers.length} Subscribers`}
                </button>
              </div>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 18px" }}>
                <p style={{ fontSize: 13, color: "#92400e" }}>⚠️ This will send a real email to every subscriber. Double-check your message before sending!</p>
              </div>
              </>}

              {/* ===== MODERATION TAB ===== */}
              {adminTab === "moderation" && <>
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 6 }}>🚨 Flag a Listing</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 16 }}>Mark listings as inappropriate for review</p>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(253,250,245,0.7)", borderBottom: "1px solid #e7e5e4" }}>
                        {["Title", "City", "Date", "Status", "Action"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#78716c", letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allSales.map((s, i) => (
                        <tr key={s.id} style={{ borderBottom: "1px solid #f5f5f4", background: flaggedSales.includes(s.id) ? "#fff7f7" : i % 2 === 0 ? "white" : "#fdfaf5" }}>
                          <td style={{ padding: "12px 16px", fontSize: 14, color: "#292524", fontWeight: 500 }}>{s.title}</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: "#78716c" }}>{s.city}</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, color: "#78716c" }}>{s.date}</td>
                          <td style={{ padding: "12px 16px" }}>
                            {flaggedSales.includes(s.id) ? (
                              <span style={{ fontSize: 12, background: "#fef2f2", color: "#b91c1c", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>🚩 Flagged</span>
                            ) : (
                              <span style={{ fontSize: 12, background: "#f0fdf4", color: "#15803d", padding: "2px 8px", borderRadius: 20 }}>✅ Clean</span>
                            )}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              {flaggedSales.includes(s.id) ? (
                                <>
                                  <button onClick={() => setFlaggedSales(f => f.filter(id => id !== s.id))} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #059669", background: "#f0fdf4", color: "#059669", cursor: "pointer" }}>✅ Clear</button>
                                  <button onClick={async () => { if(confirm("Delete this listing permanently?")) { await api.deleteSale(s.id); setFlaggedSales(f => f.filter(id => id !== s.id)); loadAdminData(); }}} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #b91c1c", background: "#fef2f2", color: "#b91c1c", cursor: "pointer" }}>🗑️ Delete</button>
                                </>
                              ) : (
                                <button onClick={() => setFlaggedSales(f => [...f, s.id])} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #f59e0b", background: "#fffbeb", color: "#d97706", cursor: "pointer" }}>🚩 Flag</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {allSales.length === 0 && <p style={{ padding: "20px", color: "#f5ddb4", textAlign: "center" }}>No listings yet</p>}
                </div>
              </div>

              {/* Banned Users Summary */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 20, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#292524", marginBottom: 16 }}>🚫 Banned Users ({bannedUsers.length})</h3>
                {bannedUsers.length === 0 ? (
                  <p style={{ color: "#78716c", fontSize: 13 }}>No banned users</p>
                ) : (
                  <div>
                    {allUsers.filter(u => bannedUsers.includes(u.id)).map(u => (
                      <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f4" }}>
                        <span style={{ fontSize: 14, color: "#292524" }}>{u.email}</span>
                        <button onClick={() => setBannedUsers(b => b.filter(id => id !== u.id))} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #059669", background: "#f0fdf4", color: "#059669", cursor: "pointer" }}>✅ Unban</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>}

              {/* ===== REVIEWS TAB ===== */}
              {adminTab === "reviews" && <>
              {/* All Reviews */}
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 16 }}>⭐ Reviews ({allReviews.length})</h3>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", overflow: "hidden" }}>
                  {allReviews.length === 0 ? <p style={{ padding: "20px", color: "#f5ddb4", textAlign: "center" }}>No reviews yet</p> : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(253,250,245,0.7)", borderBottom: "1px solid #e7e5e4" }}>
                          {["Rating", "Comment", "By", "Date", "Action"].map(h => (
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
                            <td style={{ padding: "12px 16px" }}>
                              <button onClick={async () => { if(confirm("Delete this review?")) { await api.deleteReview(r.id); loadAdminData(); } }} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #b91c1c", background: "#fef2f2", color: "#b91c1c", cursor: "pointer" }}>🗑️ Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              </>}

              {/* ===== ADS TAB ===== */}
              {adminTab === "ads" && <>

              {/* Pricing Settings */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 6 }}>💰 Ad Pricing</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>Set your prices — updates live on the advertise page instantly</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {[
                    { type: "Starter", icon: "⭐", default: 99, defaultWeekly: 29 },
                    { type: "City", icon: "🌟", default: 149, defaultWeekly: 44 },
                    { type: "Premium", icon: "💎", default: 199, defaultWeekly: 59 },
                  ].map(pkg => {
                    const pricing = adPricing.find(p => p.package_type === pkg.type);
                    return (
                      <div key={pkg.type} style={{ background: "rgba(253,250,245,0.7)", borderRadius: 10, padding: 16, border: "1px solid #e7e5e4" }}>
                        <p style={{ fontSize: 20, marginBottom: 4 }}>{pkg.icon}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#292524", marginBottom: 12 }}>{pkg.type}</p>
                        <label style={{ fontSize: 11, color: "#78716c", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Monthly Price</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: 4 }}>
                          <span style={{ fontSize: 14, color: "#78716c" }}>$</span>
                          <input type="number" defaultValue={pricing?.price || pkg.default} onBlur={async e => {
                            const newPrice = parseFloat(e.target.value);
                            if (pricing?.id) {
                              await api.updateAdPricing(pricing.id, newPrice);
                            } else {
                              await fetch(`${SUPABASE_URL}/rest/v1/ad_pricing`, {
                                method: "POST",
                                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
                                body: JSON.stringify({ package_type: pkg.type, price: newPrice, weekly_price: pkg.defaultWeekly })
                              });
                            }
                            loadAdPricing();
                          }} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 15, fontWeight: 700 }} />
                          <span style={{ fontSize: 12, color: "#78716c" }}>/mo</span>
                        </div>
                        <label style={{ fontSize: 11, color: "#78716c", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Weekly Price</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: 14, color: "#78716c" }}>$</span>
                          <input type="number" defaultValue={pricing?.weekly_price || pkg.defaultWeekly} onBlur={async e => {
                            const newWeekly = parseFloat(e.target.value);
                            if (pricing?.id) {
                              await fetch(`${SUPABASE_URL}/rest/v1/ad_pricing?id=eq.${pricing.id}`, {
                                method: "PATCH",
                                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
                                body: JSON.stringify({ weekly_price: newWeekly })
                              });
                            } else {
                              await fetch(`${SUPABASE_URL}/rest/v1/ad_pricing`, {
                                method: "POST",
                                headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
                                body: JSON.stringify({ package_type: pkg.type, price: pkg.default, weekly_price: newWeekly })
                              });
                            }
                            loadAdPricing();
                          }} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 15, fontWeight: 700 }} />
                          <span style={{ fontSize: 12, color: "#78716c" }}>/wk</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Ads */}
              <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.35)", padding: 24 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#292524", marginBottom: 6 }}>📢 All Ads ({allAds.length})</h3>
                <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>Approve pending ads, manage active ones</p>
                {allAds.length === 0 ? (
                  <p style={{ color: "#78716c", fontSize: 14, textAlign: "center", padding: "20px" }}>No ads yet — share yardhunt.ca/advertise with local businesses!</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {allAds.map(ad => (
                      <div key={ad.id} style={{ borderRadius: 10, padding: "16px 20px", border: ad.status === "active" ? "1px solid #bbf7d0" : ad.status === "pending_payment" ? "1px solid #fde68a" : "2px solid #fca5a5", background: ad.status === "active" ? "#f0fdf4" : ad.status === "pending_payment" ? "#fffbeb" : "white" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                              <p style={{ fontSize: 16, fontWeight: 700, color: "#292524" }}>{ad.business_name}</p>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: ad.status === "active" ? "#dcfce7" : ad.status === "pending_payment" ? "#fef9c3" : "#fef2f2", color: ad.status === "active" ? "#15803d" : ad.status === "pending_payment" ? "#a16207" : "#b91c1c" }}>
                                {ad.status === "active" ? "✅ Active" : ad.status === "pending_payment" ? "⏳ Pending Payment" : "🔍 Pending Review"}
                              </span>
                            </div>
                            <p style={{ fontSize: 13, color: "#78716c", marginBottom: 2 }}>📍 {ad.city}, {ad.province} · {ad.package_type} · ${ad.price}/mo</p>
                            <p style={{ fontSize: 13, color: "#78716c", marginBottom: 2 }}>📧 {ad.email}</p>
                            <p style={{ fontSize: 13, color: "#78716c" }}>🌐 <a href={ad.website} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>{ad.website}</a></p>
                            {ad.description && <p style={{ fontSize: 13, color: "#292524", marginTop: 6, fontStyle: "italic" }}>"{ad.description}"</p>}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                            {ad.status !== "active" && (
                              <button onClick={async () => { await api.updateAdStatus(ad.id, "active"); loadAdminData(); loadAds(); }} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "none", background: "#059669", color: "white", cursor: "pointer", fontWeight: 700 }}>✅ Approve</button>
                            )}
                            {ad.status === "active" && (
                              <button onClick={async () => { await api.updateAdStatus(ad.id, "paused"); loadAdminData(); loadAds(); }} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1px solid #d97706", background: "#fffbeb", color: "#d97706", cursor: "pointer", fontWeight: 700 }}>⏸ Pause</button>
                            )}
                            <button onClick={async () => { if(confirm("Delete this ad?")) { await api.deleteAd(ad.id); loadAdminData(); loadAds(); }}} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1px solid #b91c1c", background: "#fef2f2", color: "#b91c1c", cursor: "pointer" }}>🗑️ Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>}

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
          <p style={{ color: "#44403c", fontSize: 12 }}>© 2026 Yardhunt.ca · All rights reserved · <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setView("terms")}>Terms & Privacy</span></p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            {[["Ontario","on"],["Alberta","ab"],["British Columbia","british-columbia"],["Quebec","quebec"]].map(([name, slug]) => (
              <a key={slug} href={`/garage-sales/${slug}`} style={{ color: "#44403c", fontSize: 11, textDecoration: "underline" }}>Garage Sales in {name}</a>
            ))}
            {[...new Set(sales.slice(0,4).map(s=>s.city).filter(Boolean))].map(city => (
              <a key={city} href={`/garage-sales/${city.toLowerCase().replace(/ /g,"-")}`} style={{ color: "#44403c", fontSize: 11, textDecoration: "underline" }}>Garage Sales in {city}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            {[["Ontario","ON"],["Alberta","AB"],["British Columbia","BC"],["Quebec","QC"]].map(([name, code]) => (
              <a key={code} href={`/garage-sales/${name.toLowerCase().replace(/ /g,"-")}`} style={{ color: "#44403c", fontSize: 11, textDecoration: "underline" }}>Garage Sales in {name}</a>
            ))}
            {[...new Set(sales.slice(0,6).map(s=>s.city).filter(Boolean))].map(city => (
              <a key={city} href={`/garage-sales/${city.toLowerCase().replace(/ /g,"-")}`} style={{ color: "#44403c", fontSize: 11, textDecoration: "underline" }}>Garage Sales in {city}</a>
            ))}
          </div>
          <p style={{ color: "#44403c", fontSize: 12, fontStyle: "italic" }}>Connecting Canadians, one great deal at a time 🍁</p>
        </div>
      </footer>
      {/* ===== BOTTOM NAV BAR (mobile) ===== */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: darkMode ? "#1c1009" : "white", borderTop: "1px solid #e7e5e4", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 calc(8px + env(safe-area-inset-bottom))", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
        {[
          { icon: "🏠", label: "Browse", v: "browse", action: () => { setView("browse"); setSelectedSale(null); } },
          { icon: "❤️", label: "Saved", v: "favourites", action: () => setView("favourites") },
          { icon: "➕", label: "Post", v: "post", action: () => user ? setView("post") : (setView("auth"), setAuthMode("signup")) },
          { icon: "📋", label: "My Sales", v: "dashboard", action: () => user ? setView("dashboard") : (setView("auth"), setAuthMode("login")) },
          { icon: "🗺️", label: "Map", v: "map", action: () => setView("map") },
        ].map(item => (
          <button key={item.v} onClick={item.action} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 12px", borderRadius: 10, transition: "all 0.15s" }}>
            <span style={{ fontSize: 22, filter: (view === item.v || (item.v === "browse" && view === "browse" && selectedSale)) ? "none" : "grayscale(40%)", opacity: view === item.v ? 1 : 0.6 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: view === item.v ? "#b91c1c" : darkMode ? "#78716c" : "#a8a29e", letterSpacing: 0.3 }}>{item.label}</span>
            {view === item.v && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#b91c1c", marginTop: 1 }} />}
          </button>
        ))}
      </div>

      {/* ===== SELLER ANALYTICS MODAL ===== */}
      {view === "dashboard" && user && saleAnalytics && Object.keys(saleAnalytics).length > 0 && (
        <></>
      )}
      </div>
    </div>
  );
}
