const defaultSites = {
  netflix: 'https://www.netflix.com',
  poki: 'https://poki.com',
  crazygames: 'https://www.crazygames.com',
  google: 'https://www.google.com',
  firefox: 'https://www.mozilla.org/firefox/new/'
};

// load saved or fallback to defaults
const sites = loadSavedSites();

function loadSavedSites(){
  try{
    const raw = localStorage.getItem('mainSheetSites');
    if(!raw) return {...defaultSites};
    const parsed = JSON.parse(raw);
    return {...defaultSites, ...parsed};
  }catch(e){
    return {...defaultSites};
  }
}

function applySitesToUI(){
  Object.keys(sites).forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.href = sites[id];
    const input = document.querySelector(`#settingsForm input[name="${id}"]`);
    if(input) input.value = sites[id];
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  applySitesToUI();
});

document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('searchInput').addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') doSearch();
});

function doSearch(){
  const q = document.getElementById('searchInput').value.trim();
  if(!q) return;
  const isUrl = /\.|:\/\//.test(q);
  const target = isUrl ? (q.startsWith('http') ? q : 'https://'+q) : 'https://www.google.com/search?q='+encodeURIComponent(q);
  window.location.href = target;
}

// keyboard shortcuts Alt+1..Alt+5 — navigate in same tab
window.addEventListener('keydown', (e)=>{
  if(!e.altKey) return;
  const map = { '1':'netflix','2':'poki','3':'crazygames','4':'google','5':'firefox' };
  const s = map[e.key];
  if(s){
    e.preventDefault();
    window.location.href = sites[s];
  }
});

// Settings panel behavior
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const settingsForm = document.getElementById('settingsForm');
const saveBtn = document.getElementById('saveSettings');
const resetBtn = document.getElementById('resetSettings');
const closeBtn = document.getElementById('closeSettings');

function openSettings(){
  settingsPanel.style.display = 'block';
  settingsPanel.setAttribute('aria-hidden','false');
  settingsToggle.setAttribute('aria-expanded','true');
  applySitesToUI();
}

function closeSettings(){
  settingsPanel.style.display = 'none';
  settingsPanel.setAttribute('aria-hidden','true');
  settingsToggle.setAttribute('aria-expanded','false');
}

settingsToggle.addEventListener('click', ()=>{
  const open = settingsPanel.style.display !== 'block';
  if(open) openSettings(); else closeSettings();
});

saveBtn.addEventListener('click', ()=>{
  const form = new FormData(settingsForm);
  Object.keys(sites).forEach(k=>{
    const v = form.get(k);
    if(v && v.trim()) sites[k]=v.trim();
  });
  localStorage.setItem('mainSheetSites', JSON.stringify(sites));
  applySitesToUI();
  closeSettings();
});

resetBtn.addEventListener('click', ()=>{
  localStorage.removeItem('mainSheetSites');
  Object.keys(defaultSites).forEach(k=>sites[k]=defaultSites[k]);
  applySitesToUI();
});

closeBtn.addEventListener('click', closeSettings);

// ensure settings panel is hidden by default
settingsPanel.style.display = 'none';

