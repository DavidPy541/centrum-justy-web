/* Akce na webu se načítají z Google Sheetu (publikovaného jako CSV).
   Po vložení odkazu do SHEET_CSV_URL se nové řádky v tabulce objeví na webu samy (zpoždění cca 5 min). */
(function () {
  var SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR98M29Y2G3E3_O1zs4JfMeSY4uDagOQaJ2iwVprekjDtmnEM71PVu4ASr4rJPun01PBHDX-TDczBuh/pub?gid=0&single=true&output=csv'; // publikovaný Google Sheet s akcemi

  var FALLBACK = [
    { datum: '5.12.', cas: '14 hod.', nazev: 'Mikulášské setkání pěstounských rodin',
      popis: 'Centrum JUSTY zve pěstounské rodiny na příjemné předvánoční odpoledne plné her, tvoření, smíchu a společného setkání.\n\nČeká nás veselé mikulášské odpoledne pro děti i dospělé. Děti se mohou těšit na Mikuláše, anděla a čerta, mikulášské překvapení, tvoření a další zábavu.\n\nPro pěstouny bude příležitostí také zastavit se v předvánočním čase, potkat se s ostatními rodinami a strávit společný čas v příjemné atmosféře centra JUSTY.',
      odkaz: '', textodkazu: '' },
    { datum: 'datum bude upřesněno', cas: '', nazev: 'Psychohygiena pěstouna a její význam pro zdravý vývoj dítěte',
      popis: 'Zveme vás na prezenční vzdělávání pro pěstouny, zaměřené na péči o vlastní psychickou pohodu, zvládání stresu a prevenci přetížení.\n\nSpolečně se podíváme na to, jak může psychická pohoda pěstouna přispívat k vytváření bezpečného a stabilního prostředí pro dítě.',
      odkaz: 'assets/dokumenty/harmonogram-vzdelavani-psychohygiena.pdf', textodkazu: 'Harmonogram vzdělávání' }
  ];

  var box = document.getElementById('akce-list');
  if (!box) return;

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''); }

  function parseCSV(text) {
    var rows = [], row = [], f = '', q = false, i, c;
    text = text.replace(/^﻿/, '');
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(f); f = ''; rows.push(row); row = [];
      } else f += c;
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); }
    return rows;
  }

  function fromCSV(text) {
    var rows = parseCSV(text), head = (rows.shift() || []).map(norm), out = [];
    function col(names) { for (var k = 0; k < names.length; k++) { for (var j = 0; j < head.length; j++) { if (head[j].indexOf(names[k]) === 0) return j; } } return -1; }
    var ix = { datum: col(['datumakce', 'datum']), cas: col(['caszacatkuakce', 'cas']), nazev: col(['nazevakce', 'nazev']),
               popis: col(['popisakce', 'popis']), odkaz: col(['odkazurl', 'odkaz']), textodkazu: col(['textodkazu']), zobrazit: col(['zobrazit']) };
    rows.forEach(function (r) {
      function v(k) { return ix[k] > -1 && r[ix[k]] ? r[ix[k]].trim() : ''; }
      if (!v('nazev')) return;
      if (/^(ne|no|0|false|skryt)/i.test(v('zobrazit'))) return;
      out.push({ datum: v('datum'), cas: v('cas'), nazev: v('nazev'), popis: v('popis'), odkaz: v('odkaz'), textodkazu: v('textodkazu') });
    });
    return out;
  }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  function safeUrl(u) { return /^(https?:\/\/|assets\/|\/)/i.test(u) ? u : ''; }

  function render(list) {
    box.textContent = '';
    if (!list.length) { box.appendChild(el('p', '', 'Momentálně nejsou vypsané žádné akce. Další termíny budeme zveřejňovat zde.')); return; }
    list.forEach(function (e) {
      var card = el('article', 'event');
      var badge = el('div', 'event-date' + (e.datum.length > 9 ? ' event-date-long' : ''), e.datum || 'Termín bude upřesněn');
      var body = el('div', 'event-body');
      body.appendChild(el('h3', '', e.nazev));
      if (e.cas) body.appendChild(el('p', 'event-time', 'Začátek: ' + e.cas));
      (e.popis || '').split(/\n\s*\n/).forEach(function (p) { if (p.trim()) body.appendChild(el('p', '', p.trim())); });
      var u = safeUrl(e.odkaz);
      if (u) { var a = el('a', 'btn-outline', e.textodkazu || 'Více informací'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; body.appendChild(a); }
      card.appendChild(badge); card.appendChild(body); box.appendChild(card);
    });
  }

  if (!SHEET_CSV_URL) { render(FALLBACK); return; }
  fetch(SHEET_CSV_URL).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (t) { render(fromCSV(t)); })
    .catch(function () { render(FALLBACK); });
})();
