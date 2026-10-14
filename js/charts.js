// v12: eight charts, wider cards, no inner tile, grid map replaces point map.
const chartSpecs = [
  ['chart06','charts/06_richness_map.vg.json'],
  ['chart09','charts/09_species_rank.vg.json'],
  ['chart01','charts/01_families.vg.json'],
  ['chart02','charts/02_body_length_hist.vg.json'],
  ['chart05','charts/05_grid_map.vg.json'],
  ['chart08','charts/08_calendar.vg.json'],
  ['chart10','charts/10_status_bar.vg.json'],
  ['chart11','charts/11_status_trends_line.vg.json']
];
const rendered = new Map();
async function showChart(id, filename) {
 const el=document.getElementById(id);
 if (!el) return;
 try {
  const response=await fetch(filename);
  if(!response.ok) throw Error(`${filename}: HTTP ${response.status}`);
  const spec=await response.json();
  spec.width='container';
  const old=rendered.get(id);
  if(old?.view) old.view.finalize();
  el.textContent='';
  const r=await vegaEmbed(el,spec,{renderer:'svg',actions:false,tooltip:true});
  rendered.set(id,r);
 }catch(e){
  console.error('Chart error',filename,e);
  el.innerHTML='<p class="chart-error">Chart could not load. Open F12 → Console for details.</p>';
 }
}
async function drawAll(){
 if(typeof vegaEmbed!=='function'){
  document.querySelectorAll('.chart').forEach(el=>el.innerHTML='<p class="chart-error">Vega libraries unavailable. Check internet access.</p>');
  return;
 }
 if(document.fonts?.ready) await document.fonts.ready;
 await Promise.all(chartSpecs.map(args=>showChart(...args)));
}
window.addEventListener('DOMContentLoaded',drawAll);
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(drawAll,450);});
