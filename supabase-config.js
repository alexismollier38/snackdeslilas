(() => {
  const SUPABASE_URL = 'https://ofitajplyyshmoilehvk.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9maXRhamBseXlzaG1vaWxlaHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTMwNzYsImV4cCI6MjEwMTA2OTA3Nn0.HM-kIazsapYyEa97CWAS7H7b0D1pfofWppdLVyUqoQc';
  const endpoint = `${SUPABASE_URL}/rest/v1/app_state`;
  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' };
  const recordId = 'snack-des-lilas-main';
  const dirtyKey = 'snack-des-lilas-sync-dirty-v1';
  const pendingKey = 'snack-des-lilas-sync-pending-v1';
  let pendingState = null;
  let syncTimer = null;
  let retryTimer = null;
  let syncing = false;
  let remoteHandler = null;

  function setStatus(label, online = true) {
    const status = document.querySelector('.topbar-status');
    if (!status) return;
    status.replaceChildren(Object.assign(document.createElement('span'), { className: `status-dot${online ? '' : ' offline'}` }), document.createTextNode(` ${label}`));
  }

  async function request(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`Supabase ${response.status}`);
    return response.status === 204 ? null : response.json();
  }

  async function fetchRemote() {
    const rows = await request(`${endpoint}?id=eq.${encodeURIComponent(recordId)}&select=state,updated_at&limit=1`);
    return rows[0] || null;
  }

  async function push(state) {
    await request(endpoint, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ id: recordId, state: JSON.parse(JSON.stringify(state)), updated_at: new Date().toISOString() })
    });
    localStorage.removeItem(dirtyKey);
    localStorage.removeItem(pendingKey);
    setStatus('Synchronisé Supabase');
  }

  async function syncNow() {
    if (syncing || !pendingState || !navigator.onLine) return;
    syncing = true;
    const snapshot = pendingState;
    try {
      await push(snapshot);
      pendingState = null;
      if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
    } catch (error) {
      setStatus('Hors connexion · en attente', false);
      console.warn('Synchronisation Supabase reportée, copie locale conservée.', error);
      retryTimer = setTimeout(syncNow, 10000);
    } finally {
      syncing = false;
    }
  }

  async function load() {
    if (localStorage.getItem(dirtyKey) === '1') {
      setStatus('Modifications locales à synchroniser');
      try { pendingState = JSON.parse(localStorage.getItem(pendingKey) || 'null'); syncNow(); } catch (error) { console.warn('File locale Supabase illisible.', error); }
      return null;
    }
    try {
      const remote = await fetchRemote();
      if (remote?.state) { setStatus('Connecté · Supabase prioritaire'); return remote.state; }
      setStatus('Connecté · première synchronisation');
    } catch (error) {
      setStatus('Hors connexion · données locales', false);
      throw error;
    }
    return null;
  }

  async function pullRemote() {
    if (!navigator.onLine || syncing || localStorage.getItem(dirtyKey) === '1') return;
    try {
      const remote = await fetchRemote();
      if (remote?.state && remoteHandler) remoteHandler(remote.state);
      setStatus(remote?.state ? 'Connecté · Supabase prioritaire' : 'Connecté · prêt à synchroniser');
    } catch (error) {
      setStatus('Hors connexion · données locales', false);
    }
  }

  function scheduleSave(state) {
    pendingState = state;
    localStorage.setItem(dirtyKey, '1');
    localStorage.setItem(pendingKey, JSON.stringify(state));
    setStatus(navigator.onLine ? 'Synchronisation en cours…' : 'Hors connexion · en attente', navigator.onLine);
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(syncNow, 350);
  }

  window.addEventListener('offline', () => setStatus('Hors connexion · données locales', false));
  window.addEventListener('online', () => {
    setStatus('Connexion retrouvée · synchronisation…');
    if (localStorage.getItem(dirtyKey) === '1') syncNow();
    else pullRemote();
  });
  window.supabaseSync = { load, scheduleSave, setRemoteHandler(handler) { remoteHandler = handler; } };
})();
