(function () {
  document.querySelectorAll('[data-toggle-form]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var f = document.getElementById(btn.getAttribute('data-toggle-form'));
      if (!f) return;
      f.hidden = !f.hidden;
      if (!f.hidden) { var i = f.querySelector('input[type="text"]'); if (i) i.focus(); }
    });
  });
  document.querySelectorAll('form.signup-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      status.textContent = 'Odesílám…';
      btn.disabled = true;
      fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
      }).then(function (r) { return r.json(); }).then(function (res) {
        btn.disabled = false;
        if (res.success) { status.textContent = 'Děkujeme, přihláška byla odeslána. Ozveme se vám co nejdříve.'; form.reset(); }
        else { status.textContent = 'Něco se nepovedlo. Napište nám prosím přímo na centrumjusty@gmail.com.'; }
      }).catch(function () {
        btn.disabled = false;
        status.textContent = 'Něco se nepovedlo. Napište nám prosím přímo na centrumjusty@gmail.com.';
      });
    });
  });
})();
