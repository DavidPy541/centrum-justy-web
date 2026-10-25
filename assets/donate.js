(function () {
  var IBAN = 'CZ0455000000001496624005';
  var sel = document.getElementById('donate-amount');
  if (!sel) return;
  var custom = document.getElementById('donate-custom');
  var vop = document.getElementById('donate-vop');
  var details = document.getElementById('donate-details');
  var locked = document.getElementById('donate-locked');
  var sum = document.getElementById('donate-sum');
  var qrBox = document.getElementById('donate-qr');

  function amount() {
    var v = sel.value === 'other' ? parseFloat(custom.value) : parseFloat(sel.value);
    return (isFinite(v) && v >= 1 && v <= 1000000) ? Math.round(v) : null;
  }
  function render() {
    custom.hidden = sel.value !== 'other';
    var a = amount();
    var ok = vop.checked && a;
    details.hidden = !ok;
    locked.hidden = !!ok;
    locked.textContent = !vop.checked ? 'Platební údaje se zobrazí po potvrzení souhlasu s podmínkami.' : 'Zadejte prosím částku.';
    if (!ok) return;
    sum.textContent = a.toLocaleString('cs-CZ') + ' Kč';
    var spd = 'SPD*1.0*ACC:' + IBAN + '*AM:' + a.toFixed(2) + '*CC:CZK*MSG:DAR CENTRUM JUSTY';
    var qr = window.CJQR(spd), n = qr.getModuleCount(), q = 4, size = n + 2 * q, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++)
      if (qr.isDark(y, x)) d += 'M' + (x + q) + ' ' + (y + q) + 'h1v1h-1z';
    qrBox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges"><rect width="' + size + '" height="' + size + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  }
  sel.addEventListener('change', render);
  custom.addEventListener('input', render);
  vop.addEventListener('change', render);
  render();
})();
