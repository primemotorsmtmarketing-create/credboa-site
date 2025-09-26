// ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

/**
 * Dados mockados (Nissan) – você pode alterar livremente
 * OBS: entrada padrão "a partir de 25.000" e simulação já visível
 */
const cars = [
  {
    img: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Nissan Kicks Advance 1.6 Aut',
    year: 2024, km: '24.000 km', cambio: 'Automático', comb: 'Flex',
    price: 119900, // preço total (demo)
    entryFrom: 25000
  },
  {
    img: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Nissan Versa Unique',
    year: 2021, km: '38.000 km', cambio: 'Automático', comb: 'Flex',
    price: 88900,
    entryFrom: 25000
  },
  {
    img: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Nissan Sentra SV 2.0',
    year: 2019, km: '52.000 km', cambio: 'Automático', comb: 'Flex',
    price: 79900,
    entryFrom: 25000
  },
  {
    img: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: 'Nissan Frontier XE 4x4',
    year: 2017, km: '96.000 km', cambio: 'Automático', comb: 'Diesel',
    price: 164900,
    entryFrom: 25000
  }
];

const list = document.getElementById('cars-list');

function currency(v){
  return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
}

// Simulação simples (juros fixos apenas para demonstração)
function simulate(total, entry){
  const financed = Math.max(total - entry, 0);

  const tax = 0.0189; // 1,89% a.m. (demo)
  const calc = (months)=>{
    // tabela PRICE simplificada
    const i = tax;
    const pmt = financed * (i * Math.pow(1+i, months)) / (Math.pow(1+i, months) - 1);
    return pmt;
  };

  return {
    financed,
    p24: calc(24),
    p48: calc(48),
    p60: calc(60),
  }
}

cars.forEach(c=>{
  const card = document.createElement('article');
  card.className = 'card';

  card.innerHTML = `
    <img class="card__media" src="${c.img}" alt="${c.title}" />
    <div class="card__body">
      <div class="card__title">${c.title}</div>
      <div class="meta">
        ${c.year} • ${c.km} • ${c.cambio} • ${c.comb}
      </div>

      <div class="price">Preço Total: ${currency(c.price)}</div>

      <div class="entry">
        <div><strong>Entrada Mínima</strong><br>${currency(c.entryFrom)}</div>
        <span class="badge">50%</span>
      </div>

      <!-- Simulação sempre aberta -->
      <div class="sim">
        <div class="sim__title">Simulação de Parcelas</div>

        <div class="meta">Valor Financiado e parcelas calculadas com taxa de 1,89% a.m. (exemplo).</div>
        <div class="sim__row">
          <div class="sim__box">
            <small>24x</small>
            <div class="sim__val" data-kind="p24">–</div>
          </div>
          <div class="sim__box">
            <small>48x</small>
            <div class="sim__val" data-kind="p48">–</div>
          </div>
          <div class="sim__box">
            <small>60x</small>
            <div class="sim__val" data-kind="p60">–</div>
          </div>
        </div>
      </div>

      <a class="btn-interest" href="https://wa.me/5599999999999?text=Tenho%20interesse%20no%20${encodeURIComponent(c.title)}"
         target="_blank" rel="noopener">Tenho Interesse</a>
    </div>
  `;

  // preenche simulação
  const s = simulate(c.price, c.entryFrom);
  card.querySelector('[data-kind="p24"]').textContent = currency(s.p24);
  card.querySelector('[data-kind="p48"]').textContent = currency(s.p48);
  card.querySelector('[data-kind="p60"]').textContent = currency(s.p60);

  list.appendChild(card);
});

