import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles, X, Copy, RefreshCw, Loader2, Clock, AlertTriangle,
  GitFork, MessageSquare, HandCoins, FileText, CalendarDays, Users2,
  FlaskConical, Check, Building2, ClipboardList, Upload, MapPin,
  GraduationCap, Target, TrendingUp, FileCheck, FileBarChart2, FileLock2,
  ExternalLink, CalendarClock, ListChecks, Plus, Search, UploadCloud, Mail
} from "lucide-react";

/* ---------------------------------------------------------------
   Engineering Corporate Engagement Hub — DEMO
   All data is synthetic and fictional. No real records.
   Fixed "today" so flags and freshness are deterministic.
---------------------------------------------------------------- */

const TODAY = new Date("2026-07-10T12:00:00");

const C = {
  spartan: "#18453B", ink: "#0F2B24", paper: "#FAFAF8", panel: "#FFFFFF",
  mist: "#E3E9E5", moss: "#5F7C6F", faint: "#F1F4F1",
  amber: "#B45309", amberBg: "#FDF3E3", brick: "#A0331F", brickBg: "#FBEAE6",
  fresh: "#2E7D6B", freshBg: "#E8F2EE",
  alum: "#2E7D6B", board: "#B45309", donor: "#6D4FA1",
};

const FOCUS = "focus:outline-none focus:ring-2 focus:ring-emerald-800";

const ROLE_META = {
  exec:  { label: "Company role",    color: C.spartan },
  alum:  { label: "MSU alum",        color: C.alum },
  board: { label: "Board / program", color: C.board },
  donor: { label: "Donor",           color: C.donor },
};

const UNITS = {
  u1: { id: "u1", name: "Engineering Advisory Board" },
  u2: { id: "u2", name: "CSE Capstone Program" },
};

const PEOPLE = [
  { id: "p1", companyId: "m", name: "Dana Whitfield", title: "SVP, Engineering", sf: { status: "linked", rec: "003…8QK" },
    roles: [
      { kind: "exec",  detail: "SVP, Engineering" },
      { kind: "alum",  detail: "BS Mechanical Engineering '02" },
      { kind: "board", detail: "Engineering Advisory Board member" },
      { kind: "donor", detail: "Personal giving since 2015" },
    ],
    unitLinks: [{ unitId: "u1", label: "Board member" }] },
  { id: "p2", companyId: "m", name: "Marcus Osei", title: "Director of R&D", sf: { status: "suggested" },
    roles: [
      { kind: "exec", detail: "Director of R&D" },
      { kind: "alum", detail: "MS Electrical Engineering '08" },
    ], unitLinks: [] },
  { id: "p3", companyId: "g", name: "Priya Raman", title: "Chief Technology Officer", sf: { status: "linked", rec: "003…2MV" },
    roles: [
      { kind: "exec",  detail: "Chief Technology Officer" },
      { kind: "alum",  detail: "MS Computer Science '11" },
      { kind: "board", detail: "CSE capstone sponsor contact" },
    ],
    unitLinks: [{ unitId: "u2", label: "Sponsor contact" }] },
  { id: "p4", companyId: "g", name: "Tom Kowalski", title: "VP, Talent",
    roles: [{ kind: "exec", detail: "VP, Talent" }], unitLinks: [] },
  { id: "p5", companyId: "h", name: "Elaine Burr", title: "Chief Executive Officer", sf: { status: "linked", rec: "003…9TW" },
    roles: [
      { kind: "exec",  detail: "Chief Executive Officer" },
      { kind: "board", detail: "Advisory Board (term ended 2024)" },
      { kind: "donor", detail: "Gifts totaling $850K" },
    ],
    unitLinks: [{ unitId: "u1", label: "Past member" }] },
  { id: "p6", companyId: "c", name: "Sofia Marchetti", title: "Director, University Partnerships", sf: { status: "linked", rec: "003…4LP" },
    roles: [{ kind: "exec", detail: "Director, University Partnerships" }], unitLinks: [] },
  { id: "p7", companyId: "n", name: "Jae Park", title: "Founder & CEO", sf: { status: "linked", rec: "003…7RD" },
    roles: [
      { kind: "exec",  detail: "Founder & CEO" },
      { kind: "alum",  detail: "BS Computer Science '05" },
      { kind: "donor", detail: "CSE Excellence Fund" },
      { kind: "board", detail: "CSE capstone sponsor" },
    ],
    unitLinks: [{ unitId: "u2", label: "Sponsor" }] },
  { id: "p8", companyId: "a", name: "Ravi Nair", title: "Chief Scientist", sf: { status: "suggested" },
    roles: [
      { kind: "exec", detail: "Chief Scientist" },
      { kind: "alum", detail: "PhD Chemical Engineering '99" },
    ], unitLinks: [] },
];

const COMPANIES = [
  {
    id: "m", name: "Meridian Mobility Group", sector: "Automotive & mobility systems",
    hq: "Dearborn, MI", since: 2014, lifetime: 2410000, officer: "Bob Irland",
    lanes: { Giving: 3, Research: 3, Talent: 2, Boards: 3 },
    proposals: [], // superseded by the PROPOSALS registry
    activities: [
      { date: "2026-06-28", type: "contact",  text: "Call with Dana Whitfield on lab proposal timeline" },
      { date: "2026-05-15", type: "board",    text: "Advisory Board spring meeting — Dana attended" },
      { date: "2026-04-22", type: "research", text: "Site visit: autonomy testbed with Dr. Chen's group" },
      { date: "2026-03-04", type: "proposal", text: "Submitted Mobility Systems Lab proposal ($750K)" },
      { date: "2026-01-20", type: "gift",     text: "$250,000 gift — Mobility Scholars Fund" },
      { date: "2025-10-02", type: "event",    text: "Hosted 12 students at Dearborn tech center" },
    ],
  },
  {
    id: "g", name: "Great Lakes Robotics", sector: "Industrial automation",
    hq: "Grand Rapids, MI", since: 2019, lifetime: 0, officer: "Bob Irland",
    lanes: { Giving: 0, Research: 1, Talent: 3, Boards: 1 },
    proposals: [],
    activities: [
      { date: "2026-05-26", type: "contact",  text: "Design Day conversation with Priya on fall sponsorship" },
      { date: "2026-05-26", type: "event",    text: "Capstone Design Day judge — Priya Raman" },
      { date: "2026-02-12", type: "event",    text: "Spring career fair — hired 6 co-ops" },
      { date: "2025-11-03", type: "contact",  text: "Intro call with Tom Kowalski on talent pipeline" },
      { date: "2025-09-18", type: "event",    text: "Sponsored CSE 498 team (warehouse vision)" },
    ],
  },
  {
    id: "h", name: "Huron Materials Corporation", sector: "Advanced materials",
    hq: "Midland, MI", since: 2008, lifetime: 850000, officer: "Bob Irland",
    lanes: { Giving: 2, Research: 0, Talent: 0, Boards: 1 },
    proposals: [],
    activities: [
      { date: "2025-05-02", type: "contact", text: "Check-in call with Elaine Burr" },
      { date: "2024-04-18", type: "board",   text: "Elaine's final Advisory Board term ended" },
      { date: "2023-12-15", type: "gift",    text: "$100,000 gift — Materials Science Fund" },
    ],
  },
  {
    id: "c", name: "Cedarline Energy", sector: "Grid & renewable energy",
    hq: "Lansing, MI", since: 2025, lifetime: 50000, officer: "Bob Irland",
    lanes: { Giving: 1, Research: 2, Talent: 1, Boards: 0 },
    proposals: [], // superseded by the PROPOSALS registry
    activities: [
      { date: "2026-06-30", type: "research", text: "Draft scope review with OSP and Dr. Alvarez" },
      { date: "2026-06-14", type: "contact",  text: "Sofia Marchetti campus visit — energy labs tour" },
      { date: "2026-02-12", type: "event",    text: "First career fair appearance" },
      { date: "2026-02-01", type: "gift",     text: "$50,000 seed gift — Energy Systems" },
    ],
  },
  {
    id: "n", name: "Northbank Software", sector: "Developer tools",
    hq: "Ann Arbor, MI", since: 2012, lifetime: 620000, officer: "Bob Irland",
    lanes: { Giving: 2, Research: 1, Talent: 2, Boards: 2 },
    proposals: [],
    activities: [
      { date: "2026-06-20", type: "contact", text: "Lunch with Jae Park — endowment conversation" },
      { date: "2026-05-26", type: "event",   text: "Design Day sponsor booth" },
      { date: "2025-12-30", type: "gift",    text: "$120,000 gift — CSE Excellence Fund" },
      { date: "2025-09-18", type: "event",   text: "Sponsored CSE 498 team (dev-tools telemetry)" },
    ],
  },
  {
    id: "a", name: "Apex Polymer Sciences", sector: "Specialty chemicals",
    hq: "Kalamazoo, MI", since: 2016, lifetime: 1100000, officer: "Bob Irland",
    lanes: { Giving: 3, Research: 0, Talent: 1, Boards: 0 },
    proposals: [], // superseded by the PROPOSALS registry
    activities: [
      { date: "2026-04-01", type: "contact", text: "Ravi Nair call — endowment terms follow-up" },
      { date: "2025-10-08", type: "contact", text: "Campus visit with ChemE department chair" },
      { date: "2025-06-30", type: "gift",    text: "$200,000 gift — Polymer Scholars" },
    ],
  },
];

/* Company intelligence — imported via the standardized research template. */
const INTEL = {
  m: { asOf: "2026-06-05", hiring: true, source: "Quarterly research template",
    priorities: ["Vehicle autonomy", "Sensor fusion", "Battery systems", "Software-defined vehicles"],
    talent: "Hiring up 14% in software and controls, concentrated in Dearborn and Ann Arbor.",
    locations: ["Dearborn, MI (HQ)", "Ann Arbor, MI (software center)", "Austin, TX"],
    alumni: { total: 312, senior: 24 },
    targets: [
      { name: "L. Chen", title: "VP, Advanced Engineering" },
      { name: "R. Delgado", title: "Head of University Programs" },
    ] },
  g: { asOf: "2026-04-20", hiring: true, source: "Quarterly research template",
    priorities: ["Warehouse robotics", "Computer vision", "Fleet orchestration"],
    talent: "Hiring up 22% in robotics software; heavy co-op and intern usage.",
    locations: ["Grand Rapids, MI (HQ)", "Holland, MI (plant)"],
    alumni: { total: 58, senior: 6 },
    targets: [
      { name: "A. Foster", title: "Chief Financial Officer" },
      { name: "M. Ito", title: "Director, Community Impact" },
    ] },
  h: { asOf: "2024-11-12", hiring: false, source: "Quarterly research template",
    priorities: ["Lightweight composites", "Sustainable materials"],
    talent: "Headcount flat (as of late 2024).",
    locations: ["Midland, MI (HQ)"],
    alumni: { total: 141, senior: 11 },
    targets: [{ name: "S. Novak", title: "Chief Technology Officer" }] },
  c: { asOf: "2026-06-22", hiring: true, source: "Quarterly research template",
    priorities: ["Grid resilience", "Long-duration storage", "Renewables integration"],
    talent: "Opened Lansing engineering office; hiring power systems engineers.",
    locations: ["Lansing, MI (HQ)"],
    alumni: { total: 37, senior: 3 },
    targets: [{ name: "D. Okafor", title: "VP, Engineering" }] },
  n: { asOf: "2026-01-15", hiring: true, source: "Quarterly research template",
    priorities: ["AI developer tools", "Cloud infrastructure"],
    talent: "Intern hiring up 30%; remote-first with an Ann Arbor hub.",
    locations: ["Ann Arbor, MI (HQ)"],
    alumni: { total: 44, senior: 9 },
    targets: [{ name: "K. Brandt", title: "VP, People" }] },
  a: { asOf: "2025-12-01", hiring: true, source: "Quarterly research template",
    priorities: ["Bio-based polymers", "Coatings", "Recyclable packaging"],
    talent: "R&D expansion underway in Kalamazoo.",
    locations: ["Kalamazoo, MI (HQ)", "Portage, MI (R&D)"],
    alumni: { total: 96, senior: 8 },
    targets: [
      { name: "H. Villanueva", title: "VP, R&D" },
      { name: "P. Sandoval", title: "Corporate Giving Lead" },
    ] },
};

/* MSU capability catalog — labs and programs with focus tags. */
const CAPABILITIES = [
  { name: "Autonomy & Connected Mobility Lab", unit: "ECE", contact: "Dr. W. Chen",
    tags: ["vehicle autonomy", "sensor fusion", "mobility"] },
  { name: "Energy Storage & Battery Group", unit: "ChemE & MSE", contact: "Dr. R. Patel",
    tags: ["battery systems", "long-duration storage", "electrochemistry"] },
  { name: "Grid Resilience Center", unit: "ECE", contact: "Dr. M. Alvarez",
    tags: ["grid resilience", "renewables integration", "power systems"] },
  { name: "Robotics & Advanced Manufacturing Lab", unit: "ME", contact: "Dr. S. Kim",
    tags: ["warehouse robotics", "automation", "manufacturing"] },
  { name: "AI & Computer Vision Group", unit: "CSE", contact: "Dr. J. Okonkwo",
    tags: ["computer vision", "AI developer tools", "machine learning"] },
  { name: "Polymers & Composites Institute", unit: "ChemE & MSE", contact: "Dr. E. Hart",
    tags: ["bio-based polymers", "lightweight composites", "coatings", "sustainable materials"] },
  { name: "Software Systems Lab", unit: "CSE", contact: "Dr. T. Nguyen",
    tags: ["cloud infrastructure", "software-defined vehicles", "developer tools"] },
  { name: "Fleet & Logistics Analytics Program", unit: "CSE / SCM", contact: "Dr. A. Rossi",
    tags: ["fleet orchestration", "logistics", "optimization"] },
];

/* Fiscal-year financials (synthetic) — powers portfolio trend views. */
const YEARS = [2022, 2023, 2024, 2025, 2026];
const FINANCIALS = {
  m: { giving:   { 2022: 180000, 2023: 220000, 2024: 310000, 2025: 250000, 2026: 340000 },
       research: { 2022: 400000, 2023: 450000, 2024: 520000, 2025: 600000, 2026: 750000 } },
  g: { giving:   { 2022: 0, 2023: 0, 2024: 0, 2025: 0, 2026: 0 },
       research: { 2022: 0, 2023: 0, 2024: 15000, 2025: 15000, 2026: 20000 } },
  h: { giving:   { 2022: 120000, 2023: 100000, 2024: 0, 2025: 0, 2026: 0 },
       research: { 2022: 0, 2023: 0, 2024: 0, 2025: 0, 2026: 0 } },
  c: { giving:   { 2022: 0, 2023: 0, 2024: 0, 2025: 0, 2026: 50000 },
       research: { 2022: 0, 2023: 0, 2024: 0, 2025: 0, 2026: 120000 } },
  n: { giving:   { 2022: 80000, 2023: 90000, 2024: 100000, 2025: 120000, 2026: 60000 },
       research: { 2022: 0, 2023: 25000, 2024: 25000, 2025: 40000, 2026: 40000 } },
  a: { giving:   { 2022: 150000, 2023: 180000, 2024: 200000, 2025: 200000, 2026: 90000 },
       research: { 2022: 0, 2023: 0, 2024: 0, 2025: 0, 2026: 0 } },
};

/* Curated focus areas — matched against imported technical priorities. */
const FOCUS_AREAS = [
  { id: "mobility",  label: "Mobility",
    match: ["vehicle autonomy", "sensor fusion", "software-defined vehicles", "fleet orchestration"] },
  { id: "energy",    label: "Batteries & energy storage",
    match: ["battery systems", "long-duration storage"] },
  { id: "grid",      label: "Grid & renewables",
    match: ["grid resilience", "renewables integration"] },
  { id: "robotics",  label: "Robotics & automation",
    match: ["warehouse robotics", "computer vision"] },
  { id: "software",  label: "AI & software",
    match: ["ai developer tools", "cloud infrastructure", "software-defined vehicles"] },
  { id: "materials", label: "Materials & polymers",
    match: ["lightweight composites", "sustainable materials", "bio-based polymers", "coatings", "recyclable packaging"] },
];

/* Document index — the hub stores links and metadata, not copies.
   Files stay where they live (SharePoint/OneDrive). Due dates feed flags. */
const DOC_TYPES = {
  proposal:  { label: "Proposal",           icon: FileText },
  agreement: { label: "Gift agreement",     icon: FileCheck },
  research:  { label: "Research agreement", icon: FileCheck },
  report:    { label: "Impact report",      icon: FileBarChart2 },
  funding:   { label: "Funding summary",    icon: FileBarChart2 },
  nda:       { label: "NDA",                icon: FileLock2 },
};

const DOCS = {
  m: [
    { title: "Mobility Systems Lab expansion proposal", type: "proposal", date: "2026-03-04", status: "In review", owner: "B. Irland" },
    { title: "Mobility Scholars Fund gift agreement", type: "agreement", date: "2026-01-20", status: "Executed", owner: "Advancement records" },
    { title: "Mobility Scholars FY26 impact report", type: "report", date: null, dueDate: "2026-09-15", status: "Due", owner: "B. Irland" },
    { title: "FY25 engagement funding summary", type: "funding", date: "2025-09-30", status: "Final", owner: "Research team" },
    { title: "Master NDA", type: "nda", date: "2024-05-10", status: "Executed", owner: "OGC" },
  ],
  g: [
    { title: "Mutual NDA", type: "nda", date: "2025-09-01", status: "Executed", owner: "OGC" },
  ],
  h: [
    { title: "Materials Science Fund gift agreement", type: "agreement", date: "2019-03-15", status: "Executed", owner: "Advancement records" },
    { title: "Materials Science Fund FY25 impact report", type: "report", date: null, dueDate: "2026-06-01", status: "Overdue", owner: "B. Irland" },
    { title: "FY23 impact report", type: "report", date: "2023-09-20", status: "Sent", owner: "Advancement records" },
  ],
  c: [
    { title: "Grid resilience research agreement (draft)", type: "research", date: "2026-05-10", status: "In negotiation", owner: "OSP" },
    { title: "Mutual NDA", type: "nda", date: "2026-02-05", status: "Executed", owner: "OGC" },
  ],
  n: [
    { title: "CSE Excellence Fund gift agreement", type: "agreement", date: "2025-12-30", status: "Executed", owner: "Advancement records" },
    { title: "CSE Excellence FY26 impact report", type: "report", date: null, dueDate: "2026-12-15", status: "Due", owner: "B. Irland" },
  ],
  a: [
    { title: "Polymer Scholars endowment agreement", type: "agreement", date: "2025-12-12", status: "Awaiting signature", owner: "B. Irland" },
    { title: "Polymer Scholars FY25 impact report", type: "report", date: "2025-09-10", status: "Sent", owner: "Advancement records" },
  ],
};

function docStatusStyle(s) {
  if (["Executed", "Final", "Sent"].includes(s)) return { background: C.freshBg, color: C.fresh };
  if (["Awaiting signature", "Due"].includes(s)) return { background: C.amberBg, color: C.amber };
  if (s === "Overdue") return { background: C.brickBg, color: C.brick };
  return { background: C.faint, color: C.moss };
}

/* Tasks & next steps — per company, with owners and due dates.
   Open tasks past due feed the attention flags. */
const TASKS_SEED = {
  m: [
    { id: "t1", text: "Send lab proposal timeline recap to Dana", owner: "B. Irland", due: "2026-07-14", done: false },
    { id: "t2", text: "Ask Dana for an intro to L. Chen (research target)", owner: "B. Irland", due: "2026-07-31", done: false },
    { id: "t3", text: "Confirm fall student visit date at Dearborn", owner: "Career services liaison", due: "2026-08-15", done: false },
  ],
  g: [
    { id: "t1", text: "Draft first giving conversation approach with Priya", owner: "B. Irland", due: "2026-07-20", done: false },
    { id: "t2", text: "Confirm fall capstone sponsorship", owner: "Priya Raman", due: "2026-07-25", done: false },
  ],
  h: [
    { id: "t1", text: "Re-engagement call with Elaine Burr", owner: "B. Irland", due: "2026-06-20", done: false },
    { id: "t2", text: "Send overdue FY25 impact report", owner: "B. Irland", due: "2026-07-15", done: false },
    { id: "t3", text: "Refresh company intelligence (quarterly template)", owner: "Research team", due: "2026-07-30", done: false },
  ],
  c: [
    { id: "t1", text: "Follow up with OSP on agreement redlines", owner: "OSP", due: "2026-07-17", done: false },
  ],
  n: [
    { id: "t1", text: "Endowment concept memo for Jae", owner: "B. Irland", due: "2026-08-01", done: false },
  ],
  a: [
    { id: "t1", text: "Chase endowment signature — call H. Villanueva", owner: "B. Irland", due: "2026-07-11", done: false },
  ],
};

function taskFlags(list) {
  return (list || [])
    .filter((t) => !t.done && t.due && daysAgo(t.due) > 0)
    .map((t) => ({ level: "high", icon: ListChecks, text: `Task overdue ${daysAgo(t.due)}d — ${t.text}` }));
}

const fmtDay = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

/* Proposal registry — strategic fields Salesforce never asks for.
   Champion, exec sponsor, business case, and alignment are required thinking,
   not optional metadata. Readiness checks are deterministic — no AI. */
const PROPOSALS = [
  { id: "pr1", companyId: "m", name: "Mobility Systems Lab expansion", amount: 750000,
    stage: "In review", submitted: "2026-03-04", expectedClose: "2026-10-01",
    purpose: "Research infrastructure",
    champion: "Marcus Osei", execSponsor: "Dana Whitfield",
    engaged: ["Dana Whitfield", "Marcus Osei"],
    businessCase: "Expands the autonomy testing capacity Meridian relies on for validation; tied to their FY27 software-defined vehicle roadmap.",
    alignedPriority: "Vehicle autonomy",
    nextMilestone: { text: "Meridian internal budget review", date: "2026-07-24" },
    lastMovement: "2026-06-28" },
  { id: "pr2", companyId: "c", name: "Grid resilience research agreement", amount: 300000,
    stage: "Negotiation", submitted: "2026-05-10", expectedClose: "2026-08-15",
    purpose: "Sponsored research",
    champion: "Sofia Marchetti", execSponsor: null,
    engaged: ["Sofia Marchetti"],
    businessCase: "Supports Cedarline's grid-resilience commitments; co-funded pilot with Dr. Alvarez's center.",
    alignedPriority: "Grid resilience",
    nextMilestone: { text: "OSP redline response", date: "2026-07-17" },
    lastMovement: "2026-06-30" },
  { id: "pr3", companyId: "a", name: "Polymer Scholars endowment", amount: 500000,
    stage: "Awaiting signature", submitted: "2025-12-12", expectedClose: "2026-05-01",
    purpose: "Endowed scholarships",
    champion: "Ravi Nair", execSponsor: null,
    engaged: ["Ravi Nair"],
    businessCase: null,
    alignedPriority: null,
    nextMilestone: null,
    lastMovement: "2026-04-01" },
  { id: "pr4", companyId: "g", name: "Robotics partnership concept (first gift)", amount: 100000,
    stage: "Draft", created: "2026-06-10", expectedClose: "2026-12-15",
    purpose: "Talent-pipeline giving",
    champion: "Priya Raman", execSponsor: null,
    engaged: ["Priya Raman", "Tom Kowalski"],
    businessCase: "Frame giving as talent-pipeline investment after three years of heavy co-op hiring.",
    alignedPriority: "Warehouse robotics",
    nextMilestone: { text: "Concept review with Priya", date: "2026-07-20" },
    lastMovement: "2026-06-10" },
  { id: "pr5", companyId: "n", name: "CSE Excellence endowment expansion", amount: 400000,
    stage: "Draft", created: "2026-06-20", expectedClose: "2027-03-01",
    purpose: "Endowment",
    champion: "Jae Park", execSponsor: "Jae Park",
    engaged: ["Jae Park"],
    businessCase: "Convert five years of consistent annual giving into an endowed commitment anchored in Jae's founder story.",
    alignedPriority: "AI developer tools",
    nextMilestone: { text: "Concept memo to Jae", date: "2026-08-01" },
    lastMovement: "2026-06-20" },
];

const proposalsOf = (cid) => PROPOSALS.filter((p) => p.companyId === cid);
const researchFY = (cid) => YEARS.reduce((s, y) => s + (FINANCIALS[cid].research[y] || 0), 0);

const STAGE_META = [
  { key: "Awaiting signature", prob: 0.9 },
  { key: "Negotiation",        prob: 0.6 },
  { key: "In review",          prob: 0.4 },
  { key: "Draft",              prob: 0.1 },
];
const stageProb = (s) => (STAGE_META.find((m) => m.key === s) || { prob: 0.25 }).prob;

function proposalChecks(p) {
  return [
    { ok: !!p.champion,       label: "Champion named",           gap: "No champion" },
    { ok: !!p.execSponsor,    label: "Exec sponsor named",       gap: "No exec sponsor" },
    { ok: !!p.businessCase,   label: "Business case on record",  gap: "No business case" },
    { ok: !!p.alignedPriority, label: "Tied to a company priority", gap: "Not tied to a company priority" },
    { ok: (p.engaged || []).length >= 2, label: "Multi-threaded", gap: "Single-threaded" },
    { ok: !!p.lastMovement && daysAgo(p.lastMovement) <= 45, label: "Recent movement",
      gap: p.lastMovement ? `Stalled ${daysAgo(p.lastMovement)}d` : "No movement recorded" },
    { ok: !!p.nextMilestone && daysAgo(p.nextMilestone.date) <= 0, label: "Next milestone scheduled",
      gap: p.nextMilestone ? "Milestone overdue" : "No next milestone" },
  ];
}

/* ------------------------- helpers ------------------------- */

const daysAgo = (iso) => Math.round((TODAY - new Date(iso + "T12:00:00")) / 86400000);
const money = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(2).replace(/\.?0+$/, "")}M`
  : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
const agoLabel = (d) => d === 0 ? "today" : d === 1 ? "1 day ago"
  : d < 60 ? `${d} days ago` : `${Math.round(d / 30)} months ago`;
const fmtMonth = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });

const lastTouchDays = (c) => Math.min(...c.activities.map((a) => daysAgo(a.date)));

function freshness(iso) {
  const d = daysAgo(iso);
  if (d < 120) return { key: "fresh", label: "fresh", color: C.fresh, bg: C.freshBg };
  if (d < 365) return { key: "aging", label: "aging", color: C.amber, bg: C.amberBg };
  return { key: "stale", label: "stale", color: C.brick, bg: C.brickBg };
}

function computeFlags(c) {
  const flags = [];
  const lt = lastTouchDays(c);
  if (lt > 365) flags.push({ level: "high", icon: Clock, text: `No contact in ${Math.round(lt / 30)} months` });
  else if (lt > 90) flags.push({ level: "med", icon: Clock, text: `Quiet for ${lt} days` });
  proposalsOf(c.id).forEach((p) => {
    if (!p.submitted) return;
    const open = daysAgo(p.submitted);
    if (open > 90) flags.push({ level: "high", icon: FileText, text: `Proposal open ${open} days — ${p.name}` });
  });
  if (c.lanes.Talent >= 3 && c.lanes.Giving === 0)
    flags.push({ level: "med", icon: GitFork, text: "Strong recruiting activity — no giving conversation yet" });
  if (c.lanes.Giving >= 2 && c.lanes.Research === 0)
    flags.push({ level: "med", icon: GitFork, text: "Established donor — research lane untouched" });
  const iv = INTEL[c.id];
  if (iv && freshness(iv.asOf).key === "stale")
    flags.push({ level: "med", icon: AlertTriangle, text: `Company intelligence is stale (as of ${fmtMonth(iv.asOf)})` });
  (DOCS[c.id] || []).forEach((d) => {
    if (!d.dueDate) return;
    const over = daysAgo(d.dueDate);
    if (over > 0) flags.push({ level: "high", icon: CalendarClock, text: `Overdue ${over}d — ${d.title}` });
    else if (over > -45) flags.push({ level: "med", icon: CalendarClock, text: `Due in ${-over}d — ${d.title}` });
  });
  return flags;
}

/* Deterministic capability matching: tag/priority overlap. No AI involved. */
function matchCapabilities(companyId) {
  const iv = INTEL[companyId];
  if (!iv) return { matches: [], unmatched: [] };
  const prios = iv.priorities.map((p) => p.toLowerCase());
  const matches = CAPABILITIES.map((lab) => {
    const matched = lab.tags.filter((t) =>
      prios.some((p) => p === t || p.includes(t) || t.includes(p)));
    return { ...lab, matched };
  }).filter((l) => l.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length);
  const covered = new Set(matches.flatMap((m) => m.matched));
  const unmatched = iv.priorities.filter((p) => {
    const pl = p.toLowerCase();
    return ![...covered].some((t) => pl === t || pl.includes(t) || t.includes(pl));
  });
  return { matches, unmatched };
}

const ACT_ICON = {
  contact: MessageSquare, gift: HandCoins, proposal: FileText,
  event: CalendarDays, board: Users2, research: FlaskConical,
};

/* ---------------------- AI generation ---------------------- */

function basePayload(c, taskList = []) {
  const iv = INTEL[c.id];
  const { matches, unmatched } = matchCapabilities(c.id);
  return {
    company: c.name, sector: c.sector, officer: c.officer,
    relationshipSince: c.since, lifetimeGiving: money(c.lifetime),
    lastContactDaysAgo: lastTouchDays(c),
    engagementLanes: c.lanes,
    engagementPrograms: (ENGAGE[c.id] || []).map((e) => ({
      program: e.name, since: e.since, lastParticipated: e.last,
      status: daysAgo(e.last) > 400 ? "lapsed" : "active",
      note: e.note || undefined,
    })),
    attentionFlags: [...computeFlags(c), ...taskFlags(taskList)].map((f) => f.text),
    openTasks: taskList.filter((t) => !t.done).map((t) => ({
      task: t.text, owner: t.owner, due: t.due || undefined,
    })),
    openProposals: proposalsOf(c.id).map((p) => ({
      name: p.name, amount: money(p.amount), stage: p.stage,
      daysOpen: daysAgo(p.submitted || p.created),
      champion: p.champion || "none", execSponsor: p.execSponsor || "none",
      businessCase: p.businessCase || "not on record",
      readinessGaps: proposalChecks(p).filter((k) => !k.ok).map((k) => k.gap),
    })),
    keyPeople: PEOPLE.filter((p) => p.companyId === c.id).map((p) => ({
      name: p.name, title: p.title, roles: p.roles.map((r) => r.detail),
    })),
    recentActivity: c.activities.slice(0, 5).map((a) => ({ when: agoLabel(daysAgo(a.date)), what: a.text })),
    companyIntelligence: iv ? {
      asOf: iv.asOf, technicalPriorities: iv.priorities, talentTrend: iv.talent,
      locations: iv.locations, msuAlumni: iv.alumni,
      targetContactsNotYetEngaged: iv.targets,
    } : null,
    msuCapabilityAlignment: matches.map((m) => ({
      lab: m.name, unit: m.unit, facultyContact: m.contact, matchedPriorities: m.matched,
    })),
    prioritiesWithNoMappedCapability: unmatched,
    documents: (DOCS[c.id] || []).map((d) => ({
      title: d.title, type: DOC_TYPES[d.type].label, status: d.status,
      date: d.date || undefined, dueDate: d.dueDate || undefined,
    })),
  };
}

async function callModel(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  if (!text) throw new Error("empty");
  return text;
}

const BRIEF_TITLES = ["relationship snapshot", "needs attention", "talking points"];
const PLAN_TITLES = ["objectives", "alignment plays", "people and engagement", "next 90 days"];

function briefPrompt(c, taskList = []) {
  return "You are drafting a short internal meeting brief for an MSU corporate relations officer. " +
    "Use ONLY the JSON facts below; do not invent names, numbers, or events. " +
    "Write plain text (no markdown symbols), under 170 words, in exactly three sections, " +
    "each title on its own line: Relationship snapshot / Needs attention / Talking points.\n\n" +
    JSON.stringify(basePayload(c, taskList));
}

function planPrompt(c, taskList = []) {
  return "You are drafting a rough one-page account plan for an MSU corporate relations officer. " +
    "Use ONLY the JSON facts below; do not invent names, numbers, labs, or events. " +
    "Where intelligence is dated, treat it cautiously. Write plain text (no markdown symbols), " +
    "under 230 words, in exactly four sections, each title on its own line: " +
    "Objectives / Alignment plays / People and engagement / Next 90 days.\n\n" +
    JSON.stringify(basePayload(c, taskList));
}

function fallbackBrief(c) {
  const f = computeFlags(c);
  const ppl = PEOPLE.filter((p) => p.companyId === c.id);
  return [
    "Relationship snapshot",
    `${c.name} has been an MSU partner since ${c.since}, with ${money(c.lifetime)} in lifetime giving. Last contact was ${agoLabel(lastTouchDays(c))}. Key people: ${ppl.map((p) => `${p.name} (${p.title})`).join("; ")}.`,
    "Needs attention",
    f.length ? f.map((x) => x.text).join(". ") + "." : "No open flags on this relationship.",
    "Talking points",
    "Lead with the Spartan connections where they exist, ask what would make the next step easy on their side, and connect quiet lanes to their current priorities.",
  ].join("\n");
}

function fallbackPlan(c) {
  const iv = INTEL[c.id];
  const { matches, unmatched } = matchCapabilities(c.id);
  const f = computeFlags(c);
  return [
    "Objectives",
    `Deepen the ${c.name} relationship over the next 12 months: resolve open flags, activate quiet lanes, and connect their stated priorities to MSU capabilities.`,
    "Alignment plays",
    matches.length
      ? matches.map((m) => `${m.name} (${m.unit}, ${m.contact}) — aligns on ${m.matched.join(", ")}.`).join(" ")
      : "No mapped capability matches yet — validate priorities with faculty partners.",
    unmatched.length ? `No mapped MSU capability yet for: ${unmatched.join(", ")}.` : "",
    "People and engagement",
    `Engaged: ${PEOPLE.filter((p) => p.companyId === c.id).map((p) => p.name).join(", ")}. ` +
    (iv ? `Not yet engaged: ${iv.targets.map((t) => `${t.name} (${t.title})`).join(", ")}. MSU alumni at company: ${iv.alumni.total} (${iv.alumni.senior} senior).` : ""),
    "Next 90 days",
    f.length ? f.map((x) => `Address: ${x.text}.`).join(" ") : "Maintain cadence and confirm next milestone with the primary contact.",
  ].filter(Boolean).join("\n");
}

/* Engagement programs — structured participation the activity feed can't show.
   Career fairs, co-ops, capstone sponsorship, tours, boards. Dated like everything else. */
const ENGAGE = {
  m: [
    { name: "Career fair", since: 2015, last: "2026-02-12" },
    { name: "Co-op program", since: 2018, last: "2026-06-01", note: "8 co-ops per year" },
    { name: "Facility tours & student visits", since: 2021, last: "2025-10-02" },
    { name: "Engineering Advisory Board", since: 2019, last: "2026-05-15" },
  ],
  g: [
    { name: "Career fair", since: 2020, last: "2026-02-12" },
    { name: "Co-op program", since: 2021, last: "2026-02-12", note: "6 co-ops per year" },
    { name: "CSE capstone sponsorship", since: 2024, last: "2025-09-18" },
    { name: "Design Day judging", since: 2025, last: "2026-05-26" },
  ],
  h: [
    { name: "Career fair", since: 2010, last: "2023-02-15" },
    { name: "Engineering Advisory Board", since: 2016, last: "2024-04-18" },
  ],
  c: [
    { name: "Career fair", since: 2026, last: "2026-02-12" },
    { name: "Guest lectures", since: 2026, last: "2026-04-10" },
  ],
  n: [
    { name: "CSE capstone sponsorship", since: 2023, last: "2025-09-18" },
    { name: "Design Day sponsor booth", since: 2024, last: "2026-05-26" },
    { name: "Guest lectures", since: 2022, last: "2026-03-15" },
    { name: "Intern program", since: 2020, last: "2026-06-01" },
  ],
  a: [
    { name: "Career fair", since: 2017, last: "2024-09-20" },
    { name: "Facility tours", since: 2023, last: "2025-10-08" },
  ],
};

const engStatus = (last) => daysAgo(last) > 400
  ? { label: "lapsed", color: C.amber, bg: C.amberBg }
  : { label: "active", color: C.fresh, bg: C.freshBg };

/* Research workspace — a separate collaboration system, joined on company.
   The hub links to it; live projects, milestones, and faculty live there. */
const WORKSPACE = {
  m: [
    { project: "Autonomy testbed validation", faculty: "Dr. W. Chen", stage: "Active", updated: "2026-06-30" },
    { project: "Battery pack thermal study", faculty: "Dr. R. Patel", stage: "Scoping", updated: "2026-06-10" },
  ],
  c: [
    { project: "Grid resilience pilot", faculty: "Dr. M. Alvarez", stage: "Contracting", updated: "2026-06-30" },
  ],
};

const wsStageStyle = (s) => s === "Active"
  ? { background: C.freshBg, color: C.fresh }
  : s === "Contracting" ? { background: C.amberBg, color: C.amber }
  : { background: C.faint, color: C.moss };

/* Hiring outcomes — the career services currency. Placements, not just participation. */
const HIRES = {
  m: { coops: 8, ft: 6, threeYr: 38, majors: "ME · EE · CS" },
  g: { coops: 6, ft: 4, threeYr: 24, majors: "CS · ME" },
  h: { coops: 0, ft: 0, threeYr: 2,  majors: "MSE" },
  c: { coops: 1, ft: 1, threeYr: 2,  majors: "EE" },
  n: { coops: 5, ft: 2, threeYr: 12, majors: "CS" },
  a: { coops: 0, ft: 1, threeYr: 4,  majors: "ChemE" },
};

/* Fall career fair operations — the recruiting-calendar view. */
const FAIR = {
  date: "Sep 24, 2026",
  status: {
    m: "Registered", g: "Registered", c: "Registered",
    n: "Invited — no response", h: "Not invited yet", a: "Attended 2024 — no response",
  },
};
const fairChip = (s) => s === "Registered"
  ? { background: C.freshBg, color: C.fresh }
  : s.includes("no response") ? { background: C.amberBg, color: C.amber }
  : { background: C.faint, color: C.moss };

/* Engagement ladder — the employer-development playbook, computed from participation. */
const LADDER_RUNGS = [
  { label: "Career fair", cols: [0] },
  { label: "Campus presence (lectures, tours, Design Day)", cols: [3, 4, 5] },
  { label: "Co-op / intern program", cols: [1] },
  { label: "Capstone sponsorship", cols: [2] },
  { label: "Advisory engagement", cols: [6] },
];
function nextRung(cid, cellStatus) {
  for (const rung of LADDER_RUNGS) {
    const statuses = rung.cols.map((c) => cellStatus(cid, c));
    if (statuses.some((s) => s === "active")) continue;
    const lapsed = statuses.some((s) => s === "lapsed");
    return { label: rung.label, lapsed };
  }
  return null;
}

const REPORT_TITLES = ["partnership at a glance", "your spartan pipeline", "ways to deepen"];

function reportPayload(c, cellStatus) {
  const iv = INTEL[c.id];
  return {
    company: c.name,
    programs: (ENGAGE[c.id] || []).map((e) => ({
      program: e.name, since: e.since, last: e.last,
      status: daysAgo(e.last) > 400 ? "lapsed" : "active", note: e.note || undefined,
    })),
    hiring: HIRES[c.id],
    fallCareerFair: { date: FAIR.date, status: FAIR.status[c.id] },
    msuAlumniAtCompany: iv ? iv.alumni : undefined,
    suggestedNextStep: (nextRung(c.id, cellStatus) || { label: "Full ladder engaged" }).label,
  };
}

function reportPrompt(c, cellStatus) {
  return "You are drafting a short talent partnership summary addressed directly to the employer " +
    "(write in second person: you, your). Warm, factual, no salesiness. Use ONLY the JSON facts " +
    "below; do not invent numbers or programs. Plain text (no markdown symbols), under 170 words, " +
    "exactly three sections, each title on its own line: " +
    "Partnership at a glance / Your Spartan pipeline / Ways to deepen.\n\n" +
    JSON.stringify(reportPayload(c, cellStatus));
}

function fallbackReport(c, cellStatus) {
  const h = HIRES[c.id];
  const next = nextRung(c.id, cellStatus);
  const iv = INTEL[c.id];
  return [
    "Partnership at a glance",
    `${c.name} partners with MSU Engineering through ${(ENGAGE[c.id] || []).filter((e) => daysAgo(e.last) <= 400).map((e) => e.name).join(", ") || "an earlier program relationship"}. Fall career fair (${FAIR.date}): ${FAIR.status[c.id]}.`,
    "Your Spartan pipeline",
    `This year you brought on ${h.coops} co-ops/interns and ${h.ft} full-time hires (${h.threeYr} Spartans over three years, primarily ${h.majors}).${iv ? ` ${iv.alumni.total} MSU alumni work at your company today.` : ""}`,
    "Ways to deepen",
    next ? `${next.lapsed ? "Re-establishing" : "Adding"} ${next.label.toLowerCase()} would be the natural next step — we'd be glad to make it easy.` : "You're engaged across the full program ladder — thank you. Let's talk about what's next together.",
  ].join("\n");
}

/* Impact report — the company-facing stewardship deliverable, drafted from record data.
   Closes the loop the documents index opens: the overdue-report flag now has a Draft button. */
const IMPACT_TITLES = ["your impact at michigan state", "what your support made possible", "looking ahead"];

function impactPayload(c) {
  const iv = INTEL[c.id];
  return {
    company: c.name,
    lifetimeGiving: money(c.lifetime),
    givingByFiscalYear: FINANCIALS[c.id].giving,
    giftAgreements: (DOCS[c.id] || []).filter((d) => d.type === "agreement").map((d) => d.title),
    programsEngaged: (ENGAGE[c.id] || []).map((e) => ({ program: e.name, since: e.since, note: e.note || undefined })),
    spartansHired: HIRES[c.id],
    researchCollaboration: (WORKSPACE[c.id] || []).map((w) => ({ project: w.project, faculty: w.faculty, stage: w.stage })),
    msuAlumniAtCompany: iv ? iv.alumni : undefined,
  };
}

function impactPrompt(c) {
  return "You are drafting a short donor impact report addressed directly to a corporate partner " +
    "(second person: you, your). Warm, concrete, grateful — never salesy. Use ONLY the JSON facts " +
    "below; do not invent programs, numbers, or student stories. Plain text (no markdown symbols), " +
    "under 200 words, exactly three sections, each title on its own line: " +
    "Your impact at Michigan State / What your support made possible / Looking ahead.\n\n" +
    JSON.stringify(impactPayload(c));
}

function fallbackImpact(c) {
  const h = HIRES[c.id];
  const ws = WORKSPACE[c.id] || [];
  return [
    "Your impact at Michigan State",
    `Thank you. ${c.name}'s partnership with the College of Engineering — ${money(c.lifetime)} in giving to date — is shaping students and research across the college.`,
    "What your support made possible",
    `${(DOCS[c.id] || []).filter((d) => d.type === "agreement").map((d) => d.title).join("; ") || "Your giving"} supported students directly, alongside ${(ENGAGE[c.id] || []).filter((e) => daysAgo(e.last) <= 400).map((e) => e.name.toLowerCase()).join(", ") || "your program engagement"}. Your team brought on ${h.coops + h.ft} Spartans this year (${h.threeYr} over three years).${ws.length ? ` Research collaboration continues: ${ws.map((w) => `${w.project} with ${w.faculty}`).join("; ")}.` : ""}`,
    "Looking ahead",
    "We'd welcome the chance to show you this impact in person — on campus, with the students and faculty your partnership supports.",
  ].join("\n");
}

/* --------------------- relationship map --------------------- */

function RelationshipMap({ company, targets, onPick, picked }) {
  const ppl = PEOPLE.filter((p) => p.companyId === company.id)
    .map((p) => ({ ...p, node: "person" }));
  const tgts = targets.map((t, i) => ({
    id: `t-${company.id}-${i}`, name: t.name, title: t.title,
    node: "target", unitLinks: [], roles: [],
  }));
  const all = [...ppl, ...tgts];
  const cx = 360, cy = 232, rP = 148, rU = 236;
  const nodes = all.map((p, i) => {
    const a = (-90 + (360 / all.length) * i) * (Math.PI / 180);
    return { ...p, x: cx + rP * Math.cos(a), y: cy + rP * Math.sin(a), ang: a };
  });
  const unitIds = [...new Set(ppl.flatMap((p) => p.unitLinks.map((l) => l.unitId)))];
  const unitNodes = unitIds.map((uid, i) => {
    const linked = nodes.filter((n) => n.unitLinks.some((l) => l.unitId === uid));
    const avg = linked.reduce((s, n) => s + n.ang, 0) / linked.length + i * 0.25;
    return { ...UNITS[uid], x: cx + rU * Math.cos(avg), y: cy + rU * Math.sin(avg) };
  });
  const line1 = company.name.split(" ").slice(0, 2).join(" ");
  const line2 = company.name.split(" ").slice(2).join(" ");

  return (
    <svg viewBox="0 0 720 470" className="w-full" role="img"
      aria-label={`Relationship map for ${company.name}`}>
      {nodes.map((n) => (
        <line key={"e" + n.id} x1={cx} y1={cy} x2={n.x} y2={n.y}
          stroke={C.mist} strokeWidth="1.5"
          strokeDasharray={n.node === "target" ? "4 4" : "none"} />
      ))}
      {nodes.flatMap((n) =>
        n.unitLinks.map((l) => {
          const u = unitNodes.find((x) => x.id === l.unitId);
          return u ? (
            <line key={n.id + l.unitId} x1={n.x} y1={n.y} x2={u.x} y2={u.y}
              stroke="#CBD6CF" strokeWidth="1.2" strokeDasharray="4 4" />
          ) : null;
        })
      )}
      {unitNodes.map((u) => (
        <g key={u.id}>
          <rect x={u.x - 78} y={u.y - 15} width="156" height="30" rx="7" fill={C.faint} stroke={C.mist} />
          <text x={u.x} y={u.y + 4} textAnchor="middle"
            style={{ font: "600 10px ui-sans-serif, system-ui", fill: C.moss }}>{u.name}</text>
        </g>
      ))}
      <g>
        <rect x={cx - 88} y={cy - 24} width="176" height="48" rx="10" fill={C.spartan} />
        {line2 ? (
          <>
            <text x={cx} y={cy - 2} textAnchor="middle"
              style={{ font: "700 12px ui-sans-serif, system-ui", fill: "#fff" }}>{line1}</text>
            <text x={cx} y={cy + 13} textAnchor="middle"
              style={{ font: "700 12px ui-sans-serif, system-ui", fill: "#fff" }}>{line2}</text>
          </>
        ) : (
          <text x={cx} y={cy + 4} textAnchor="middle"
            style={{ font: "700 12px ui-sans-serif, system-ui", fill: "#fff" }}>{line1}</text>
        )}
      </g>
      {nodes.map((n) => {
        const initials = n.name.split(" ").map((w) => w[0]).join("").replace(".", "");
        const active = picked === n.id;
        const isTarget = n.node === "target";
        return (
          <g key={n.id} onClick={() => onPick(active ? null : n.id)} style={{ cursor: "pointer" }}>
            <circle cx={n.x} cy={n.y} r="19"
              fill={isTarget ? C.paper : "#fff"}
              stroke={active ? C.spartan : isTarget ? C.moss : C.mist}
              strokeWidth={active ? 2.5 : 1.5}
              strokeDasharray={isTarget ? "4 3" : "none"} />
            <text x={n.x} y={n.y + 4} textAnchor="middle"
              style={{ font: "700 11px ui-sans-serif, system-ui", fill: isTarget ? C.moss : C.spartan }}>
              {initials}
            </text>
            {!isTarget && n.roles.map((r, k) => {
              const a = (-135 + k * 30) * (Math.PI / 180);
              return (
                <circle key={k} cx={n.x + 26 * Math.cos(a)} cy={n.y + 26 * Math.sin(a)}
                  r="4.5" fill={ROLE_META[r.kind].color} stroke="#fff" strokeWidth="1.5" />
              );
            })}
            <text x={n.x} y={n.y + 36} textAnchor="middle"
              style={{ font: "500 10.5px ui-sans-serif, system-ui", fill: isTarget ? C.moss : C.ink }}>
              {n.name}
            </text>
            {isTarget && (
              <text x={n.x} y={n.y + 48} textAnchor="middle"
                style={{ font: "italic 9px ui-sans-serif, system-ui", fill: C.moss }}>
                not yet engaged
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* --------------------- shared UI pieces --------------------- */

function AsOfPill({ iso }) {
  const f = freshness(iso);
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
      style={{ background: f.bg, color: f.color }}>
      as of {fmtMonth(iso)} · {f.label}
    </span>
  );
}

function SlideOver({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-label={title}>
      <div className="absolute inset-0" style={{ background: "rgba(15,43,36,0.35)" }} onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[440px] overflow-y-auto shadow-2xl"
        style={{ background: C.panel }}>
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0"
          style={{ borderColor: C.mist, background: C.panel }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: C.spartan }} />
            <span className="font-bold text-sm" style={{ color: C.spartan }}>{title}</span>
          </div>
          <button onClick={onClose} aria-label="Close panel"
            className={`p-1 rounded ${FOCUS}`} style={{ color: C.moss }}>
            <X size={17} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function GeneratedText({ text, titles }) {
  return text.split("\n").map((line, i) => {
    const t = line.trim().replace(/:$/, "").toLowerCase();
    if (titles.includes(t)) {
      return (
        <h3 key={i} className="text-xs font-bold uppercase tracking-wide mt-4 first:mt-0 mb-1.5"
          style={{ color: C.spartan }}>{line.trim().replace(/:$/, "")}</h3>
      );
    }
    return line.trim() ? (
      <p key={i} className="text-sm leading-relaxed mb-2">{line.trim().replace(/^-\s*/, "• ")}</p>
    ) : null;
  });
}

/* --------------------- portfolio review --------------------- */

function TrendChart({ giving, research }) {
  const W = 680, H = 220, L = 56, R = 8, T = 12, B = 26;
  const plotW = W - L - R, plotH = H - T - B;
  const rawMax = Math.max(1, ...giving, ...research);
  const max = Math.ceil(rawMax / 200000) * 200000 || 200000;
  const y = (v) => T + plotH - (v / max) * plotH;
  const gw = plotW / YEARS.length;
  const bw = gw * 0.26;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label="Giving and sponsored research by fiscal year">
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={L} x2={W - R} y1={y(max * f)} y2={y(max * f)} stroke={C.faint} strokeWidth="1" />
          <text x={L - 6} y={y(max * f) + 3} textAnchor="end"
            style={{ font: "600 9px ui-sans-serif, system-ui", fill: C.moss }}>{money(max * f)}</text>
        </g>
      ))}
      {YEARS.map((yr, i) => {
        const gx = L + i * gw + gw / 2;
        return (
          <g key={yr}>
            <rect x={gx - bw - 2} y={y(giving[i])} width={bw}
              height={Math.max(0, T + plotH - y(giving[i]))} rx="2" fill={C.spartan} />
            <rect x={gx + 2} y={y(research[i])} width={bw}
              height={Math.max(0, T + plotH - y(research[i]))} rx="2" fill={C.alum} />
            <text x={gx} y={H - 8} textAnchor="middle"
              style={{ font: "600 10px ui-sans-serif, system-ui", fill: C.moss }}>
              FY{String(yr).slice(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function WhitespaceChart({ points, onOpenCompany }) {
  const W = 660, H = 250, L = 54, R = 16, T = 20, B = 36;
  const plotW = W - L - R, plotH = H - T - B;
  const xMax = 4, yMax = 3000000;
  const px = (x) => L + (x / xMax) * plotW;
  const py = (y) => T + plotH - (Math.min(y, yMax) / yMax) * plotH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label="Capability alignment versus research investment by company">
      {[0, 1500000, 3000000].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={py(v)} y2={py(v)} stroke={C.faint} strokeWidth="1" />
          <text x={L - 6} y={py(v) + 3} textAnchor="end"
            style={{ font: "600 9px ui-sans-serif, system-ui", fill: C.moss }}>{money(v)}</text>
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((v) => (
        <text key={v} x={px(v)} y={H - 20} textAnchor="middle"
          style={{ font: "600 9px ui-sans-serif, system-ui", fill: C.moss }}>{v}</text>
      ))}
      <text x={L + plotW / 2} y={H - 6} textAnchor="middle"
        style={{ font: "600 9px ui-sans-serif, system-ui", fill: C.moss }}>
        Capability alignment (matched labs)
      </text>
      <line x1={px(1.5)} x2={px(1.5)} y1={T} y2={T + plotH}
        stroke={C.mist} strokeWidth="1" strokeDasharray="4 4" />
      <line x1={L} x2={W - R} y1={py(150000)} y2={py(150000)}
        stroke={C.mist} strokeWidth="1" strokeDasharray="4 4" />
      <text x={W - R - 4} y={T + 12} textAnchor="end"
        style={{ font: "italic 600 9.5px ui-sans-serif, system-ui", fill: C.fresh }}>
        Model partnerships
      </text>
      <text x={W - R - 4} y={T + plotH - 8} textAnchor="end"
        style={{ font: "italic 600 9.5px ui-sans-serif, system-ui", fill: C.amber }}>
        Whitespace — aligned, underinvested
      </text>
      {points.map((p, i) => {
        const jx = px(p.x) + ((i % 3) - 1) * 9;
        return (
          <g key={p.id} onClick={() => onOpenCompany(p.id)} style={{ cursor: "pointer" }}>
            <circle cx={jx} cy={py(p.y)} r="7"
              fill={p.white ? C.amber : C.spartan} stroke="#fff" strokeWidth="1.5" />
            <text x={jx} y={py(p.y) - 11} textAnchor="middle"
              style={{ font: "600 9.5px ui-sans-serif, system-ui", fill: C.ink }}>{p.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PortfolioView({ onOpenCompany, flagCountOf, onDraftPlan }) {
  const [industry, setIndustry] = useState("all");
  const [focus, setFocus] = useState("all");
  const industries = [...new Set(COMPANIES.map((c) => c.sector))];

  const seg = COMPANIES.filter((c) => {
    if (industry !== "all" && c.sector !== industry) return false;
    if (focus === "all") return true;
    const fa = FOCUS_AREAS.find((f) => f.id === focus);
    const prios = (INTEL[c.id] ? INTEL[c.id].priorities : []).map((p) => p.toLowerCase());
    return fa.match.some((m) => prios.includes(m));
  });

  const sum = (fn) => seg.reduce((s, c) => s + fn(c), 0);
  const researchOf = (c) => YEARS.reduce((s, y) => s + (FINANCIALS[c.id].research[y] || 0), 0);
  const givingTotal = sum((c) => c.lifetime);
  const researchTotal = sum(researchOf);
  const openVal = sum((c) => proposalsOf(c.id).reduce((s, p) => s + p.amount, 0));
  const flagsTotal = sum((c) => flagCountOf(c.id));
  const alumniTotal = sum((c) => (INTEL[c.id] ? INTEL[c.id].alumni.total : 0));
  const seriesG = YEARS.map((y) => sum((c) => FINANCIALS[c.id].giving[y] || 0));
  const seriesR = YEARS.map((y) => sum((c) => FINANCIALS[c.id].research[y] || 0));
  const faLabel = focus === "all" ? "All focus areas" : FOCUS_AREAS.find((f) => f.id === focus).label;

  return (
    <main className="px-4 md:px-7 py-5 max-w-6xl mx-auto">
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: C.spartan }}>
        Portfolio review
      </h1>
      <div className="text-sm mt-1" style={{ color: C.moss }}>
        {seg.length} of {COMPANIES.length} companies · {faLabel} ·{" "}
        {industry === "all" ? "all industries" : industry}
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${FOCUS}`}
          style={{ border: `1px solid ${C.mist}`, background: C.panel, color: C.ink }}
          aria-label="Filter by industry">
          <option value="all">All industries</option>
          {industries.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs ml-1" style={{ color: C.moss }}>Focus:</span>
        <button onClick={() => setFocus("all")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${FOCUS}`}
          style={focus === "all"
            ? { background: C.spartan, color: "#fff" }
            : { border: `1px solid ${C.mist}`, color: C.moss, background: C.panel }}>
          All
        </button>
        {FOCUS_AREAS.map((f) => (
          <button key={f.id} onClick={() => setFocus(f.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${FOCUS}`}
            style={focus === f.id
              ? { background: C.spartan, color: "#fff" }
              : { border: `1px solid ${C.mist}`, color: C.moss, background: C.panel }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {[
          ["Companies", String(seg.length)],
          ["Lifetime giving", money(givingTotal)],
          ["Research FY22–26", money(researchTotal)],
          ["Open proposal value", money(openVal)],
          ["Attention flags", String(flagsTotal)],
          ["MSU alumni", String(alumniTotal)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-4 py-3"
            style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
            <div className="text-xs" style={{ color: C.moss }}>{k}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>

      {/* trend chart */}
      <section className="rounded-xl p-4 mt-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Giving and sponsored research by fiscal year</h2>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: C.moss }}>
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: C.spartan }} /> Giving
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: C.moss }}>
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: C.alum }} /> Sponsored research
            </span>
          </div>
        </div>
        {seg.length === 0 ? (
          <p className="text-xs mt-3" style={{ color: C.moss }}>No companies in this segment.</p>
        ) : (
          <TrendChart giving={seriesG} research={seriesR} />
        )}
        <div className="text-xs mt-1" style={{ color: C.moss }}>
          Aggregated across the selected segment · computed directly from record data — no AI, just arithmetic.
        </div>
      </section>

      {/* research whitespace — leadership view */}
      {(() => {
        const scored = seg.map((c) => ({
          id: c.id,
          name: c.name.split(" ")[0],
          full: c.name,
          x: matchCapabilities(c.id).matches.length,
          y: researchOf(c),
          giving: c.lifetime,
        })).map((p) => ({ ...p, white: p.x >= 1 && p.y < 100000 }));
        const white = scored.filter((p) => p.white)
          .sort((a, b) => b.x - a.x || b.giving - a.giving);
        return (
          <div className="grid lg:grid-cols-5 gap-4 mt-4">
            <section className="lg:col-span-3 rounded-xl p-4"
              style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <h2 className="text-sm font-bold" style={{ color: C.spartan }}>
                Alignment vs. research investment
              </h2>
              {scored.length === 0 ? (
                <p className="text-xs mt-3" style={{ color: C.moss }}>No companies in this segment.</p>
              ) : (
                <WhitespaceChart points={scored} onOpenCompany={onOpenCompany} />
              )}
              <div className="text-xs mt-1" style={{ color: C.moss }}>
                Each dot is a company — click to open. Alignment is on-paper matching against the
                capability catalog; validate with faculty before outreach.
              </div>
            </section>
            <section className="lg:col-span-2 rounded-xl p-4"
              style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Research whitespace</h2>
              <p className="text-xs mt-1" style={{ color: C.moss }}>
                Engaged companies aligned with MSU labs but investing under $100K in research.
              </p>
              {white.length === 0 ? (
                <p className="text-xs mt-3" style={{ color: C.moss }}>
                  No whitespace in this segment — every aligned company has active research investment.
                </p>
              ) : (
                <ul className="mt-2">
                  {white.map((p, i) => (
                    <li key={p.id} className="py-2.5"
                      style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                      <button onClick={() => onOpenCompany(p.id)}
                        className={`text-sm font-semibold text-left ${FOCUS} rounded`}
                        style={{ color: C.spartan }}>
                        {p.full}
                      </button>
                      <div className="text-xs mt-0.5" style={{ color: C.moss }}>
                        {p.x} lab match{p.x > 1 ? "es" : ""} · {money(p.y)} research FY22–26 · {money(p.giving)} lifetime giving
                      </div>
                      <button onClick={() => onDraftPlan(p.id)}
                        className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${FOCUS}`}
                        style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                        <ClipboardList size={12} /> Draft account plan
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="text-xs mt-2 leading-relaxed" style={{ color: C.moss }}>
                Whitespace is a prompt, not a verdict — the plan is the next step, the faculty
                conversation is the test.
              </div>
            </section>
          </div>
        );
      })()}

      {/* segment table */}
      <div className="overflow-x-auto rounded-xl mt-4"
        style={{ border: `1px solid ${C.mist}`, background: C.panel }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs" style={{ color: C.moss }}>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Industry</th>
              <th className="px-4 py-3 font-semibold">Lifetime giving</th>
              <th className="px-4 py-3 font-semibold">Research FY22–26</th>
              <th className="px-4 py-3 font-semibold">Open proposals</th>
              <th className="px-4 py-3 font-semibold">Flags</th>
              <th className="px-4 py-3 font-semibold">Last touch</th>
            </tr>
          </thead>
          <tbody>
            {seg.map((c) => (
              <tr key={c.id} onClick={() => onOpenCompany(c.id)}
                className="cursor-pointer hover:bg-emerald-50"
                style={{ borderTop: `1px solid ${C.faint}` }}>
                <td className="px-4 py-3 font-semibold" style={{ color: C.spartan }}>{c.name}</td>
                <td className="px-4 py-3 text-xs" style={{ color: C.moss }}>{c.sector}</td>
                <td className="px-4 py-3">{money(c.lifetime)}</td>
                <td className="px-4 py-3">{money(researchOf(c))}</td>
                <td className="px-4 py-3">
                  {proposalsOf(c.id).length ? money(proposalsOf(c.id).reduce((s, p) => s + p.amount, 0)) : "—"}
                </td>
                <td className="px-4 py-3">
                  {flagCountOf(c.id) > 0 ? (
                    <span className="text-xs font-bold rounded-full px-2 py-0.5"
                      style={{ background: C.amberBg, color: C.amber }}>{flagCountOf(c.id)}</span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.moss }}>{agoLabel(lastTouchDays(c))}</td>
              </tr>
            ))}
            {seg.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-6 text-xs text-center" style={{ color: C.moss }}>
                No companies match these filters.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-2" style={{ color: C.moss }}>
        Click any row to open the company page.
      </p>
    </main>
  );
}

function PipelineView({ onOpenCompany, onAddGapTasks }) {
  const list = [...PROPOSALS].sort((a, b) => {
    const so = STAGE_META.findIndex((m) => m.key === a.stage) - STAGE_META.findIndex((m) => m.key === b.stage);
    return so !== 0 ? so : daysAgo(b.submitted || b.created) - daysAgo(a.submitted || a.created);
  });
  const total = list.reduce((s, p) => s + p.amount, 0);
  const weighted = list.reduce((s, p) => s + p.amount * stageProb(p.stage), 0);
  const avgDays = Math.round(list.reduce((s, p) => s + daysAgo(p.submitted || p.created), 0) / list.length);
  const gapCount = list.reduce((s, p) => s + proposalChecks(p).filter((k) => !k.ok).length, 0);
  const companyOf = (cid) => COMPANIES.find((c) => c.id === cid);

  return (
    <main className="px-4 md:px-7 py-5 max-w-5xl mx-auto">
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: C.spartan }}>
        Proposal pipeline
      </h1>
      <div className="text-sm mt-1" style={{ color: C.moss }}>
        {list.length} open proposals · strategic readiness checked on every one
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          ["Total pipeline", money(total)],
          ["Weighted by stage", money(Math.round(weighted))],
          ["Avg days open", String(avgDays)],
          ["Readiness gaps", String(gapCount)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-4 py-3"
            style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
            <div className="text-xs" style={{ color: C.moss }}>{k}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>

      {/* stage funnel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {STAGE_META.map((m) => {
          const inStage = list.filter((p) => p.stage === m.key);
          return (
            <div key={m.key} className="rounded-xl px-4 py-2.5"
              style={{ background: C.faint, border: `1px solid ${C.mist}` }}>
              <div className="text-xs font-semibold" style={{ color: C.spartan }}>{m.key}</div>
              <div className="text-xs mt-0.5" style={{ color: C.moss }}>
                {inStage.length} · {money(inStage.reduce((s, p) => s + p.amount, 0))} · {Math.round(m.prob * 100)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* proposal cards */}
      <div className="space-y-4 mt-4">
        {list.map((p) => {
          const c = companyOf(p.companyId);
          const checks = proposalChecks(p);
          const ready = checks.filter((k) => k.ok).length;
          const gaps = checks.filter((k) => !k.ok);
          const open = daysAgo(p.submitted || p.created);
          const closePast = daysAgo(p.expectedClose) > 0;
          const msOver = p.nextMilestone && daysAgo(p.nextMilestone.date) > 0;
          return (
            <section key={p.id} className="rounded-xl p-4"
              style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-bold" style={{ color: C.ink }}>{p.name}</div>
                  <button onClick={() => onOpenCompany(p.companyId)}
                    className={`text-xs font-semibold mt-0.5 ${FOCUS} rounded`}
                    style={{ color: C.spartan }}>
                    {c.name} →
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold" style={{ color: C.spartan }}>{money(p.amount)}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: C.faint, color: C.spartan }}>{p.stage}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: p.submitted && open > 90 ? C.brickBg : C.faint, color: p.submitted && open > 90 ? C.brick : C.moss }}>
                    open {open}d
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: closePast ? C.brickBg : C.faint, color: closePast ? C.brick : C.moss }}>
                    close {fmtMonth(p.expectedClose)}{closePast ? " — passed" : ""}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs">
                <span>
                  <span style={{ color: C.moss }}>Champion: </span>
                  {p.champion
                    ? <span className="font-semibold">{p.champion}</span>
                    : <span className="font-semibold" style={{ color: C.brick }}>none</span>}
                </span>
                <span>
                  <span style={{ color: C.moss }}>Exec sponsor: </span>
                  {p.execSponsor
                    ? <span className="font-semibold">{p.execSponsor}</span>
                    : <span className="font-semibold" style={{ color: C.amber }}>missing</span>}
                </span>
                <span>
                  <span style={{ color: C.moss }}>Engaged: </span>
                  <span className="font-semibold">{(p.engaged || []).length}</span>
                </span>
                {p.alignedPriority && (
                  <span>
                    <span style={{ color: C.moss }}>Tied to: </span>
                    <span className="font-semibold" style={{ color: C.fresh }}>{p.alignedPriority}</span>
                  </span>
                )}
              </div>

              <div className="text-xs mt-2 leading-relaxed"
                style={{ color: p.businessCase ? C.ink : C.amber, fontStyle: "italic" }}>
                {p.businessCase || "No business case on record — why does the company need this?"}
              </div>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1" aria-label={`Readiness ${ready} of 7`}>
                  {checks.map((k, i) => (
                    <span key={i} title={k.ok ? k.label : k.gap}
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ background: k.ok ? C.fresh : C.amberBg, border: `1.5px solid ${k.ok ? C.fresh : C.amber}` }} />
                  ))}
                  <span className="text-xs font-bold ml-1"
                    style={{ color: ready >= 6 ? C.fresh : C.amber }}>{ready}/7</span>
                </div>
                {gaps.map((g) => (
                  <span key={g.gap} className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: C.amberBg, color: C.amber }}>{g.gap}</span>
                ))}
                {gaps.length > 0 && (
                  <button onClick={() => onAddGapTasks(p)}
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${FOCUS}`}
                    style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                    <Plus size={12} /> Add gaps as tasks
                  </button>
                )}
              </div>

              {p.nextMilestone && (
                <div className="text-xs mt-2" style={{ color: msOver ? C.brick : C.moss }}>
                  Next: {p.nextMilestone.text} · {fmtDay(p.nextMilestone.date)}{msOver ? " — overdue" : ""}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p className="text-xs mt-3 leading-relaxed" style={{ color: C.moss }}>
        The structured fields are the strategy: a proposal isn't ready without a champion, an exec
        sponsor, a business case, and a scheduled next step. Every check is deterministic — no AI.
      </p>
    </main>
  );
}

/* --------------------- partner-office lenses --------------------- */

const PROGRAM_COLS = ["Career fair", "Co-op / intern", "Capstone", "Design Day", "Guest lectures", "Tours", "Advisory"];
const programCol = (name) => {
  const n = name.toLowerCase();
  if (n.includes("career")) return 0;
  if (n.includes("co-op") || n.includes("intern")) return 1;
  if (n.includes("capstone")) return 2;
  if (n.includes("design day")) return 3;
  if (n.includes("guest")) return 4;
  if (n.includes("tour") || n.includes("visit")) return 5;
  if (n.includes("advisory")) return 6;
  return -1;
};
const cellStatusOf = (cid, col) => {
  const entries = (ENGAGE[cid] || []).filter((e) => programCol(e.name) === col);
  if (!entries.length) return null;
  return entries.some((e) => daysAgo(e.last) <= 400) ? "active" : "lapsed";
};

function EmployerView({ onOpenCompany, onDraftReport, onCompose }) {
  const cellStatus = cellStatusOf;
  const activeCount = (cid) => PROGRAM_COLS.filter((_, i) => cellStatus(cid, i) === "active").length;
  const placedFY26 = COMPANIES.reduce((s, c) => s + HIRES[c.id].coops + HIRES[c.id].ft, 0);
  const allActive = COMPANIES.reduce((s, c) => s + activeCount(c.id), 0);
  const allLapsed = COMPANIES.reduce((s, c) =>
    s + PROGRAM_COLS.filter((_, i) => cellStatus(c.id, i) === "lapsed").length, 0);
  const hiring = COMPANIES.filter((c) => INTEL[c.id] && INTEL[c.id].hiring);
  const fairFollowUp = COMPANIES.filter((c) => FAIR.status[c.id] !== "Registered");

  return (
    <main className="px-4 md:px-7 py-5 max-w-6xl mx-auto">
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: C.spartan }}>
        Employer services
      </h1>
      <div className="text-sm mt-1" style={{ color: C.moss }}>
        Outcomes, recruiting operations, and the engagement ladder — the career services lens on the same records.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        {[
          ["Students placed FY26", String(placedFY26)],
          ["Active participations", String(allActive)],
          ["Lapsed participations", String(allLapsed)],
          ["Companies hiring", String(hiring.length)],
          ["Fair follow-ups needed", String(fairFollowUp.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-4 py-3"
            style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
            <div className="text-xs" style={{ color: C.moss }}>{k}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>

      {/* participation matrix */}
      <div className="overflow-x-auto rounded-xl mt-4"
        style={{ border: `1px solid ${C.mist}`, background: C.panel }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs" style={{ color: C.moss }}>
              <th className="px-4 py-3 font-semibold">Company</th>
              {PROGRAM_COLS.map((p) => (
                <th key={p} className="px-2 py-3 font-semibold text-center">{p}</th>
              ))}
              <th className="px-3 py-3 font-semibold">Hiring</th>
            </tr>
          </thead>
          <tbody>
            {COMPANIES.map((c) => (
              <tr key={c.id} onClick={() => onOpenCompany(c.id)}
                className="cursor-pointer hover:bg-emerald-50"
                style={{ borderTop: `1px solid ${C.faint}` }}>
                <td className="px-4 py-3 font-semibold" style={{ color: C.spartan }}>{c.name}</td>
                {PROGRAM_COLS.map((_, i) => {
                  const st = cellStatus(c.id, i);
                  return (
                    <td key={i} className="px-2 py-3 text-center">
                      {st ? (
                        <span className="w-2.5 h-2.5 rounded-full inline-block" title={st}
                          style={{ background: st === "active" ? C.fresh : C.amber }} />
                      ) : (
                        <span style={{ color: C.mist }}>—</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-3">
                  {INTEL[c.id] && INTEL[c.id].hiring ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: C.freshBg, color: C.fresh }}>hiring</span>
                  ) : <span className="text-xs" style={{ color: C.moss }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-2 text-xs" style={{ color: C.moss }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: C.fresh }} /> Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: C.amber }} /> Lapsed (13+ months)
        </span>
      </div>

      {/* hiring outcomes & partner reports */}
      <div className="overflow-x-auto rounded-xl mt-4"
        style={{ border: `1px solid ${C.mist}`, background: C.panel }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs" style={{ color: C.moss }}>
              <th className="px-4 py-3 font-semibold">Hiring outcomes</th>
              <th className="px-3 py-3 font-semibold">Co-ops/interns FY26</th>
              <th className="px-3 py-3 font-semibold">Full-time FY26</th>
              <th className="px-3 py-3 font-semibold">3-yr Spartans</th>
              <th className="px-3 py-3 font-semibold">Top majors</th>
              <th className="px-3 py-3 font-semibold">Partner report</th>
            </tr>
          </thead>
          <tbody>
            {COMPANIES.map((c) => {
              const h = HIRES[c.id];
              return (
                <tr key={c.id} style={{ borderTop: `1px solid ${C.faint}` }}>
                  <td className="px-4 py-3">
                    <button onClick={() => onOpenCompany(c.id)}
                      className={`font-semibold ${FOCUS} rounded`} style={{ color: C.spartan }}>
                      {c.name}
                    </button>
                  </td>
                  <td className="px-3 py-3">{h.coops || "—"}</td>
                  <td className="px-3 py-3">{h.ft || "—"}</td>
                  <td className="px-3 py-3 font-semibold">{h.threeYr}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: C.moss }}>{h.majors}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => onDraftReport(c.id, cellStatus)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${FOCUS}`}
                      style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                      <Sparkles size={12} /> Draft talent report
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs mt-2" style={{ color: C.moss }}>
        The partner report is an employer-facing deliverable drafted from these records — their hires,
        their programs, their alumni. Stewardship for the talent relationship.
      </p>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {/* fall fair operations */}
        <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold" style={{ color: C.spartan }}>
              Fall career fair — {FAIR.date}
            </h2>
            <button onClick={() => onCompose(composeCareerServices())}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${FOCUS}`}
              style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
              <Mail size={12} /> Compose handoff
            </button>
          </div>
          <ul className="mt-1">
            {COMPANIES.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between gap-2 py-2"
                style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                <button onClick={() => onOpenCompany(c.id)}
                  className={`text-xs font-semibold truncate text-left ${FOCUS} rounded`}
                  style={{ color: C.spartan }}>
                  {c.name}
                </button>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={fairChip(FAIR.status[c.id])}>{FAIR.status[c.id]}</span>
              </li>
            ))}
          </ul>
          <div className="text-xs mt-2" style={{ color: C.moss }}>
            Registration status is operational data — owned by the recruiting platform, mirrored here
            so relationship context and recruiting ops sit on one screen.
          </div>
        </section>

        {/* engagement ladder */}
        <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
          <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Suggested next rung</h2>
          <p className="text-xs mt-1" style={{ color: C.moss }}>
            Fair → campus presence → co-op → capstone → advisory. First missing rung, computed from participation.
          </p>
          <ul className="mt-1">
            {COMPANIES.map((c, i) => {
              const next = nextRung(c.id, cellStatus);
              const priority = INTEL[c.id] && INTEL[c.id].hiring && activeCount(c.id) < 2;
              return (
                <li key={c.id} className="py-2" style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                  <button onClick={() => onOpenCompany(c.id)}
                    className={`text-xs font-semibold ${FOCUS} rounded`} style={{ color: C.spartan }}>
                    {c.name}
                  </button>
                  <div className="text-xs mt-0.5 flex items-center gap-2 flex-wrap">
                    {next ? (
                      <span style={{ color: next.lapsed ? C.amber : C.ink }}>
                        {next.lapsed ? "Re-establish: " : "Add: "}{next.label}
                      </span>
                    ) : (
                      <span style={{ color: C.fresh }}>Full ladder engaged</span>
                    )}
                    {priority && (
                      <span className="font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: C.amberBg, color: C.amber }}>hiring now — prioritize</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <p className="text-xs mt-3" style={{ color: C.moss }}>
        Same records, career services lens — outcomes and participation credited to the programs that
        own them. Recruiting operations (postings, interviews) stay in the recruiting platform; this
        is the relationship layer above it.
      </p>
    </main>
  );
}

function ResearchView({ onOpenCompany }) {
  const labRows = CAPABILITIES.map((lab) => {
    const aligned = COMPANIES.filter((c) =>
      matchCapabilities(c.id).matches.some((m) => m.name === lab.name));
    const dollars = aligned.reduce((s, c) => s + researchFY(c.id), 0);
    return { lab, aligned, dollars };
  });
  const withAlignment = labRows.filter((r) => r.aligned.length > 0);
  const unfunded = withAlignment.filter((r) => r.dollars === 0);
  const totalResearch = COMPANIES.reduce((s, c) => s + researchFY(c.id), 0);
  const researchProps = PROPOSALS.filter((p) => /research/i.test(p.purpose));

  return (
    <main className="px-4 md:px-7 py-5 max-w-6xl mx-auto">
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: C.spartan }}>
        Research partnerships
      </h1>
      <div className="text-sm mt-1" style={{ color: C.moss }}>
        The lab-centric lens: which faculty have corporate alignment, and whether dollars follow.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[
          ["Research FY22–26", money(totalResearch)],
          ["Labs with alignment", String(withAlignment.length)],
          ["Aligned but unfunded", String(unfunded.length)],
          ["Research proposals open", String(researchProps.length)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl px-4 py-3"
            style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
            <div className="text-xs" style={{ color: C.moss }}>{k}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: C.ink }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl mt-4"
        style={{ border: `1px solid ${C.mist}`, background: C.panel }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs" style={{ color: C.moss }}>
              <th className="px-4 py-3 font-semibold">Lab / program</th>
              <th className="px-4 py-3 font-semibold">Faculty</th>
              <th className="px-4 py-3 font-semibold">Aligned companies</th>
              <th className="px-4 py-3 font-semibold">Research FY22–26</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {labRows.map(({ lab, aligned, dollars }) => (
              <tr key={lab.name} style={{ borderTop: `1px solid ${C.faint}` }}>
                <td className="px-4 py-3">
                  <div className="font-semibold" style={{ color: C.ink }}>{lab.name}</div>
                  <div className="text-xs" style={{ color: C.moss }}>{lab.unit}</div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.moss }}>{lab.contact}</td>
                <td className="px-4 py-3">
                  {aligned.length === 0 ? <span className="text-xs" style={{ color: C.moss }}>—</span> : (
                    <div className="flex flex-wrap gap-1.5">
                      {aligned.map((c) => (
                        <button key={c.id} onClick={() => onOpenCompany(c.id)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${FOCUS}`}
                          style={{ background: C.faint, color: C.spartan }}>
                          {c.name.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{aligned.length ? money(dollars) : "—"}</td>
                <td className="px-4 py-3">
                  {aligned.length === 0 ? (
                    <span className="text-xs" style={{ color: C.moss }}>no alignment yet</span>
                  ) : dollars === 0 ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: C.amberBg, color: C.amber }}>aligned, unfunded</span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: C.freshBg, color: C.fresh }}>active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl p-4 mt-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
        <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Open research proposals</h2>
        {researchProps.map((p) => {
          const c = COMPANIES.find((x) => x.id === p.companyId);
          const ready = proposalChecks(p).filter((k) => k.ok).length;
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <button onClick={() => onOpenCompany(p.companyId)}
                className={`font-semibold ${FOCUS} rounded`} style={{ color: C.spartan }}>
                {c.name}
              </button>
              <span style={{ color: C.moss }}>{p.name} · {money(p.amount)} · {p.stage}</span>
              <span className="font-bold px-2 py-0.5 rounded-full"
                style={{ background: ready >= 6 ? C.freshBg : C.amberBg, color: ready >= 6 ? C.fresh : C.amber }}>
                {ready}/7 ready
              </span>
            </div>
          );
        })}
      </section>
      <p className="text-xs mt-3" style={{ color: C.moss }}>
        Alignment is on-paper matching against the capability catalog — validate with faculty before outreach.
      </p>
    </main>
  );
}

/* --------------------- composers: value without logins ---------------------
   Deterministic, instant, email-ready text. The tool composes what colleagues
   and partners receive in their inbox — nobody needs an account to benefit. */

const todayLabel = () =>
  TODAY.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function composeDigest(tasks) {
  const lines = [];
  COMPANIES.forEach((c) => {
    const fl = [...computeFlags(c), ...taskFlags(tasks[c.id] || [])];
    const due = (tasks[c.id] || []).filter((t) => !t.done && t.due && daysAgo(t.due) > -14);
    const ms = proposalsOf(c.id).filter((p) => p.nextMilestone && daysAgo(p.nextMilestone.date) > -14 && daysAgo(p.nextMilestone.date) <= 0);
    if (!fl.length && !due.length && !ms.length) return;
    lines.push(c.name.toUpperCase());
    fl.forEach((f) => lines.push(`  • Flag: ${f.text}`));
    due.forEach((t) => lines.push(`  • Task due ${fmtDay(t.due)}: ${t.text} (${t.owner})`));
    ms.forEach((p) => lines.push(`  • Milestone ${fmtDay(p.nextMilestone.date)}: ${p.nextMilestone.text} — ${p.name}`));
    lines.push("");
  });
  const fair = COMPANIES.filter((c) => FAIR.status[c.id] !== "Registered");
  if (fair.length) {
    lines.push(`FALL CAREER FAIR FOLLOW-UPS (${FAIR.date})`);
    fair.forEach((c) => lines.push(`  • ${c.name}: ${FAIR.status[c.id]}`));
  }
  return {
    title: "Weekly digest — compose & send",
    text: `Subject: Corporate engagement digest — week of Jul 6, 2026

Team,

This week's portfolio picture:

${lines.join("\n")}

— Composed from Engagement Hub records, ${todayLabel()}`,
  };
}

function composeFacultyIntro(c, m) {
  const iv = INTEL[c.id];
  const ws = WORKSPACE[c.id] || [];
  return {
    title: `Faculty intro — ${m.contact}`,
    text: `Subject: Possible industry alignment — ${c.name} ↔ ${m.name}

Hi ${m.contact},

${c.name} (${c.sector.toLowerCase()}) lists ${m.matched.join(", ")} among their stated technical priorities (company research as of ${iv ? fmtMonth(iv.asOf) : "n/a"}), which looks aligned with your work in the ${m.name}.

Relationship context: MSU partner since ${c.since}, ${money(c.lifetime)} in lifetime giving, ${ws.length ? "active research collaboration already underway" : "no research collaboration yet"}. I manage this relationship for the College of Engineering.

Would you be open to a 30-minute exploratory conversation? I'll set it up and join — no obligation beyond a look.

Bob Irland
Corporate and Foundation Relations, MSU College of Engineering

— Alignment is on-paper tag matching; validate before outreach. Composed from Engagement Hub records, ${todayLabel()}`,
  };
}

function composeCareerServices() {
  const follow = COMPANIES.filter((c) => FAIR.status[c.id] !== "Registered");
  const pri = COMPANIES.filter((c) => INTEL[c.id] && INTEL[c.id].hiring &&
    PROGRAM_COLS.filter((_, i) => cellStatusOf(c.id, i) === "active").length < 2);
  return {
    title: "Career services handoff — compose & send",
    text: `Subject: Fair follow-ups + employer development priorities

Hi team,

From the shared engagement picture on the engineering corporate portfolio:

FALL FAIR (${FAIR.date}) — NOT YET REGISTERED
${follow.map((c) => `  • ${c.name}: ${FAIR.status[c.id]}`).join("\n")}

HIRING NOW, UNDER-ENGAGED — worth prioritizing
${pri.map((c) => `  • ${c.name}: ${INTEL[c.id].talent}`).join("\n") || "  • None currently"}

Happy to make any of these intros — relationship context is on file.

Bob

— Composed from Engagement Hub records, ${todayLabel()}`,
  };
}

function AboutView() {
  const Sec = ({ title, children }) => (
    <section className="rounded-xl p-5 mt-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
      <h2 className="text-sm font-bold" style={{ color: C.spartan }}>{title}</h2>
      <div className="mt-2 text-sm leading-relaxed" style={{ color: C.ink }}>{children}</div>
    </section>
  );
  return (
    <main className="px-4 md:px-7 py-5 max-w-3xl mx-auto">
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: C.spartan }}>
        About this concept
      </h1>
      <div className="text-sm mt-1" style={{ color: C.moss }}>
        A working demonstration — every company, person, lab, and record is fictional.
      </div>

      <Sec title="The problem">
        MSU's relationship with a company runs through giving, sponsored research, recruiting,
        capstone sponsorship, and boards — tracked by different teams in different systems.
        Salesforce holds much of the record but shows it as flat lists: no one screen answers
        "what is our whole relationship with this company, what needs attention, and what should
        happen next." Officers rebuild that picture by hand before every meeting.
      </Sec>

      <Sec title="What this is">
        A company-centric working layer over the systems of record. Salesforce stays the system of
        record; documents stay in SharePoint; the research workspace stays its own system. This hub
        joins them around the company and adds the three things they can't do: the relationship
        graph, deterministic attention flags, and disciplined on-demand AI drafting.
      </Sec>

      <Sec title="Design principles">
        <ul className="space-y-1.5">
          {[
            ["Everything is dated", "every fact carries an as-of date; staleness is shown, never hidden."],
            ["Deterministic first", "flags, matching, readiness checks, and analytics are plain logic — auditable and free to run."],
            ["AI on demand only", "briefs and plans generate when asked, from structured record data, then cache. Modeled inference cost is trivial; the discipline is the point."],
            ["Index, don't store", "documents are links and metadata; files stay in governed storage."],
            ["Draft, review, push", "nothing writes back to Salesforce without a person approving it."],
            ["Drive to external action", "internal insight should end in something a partner can receive — a brief becomes a meeting, an overdue flag becomes a drafted report."],
            ["Value without logins", "the tool composes what colleagues receive in their inbox — a digest, a faculty intro, a handoff. Nobody needs an account to benefit."],
            ["Synthetic until governed", "no real records touch this concept until data governance and access control are approved."],
          ].map(([k, v]) => (
            <li key={k} className="text-sm">
              <span className="font-semibold" style={{ color: C.spartan }}>{k}</span>
              <span style={{ color: C.moss }}> — {v}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title="One dataset, five lenses">
        Company pages for the officer working a relationship. Portfolio review and whitespace for
        leadership. Proposal pipeline for fundraising management. Employer services for career and
        talent partners. Research partnerships for research development. Each office keeps its
        credit and its view; the picture is shared.
      </Sec>

      <Sec title="Phases">
        <ul className="space-y-1.5">
          {[
            ["Phase 1 — Foundation", "company pages and the relationship map, on exported or synthetic data. Semester-sized; this is the buildable core."],
            ["Phase 2 — Intelligence & lenses", "the research import template, capability matching, flags, tasks, documents index, and the partner-office views."],
            ["Phase 3 — Salesforce read", "scheduled read-only sync replaces manual export. Requires sandbox, API access, and IT partnership."],
            ["Phase 4 — Write-back & individual records", "the sync queue goes live; alumni records link at the person level. Requires Advancement IT security review, role-based access, and data governance sign-off."],
          ].map(([k, v]) => (
            <li key={k} className="text-sm">
              <span className="font-semibold" style={{ color: C.spartan }}>{k}</span>
              <span style={{ color: C.moss }}> — {v}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title="How we'd know it works">
        Meeting prep measured in minutes, not hours. Flags resolved instead of relationships going
        quietly stale. Lapsed programs re-engaged. Proposal readiness scores rising before asks go
        out. And the leadership question — "where is our research whitespace?" — answered from data
        in one click instead of anecdote in one month.
      </Sec>

      <div className="text-xs mt-4 leading-relaxed" style={{ color: C.moss }}>
        Prepared by Corporate and Foundation Relations, MSU College of Engineering. This demo runs
        entirely on synthetic data; the AI features call a live model with fictional inputs only.
      </div>
    </main>
  );
}

/* -------------------------- app -------------------------- */

export default function App() {
  const [selectedId, setSelectedId] = useState("m");
  const [view, setView] = useState("companies");
  const [picked, setPicked] = useState(null);
  const [briefs, setBriefs] = useState({});
  const [plans, setPlans] = useState({});
  const [briefOpen, setBriefOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);
  const [loadingKind, setLoadingKind] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tasks, setTasks] = useState(TASKS_SEED);
  const [newTask, setNewTask] = useState("");
  const [q, setQ] = useState("");
  const [syncQueue, setSyncQueue] = useState([]);
  const [syncOpen, setSyncOpen] = useState(false);
  const [reports, setReports] = useState({});
  const [reportOpen, setReportOpen] = useState(false);
  const [reportCid, setReportCid] = useState(null);
  const [impacts, setImpacts] = useState({});
  const [impactOpen, setImpactOpen] = useState(false);
  const [impactCid, setImpactCid] = useState(null);
  const [composer, setComposer] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setTplOpen(false); setBriefOpen(false); setPlanOpen(false); setSyncOpen(false); setReportOpen(false); setImpactOpen(false); setComposer(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const company = COMPANIES.find((c) => c.id === selectedId);
  const flags = useMemo(
    () => [...computeFlags(company), ...taskFlags(tasks[selectedId])],
    [company, tasks, selectedId]
  );
  const intel = INTEL[selectedId];
  const { matches, unmatched } = useMemo(() => matchCapabilities(selectedId), [selectedId]);
  const brief = briefs[selectedId];
  const plan = plans[selectedId];

  const person = PEOPLE.find((p) => p.id === picked);
  const targetPick = picked && picked.startsWith("t-") && intel
    ? intel.targets[Number(picked.split("-")[2])] : null;

  const flagCounts = useMemo(() => {
    const m = {};
    COMPANIES.forEach((c) => (m[c.id] = computeFlags(c).length + taskFlags(tasks[c.id]).length));
    return m;
  }, [tasks]);
  const sorted = [...COMPANIES].sort((a, b) => flagCounts[b.id] - flagCounts[a.id]);
  const visible = sorted.filter((c) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.sector.toLowerCase().includes(s) ||
      PEOPLE.some((p) => p.companyId === c.id && p.name.toLowerCase().includes(s));
  });

  const enqueueSync = (action, cid) => {
    const cName = COMPANIES.find((x) => x.id === cid).name;
    setSyncQueue((s) => [...s, {
      id: `sq${Date.now()}${s.length}`, action,
      target: `${cName} account — Salesforce Activity`, status: "pending",
    }]);
  };
  const toggleTask = (cid, id) => {
    const t = (tasks[cid] || []).find((x) => x.id === id);
    if (t && !t.done) enqueueSync(`Task completed: "${t.text}"`, cid);
    setTasks((s) => ({ ...s, [cid]: s[cid].map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }));
  };
  const addTask = () => {
    const v = newTask.trim();
    if (!v) return;
    setTasks((s) => ({
      ...s,
      [selectedId]: [...(s[selectedId] || []), { id: `nt${Date.now()}`, text: v, owner: "You", due: null, done: false }],
    }));
    enqueueSync(`New task logged: "${v}"`, selectedId);
    setNewTask("");
  };
  const addGapTasks = (p) => {
    const gaps = proposalChecks(p).filter((k) => !k.ok);
    if (!gaps.length) return;
    setTasks((s) => ({
      ...s,
      [p.companyId]: [...(s[p.companyId] || []), ...gaps.map((g, i) => ({
        id: `gt${Date.now()}${i}`, text: `Close readiness gap: ${g.gap} — ${p.name}`,
        owner: "You", due: null, done: false,
      }))],
    }));
    enqueueSync(`${gaps.length} readiness task${gaps.length > 1 ? "s" : ""} logged for "${p.name}"`, p.companyId);
  };
  async function generateReport(cid, cellStatus, force = false) {
    setReportCid(cid);
    setReportOpen(true);
    if (reports[cid] && !force) return;
    setLoadingKind("report");
    const c = COMPANIES.find((x) => x.id === cid);
    try {
      const text = await callModel(reportPrompt(c, cellStatus));
      setReports((s) => ({ ...s, [cid]: { text, offline: false, cellStatus } }));
    } catch {
      setReports((s) => ({ ...s, [cid]: { text: fallbackReport(c, cellStatus), offline: true, cellStatus } }));
    } finally {
      setLoadingKind(null);
    }
  }

  async function generate(kind, force = false, cid = selectedId) {
    const c = COMPANIES.find((x) => x.id === cid);
    const isBrief = kind === "brief";
    (isBrief ? setBriefOpen : setPlanOpen)(true);
    const cache = (isBrief ? briefs : plans)[cid];
    if (cache && !force) return;
    setLoadingKind(kind);
    try {
      const tl = tasks[cid] || [];
      const text = await callModel(isBrief ? briefPrompt(c, tl) : planPrompt(c, tl));
      (isBrief ? setBriefs : setPlans)((s) => ({ ...s, [cid]: { text, offline: false } }));
    } catch {
      const text = isBrief ? fallbackBrief(c) : fallbackPlan(c);
      (isBrief ? setBriefs : setPlans)((s) => ({ ...s, [cid]: { text, offline: true } }));
    } finally {
      setLoadingKind(null);
    }
  }
  async function generateImpact(cid, force = false) {
    setImpactCid(cid);
    setImpactOpen(true);
    if (impacts[cid] && !force) return;
    setLoadingKind("impact");
    const c = COMPANIES.find((x) => x.id === cid);
    try {
      const text = await callModel(impactPrompt(c));
      setImpacts((s) => ({ ...s, [cid]: { text, offline: false } }));
    } catch {
      setImpacts((s) => ({ ...s, [cid]: { text: fallbackImpact(c), offline: true } }));
    } finally {
      setLoadingKind(null);
    }
  }

  const copyText = (t) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const planStamp = intel
    ? `Draft generated ${TODAY.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · company intelligence as of ${fmtMonth(intel.asOf)}${freshness(intel.asOf).key !== "fresh" ? " — refresh inputs before acting" : ""}`
    : "";

  const selectCompany = (id) => {
    setSelectedId(id); setPicked(null); setBriefOpen(false); setPlanOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: C.paper, color: C.ink }}>
      <header className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: C.mist, background: C.panel }}>
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 19, fontWeight: 700, color: C.spartan }}>
            Engineering Corporate Engagement Hub
          </span>
          <span className="hidden sm:inline text-xs" style={{ color: C.moss }}>
            Michigan State University · Corporate Relations
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setComposer(composeDigest(tasks))} aria-label="Compose weekly digest"
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${FOCUS}`}
            style={{ border: `1px solid ${C.mist}`, color: C.spartan, background: C.panel }}>
            <Mail size={13} /> Digest
          </button>
          <button onClick={() => setSyncOpen(true)} aria-label="Open Salesforce sync queue"
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${FOCUS}`}
            style={{ border: `1px solid ${C.mist}`, color: C.spartan, background: C.panel }}>
            <UploadCloud size={13} />
            Sync{syncQueue.filter((x) => x.status === "pending").length
              ? ` · ${syncQueue.filter((x) => x.status === "pending").length}` : ""}
          </button>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: C.faint, color: C.moss, border: `1px solid ${C.mist}` }}>
            Demo · synthetic data only
          </span>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5 px-5 pt-3">
        {[["companies", "Company pages"], ["portfolio", "Portfolio review"], ["pipeline", "Proposal pipeline"], ["employer", "Employer services"], ["research", "Research partnerships"], ["about", "About & roadmap"]].map(([k, label]) => (
          <button key={k} onClick={() => setView(k)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold ${FOCUS}`}
            style={view === k
              ? { background: C.spartan, color: "#fff" }
              : { color: C.moss, border: `1px solid ${C.mist}`, background: C.panel }}>
            {label}
          </button>
        ))}
      </div>

      {view === "companies" && (
      <div className="md:hidden px-4 pt-3">
        <select value={selectedId} onChange={(e) => selectCompany(e.target.value)}
          className={`w-full rounded-lg px-3 py-2 text-sm ${FOCUS}`}
          style={{ border: `1px solid ${C.mist}`, background: C.panel }}
          aria-label="Choose company">
          {sorted.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}{flagCounts[c.id] ? ` — ${flagCounts[c.id]} flag${flagCounts[c.id] > 1 ? "s" : ""}` : ""}
            </option>
          ))}
        </select>
      </div>
      )}

      {view === "companies" ? (
      <div className="flex">
        <aside className="hidden md:block w-72 shrink-0 border-r min-h-screen"
          style={{ borderColor: C.mist, background: C.panel }}>
          <div className="px-4 pt-4 pb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: C.moss }}>
            Portfolio — {COMPANIES.length} companies · {Object.values(flagCounts).reduce((a, b) => a + b, 0)} flags
          </div>
          <div className="px-4 pb-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2" style={{ color: C.moss }} />
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search companies or people"
                aria-label="Search companies or people"
                className={`w-full rounded-lg pl-8 pr-3 py-1.5 text-xs ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, background: C.paper }} />
            </div>
          </div>
          <nav aria-label="Companies">
            {visible.map((c) => {
              const active = c.id === selectedId;
              return (
                <button key={c.id} onClick={() => selectCompany(c.id)}
                  className={`w-full text-left px-4 py-3 ${FOCUS}`}
                  style={{
                    background: active ? C.faint : "transparent",
                    borderLeft: `3px solid ${active ? C.spartan : "transparent"}`,
                  }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold truncate">{c.name}</span>
                    {flagCounts[c.id] > 0 && (
                      <span className="text-xs font-bold rounded-full px-2 py-0.5 shrink-0"
                        style={{ background: C.amberBg, color: C.amber }}>{flagCounts[c.id]}</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: C.moss }}>
                    {c.sector} · last touch {agoLabel(lastTouchDays(c))}
                  </div>
                </button>
              );
            })}
            {visible.length === 0 && (
              <div className="px-4 py-3 text-xs" style={{ color: C.moss }}>No matches for "{q}".</div>
            )}
          </nav>
        </aside>

        <main className="flex-1 px-4 md:px-7 py-5 max-w-5xl">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: C.spartan }}>
                {company.name}
              </h1>
              <div className="text-sm mt-1" style={{ color: C.moss }}>
                {company.sector} · {company.hq} · Relationship since {company.since} · Officer: {company.officer}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => generate("plan", false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${FOCUS}`}
                style={{ border: `1.5px solid ${C.spartan}`, color: C.spartan, background: C.panel }}>
                <ClipboardList size={15} /> Account plan
              </button>
              <button onClick={() => generate("brief", false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white ${FOCUS}`}
                style={{ background: C.spartan }}>
                <Sparkles size={15} /> Brief me
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              ["Lifetime giving", money(company.lifetime)],
              ["Last contact", agoLabel(lastTouchDays(company))],
              ["Open proposals", String(proposalsOf(company.id).length)],
              ["MSU alumni there", intel ? String(intel.alumni.total) : "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl px-4 py-3"
                style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <div className="text-xs" style={{ color: C.moss }}>{k}</div>
                <div className="text-lg font-bold mt-0.5" style={{ color: C.ink }}>{v}</div>
              </div>
            ))}
          </div>

          {flags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4" aria-label="Attention flags">
              {flags.map((f, i) => {
                const Icon = f.icon;
                const hi = f.level === "high";
                return (
                  <span key={i} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: hi ? C.brickBg : C.amberBg, color: hi ? C.brick : C.amber }}>
                    <Icon size={13} /> {f.text}
                  </span>
                );
              })}
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-4 mt-5">
            <div className="lg:col-span-3 space-y-4">
            <section className="rounded-xl p-4"
              style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Relationship map</h2>
                <span className="text-xs" style={{ color: C.moss }}>
                  Solid: engaged · dashed: research targets
                </span>
              </div>
              <RelationshipMap company={company} targets={intel ? intel.targets : []}
                onPick={setPicked} picked={picked} />
              <div className="flex flex-wrap gap-3 pt-1">
                {Object.values(ROLE_META).map((r) => (
                  <span key={r.label} className="flex items-center gap-1.5 text-xs" style={{ color: C.moss }}>
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: r.color }} />
                    {r.label}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 text-xs" style={{ color: C.moss }}>
                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-dashed"
                    style={{ borderColor: C.moss }} />
                  Target — not yet engaged
                </span>
              </div>

              {person && (
                <div className="mt-3 rounded-lg p-3" style={{ background: C.faint, border: `1px solid ${C.mist}` }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">{person.name}
                      <span className="font-normal" style={{ color: C.moss }}> — {person.title}</span>
                    </div>
                    <button onClick={() => setPicked(null)} aria-label="Close person detail"
                      className={`rounded ${FOCUS}`} style={{ color: C.moss }}>
                      <X size={14} />
                    </button>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {person.roles.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full" style={{ background: ROLE_META[r.kind].color }} />
                        <span className="font-medium" style={{ color: ROLE_META[r.kind].color }}>{ROLE_META[r.kind].label}:</span>
                        <span style={{ color: C.ink }}>{r.detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs mt-2 pt-2"
                    style={{
                      borderTop: `1px solid ${C.mist}`,
                      color: person.sf ? (person.sf.status === "linked" ? C.moss : C.amber) : C.moss,
                    }}>
                    {person.sf
                      ? person.sf.status === "linked"
                        ? `Salesforce: linked · Contact ${person.sf.rec} — pulls giving and contact info; engagement pushes back through the sync queue`
                        : "Salesforce: possible match found — review before linking"
                      : "Salesforce: not linked"}
                  </div>
                </div>
              )}

              {targetPick && (
                <div className="mt-3 rounded-lg p-3" style={{ background: C.faint, border: `1px dashed ${C.moss}` }}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">{targetPick.name}
                      <span className="font-normal" style={{ color: C.moss }}> — {targetPick.title}</span>
                    </div>
                    <button onClick={() => setPicked(null)} aria-label="Close target detail"
                      className={`rounded ${FOCUS}`} style={{ color: C.moss }}>
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: C.moss }}>
                    Identified in company research — not yet engaged. Source: {intel.source}, as of {fmtMonth(intel.asOf)}.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Research workspace</h2>
                <span className="text-xs" style={{ color: C.moss }}>Separate system · joined on company</span>
              </div>
              {(WORKSPACE[company.id] || []).length ? (
                <ul className="mt-1">
                  {WORKSPACE[company.id].map((w, i) => (
                    <li key={w.project} className="flex items-center justify-between gap-2 py-2"
                      style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate">{w.project}</div>
                        <div className="text-xs" style={{ color: C.moss }}>
                          {w.faculty} · updated {fmtMonth(w.updated)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={wsStageStyle(w.stage)}>{w.stage}</span>
                        <button aria-label={`Open ${w.project} in research workspace`}
                          title="Opens in the research workspace (demo)"
                          className={`rounded ${FOCUS}`} style={{ color: C.moss }}>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs mt-2" style={{ color: C.moss }}>
                  No active collaboration workspace for this company.
                </p>
              )}
              <div className="text-xs mt-2 leading-relaxed" style={{ color: C.moss }}>
                Live collaboration — projects, milestones, faculty coordination — lives in the
                research workspace. The hub links to it from the company record so the relationship
                view and the working view stay joined.
              </div>
            </section>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Engagement</h2>
                <div className="mt-3 space-y-2.5">
                  {Object.entries(company.lanes).map(([lane, v]) => (
                    <div key={lane} className="flex items-center gap-3">
                      <span className="text-xs w-16" style={{ color: C.moss }}>{lane}</span>
                      <div className="flex gap-1.5 flex-1">
                        {[1, 2, 3].map((i) => (
                          <span key={i} className="h-2 flex-1 rounded-full"
                            style={{ background: i <= v ? C.spartan : C.faint }} />
                        ))}
                      </div>
                      <span className="text-xs w-10 text-right font-medium"
                        style={{ color: v === 0 ? C.amber : C.moss }}>
                        {v === 0 ? "quiet" : v === 3 ? "high" : v === 2 ? "med" : "low"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-semibold mt-4 mb-1" style={{ color: C.moss }}>
                  Programs
                </div>
                <ul>
                  {(ENGAGE[company.id] || []).map((e, i) => {
                    const st = engStatus(e.last);
                    return (
                      <li key={e.name} className="flex items-center justify-between gap-2 py-1.5"
                        style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{e.name}</div>
                          <div className="text-xs" style={{ color: C.moss }}>
                            since {e.since} · last {fmtMonth(e.last)}{e.note ? ` · ${e.note}` : ""}
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </li>
                    );
                  })}
                  {(ENGAGE[company.id] || []).length === 0 && (
                    <li className="text-xs py-1.5" style={{ color: C.moss }}>No program participation recorded.</li>
                  )}
                </ul>
                <div className="text-xs mt-2" style={{ color: C.moss }}>
                  What's behind the lane bars — shared visibility for career services and program partners.
                </div>
              </section>

              <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Open proposals</h2>
                {proposalsOf(company.id).length === 0 ? (
                  <p className="text-xs mt-2" style={{ color: C.moss }}>
                    None open. Lifetime giving stands at {money(company.lifetime)}.
                  </p>
                ) : proposalsOf(company.id).map((p) => {
                  const open = daysAgo(p.submitted || p.created);
                  const checks = proposalChecks(p);
                  const ready = checks.filter((k) => k.ok).length;
                  return (
                    <div key={p.id} className="mt-3">
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs flex-wrap" style={{ color: C.moss }}>
                        <span>{money(p.amount)} · {p.stage}</span>
                        <span className="px-2 py-0.5 rounded-full font-bold"
                          style={{ background: p.submitted && open > 90 ? C.brickBg : C.faint, color: p.submitted && open > 90 ? C.brick : C.moss }}>
                          open {open}d
                        </span>
                        <span className="px-2 py-0.5 rounded-full font-bold"
                          style={{ background: ready >= 6 ? C.freshBg : C.amberBg, color: ready >= 6 ? C.fresh : C.amber }}>
                          {ready}/7 ready
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="text-xs mt-2" style={{ color: C.moss }}>
                  Readiness detail lives in the Proposal pipeline view.
                </div>
              </section>

              <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Tasks & next steps</h2>
                  <span className="text-xs" style={{ color: C.moss }}>
                    {(tasks[company.id] || []).filter((t) => !t.done).length} open
                  </span>
                </div>
                <ul className="mt-1">
                  {(tasks[company.id] || []).map((t, i) => {
                    const over = !t.done && t.due && daysAgo(t.due) > 0;
                    return (
                      <li key={t.id} className="flex gap-2.5 py-2 items-start"
                        style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                        <button onClick={() => toggleTask(company.id, t.id)}
                          aria-label={t.done ? `Reopen task: ${t.text}` : `Complete task: ${t.text}`}
                          className={`shrink-0 ${FOCUS}`}
                          style={{
                            width: 16, height: 16, marginTop: 2, borderRadius: 4,
                            border: `1.5px solid ${t.done ? C.fresh : C.moss}`,
                            background: t.done ? C.fresh : "transparent",
                            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                          {t.done && <Check size={11} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs leading-snug"
                            style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? C.moss : C.ink }}>
                            {t.text}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: over ? C.brick : C.moss }}>
                            {t.owner}{t.due ? ` · due ${fmtDay(t.due)}` : ""}{over ? " · overdue" : ""}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex gap-2 mt-2">
                  <input value={newTask} onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="Add a next step…" aria-label="Add a task"
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs ${FOCUS}`}
                    style={{ border: `1px solid ${C.mist}`, background: C.paper }} />
                  <button onClick={addTask} aria-label="Add task"
                    className={`px-2.5 rounded-lg ${FOCUS}`}
                    style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-xs mt-2" style={{ color: C.moss }}>
                  Open tasks past due feed the attention flags — completing one clears it.
                </div>
              </section>

              <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Documents</h2>
                  <span className="text-xs" style={{ color: C.moss }}>Indexed — files stay where they live</span>
                </div>
                <ul className="mt-2">
                  {(DOCS[company.id] || []).map((d, i) => {
                    const T = DOC_TYPES[d.type];
                    const Icon = T.icon;
                    return (
                      <li key={d.title} className="flex gap-2.5 py-2 items-start"
                        style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                        <Icon size={15} style={{ color: C.moss, marginTop: 2 }} className="shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium leading-snug">{d.title}</div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs" style={{ color: C.moss }}>
                              {T.label}
                              {d.date ? ` · ${fmtMonth(d.date)}` : d.dueDate ? ` · due ${fmtMonth(d.dueDate)}` : ""}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={docStatusStyle(d.status)}>{d.status}</span>
                          </div>
                        </div>
                        {d.type === "report" && d.dueDate && (
                          <button onClick={() => generateImpact(company.id)}
                            aria-label={`Draft ${d.title}`}
                            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 ${FOCUS}`}
                            style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                            <Sparkles size={11} /> Draft
                          </button>
                        )}
                        <button aria-label={`Open ${d.title}`} title="Opens in source folder (demo)"
                          className={`rounded shrink-0 ${FOCUS}`} style={{ color: C.moss }}>
                          <ExternalLink size={13} />
                        </button>
                      </li>
                    );
                  })}
                  {(DOCS[company.id] || []).length === 0 && (
                    <li className="text-xs py-2" style={{ color: C.moss }}>No documents indexed yet.</li>
                  )}
                </ul>
                <div className="text-xs mt-2 leading-relaxed" style={{ color: C.moss }}>
                  Links and metadata only — no copies. Reports with due dates feed the attention flags.
                </div>
              </section>

              <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold" style={{ color: C.spartan }}>External deliverables</h2>
                  <span className="text-xs" style={{ color: C.moss }}>Driving to partner-facing action</span>
                </div>
                <ul className="mt-1">
                  <li className="flex items-center justify-between gap-2 py-2">
                    <div>
                      <div className="text-xs font-medium">Impact report</div>
                      <div className="text-xs" style={{ color: C.moss }}>Letterhead stewardship draft from record data</div>
                    </div>
                    <button onClick={() => generateImpact(company.id)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${FOCUS}`}
                      style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                      <Sparkles size={12} /> Draft
                    </button>
                  </li>
                  <li className="flex items-center justify-between gap-2 py-2"
                    style={{ borderTop: `1px solid ${C.faint}` }}>
                    <div>
                      <div className="text-xs font-medium">Talent partnership report</div>
                      <div className="text-xs" style={{ color: C.moss }}>Their hires, programs, and alumni — written to them</div>
                    </div>
                    <button onClick={() => generateReport(company.id, cellStatusOf)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${FOCUS}`}
                      style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                      <Sparkles size={12} /> Draft
                    </button>
                  </li>
                  <li className="flex items-center justify-between gap-2 py-2"
                    style={{ borderTop: `1px solid ${C.faint}` }}>
                    <div>
                      <div className="text-xs font-medium">Partner microsite</div>
                      <div className="text-xs" style={{ color: C.moss }}>Living web view of the partnership, from the same records</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: C.faint, color: C.moss }}>phase 3 roadmap</span>
                  </li>
                </ul>
              </section>

              <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Recent activity</h2>
                <ul className="mt-2">
                  {company.activities.slice(0, 5).map((a, i) => {
                    const Icon = ACT_ICON[a.type];
                    return (
                      <li key={i} className="flex gap-2.5 py-2"
                        style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                        <Icon size={15} style={{ color: C.moss, marginTop: 2 }} className="shrink-0" />
                        <div>
                          <div className="text-xs leading-snug">{a.text}</div>
                          <div className="text-xs mt-0.5" style={{ color: C.moss }}>{agoLabel(daysAgo(a.date))}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mt-4">
            <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>Company intelligence</h2>
                <div className="flex items-center gap-2">
                  {intel && <AsOfPill iso={intel.asOf} />}
                  <button onClick={() => setTplOpen(true)}
                    className={`flex items-center gap-1 text-xs font-semibold rounded px-1 ${FOCUS}`}
                    style={{ color: C.spartan }}>
                    <Upload size={12} /> Import template
                  </button>
                </div>
              </div>
              {intel ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.moss }}>
                      <Target size={12} /> Technical priorities
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {intel.priorities.map((p) => (
                        <span key={p} className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: C.faint, color: C.ink, border: `1px solid ${C.mist}` }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.moss }}>
                      <TrendingUp size={12} /> Talent trend
                    </div>
                    <p className="text-xs mt-1 leading-relaxed">{intel.talent}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.moss }}>
                      <MapPin size={12} /> Locations
                    </div>
                    <p className="text-xs mt-1">{intel.locations.join(" · ")}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.moss }}>
                      <GraduationCap size={12} /> MSU alumni
                    </div>
                    <p className="text-xs mt-1">
                      <span className="font-bold">{intel.alumni.total}</span> total ·{" "}
                      <span className="font-bold">{intel.alumni.senior}</span> in senior roles
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.moss }}>
                      <Users2 size={12} /> Target contacts — not yet engaged
                    </div>
                    <ul className="mt-1 space-y-1">
                      {intel.targets.map((t) => (
                        <li key={t.name} className="text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full border border-dashed" style={{ borderColor: C.moss }} />
                          <span className="font-medium">{t.name}</span>
                          <span style={{ color: C.moss }}>{t.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs mt-2" style={{ color: C.moss }}>
                  No intelligence imported yet. Use the standard research template to add it.
                </p>
              )}
            </section>

            <section className="rounded-xl p-4" style={{ background: C.panel, border: `1px solid ${C.mist}` }}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold" style={{ color: C.spartan }}>MSU capability alignment</h2>
                <span className="text-xs" style={{ color: C.moss }}>On paper — validate with faculty</span>
              </div>
              {matches.length === 0 ? (
                <p className="text-xs mt-2" style={{ color: C.moss }}>No mapped matches from the capability catalog yet.</p>
              ) : (
                <ul className="mt-2">
                  {matches.map((m, i) => (
                    <li key={m.name} className="py-2.5" style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                      <div className="text-sm font-semibold">{m.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.moss }}>{m.unit} · {m.contact}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {m.matched.map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: C.freshBg, color: C.fresh }}>{t}</span>
                        ))}
                      </div>
                      <button onClick={() => setComposer(composeFacultyIntro(company, m))}
                        className={`mt-1.5 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${FOCUS}`}
                        style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                        <Mail size={12} /> Compose faculty intro
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {unmatched.length > 0 && (
                <div className="mt-3 text-xs rounded-lg px-3 py-2"
                  style={{ background: C.amberBg, color: C.amber }}>
                  No mapped MSU capability yet: {unmatched.join(", ")}
                </div>
              )}
              <div className="mt-3 text-xs" style={{ color: C.moss }}>
                Matching is deterministic tag overlap — no AI. Capability catalog maintained by corporate relations, refreshed spring 2026.
              </div>
            </section>
          </div>
        </main>
      </div>
      ) : view === "portfolio" ? (
        <PortfolioView onOpenCompany={(id) => { selectCompany(id); setView("companies"); }}
          flagCountOf={(id) => flagCounts[id] || 0}
          onDraftPlan={(id) => { selectCompany(id); setView("companies"); generate("plan", false, id); }} />
      ) : view === "pipeline" ? (
        <PipelineView onOpenCompany={(id) => { selectCompany(id); setView("companies"); }}
          onAddGapTasks={addGapTasks} />
      ) : view === "employer" ? (
        <EmployerView onOpenCompany={(id) => { selectCompany(id); setView("companies"); }}
          onDraftReport={generateReport} onCompose={(t) => setComposer(t)} />
      ) : view === "research" ? (
        <ResearchView onOpenCompany={(id) => { selectCompany(id); setView("companies"); }} />
      ) : (
        <AboutView />
      )}

      <SlideOver open={briefOpen} onClose={() => setBriefOpen(false)} title={`Meeting brief — ${company.name}`}>
        {loadingKind === "brief" ? (
          <div className="flex items-center gap-2 text-sm py-8 justify-center" style={{ color: C.moss }}>
            <Loader2 size={16} className="animate-spin" /> Generating from record data…
          </div>
        ) : brief ? (
          <>
            <GeneratedText text={brief.text} titles={BRIEF_TITLES} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyText(brief.text)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => generate("brief", true)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                <RefreshCw size={13} /> Regenerate
              </button>
            </div>
            <div className="mt-4 text-xs rounded-lg px-3 py-2.5 leading-relaxed"
              style={{ background: C.faint, color: C.moss }}>
              {brief.offline
                ? "Sample brief composed locally — the model API was unreachable. In the product, generation uses a low-cost model tier."
                : "Generated on demand from the structured record only, then cached — nothing regenerates unless you ask or the record changes."}
            </div>
          </>
        ) : null}
      </SlideOver>

      <SlideOver open={planOpen} onClose={() => setPlanOpen(false)} title={`Account plan (draft) — ${company.name}`}>
        {loadingKind === "plan" ? (
          <div className="flex items-center gap-2 text-sm py-8 justify-center" style={{ color: C.moss }}>
            <Loader2 size={16} className="animate-spin" /> Drafting from record, intelligence, and capability data…
          </div>
        ) : plan ? (
          <>
            <div className="text-xs rounded-lg px-3 py-2 mb-3 font-medium"
              style={{
                background: intel && freshness(intel.asOf).key !== "fresh" ? C.amberBg : C.faint,
                color: intel && freshness(intel.asOf).key !== "fresh" ? C.amber : C.moss,
              }}>
              {planStamp}
            </div>
            <GeneratedText text={plan.text} titles={PLAN_TITLES} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyText(plan.text)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => generate("plan", true)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                <RefreshCw size={13} /> Regenerate
              </button>
            </div>
            <div className="mt-4 text-xs rounded-lg px-3 py-2.5 leading-relaxed"
              style={{ background: C.faint, color: C.moss }}>
              {plan.offline
                ? "Sample plan composed locally — the model API was unreachable. In the product, generation uses a low-cost model tier."
                : "A rough draft assembled from relationship history, imported intelligence, and the capability catalog — a starting point for the officer, not a finished strategy. Generated on demand and cached."}
            </div>
          </>
        ) : null}
      </SlideOver>

      <SlideOver open={syncOpen} onClose={() => setSyncOpen(false)} title="Salesforce sync queue — simulated">
        <div className="text-xs rounded-lg px-3 py-2.5 leading-relaxed mb-3"
          style={{ background: C.faint, color: C.moss }}>
          Draft → review → push. Changes queue as drafts; nothing writes to Salesforce without a
          person approving it. This demo has no Salesforce connection — the queue shows the
          governance pattern, not a live sync. Real write-back is a later phase and requires
          Advancement IT security review.
        </div>
        {syncQueue.length === 0 ? (
          <p className="text-sm" style={{ color: C.moss }}>
            Nothing pending. Completing or adding a task queues a draft write here.
          </p>
        ) : (
          <ul>
            {syncQueue.map((it, i) => (
              <li key={it.id} className="py-2.5" style={{ borderTop: i ? `1px solid ${C.faint}` : "none" }}>
                <div className="text-xs font-medium">{it.action}</div>
                <div className="text-xs mt-0.5" style={{ color: C.moss }}>{it.target}</div>
                <div className="mt-1.5">
                  {it.status === "pending" ? (
                    <button
                      onClick={() => setSyncQueue((s) => s.map((x) => x.id === it.id ? { ...x, status: "approved" } : x))}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${FOCUS}`}
                      style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                      Approve draft (simulated)
                    </button>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: C.freshBg, color: C.fresh }}>
                      Approved — would write on next sync
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SlideOver>

      <SlideOver open={reportOpen} onClose={() => setReportOpen(false)}
        title={`Talent partnership report — ${reportCid ? COMPANIES.find((c) => c.id === reportCid).name : ""}`}>
        {loadingKind === "report" ? (
          <div className="flex items-center gap-2 text-sm py-8 justify-center" style={{ color: C.moss }}>
            <Loader2 size={16} className="animate-spin" /> Drafting from talent records…
          </div>
        ) : reportCid && reports[reportCid] ? (
          <>
            <GeneratedText text={reports[reportCid].text} titles={REPORT_TITLES} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyText(reports[reportCid].text)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => generateReport(reportCid, reports[reportCid].cellStatus, true)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                <RefreshCw size={13} /> Regenerate
              </button>
            </div>
            <div className="mt-4 text-xs rounded-lg px-3 py-2.5 leading-relaxed"
              style={{ background: C.faint, color: C.moss }}>
              {reports[reportCid].offline
                ? "Sample report composed locally — the model API was unreachable."
                : "An employer-facing stewardship draft, written to the company from their own talent records. Review before sending — generated on demand and cached."}
            </div>
          </>
        ) : null}
      </SlideOver>

      <SlideOver open={impactOpen} onClose={() => setImpactOpen(false)}
        title={`Impact report — ${impactCid ? COMPANIES.find((c) => c.id === impactCid).name : ""}`}>
        {loadingKind === "impact" ? (
          <div className="flex items-center gap-2 text-sm py-8 justify-center" style={{ color: C.moss }}>
            <Loader2 size={16} className="animate-spin" /> Drafting from giving, program, and research records…
          </div>
        ) : impactCid && impacts[impactCid] ? (
          <>
            <div className="rounded-lg p-5" style={{ background: "#fff", border: `1px solid ${C.mist}` }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, color: C.spartan, letterSpacing: 1 }}>
                MICHIGAN STATE UNIVERSITY
              </div>
              <div className="text-xs mt-0.5 pb-3 mb-3" style={{ color: C.moss, borderBottom: `2px solid ${C.spartan}` }}>
                College of Engineering · Corporate and Foundation Relations
              </div>
              <GeneratedText text={impacts[impactCid].text} titles={IMPACT_TITLES} />
              <div className="text-xs mt-3 pt-2" style={{ color: C.moss, borderTop: `1px solid ${C.mist}` }}>
                Prepared July 2026 · Michigan State University College of Engineering
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyText(impacts[impactCid].text)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => generateImpact(impactCid, true)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                <RefreshCw size={13} /> Regenerate
              </button>
            </div>
            <div className="mt-4 text-xs rounded-lg px-3 py-2.5 leading-relaxed"
              style={{ background: C.faint, color: C.moss }}>
              {impacts[impactCid].offline
                ? "Sample report composed locally — the model API was unreachable."
                : "A letterhead stewardship draft from the company's own records — gifts, programs, Spartans hired, research underway. Review before sending. In the build, this exports to PDF in one click; drafting it also clears the report-due flag once sent."}
            </div>
          </>
        ) : null}
      </SlideOver>

      <SlideOver open={!!composer} onClose={() => setComposer(null)}
        title={composer ? composer.title : ""}>
        {composer && (
          <>
            <div className="rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap"
              style={{ background: C.faint, border: `1px solid ${C.mist}`, color: C.ink }}>
              {composer.text}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => copyText(composer.text)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${FOCUS}`}
                style={{ border: `1px solid ${C.mist}`, color: C.spartan }}>
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-4 text-xs rounded-lg px-3 py-2.5 leading-relaxed"
              style={{ background: C.faint, color: C.moss }}>
              Composed deterministically from record data — instant, no AI. Paste into your own
              email: the value reaches colleagues and partners who never open this tool.
            </div>
          </>
        )}
      </SlideOver>

      {tplOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog"
          aria-label="Intelligence import template">
          <div className="absolute inset-0" style={{ background: "rgba(15,43,36,0.4)" }}
            onClick={() => setTplOpen(false)} />
          <div className="relative rounded-xl shadow-2xl max-w-lg w-full p-5 max-h-full overflow-y-auto"
            style={{ background: C.panel }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm" style={{ color: C.spartan }}>Standard intelligence import</h2>
              <button onClick={() => setTplOpen(false)} aria-label="Close template"
                className={`p-1 rounded ${FOCUS}`} style={{ color: C.moss }}>
                <X size={16} />
              </button>
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: C.moss }}>
              Company research the team already produces, standardized into one template and imported
              quarterly. Every field carries its own as-of date, so the hub can show freshness instead
              of letting information go quietly stale.
            </p>
            <pre className="text-xs rounded-lg p-3 mt-3 overflow-x-auto leading-relaxed"
              style={{ background: C.faint, border: `1px solid ${C.mist}`, color: C.ink }}>
{`{
  "company": "Meridian Mobility Group",
  "as_of": "2026-06-05",
  "source": "Quarterly research template",
  "fields": {
    "technical_priorities": ["...", "..."],
    "talent_trend": "...",
    "locations": ["City, ST (role)"],
    "msu_alumni": { "total": 0, "senior": 0 },
    "target_contacts": [
      { "name": "...", "title": "..." }
    ]
  }
}`}
            </pre>
            <p className="text-xs mt-3 leading-relaxed" style={{ color: C.moss }}>
              Fields updated individually keep their own as-of dates. Anything older than a year is
              flagged stale on the company page and in generated plans.
            </p>
          </div>
        </div>
      )}

      <footer className="px-5 py-4 text-xs border-t mt-2" style={{ borderColor: C.mist, color: C.moss }}>
        Demo of the Engineering Corporate Engagement Hub concept · All companies, people, labs, and records are fictional and synthetic · Prepared by Corporate and Foundation Relations, MSU College of Engineering
      </footer>
    </div>
  );
}
