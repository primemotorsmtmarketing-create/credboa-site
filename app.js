// Renderiza cards a partir do cars.json
(async function(){
  try {
    const resp = await fetch('cars.json', { cache: 'no-store' });
    const data = await resp.json();

    const $grid = document.getElementById('cars');
    $grid.innerHTML = '';

    data.forEach(car => {
      const preco =
        car.preco == null || car.preco === ''
          ? 'Consulte'
          : formatPrice(car.preco);

      const kmTxt =
        car.km == null ? '' : ` • ${Number(car.km).toLocaleString('pt-BR')} km`;

      const meta = `${car.ano} • ${car.combustivel}${kmTxt}${car.cor ? ' • ' + car.cor : ''}`;

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${car.image || 'https://placehold.co/800x500?text=Ve%C3%ADculo'}" alt="${car.modelo}">
        <div class="card-body">
          <div class="badge">${car.marca}</div>
          <h3 style="margin:4px 0 0">${car.modelo}</h3>
          <div class="meta">${meta}</div>
          <div class="price">${preco}</div>
          <div class="actions">
            <a class="btn btn-green"
               href="https://wa.me/5599999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20${encodeURIComponent(car.marca + ' ' + car.modelo)}%20(${car.ano})"
               target="_blank" rel="noopener">Simular pelo WhatsApp</a>
            ${car.link ? `<a class="btn btn-outline" href="${car.link}" target="_blank" rel="noopener">Ver na Prime Motors</a>` : ''}
          </div>
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
