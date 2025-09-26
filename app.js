const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

function formatBR(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function PMT(valor,taxaPct,meses){
  const i = taxaPct/100;
  if (i === 0) return valor/meses;
  return valor * (i*Math.pow(1+i,meses))/(Math.pow(1+i,meses)-1);
}

async function loadCars(){
  const grid = document.getElementById('cars');
  const res = await fetch('cars.json');
  const cars = await res.json();

  cars.forEach((c, idx)=>{
    const id = `car-${idx}`;
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${c.foto}" alt="${c.modelo}">
      <div class="card-body" id="${id}" data-preco="${c.preco}" data-entrada-min="${c.entrada_min}" data-taxa="${c.taxa||1.89}" data-modelo="${c.modelo}" data-link="${c.link||'#'}">
        <span class="badge">Aceita negativado</span>
        <h3 style="margin:8px 0 2px">${c.modelo}</h3>
        <div class="meta">${c.ano} • ${c.km} km • ${c.cambio} • ${c.combustivel}</div>
        <div class="price">Preço Total <strong>${formatBR(c.preco)}</strong></div>

        <div class="entry">
          <div><strong>Entrada mínima</strong></div>
          <div style="font-size:18px;font-weight:900;color:#168a43">${formatBR(c.entrada_min)}</div>
          <label>Entrada desejada:
            <input type="number" id="entrada-${idx}" value="${c.entrada_min}" min="0" step="100">
          </label>
          <button class="btn btn-green" style="margin-top:8px" onclick="simular('${id}', ${idx})">Simular parcelas</button>
        </div>

        <div class="sim" id="sim-${idx}"></div>

        <a id="zap-${idx}" class="btn btn-outline" style="margin-top:10px;display:inline-block" target="_blank">Quero este veículo no WhatsApp</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function simular(domId, idx){
  const wrap = document.getElementById(domId);
  const preco = Number(wrap.dataset.preco);
  const entradaMin = Number(wrap.dataset.entradaMin);
  const taxa = Number(wrap.dataset.taxa);
  const modelo = wrap.dataset.modelo;
  const link = wrap.dataset.link;

  const entradaEl = document.getElementById(`entrada-${idx}`);
  let entrada = Number(entradaEl.value||0);
  if (entrada < entradaMin){
    entrada = entradaMin;
    entradaEl.value = entradaMin;
    alert('A entrada não pode ser menor que a mínima.');
  }
  const financiado = Math.max(0, preco - entrada);
  const prazos = [24,48,60];

  const sim = document.getElementById(`sim-${idx}`);
  sim.innerHTML = `
    <div class="card" style="border:1px solid #e7eef7">
      <div style="font-weight:900;margin-bottom:6px">Simulação de parcelas</div>
      <div>Financiado: <strong>${formatBR(financiado)}</strong> • Entrada: ${formatBR(entrada)} • Taxa: ${taxa}% a.m.</div>
      <div style="margin-top:8px">
        ${prazos.map(m => `<span class="plan">${m}x ${formatBR(PMT(financiado,taxa,m))}</span>`).join('')}
      </div>
      <div style="font-size:12px;color:#64748b;margin-top:6px">Valores estimados pela Tabela Price. Sujeito à aprovação.</div>
    </div>
  `;

  const msg = encodeURIComponent(
`Olá! Tenho interesse no ${modelo}.
Preço: ${formatBR(preco)}
Entrada: ${formatBR(entrada)}
Link: ${link}`);
  const zap = document.getElementById(`zap-${idx}`);
  zap.href = `https://wa.me/5565992769357?text=${msg}`;
}

loadCars();
