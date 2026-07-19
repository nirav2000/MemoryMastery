(function(){
  const params = new URLSearchParams(location.search);
  if (!params.has('useLatestData')) return;
  const originalFetch = window.fetch.bind(window);
  window.fetch = function(resource, options) {
    const url = typeof resource === 'string' ? resource : resource && resource.url;
    if (url && /^data\/[^/]+\.json$/.test(url)) {
      return originalFetch('../../../' + url, options);
    }
    return originalFetch(resource, options);
  };
})();
