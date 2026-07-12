(function () {
  var params = new URLSearchParams(location.search);
  if (params.has('_v')) {
    params.delete('_v');
    var clean = location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash;
    history.replaceState(null, '', clean);
  }

  fetch('VERSION', { cache: 'no-store' })
    .then(function (r) { return r.text(); })
    .then(function (v) {
      v = v.trim();
      var stored = localStorage.getItem('buildVersion');
      if (stored && stored !== v) {
        localStorage.setItem('buildVersion', v);
        var sep = location.search ? '&' : '?';
        location.replace(location.pathname + location.search + sep + '_v=' + v);
      } else if (!stored) {
        localStorage.setItem('buildVersion', v);
      }
    })
    .catch(function () {});
})();
