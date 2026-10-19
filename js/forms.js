/* MC Joint — form handler.
 * Sends form submissions to a Google Apps Script web app (writes a row to a Google Sheet and
 * notifies by email / WhatsApp / Telegram). Forms are marked with data-mc-form="<name>".
 */
(function () {
  var MC_FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzgmoJlJhIgYfz2VwatAIx_Dvs1YLdIC6SQfWhl0UB6PPGng3VKsVWsmTuobRkJ2Sfk/exec';
  var FALLBACK_EMAIL = 'info@mcjoint.in';

  var forms = document.querySelectorAll('form[data-mc-form]');
  if (!forms.length) return;

  Array.prototype.forEach.call(forms, function (form) {
    var opened = Date.now();
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('[type=submit]');
    var btnText = btn ? btn.textContent : '';
    var busy = false;

    function say(msg) {
      if (!status) return;
      status.hidden = !msg;
      status.textContent = msg || '';
      status.style.color = msg ? '#c00' : '';
    }
    function reset() { busy = false; if (btn) { btn.disabled = false; btn.textContent = btnText; } }
    function fail() {
      reset();
      say('Sorry, that did not go through. Please try again, or email us at ' + FALLBACK_EMAIL + '.');
    }
    function done() {
      // A page can listen for 'mc-form-success' and call preventDefault() to show its own success state.
      var ev = new CustomEvent('mc-form-success', { bubbles: true, cancelable: true });
      if (form.dispatchEvent(ev)) location.href = '/thanks.html';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var trap = form.querySelector('[name=bot-field]');
      if (trap && trap.value) return; // honeypot filled: bot

      var data = new URLSearchParams();
      new FormData(form).forEach(function (value, key) { data.append(key, value); });
      data.append('form', form.getAttribute('data-mc-form'));
      data.append('page', location.href);
      data.append('elapsed_ms', String(Date.now() - opened));

      busy = true;
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      say('');

      // 1) Normal request: lets us read the handler's answer.
      fetch(MC_FORMS_ENDPOINT, { method: 'POST', body: data })
        .then(function (res) { return res.json(); })
        .then(function (json) { if (json && json.ok) done(); else fail(); })
        .catch(function () {
          // 2) The browser blocked reading the answer (or the network dropped). Send once more
          //    without reading it; a rare duplicate row is better than a lost enquiry.
          fetch(MC_FORMS_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data }).then(done).catch(fail);
        });
    });
  });
})();
