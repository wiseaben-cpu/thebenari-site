/* Shared-password gate.
 *
 * THIS IS NOT SECURITY. The site is static, the repo is public, and the password
 * below ships to every visitor in plain text — anyone who opens devtools or reads
 * the repo walks straight in. It exists to make the site feel private to casual
 * visitors, nothing more. Never put anything behind it that would actually matter
 * if it leaked.
 *
 * Loaded from the generated <head> block (scripts/apply_meta.py) rather than from a
 * tag in the page body, because design exports overwrite the body and would drop it.
 * gate.js itself is in PROTECTED in sync-from-export.sh so the sync doesn't delete it.
 */
(function () {
  var PASSWORD = 'SocialFriends';
  var KEY = '__benari_gate';
  var BLUE = '#0352BA', CREAM = '#EDE9E4', INK = '#241E1A', RED = '#E3170A';

  function unlocked() {
    try { return localStorage.getItem(KEY) === PASSWORD; } catch (e) { return false; }
  }
  if (unlocked()) return;

  // Hide the document until the gate is up, so page content never flashes first.
  // Every exit path below restores this — including the failure paths, because a
  // thrown error here would otherwise leave the site permanently blank.
  var root = document.documentElement;
  var prevVisibility = root.style.visibility;
  root.style.visibility = 'hidden';
  function reveal() { root.style.visibility = prevVisibility || 'visible'; }

  // Belt and braces: if anything below throws, or the DOM never becomes ready,
  // show the site rather than leaving a blank page.
  var failsafe = setTimeout(reveal, 4000);

  function build() {
    clearTimeout(failsafe);
    try {
      var wrap = document.createElement('div');
      wrap.setAttribute('data-gate', '');
      wrap.style.cssText =
        'position:fixed;inset:0;z-index:2147483600;background:' + BLUE + ';color:' + CREAM + ';' +
        "font-family:Archivo,'Helvetica Neue',Helvetica,sans-serif;-webkit-font-smoothing:antialiased;" +
        'display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;';

      var card = document.createElement('form');
      card.style.cssText = 'display:grid;gap:18px;width:min(380px,100%);text-align:left;';

      var title = document.createElement('h1');
      title.textContent = 'Private';
      title.style.cssText =
        'margin:0;font-weight:900;font-size:clamp(40px,9vw,64px);line-height:.9;' +
        'letter-spacing:-.035em;text-transform:uppercase;';

      var note = document.createElement('p');
      note.textContent = 'Enter the password to continue.';
      note.style.cssText = 'margin:0;font-size:15px;line-height:1.5;color:rgba(237,233,228,.88);';

      var input = document.createElement('input');
      input.type = 'password';
      input.setAttribute('aria-label', 'Password');
      input.setAttribute('autocomplete', 'current-password');
      input.autofocus = true;
      input.style.cssText =
        'font-family:inherit;font-size:16px;padding:14px 16px;min-height:48px;box-sizing:border-box;' +
        'width:100%;border:1px solid rgba(237,233,228,.45);border-radius:0;background:transparent;' +
        'color:' + CREAM + ';outline:none;';
      input.addEventListener('focus', function () { input.style.borderColor = CREAM; });
      input.addEventListener('blur', function () { input.style.borderColor = 'rgba(237,233,228,.45)'; });

      var button = document.createElement('button');
      button.type = 'submit';
      button.textContent = 'Enter';
      button.style.cssText =
        'font-family:inherit;font-size:11px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;' +
        'padding:0 24px;min-height:48px;border:0;border-radius:999px;background:' + CREAM + ';' +
        'color:' + INK + ';cursor:pointer;justify-self:start;';

      var error = document.createElement('p');
      error.setAttribute('role', 'alert');
      error.style.cssText =
        'margin:0;min-height:18px;font-size:11px;font-weight:500;letter-spacing:.09em;' +
        'text-transform:uppercase;color:' + RED + ';';

      card.appendChild(title);
      card.appendChild(note);
      card.appendChild(input);
      card.appendChild(error);
      card.appendChild(button);
      wrap.appendChild(card);

      card.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value === PASSWORD) {
          try { localStorage.setItem(KEY, PASSWORD); } catch (err) {}
          wrap.remove();
          reveal();
          return;
        }
        error.textContent = 'Not that one';
        input.value = '';
        input.focus();
      });

      document.body.appendChild(wrap);
      reveal();          // the gate is up, so it is safe to show the document
      input.focus();
    } catch (err) {
      reveal();          // never trap the visitor behind a broken gate
    }
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
