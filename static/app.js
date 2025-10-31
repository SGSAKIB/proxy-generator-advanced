const genBtn = document.getElementById('gen');
const status = document.getElementById('status');
const tbody = document.querySelector('#results tbody');
const downloadBtn = document.getElementById('download');
const prog = document.getElementById('prog');
const conc = document.getElementById('concurrency');
const concVal = document.getElementById('concVal');
const typeSel = document.getElementById('type');
let lastWorking = [];

conc.oninput = () => concVal.textContent = conc.value;

genBtn.onclick = async () => {
  status.textContent = 'Starting...';
  tbody.innerHTML = '';
  prog.value = 0;
  const payload = { type: typeSel.value, concurrency: conc.value };
  status.textContent = 'Fetching + testing... (this can take up to 2 minutes)';
  const res = await fetch('/generate', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  const data = await res.json();
  status.textContent = `Found ${data.total_found}, working ${data.working_count}`;
  lastWorking = data.working;
  data.working.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${p}</td>`;
    tbody.appendChild(tr);
  });
  prog.value = 100;
};

downloadBtn.onclick = async () => {
  if (!lastWorking.length) return alert('No working proxies to download');
  const res = await fetch('/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proxies: lastWorking })
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'working_proxies.txt';
  a.click();
  URL.revokeObjectURL(url);
};

