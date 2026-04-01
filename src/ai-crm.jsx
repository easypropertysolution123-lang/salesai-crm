import { useState, useEffect, useRef } from "react";

// ── Fonts ──────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

// ── Styles ─────────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080b10; }
  :root {
    --bg: #080b10;
    --surface: #0e1218;
    --surface2: #141a22;
    --border: #1e2a38;
    --accent: #f5a623;
    --accent2: #e8520a;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --text: #e8edf3;
    --muted: #5a6a7e;
    --font: 'Syne', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  .crm-root {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
  }
  /* Sidebar */
  .sidebar {
    width: 220px;
    min-height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    gap: 4px;
    flex-shrink: 0;
  }
  .logo {
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
    letter-spacing: -0.5px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo span { color: var(--text); }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--muted);
    transition: all 0.15s;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(245,166,35,0.12); color: var(--accent); border-color: rgba(245,166,35,0.2); }
  .nav-item .icon { font-size: 16px; }
  /* Main */
  .main { flex: 1; overflow: auto; }
  .topbar {
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .topbar h1 { font-size: 20px; font-weight: 800; }
  .topbar .badge {
    background: rgba(245,166,35,0.15);
    color: var(--accent);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    font-family: var(--mono);
  }
  .content { padding: 24px 28px; }
  /* Cards */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-card.c1::before { background: var(--accent); }
  .stat-card.c2::before { background: var(--green); }
  .stat-card.c3::before { background: var(--blue); }
  .stat-card.c4::before { background: var(--red); }
  .stat-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .stat-value { font-size: 32px; font-weight: 800; line-height: 1; }
  .stat-sub { font-size: 12px; color: var(--muted); margin-top: 6px; font-family: var(--mono); }
  /* Table */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .card-title { font-size: 14px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid var(--border);
  }
  td {
    padding: 14px 16px;
    font-size: 13.5px;
    border-bottom: 1px solid rgba(30,42,56,0.5);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    font-family: var(--mono);
  }
  .status-new { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .status-contacted { background: rgba(245,166,35,0.15); color: var(--accent); }
  .status-qualified { background: rgba(34,197,94,0.15); color: var(--green); }
  .status-lost { background: rgba(239,68,68,0.15); color: var(--red); }
  .status-closed { background: rgba(168,85,247,0.15); color: #c084fc; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  /* Buttons */
  .btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font);
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #f0b84a; }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .btn-green { background: rgba(34,197,94,0.15); color: var(--green); border: 1px solid rgba(34,197,94,0.3); }
  .btn-sm { padding: 5px 10px; font-size: 12px; border-radius: 6px; }
  /* Voice Agent Panel */
  .voice-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .voice-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .voice-orb {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #f5a623, #e8520a);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 24px rgba(245,166,35,0.4);
    flex-shrink: 0;
    position: relative;
  }
  .voice-orb.listening::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    animation: pulse-ring 1.2s ease-out infinite;
  }
  @keyframes pulse-ring {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.5); }
  }
  .voice-info { flex: 1; }
  .voice-name { font-weight: 800; font-size: 15px; }
  .voice-status { font-size: 12px; color: var(--muted); font-family: var(--mono); margin-top: 2px; }
  .voice-status.active { color: var(--green); }
  .voice-body { padding: 20px; }
  .chat-messages {
    height: 280px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
    padding-right: 4px;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .msg {
    display: flex;
    gap: 10px;
    animation: fadeUp 0.3s ease;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .msg.user { flex-direction: row-reverse; }
  .msg-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
  .msg-avatar.ai { background: rgba(245,166,35,0.2); border: 1px solid rgba(245,166,35,0.3); }
  .msg-avatar.human { background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.3); }
  .msg-bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13.5px;
    line-height: 1.5;
  }
  .msg.ai .msg-bubble { background: var(--surface2); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .msg.user .msg-bubble { background: rgba(245,166,35,0.15); border: 1px solid rgba(245,166,35,0.25); border-top-right-radius: 4px; }
  .msg-time { font-size: 10px; color: var(--muted); margin-top: 4px; font-family: var(--mono); }
  .msg.user .msg-time { text-align: right; }
  .typing-dots { display: flex; gap: 4px; padding: 4px 0; }
  .typing-dots span {
    width: 6px; height: 6px;
    background: var(--muted);
    border-radius: 50%;
    animation: bounce 1.2s ease-in-out infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }
  .voice-input {
    display: flex;
    gap: 8px;
  }
  .voice-input input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 13.5px;
    font-family: var(--font);
    outline: none;
    transition: border-color 0.15s;
  }
  .voice-input input:focus { border-color: var(--accent); }
  .mic-btn {
    width: 42px; height: 42px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .mic-btn:hover { border-color: var(--accent); }
  .mic-btn.recording { background: rgba(239,68,68,0.15); border-color: var(--red); animation: pulse-btn 1s ease infinite; }
  @keyframes pulse-btn {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
  }
  /* Pipeline */
  .pipeline-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
  .pipeline-col {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
  }
  .pipeline-col-header {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--muted);
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pipeline-count {
    background: var(--surface2);
    border-radius: 10px;
    padding: 2px 7px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text);
  }
  .pipeline-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pipeline-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .pipeline-card-name { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .pipeline-card-val { font-size: 12px; color: var(--green); font-family: var(--mono); }
  .pipeline-card-src { font-size: 11px; color: var(--muted); margin-top: 6px; }
  /* Call log */
  .call-entry {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(30,42,56,0.5);
  }
  .call-entry:last-child { border-bottom: none; }
  .call-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .call-icon.out { background: rgba(34,197,94,0.15); }
  .call-icon.in { background: rgba(59,130,246,0.15); }
  .call-icon.missed { background: rgba(239,68,68,0.15); }
  .call-info { flex: 1; }
  .call-name { font-size: 13.5px; font-weight: 700; }
  .call-detail { font-size: 12px; color: var(--muted); font-family: var(--mono); margin-top: 2px; }
  .call-dur { font-size: 13px; font-family: var(--mono); color: var(--muted); }
  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 28px;
    width: 480px;
    max-width: 95vw;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .modal h2 { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: block; }
  .form-input, .form-select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 13.5px;
    font-family: var(--font);
    outline: none;
    transition: border-color 0.15s;
  }
  .form-input:focus, .form-select:focus { border-color: var(--accent); }
  .form-select option { background: var(--surface); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
  /* Score Bar */
  .score-bar { height: 4px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
  /* Notification Toast */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--surface);
    border: 1px solid var(--accent);
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--accent);
    z-index: 200;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 300px;
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .search-input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 14px;
    color: var(--text);
    font-size: 13px;
    font-family: var(--font);
    outline: none;
    transition: border-color 0.15s;
    width: 220px;
  }
  .search-input:focus { border-color: var(--accent); }
  .avatar-circle {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .wave-bars { display: flex; align-items: center; gap: 2px; height: 20px; }
  .wave-bar {
    width: 3px;
    background: var(--accent);
    border-radius: 2px;
    animation: wave 1s ease-in-out infinite;
  }
  .wave-bar:nth-child(1) { animation-delay: 0s; height: 6px; }
  .wave-bar:nth-child(2) { animation-delay: 0.1s; height: 12px; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; height: 18px; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; height: 12px; }
  .wave-bar:nth-child(5) { animation-delay: 0.4s; height: 6px; }
  @keyframes wave {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1); }
  }
`;
document.head.appendChild(style);

// ── Data ───────────────────────────────────────────────────────────────────
const COLORS = ["#f5a623","#3b82f6","#22c55e","#ef4444","#a855f7","#06b6d4","#ec4899"];
const avatarColor = (name) => COLORS[name.charCodeAt(0) % COLORS.length];

const INITIAL_LEADS = [
  { id:1, name:"Rahul Sharma", company:"TechVentures Pvt Ltd", phone:"+91 98765 43210", email:"rahul@techventures.in", value:450000, status:"qualified", source:"AI Call", score:82, assigned:"Priya K", lastContact:"Aaj, 10:30 AM", notes:"Product demo scheduled" },
  { id:2, name:"Anita Patel", company:"FinEdge Solutions", phone:"+91 87654 32109", email:"anita@finedge.com", value:280000, status:"contacted", source:"Website", score:65, assigned:"Amit S", lastContact:"Kal, 3:15 PM", notes:"Budget approval pending" },
  { id:3, name:"Vikram Singh", company:"RetailMax India", phone:"+91 76543 21098", email:"vikram@retailmax.in", value:750000, status:"new", source:"Referral", score:91, assigned:"Priya K", lastContact:"2 din pehle", notes:"High priority lead" },
  { id:4, name:"Sunita Joshi", company:"EduTech Hub", phone:"+91 65432 10987", email:"sunita@edutech.io", value:120000, status:"closed", source:"AI Call", score:95, assigned:"Ravi M", lastContact:"3 din pehle", notes:"Contract signed ✓" },
  { id:5, name:"Deepak Verma", company:"HealthCare Plus", phone:"+91 54321 09876", email:"deepak@hcplus.com", value:380000, status:"lost", source:"Cold Call", score:30, assigned:"Amit S", lastContact:"1 hafta pehle", notes:"Went to competitor" },
  { id:6, name:"Meera Nair", company:"GreenBuild Corp", phone:"+91 43210 98765", email:"meera@greenbuild.in", value:920000, status:"qualified", source:"AI Call", score:78, assigned:"Ravi M", lastContact:"Aaj, 9:00 AM", notes:"Negotiation in progress" },
];

const INITIAL_CALLS = [
  { id:1, lead:"Rahul Sharma", type:"out", time:"Aaj 10:28 AM", duration:"8:42", outcome:"Interested - demo booked", ai:true },
  { id:2, lead:"Meera Nair", type:"out", time:"Aaj 9:00 AM", duration:"12:15", outcome:"Pricing discussed", ai:true },
  { id:3, lead:"Sunita Joshi", type:"in", time:"Kal 3:10 PM", duration:"5:30", outcome:"Contract confirmed", ai:false },
  { id:4, lead:"Anita Patel", type:"out", time:"Kal 3:12 PM", duration:"4:18", outcome:"Follow-up next week", ai:true },
  { id:5, lead:"New Prospect", type:"missed", time:"Kal 11:00 AM", duration:"—", outcome:"Missed call", ai:false },
];

const AI_SYSTEM = `Tum ek professional sales AI voice agent ho jiska naam "ARIA" hai. Tum ek CRM system ke through leads se baat karte ho.

Tumhara kaam hai:
- Leads ke saath friendly aur professional tarike se baat karna
- Unki zaroorat samajhna aur CRM mein log karna
- Meetings aur demos schedule karna  
- Objections handle karna
- Lead qualify karna (budget, authority, need, timeline - BANT)

Tum Hindi aur English dono mein baat kar sakte ho.
Jab lead ki information milti hai, toh CRM_UPDATE: ke saath structured data dena:
CRM_UPDATE: {"status": "qualified/contacted/new", "score": 0-100, "notes": "brief note"}

Responses short rakho (2-3 sentences max). Natural aur conversational raho.`;

// ── Components ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, className }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { new:"status-new", contacted:"status-contacted", qualified:"status-qualified", lost:"status-lost", closed:"status-closed" };
  const labels = { new:"🔵 New", contacted:"🟡 Contacted", qualified:"🟢 Qualified", lost:"🔴 Lost", closed:"🟣 Closed" };
  return <span className={`status-badge ${map[status]}`}><span className="dot"/>{labels[status]?.split(" ")[1]}</span>;
}

function AvatarCircle({ name }) {
  return (
    <div className="avatar-circle" style={{ background: avatarColor(name) + "33", border: `1px solid ${avatarColor(name)}66`, color: avatarColor(name) }}>
      {name.split(" ").map(w=>w[0]).join("").slice(0,2)}
    </div>
  );
}

// ── Add Lead Modal ─────────────────────────────────────────────────────────
function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name:"", company:"", phone:"", email:"", value:"", status:"new", source:"Manual", assigned:"Priya K", notes:"" });
  const set = (k,v) => setForm(p => ({...p, [k]:v}));
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>➕ Naya Lead Add Karo</h2>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Naam *</label><input className="form-input" placeholder="Lead ka naam" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Requirement</label><input className="form-input" placeholder="Client ki zaroorat likhein..." value={form.notes} onChange={e=>set("notes",e.target.value)}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" placeholder="email@example.com" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Deal Value (₹)</label><input className="form-input" type="number" placeholder="500000" value={form.value} onChange={e=>set("value",e.target.value)}/></div>
          <div className="form-group"><label className="form-label">Source</label>
            <select className="form-select" value={form.source} onChange={e=>set("source",e.target.value)}>
              {["Manual","AI Call","Website","Referral","Cold Call","Social Media"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e=>set("status",e.target.value)}>
              {["new","contacted","qualified","closed","lost"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Assigned To</label>
            <select className="form-select" value={form.assigned} onChange={e=>set("assigned",e.target.value)}>
              {["Priya K","Amit S","Ravi M","ARIA (AI)"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Raho Jaane Do</button>
          <button className="btn btn-primary" onClick={() => { if(form.name && form.phone) { onAdd({...form, id: Date.now(), value: Number(form.value)||0, score:50, lastContact:"Abhi", notes:"Naya lead"}); onClose(); }}}>Lead Save Karo ✓</button>
        </div>
      </div>
    </div>
  );
}

// ── AI Voice Agent ─────────────────────────────────────────────────────────
function VoiceAgent({ leads, onUpdateLead, onAddCall, onToast }) {
  const [msgs, setMsgs] = useState([
    { role:"ai", text:"Namaste! Main ARIA hoon, aapka AI Sales Agent. 🎙️ Kisi bhi lead ke baare mein baat karo, unhe call karo, ya mujhse advice lo. Main CRM automatically update karunga!", time:now() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  function now() { return new Date().toLocaleTimeString("hi-IN",{hour:"2-digit",minute:"2-digit"}); }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const addMsg = (role, text) => setMsgs(p => [...p, { role, text, time:now() }]);

  const callAI = async (userMsg) => {
    setLoading(true);
    const history = msgs.slice(-8).map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
    let context = "";
    if (selectedLead) {
      const l = leads.find(x=>x.id===selectedLead);
      if(l) context = `\n\nABHI SELECTED LEAD: ${l.name} (${l.company}) | Status: ${l.status} | Score: ${l.score} | Value: ₹${l.value.toLocaleString()} | Notes: ${l.notes}`;
    }
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:400,
          system: AI_SYSTEM + context,
          messages:[...history, { role:"user", content:userMsg }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Kuch galat hua, dobara try karo.";
      
      // Parse CRM update
      const match = reply.match(/CRM_UPDATE:\s*(\{[^}]+\})/);
      if (match && selectedLead) {
        try {
          const upd = JSON.parse(match[1]);
          onUpdateLead(selectedLead, upd);
          onToast("✅ CRM Update Ho Gaya!");
          onAddCall({ id:Date.now(), lead: leads.find(x=>x.id===selectedLead)?.name||"Unknown", type:"out", time:`Abhi ${now()}`, duration:"AI Call", outcome:upd.notes||"AI se baat hui", ai:true });
        } catch(e) {}
      }
      
      const cleanReply = reply.replace(/CRM_UPDATE:\s*\{[^}]+\}/g,"").trim();
      addMsg("ai", cleanReply);
    } catch(e) {
      addMsg("ai","API se connect nahi ho pa raha. Internet check karo. Lekin main offline bhi help kar sakta hoon!");
    }
    setLoading(false);
  };

  const send = async () => {
    if(!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    addMsg("user", msg);
    await callAI(msg);
  };

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onToast("❌ Browser voice support nahi hai. Text type karo.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = e => { setInput(e.results[0][0].transcript); setRecording(false); };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text.slice(0,200));
      utt.lang = "hi-IN";
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    }
  };

  const lastAI = msgs.filter(m=>m.role==="ai").slice(-1)[0];

  return (
    <div className="voice-panel">
      <div className="voice-header">
        <div className={`voice-orb ${recording||loading?"listening":""}`}>🎙️</div>
        <div className="voice-info">
          <div className="voice-name">ARIA — AI Voice Sales Agent</div>
          <div className={`voice-status ${loading?"active":""}`}>
            {loading ? "● Soch raha hoon..." : recording ? "🔴 Sun raha hoon..." : "● Ready"}
          </div>
        </div>
        {loading && <div className="wave-bars">{[1,2,3,4,5].map(i=><div key={i} className="wave-bar"/>)}</div>}
        <div style={{marginLeft:"auto", display:"flex", gap:8, alignItems:"center"}}>
          <select className="form-select" style={{width:180, padding:"6px 10px", fontSize:12}} value={selectedLead||""} onChange={e=>setSelectedLead(Number(e.target.value)||null)}>
            <option value="">— Lead Select Karo —</option>
            {leads.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          {lastAI && <button className="btn btn-ghost btn-sm" onClick={()=>speak(lastAI.text)}>🔊</button>}
        </div>
      </div>
      <div className="voice-body">
        <div className="chat-messages">
          {msgs.map((m,i) => (
            <div key={i} className={`msg ${m.role==="ai"?"ai":"user"}`}>
              <div className={`msg-avatar ${m.role==="ai"?"ai":"human"}`}>{m.role==="ai"?"🤖":"👤"}</div>
              <div>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <div className="msg-avatar ai">🤖</div>
              <div className="msg-bubble"><div className="typing-dots"><span/><span/><span/></div></div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div className="voice-input">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={selectedLead ? `${leads.find(x=>x.id===selectedLead)?.name} ke baare mein baat karo...` : "Kuch bhi poochho ya kaho..."} />
          <button className={`mic-btn ${recording?"recording":""}`} onClick={recording?(()=>{recognitionRef.current?.stop();setRecording(false)}):startRecording} title="Voice input">🎤</button>
          <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>Bhejo ↗</button>
        </div>
      </div>
    </div>
  );
}

// ── Main CRM App ───────────────────────────────────────────────────────────
export default function CRM() {
  const [tab, setTab] = useState("dashboard");
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [calls, setCalls] = useState(INITIAL_CALLS);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  const updateLead = (id, upd) => setLeads(p => p.map(l => l.id===id ? {...l,...upd} : l));
  const addLead = (lead) => { setLeads(p=>[...p, lead]); showToast("✅ Lead add ho gaya!"); };
  const addCall = (call) => setCalls(p=>[call,...p]);
  const deleteLead = (id) => { setLeads(p=>p.filter(l=>l.id!==id)); showToast("🗑️ Lead delete hua"); };

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = leads.filter(l=>l.status!=="lost").reduce((a,l)=>a+l.value,0);
  const qualified = leads.filter(l=>l.status==="qualified").length;
  const closed = leads.filter(l=>l.status==="closed").length;
  const aiCalls = calls.filter(c=>c.ai).length;

  const pipelineStages = ["new","contacted","qualified","closed","lost"];

  const navItems = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"leads", icon:"👥", label:"Leads" },
    { id:"voice", icon:"🎙️", label:"AI Voice Agent" },
    { id:"pipeline", icon:"🔀", label:"Pipeline" },
    { id:"calls", icon:"📞", label:"Call Logs" },
  ];

  return (
    <div className="crm-root">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">⚡<span>Eazy Sales</span> CRM</div>
        {navItems.map(n => (
          <div key={n.id} className={`nav-item ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
            <span className="icon">{n.icon}</span>{n.label}
          </div>
        ))}
        <div style={{marginTop:"auto", padding:"12px", background:"rgba(245,166,35,0.08)", borderRadius:8, border:"1px solid rgba(245,166,35,0.2)"}}>
          <div style={{fontSize:11, fontWeight:700, color:"var(--accent)", marginBottom:4}}>AI AGENT STATUS</div>
          <div style={{fontSize:12, color:"var(--muted)", fontFamily:"var(--mono)"}}>● ARIA Online</div>
          <div style={{fontSize:11, color:"var(--muted)", marginTop:4}}>{aiCalls} AI calls today</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        {/* Dashboard */}
        {tab==="dashboard" && (
          <>
            <div className="topbar">
              <h1>Dashboard 📊</h1>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span className="badge">LIVE</span>
                <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Lead</button>
              </div>
            </div>
            <div className="content">
              <div className="stats-grid">
                <StatCard className="c1" label="Total Pipeline" value={`₹${(totalValue/100000).toFixed(1)}L`} sub={`${leads.filter(l=>l.status!=="lost").length} active leads`}/>
                <StatCard className="c2" label="Qualified Leads" value={qualified} sub="Ready to convert"/>
                <StatCard className="c3" label="AI Calls Done" value={aiCalls} sub="ARIA ne kiye"/>
                <StatCard className="c4" label="Deals Closed" value={closed} sub={`₹${(leads.filter(l=>l.status==="closed").reduce((a,l)=>a+l.value,0)/100000).toFixed(1)}L value`}/>
              </div>

              {/* Recent Leads */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">🔥 Hot Leads</div>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab("leads")}>Sab Dekho →</button>
                </div>
                <table>
                  <thead><tr><th>Lead</th><th>Value</th><th>Status</th><th>Score</th></tr></thead>
                  <tbody>
                    {leads.sort((a,b)=>b.score-a.score).slice(0,4).map(l=>(
                      <tr key={l.id}>
                        <td>
                          <div style={{display:"flex",gap:10,alignItems:"center"}}>
                            <AvatarCircle name={l.name}/>
                            <div>
                              <div style={{fontWeight:700, fontSize:13.5}}>{l.name}</div>
                              <div style={{color:"var(--muted)", fontSize:12}}>{l.company}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{fontFamily:"var(--mono)", color:"var(--green)"}}>₹{l.value.toLocaleString()}</td>
                        <td><StatusBadge status={l.status}/></td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div className="score-bar" style={{width:60}}><div className="score-fill" style={{width:`${l.score}%`, background: l.score>70?"var(--green)":l.score>40?"var(--accent)":"var(--red)"}}/></div>
                            <span style={{fontSize:12, fontFamily:"var(--mono)"}}>{l.score}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Calls */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">📞 Recent Calls</div>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setTab("calls")}>Sab Dekho →</button>
                </div>
                {calls.slice(0,3).map(c=>(
                  <div key={c.id} className="call-entry">
                    <div className={`call-icon ${c.type}`}>{c.type==="out"?"📤":c.type==="in"?"📥":"📵"}</div>
                    <div className="call-info">
                      <div className="call-name">{c.lead} {c.ai && <span style={{background:"rgba(245,166,35,0.15)",color:"var(--accent)",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:700,marginLeft:4}}>AI</span>}</div>
                      <div className="call-detail">{c.time} · {c.outcome}</div>
                    </div>
                    <div className="call-dur">{c.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Leads Table */}
        {tab==="leads" && (
          <>
            <div className="topbar">
              <h1>Leads 👥 <span style={{fontSize:14,fontWeight:400,color:"var(--muted)"}}>{filtered.length} leads</span></h1>
              <div style={{display:"flex",gap:8}}>
                <input className="search-input" placeholder="🔍 Lead dhundo..." value={search} onChange={e=>setSearch(e.target.value)}/>
                <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Naya Lead</button>
              </div>
            </div>
            <div className="content">
              <div className="card">
                <table>
                  <thead><tr><th>Lead</th><th>Contact</th><th>Requirement</th><th>WhatsApp</th><th>Email</th><th>Value</th><th>Status</th><th>Score</th><th>Agent</th><th>Last Contact</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map(l=>(
                      <tr key={l.id}>
                        <td>
                          <div style={{display:"flex",gap:10,alignItems:"center"}}>
                            <AvatarCircle name={l.name}/>
                            <div>
                              <div style={{fontWeight:700}}>{l.name}</div>
                              <div style={{color:"var(--muted)",fontSize:12}}>{l.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{fontSize:12,fontFamily:"var(--mono)"}}>{l.phone}</div>
                          <div style={{fontSize:12,color:"var(--muted)"}}>{l.email}</div>
                        </td>
                        <td>
                          <div style={{fontSize:13,color:"var(--text)",maxWidth:160}}>{l.notes}</div>
                        </td>
                        <td>
                          <a
                            href={`https://wa.me/${l.phone.replace(/\D/g,"")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:6,background:"rgba(37,211,102,0.12)",border:"1px solid rgba(37,211,102,0.3)",color:"#25d366",fontSize:12,fontWeight:700,textDecoration:"none"}}
                          >
                            💬 WhatsApp
                          </a>
                        </td>
                        <td>
                          <a
                            href={`mailto:${l.email}?subject=Follow Up - ${l.company}&body=Namaste ${l.name.split(" ")[0]},`}
                            style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:6,background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.3)",color:"#60a5fa",fontSize:12,fontWeight:700,textDecoration:"none"}}
                          >
                            ✉️ Email
                          </a>
                        </td>
                        <td style={{fontFamily:"var(--mono)",color:"var(--green)",fontWeight:700}}>₹{l.value.toLocaleString()}</td>
                        <td>
                          <select style={{background:"transparent",border:"none",color:"inherit",fontFamily:"var(--font)",fontSize:13,cursor:"pointer"}} value={l.status} onChange={e=>{ updateLead(l.id,{status:e.target.value}); showToast("Status update hua!"); }}>
                            {["new","contacted","qualified","closed","lost"].map(s=><option key={s} style={{background:"var(--surface)"}}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div className="score-bar" style={{width:50}}><div className="score-fill" style={{width:`${l.score}%`, background: l.score>70?"var(--green)":l.score>40?"var(--accent)":"var(--red)"}}/></div>
                            <span style={{fontSize:12,fontFamily:"var(--mono)"}}>{l.score}</span>
                          </div>
                        </td>
                        <td style={{fontSize:12}}>{l.assigned}</td>
                        <td style={{fontSize:12,color:"var(--muted)"}}>{l.lastContact}</td>
                        <td>
                          <div style={{display:"flex",gap:4}}>
                            <button className="btn btn-ghost btn-sm" onClick={()=>{setTab("voice");}} title="AI se call karo">🎙️</button>
                            <button className="btn btn-danger btn-sm" onClick={()=>deleteLead(l.id)} title="Delete">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Voice Agent */}
        {tab==="voice" && (
          <>
            <div className="topbar">
              <h1>🎙️ AI Voice Agent — ARIA</h1>
              <span className="badge">● LIVE AI</span>
            </div>
            <div className="content">
              <div style={{marginBottom:16, padding:"14px 18px", background:"rgba(245,166,35,0.08)", border:"1px solid rgba(245,166,35,0.2)", borderRadius:10, fontSize:13, color:"var(--muted)", lineHeight:1.6}}>
                <strong style={{color:"var(--accent)"}}>💡 ARIA kaise use karein:</strong> Upar se koi lead select karo → ARIA us lead ke baare mein context samjhega → Baat karo ya poochho → CRM automatically update hoga. Voice ke liye 🎤 button dabaao.
              </div>
              <VoiceAgent leads={leads} onUpdateLead={updateLead} onAddCall={addCall} onToast={showToast}/>
            </div>
          </>
        )}

        {/* Pipeline */}
        {tab==="pipeline" && (
          <>
            <div className="topbar"><h1>Pipeline 🔀</h1><span className="badge">{leads.length} total leads</span></div>
            <div className="content">
              <div className="pipeline-grid">
                {pipelineStages.map(stage=>{
                  const stageLeads = leads.filter(l=>l.status===stage);
                  const colors = {new:"#3b82f6",contacted:"#f5a623",qualified:"#22c55e",closed:"#a855f7",lost:"#ef4444"};
                  return (
                    <div key={stage} className="pipeline-col">
                      <div className="pipeline-col-header" style={{color:colors[stage]}}>
                        {stage.toUpperCase()}
                        <span className="pipeline-count">{stageLeads.length}</span>
                      </div>
                      {stageLeads.map(l=>(
                        <div key={l.id} className="pipeline-card">
                          <div className="pipeline-card-name">{l.name}</div>
                          <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>{l.company}</div>
                          <div className="pipeline-card-val">₹{l.value.toLocaleString()}</div>
                          <div className="pipeline-card-src">📍 {l.source} · Score: {l.score}</div>
                        </div>
                      ))}
                      {stageLeads.length===0 && <div style={{textAlign:"center",color:"var(--muted)",fontSize:12,padding:"20px 0"}}>Koi lead nahi</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Call Logs */}
        {tab==="calls" && (
          <>
            <div className="topbar">
              <h1>Call Logs 📞</h1>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:13,color:"var(--muted)"}}>🤖 AI calls: {aiCalls}</span>
                <button className="btn btn-green btn-sm" onClick={()=>{addCall({id:Date.now(),lead:"Manual Entry",type:"out",time:`Abhi`,duration:"0:00",outcome:"Manually logged",ai:false}); showToast("Call log hua!");}}>+ Manual Log</button>
              </div>
            </div>
            <div className="content">
              <div className="card">
                {calls.map(c=>(
                  <div key={c.id} className="call-entry">
                    <div className={`call-icon ${c.type}`}>{c.type==="out"?"📤":c.type==="in"?"📥":"📵"}</div>
                    <div className="call-info">
                      <div className="call-name">
                        {c.lead}
                        {c.ai && <span style={{background:"rgba(245,166,35,0.15)",color:"var(--accent)",padding:"1px 8px",borderRadius:10,fontSize:10,fontWeight:700,marginLeft:8}}>🤖 AI ARIA</span>}
                      </div>
                      <div className="call-detail">{c.time} · {c.outcome}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div className="call-dur">{c.duration}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2, textTransform:"uppercase"}}>{c.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals & Toast */}
      {showAdd && <AddLeadModal onClose={()=>setShowAdd(false)} onAdd={addLead}/>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
