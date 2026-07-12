// Gedeelde helpers voor alle tool-pagina's
function parseNum(str) {
  if (!str) return NaN;
  return parseFloat(str.replace(',', '.'));
}

function fmt(x) {
  return x.toFixed(1).replace(/\.0$/, '').replace('.', ',');
}

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
