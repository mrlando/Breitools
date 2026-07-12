(function () {
  var CHECK_INTERVAL_MS = 3 * 60 * 1000;

  var params = new URLSearchParams(location.search);
  if (params.has('_v')) {
    params.delete('_v');
    var clean = location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash;
    history.replaceState(null, '', clean);
  }

  function reloadWithVersion(v) {
    var sep = location.search ? '&' : '?';
    location.replace(location.pathname + location.search + sep + '_v=' + v);
  }

  function checkVersion() {
    // niet midden in het typen herladen — wacht tot de volgende check
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    fetch('VERSION', { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (v) {
        v = v.trim();
        var stored = localStorage.getItem('buildVersion');
        if (stored && stored !== v) {
          localStorage.setItem('buildVersion', v);
          reloadWithVersion(v);
        } else if (!stored) {
          localStorage.setItem('buildVersion', v);
        }
      })
      .catch(function () {});
  }

  checkVersion();
  setInterval(checkVersion, CHECK_INTERVAL_MS);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) checkVersion();
  });
})();
