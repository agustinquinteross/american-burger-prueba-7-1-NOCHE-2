async function loadDashboard(){
 const data = await fetch('/api/dashboard?tenant_id=1').then(r=>r.json());
 const alerts = document.getElementById('alerts');
 alerts.innerHTML='';
 data.analysis.alerts.forEach(a=>{const p=document.createElement('p');p.className=a.level==='high'?'critical':'pending';p.textContent='• '+a.message;alerts.appendChild(p)});
 const assistant=document.getElementById('assistant');assistant.innerHTML='';
 data.analysis.suggestions.forEach(s=>{const li=document.createElement('li');li.textContent=s;assistant.appendChild(li)});
}
async function generateCopy(){
 const topic=document.getElementById('topic').value;
 const tone=document.getElementById('tone').value;
 const res=await fetch('/api/content/generate-copy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic,tone})}).then(r=>r.json());
 document.getElementById('copyOut').textContent=res.copy;
}
document.getElementById('copyBtn').addEventListener('click',generateCopy);
document.getElementById('strategyBtn').addEventListener('click',loadDashboard);
loadDashboard();
