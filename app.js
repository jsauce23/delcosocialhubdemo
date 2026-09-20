/* ===========================================================================
   DELCO SOCIAL HUB — DEMONSTRATION BUILD
   ---------------------------------------------------------------------------
   Everything in this build is sample data. It is not connected to DELCO's
   Instagram, Facebook or TikTok accounts, and nothing posted here goes
   anywhere. Prepared by Around SA Marketing for evaluation only.
   =========================================================================== */
const { useState, useMemo, useEffect } = React;

/* --- icons -------------------------------------------------------------- */
/* Rendered from the lucide icon set loaded on the page. Falls back to a dot
   if a name is ever missing, so a typo can never blank the interface. */
function iconNode(name) {
  var lib = window.lucide || {};
  var set = lib.icons || lib;
  return set[name] || set[name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()] || null;
}
function makeIcon(name) {
  return function Icon(props) {
    var size = props.size || 16;
    var node = iconNode(name);
    var kids = node
      ? node.map(function (c, i) {
          return React.createElement(c[0], Object.assign({ key: i }, c[1]));
        })
      : [React.createElement("circle", { key: 0, cx: 12, cy: 12, r: 4 })];
    return React.createElement("svg", {
      width: size, height: size, viewBox: "0 0 24 24", fill: "none",
      stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round",
      strokeLinejoin: "round", style: props.style, className: props.className,
    }, kids);
  };
}
const LayoutDashboard = makeIcon("LayoutDashboard"), CalendarDays = makeIcon("CalendarDays"),
  Sparkles = makeIcon("Sparkles"), Inbox = makeIcon("Inbox"), Images = makeIcon("Images"),
  BarChart3 = makeIcon("BarChart3"), Palette = makeIcon("Palette"),
  SettingsIcon = makeIcon("Settings"), Search = makeIcon("Search"), Bell = makeIcon("Bell"),
  Plus = makeIcon("Plus"), Upload = makeIcon("Upload"), Lightbulb = makeIcon("Lightbulb"),
  Clock = makeIcon("Clock"), Instagram = makeIcon("Instagram"), Facebook = makeIcon("Facebook"),
  Music2 = makeIcon("Music2"), Check = makeIcon("Check"), ChevronRight = makeIcon("ChevronRight"),
  ChevronLeft = makeIcon("ChevronLeft"), X = makeIcon("X"), Camera = makeIcon("Camera"),
  Video = makeIcon("Video"), FileText = makeIcon("FileText"), ImageIcon = makeIcon("Image"),
  Send = makeIcon("Send"), MessageSquare = makeIcon("MessageSquare"), Download = makeIcon("Download"),
  Share2 = makeIcon("Share2"), Wand2 = makeIcon("Wand2"), RefreshCw = makeIcon("RefreshCw"),
  Lock = makeIcon("Lock"), Menu = makeIcon("Menu"), Dog = makeIcon("Dog"), MapPin = makeIcon("MapPin"),
  Phone = makeIcon("Phone"), ArrowUpRight = makeIcon("ArrowUpRight"), AlertCircle = makeIcon("AlertCircle"),
  CheckCircle2 = makeIcon("CircleCheckBig"), CircleDashed = makeIcon("CircleDashed"),
  Paperclip = makeIcon("Paperclip"), User = makeIcon("User"), Users = makeIcon("Users"),
  Filter = makeIcon("Filter"), Play = makeIcon("Play"), Star = makeIcon("Star");

/* --- charts, drawn directly so the demo has no charting dependency ------- */
function chartBox(height) { return { w: 620, h: height, pad: { l: 34, r: 8, t: 10, b: 22 } }; }
function scaleY(vals, box) {
  var max = Math.max.apply(null, vals) * 1.1, min = 0;
  var inner = box.h - box.pad.t - box.pad.b;
  return function (v) { return box.pad.t + inner - ((v - min) / (max - min)) * inner; };
}
function gridLines(box, y, max) {
  var out = [], inner = box.h - box.pad.t - box.pad.b;
  for (var i = 0; i <= 3; i++) {
    var yy = box.pad.t + (inner / 3) * i;
    out.push(React.createElement("line", { key: "g" + i, x1: box.pad.l, x2: box.w - box.pad.r,
      y1: yy, y2: yy, stroke: T.line, strokeDasharray: "3 3" }));
    out.push(React.createElement("text", { key: "t" + i, x: box.pad.l - 6, y: yy + 4,
      textAnchor: "end", fontSize: 10, fill: T.muted },
      Math.round(max * (1 - i / 3)).toLocaleString()));
  }
  return out;
}
function xLabels(data, box) {
  var step = Math.ceil(data.length / 6);
  return data.map(function (d, i) {
    if (i % step) return null;
    var x = box.pad.l + ((box.w - box.pad.l - box.pad.r) / (data.length - 1 || 1)) * i;
    return React.createElement("text", { key: i, x: x, y: box.h - 6, textAnchor: "middle",
      fontSize: 10, fill: T.muted }, d.d);
  });
}
function points(data, k, box, y) {
  var span = (box.w - box.pad.l - box.pad.r) / (data.length - 1 || 1);
  return data.map(function (d, i) { return [box.pad.l + span * i, y(d[k])]; });
}
function Frame({ box, children }) {
  return React.createElement("svg", { viewBox: "0 0 " + box.w + " " + box.h,
    style: { width: "100%", height: "auto", display: "block" } }, children);
}
function AreaChartSVG({ data, k, height }) {
  var box = chartBox(height), max = Math.max.apply(null, data.map(function (d) { return d[k]; })) * 1.1;
  var y = scaleY(data.map(function (d) { return d[k]; }), box), p = points(data, k, box, y);
  var line = p.map(function (q) { return q[0] + "," + q[1]; }).join(" ");
  var fill = line + " " + p[p.length - 1][0] + "," + (box.h - box.pad.b) + " " + p[0][0] + "," + (box.h - box.pad.b);
  return React.createElement(Frame, { box: box }, [
    gridLines(box, y, max), xLabels(data, box),
    React.createElement("polygon", { key: "f", points: fill, fill: T.coolSoft }),
    React.createElement("polyline", { key: "l", points: line, fill: "none", stroke: T.cool, strokeWidth: 2.5 }),
  ]);
}
function LineChartSVG({ data, series, height }) {
  var box = chartBox(height);
  var all = [];
  series.forEach(function (s) { data.forEach(function (d) { all.push(d[s.k]); }); });
  var max = Math.max.apply(null, all) * 1.1, y = scaleY(all, box);
  return React.createElement("div", null, [
    React.createElement(Frame, { box: box, key: "c" }, [
      gridLines(box, y, max), xLabels(data, box),
      series.map(function (s, i) {
        return React.createElement("polyline", { key: s.k, fill: "none", stroke: s.color, strokeWidth: 2.5,
          points: points(data, s.k, box, y).map(function (q) { return q[0] + "," + q[1]; }).join(" ") });
      }),
    ]),
    React.createElement("div", { key: "k", className: "flex flex-wrap gap-4 mt-2 justify-center" },
      series.map(function (s) {
        return React.createElement("span", { key: s.k, className: "flex items-center gap-1.5 text-xs",
          style: { color: T.body } }, [
          React.createElement("span", { key: "d", style: { width: 10, height: 3, background: s.color, borderRadius: 2 } }),
          s.label,
        ]);
      })),
  ]);
}
function BarChartSVG({ data, k, height }) {
  var box = chartBox(height), vals = data.map(function (d) { return d[k]; });
  var max = Math.max.apply(null, vals) * 1.1, y = scaleY(vals, box);
  var span = (box.w - box.pad.l - box.pad.r) / data.length, bw = Math.min(46, span * 0.55);
  return React.createElement(Frame, { box: box }, [
    gridLines(box, y, max), xLabels(data, box),
    data.map(function (d, i) {
      var x = box.pad.l + span * i + (span - bw) / 2;
      return React.createElement("rect", { key: i, x: x, y: y(d[k]), width: bw,
        height: (box.h - box.pad.b) - y(d[k]), fill: T.warm, rx: 4 });
    }),
  ]);
}

/* --- demo notices ------------------------------------------------------- */
function DemoBanner() {
  return (
    <div className="px-4 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
      style={{ background: T.navy, borderBottom: `2px solid ${T.gold}` }}>
      <span className="text-xs font-bold tracking-wide px-2 py-0.5 rounded"
        style={{ background: T.gold, color: T.navy }}>DEMO</span>
      <span className="text-xs" style={{ color: "#DCE7F5" }}>
        Sample data only. Not connected to DELCO's Instagram, Facebook or TikTok — nothing here posts anywhere.
      </span>
    </div>
  );
}
function DemoFooter() {
  return (
    <div className="mt-10 pt-5 text-center" style={{ borderTop: `1px solid ${T.line}` }}>
      <p className="text-xs" style={{ color: T.muted, lineHeight: 1.6 }}>
        Demonstration build · All content, numbers and activity shown are fictional examples.<br />
        Prepared by Around SA Marketing for DELCO Heating &amp; Cooling. Not licensed for business use.
      </p>
    </div>
  );
}
function DemoNotice({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(11,27,51,.6)" }}>
      <div className="rounded-2xl w-full max-w-lg overflow-hidden"
        style={{ background: T.surface, boxShadow: shadowLift }}>
        <div className="px-6 py-5" style={{ background: T.navy }}>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-wide px-2 py-1 rounded"
              style={{ background: T.gold, color: T.navy }}>DEMO</span>
            <h2 className="text-lg font-semibold" style={{ color: "#fff" }}>This is a demonstration</h2>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm" style={{ color: T.ink, lineHeight: 1.6 }}>
            You're looking at a working preview of DELCO Social Hub. Click around freely — every screen is live.
          </p>
          <ul className="space-y-2">
            {["Every post, photo, request and number is a made-up example.",
              "Nothing is connected to DELCO's real social accounts.",
              "Nothing you do here posts, sends or changes anything.",
              "The AI studio simulates its results — it isn't generating live.",
              "Saved changes disappear when you refresh the page."].map(l => (
              <li key={l} className="flex gap-2 text-sm" style={{ color: T.body }}>
                <span className="rounded-full mt-2 shrink-0" style={{ width: 5, height: 5, background: T.gold }} />
                {l}
              </li>
            ))}
          </ul>
          <p className="text-xs pt-1" style={{ color: T.muted, lineHeight: 1.6 }}>
            Prepared by Around SA Marketing for evaluation. Not licensed for business use.
          </p>
        </div>
        <div className="px-6 py-4" style={{ background: "#FAFBFC", borderTop: `1px solid ${T.line}` }}>
          <Btn full variant="primary" onClick={onClose}>Got it — show me the demo</Btn>
        </div>
      </div>
    </div>
  );
}


/* ============================================================================
   DELCO SOCIAL HUB — front-end prototype
   Built for DELCO Heating & Cooling (Central NJ).

   All data below is MOCK / DEMO data. Nothing here talks to a live service.
   Future production integrations are stubbed in `services` (bottom of file)
   and surfaced honestly in Settings → Connections.
   ========================================================================== */

/* ---------------------------------------------------------------- theme --- */
// Swap these five values to match the DELCO logo artwork exactly.
const T = {
  ink: "#0B1B33",
  body: "#46586F",
  muted: "#8494A8",
  line: "#DDE4EC",
  paper: "#F3F6FA",
  surface: "#FFFFFF",
  navy: "#0E2647",        // logo shield field
  navySoft: "#1B3A66",
  gold: "#F6A21E",        // logo border + website CTA
  goldSoft: "#FEF3E0",
  goldInk: "#96590A",     // gold as readable text on light
  cool: "#1D6FC4",        // logo banner blue
  coolSoft: "#E9F1FB",
  warm: "#C2610A",
  warmSoft: "#FDF1E2",
  good: "#17845C",
  goodSoft: "#E8F5EF",
};

const shadow = "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)";
const shadowLift = "0 8px 24px rgba(16,24,40,.10)";

const STATUS = {
  idea:      { label: "Idea",              fg: T.muted, bg: "#F1F3F7" },
  needed:    { label: "Content Needed",    fg: T.goldInk, bg: T.goldSoft },
  production:{ label: "In Production",     fg: T.warm,  bg: T.warmSoft },
  draft:     { label: "Draft",             fg: T.body,  bg: "#EEF1F6" },
  approval:  { label: "Awaiting Approval", fg: T.warm,  bg: T.warmSoft },
  approved:  { label: "Approved",          fg: T.good,  bg: T.goodSoft },
  scheduled: { label: "Scheduled",         fg: T.cool,  bg: T.coolSoft },
  published: { label: "Published",         fg: T.good,  bg: T.goodSoft },
};

const PLATFORM = {
  instagram: { label: "Instagram", Icon: Instagram, color: "#C13584" },
  facebook:  { label: "Facebook",  Icon: Facebook,  color: "#1877F2" },
  tiktok:    { label: "TikTok",    Icon: Music2,    color: "#111111" },
};

/* The pipeline every piece of content walks through. This track is the spine
   of the product — it answers "who are we waiting on" at a glance. */
const PIPELINE = ["Requested", "Reminder Sent", "Uploaded", "Drafted", "Approved", "Published"];

/* ------------------------------------------------------------ mock data --- */
const CONTENT = [
  {
    id: "c1", title: "3 Signs Your AC Needs Service", platform: "instagram", format: "Reel",
    date: "2026-09-08", time: "6:30 PM", status: "needed", owner: "Brian", due: "Sep 8", stage: 1,
    concept: "Brian on camera in a customer's utility room, naming the three things homeowners notice right before a compressor fails.",
    hook: "If your AC is doing this, you have about two weeks.",
    script: "Three signs your AC is about to quit on you.\n\nOne — it runs constantly but the house never gets cold. That's low refrigerant or a dying compressor.\n\nTwo — the vents smell musty. That's moisture sitting in the coil.\n\nThree — your electric bill jumped and nothing else changed.\n\nAny of those, call us before it turns into a replacement. We're in Sayreville, Old Bridge, East Brunswick — same week appointments.",
    caption: "Three things we hear right before a system fails. Catch them early and it's a repair, not a replacement. 🔧 Serving Central NJ — link in bio to book.",
    footage: ["Brian to camera, vertical", "B-roll: outdoor condenser running", "B-roll: dirty coil close-up"],
    platforms: ["instagram", "tiktok"], thumb: { tone: T.cool, Icon: Video },
    comments: [{ who: "Chris", when: "Aug 30", text: "Let's keep it under 40 seconds. Last one at 55 lost people at the halfway mark." }],
    activity: [
      { date: "Aug 28", label: "Content requested from Brian" },
      { date: "Sep 1", label: "Automatic reminder sent" },
    ],
  },
  {
    id: "c2", title: "Recent Sayreville Installation", platform: "facebook", format: "Photo Post",
    date: "2026-09-09", time: "12:00 PM", status: "approval", owner: "Chris", due: "Sep 9", stage: 4,
    concept: "Before/after of the Sayreville attic changeout. Straight photo post — these consistently out-reach graphics.",
    hook: "Sayreville, this one was 22 years old.",
    script: "",
    caption: "Twenty-two years is a good run. This Sayreville homeowner is now on a high-efficiency system that'll cut their summer bill noticeably. Full changeout, one day, no mess left behind.",
    footage: ["Before: original unit", "After: new install", "Wide shot of finished linesets"],
    platforms: ["facebook", "instagram"], thumb: { tone: T.warm, Icon: Camera },
    comments: [{ who: "Brian", when: "Sep 1", text: "Make sure the customer's address isn't visible in the second photo." }],
    activity: [
      { date: "Aug 21", label: "Content requested from Field Team" },
      { date: "Aug 25", label: "Photos uploaded — 6 files" },
      { date: "Aug 26", label: "Draft created" },
      { date: "Aug 31", label: "Sent to Chris for approval" },
    ],
  },
  {
    id: "c3", title: "Why Your Energy Bill Keeps Climbing", platform: "instagram", format: "Reel",
    date: "2026-09-11", time: "7:00 PM", status: "scheduled", owner: "Brian", due: "Sep 10", stage: 5,
    concept: "Educational explainer. Ties into the fall tune-up offer without selling hard.",
    hook: "Your bill went up 30% and you didn't change a thing.",
    script: "Same house, same thermostat, bigger bill. Usually it's one of three things: a filter nobody's changed since spring, a coil packed with dust, or a system that's simply lost efficiency with age...",
    caption: "Same thermostat, bigger bill. Here's what's usually going on inside the system. 👇",
    footage: ["Brian to camera", "Filter swap close-up", "Thermostat"],
    platforms: ["instagram", "facebook", "tiktok"], thumb: { tone: T.gold, Icon: Video },
    comments: [],
    activity: [
      { date: "Aug 18", label: "Content requested from Brian" },
      { date: "Aug 22", label: "Footage uploaded" },
      { date: "Aug 24", label: "Draft created" },
      { date: "Aug 27", label: "Approved by Chris" },
      { date: "Aug 29", label: "Scheduled for Sep 11" },
    ],
  },
  {
    id: "c4", title: "Fall HVAC Maintenance Checklist", platform: "facebook", format: "Carousel",
    date: "2026-09-15", time: "9:00 AM", status: "draft", owner: "Marketing", due: "Sep 12", stage: 3,
    concept: "Five-slide carousel homeowners can actually follow. Anchor piece for the fall maintenance campaign.",
    hook: "Ten minutes now, no emergency call in January.",
    script: "",
    caption: "Before you turn the heat on for the first time this year, run through these five. Takes ten minutes and prevents most of the calls we get in January.",
    footage: [], platforms: ["facebook", "instagram"], thumb: { tone: T.good, Icon: FileText },
    comments: [{ who: "Chris", when: "Sep 1", text: "Slide 4 should mention the $89 tune-up." }],
    activity: [
      { date: "Aug 26", label: "Idea added by Chris" },
      { date: "Aug 30", label: "Draft created with DELCO AI" },
    ],
  },
  {
    id: "c5", title: "Technician Tuesday: Meet Marcus", platform: "instagram", format: "Story",
    date: "2026-09-15", time: "8:00 AM", status: "needed", owner: "Field Team", due: "Sep 13", stage: 0,
    concept: "Weekly series. One tech, three questions, shot on a phone in the van.",
    hook: "Nine years, roughly 4,000 service calls.",
    script: "Name, how long at DELCO, and the strangest thing you've found inside a furnace.",
    caption: "Technician Tuesday. Marcus has been with DELCO nine years and has seen things.",
    footage: ["Vertical clip of Marcus, 20–30 sec"],
    platforms: ["instagram"], thumb: { tone: T.navy, Icon: User },
    comments: [], activity: [{ date: "Sep 1", label: "Content requested from Field Team" }],
  },
  {
    id: "c6", title: "Is Your HVAC System Ready for Winter?", platform: "instagram", format: "Graphic",
    date: "2026-09-18", time: "5:30 PM", status: "approved", owner: "Marketing", due: "Sep 16", stage: 4,
    concept: "Branded graphic, cool-to-warm visual, fall tune-up offer at the bottom.",
    hook: "", script: "",
    caption: "First cold night is usually the last week of September in Central Jersey. Get ahead of it — $89 fall tune-up through October 31.",
    footage: [], platforms: ["instagram", "facebook"], thumb: { tone: T.warm, Icon: ImageIcon },
    comments: [], activity: [
      { date: "Aug 29", label: "Generated with DELCO AI" },
      { date: "Aug 31", label: "Sent for approval" },
      { date: "Sep 1", label: "Approved by Chris" },
    ],
  },
  {
    id: "c7", title: "Meet the DELCO Team", platform: "facebook", format: "Photo Post",
    date: "2026-09-22", time: "11:00 AM", status: "idea", owner: "Unassigned", due: "Sep 19", stage: 0,
    concept: "Full team photo in front of the trucks. Good evergreen post and useful on the website too.",
    hook: "", script: "", caption: "",
    footage: ["Group photo, all trucks", "Individual headshots"],
    platforms: ["facebook", "instagram"], thumb: { tone: T.cool, Icon: Users },
    comments: [], activity: [{ date: "Aug 24", label: "Idea added by Brian" }],
  },
  {
    id: "c8", title: "Christmas with the DELCO Dog", platform: "instagram", format: "Graphic",
    date: "2026-09-25", time: "4:00 PM", status: "idea", owner: "Marketing", due: "Sep 24", stage: 0,
    concept: "Early concepting for the holiday run. Mascot in a Santa hat beside a unit — warm, not corporate.",
    hook: "", script: "", caption: "",
    footage: [], platforms: ["instagram", "facebook"], thumb: { tone: T.gold, Icon: Dog },
    comments: [], activity: [{ date: "Aug 30", label: "Idea added by Chris" }],
  },
  {
    id: "c9", title: "Emergency Heat: What To Check First", platform: "tiktok", format: "Reel",
    date: "2026-09-29", time: "7:30 PM", status: "production", owner: "Brian", due: "Sep 26", stage: 2,
    concept: "Short, useful, no sales pitch. This format travels furthest on TikTok.",
    hook: "Before you call anyone — check these two things.",
    script: "Breaker panel first. Then the furnace switch, which looks like a light switch and gets flipped by accident constantly...",
    caption: "Two things to check before you call us. Sometimes it's a five-second fix.",
    footage: ["Breaker panel", "Furnace switch", "Brian to camera"],
    platforms: ["tiktok", "instagram"], thumb: { tone: T.navy, Icon: Video },
    comments: [], activity: [
      { date: "Aug 27", label: "Content requested from Brian" },
      { date: "Sep 1", label: "Footage uploaded — 4 clips" },
    ],
  },
  {
    id: "c10", title: "Old Bridge Furnace Replacement", platform: "facebook", format: "Photo Post",
    date: "2026-09-04", time: "1:00 PM", status: "published", owner: "Marketing", due: "Sep 3", stage: 6,
    concept: "", hook: "", script: "",
    caption: "Old Bridge homeowner went from a 30-year-old oil furnace to a high-efficiency gas system. Two days, start to finish.",
    footage: [], platforms: ["facebook"], thumb: { tone: T.good, Icon: Camera },
    comments: [], activity: [
      { date: "Aug 20", label: "Photos uploaded by Field Team" },
      { date: "Aug 22", label: "Draft created" },
      { date: "Aug 24", label: "Approved by Chris" },
      { date: "Sep 4", label: "Published to Facebook" },
    ],
    stats: { views: 8420, reach: 6180, likes: 214, comments: 31, shares: 12 },
  },
  {
    id: "c11", title: "Ductless Mini-Split Walkthrough", platform: "instagram", format: "Reel",
    date: "2026-09-02", time: "6:00 PM", status: "published", owner: "Brian", due: "Sep 1", stage: 6,
    concept: "", hook: "", script: "",
    caption: "Adding heat and AC to a room with no ductwork. Here's what a mini-split install actually looks like.",
    footage: [], platforms: ["instagram", "tiktok"], thumb: { tone: T.cool, Icon: Video },
    comments: [], activity: [
      { date: "Aug 15", label: "Content requested from Brian" },
      { date: "Aug 19", label: "Footage uploaded" },
      { date: "Aug 26", label: "Approved by Chris" },
      { date: "Sep 2", label: "Published to Instagram" },
    ],
    stats: { views: 24810, reach: 19340, likes: 986, comments: 74, shares: 121 },
  },
  {
    id: "c12", title: "$89 Fall Tune-Up Offer", platform: "facebook", format: "Graphic",
    date: "2026-09-05", time: "10:00 AM", status: "published", owner: "Marketing", due: "Sep 4", stage: 6,
    concept: "", hook: "", script: "",
    caption: "$89 fall tune-up, now through October 31. 21-point inspection, no upsell games.",
    footage: [], platforms: ["facebook", "instagram"], thumb: { tone: T.warm, Icon: ImageIcon },
    comments: [], activity: [{ date: "Sep 5", label: "Published to Facebook" }],
    stats: { views: 5240, reach: 3910, likes: 88, comments: 9, shares: 4 },
  },
];

const REQUESTS = [
  {
    id: "r1", title: "Technician Installation Videos", from: "Field Team", column: "received",
    ask: "Upload 3 vertical videos from this week's installations.",
    requirements: ["Vertical 9:16", "10–30 seconds each", "Before and after footage", "Technician on camera optional"],
    due: "Sep 10", files: 3, assignee: "Field Team",
    activity: [
      { date: "Sep 3", label: "Request created" },
      { date: "Sep 5", label: "Reminder sent" },
      { date: "Sep 7", label: "Files uploaded — 3 videos" },
    ],
  },
  {
    id: "r2", title: "Record: 3 Signs Your AC Needs Service", from: "Brian", column: "waiting",
    ask: "Film the three-signs script. Utility room or in front of a condenser both work.",
    requirements: ["Vertical 9:16", "Under 40 seconds", "Good audio — use the lav mic", "Natural light if possible"],
    due: "Sep 8", files: 0, assignee: "Brian",
    activity: [
      { date: "Aug 28", label: "Request created" },
      { date: "Sep 1", label: "Reminder sent" },
    ],
  },
  {
    id: "r3", title: "Team Photo — All Trucks", from: "Chris", column: "requested",
    ask: "Schedule 20 minutes on a Friday morning to get the full crew and trucks in one shot.",
    requirements: ["Everyone in DELCO uniform", "All three trucks visible", "Horizontal and vertical versions"],
    due: "Sep 19", files: 0, assignee: "Chris",
    activity: [{ date: "Aug 31", label: "Request created" }],
  },
  {
    id: "r4", title: "Customer Review Screenshots", from: "Office", column: "received",
    ask: "Send the five best Google reviews from August so we can turn them into graphics.",
    requirements: ["Screenshot or copy/paste", "First name and town only"],
    due: "Sep 6", files: 5, assignee: "Office",
    activity: [
      { date: "Aug 29", label: "Request created" },
      { date: "Sep 2", label: "5 reviews uploaded" },
    ],
  },
  {
    id: "r5", title: "Fall Maintenance Campaign Assets", from: "Marketing", column: "production",
    ask: "Build the five-slide carousel, the offer graphic and two supporting Reels.",
    requirements: ["Brand Lock on", "Offer expires Oct 31", "$89 price point on every asset"],
    due: "Sep 12", files: 4, assignee: "Marketing",
    activity: [
      { date: "Aug 26", label: "Request created" },
      { date: "Aug 30", label: "Drafts started" },
    ],
  },
  {
    id: "r6", title: "Approve: Fall Maintenance Campaign", from: "Chris", column: "approval",
    ask: "Review the five campaign assets and approve or leave notes.",
    requirements: ["Check the offer wording", "Confirm the expiry date", "Confirm service area list"],
    due: "Sep 10", files: 5, assignee: "Chris",
    activity: [
      { date: "Aug 31", label: "Drafts completed" },
      { date: "Sep 1", label: "Sent to Chris for approval" },
    ],
  },
  {
    id: "r7", title: "Mini-Split Install Photos", from: "Field Team", column: "complete",
    ask: "Photos from the East Brunswick mini-split job.",
    requirements: ["Before and after", "Wide and detail shots"],
    due: "Aug 22", files: 8, assignee: "Field Team",
    activity: [
      { date: "Aug 15", label: "Request created" },
      { date: "Aug 19", label: "8 photos uploaded" },
      { date: "Aug 26", label: "Used in published Reel" },
    ],
  },
  {
    id: "r8", title: "Winter Promo Pricing Confirmation", from: "Brian", column: "waiting",
    ask: "Confirm the December service pricing so we can build the holiday campaign.",
    requirements: ["Final pricing", "Any bundle offers", "Expiry date"],
    due: "Sep 15", files: 0, assignee: "Brian",
    activity: [{ date: "Sep 1", label: "Request created" }],
  },
];

const REQ_COLUMNS = [
  { key: "requested", label: "Requested" },
  { key: "waiting", label: "Waiting on DELCO" },
  { key: "received", label: "Received" },
  { key: "production", label: "In Production" },
  { key: "approval", label: "Ready for Approval" },
  { key: "complete", label: "Complete" },
];

const LIBRARY = [
  { id: "a1", name: "sayreville-install-after.jpg", cat: "Photos", date: "Sep 1, 2026", tags: ["Installation", "HVAC Unit"], used: ["Recent Sayreville Installation"], tone: T.warm, Icon: Camera },
  { id: "a2", name: "sayreville-install-before.jpg", cat: "Photos", date: "Sep 1, 2026", tags: ["Installation"], used: ["Recent Sayreville Installation"], tone: T.warm, Icon: Camera },
  { id: "a3", name: "marcus-van-vertical.mp4", cat: "Videos", date: "Aug 30, 2026", tags: ["Technician", "Team"], used: [], tone: T.navy, Icon: Video },
  { id: "a4", name: "minisplit-walkthrough.mp4", cat: "Videos", date: "Aug 19, 2026", tags: ["Installation", "HVAC Unit"], used: ["Ductless Mini-Split Walkthrough"], tone: T.cool, Icon: Video },
  { id: "a5", name: "fall-tuneup-89.png", cat: "Graphics", date: "Aug 28, 2026", tags: ["Promotion", "Seasonal", "Maintenance"], used: ["$89 Fall Tune-Up Offer"], tone: T.warm, Icon: ImageIcon },
  { id: "a6", name: "winter-ready-graphic.png", cat: "AI Generated", date: "Aug 29, 2026", tags: ["Seasonal", "Maintenance"], used: ["Is Your HVAC System Ready for Winter?"], tone: T.cool, Icon: Wand2 },
  { id: "a7", name: "delco-dog-santa-v2.png", cat: "AI Generated", date: "Aug 30, 2026", tags: ["Christmas", "Seasonal"], used: [], tone: T.gold, Icon: Wand2 },
  { id: "a8", name: "delco-logo-primary.svg", cat: "Logos & Brand Assets", date: "Jun 4, 2026", tags: ["Team"], used: ["Every branded asset"], tone: T.navy, Icon: Star },
  { id: "a9", name: "delco-logo-reversed.svg", cat: "Logos & Brand Assets", date: "Jun 4, 2026", tags: ["Team"], used: ["Every branded asset"], tone: T.navy, Icon: Star },
  { id: "a10", name: "oldbridge-furnace-swap.jpg", cat: "Published Content", date: "Sep 4, 2026", tags: ["Installation", "Customer"], used: ["Old Bridge Furnace Replacement"], tone: T.good, Icon: Camera },
  { id: "a11", name: "team-truck-lineup.jpg", cat: "Photos", date: "Jul 18, 2026", tags: ["Team"], used: ["Website hero"], tone: T.cool, Icon: Users },
  { id: "a12", name: "delco-dog-shop.jpg", cat: "Photos", date: "Jul 2, 2026", tags: ["Team", "Christmas"], used: [], tone: T.gold, Icon: Dog },
  { id: "a13", name: "coil-cleaning-closeup.mp4", cat: "Videos", date: "Aug 12, 2026", tags: ["Maintenance", "Technician"], used: [], tone: T.navy, Icon: Video },
  { id: "a14", name: "review-graphic-lisa-m.png", cat: "Graphics", date: "Sep 2, 2026", tags: ["Customer"], used: [], tone: T.good, Icon: ImageIcon },
  { id: "a15", name: "attic-airhandler-install.jpg", cat: "Photos", date: "Aug 25, 2026", tags: ["Installation", "HVAC Unit"], used: [], tone: T.warm, Icon: Camera },
  { id: "a16", name: "minisplit-reel-published.mp4", cat: "Published Content", date: "Sep 2, 2026", tags: ["Installation"], used: ["Ductless Mini-Split Walkthrough"], tone: T.cool, Icon: Play },
];

const LIB_CATS = ["All", "Photos", "Videos", "Graphics", "Published Content", "AI Generated", "Logos & Brand Assets"];
const LIB_TAGS = ["Installation", "Technician", "HVAC Unit", "Team", "Customer", "Seasonal", "Christmas", "Maintenance", "Promotion"];

const FOLLOWER_DATA = [
  { d: "Aug 3", ig: 2180, fb: 3240, tt: 640 }, { d: "Aug 8", ig: 2245, fb: 3268, tt: 712 },
  { d: "Aug 13", ig: 2330, fb: 3290, tt: 806 }, { d: "Aug 18", ig: 2452, fb: 3311, tt: 918 },
  { d: "Aug 23", ig: 2588, fb: 3340, tt: 1042 }, { d: "Aug 28", ig: 2704, fb: 3362, tt: 1185 },
  { d: "Sep 1", ig: 2814, fb: 3381, tt: 1290 },
];
const REACH_DATA = [
  { d: "Aug 3", v: 4200 }, { d: "Aug 6", v: 5100 }, { d: "Aug 9", v: 3800 }, { d: "Aug 12", v: 9400 },
  { d: "Aug 15", v: 7200 }, { d: "Aug 18", v: 6100 }, { d: "Aug 21", v: 12800 }, { d: "Aug 24", v: 9900 },
  { d: "Aug 27", v: 8300 }, { d: "Aug 30", v: 15400 }, { d: "Sep 1", v: 11200 },
];
const ENGAGE_DATA = [
  { d: "W1", v: 3.1 }, { d: "W2", v: 3.8 }, { d: "W3", v: 4.6 }, { d: "W4", v: 5.9 }, { d: "W5", v: 6.4 },
];

/* Narrow screens get stacked layouts instead of side-by-side boards. */
function useIsNarrow(bp = 900) {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false);
  React.useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return narrow;
}

/* --------------------------------------------------------------- brand marks --- */
/* Real DELCO artwork, embedded so the prototype has no external dependencies.
   In production these move to cloud media storage and load by URL. */
const DELCO_LOGO = window.__LOGO__;
const DELCO_MASCOT = window.__DOG__;

function DelcoMark({ h = 32 }) {
  return (
    <img src={DELCO_LOGO} alt="DELCO Heating and Cooling"
      style={{ height: h, width: "auto", display: "block", flexShrink: 0 }} />
  );
}

function MascotMark({ h = 56 }) {
  return (
    <img src={DELCO_MASCOT} alt="The DELCO mascot"
      style={{ height: h, width: "auto", display: "block", flexShrink: 0 }} />
  );
}

/* ---------------------------------------------------------- small parts --- */
function Pill({ tone = T.body, bg = "#F1F3F7", children, style }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium shrink-0 whitespace-nowrap"
      style={{ color: tone, background: bg, ...style }}>
      {children}
    </span>
  );
}

function StatusPill({ status }) {
  const s = STATUS[status];
  return <Pill tone={s.fg} bg={s.bg}>{s.label}</Pill>;
}

function PlatformIcon({ id, size = 14 }) {
  const p = PLATFORM[id];
  if (!p) return null;
  const { Icon } = p;
  return <Icon size={size} style={{ color: p.color }} />;
}

function Card({ children, className = "", style, onClick, hover }) {
  return (
    <div onClick={onClick} className={`rounded-xl ${className}`}
      style={{
        background: T.surface, border: `1px solid ${T.line}`, boxShadow: shadow,
        cursor: onClick ? "pointer" : undefined, transition: "box-shadow .15s ease, border-color .15s ease",
        ...style,
      }}
      onMouseEnter={hover ? (e) => { e.currentTarget.style.boxShadow = shadowLift; } : undefined}
      onMouseLeave={hover ? (e) => { e.currentTarget.style.boxShadow = shadow; } : undefined}
    >{children}</div>
  );
}

function SectionHead({ title, sub, action }) {
  return (
    <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: T.ink }}>{title}</h2>
        {sub && <p className="text-sm mt-0.5" style={{ color: T.muted }}>{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function Btn({ children, variant = "ghost", size = "md", onClick, style, full }) {
  const base = {
    primary:  { background: T.gold, color: T.navy, border: `1px solid ${T.gold}` },
    dark:     { background: T.navy, color: "#fff", border: `1px solid ${T.navy}` },
    ghost:    { background: T.surface, color: T.ink, border: `1px solid ${T.line}` },
    quiet:    { background: "transparent", color: T.body, border: "1px solid transparent" },
  }[variant];
  const pad = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium ${pad} ${full ? "w-full" : ""}`}
      style={{ ...base, transition: "filter .15s ease", ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(.96)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
    >{children}</button>
  );
}

/* Thumbnails are drawn, not loaded — no external assets in the prototype. */
function Thumb({ tone = T.cool, Icon = ImageIcon, ratio = "aspect-video", label, play }) {
  return (
    <div className={`relative w-full ${ratio} rounded-lg overflow-hidden flex items-center justify-center`}
      style={{ background: T.navy }}>
      <div className="absolute inset-0" style={{ background: tone, opacity: 0.9 }} />
      <div className="absolute" style={{
        width: "160%", height: "60%", background: "rgba(255,255,255,.10)",
        transform: "rotate(-18deg) translateY(30%)",
      }} />
      <Icon size={22} style={{ color: "rgba(255,255,255,.95)", position: "relative" }} />
      {play && (
        <div className="absolute bottom-2 left-2 rounded-md px-1.5 py-0.5 flex items-center gap-1"
          style={{ background: "rgba(0,0,0,.45)" }}>
          <Play size={10} style={{ color: "#fff" }} />
          <span className="text-xs" style={{ color: "#fff" }}>0:24</span>
        </div>
      )}
      {label && (
        <div className="absolute bottom-2 right-2 rounded-md px-1.5 py-0.5 text-xs font-medium"
          style={{ background: "rgba(255,255,255,.92)", color: T.ink }}>{label}</div>
      )}
    </div>
  );
}

/* The signature component: an accountability track. */
function PipelineTrack({ stage, compact }) {
  return (
    <div className="flex items-center" style={{ gap: compact ? 4 : 6 }}>
      {PIPELINE.map((step, i) => {
        const done = i < stage;
        const current = i === stage;
        return (
          <div key={step} className="flex items-center" style={{ gap: compact ? 4 : 6 }}>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full flex items-center justify-center"
                style={{
                  width: current ? 9 : 7, height: current ? 9 : 7,
                  background: done ? T.good : current ? T.warm : T.line,
                  outline: current ? `3px solid ${T.warmSoft}` : "none",
                }} />
              {!compact && (
                <span className="text-xs whitespace-nowrap"
                  style={{ color: done ? T.body : current ? T.warm : T.muted, fontWeight: current ? 600 : 400 }}>
                  {step}
                </span>
              )}
            </div>
            {i < PIPELINE.length - 1 && (
              <span style={{ width: compact ? 14 : 18, height: 1, background: done ? T.good : T.line, opacity: done ? 0.5 : 1 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ActivityList({ items }) {
  return (
    <ol className="relative" style={{ paddingLeft: 18 }}>
      <span className="absolute" style={{ left: 4, top: 6, bottom: 6, width: 1, background: T.line }} />
      {items.map((a, i) => (
        <li key={i} className="relative pb-3 last:pb-0">
          <span className="absolute rounded-full" style={{
            left: -18, top: 5, width: 9, height: 9,
            background: i === items.length - 1 ? T.warm : T.surface,
            border: `2px solid ${i === items.length - 1 ? T.warm : T.line}`,
          }} />
          <div className="text-sm" style={{ color: T.ink }}>{a.label}</div>
          <div className="text-xs mt-0.5" style={{ color: T.muted }}>{a.date}</div>
        </li>
      ))}
    </ol>
  );
}

/* ============================================================== DASHBOARD */
function Dashboard({ content, onOpen, go }) {
  const stats = [
    { label: "Posts this month", value: "18", note: "+4 vs August", tone: T.ink },
    { label: "Scheduled", value: "6", note: "Next: Sep 8, 6:30 PM", tone: T.cool },
    { label: "Awaiting approval", value: "2", note: "Chris", tone: T.warm },
    { label: "Content needed", value: "3", note: "Brian, Field Team", tone: T.gold },
    { label: "Total reach", value: "94.2K", note: "+38% vs last 30 days", tone: T.ink },
    { label: "Engagement", value: "6.4%", note: "+1.8 pts", tone: T.good },
  ];

  const actions = [
    { id: "c1", verb: "Record", title: "3 Signs Your AC Needs Service", who: "Brian", due: "September 8", status: "needed", stage: 1 },
    { id: "r1", verb: "Upload", title: "Recent Installation Photos", who: "Field Team", due: "September 9", status: "production", stage: 2 },
    { id: "c2", verb: "Approve", title: "Fall Maintenance Campaign", who: "Chris", due: "September 10", status: "approval", stage: 4 },
  ];
  const [open, setOpen] = useState(null);

  const upcoming = content.filter(c => ["scheduled", "approved", "draft"].includes(c.status)).slice(0, 4);
  const published = content.filter(c => c.stats).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: T.ink }}>Good afternoon, Brian</h1>
        <p className="mt-1" style={{ color: T.body }}>Here's what's happening with DELCO's content.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="p-4 overflow-hidden">
            <div className="text-xs" style={{ color: T.muted }}>{s.label}</div>
            <div className="text-2xl font-semibold mt-1.5 tracking-tight" style={{ color: s.tone, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: T.muted }}>{s.note}</div>
          </Card>
        ))}
      </div>

      {/* Action required — the heart of the dashboard */}
      <Card style={{ borderColor: "#F0DCB4" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} style={{ color: T.goldInk }} />
            <h2 className="font-semibold tracking-tight" style={{ color: T.ink }}>Action required</h2>
          </div>
          <span className="text-sm" style={{ color: T.muted }}>3 items</span>
        </div>
        <div>
          {actions.map((a, i) => {
            const item = content.find(c => c.id === a.id) || REQUESTS.find(r => r.id === a.id);
            const isOpen = open === a.id;
            return (
              <div key={a.id} style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
                <div className="px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3 cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : a.id)}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold shrink-0" style={{ color: T.goldInk }}>{a.verb}</span>
                      <span className="font-medium truncate" style={{ color: T.ink }}>{a.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs" style={{ color: T.muted }}>
                      <span className="flex items-center gap-1 shrink-0"><User size={12} />{a.who}</span>
                      <span className="flex items-center gap-1 shrink-0"><Clock size={12} />Due {a.due}</span>
                    </div>
                  </div>
                  <div className="hidden xl:block"><PipelineTrack stage={a.stage} /></div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusPill status={a.status} />
                    <ChevronRight size={16} style={{ color: T.muted, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 grid md:grid-cols-2 gap-6" style={{ background: "#FAFBFC" }}>
                    <div className="pt-4">
                      <div className="text-xs font-semibold mb-3" style={{ color: T.body }}>Activity history</div>
                      <ActivityList items={item?.activity || []} />
                    </div>
                    <div className="pt-4 flex flex-col gap-2 md:items-end">
                      <div className="xl:hidden mb-2"><PipelineTrack stage={a.stage} compact /></div>
                      <div className="flex gap-2 flex-wrap">
                        <Btn size="sm" variant="ghost"><Send size={13} />Send reminder</Btn>
                        <Btn size="sm" variant="ghost"><MessageSquare size={13} />Comment</Btn>
                        <Btn size="sm" variant="primary" onClick={() => a.id.startsWith("c") ? onOpen(a.id) : go("requests")}>
                          Open <ChevronRight size={13} />
                        </Btn>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <SectionHead title="Upcoming content" sub="Next four items on the calendar"
              action={<Btn size="sm" variant="quiet" onClick={() => go("planner")}>Open planner <ChevronRight size={14} /></Btn>} />
            <Card>
              {upcoming.map((c, i) => (
                <div key={c.id} onClick={() => onOpen(c.id)}
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer"
                  style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
                  <div style={{ width: 56, flexShrink: 0, minWidth: 56 }}>
                    <Thumb tone={c.thumb.tone} Icon={c.thumb.Icon} ratio="aspect-square" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate" style={{ color: T.ink }}>{c.title}</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs" style={{ color: T.muted }}>
                      <PlatformIcon id={c.platform} size={12} />
                      <span className="shrink-0">{c.format}</span><span>·</span>
                      <span className="shrink-0">{fmtDate(c.date)}, {c.time}</span>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex shrink-0"><StatusPill status={c.status} /></span>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <SectionHead title="Recent performance" sub="Last 30 days across all platforms"
              action={<Btn size="sm" variant="quiet" onClick={() => go("analytics")}>Full analytics <ChevronRight size={14} /></Btn>} />
            <Card className="p-4">
              <AreaChartSVG data={REACH_DATA} k="v" height={180} />
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <SectionHead title="Quick actions" />
            <Card className="p-3 space-y-2">
              <Btn full variant="primary" onClick={() => go("ai")}><Plus size={14} />Create content</Btn>
              <Btn full variant="ghost" onClick={() => go("requests")}><Upload size={14} />Upload media</Btn>
              <Btn full variant="ghost" onClick={() => go("planner")}><Lightbulb size={14} />Add content idea</Btn>
              <Btn full variant="ghost" onClick={() => go("planner")}><CalendarDays size={14} />Schedule post</Btn>
            </Card>
          </div>

          <div>
            <SectionHead title="Recent uploads" sub="From the field, last 7 days" />
            <Card className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {LIBRARY.slice(0, 6).map(a => (
                  <div key={a.id}>
                    <Thumb tone={a.tone} Icon={a.Icon} ratio="aspect-square" />
                  </div>
                ))}
              </div>
              <Btn full size="sm" variant="quiet" style={{ marginTop: 10 }} onClick={() => go("library")}>
                Open library <ChevronRight size={13} />
              </Btn>
            </Card>
          </div>

          <div>
            <SectionHead title="Published recently" />
            <Card>
              {published.map((c, i) => (
                <div key={c.id} className="px-4 py-3" style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
                  <div className="text-sm font-medium truncate" style={{ color: T.ink }}>{c.title}</div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs" style={{ color: T.muted }}>
                    <span>{fmtNum(c.stats.views)} views</span>
                    <span>{fmtNum(c.stats.likes)} likes</span>
                    <span>{c.stats.shares} shares</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ PLANNER */
function Planner({ content, setContent, onOpen }) {
  const narrow = useIsNarrow();
  const [view, setView] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "List" : "Month");
  const [drag, setDrag] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);

  // September 2026 starts on a Tuesday.
  const first = new Date(2026, 8, 1);
  const startPad = first.getDay();
  const days = 30;
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const byDate = useMemo(() => {
    const m = {};
    content.forEach(c => { (m[c.date] = m[c.date] || []).push(c); });
    return m;
  }, [content]);

  const key = (d) => `2026-09-${String(d).padStart(2, "0")}`;

  const drop = (d) => {
    if (!drag) return;
    setContent(prev => prev.map(c => c.id === drag ? { ...c, date: key(d) } : c));
    setDrag(null); setHoverDay(null);
  };

  const weekDays = [8, 9, 10, 11, 12, 13, 14];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Content planner</h1>
          <p className="mt-1 text-sm" style={{ color: T.body }}>September 2026 — 12 items planned, 3 still need content.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
            {["Month", "Week", "List"].map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 text-sm font-medium"
                style={{ background: view === v ? T.navy : T.surface, color: view === v ? "#fff" : T.body }}>{v}</button>
            ))}
          </div>
          <Btn variant="primary"><Plus size={14} />Add content</Btn>
        </div>
      </div>

      {view === "Month" && (
        <Card className="overflow-hidden">
         <div className="overflow-x-auto">
          <div style={{ minWidth: 700, width: "100%" }}>
          <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${T.line}` }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="px-3 py-2.5 text-xs font-semibold" style={{ color: T.muted }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              const items = d ? (byDate[key(d)] || []) : [];
              const isToday = d === 1;
              return (
                <div key={i}
                  onDragOver={(e) => { e.preventDefault(); if (d) setHoverDay(d); }}
                  onDragLeave={() => setHoverDay(null)}
                  onDrop={() => d && drop(d)}
                  className="p-2 min-h-28"
                  style={{
                    borderRight: (i + 1) % 7 ? `1px solid ${T.line}` : "none",
                    borderBottom: `1px solid ${T.line}`,
                    background: hoverDay === d ? T.coolSoft : d ? T.surface : "#FBFCFD",
                  }}>
                  {d && (
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium rounded px-1.5 py-0.5"
                        style={{ color: isToday ? T.navy : T.body, background: isToday ? T.gold : "transparent" }}>{d}</span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {items.map(c => (
                      <div key={c.id} draggable onDragStart={() => setDrag(c.id)} onClick={() => onOpen(c.id)}
                        className="rounded-md p-1.5 cursor-pointer"
                        style={{ background: STATUS[c.status].bg, borderLeft: `3px solid ${STATUS[c.status].fg}` }}>
                        <div className="flex items-center gap-1.5">
                          <PlatformIcon id={c.platform} size={11} />
                          <span className="text-xs font-medium leading-tight line-clamp-2" style={{ color: T.ink }}>{c.title}</span>
                        </div>
                        <div className="text-xs mt-1" style={{ color: STATUS[c.status].fg }}>{c.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
         </div>
          <div className="px-4 py-3 flex flex-wrap gap-x-4 gap-y-2 items-center" style={{ background: "#FAFBFC" }}>
            <span className="text-xs" style={{ color: T.muted }}>Drag any item to a new date to reschedule.</span>
            <div className="flex flex-wrap gap-3">
              {Object.entries(STATUS).map(([k, s]) => (
                <span key={k} className="flex items-center gap-1.5 text-xs" style={{ color: T.body }}>
                  <span className="rounded-sm" style={{ width: 8, height: 8, background: s.fg }} />{s.label}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      {view === "Week" && (
        <Card className={narrow ? "" : "overflow-x-auto"}>
          <div className={narrow ? "" : "grid grid-cols-7"}>
            {weekDays.map((d, i) => (
              <div key={d} className="p-3" style={{
                borderRight: !narrow && i < 6 ? `1px solid ${T.line}` : "none",
                borderTop: narrow && i ? `1px solid ${T.line}` : "none",
              }}>
                <div className="text-xs font-semibold mb-3" style={{ color: T.muted }}>
                  {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"][i]} {d}
                </div>
                <div className={narrow ? "grid grid-cols-2 gap-2" : "space-y-2"}>
                  {narrow && (byDate[key(d)] || []).length === 0 && (
                    <span className="text-xs" style={{ color: T.muted }}>Nothing scheduled</span>
                  )}
                  {(byDate[key(d)] || []).map(c => (
                    <Card key={c.id} hover onClick={() => onOpen(c.id)} className="p-2">
                      <Thumb tone={c.thumb.tone} Icon={c.thumb.Icon} ratio="aspect-video" />
                      <div className="text-xs font-medium mt-2 leading-tight" style={{ color: T.ink }}>{c.title}</div>
                      <div className="mt-1.5"><StatusPill status={c.status} /></div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === "List" && (
        <Card>
          {[...content].sort((a, b) => a.date.localeCompare(b.date)).map((c, i) => (
            <div key={c.id} onClick={() => onOpen(c.id)}
              className="flex items-center gap-4 px-4 py-3 cursor-pointer"
              style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
              <div style={{ width: 64, flexShrink: 0, minWidth: 64 }}>
                <Thumb tone={c.thumb.tone} Icon={c.thumb.Icon} ratio="aspect-square" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate" style={{ color: T.ink }}>{c.title}</div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs" style={{ color: T.muted }}>
                  <PlatformIcon id={c.platform} size={12} /><span className="shrink-0">{c.format}</span><span>·</span>
                  <span className="shrink-0">{c.owner}</span>
                </div>
              </div>
              <div className="hidden md:block text-sm" style={{ color: T.body }}>{fmtDate(c.date)}, {c.time}</div>
              <StatusPill status={c.status} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* --------------------------------------------------------- detail panel --- */
function DetailPanel({ item, onClose, setContent }) {
  const [tab, setTab] = useState("brief");
  const [comment, setComment] = useState("");
  if (!item) return null;

  const addComment = () => {
    if (!comment.trim()) return;
    setContent(prev => prev.map(c => c.id === item.id
      ? { ...c, comments: [...c.comments, { who: "Brian", when: "Sep 1", text: comment }] } : c));
    setComment("");
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(11,27,51,.4)" }} onClick={onClose}>
      <div className="w-full max-w-xl overflow-y-auto"
        style={{ background: T.surface, height: "100dvh", overscrollBehavior: "contain" }}
        onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 px-5 py-4 flex items-start justify-between gap-4"
          style={{ background: T.surface, borderBottom: `1px solid ${T.line}` }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <PlatformIcon id={item.platform} size={14} />
              <span className="text-xs" style={{ color: T.muted }}>{PLATFORM[item.platform].label} {item.format}</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight leading-snug" style={{ color: T.ink }}>{item.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5" style={{ border: `1px solid ${T.line}` }}><X size={16} /></button>
        </div>

        <div className="px-5 pt-4">
          <Thumb tone={item.thumb.tone} Icon={item.thumb.Icon} ratio="aspect-video" play={item.format === "Reel"} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-5">
            <Field label="Status"><StatusPill status={item.status} /></Field>
            <Field label="Assigned to"><span className="text-sm" style={{ color: T.ink }}>{item.owner}</span></Field>
            <Field label="Scheduled"><span className="text-sm" style={{ color: T.ink }}>{fmtDate(item.date)}, {item.time}</span></Field>
            <Field label="Due"><span className="text-sm" style={{ color: T.ink }}>{item.due}</span></Field>
            <Field label="Platforms">
              <div className="flex gap-2 items-center">{item.platforms.map(p => <PlatformIcon key={p} id={p} size={15} />)}</div>
            </Field>
            <Field label="Attachments">
              <span className="text-sm flex items-center gap-1.5" style={{ color: T.ink }}>
                <Paperclip size={13} />{item.footage.length} files
              </span>
            </Field>
          </div>

          <div className="mt-5 p-3 rounded-lg" style={{ background: "#FAFBFC", border: `1px solid ${T.line}` }}>
            <div className="text-xs font-semibold mb-2.5" style={{ color: T.body }}>Where this stands</div>
            <PipelineTrack stage={item.stage} compact />
          </div>
        </div>

        <div className="px-5 mt-5 flex gap-1" style={{ borderBottom: `1px solid ${T.line}` }}>
          {[["brief", "Brief"], ["activity", "Activity"], ["comments", `Comments (${item.comments.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className="px-3 py-2 text-sm font-medium shrink-0 whitespace-nowrap"
              style={{ color: tab === k ? T.ink : T.muted, borderBottom: `2px solid ${tab === k ? T.gold : "transparent"}`, marginBottom: -1 }}>
              {l}
            </button>
          ))}
        </div>

        <div className="px-5 py-5 space-y-5">
          {tab === "brief" && (
            <>
              {item.concept && <Block title="Concept" body={item.concept} />}
              {item.hook && <Block title="Hook" body={item.hook} mono />}
              {item.script && <Block title="Script" body={item.script} />}
              {item.caption && <Block title="Caption" body={item.caption} />}
              {item.footage.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: T.body }}>Required footage</div>
                  <ul className="space-y-1.5">
                    {item.footage.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm" style={{ color: T.ink }}>
                        <CircleDashed size={13} style={{ color: T.muted }} />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          {tab === "activity" && <ActivityList items={item.activity} />}
          {tab === "comments" && (
            <div className="space-y-4">
              {item.comments.length === 0 && (
                <p className="text-sm" style={{ color: T.muted }}>No comments yet. Leave a note for whoever picks this up next.</p>
              )}
              {item.comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div className="rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ width: 30, height: 30, background: T.navy, color: "#fff" }}>{c.who[0]}</div>
                  <div>
                    <div className="text-sm"><span className="font-semibold" style={{ color: T.ink }}>{c.who}</span>
                      <span className="ml-2 text-xs" style={{ color: T.muted }}>{c.when}</span></div>
                    <p className="text-sm mt-0.5" style={{ color: T.body }}>{c.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment"
                  className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: `1px solid ${T.line}`, color: T.ink }} />
                <Btn variant="dark" onClick={addComment}><Send size={14} /></Btn>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 px-5 py-3 flex flex-wrap gap-2"
          style={{ background: T.surface, borderTop: `1px solid ${T.line}` }}>
          <Btn variant="primary"><Check size={14} />Approve</Btn>
          <Btn variant="ghost"><CalendarDays size={14} />Reschedule</Btn>
          <Btn variant="ghost"><Send size={14} />Send reminder</Btn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><div className="text-xs mb-1.5" style={{ color: T.muted }}>{label}</div>{children}</div>;
}
function Block({ title, body, mono }) {
  return (
    <div>
      <div className="text-xs font-semibold mb-1.5" style={{ color: T.body }}>{title}</div>
      <p className="text-sm whitespace-pre-line" style={{ color: T.ink, lineHeight: 1.65, fontStyle: mono ? "italic" : "normal" }}>{body}</p>
    </div>
  );
}

/* =============================================================== AI STUDIO */
const CREATE_TYPES = [
  { key: "graphic", label: "Graphic", Icon: ImageIcon },
  { key: "post", label: "Social Post", Icon: FileText },
  { key: "reel", label: "Reel Idea", Icon: Video },
  { key: "script", label: "Video Script", Icon: FileText },
  { key: "caption", label: "Caption", Icon: MessageSquare },
  { key: "campaign", label: "Campaign", Icon: Sparkles },
  { key: "ideas", label: "Content Ideas", Icon: Lightbulb },
];

const EXAMPLES = [
  "Create a Christmas post for DELCO.",
  "Give me 5 funny HVAC Reel ideas.",
  "Create an Instagram post about changing your air filter.",
  "Write a script for Brian explaining why preventative maintenance matters.",
  "Turn this installation photo into a branded DELCO post.",
];

function AIStudio({ go }) {
  const [type, setType] = useState("graphic");
  const [prompt, setPrompt] = useState("");
  const [brandLock, setBrandLock] = useState(true);
  const [state, setState] = useState("idle"); // idle | working | done
  const [result, setResult] = useState(null);

  const run = () => {
    if (!prompt.trim()) return;
    setState("working");
    setTimeout(() => { setResult(mockGenerate(type, prompt)); setState("done"); }, 1400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Create with DELCO AI</h1>
        <p className="mt-1" style={{ color: T.body }}>Turn an idea into ready-to-post DELCO content.</p>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {CREATE_TYPES.map(t => {
            const on = type === t.key;
            return (
              <button key={t.key} onClick={() => { setType(t.key); setState("idle"); }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium"
                style={{ background: on ? T.navy : T.surface, color: on ? "#fff" : T.body, border: `1px solid ${on ? T.navy : T.line}` }}>
                <t.Icon size={13} />{t.label}
              </button>
            );
          })}
        </div>

        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
          placeholder="What do you want to create?"
          className="w-full rounded-lg px-4 py-3 text-base outline-none resize-none"
          style={{ border: `1px solid ${T.line}`, color: T.ink, background: "#FBFCFD" }} />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <button onClick={() => setBrandLock(v => !v)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{
              background: brandLock ? T.goodSoft : "#F1F3F7",
              color: brandLock ? T.good : T.muted,
              border: `1px solid ${brandLock ? "#BFE3D3" : T.line}`,
            }}>
            <Lock size={13} />DELCO Brand Lock: {brandLock ? "ON" : "OFF"}
          </button>
          <Btn variant="primary" onClick={run}>
            {state === "working" ? <><RefreshCw size={14} className="animate-spin" />Generating</> : <><Wand2 size={14} />Generate</>}
          </Btn>
        </div>

        {brandLock && (
          <p className="text-xs mt-3" style={{ color: T.muted }}>
            Using DELCO's logo, colors, fonts, voice and approved photos from Brand Hub.
          </p>
        )}
      </Card>

      {state === "idle" && (
        <div>
          <div className="text-xs font-semibold mb-2.5" style={{ color: T.body }}>Try one of these</div>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map(e => (
              <button key={e} onClick={() => setPrompt(e)}
                className="text-left rounded-lg px-4 py-2.5 text-sm"
                style={{ background: T.surface, border: `1px solid ${T.line}`, color: T.body }}>{e}</button>
            ))}
          </div>
        </div>
      )}

      {state === "working" && (
        <Card className="p-10 flex flex-col items-center gap-3">
          <RefreshCw size={22} className="animate-spin" style={{ color: T.cool }} />
          <p className="text-sm" style={{ color: T.body }}>Working from DELCO's brand kit…</p>
        </Card>
      )}

      {state === "done" && result && (
        <Card className="overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.line}` }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: T.goldInk }} />
              <span className="text-sm font-semibold" style={{ color: T.ink }}>{result.heading}</span>
            </div>
            {brandLock && <Pill tone={T.good} bg={T.goodSoft}><Lock size={11} />Brand Lock applied</Pill>}
          </div>

          <div className="p-5">
            {result.kind === "graphic" && <MockGraphic prompt={prompt} />}
            {result.kind === "text" && (
              <div className="space-y-4">
                {result.blocks.map((b, i) => <Block key={i} title={b.t} body={b.b} />)}
              </div>
            )}
            {result.kind === "list" && (
              <ol className="space-y-3">
                {result.items.map((it, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="rounded-md flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ width: 22, height: 22, background: T.goldSoft, color: T.goldInk }}>{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: T.ink }}>{it.t}</div>
                      <div className="text-sm mt-0.5" style={{ color: T.body }}>{it.b}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="px-5 py-3 flex flex-wrap gap-2" style={{ background: "#FAFBFC", borderTop: `1px solid ${T.line}` }}>
            <Btn size="sm" variant="ghost" onClick={run}><RefreshCw size={13} />Regenerate</Btn>
            <Btn size="sm" variant="ghost"><FileText size={13} />Edit</Btn>
            <Btn size="sm" variant="ghost"><MessageSquare size={13} />Change caption</Btn>
            <Btn size="sm" variant="ghost" onClick={() => go("library")}><Images size={13} />Save to library</Btn>
            <Btn size="sm" variant="ghost" onClick={() => go("planner")}><CalendarDays size={13} />Add to calendar</Btn>
            <Btn size="sm" variant="primary"><Send size={13} />Send for approval</Btn>
          </div>
        </Card>
      )}

      <p className="text-xs" style={{ color: T.muted }}>
        Prototype note: generation is simulated locally. Production connects to an image generation API and an LLM.
      </p>
    </div>
  );
}

/* Generated graphics are drawn as 1080x1080 SVG so the composition holds at any
   size — the same canvas the real image API would return. */
function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach(w => {
    if ((line + " " + w).trim().length > maxChars && line) { lines.push(line); line = w; }
    else line = (line + " " + w).trim();
  });
  if (line) lines.push(line);
  return lines;
}

const LOGO_W = 360, LOGO_H = 217, DOG_W = 180, DOG_H = 297;

/* Pick the largest size that still fits the longest line in the space we have. */
function fitSize(lines, maxWidth, cap) {
  const longest = lines.reduce((a, l) => Math.max(a, l.length), 0);
  return Math.min(cap, Math.floor(maxWidth / (longest * 0.56)));
}

/* Centred stack: logo, headline, mascot standing on a gold footer bar.
   The mascot resizes to whatever space the headline leaves, so a two-line and a
   four-line headline both stay balanced. */
function GraphicCentered({ headline, kicker }) {
  const lines = wrapText(headline.toUpperCase(), 15);
  const fs = fitSize(lines, 900, 84);
  const gap = fs * 1.06;
  const firstBaseline = 300;
  const lastBaseline = firstBaseline + (lines.length - 1) * gap;
  const kickerBaseline = lastBaseline + 50;
  const dogH = Math.max(310, Math.min(470, 1002 - (kickerBaseline + 44)));
  const dogW = dogH * DOG_W / DOG_H;
  return (
    <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width="1080" height="1080" fill={T.navy} />
      <circle cx="540" cy={1002 - dogH / 2} r={dogH * 0.66} fill="#FFFFFF" opacity="0.06" />
      <circle cx="1050" cy="60" r="300" fill="#FFFFFF" opacity="0.04" />
      <image href={DELCO_LOGO} x={(1080 - 280) / 2} y="56" width="280" height={280 * LOGO_H / LOGO_W} />
      {lines.map((l, i) => (
        <text key={i} x="540" y={firstBaseline + i * gap} textAnchor="middle" fill="#FFFFFF"
          fontSize={fs} fontWeight="800" letterSpacing="-1"
          fontFamily="ui-sans-serif, system-ui, sans-serif">{l}</text>
      ))}
      <text x="540" y={kickerBaseline} textAnchor="middle" fill="rgba(255,255,255,.74)"
        fontSize="28" fontWeight="500" fontFamily="ui-sans-serif, system-ui, sans-serif">{kicker}</text>
      <image href={DELCO_MASCOT} x={(1080 - dogW) / 2} y={1002 - dogH} width={dogW} height={dogH} />
      <rect x="0" y="990" width="1080" height="90" fill={T.gold} />
      <text x="540" y="1049" textAnchor="middle" fill={T.navy} fontSize="34" fontWeight="800"
        letterSpacing="1" fontFamily="ui-sans-serif, system-ui, sans-serif">(732) 360-6201 · CALLDELCO.COM</text>
    </svg>
  );
}

/* Split: message and call to action on the left, mascot filling the right edge. */
function GraphicSplit({ headline, kicker }) {
  const lines = wrapText(headline.toUpperCase(), 12);
  const fs = fitSize(lines, 520, 76);
  const gap = fs * 1.08;
  const dogH = 780, dogW = dogH * DOG_W / DOG_H;
  const firstBaseline = 470 - (lines.length - 1) * gap / 2;
  const lastBaseline = firstBaseline + (lines.length - 1) * gap;
  return (
    <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width="1080" height="1080" fill={T.cool} />
      <path d="M1080 120 L1080 1080 L470 1080 Z" fill={T.navy} opacity="0.22" />
      <image href={DELCO_LOGO} x="70" y="66" width="250" height={250 * LOGO_H / LOGO_W} />
      <image href={DELCO_MASCOT} x={1080 - dogW - 24} y={1008 - dogH} width={dogW} height={dogH} />
      {lines.map((l, i) => (
        <text key={i} x="70" y={firstBaseline + i * gap} fill="#FFFFFF"
          fontSize={fs} fontWeight="800" letterSpacing="-1"
          fontFamily="ui-sans-serif, system-ui, sans-serif">{l}</text>
      ))}
      <text x="70" y={lastBaseline + 48} fill="rgba(255,255,255,.88)"
        fontSize="26" fontWeight="500" fontFamily="ui-sans-serif, system-ui, sans-serif">{kicker}</text>
      <rect x="70" y="862" width="404" height="92" rx="10" fill={T.gold} />
      <text x="272" y="920" textAnchor="middle" fill={T.navy} fontSize="30" fontWeight="800"
        letterSpacing="1" fontFamily="ui-sans-serif, system-ui, sans-serif">GET A FREE ESTIMATE</text>
      <text x="70" y="1016" fill="#FFFFFF" fontSize="30" fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif">(732) 360-6201</text>
    </svg>
  );
}

function graphicCopy(prompt) {
  const p = prompt.toLowerCase();
  if (/christmas|santa|holiday/.test(p))
    return { headline: "Merry Christmas from the DELCO family", kicker: "Warm homes, all season long" };
  if (/filter/.test(p))
    return { headline: "Change your filter every 90 days", kicker: "Two minutes. Lower bills." };
  if (/winter|furnace|heat/.test(p))
    return { headline: "Is your system ready for winter?", kicker: "$89 fall tune-up through October 31" };
  if (/tune|maintenance|offer|special/.test(p))
    return { headline: "$89 fall tune-up", kicker: "21-point inspection · Through October 31" };
  if (/ac|cooling|summer/.test(p))
    return { headline: "Cool house. Honest price.", kicker: "Same-week AC service across Central Jersey" };
  return { headline: "The name you trust", kicker: "Heating and cooling · Central New Jersey" };
}

function MockGraphic({ prompt }) {
  const copy = graphicCopy(prompt);
  const variants = [
    { label: "Centered", node: <GraphicCentered {...copy} /> },
    { label: "Split", node: <GraphicSplit {...copy} /> },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {variants.map((v, i) => (
        <div key={v.label} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
          {v.node}
          <div className="px-3 py-2 flex items-center justify-between" style={{ background: T.surface }}>
            <span className="text-xs" style={{ color: T.muted }}>{v.label} · 1080×1080</span>
            <div className="flex gap-1">
              <Btn size="sm" variant="quiet"><RefreshCw size={12} /></Btn>
              <Btn size="sm" variant="quiet"><Download size={12} /></Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function mockGenerate(type, prompt) {
  if (type === "graphic") return { kind: "graphic", heading: "Two branded options" };
  if (type === "ideas" || type === "reel") {
    return {
      kind: "list", heading: "Five ideas for DELCO",
      items: [
        { t: "The thermostat war", b: "Brian settles the 68 vs 72 argument with the actual cost difference per month in a Central Jersey home." },
        { t: "What's in your filter", b: "Pull a filter that hasn't been changed since spring. No commentary needed — the visual does it." },
        { t: "Two-minute furnace check", b: "The three things a homeowner can safely check before calling anyone." },
        { t: "Attic in August", b: "Thermometer reading in an unconditioned attic, then the same reading after the job. Great heat-of-summer content." },
        { t: "Meet the DELCO dog", b: "Shop mascot doing rounds. Best-performing non-service content you have." },
      ],
    };
  }
  if (type === "campaign") {
    return {
      kind: "list", heading: "Fall maintenance campaign — four weeks",
      items: [
        { t: "Week 1 — Educate", b: "Reel: why bills climb in the fall. No offer, pure value." },
        { t: "Week 2 — Prove", b: "Before/after carousel from a recent changeout, plus a customer review graphic." },
        { t: "Week 3 — Offer", b: "$89 tune-up graphic and a short Brian video explaining what the 21 points actually are." },
        { t: "Week 4 — Urgency", b: "Last-week reminder with the Oct 31 expiry, plus a Story countdown." },
      ],
    };
  }
  return {
    kind: "text", heading: "Draft ready",
    blocks: [
      { t: "Hook", b: "You're changing your filter wrong — and it's costing you every month." },
      { t: "Body", b: "A one-inch filter needs replacing every 60 to 90 days. In a house with pets, closer to 30.\n\nWhen it clogs, your blower works harder to pull the same air through. That's more runtime, a higher bill, and eventually a frozen coil.\n\nWrite the date on the edge of the filter in marker when you install it. Easiest habit in home ownership." },
      { t: "Caption", b: "Two minutes, about eight dollars, and it's the single cheapest thing you can do for your system. Write the date on the edge so you're not guessing next time. 🗓️" },
      { t: "Suggested platforms", b: "Instagram Reel, Facebook, TikTok — post between 6 and 8 PM." },
    ],
  };
}

/* ============================================================== REQUESTS */
function RequestCard({ r, waiting, onOpen, onDragStart }) {
  return (
    <Card hover className="p-3.5" onClick={onOpen}
      style={{ borderTop: `3px solid ${waiting ? T.gold : T.line}` }}>
      <div draggable onDragStart={onDragStart}>
        <div className="text-sm font-medium leading-snug" style={{ color: T.ink }}>{r.title}</div>
        <div className="text-xs mt-1.5" style={{ color: T.muted }}>From {r.from}</div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs flex items-center gap-1" style={{ color: T.body }}>
            <Clock size={11} />Due {r.due}
          </span>
          {r.files > 0 && (
            <span className="text-xs flex items-center gap-1" style={{ color: T.good }}>
              <Paperclip size={11} />{r.files}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function Requests() {
  const narrow = useIsNarrow();
  const [reqs, setReqs] = useState(REQUESTS);
  const [sel, setSel] = useState(null);
  const [drag, setDrag] = useState(null);
  const selected = reqs.find(r => r.id === sel);

  const move = (col) => {
    if (!drag) return;
    setReqs(prev => prev.map(r => r.id === drag ? { ...r, column: col } : r));
    setDrag(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Content requests</h1>
          <p className="mt-1 text-sm" style={{ color: T.body }}>Two items are waiting on DELCO. Everything else is with the marketing team.</p>
        </div>
        <Btn variant="primary"><Plus size={14} />New request</Btn>
      </div>

      {narrow ? (
        <div className="space-y-6">
          {REQ_COLUMNS.map(col => {
            const items = reqs.filter(r => r.column === col.key);
            const waiting = col.key === "waiting";
            if (items.length === 0) return null;
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold" style={{ color: waiting ? T.goldInk : T.ink }}>{col.label}</span>
                  <span className="text-xs rounded-full px-2 py-0.5"
                    style={{ background: waiting ? T.goldSoft : "#F1F3F7", color: waiting ? T.goldInk : T.muted }}>{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map(r => (
                    <RequestCard key={r.id} r={r} waiting={waiting} onOpen={() => setSel(r.id)} onDragStart={() => {}} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ maxWidth: "100%" }}>
          {REQ_COLUMNS.map(col => {
            const items = reqs.filter(r => r.column === col.key);
            const waiting = col.key === "waiting";
            return (
              <div key={col.key} className="shrink-0" style={{ width: 268, minWidth: 268 }}
                onDragOver={e => e.preventDefault()} onDrop={() => move(col.key)}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-sm font-semibold" style={{ color: waiting ? T.goldInk : T.ink }}>{col.label}</span>
                  <span className="text-xs rounded-full px-2 py-0.5"
                    style={{ background: waiting ? T.goldSoft : "#F1F3F7", color: waiting ? T.goldInk : T.muted }}>{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map(r => (
                    <RequestCard key={r.id} r={r} waiting={waiting}
                      onOpen={() => setSel(r.id)} onDragStart={() => setDrag(r.id)} />
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-lg py-6 text-center text-xs"
                      style={{ border: `1px dashed ${T.line}`, color: T.muted }}>Nothing here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MobileUploadPreview />

      {selected && <RequestPanel r={selected} onClose={() => setSel(null)} />}
    </div>
  );
}

function RequestPanel({ r, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(11,27,51,.4)" }} onClick={onClose}>
      <div className="w-full max-w-lg overflow-y-auto"
        style={{ background: T.surface, height: "100dvh", overscrollBehavior: "contain" }}
        onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-start justify-between gap-4" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div>
            <div className="text-xs mb-1" style={{ color: T.muted }}>Requested from {r.from}</div>
            <h2 className="text-xl font-semibold tracking-tight" style={{ color: T.ink }}>{r.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5" style={{ border: `1px solid ${T.line}` }}><X size={16} /></button>
        </div>

        <div className="p-5 space-y-5">
          <Block title="Request" body={r.ask} />
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: T.body }}>Requirements</div>
            <ul className="space-y-1.5">
              {r.requirements.map((q, i) => (
                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: T.ink }}>
                  <CheckCircle2 size={13} style={{ color: T.good }} />{q}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Due"><span className="text-sm" style={{ color: T.ink }}>{r.due}</span></Field>
            <Field label="Assigned to"><span className="text-sm" style={{ color: T.ink }}>{r.assignee}</span></Field>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: T.body }}>Files</div>
            {r.files > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: Math.min(r.files, 4) }).map((_, i) => (
                  <Thumb key={i} tone={i % 2 ? T.cool : T.warm} Icon={i % 2 ? Video : Camera} ratio="aspect-square" />
                ))}
              </div>
            ) : (
              <div className="rounded-lg py-8 flex flex-col items-center gap-2"
                style={{ border: `1px dashed ${T.line}` }}>
                <Upload size={18} style={{ color: T.muted }} />
                <span className="text-sm" style={{ color: T.body }}>Nothing uploaded yet</span>
                <Btn size="sm" variant="ghost">Choose files</Btn>
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-semibold mb-3" style={{ color: T.body }}>Activity</div>
            <ActivityList items={r.activity} />
          </div>
        </div>

        <div className="sticky bottom-0 px-5 py-3 flex flex-wrap gap-2" style={{ background: T.surface, borderTop: `1px solid ${T.line}` }}>
          <Btn variant="primary"><Send size={14} />Send reminder</Btn>
          <Btn variant="ghost"><Check size={14} />Mark complete</Btn>
          <Btn variant="ghost"><User size={14} />Reassign</Btn>
        </div>
      </div>
    </div>
  );
}

function MobileUploadPreview() {
  return (
    <Card className="p-5">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="font-semibold tracking-tight" style={{ color: T.ink }}>Phone upload for the field team</h3>
          <p className="text-sm mt-2" style={{ color: T.body, maxWidth: "60ch" }}>
            Technicians get a text with a link. No app, no login — they see what's being asked for, tap, and upload
            straight from the job. The request updates here the moment files land.
          </p>
          <div className="flex gap-2 mt-4">
            <Btn size="sm" variant="ghost"><Send size={13} />Text the link</Btn>
            <Btn size="sm" variant="quiet">Preview</Btn>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="rounded-3xl p-3" style={{ width: 220, background: T.navy }}>
            <div className="rounded-2xl p-3.5" style={{ background: T.surface }}>
              <div className="mb-3"><DelcoMark h={26} /></div>
              <div className="text-sm font-semibold leading-snug" style={{ color: T.ink }}>Upload 3 install videos</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>Due Sep 10 · Vertical, 10–30 sec</div>
              <div className="rounded-lg mt-3 py-5 flex flex-col items-center gap-1.5" style={{ border: `1px dashed ${T.line}` }}>
                <Camera size={16} style={{ color: T.muted }} />
                <span className="text-xs" style={{ color: T.body }}>Take or choose</span>
              </div>
              <div className="rounded-lg mt-2.5 py-2 text-center text-xs font-bold tracking-wide"
                style={{ background: T.gold, color: T.navy }}>UPLOAD</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ================================================================ LIBRARY */
function Library() {
  const [cat, setCat] = useState("All");
  const [tags, setTags] = useState([]);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);

  const toggle = (t) => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const items = LIBRARY.filter(a =>
    (cat === "All" || a.cat === cat) &&
    (tags.length === 0 || tags.some(t => a.tags.includes(t))) &&
    (q === "" || a.name.toLowerCase().includes(q.toLowerCase()))
  );
  const selected = LIBRARY.find(a => a.id === sel);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Content library</h1>
          <p className="mt-1 text-sm" style={{ color: T.body }}>Every photo, video and graphic DELCO has, in one place.</p>
        </div>
        <Btn variant="primary"><Upload size={14} />Upload media</Btn>
      </div>

      <div className="flex flex-wrap gap-2">
        {LIB_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className="rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{ background: cat === c ? T.navy : T.surface, color: cat === c ? "#fff" : T.body, border: `1px solid ${cat === c ? T.navy : T.line}` }}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1"
          style={{ background: T.surface, border: `1px solid ${T.line}` }}>
          <Search size={14} style={{ color: T.muted }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search filenames and tags"
            className="flex-1 text-sm outline-none" style={{ color: T.ink }} />
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: T.muted }}><Filter size={13} />Filters</div>
        <div className="flex flex-wrap gap-1.5">
          {LIB_TAGS.map(t => {
            const on = tags.includes(t);
            return (
              <button key={t} onClick={() => toggle(t)} className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: on ? T.coolSoft : T.surface, color: on ? T.cool : T.body, border: `1px solid ${on ? "#BEDBF6" : T.line}` }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {items.length === 0 ? (
        <Card className="py-16 flex flex-col items-center gap-2">
          <Images size={20} style={{ color: T.muted }} />
          <p className="text-sm" style={{ color: T.body }}>Nothing matches those filters. Clear a tag or upload new media.</p>
          <Btn size="sm" variant="ghost" onClick={() => { setTags([]); setQ(""); setCat("All"); }}>Clear filters</Btn>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(a => (
            <Card key={a.id} hover className="p-2.5" onClick={() => setSel(a.id)}
              style={{ outline: sel === a.id ? `2px solid ${T.cool}` : "none" }}>
              <Thumb tone={a.tone} Icon={a.Icon} ratio="aspect-video" play={a.name.endsWith(".mp4")} />
              <div className="mt-2.5 px-0.5">
                <div className="text-sm font-medium truncate" style={{ color: T.ink }}>{a.name}</div>
                <div className="text-xs mt-0.5" style={{ color: T.muted }}>{a.date}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.tags.map(t => <Pill key={t}>{t}</Pill>)}
                </div>
                {a.used.length > 0 && (
                  <div className="text-xs mt-2 truncate" style={{ color: T.muted }}>Used in {a.used[0]}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed left-0 right-0 bottom-0 z-30 px-4 pb-4 flex justify-center pointer-events-none">
          <div className="rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 pointer-events-auto"
            style={{ background: T.navy, boxShadow: shadowLift, maxWidth: "100%" }}>
            <span className="text-sm font-medium truncate" style={{ color: "#fff", maxWidth: 200 }}>{selected.name}</span>
            <div className="flex flex-wrap gap-2">
              <Btn size="sm" variant="ghost"><FileText size={13} />Create post</Btn>
              <Btn size="sm" variant="ghost"><Wand2 size={13} />Create graphic</Btn>
              <Btn size="sm" variant="ghost"><CalendarDays size={13} />Add to calendar</Btn>
              <Btn size="sm" variant="ghost"><Download size={13} /></Btn>
              <Btn size="sm" variant="ghost"><Share2 size={13} /></Btn>
              <button onClick={() => setSel(null)} className="p-1.5 rounded-lg" style={{ color: "#fff" }}><X size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================== ANALYTICS */
function Analytics({ content }) {
  const [platform, setPlatform] = useState("All Platforms");
  const [range, setRange] = useState("30 Days");

  const metrics = [
    { label: "Followers", value: "7,485", delta: "+12.4%", up: true },
    { label: "Follower growth", value: "+826", delta: "vs +341 prior", up: true },
    { label: "Reach", value: "94,240", delta: "+38%", up: true },
    { label: "Impressions", value: "142,910", delta: "+31%", up: true },
    { label: "Engagement", value: "6.4%", delta: "+1.8 pts", up: true },
    { label: "Profile visits", value: "3,912", delta: "+22%", up: true },
    { label: "Website clicks", value: "614", delta: "+9%", up: true },
    { label: "Leads", value: "—", delta: "Available once tracking is connected", up: null },
  ];

  const top = content.filter(c => c.stats).sort((a, b) => b.stats.views - a.stats.views);

  const insights = [
    "Educational videos featuring Brian are generating 2.4x more engagement than static graphics.",
    "Installation videos receive 38% more reach than promotional content.",
    "Posts published between 6 and 8 PM are currently performing best.",
    "TikTok followers doubled in five weeks off two install walkthroughs — the format is working there.",
  ];
  const moves = [
    "Film 2 more educational Brian videos",
    "Increase installation content",
    "Reduce promotional graphics",
    "Post 4 times next week",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Analytics</h1>
          <p className="mt-1 text-sm" style={{ color: T.body }}>August 3 – September 1, 2026</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={platform} onChange={setPlatform} options={["All Platforms", "Instagram", "Facebook", "TikTok"]} />
          <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
            {["7 Days", "30 Days", "90 Days", "Custom"].map(r => (
              <button key={r} onClick={() => setRange(r)} className="px-3 py-1.5 text-sm font-medium"
                style={{ background: range === r ? T.navy : T.surface, color: range === r ? "#fff" : T.body }}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(m => (
          <Card key={m.label} className="p-4">
            <div className="text-xs" style={{ color: T.muted }}>{m.label}</div>
            <div className="text-2xl font-semibold mt-1.5 tracking-tight" style={{ color: T.ink, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
            <div className="text-xs mt-1 flex items-center gap-1" style={{ color: m.up === null ? T.muted : T.good }}>
              {m.up && <ArrowUpRight size={12} />}{m.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-4">
          <SectionHead title="Follower growth" sub="By platform" />
          <LineChartSVG data={FOLLOWER_DATA} height={220}
            series={[{ k: "fb", label: "Facebook", color: "#1877F2" },
                     { k: "ig", label: "Instagram", color: "#C13584" },
                     { k: "tt", label: "TikTok", color: T.ink }]} />
        </Card>

        <Card className="p-4">
          <SectionHead title="Reach over time" sub="All platforms combined" />
          <AreaChartSVG data={REACH_DATA} k="v" height={220} />
        </Card>

        <Card className="p-4 lg:col-span-2">
          <SectionHead title="Engagement rate" sub="Weekly average, percent" />
          <BarChartSVG data={ENGAGE_DATA} k="v" height={200} />
        </Card>
      </div>

      <div>
        <SectionHead title="Top performing content" sub="Last 30 days" />
        <div className="grid md:grid-cols-3 gap-4">
          {top.map(c => (
            <Card key={c.id} className="p-3">
              <Thumb tone={c.thumb.tone} Icon={c.thumb.Icon} play={c.format === "Reel"} />
              <div className="mt-3">
                <div className="flex items-center gap-1.5 mb-1"><PlatformIcon id={c.platform} size={12} />
                  <span className="text-xs" style={{ color: T.muted }}>{c.format}</span></div>
                <div className="font-medium leading-snug" style={{ color: T.ink }}>{c.title}</div>
              </div>
              <div className="grid grid-cols-3 gap-y-3 mt-4 pt-3" style={{ borderTop: `1px solid ${T.line}` }}>
                <Metric label="Views" value={fmtNum(c.stats.views)} />
                <Metric label="Reach" value={fmtNum(c.stats.reach)} />
                <Metric label="Likes" value={fmtNum(c.stats.likes)} />
                <Metric label="Comments" value={c.stats.comments} />
                <Metric label="Shares" value={c.stats.shares} />
                <Metric label="Eng. rate" value={`${((c.stats.likes + c.stats.comments + c.stats.shares) / c.stats.reach * 100).toFixed(1)}%`} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} style={{ color: T.goldInk }} />
            <h2 className="font-semibold tracking-tight" style={{ color: T.ink }}>What's working</h2>
          </div>
          <ul className="space-y-3">
            {insights.map((s, i) => (
              <li key={i} className="text-sm flex gap-2.5" style={{ color: T.body, lineHeight: 1.6 }}>
                <span className="rounded-full mt-2 shrink-0" style={{ width: 5, height: 5, background: T.goldInk }} />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold tracking-tight mb-4" style={{ color: T.ink }}>Recommended next moves</h2>
          <div className="space-y-2">
            {moves.map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: "#FAFBFC" }}>
                <span className="text-sm" style={{ color: T.ink }}>{m}</span>
                <Btn size="sm" variant="ghost">Add to plan</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="text-xs" style={{ color: T.muted }}>{label}</div>
      <div className="text-sm font-semibold mt-0.5" style={{ color: T.ink, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="rounded-lg px-3 py-1.5 text-sm font-medium outline-none"
      style={{ background: T.surface, border: `1px solid ${T.line}`, color: T.body }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

/* =============================================================== BRAND HUB */
function BrandHub() {
  const colors = [
    { name: "DELCO Gold", hex: T.gold, use: "Shield border, buttons, calls to action" },
    { name: "Shield Navy", hex: T.navy, use: "Backgrounds, headlines, uniforms" },
    { name: "Banner Blue", hex: T.cool, use: "Secondary panels and cooling content" },
    { name: "Burnt Orange", hex: T.warm, use: "Heating and seasonal accents" },
    { name: "Off White", hex: T.paper, use: "Space and light backgrounds" },
  ];
  const voice = ["Professional", "Local", "Friendly", "Helpful", "Straightforward", "Occasionally humorous"];
  const avoid = ["Overly corporate language", "Generic AI language", "Excessive emojis", "Aggressive sales language"];
  const services = ["AC repair", "AC installation", "Furnace repair", "Furnace installation", "Ductless mini-splits", "Water heaters", "Plumbing", "Maintenance plans"];
  const areas = ["Sayreville", "Old Bridge", "East Brunswick", "Parlin", "Matawan", "Edison", "Woodbridge", "South River"];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Brand hub</h1>
        <p className="mt-1" style={{ color: T.body }}>Everything DELCO AI uses when it creates content. Update it here, and every new post follows it.</p>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Lock size={15} style={{ color: T.good }} />
          <span className="text-sm font-medium" style={{ color: T.ink }}>DELCO AI uses these assets when creating branded content.</span>
          <Pill tone={T.good} bg={T.goodSoft}>Brand Lock on by default</Pill>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionHead title="Logo" sub="Primary, reversed and icon versions" />
          <div className="rounded-lg flex flex-col items-center justify-center py-8 gap-3"
            style={{ border: `1px solid ${T.line}`, background: "#FAFBFC" }}>
            <DelcoMark h={92} />
            <span className="text-xs" style={{ color: T.muted }}>delco-logo-primary.png · loaded</span>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost">Replace</Btn>
              <Btn size="sm" variant="ghost">Add reversed version</Btn>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Brand colors" sub="Pulled from the logo" />
          <div className="space-y-2.5">
            {colors.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="rounded-md shrink-0" style={{ width: 34, height: 34, background: c.hex, border: `1px solid ${T.line}` }} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium" style={{ color: T.ink }}>{c.name}</div>
                  <div className="text-xs truncate" style={{ color: T.muted }}>{c.use}</div>
                </div>
                <span className="text-xs" style={{ color: T.muted, fontVariantNumeric: "tabular-nums" }}>{c.hex}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Fonts" sub="Used on every generated graphic" />
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-extrabold tracking-tight" style={{ color: T.ink }}>THE NAME YOU TRUST FOR HEATING &amp; COOLING</div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>Headlines · Heavy, condensed, uppercase</div>
            </div>
            <div>
              <div className="text-sm" style={{ color: T.body, lineHeight: 1.6 }}>
                From high-efficiency installations to precision emergency repairs, DELCO provides the quality and care your home deserves.
              </div>
              <div className="text-xs mt-1" style={{ color: T.muted }}>Body · Regular</div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Brand voice" sub="How DELCO sounds" />
          <div className="flex flex-wrap gap-2 mb-4">
            {voice.map(v => <Pill key={v} tone={T.good} bg={T.goodSoft}><Check size={11} />{v}</Pill>)}
          </div>
          <div className="text-xs font-semibold mb-2" style={{ color: T.body }}>Avoid</div>
          <div className="flex flex-wrap gap-2">
            {avoid.map(v => <Pill key={v} tone={T.gold} bg={T.goldSoft}><X size={11} />{v}</Pill>)}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Mascot" sub="The caped DELCO dog — seasonal, team and community content" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-lg flex items-center justify-center aspect-square overflow-hidden"
                style={{ background: i === 1 ? T.navy : "#EDF2F8" }}><MascotMark h={74} /></div>
            ))}
            <button className="rounded-lg flex flex-col items-center justify-center gap-1 aspect-square"
              style={{ border: `1px dashed ${T.line}`, background: "#FAFBFC" }}>
              <Plus size={15} style={{ color: T.muted }} />
              <span className="text-xs" style={{ color: T.muted }}>Add</span>
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: T.muted }}>Upload several angles so AI-generated graphics stay recognizable.</p>
        </Card>

        <Card className="p-5">
          <SectionHead title="Approved photos" sub="Safe to use in any post without checking" />
          <div className="grid grid-cols-4 gap-2">
            {LIBRARY.filter(a => a.cat === "Photos").slice(0, 4).map(a =>
              <Thumb key={a.id} tone={a.tone} Icon={a.Icon} ratio="aspect-square" />)}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Services" />
          <div className="flex flex-wrap gap-2">{services.map(s => <Pill key={s}>{s}</Pill>)}</div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Service area" sub="Central New Jersey" />
          <div className="flex flex-wrap gap-2">
            {areas.map(a => <Pill key={a} tone={T.cool} bg={T.coolSoft}><MapPin size={11} />{a}</Pill>)}
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Company information" />
          <div className="space-y-2.5 text-sm">
            <Row label="Legal name" value="DELCO Heating & Cooling" />
            <Row label="Owner" value="Brian Guthmiller" />
            <Row label="Phone" value="(732) 360-6201" />
            <Row label="Website" value="calldelco.com" />
            <Row label="Availability" value="24/7" />
            <Row label="Years in business" value="15+" />
            <Row label="Google rating" value="4.8" />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHead title="Current offers" sub="AI will only reference live offers" />
          <div className="space-y-2">
            <div className="rounded-lg px-3 py-2.5 flex items-center justify-between" style={{ background: T.warmSoft }}>
              <div>
                <div className="text-sm font-medium" style={{ color: T.ink }}>$89 fall tune-up</div>
                <div className="text-xs" style={{ color: T.body }}>21-point inspection · Expires Oct 31</div>
              </div>
              <Pill tone={T.good} bg={T.goodSoft}>Live</Pill>
            </div>
            <div className="rounded-lg px-3 py-2.5 flex items-center justify-between" style={{ background: "#FAFBFC" }}>
              <div>
                <div className="text-sm font-medium" style={{ color: T.ink }}>$500 off full system replacement</div>
                <div className="text-xs" style={{ color: T.body }}>Expired Aug 31</div>
              </div>
              <Pill>Expired</Pill>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0" style={{ color: T.muted }}>{label}</span>
      <span className="font-medium text-right" style={{ color: T.ink }}>{value}</span>
    </div>
  );
}

/* ================================================================ SETTINGS */
function Settings() {
  const connections = [
    { name: "Instagram / Meta", note: "Publishing and insights", Icon: Instagram },
    { name: "Facebook Pages", note: "Publishing and insights", Icon: Facebook },
    { name: "TikTok", note: "Publishing and insights", Icon: Music2 },
    { name: "Image generation", note: "Branded graphic creation", Icon: Wand2 },
    { name: "AI assistant", note: "Drafting, ideas and answers", Icon: Sparkles },
    { name: "Media storage", note: "Photos and video from the field", Icon: Images },
  ];
  const team = [
    { name: "Brian Guthmiller", role: "Owner · Approves and appears on camera" },
    { name: "Christopher Waltein", role: "Admin · Final approval" },
    { name: "Field Team", role: "Uploads photos and video from jobs" },
    { name: "Around SA Marketing", role: "Plans, produces and schedules" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: T.ink }}>Settings</h1>
        <p className="mt-1" style={{ color: T.body }}>Accounts, people and reminders.</p>
      </div>

      <Card>
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.line}` }}>
          <h2 className="font-semibold tracking-tight" style={{ color: T.ink }}>Connections</h2>
          <p className="text-sm mt-1" style={{ color: T.body }}>
            None of these are connected yet. This prototype runs entirely on demo data.
          </p>
        </div>
        {connections.map((c, i) => (
          <div key={c.name} className="px-5 py-3.5 flex items-center gap-3" style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
            <c.Icon size={16} style={{ color: T.muted }} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: T.ink }}>{c.name}</div>
              <div className="text-xs" style={{ color: T.muted }}>{c.note}</div>
            </div>
            <Pill>Not connected</Pill>
            <Btn size="sm" variant="ghost">Connect</Btn>
          </div>
        ))}
      </Card>

      <Card>
        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.line}` }}>
          <h2 className="font-semibold tracking-tight" style={{ color: T.ink }}>People</h2>
        </div>
        {team.map((m, i) => (
          <div key={m.name} className="px-5 py-3.5 flex items-center gap-3" style={{ borderTop: i ? `1px solid ${T.line}` : "none" }}>
            <div className="rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ width: 32, height: 32, background: T.navy, color: "#fff" }}>{m.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: T.ink }}>{m.name}</div>
              <div className="text-xs" style={{ color: T.muted }}>{m.role}</div>
            </div>
            <Btn size="sm" variant="quiet">Edit</Btn>
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold tracking-tight mb-3" style={{ color: T.ink }}>Reminders</h2>
        <div className="space-y-3">
          {[
            ["Text the assignee 3 days before a due date", true],
            ["Text again the morning something is due", true],
            ["Email Chris when content is ready for approval", true],
            ["Weekly Monday summary to Brian", false],
          ].map(([label, on]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: T.ink }}>{label}</span>
              <span className="rounded-full flex items-center px-0.5"
                style={{ width: 38, height: 22, background: on ? T.good : T.line, justifyContent: on ? "flex-end" : "flex-start" }}>
                <span className="rounded-full" style={{ width: 18, height: 18, background: "#fff" }} />
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================== AI ASSISTANT */
const ASSISTANT_SUGGESTIONS = [
  "What should we post this week?",
  "What content are we waiting on?",
  "Give me 5 ideas for September.",
  "What performed best last month?",
  "Do we have enough content scheduled next week?",
];

function assistantReply(q) {
  const s = q.toLowerCase();
  if (s.includes("waiting")) return "Two things are sitting with DELCO right now.\n\nBrian owes the '3 Signs Your AC Needs Service' recording — due September 8, requested August 28, reminder sent September 1.\n\nChris has the fall maintenance campaign to approve — five assets, due September 10.\n\nThe field team already delivered this week's install videos, so nothing is blocked there.";
  if (s.includes("post this week")) return "You have three slots to fill this week.\n\nTuesday: Technician Tuesday with Marcus. Just needs a 20-second vertical clip from the van.\n\nWednesday: the Sayreville install post is drafted and waiting on Chris.\n\nFriday: I'd add an educational Reel — those are outperforming graphics 2.4 to 1 right now. The air filter script is ready to shoot.";
  if (s.includes("performed best") || s.includes("best last month")) return "The mini-split walkthrough Reel, by a wide margin — 24,810 views and 121 shares, published September 2 at 6 PM.\n\nSecond was the Old Bridge furnace replacement photo post at 8,420 views. The $89 offer graphic came third at 5,240, which is the pattern all month: real jobs beat promotional graphics.";
  if (s.includes("ideas")) return "Five for September:\n\n1. What's actually in your filter — pull a neglected one on camera.\n2. Attic temperature before and after a job.\n3. The thermostat argument, settled with real numbers.\n4. Two things to check before you call for no heat.\n5. Meet the DELCO dog — your best-performing non-service content.\n\nWant me to write scripts for any of these?";
  if (s.includes("enough content") || s.includes("next week")) return "Not quite. Next week has two scheduled posts and one draft. Your average is four a week, and reach drops noticeably in weeks with fewer than three.\n\nThe fastest fix: the field team's three install videos landed September 7 and haven't been used yet. That's two posts already shot.";
  if (s.includes("campaign") || s.includes("fall")) return "Here's a four-week fall maintenance run:\n\nWeek 1 — educate. Why bills climb in fall. No offer.\nWeek 2 — prove. Before/after carousel plus a customer review graphic.\nWeek 3 — offer. The $89 tune-up with Brian explaining the 21 points.\nWeek 4 — urgency. Last call before the October 31 expiry.\n\nSay the word and I'll draft all four and drop them on the calendar.";
  return "Here's where DELCO stands today: 18 posts this month, 6 scheduled, 2 waiting on approval and 3 pieces of content still needed. Reach is up 38% over the last 30 days, driven almost entirely by installation video.\n\nAsk me about the calendar, what's outstanding, what's performing, or ask me to build something.";
}

function Assistant({ open, onClose }) {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Morning. I've got DELCO's calendar, brand, uploads and analytics loaded. What do you need?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMsgs(m => [...m, { role: "me", text: q }]);
    setInput("");
    setTimeout(() => setMsgs(m => [...m, { role: "ai", text: assistantReply(q) }]), 500);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(11,27,51,.4)" }} onClick={onClose}>
      <div className="w-full max-w-md flex flex-col"
        style={{ background: T.surface, height: "100dvh", overscrollBehavior: "contain" }}
        onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.line}` }}>
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg flex items-center justify-center" style={{ width: 30, height: 30, background: T.navy }}>
              <Sparkles size={15} style={{ color: "#fff" }} />
            </div>
            <div>
              <div className="font-semibold tracking-tight" style={{ color: T.ink }}>LUNA</div>
              <div className="text-xs" style={{ color: T.muted }}>DELCO's marketing assistant</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5" style={{ border: `1px solid ${T.line}` }}><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "me" ? "flex justify-end" : ""}>
              <div className="rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-line"
                style={{
                  maxWidth: "88%", lineHeight: 1.6,
                  background: m.role === "me" ? T.navy : "#F4F6F9",
                  color: m.role === "me" ? "#fff" : T.ink,
                }}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {ASSISTANT_SUGGESTIONS.slice(0, 3).map(s => (
            <button key={s} onClick={() => send(s)} className="rounded-full px-2.5 py-1 text-xs"
              style={{ border: `1px solid ${T.line}`, color: T.body }}>{s}</button>
          ))}
        </div>

        <div className="px-5 py-3 flex gap-2" style={{ borderTop: `1px solid ${T.line}` }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about content, calendar or performance"
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ border: `1px solid ${T.line}`, color: T.ink }} />
          <Btn variant="dark" onClick={() => send()}><Send size={14} /></Btn>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== APP */
const NAV = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "planner", label: "Content Planner", Icon: CalendarDays },
  { key: "ai", label: "Create with AI", Icon: Sparkles },
  { key: "requests", label: "Content Requests", Icon: Inbox, badge: 2 },
  { key: "library", label: "Content Library", Icon: Images },
  { key: "analytics", label: "Analytics", Icon: BarChart3 },
  { key: "brand", label: "Brand Hub", Icon: Palette },
  { key: "settings", label: "Settings", Icon: SettingsIcon },
];

function App() {
  const [view, setView] = useState("dashboard");
  const [content, setContent] = useState(CONTENT);
  const [openId, setOpenId] = useState(null);
  const [assistant, setAssistant] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState(true);

  const go = (v) => { setView(v); setMenu(false); };
  const item = content.find(c => c.id === openId);

  const Sidebar = (
    <aside className="flex flex-col h-full" style={{ background: T.navy, width: 248 }}>
      <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,.10)" }}>
        <DelcoMark h={40} />
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight" style={{ color: "#fff" }}>Social Hub</div>
          <div className="text-xs truncate" style={{ color: T.gold, fontWeight: 700 }}>DEMO VERSION</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(n => {
          const on = view === n.key;
          return (
            <button key={n.key} onClick={() => go(n.key)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
              style={{
                background: on ? T.navySoft : "transparent",
                color: on ? "#fff" : "rgba(255,255,255,.68)",
                borderLeft: `2px solid ${on ? T.gold : "transparent"}`,
              }}>
              <n.Icon size={16} />
              <span className="flex-1 text-left">{n.label}</span>
              {n.badge && (
                <span className="rounded-full px-1.5 text-xs font-semibold"
                  style={{ background: T.gold, color: T.navy }}>{n.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <button onClick={() => { setAssistant(true); setMenu(false); }}
          className="w-full rounded-lg px-3 py-3 text-left" style={{ background: T.navySoft }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} style={{ color: "#fff" }} />
            <span className="text-sm font-semibold" style={{ color: "#fff" }}>Ask LUNA</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>
            What should we post this week?
          </p>
        </button>
      </div>

      <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderTop: "1px solid rgba(255,255,255,.10)" }}>
        <div className="rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
          style={{ width: 30, height: 30, background: "rgba(255,255,255,.14)", color: "#fff" }}>B</div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: "#fff" }}>Brian Guthmiller</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,.5)" }}>Owner</div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex w-full" style={{
      background: T.paper, minHeight: "100dvh", maxWidth: "100vw",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    }}>
      <style>{`
        * { min-width: 0; }
        svg { flex-shrink: 0; }
        html, body { max-width: 100%; overflow-x: hidden; }
        img { max-width: 100%; }
      `}</style>
      <div className="hidden lg:block shrink-0 sticky top-0" style={{ height: "100dvh" }}>{Sidebar}</div>

      {menu && (
        <div className="fixed inset-0 z-50 flex lg:hidden" style={{ background: "rgba(11,27,51,.45)" }} onClick={() => setMenu(false)}>
          <div className="h-full" onClick={e => e.stopPropagation()}>{Sidebar}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0" style={{ maxWidth: "100%" }}>
        <DemoBanner />
        <header className="flex items-center gap-3 px-4 lg:px-8 py-3 sticky top-0 z-30"
          style={{ background: T.surface, borderBottom: `2px solid ${T.gold}` }}>
          <button className="lg:hidden rounded-lg p-2 shrink-0" style={{ border: `1px solid ${T.line}` }} onClick={() => setMenu(true)}>
            <Menu size={16} />
          </button>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-md"
            style={{ background: T.paper, border: `1px solid ${T.line}` }}>
            <Search size={14} className="shrink-0" style={{ color: T.muted }} />
            <input placeholder="Search content and media"
              className="flex-1 text-sm outline-none bg-transparent" style={{ color: T.ink }} />
          </div>
          <div className="hidden lg:block flex-1" />
          <span className="hidden lg:inline-flex shrink-0">
            <Pill tone={T.good} bg={T.goodSoft}><Lock size={11} />Brand Lock on</Pill>
          </span>
          <button className="rounded-lg p-2 relative shrink-0" style={{ border: `1px solid ${T.line}` }}>
            <Bell size={15} style={{ color: T.body }} />
            <span className="absolute rounded-full" style={{ top: 6, right: 6, width: 6, height: 6, background: T.gold }} />
          </button>
          <Btn variant="dark" size="sm" onClick={() => setAssistant(true)} style={{ flexShrink: 0 }}>
            <Sparkles size={13} /><span className="hidden sm:inline">Ask LUNA</span>
          </Btn>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8" style={{ maxWidth: "100%" }}>
          <div className="mx-auto min-w-0" style={{ maxWidth: 1280 }}>
            {view === "dashboard" && <Dashboard content={content} onOpen={setOpenId} go={go} />}
            {view === "planner" && <Planner content={content} setContent={setContent} onOpen={setOpenId} />}
            {view === "ai" && <AIStudio go={go} />}
            {view === "requests" && <Requests />}
            {view === "library" && <Library />}
            {view === "analytics" && <Analytics content={content} />}
            {view === "brand" && <BrandHub />}
            {view === "settings" && <Settings />}
            <DemoFooter />
          </div>
        </main>
      </div>

      {notice && <DemoNotice onClose={() => setNotice(false)} />}
      <DetailPanel item={item} onClose={() => setOpenId(null)} setContent={setContent} />
      <Assistant open={assistant} onClose={() => setAssistant(false)} />
    </div>
  );
}

/* ---------------------------------------------------------------- utils --- */
function fmtDate(iso) {
  const [, m, d] = iso.split("-");
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m)]} ${Number(d)}`;
}
function fmtNum(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

/* ============================================================================
   FUTURE PRODUCTION INTEGRATIONS — stubs only.
   Nothing below is wired up. Every screen above reads from the mock data at
   the top of this file. Replace each stub with a real client when you're ready;
   the UI already calls nothing else, so swapping these in is the only change.
   ==========================================================================
   services = {
     meta:      { publish, fetchInsights, listMedia },        // Instagram + Facebook Graph API
     tiktok:    { publish, fetchInsights },                   // TikTok Content Posting API
     imagegen:  { generate, edit, upscale },                  // image generation API
     llm:       { draft, ideate, answer },                    // assistant + Create with AI
     storage:   { upload, getSignedUrl, delete },             // cloud media storage
     auth:      { signIn, signOut, currentUser },             // authentication
     db:        { content, requests, assets, brand, activity } // database
   }
   ========================================================================== */


ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
