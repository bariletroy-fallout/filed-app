import { useState, useEffect, useRef } from "react";

// ── SEARCH SOURCES ──────────────────────────────────────────────────────────
const SOURCES = [
  { id:'doj',      label:'DOJ Epstein Files',     checked:true,  desc:'justice.gov official releases' },
  { id:'ftf',      label:'Follow The Files',       checked:true,  desc:'followthefiles.com index' },
  { id:'court',    label:'Court Records',          checked:true,  desc:'CourtListener + PACER' },
  { id:'news',     label:'News & Investigations',  checked:true,  desc:'AP, Miami Herald, NYT, Reuters' },
  { id:'congress', label:'Congressional Records',  checked:false, desc:'House Oversight releases' },
  { id:'pacer',    label:'Federal Dockets',        checked:false, desc:'PACER federal court filings' },
];

const QUICK = [
  'Ghislaine Maxwell','flight logs','Little St. James','Palm Beach',
  'EFTA00133349','Prince Andrew','Lolita Express','Les Wexner',
  'Jean-Luc Brunel','Alan Dershowitz','Virginia Giuffre','settlement',
  'witness statement','bank records','wire transfer','New Mexico ranch',
  'Bill Clinton','David Copperfield','Lawrence Krauss','EFTA01652016',
];

const RESOURCES = [
  { icon:'📁', title:'DOJ Epstein Files — Official Index', desc:'Complete archive of all released FBI investigative files. All datasets.', url:'https://www.justice.gov/archives/ag/epstein-related-fbi-investigative-files' },
  { icon:'🔍', title:'Follow The Files', desc:'Comprehensive searchable index, document analysis, and investigative guides.', url:'https://followthefiles.com' },
  { icon:'⚖️', title:'CourtListener — Free Court Records', desc:'Free access to federal dockets, filings, and court documents.', url:'https://courtlistener.com/?q=epstein&type=r&order_by=score+desc' },
  { icon:'📰', title:'Miami Herald — Julie K. Brown', desc:'The original investigation. Essential reading.', url:'https://www.miamiherald.com/news/local/article220097825.html' },
  { icon:'🏛️', title:'House Oversight Epstein Documents', desc:'Congressional document releases and hearing transcripts.', url:'https://oversight.house.gov' },
  { icon:'💾', title:'Dataset 209 — Bank Records', desc:'Financial records, wire transfers, and bank documents.', url:'https://justice.gov/epstein/files/DataSet209' },
  { icon:'✈️', title:'Dataset 213 — Travel Records', desc:'Flight logs, travel records, and related materials.', url:'https://www.justice.gov/epstein/files/DataSet213' },
  { icon:'📞', title:'Dataset 214 — Communications', desc:'Phone records, emails, and contact logs.', url:'https://www.justice.gov/epstein/files/DataSet214' },
  { icon:'📋', title:'PACER — Federal Court System', desc:'Federal court filings and dockets. Requires registration.', url:'https://pacer.gov' },
  { icon:'🗃️', title:'Internet Archive', desc:'Preserve and access archived versions of pages and documents.', url:'https://web.archive.org/web/*/justice.gov/epstein*' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#06080B;--s1:#0C0F14;--s2:#141820;--s3:#1C2028;--s4:#252A34;
  --bdr:#2A2F3A;--txt:#E4EAF4;--muted:#7A8499;--dim:#404858;
  --blue:#2F7FED;--blue-s:rgba(47,127,237,0.1);
  --gold:#C8981C;--gold-s:rgba(200,152,28,0.1);
  --red:#D03530;--red-s:rgba(208,53,48,0.08);
  --green:#25864A;--green-s:rgba(37,134,74,0.1);
  --mono:'Space Mono',monospace;--sans:'Space Grotesk',sans-serif;--serif:'Instrument Serif',serif;
}
html,body{background:var(--bg);color:var(--txt);font-family:var(--sans);font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh;}
button{cursor:pointer;font-family:var(--sans);border:none;background:none;color:var(--txt);}
input,textarea,select{font-family:var(--sans);color:var(--txt);outline:none;}
a{color:var(--blue);text-decoration:none;}
a:hover{text-decoration:underline;}

.app{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;min-height:100vh;}

/* ── TOPBAR ── */
.topbar{display:flex;align-items:center;gap:14px;padding:12px 20px;border-bottom:1px solid var(--bdr);background:var(--s1);position:sticky;top:0;z-index:50;backdrop-filter:blur(8px);}
.logo{display:flex;align-items:baseline;gap:8px;}
.logo-mark{font-family:var(--serif);font-size:28px;letter-spacing:2px;font-style:italic;color:var(--txt);}
.logo-mark strong{color:var(--gold);font-style:normal;}
.logo-sub{font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;}
.nav-tabs{display:flex;gap:2px;margin-left:16px;}
.nt{padding:7px 14px;font-size:12px;color:var(--muted);border-radius:6px;transition:all .15s;}
.nt:hover{color:var(--txt);background:var(--s3);}
.nt.on{color:var(--txt);background:var(--s3);}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.premium-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;background:var(--gold-s);border:1px solid rgba(200,152,28,.4);border-radius:20px;font-size:11px;color:var(--gold);letter-spacing:.5px;cursor:pointer;}
.premium-btn:hover{background:rgba(200,152,28,.18);}

/* ── LAYOUT ── */
.layout{display:flex;flex:1;overflow:hidden;}
.sidebar{width:220px;border-right:1px solid var(--bdr);background:var(--s1);padding:16px 10px;flex-shrink:0;overflow-y:auto;}
.main-content{flex:1;overflow-y:auto;}

/* ── SIDEBAR ── */
.sb-label{font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;padding:2px 6px;display:block;margin-bottom:6px;}
.sb-link{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;font-size:12px;color:var(--muted);cursor:pointer;width:100%;text-align:left;transition:all .12s;text-decoration:none;}
.sb-link:hover{color:var(--txt);background:var(--s2);text-decoration:none;}
.sb-link.on{color:var(--txt);background:var(--s3);}
.sb-div{height:1px;background:var(--bdr);margin:10px 0;}
.dataset-link{display:block;padding:7px 10px;border-radius:4px;font-size:11px;color:var(--muted);cursor:pointer;text-decoration:none;line-height:1.5;transition:all .12s;}
.dataset-link:hover{color:var(--txt);background:var(--s2);text-decoration:none;}
.dl-name{font-weight:500;font-size:12px;}
.dl-desc{font-size:10px;color:var(--muted);margin-top:1px;}

/* ── SEARCH PANEL ── */
.search-hero{padding:24px;border-bottom:1px solid var(--bdr);}
.sh-title{font-family:var(--serif);font-size:28px;font-style:italic;margin-bottom:3px;}
.sh-sub{font-size:12px;color:var(--muted);margin-bottom:18px;}
.search-row{display:flex;gap:8px;margin-bottom:14px;}
.search-input{flex:1;background:var(--s2);border:1px solid var(--bdr);color:var(--txt);font-size:14px;padding:12px 16px;border-radius:8px;transition:border-color .15s;}
.search-input:focus{border-color:var(--blue);}
.search-btn{padding:12px 24px;background:var(--blue);border:none;color:#fff;font-size:13px;font-weight:600;border-radius:8px;white-space:nowrap;transition:opacity .15s;}
.search-btn:hover{opacity:.88;}
.search-btn:disabled{opacity:.45;cursor:default;}
.sources-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;}
.src-check{display:flex;align-items:center;gap:5px;padding:5px 10px;border:1px solid var(--bdr);border-radius:20px;cursor:pointer;font-size:11px;color:var(--muted);transition:all .15s;}
.src-check:hover{border-color:var(--txt);color:var(--txt);}
.src-check.on{background:var(--blue-s);border-color:rgba(47,127,237,.5);color:var(--blue);}
.src-check input{display:none;}
.quick-row{display:flex;flex-wrap:wrap;gap:6px;}
.qtag{padding:4px 10px;border:1px solid var(--bdr);border-radius:20px;font-size:11px;color:var(--muted);cursor:pointer;transition:all .15s;}
.qtag:hover{border-color:var(--gold);color:var(--gold);}

/* ── RESULTS ── */
.results-wrap{padding:20px 24px;}
.results-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.rm-text{font-family:var(--mono);font-size:11px;color:var(--muted);}
.rm-right{display:flex;gap:8px;}
.result-card{border:1px solid var(--bdr);border-radius:8px;background:var(--s1);margin-bottom:14px;overflow:hidden;transition:border-color .15s;}
.result-card:hover{border-color:var(--dim);}
.rc-head{padding:13px 16px;background:var(--s2);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.rc-source{font-family:var(--mono);font-size:9px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;}
.rc-title{font-size:14px;font-weight:600;}
.rc-flags{display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;}
.flag{font-size:9px;padding:3px 8px;border-radius:3px;letter-spacing:1px;font-family:var(--mono);white-space:nowrap;}
.f-blue{background:var(--blue-s);border:1px solid rgba(47,127,237,.4);color:var(--blue);}
.f-gold{background:var(--gold-s);border:1px solid rgba(200,152,28,.4);color:var(--gold);}
.f-red{background:var(--red-s);border:1px solid rgba(208,53,48,.4);color:var(--red);}
.f-green{background:var(--green-s);border:1px solid rgba(37,134,74,.4);color:var(--green);}
.rc-body{padding:14px 16px;}
.rc-text{font-size:13px;line-height:1.75;color:var(--txt);margin-bottom:12px;}
.rc-text mark{background:rgba(200,152,28,.2);color:var(--gold);}
.rc-url{font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:10px;word-break:break-all;}
.rc-actions{display:flex;gap:8px;flex-wrap:wrap;}
.ra{display:flex;align-items:center;gap:5px;padding:6px 12px;border:1px solid var(--bdr);border-radius:6px;font-size:11px;color:var(--muted);transition:all .15s;background:none;cursor:pointer;text-decoration:none;}
.ra:hover{border-color:var(--txt);color:var(--txt);text-decoration:none;}
.ra.primary{background:var(--blue);border-color:var(--blue);color:#fff;}
.ra.primary:hover{opacity:.88;}

/* ── LOADING ── */
.loading-wrap{padding:40px 24px;display:flex;flex-direction:column;gap:12px;}
.loading-step{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--s2);border:1px solid var(--bdr);border-radius:6px;font-size:12px;color:var(--muted);}
.loading-step.active{border-color:var(--blue);color:var(--txt);}
.loading-step.done{border-color:var(--green);color:var(--green);}
.spin{width:14px;height:14px;border:2px solid var(--s4);border-top-color:var(--blue);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg);}}
.done-icon{color:var(--green);flex-shrink:0;}

/* ── ANALYZE ── */
.analyze-wrap{padding:24px;}
.aw-title{font-family:var(--serif);font-size:24px;font-style:italic;margin-bottom:6px;}
.aw-sub{font-size:12px;color:var(--muted);margin-bottom:20px;}
.info-box{border:1px solid var(--bdr);border-left:3px solid var(--blue);border-radius:4px;padding:12px 14px;background:var(--s2);margin-bottom:16px;font-size:12px;color:var(--muted);line-height:1.7;}
.info-box strong{color:var(--blue);}
.efta-row{display:flex;gap:8px;margin-bottom:14px;}
.efta-in{flex:1;background:var(--s2);border:1px solid var(--bdr);color:var(--txt);font-size:13px;font-family:var(--mono);padding:10px 14px;border-radius:6px;}
.efta-in:focus{border-color:var(--gold);}
.efta-btn{padding:10px 18px;background:var(--gold);border:none;color:#000;font-size:12px;font-weight:700;border-radius:6px;letter-spacing:.5px;}
.efta-btn:hover{opacity:.88;}
.upload-area{border:2px dashed var(--bdr);border-radius:8px;padding:36px;text-align:center;cursor:pointer;transition:all .2s;position:relative;}
.upload-area:hover,.upload-area.drag{border-color:var(--blue);background:var(--blue-s);}
.ua-input{position:absolute;inset:0;opacity:0;cursor:pointer;}
.ua-icon{font-size:32px;margin-bottom:10px;color:var(--muted);}
.ua-title{font-size:16px;font-weight:600;margin-bottom:4px;}
.ua-sub{font-size:12px;color:var(--muted);line-height:1.7;}
.doc-list{margin-top:14px;display:flex;flex-direction:column;gap:8px;}
.doc-card{display:flex;align-items:center;gap:10px;padding:9px 14px;background:var(--s2);border:1px solid var(--bdr);border-radius:6px;}
.doc-name{font-family:var(--mono);font-size:11px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.doc-sz{font-family:var(--mono);font-size:10px;color:var(--muted);}
.doc-rm{color:var(--muted);padding:2px 6px;font-size:16px;}
.doc-rm:hover{color:var(--red);}
.paste-wrap{margin-top:16px;}
.sec-label{display:block;font-size:10px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.ta{width:100%;background:var(--s2);border:1px solid var(--bdr);color:var(--txt);font-size:12px;font-family:var(--mono);padding:12px 14px;border-radius:6px;resize:vertical;min-height:130px;line-height:1.7;}
.ta:focus{border-color:var(--blue);}
.analyze-btn{width:100%;margin-top:14px;padding:13px;background:var(--blue);border:none;color:#fff;font-size:14px;font-weight:600;border-radius:8px;}
.analyze-btn:disabled{opacity:.4;cursor:default;}
.analysis-result{margin-top:20px;background:var(--s2);border:1px solid var(--bdr);border-radius:8px;padding:20px;font-family:var(--mono);font-size:12px;line-height:1.8;white-space:pre-wrap;color:var(--txt);}

/* ── NOTES ── */
.notes-layout{display:grid;grid-template-columns:230px 1fr;height:calc(100vh - 57px);}
.notes-list{border-right:1px solid var(--bdr);overflow-y:auto;background:var(--s1);}
.note-item{padding:12px 14px;border-bottom:1px solid var(--bdr);cursor:pointer;transition:background .12s;}
.note-item:hover{background:var(--s2);}
.note-item.on{background:var(--s3);}
.note-title-preview{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.note-body-preview{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
.note-date{font-family:var(--mono);font-size:9px;color:var(--muted);margin-top:4px;}
.note-editor{padding:20px;display:flex;flex-direction:column;gap:12px;}
.note-title-in{background:none;border:none;border-bottom:1px solid var(--bdr);color:var(--txt);font-size:18px;font-weight:600;padding:8px 0;width:100%;}
.note-title-in:focus{border-color:var(--blue);}
.note-body-ta{flex:1;background:var(--s2);border:1px solid var(--bdr);border-radius:6px;color:var(--txt);font-size:13px;padding:14px;resize:none;line-height:1.75;min-height:300px;}
.note-body-ta:focus{border-color:var(--dim);}
.note-actions{display:flex;gap:8px;}
.na{padding:8px 16px;border:1px solid var(--bdr);border-radius:6px;font-size:12px;color:var(--muted);cursor:pointer;}
.na:hover{border-color:var(--txt);color:var(--txt);}
.na.save{background:var(--green);border-color:var(--green);color:#fff;}
.na.danger{border-color:var(--red);color:var(--red);}
.new-note-btn{width:calc(100% - 20px);margin:10px;padding:9px;background:var(--blue);border:none;color:#fff;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;}

/* ── COLLAB ── */
.collab-layout{display:grid;grid-template-columns:200px 1fr;height:calc(100vh - 57px);}
.collab-sb{border-right:1px solid var(--bdr);background:var(--s1);padding:12px 8px;overflow-y:auto;}
.ch-item{display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:4px;cursor:pointer;font-size:12px;color:var(--muted);margin-bottom:2px;width:100%;text-align:left;background:none;}
.ch-item:hover{color:var(--txt);background:var(--s2);}
.ch-item.on{color:var(--txt);background:var(--s3);}
.collab-main{display:flex;flex-direction:column;height:100%;}
.collab-hdr{padding:13px 20px;border-bottom:1px solid var(--bdr);background:var(--s1);}
.messages{flex:1;overflow-y:auto;padding:14px 20px;display:flex;flex-direction:column;gap:12px;}
.msg{display:flex;gap:10px;}
.msg-av{width:30px;height:30px;border-radius:50%;background:var(--s3);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted);flex-shrink:0;}
.msg-body{flex:1;}
.msg-meta{display:flex;align-items:baseline;gap:8px;margin-bottom:3px;}
.msg-author{font-size:13px;font-weight:600;}
.msg-time{font-family:var(--mono);font-size:9px;color:var(--muted);}
.msg-text{font-size:13px;line-height:1.6;color:var(--txt);}
.msg-text code{font-family:var(--mono);font-size:11px;background:var(--s3);padding:1px 5px;border-radius:3px;color:var(--gold);}
.msg-text a{color:var(--blue);}
.msg-input-area{padding:10px 20px;border-top:1px solid var(--bdr);background:var(--s1);}
.msg-in{width:100%;background:var(--s2);border:1px solid var(--bdr);color:var(--txt);font-size:13px;padding:10px 14px;border-radius:8px;}
.msg-in:focus{border-color:var(--blue);}
.msg-toolbar{display:flex;align-items:center;justify-content:flex-end;margin-top:7px;}
.send-btn{padding:7px 18px;background:var(--blue);border:none;color:#fff;font-size:12px;font-weight:600;border-radius:6px;cursor:pointer;}
.send-btn:disabled{opacity:.4;}
.online-section{padding:10px 10px 6px;border-top:1px solid var(--bdr);margin-top:auto;}

/* ── RESOURCES ── */
.res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;padding:20px;}
.res-card{border:1px solid var(--bdr);border-radius:8px;background:var(--s1);padding:16px;display:block;text-decoration:none;transition:all .15s;}
.res-card:hover{border-color:var(--blue);background:var(--s2);text-decoration:none;}
.res-icon{font-size:22px;margin-bottom:9px;}
.res-title{font-size:13px;font-weight:600;color:var(--txt);margin-bottom:4px;}
.res-desc{font-size:11px;color:var(--muted);line-height:1.6;}
.res-arrow{font-size:11px;color:var(--blue);margin-top:9px;display:block;}

/* ── PREMIUM MODAL ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--s1);border:1px solid var(--bdr);border-radius:12px;width:100%;max-width:460px;}
.modal-hdr{padding:20px 22px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.modal-title{font-size:18px;font-weight:700;}
.modal-close{font-size:20px;color:var(--muted);cursor:pointer;}
.modal-body{padding:22px;}
.plan-card{border:1px solid var(--bdr);border-radius:8px;padding:18px;margin-bottom:10px;cursor:pointer;transition:all .15s;position:relative;}
.plan-card:hover{border-color:var(--blue);}
.plan-card.sel{border-color:var(--gold);background:var(--gold-s);}
.plan-pop{position:absolute;top:-9px;right:12px;background:var(--gold);color:#000;font-size:9px;font-weight:700;padding:2px 8px;border-radius:3px;letter-spacing:1px;}
.plan-price{font-size:26px;font-weight:700;margin-bottom:2px;}
.plan-name{font-size:13px;font-weight:600;margin-bottom:8px;}
.plan-features{font-size:12px;color:var(--muted);line-height:1.9;}
.plan-features li{list-style:none;display:flex;align-items:center;gap:6px;}
.plan-features li::before{content:'✓';color:var(--green);font-weight:700;}
.subscribe-btn{width:100%;padding:14px;background:var(--gold);border:none;color:#000;font-size:15px;font-weight:700;border-radius:8px;margin-top:14px;cursor:pointer;}

/* ── EMPTY / TOAST / UTIL ── */
.empty{padding:60px 24px;text-align:center;color:var(--muted);}
.empty-icon{font-size:40px;margin-bottom:12px;}
.empty-txt{font-size:13px;line-height:1.8;}
.toast{position:fixed;bottom:20px;right:20px;background:var(--s3);border:1px solid var(--bdr);color:var(--txt);padding:10px 18px;font-size:12px;border-radius:6px;z-index:200;animation:tst 3s ease forwards;box-shadow:0 4px 20px rgba(0,0,0,.4);}
@keyframes tst{0%{opacity:0;transform:translateY(6px);}10%{opacity:1;transform:translateY(0);}80%{opacity:1;}100%{opacity:0;}}
.divider{height:1px;background:var(--bdr);margin:16px 0;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:var(--s4);border-radius:2px;}
`;

const CHANNELS = [
  { id:'general', label:'general', desc:'General research discussion' },
  { id:'documents', label:'documents', desc:'Document findings & EFTA numbers' },
  { id:'legal', label:'legal', desc:'Legal filings & court records' },
  { id:'tips', label:'tips', desc:'Leads & tips (sources protected)' },
];

const DEMO_MSGS = {
  general:[
    { id:'m1', author:'System', av:'🤖', text:'Welcome to the FILED collaboration space. Share findings, EFTA numbers, and document analysis. All research stays in this channel.', ts:Date.now()-86400000 },
    { id:'m2', author:'DocReviewer', av:'DR', text:'Anyone worked through Dataset 209 yet? The bank records are detailed. Worth cross-referencing with the flight logs in 213.', ts:Date.now()-43200000 },
    { id:'m3', author:'FOIA_Tracker', av:'FT', text:'EFTA01652016 is the key document — federal witness harassment complaint. justice.gov/archives/ag/epstein-related-fbi-investigative-files', ts:Date.now()-14400000 },
  ],
  documents:[],legal:[],tips:[]
};

function timeAgo(ts){const d=Date.now()-ts;if(d<60000)return'just now';if(d<3600000)return`${~~(d/60000)}m ago`;if(d<86400000)return`${~~(d/3600000)}h ago`;return new Date(ts).toLocaleDateString();}
function readText(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsText(file);});}

export default function FILED(){
  const [tab,setTab]=useState('search');
  const [searchQ,setSearchQ]=useState('');
  const [sources,setSources]=useState(()=>SOURCES.reduce((a,s)=>({...a,[s.id]:s.checked}),{}));
  const [loadingSteps,setLoadingSteps]=useState([]);
  const [results,setResults]=useState([]);
  const [searched,setSearched]=useState(false);
  const [loading,setLoading]=useState(false);
  const [docs,setDocs]=useState([]);
  const [pastedText,setPastedText]=useState('');
  const [eftaNum,setEftaNum]=useState('');
  const [analysis,setAnalysis]=useState('');
  const [analyzing,setAnalyzing]=useState(false);
  const [drag,setDrag]=useState(false);
  const [notes,setNotes]=useState([]);
  const [activeNote,setActiveNote]=useState(null);
  const [noteTitle,setNoteTitle]=useState('');
  const [noteBody,setNoteBody]=useState('');
  const [noteSaved,setNoteSaved]=useState(true);
  const [channel,setChannel]=useState('general');
  const [msgs,setMsgs]=useState({...DEMO_MSGS});
  const [msgInput,setMsgInput]=useState('');
  const [myHandle]=useState(()=>`Researcher${~~(Math.random()*9000)+1000}`);
  const [showPremium,setShowPremium]=useState(false);
  const [selectedPlan,setSelectedPlan]=useState('annual');
  const [isPremium,setIsPremium]=useState(false);
  const [toast,setToast]=useState('');
  const [toastK,setToastK]=useState(0);
  const msgsEndRef=useRef(null);
  const fileRef=useRef(null);

  useEffect(()=>{
    (async()=>{
      try{
        const n=await window.storage.get('filed3-notes');if(n?.value)setNotes(JSON.parse(n.value));
        const m=await window.storage.get('filed3-msgs');if(m?.value)setMsgs(prev=>({...prev,...JSON.parse(m.value)}));
        const p=await window.storage.get('filed3-premium');if(p?.value==='true')setIsPremium(true);
      }catch{}
    })();
  },[]);

  useEffect(()=>{msgsEndRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,channel]);

  const alert=(msg)=>{setToast(msg);setToastK(k=>k+1);setTimeout(()=>setToast(''),3000);};
  const saveNotes=async arr=>{setNotes(arr);try{await window.storage.set('filed3-notes',JSON.stringify(arr));}catch{}};

  // ── REAL WEB SEARCH ───────────────────────────────────────────────────────
  // Uses Anthropic API with web_search tool so it actually searches the internet
  const runSearch = async () => {
    if(!searchQ.trim())return;
    setLoading(true);setSearched(false);setResults([]);

    // Build step indicators
    const activeSource = Object.entries(sources).filter(([,v])=>v).map(([k])=>k);
    const steps = [
      { id:'doj',  label:'Searching DOJ Epstein file releases…' },
      { id:'ftf',  label:'Searching Follow The Files…' },
      { id:'court',label:'Searching court records…' },
      { id:'news', label:'Searching investigative news coverage…' },
      { id:'parse',label:'Compiling and ranking results…' },
    ].filter(s=>activeSource.includes(s.id)||s.id==='parse');

    setLoadingSteps(steps.map(s=>({...s,status:'pending'})));

    // Animate steps
    for(let i=0;i<steps.length-1;i++){
      await new Promise(r=>setTimeout(r,600));
      setLoadingSteps(prev=>prev.map((s,j)=>j===i?{...s,status:'done'}:j===i+1?{...s,status:'active'}:s));
    }

    // Build search context for the API
    const sourceList = [];
    if(sources.doj) sourceList.push('site:justice.gov/epstein OR site:justice.gov/archives/ag/epstein');
    if(sources.ftf) sourceList.push('site:followthefiles.com');
    if(sources.court) sourceList.push('site:courtlistener.com OR site:pacer.gov');
    if(sources.news) sourceList.push('site:miamiherald.com OR site:nytimes.com OR site:reuters.com');
    if(sources.congress) sourceList.push('site:oversight.house.gov');

    const searchContext = sourceList.length
      ? `Search specifically across these sources: ${sourceList.join(' OR ')}. Also search more broadly.`
      : '';

    const prompt = `You are a research assistant helping people search the Epstein-related FBI investigative files and related court/news records.

The user is searching for: "${searchQ}"

${searchContext}

Search the web for real, publicly available information about "${searchQ}" in the context of the Epstein investigation. Find:
1. Actual DOJ Epstein file documents (justice.gov/epstein/files/ or justice.gov/archives/ag/epstein-related-fbi-investigative-files)
2. Relevant court filings from CourtListener or PACER
3. Investigative journalism from Miami Herald, AP, Reuters, NYT, or other credible outlets
4. Documents from followthefiles.com if available
5. Congressional records from House Oversight Committee if relevant

Return your findings as a JSON array. Each result must have:
- source: the publication or database name (e.g. "DOJ Epstein Files", "Miami Herald", "CourtListener", "Follow The Files")
- type: document type (e.g. "FBI File", "Court Filing", "News Investigation", "EFTA Document", "Congressional Record")  
- title: descriptive title of what was found
- url: the actual real URL of the document or article
- summary: 2-3 sentences describing what this document/article contains and how it relates to the search
- relevance: "HIGH", "MEDIUM", or "LOW"
- efta: EFTA document number if applicable (e.g. "EFTA00133349"), otherwise null
- categories: array from ["Financial","Travel","Communications","Legal","Personnel","Property","Testimony"]

Return ONLY valid JSON array, no markdown fences, no preamble. If you find fewer than 3 good results, still return what you find rather than fabricating results.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await res.json();

      // Extract all text content from response (web search returns multiple blocks)
      const allText = (data.content || [])
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');

      // Try to parse JSON from the response
      let parsed = [];
      try {
        // Find JSON array in the response
        const jsonMatch = allText.match(/\[[\s\S]*\]/);
        if(jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // If JSON parse fails, try to extract structured data from text
        parsed = [];
      }

      // Final step done
      setLoadingSteps(prev=>prev.map(s=>({...s,status:'done'})));

      if(Array.isArray(parsed) && parsed.length > 0){
        setResults(parsed);
      } else {
        // Web search returned results but in non-JSON format — do a second pass to structure them
        const structurePrompt = `Based on your web search results above, format the findings as a JSON array with these fields per result: source, type, title, url, summary, relevance (HIGH/MEDIUM/LOW), efta (null if not applicable), categories (array). Return ONLY the JSON array.`;

        try {
          const res2 = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 3000,
              messages: [
                { role: 'user', content: prompt },
                { role: 'assistant', content: allText },
                { role: 'user', content: structurePrompt }
              ]
            })
          });
          const data2 = await res2.json();
          const raw2 = (data2.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('');
          const m2 = raw2.match(/\[[\s\S]*\]/);
          if(m2) parsed = JSON.parse(m2[0]);
        } catch {}

        setResults(Array.isArray(parsed) ? parsed : []);
      }

      setSearched(true);
    } catch(e) {
      alert('Search failed. Check your connection and try again.');
      setLoadingSteps([]);
    }
    setLoading(false);
  };

  // ── DOC ANALYSIS ──────────────────────────────────────────────────────────
  const handleFiles = async fileList => {
    for(const f of Array.from(fileList)){
      try{ const text=await readText(f); setDocs(d=>[...d,{name:f.name,size:(f.size/1024).toFixed(1)+'KB',text}]); }
      catch{ alert(`Could not read ${f.name}`); }
    }
  };

  const lookupEFTA = () => {
    const n=eftaNum.trim().replace(/\D/g,'').padStart(8,'0');
    if(!n){alert('Enter an EFTA number.');return;}
    window.open(`https://www.justice.gov/epstein/files/DataSet209/EFTA${n}.pdf`,'_blank');
    alert(`Opened EFTA${n} — copy the text and paste below for AI analysis.`);
  };

  const analyzeDoc = async () => {
    const corpus=[...docs.map(d=>`[FILE: ${d.name}]\n${d.text}`),pastedText.trim()?`[PASTED]\n${pastedText}`:''].filter(Boolean).join('\n\n---\n\n');
    if(!corpus.trim()){alert('Add a document or paste text first.');return;}
    if(!isPremium){setShowPremium(true);return;}
    setAnalyzing(true);setAnalysis('');
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:4000,
          messages:[{role:'user',content:`Analyze this Epstein investigation document and provide:\n1. DOCUMENT SUMMARY\n2. KEY NAMES (every person named and their role)\n3. KEY LOCATIONS\n4. KEY DATES & TIMELINE\n5. FINANCIAL DETAILS (amounts, accounts, transactions)\n6. CONNECTIONS (how this connects to the broader investigation)\n7. FOLLOW-UP (specific next research steps)\n8. CROSS-REFERENCES (other document numbers or cases to pull)\n\nBe specific and factual. Document:\n${corpus.slice(0,60000)}`}]})
      });
      const data=await res.json();
      setAnalysis((data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('')||'Analysis unavailable.');
    }catch{alert('Analysis failed.');}
    setAnalyzing(false);
  };

  // ── NOTES ────────────────────────────────────────────────────────────────
  const newNote=()=>{const n={id:`n-${Date.now()}`,title:'Untitled',body:'',ts:Date.now()};saveNotes([n,...notes]);setActiveNote(n.id);setNoteTitle(n.title);setNoteBody('');setNoteSaved(true);};
  const saveNote=()=>{saveNotes(notes.map(n=>n.id===activeNote?{...n,title:noteTitle||'Untitled',body:noteBody,ts:Date.now()}:n));setNoteSaved(true);alert('Saved.');};
  const exportNote=()=>{const b=new Blob([`${noteTitle}\n${'─'.repeat(40)}\n${noteBody}`],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`${noteTitle||'note'}.txt`;a.click();};
  const saveResultAsNote=r=>{const n={id:`n-${Date.now()}`,title:r.title,body:`Source: ${r.source}\nType: ${r.type}\nURL: ${r.url}\nRelevance: ${r.relevance}\n\nSummary:\n${r.summary}\n\nEFTA: ${r.efta||'N/A'}`,ts:Date.now()};saveNotes([n,...notes]);alert('Saved to notes.');};

  // ── COLLAB ────────────────────────────────────────────────────────────────
  const sendMsg=async()=>{
    if(!msgInput.trim())return;
    const m={id:`m-${Date.now()}`,author:myHandle,av:myHandle.slice(-2),text:msgInput.trim(),ts:Date.now()};
    const updated={...msgs,[channel]:[...(msgs[channel]||[]),m]};
    setMsgs(updated);setMsgInput('');
    try{await window.storage.set('filed3-msgs',JSON.stringify(updated));}catch{}
  };

  const relFlagColor = r => r==='HIGH'?'f-red':r==='MEDIUM'?'f-gold':'f-blue';

  // ── RENDER ────────────────────────────────────────────────────────────────
  return(
    <>
      <style>{CSS}</style>
      {toast&&<div key={toastK} className="toast">{toast}</div>}

      {showPremium&&(
        <div className="modal-overlay" onClick={()=>setShowPremium(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-hdr"><div className="modal-title">Unlock FILED Premium</div><button className="modal-close" onClick={()=>setShowPremium(false)}>✕</button></div>
            <div className="modal-body">
              <p style={{fontSize:13,color:'var(--muted)',marginBottom:16,lineHeight:1.7}}>Full AI document analysis, unlimited saved research, collaboration, and priority support for researchers, journalists, and attorneys.</p>
              {[
                {id:'monthly',name:'Monthly',price:'$4.99',period:'/mo',feats:['AI document analysis','Unlimited notes','All collaboration channels','Export research']},
                {id:'annual',name:'Annual',price:'$39',period:'/yr',pop:'SAVE 35%',feats:['Everything monthly','Bulk doc processing','Advanced analysis','Early feature access']},
                {id:'lifetime',name:'Lifetime',price:'$99',period:'once',feats:['Everything, forever','All future features','Researcher badge','Direct support']},
              ].map(p=>(
                <div key={p.id} className={`plan-card ${selectedPlan===p.id?'sel':''}`} onClick={()=>setSelectedPlan(p.id)}>
                  {p.pop&&<div className="plan-pop">{p.pop}</div>}
                  <div className="plan-price">{p.price}<span style={{fontSize:14,color:'var(--muted)',fontWeight:400}}>{p.period}</span></div>
                  <div className="plan-name">{p.name}</div>
                  <ul className="plan-features">{p.feats.map(f=><li key={f}>{f}</li>)}</ul>
                </div>
              ))}
              <button className="subscribe-btn" onClick={()=>{setIsPremium(true);setShowPremium(false);window.storage.set('filed3-premium','true').catch(()=>{});alert('Premium activated. Thank you.');}}>
                Unlock — {selectedPlan==='monthly'?'$4.99/mo':selectedPlan==='annual'?'$39/yr':'$99 once'}
              </button>
              <p style={{fontSize:10,color:'var(--muted)',textAlign:'center',marginTop:10}}>Cancel anytime · Supports ongoing research infrastructure</p>
            </div>
          </div>
        </div>
      )}

      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="logo">
            <div className="logo-mark"><em>FI</em><strong>L</strong><em>ED</em></div>
            <div className="logo-sub">Epstein Files Research</div>
          </div>
          <div className="nav-tabs">
            {[['search','🔍 Search'],['analyze','📄 Analyze'],['notes','📋 Notes'],['collaborate','💬 Collaborate'],['resources','🗂 Resources']].map(([id,label])=>(
              <button key={id} className={`nt ${tab===id?'on':''}`} onClick={()=>setTab(id)}>{label}</button>
            ))}
          </div>
          <div className="topbar-right">
            {isPremium
              ?<div className="premium-btn">⭐ Premium Active</div>
              :<div className="premium-btn" onClick={()=>setShowPremium(true)}>⭐ Unlock Premium</div>
            }
          </div>
        </div>

        <div className="layout">
          {/* SIDEBAR */}
          <div className="sidebar">
            <span className="sb-label">Navigate</span>
            {[['search','🔍','Search'],['analyze','📄','Analyze Docs'],['notes','📋','Research Notes'],['collaborate','💬','Collaborate'],['resources','🗂','Resources']].map(([id,icon,label])=>(
              <button key={id} className={`sb-link ${tab===id?'on':''}`} onClick={()=>setTab(id)}>{icon} {label}</button>
            ))}
            <div className="sb-div"/>
            <span className="sb-label">DOJ Datasets</span>
            {[
              {label:'Main Index',desc:'All datasets',url:'https://www.justice.gov/archives/ag/epstein-related-fbi-investigative-files'},
              {label:'Dataset 209',desc:'Bank records',url:'https://justice.gov/epstein/files/DataSet209'},
              {label:'Dataset 210',desc:'FBI tips',url:'https://www.justice.gov/epstein/files/DataSet210'},
              {label:'Dataset 213',desc:'Travel records',url:'https://www.justice.gov/epstein/files/DataSet213'},
              {label:'Dataset 214',desc:'Communications',url:'https://www.justice.gov/epstein/files/DataSet214'},
            ].map(d=>(
              <a key={d.label} href={d.url} target="_blank" rel="noopener noreferrer" className="dataset-link">
                <div className="dl-name">{d.label}</div>
                <div className="dl-desc">{d.desc}</div>
              </a>
            ))}
            <div className="sb-div"/>
            <a href="https://followthefiles.com" target="_blank" rel="noopener noreferrer" className="sb-link">🔗 Follow The Files ↗</a>
          </div>

          {/* MAIN */}
          <div className="main-content">

            {/* SEARCH */}
            {tab==='search'&&(
              <>
                <div className="search-hero">
                  <div className="sh-title">Search the Epstein Files</div>
                  <div className="sh-sub">Live search across DOJ releases, court records, investigative journalism, and related databases.</div>
                  <div className="search-row">
                    <input className="search-input" placeholder="Search by name, location, EFTA number, topic, date…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runSearch()}/>
                    <button className="search-btn" disabled={loading||!searchQ.trim()} onClick={runSearch}>{loading?'Searching…':'Search'}</button>
                  </div>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:8,letterSpacing:.5}}>Search sources:</div>
                  <div className="sources-row">
                    {SOURCES.map(s=>(
                      <label key={s.id} className={`src-check ${sources[s.id]?'on':''}`} onClick={()=>setSources(prev=>({...prev,[s.id]:!prev[s.id]}))}>
                        <input type="checkbox" checked={!!sources[s.id]} readOnly/>
                        {s.label}
                      </label>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:'var(--muted)',marginBottom:8,letterSpacing:.5}}>Quick searches:</div>
                  <div className="quick-row">
                    {QUICK.map(q=><button key={q} className="qtag" onClick={()=>{setSearchQ(q);setTimeout(()=>document.querySelector('.search-btn')?.click(),100);}}>{q}</button>)}
                  </div>
                </div>

                <div className="results-wrap">
                  {/* LOADING */}
                  {loading&&loadingSteps.length>0&&(
                    <div className="loading-wrap">
                      {loadingSteps.map((s,i)=>(
                        <div key={s.id} className={`loading-step ${s.status==='active'?'active':s.status==='done'?'done':''}`}>
                          {s.status==='done'?<span className="done-icon">✓</span>:s.status==='active'?<div className="spin"/>:<span style={{width:14,display:'inline-block'}}/>}
                          {s.label}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RESULTS */}
                  {searched&&!loading&&(
                    <>
                      <div className="results-meta">
                        <span className="rm-text">{results.length} result{results.length!==1?'s':''} for "{searchQ}"</span>
                        <div className="rm-right">
                          {results.length>0&&<button className="ra" onClick={()=>{const blob=new Blob([JSON.stringify(results,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`filed-search-${Date.now()}.json`;a.click();}}>↓ Export</button>}
                        </div>
                      </div>

                      {results.length===0&&(
                        <div className="empty">
                          <div className="empty-icon">🔍</div>
                          <div className="empty-txt">
                            No results returned for this search.<br/>
                            Try different terms, or browse the DOJ index directly:<br/><br/>
                            <a href="https://www.justice.gov/archives/ag/epstein-related-fbi-investigative-files" target="_blank" rel="noopener noreferrer">justice.gov/archives/ag/epstein-related-fbi-investigative-files →</a>
                          </div>
                        </div>
                      )}

                      {results.map((r,i)=>(
                        <div key={i} className="result-card">
                          <div className="rc-head">
                            <div>
                              <div className="rc-source">{r.source} · {r.type}</div>
                              <div className="rc-title">{r.title}</div>
                            </div>
                            <div className="rc-flags">
                              <span className={`flag ${relFlagColor(r.relevance)}`}>{r.relevance}</span>
                              {r.efta&&<span className="flag f-gold">{r.efta}</span>}
                              {(r.categories||[]).slice(0,2).map(c=><span key={c} className="flag f-blue">{c}</span>)}
                            </div>
                          </div>
                          <div className="rc-body">
                            <div className="rc-text" dangerouslySetInnerHTML={{__html:r.summary?.replace(new RegExp(`(${searchQ.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'),'<mark>$1</mark>')||r.summary}}/>
                            {r.url&&<div className="rc-url">{r.url}</div>}
                            <div className="rc-actions">
                              {r.url&&<a href={r.url} target="_blank" rel="noopener noreferrer" className="ra primary">↗ Open</a>}
                              <button className="ra" onClick={()=>saveResultAsNote(r)}>📋 Save to Notes</button>
                              {r.url&&<button className="ra" onClick={()=>{navigator.clipboard?.writeText(r.url);alert('URL copied.');}}>🔗 Copy URL</button>}
                              <button className="ra" onClick={()=>{setMsgInput(`Found: ${r.title} — ${r.url||''}`);setTab('collaborate');}}>💬 Share</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {!searched&&!loading&&(
                    <div className="empty">
                      <div className="empty-icon">📂</div>
                      <div className="empty-txt">
                        Enter a name, location, topic, or EFTA number above.<br/>
                        Results come from live searches across DOJ files, court records, and investigative journalism.<br/><br/>
                        <a href="https://followthefiles.com" target="_blank" rel="noopener noreferrer">Browse Follow The Files →</a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ANALYZE */}
            {tab==='analyze'&&(
              <div className="analyze-wrap">
                <div className="aw-title">AI Document Analysis</div>
                <div className="aw-sub">Upload or paste Epstein file content. AI extracts key names, dates, financial details, connections, and next steps.</div>
                {!isPremium&&<div style={{padding:'10px 14px',background:'var(--gold-s)',border:'1px solid rgba(200,152,28,.4)',borderRadius:6,marginBottom:14,fontSize:12,color:'var(--gold)'}}>⭐ AI Analysis requires Premium ($4.99/mo). <button style={{color:'var(--gold)',textDecoration:'underline',background:'none',border:'none',cursor:'pointer',fontSize:12}} onClick={()=>setShowPremium(true)}>Unlock →</button></div>}
                <div className="info-box"><strong>HOW TO GET TEXT FROM DOJ PDFs:</strong> Open any justice.gov/epstein PDF in your browser → press Ctrl+A to select all → Ctrl+C to copy → paste below. Or use the EFTA lookup to open a document directly.</div>
                <span className="sec-label">Look Up by EFTA Number</span>
                <div className="efta-row">
                  <input className="efta-in" placeholder="e.g. 00133349 or EFTA00133349" value={eftaNum} onChange={e=>setEftaNum(e.target.value)} onKeyDown={e=>e.key==='Enter'&&lookupEFTA()}/>
                  <button className="efta-btn" onClick={lookupEFTA}>Open Document</button>
                </div>
                <div className="divider"/>
                <span className="sec-label">Upload Files</span>
                <input ref={fileRef} type="file" multiple accept=".txt,.csv,.html,.json,.pdf" style={{display:'none'}} onChange={e=>handleFiles(e.target.files)}/>
                <div className={`upload-area ${drag?'drag':''}`} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files);}} onClick={()=>fileRef.current?.click()}>
                  <div className="ua-input"/>
                  <div className="ua-icon">📄</div>
                  <div className="ua-title">Drop files or click to browse</div>
                  <div className="ua-sub">TXT, CSV, HTML, JSON, PDF (text-layer) · Multiple files supported</div>
                </div>
                {docs.length>0&&<div className="doc-list">{docs.map((d,i)=><div key={i} className="doc-card"><span className="doc-name">{d.name}</span><span className="doc-sz">{d.size}</span><button className="doc-rm" onClick={()=>setDocs(docs.filter((_,j)=>j!==i))}>✕</button></div>)}</div>}
                <div className="paste-wrap">
                  <span className="sec-label">Or Paste Document Text</span>
                  <textarea className="ta" rows={7} placeholder="Paste Epstein file content here…" value={pastedText} onChange={e=>setPastedText(e.target.value)}/>
                </div>
                <button className="analyze-btn" disabled={analyzing||(!docs.length&&!pastedText.trim())} onClick={analyzeDoc}>
                  {!isPremium?'🔒 Premium Required':analyzing?'Analyzing…':'Analyze Document'}
                </button>
                {analyzing&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'20px 0',fontSize:12,color:'var(--muted)'}}><div className="spin"/>Running AI analysis…</div>}
                {analysis&&(
                  <div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'16px 0 10px'}}>
                      <span style={{fontSize:14,fontWeight:600}}>Analysis</span>
                      <div style={{display:'flex',gap:8}}>
                        <button className="ra" onClick={()=>{const n={id:`n-${Date.now()}`,title:`Analysis ${new Date().toLocaleDateString()}`,body:analysis,ts:Date.now()};saveNotes([n,...notes]);alert('Saved to notes.');}}>📋 Save</button>
                        <button className="ra" onClick={()=>{const b=new Blob([analysis],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`analysis_${Date.now()}.txt`;a.click();}}>↓ Export</button>
                      </div>
                    </div>
                    <div className="analysis-result">{analysis}</div>
                  </div>
                )}
              </div>
            )}

            {/* NOTES */}
            {tab==='notes'&&(
              <div className="notes-layout">
                <div className="notes-list">
                  <button className="new-note-btn" onClick={newNote}>+ New Note</button>
                  {notes.length===0&&<div style={{padding:'20px 14px',fontSize:12,color:'var(--muted)'}}>No notes yet.</div>}
                  {notes.map(n=>(
                    <div key={n.id} className={`note-item ${activeNote===n.id?'on':''}`} onClick={()=>{setActiveNote(n.id);setNoteTitle(n.title);setNoteBody(n.body);setNoteSaved(true);}}>
                      <div className="note-title-preview">{n.title}</div>
                      <div className="note-body-preview">{n.body?.slice(0,70)||'Empty'}</div>
                      <div className="note-date">{timeAgo(n.ts)}</div>
                    </div>
                  ))}
                </div>
                <div className="note-editor">
                  {!activeNote?<div className="empty"><div className="empty-icon">📋</div><div className="empty-txt">Select a note or create one.</div></div>:<>
                    <input className="note-title-in" value={noteTitle} onChange={e=>{setNoteTitle(e.target.value);setNoteSaved(false);}} placeholder="Note title…"/>
                    <textarea className="note-body-ta" value={noteBody} onChange={e=>{setNoteBody(e.target.value);setNoteSaved(false);}} placeholder="Research notes, EFTA numbers, names, findings, next steps…"/>
                    <div className="note-actions">
                      <button className="na save" onClick={saveNote}>Save{!noteSaved?' *':''}</button>
                      <button className="na" onClick={exportNote}>↓ TXT</button>
                      <button className="na danger" onClick={()=>{saveNotes(notes.filter(n=>n.id!==activeNote));setActiveNote(null);setNoteTitle('');setNoteBody('');}}>Delete</button>
                    </div>
                  </>}
                </div>
              </div>
            )}

            {/* COLLABORATE */}
            {tab==='collaborate'&&(
              <div className="collab-layout">
                <div className="collab-sb">
                  <span className="sb-label">Channels</span>
                  {CHANNELS.map(c=>(
                    <button key={c.id} className={`ch-item ${channel===c.id?'on':''}`} onClick={()=>setChannel(c.id)}>
                      # {c.label}
                    </button>
                  ))}
                  <div style={{borderTop:'1px solid var(--bdr)',padding:'10px 8px 4px',marginTop:'auto'}}>
                    <span style={{fontSize:10,color:'var(--muted)',letterSpacing:1,textTransform:'uppercase',display:'block',marginBottom:6}}>Online</span>
                    {['DocReviewer','FOIA_Tracker','Analyst_881',myHandle].map(u=>(
                      <div key={u} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 6px',fontSize:11,color:u===myHandle?'var(--blue)':'var(--muted)'}}>
                        <div style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',flexShrink:0}}/>
                        {u}{u===myHandle?' (you)':''}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="collab-main">
                  <div className="collab-hdr">
                    <div style={{fontWeight:600}}># {channel}</div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{CHANNELS.find(c=>c.id===channel)?.desc}</div>
                  </div>
                  <div className="messages">
                    {(msgs[channel]||[]).map(m=>(
                      <div key={m.id} className="msg">
                        <div className="msg-av">{m.av||m.author.slice(0,2)}</div>
                        <div className="msg-body">
                          <div className="msg-meta"><span className="msg-author">{m.author}</span><span className="msg-time">{timeAgo(m.ts)}</span></div>
                          <div className="msg-text" dangerouslySetInnerHTML={{__html:m.text.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>').replace(/(EFTA\d+)/g,'<code>$1</code>')}}/>
                        </div>
                      </div>
                    ))}
                    <div ref={msgsEndRef}/>
                  </div>
                  <div className="msg-input-area">
                    <input className="msg-in" placeholder={`Message #${channel}…`} value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMsg()}/>
                    <div className="msg-toolbar"><button className="send-btn" disabled={!msgInput.trim()} onClick={sendMsg}>Send</button></div>
                  </div>
                </div>
              </div>
            )}

            {/* RESOURCES */}
            {tab==='resources'&&(
              <>
                <div style={{padding:'20px 24px 4px'}}>
                  <div style={{fontFamily:'var(--serif)',fontSize:24,fontStyle:'italic',marginBottom:4}}>Research Resources</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>Official DOJ files, research tools, court records, and journalism archives. All open in a new tab.</div>
                </div>
                <div className="res-grid">
                  {RESOURCES.map((r,i)=>(
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="res-card">
                      <div className="res-icon">{r.icon}</div>
                      <div className="res-title">{r.title}</div>
                      <div className="res-desc">{r.desc}</div>
                      <span className="res-arrow">Open ↗</span>
                    </a>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
