(async function(){
  try {
    const resp = await fetch('cars.json', { cache: 'no-store' });
    const data = await resp.json();

    const $grid = document.getElementById('cars');
    $grid.innerHTML = '';

    data.forEach(car => {
      const preco = car.preco ? formatPrice(car.preco) : 'Consulte';
      const meta = `${car.ano} • ${car.combustivel}${car.cor ? ' • ' + car.cor : ''}`;

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${car.image}" alt="${car.modelo}">
        <div class="card-body">
          <div class="badge">${car.marca}</div>
          <h3 style="margin:4px 0 0">${car.modelo}</h3>
          <div class="meta">${meta}</div>
          <div class="price">${preco}</div>
          <a class="btn btn-green"
             href="https://wa.me/5599999999999?text=Tenho+interesse+no+${encodeURIComponent(car.modelo)}+(${car.ano})"
             target="_blank">
             Simular no WhatsApp
          </a>
        </div>
      `;
      $grid.appendChild(card);
    });
  } catch (e) {
    console.error('Erro ao carregar carros:', e);
    document.getElementById('cars').innerHTML =
      '<p>Não foi possível carregar os veículos agora.</p>';
  }
})();

function formatPrice(v){
  return Number(v).toLocaleString('pt-BR',{ style:'currency', currency:'BRL' });
}
