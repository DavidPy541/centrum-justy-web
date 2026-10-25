(function () {
  var IBAN = 'CZ0455000000001496624005';
  var input = document.getElementById('donate-amount');
  if (!input) return;
  var chips = document.querySelectorAll('.amount-chip');
  var vop = document.getElementById('donate-vop');
  var details = document.getElementById('donate-details');
  var locked = document.getElementById('donate-locked');
  var sum = document.getElementById('donate-sum');
  var qrBox = document.getElementById('donate-qr');

  function amount() {
    var v = parseFloat(String(input.value).replace(',', '.'));
    return (isFinite(v) && v >= 1 && v <= 1000000) ? Math.round(v) : null;
  }
  function markChips() {
    var a = amount();
    chips.forEach(function (c) {
      var on = a !== null && +c.getAttribute('data-amount') === a;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function render() {
    markChips();
    var a = amount();
    var ok = vop.checked && a;
    details.hidden = !ok;
    locked.hidden = !!ok;
    locked.textContent = !a ? 'Zvolte nebo zadejte prosím částku.' : 'Platební údaje se zobrazí po potvrzení souhlasu s podmínkami.';
    if (!ok) return;
    sum.textContent = a.toLocaleString('cs-CZ') + ' Kč';
    var spd = 'SPD*1.0*ACC:' + IBAN + '*AM:' + a.toFixed(2) + '*CC:CZK*MSG:DAR CENTRUM JUSTY';
    var qr = window.CJQR(spd), n = qr.getModuleCount(), q = 4, size = n + 2 * q, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++)
      if (qr.isDark(y, x)) d += 'M' + (x + q) + ' ' + (y + q) + 'h1v1h-1z';
    qrBox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges"><rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () { input.value = c.getAttribute('data-amount'); render(); });
  });
  input.addEventListener('input', render);
  vop.addEventListener('change', render);
  render();

  /* formulář: žádost o potvrzení o daru */
  var form = document.getElementById('potvrzeni-daru');
  if (!form) return;
  function setGroup(nodes, show) {
    nodes.forEach(function (el) {
      el.hidden = !show;
      el.querySelectorAll('input').forEach(function (i) { i.disabled = !show; });
    });
  }
  function donorType() {
    var firma = form.querySelector('input[data-donor="firma"]').checked;
    setGroup(form.querySelectorAll('[data-for="osoba"]'), !firma);
    setGroup(form.querySelectorAll('[data-for="firma"]'), firma);
  }
  form.querySelectorAll('input[data-donor]').forEach(function (r) { r.addEventListener('change', donorType); });
  donorType();
  var other = document.getElementById('r-jina-adresa');
  var koresp = document.getElementById('r-koresp');
  function korespToggle() { setGroup([koresp], other.checked); }
  other.addEventListener('change', korespToggle);
  korespToggle();
  form.addEventListener('reset', function () { setTimeout(function () { donorType(); korespToggle(); }, 0); });
  // předvyplnit částku a dnešní datum při otevření formuláře
  document.querySelectorAll('[data-toggle-form="potvrzeni-daru"]').forEach(function (l) {
    l.addEventListener('click', function () {
      var c = document.getElementById('r-castka'), dt = document.getElementById('r-datum'), a = amount();
      if (a && !c.value) c.value = a;
      if (!dt.value) { var t = new Date(); dt.value = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
    });
  });
})();
