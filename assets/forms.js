(function () {
  var FAIL = 'Něco se nepovedlo. Napište nám prosím přímo na centrumjusty@gmail.com.';
  document.querySelectorAll('[data-toggle-form]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.getElementById(btn.getAttribute('data-toggle-form'));
      if (!f) return;
      f.hidden = !f.hidden;
      btn.setAttribute('aria-expanded', f.hidden ? 'false' : 'true');
      if (!f.hidden) {
        if (f.scrollIntoView) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var i = f.querySelector('input[type="text"]:not([disabled])');
        if (i) setTimeout(function () { i.focus({ preventScroll: true }); }, 350);
      }
    });
  });
  document.querySelectorAll('form.signup-form, form.receipt-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      var ok = form.getAttribute('data-success') || 'Děkujeme, přihláška byla odeslána. Ozveme se vám co nejdříve.';
      status.textContent = 'Odesílám…';
      btn.disabled = true;
      fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
      }).then(function (r) { return r.json(); }).then(function (res) {
        btn.disabled = false;
        if (res.success) { form.reset(); status.textContent = ok; }
        else { status.textContent = FAIL; }
      }).catch(function () {
        btn.disabled = false;
        status.textContent = FAIL;
      });
    });
  });
})();
