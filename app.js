// Carrega os carros e monta os cards com simulação
(async function(){
  try {
    const resp = await fetch('cars.json', { cache: 'no-store' });
    const cars = await resp.json();

    const $grid = document.getElementById('cars');
    $grid.innerHTML = '';

    cars.forEach((car, idx) => {
      const preco = car.preco ?? null;

      // Regra de entrada mínima: 50% do preço OU 25.000 (o que for maior)
      const entradaMin = preco ? Math.max(25000, preco * 0.5) : 25000;

      const meta = [
        car.ano ? car.ano : '',
        car.km ? `${car.km} km` : '',
        car.cambio ? car.cambio : '',
        car.combustivel ? car.combustivel : '',
      ].filter(Boolean).join(' • ');

      // Card
      const $card = document.createElement('article');
      $card.className = 'card';
      $card.innerHTML = `
        <img src="${car.image}" alt="${car.modelo}">
        <div class="card-body">
          <div class="badge">${car.marca}</div>
          <h3>${car.modelo}</h3>
          <div class="meta">${meta || '&nbsp;'}</div>

          <div class="price-row">
            <div class="label">Preço Total</div>
            <div class="price">${preco ? formatBRL(preco) : 'Consulte'}</div>
          </div>

          <div class="entry">
            <div class="entry-top" style="display:flex;align-items:center;justify-content:space-between">
              <div class="label">Entrada Mínima</div>
              <div class="pill">50%</div>
            </div>
            <div class="value">${formatBRL(entradaMin)}</div>
          </div>

          <div class="cta-row">
            <button class="btn btn-outline btn-block sim-btn">📊 Simular Parcelas</button>
          </div>

          <div class="sim-box" id="sim-${idx}">
            <div class="sim-header">
              <div class="sim-title">Simulação de Parcelas</div>
              <button class="sim-close" title="Fechar">&times;</button>
            </div>
            <div class="sim-inner">
              <div class="meta"><strong>Valor Financiado:</strong> <span class="financed">${formatBRL(Math.max(0, (preco||0) - entradaMin))}</span></div>

              <div class="sim-row">
                <div class="sim-chip">
                  <h4>24x</h4>
                  <div class="amt" data-n="24"></div>
                </div>
                <div class="sim-chip">
                  <h4>48x</h4>
                  <div class="amt" data-n="48"></div>
                </div>
                <div class="sim-chip">
                  <h4>60x</h4>
                  <div class="amt" data-n="60"></div>
                </div>
              </div>

              <p class="note" style="margin-top:8px">
                *Simulação com taxa de <strong>1,89% a.m.</strong>. Valores sujeitos à aprovação de crédito.
              </p>

              <div class="cta-row">
                <a class="btn btn-green btn-block interest"
                   href="https://wa.me/5599999999999?text=Tenho+interesse+no+${encodeURIComponent(car.marca+' '+car.modelo)}+${preco? '('+formatBRL(preco)+')':''}"
                   target="_blank">Tenho Interesse</a>
              </div>
            </div>
          </div>
        </div>
      `;

      // Eventos de simulação
      const $simBtn   = $card.querySelector('.sim-btn');
      const $simBox   = $card.querySelector(`#sim-${idx}`);
      const $closeBtn = $simBox.querySelector('.sim-close');

      $simBtn.addEventListener('click', () => {
        fillSimulation($simBox, preco, entradaMin);
        $simBox.style.display = 'block';
      });
      $closeBtn.addEventListener('click', () => {
        $simBox.style.display = 'none';
      });

      $grid.appendChild($card);
    });

  } catch (e) {
    console.error(e);
    document.getElementById('cars').innerHTML =
      '<p>Não foi possível carregar os veículos agora.</p>';
  }
})();

/* ===== Helpers ===== */
function formatBRL(v){
  return Number(v || 0).toLocaleString('pt-BR',{ style:'currency', currency:'BRL' });
}

// PMT: parcela de financiamento (juros compostos)
function parcelaMensal(PV, i, n){
  if (PV <= 0) return 0;
  const r = i;
  return PV * r / (1 - Math.pow(1 + r, -n));
}

// Preenche simulação no box
function fillSimulation($simBox, preco, entradaMin){
  const taxaMensal = 0.0189;
  const financiado = Math.max(0, (preco || 0) - entradaMin);

  $simBox.querySelector('.financed').textContent = formatBRL(financiado);

  $simBox.querySelectorAll('.amt').forEach($amt => {
    const n = Number($amt.dataset.n);
    const pmt = parcelaMensal(financiado, taxaMensal, n);
    $amt.textContent = formatBRL(pmt);
  });
}
