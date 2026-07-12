// Gedeelde helpers voor alle tool-pagina's
function parseNum(str) {
  if (!str) return NaN;
  return parseFloat(str.replace(',', '.'));
}

function fmt(x) {
  return x.toFixed(1).replace(/\.0$/, '').replace('.', ',');
}

// Onthoud laatst ingevoerde waardes per pagina in localStorage
document.addEventListener('DOMContentLoaded', function () {
  var inputs = document.querySelectorAll('input[type="text"][id]');
  var prefix = 'inputVal:' + location.pathname + ':';

  inputs.forEach(function (input) {
    var stored = localStorage.getItem(prefix + input.id);
    if (stored !== null) input.value = stored;
    input.addEventListener('input', function () {
      localStorage.setItem(prefix + input.id, input.value);
    });
  });

  inputs.forEach(function (input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// iOS: decimaal toetsenbord heeft geen "klaar"-toets — klik buiten het veld sluit het toetsenbord
document.addEventListener('click', function (e) {
  if (document.activeElement.tagName === 'INPUT' && e.target !== document.activeElement) {
    document.activeElement.blur();
  }
});
