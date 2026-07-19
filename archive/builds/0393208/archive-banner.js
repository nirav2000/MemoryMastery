(function(){
  const commit = '0393208';
  const latest = new URLSearchParams(location.search).has('useLatestData');
  const banner = document.createElement('aside');
  banner.setAttribute('role','note');
  banner.style.cssText = 'position:sticky;top:0;z-index:9999;padding:10px 14px;background:#fff8d6;color:#221a00;border-bottom:1px solid #dbc56d;font:14px/1.4 system-ui,sans-serif';
  banner.innerHTML = '<strong>Archived Memory Mastery build '+commit+'</strong> · This may not match the current learner flow. '+(latest?'Using latest compatible data files.':'Using bundled historical data.')+' <a href="../../index.html">Version switcher</a> · <a href="?useLatestData=1">Try latest data</a> · <a href="../../../">Current app</a>';
  document.addEventListener('DOMContentLoaded', function(){ document.body.prepend(banner); });
})();
