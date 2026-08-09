const versionTarget = document.querySelector('[data-app-version]');

async function showCurrentVersion() {
  if (!versionTarget) return;
  try {
    const response = await fetch('VERSION', { cache: 'no-store' });
    if (!response.ok) throw Error(`Version request failed (${response.status})`);
    const version = (await response.text()).trim();
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('Invalid application version');
    versionTarget.textContent = `Version ${version}`;
  } catch (error) {
    console.warn('Application version unavailable', error);
    versionTarget.textContent = 'Version unavailable';
  }
}

showCurrentVersion();
