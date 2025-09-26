/**
 * Calcula parcelas com juros compostos (tabela Price)
 * taxa = 1.89% a.m. (0.0189)
 * n = número de meses (24, 48, 60)
 */
(function () {
  const TAXA = 0.0189;

  const formatBR = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function parcelaMensal(financiado, meses, taxa) {
    if (financiado <= 0) return 0;
    const i = taxa;
    const pow = Math.pow(1 + i, meses);
    return financiado * ((i * pow) / (pow - 1));
  }

  function atualizarCard(card) {
    const price = Number(card.dataset.price || 0);
    const entry = Number(card.dataset.entry || 0);
    const financiado = Math.max(0, price - entry);

    const amounts = card.querySelectorAll(".amount");
    amounts.forEach((el) => {
      const meses = Number(el.dataset.months);
      const pm = parcelaMensal(financiado, meses, TAXA);
      el.textContent = formatBR(pm);
    });
  }

  document.querySelectorAll(".card").forEach(atualizarCard);
})();
