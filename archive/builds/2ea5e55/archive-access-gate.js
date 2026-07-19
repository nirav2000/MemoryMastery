(function(){
  if (sessionStorage.getItem('memoryMasteryArchiveOwner') === '1') return;
  document.documentElement.style.visibility = 'hidden';
  document.addEventListener('DOMContentLoaded', function(){
    document.body.innerHTML = '<main style="max-width:720px;margin:0 auto;padding:48px 20px;font:18px/1.55 system-ui,sans-serif;color:#142033"><h1>Developer archive locked</h1><p>Sign in to the current Memory Mastery app as myaeixa@gmail.com, then open the version switcher again.</p><p><a href="../../../">Return to current app</a></p></main>';
    document.documentElement.style.visibility = 'visible';
  });
})();
