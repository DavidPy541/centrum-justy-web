(function () {
  /* Klíč služby Web3Forms – určuje, na jaký e-mail přijdou odeslané formuláře.
     Pro změnu příjemce stačí vyměnit tento jeden řádek. */
  var WEB3FORMS_KEY = '66d9e9e0-56ea-4f9e-8e3f-ab60e705468b';

  var FAIL = 'Něco se nepovedlo. Napište nám prosím přímo na centrumjusty@gmail.com nebo zavolejte na 602 214 797.';

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

  document.querySelectorAll('form.signup-form, form.receipt-form, form.poptavka-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      var ok = form.getAttribute('data-success') || 'Děkujeme, přihláška byla odeslána. Ozveme se vám co nejdříve.';

      // Data posíláme jako JSON: při odeslání jako „form-data“ Web3Forms
      // poškodí české znaky v názvech polí (např. „JmÃ©no“ místo „Jméno“).
      var data = { access_key: WEB3FORMS_KEY };
      new FormData(form).forEach(function (v, k) {
        if (k === 'botcheck') return;
        data[k] = data[k] ? data[k] + ', ' + v : v;
      });
      if (form.querySelector('input[name="botcheck"]') && form.querySelector('input[name="botcheck"]').checked) data.botcheck = true;

      status.textContent = 'Odesílám…';
      btn.disabled = true;
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
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
