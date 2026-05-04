const tenantId = 1;
let calendar;

function authHeaders(){ return {'Authorization':'Bearer demo-token','Content-Type':'application/json'}; }

async function loadDashboard(){
 const data = await fetch('/api/dashboard?tenant_id='+tenantId).then(r=>r.json());
 const alerts = document.getElementById('alerts');
 alerts.innerHTML='';
 (data.analysis?.alerts||[]).forEach(a=>{const p=document.createElement('p');p.className=a.level==='high'?'critical':'pending';p.textContent='• '+a.message;alerts.appendChild(p)});
 const assistant=document.getElementById('assistant');assistant.innerHTML='';
 (data.analysis?.suggestions||[]).forEach(s=>{const li=document.createElement('li');li.textContent=s;assistant.appendChild(li)});
}

async function loadCalendar(){
 const res = await fetch('/api/calendar/suggestions?tenant_id='+tenantId).then(r=>r.json());
 const events = (res.suggestions||[]).map(s=>({title:s.type+': '+s.idea,start:s.date}));
 calendar.removeAllEvents();
 calendar.addEventSource(events);
}

async function generateCopy(){
 const topic=document.getElementById('topic').value;
 const tone=document.getElementById('tone').value;
 const res=await fetch('/api/content/generate-copy?tenant_id='+tenantId,{method:'POST',headers:authHeaders(),body:JSON.stringify({topic,tone})}).then(r=>r.json());
 document.getElementById('copyOut').textContent=res.copy || res.error;
}

async function autopilot(){
 const res = await fetch('/api/automation/autopilot?tenant_id='+tenantId,{method:'POST',headers:authHeaders(),body:JSON.stringify({project_id:1,industry:'gastronomia'})}).then(r=>r.json());
 alert('Borradores creados: '+(res.created_drafts||0));
 await loadDashboard();
 await loadCalendar();
}

document.addEventListener('DOMContentLoaded',()=>{
 calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {initialView:'dayGridMonth',height:500});
 calendar.render();
 document.getElementById('copyBtn').addEventListener('click',generateCopy);
 document.getElementById('strategyBtn').addEventListener('click',loadDashboard);
 document.getElementById('autopilotBtn').addEventListener('click',autopilot);
 loadDashboard();
 loadCalendar();
});
