const fs    = require('fs');
const path  = require('path');
const https = require('https');

const INSTALL_ROOT  = path.join(process.env.APPDATA, 'Adobe', 'CEP', 'extensions');
const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh';
const REGISTRY_URL  = 'https://cdn.jsdelivr.net/gh/Oxy720/FORGE-plugins@main/registry.json';

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  t.onclick = null;
  if (type === 'error') {
    t.style.cursor = 'pointer';
    t.onclick = function() { t.className = 'toast'; };
  } else {
    clearTimeout(t._timer);
    t._timer = setTimeout(function() { t.className = 'toast'; }, 2500);
  }
}

// ── Registry ──────────────────────────────────────────────────────────────────

function fetchRegistry() {
  return new Promise((resolve, reject) => {
    https.get(REGISTRY_URL, { headers: { 'User-Agent': 'FORGE-PluginManager' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error('Registry HTTP ' + res.statusCode));
      }
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (!data || !data.length) return reject(new Error('Registry is empty.'));
          resolve(data);
        } catch(e) {
          reject(new Error('Registry returned invalid JSON.'));
        }
      });
    }).on('error', () => reject(new Error('Could not reach plugin registry.')));
  });
}

// ── Installer (copied exactly from original working install.js) ───────────────

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'FORGE-PluginManager' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function installPlugin(plugin, onProgress) {
  const destRoot = path.join(INSTALL_ROOT, plugin.id);
  for (let i = 0; i < plugin.files.length; i++) {
    const filePath    = plugin.files[i];
    const downloadUrl = `${JSDELIVR_BASE}/${plugin.repoOwner}/${plugin.repoName}@main/${filePath}`;
    const destPath    = path.join(destRoot, filePath);
    if (onProgress) onProgress(`writing ${path.basename(filePath)}`);
    await downloadFile(downloadUrl, destPath);
  }
}

function isInstalled(pluginId) {
  return fs.existsSync(path.join(INSTALL_ROOT, pluginId));
}

function getInstalledVersion(pluginId) {
  const manifestPath = path.join(INSTALL_ROOT, pluginId, 'CSXS', 'manifest.xml');
  if (!fs.existsSync(manifestPath)) return null;
  const content = fs.readFileSync(manifestPath, 'utf8');
  const match = content.match(/ExtensionBundleVersion="([^"]+)"/);
  return match ? match[1] : null;
}

function uninstallPlugin(pluginId) {
  const destRoot = path.join(INSTALL_ROOT, pluginId);
  if (fs.existsSync(destRoot)) {
    fs.rmSync(destRoot, { recursive: true, force: true });
    return true;
  }
  return false;
}

// ── State ─────────────────────────────────────────────────────────────────────

let state = { plugins: [], filter: 'all', search: '', openId: null };

// ── UI ────────────────────────────────────────────────────────────────────────

function getStatus(p) {
  if (!isInstalled(p.id)) return 'none';
  const iv = getInstalledVersion(p.id);
  if (iv && iv !== p.version) return 'update';
  return 'installed';
}

function getFiltered() {
  const q = state.search.toLowerCase();
  return state.plugins.filter(function(p) {
    const status = getStatus(p);
    const passFilter =
      state.filter === 'installed' ? status === 'installed' :
      state.filter === 'available' ? status === 'none' :
      state.filter === 'update'    ? status === 'update' : true;
    const passSearch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
    return passFilter && passSearch;
  });
}

function updateCounts() {
  document.getElementById('installedCount').textContent =
    state.plugins.filter(p => isInstalled(p.id)).length;
  document.getElementById('totalCount').textContent = state.plugins.length;
}

function render() {
  const list     = document.getElementById('pluginList');
  const filtered = getFiltered();
  if (!filtered.length) {
    list.innerHTML = '<div class="empty">nothing here</div>';
    updateCounts();
    return;
  }
  list.innerHTML = filtered.map(function(p) {
    const status   = getStatus(p);
    const btnClass = status === 'installed' ? 'installed' : status === 'update' ? 'update' : 'install';
    const btnLabel = status === 'installed' ? 'installed' : status === 'update' ? 'update'  : 'install';
    const isOpen   = state.openId === p.id;
    const features = (p.features || []).map(f => '<div class="feature-item">' + f + '</div>').join('');
    const tags     = (p.tags     || []).map(t => '<span class="tag">' + t + '</span>').join('');
    return (
      '<div class="plugin-item' + (isOpen ? ' open' : '') + '" id="item-' + p.id + '">' +
        '<div class="plugin-row" onclick="FORGE.toggle(\'' + p.id + '\')">' +
          '<div class="status-dot ' + status + '"></div>' +
          '<div class="plugin-info">' +
            '<div class="plugin-name">' + p.name + '</div>' +
            '<div class="plugin-desc">' + p.shortDesc + '</div>' +
          '</div>' +
          '<div class="plugin-version">v' + p.version + '</div>' +
          '<button class="btn-action ' + btnClass + '" id="btn-' + p.id + '"' +
            (status !== 'installed' ? ' onclick="event.stopPropagation();FORGE.install(\'' + p.id + '\')"' : '') +
          '>' + btnLabel + '</button>' +
          '<span class="chevron">›</span>' +
        '</div>' +
        '<div class="plugin-dropdown"><div class="dropdown-inner">' +
          '<div class="dropdown-full-desc">' + (p.fullDesc || '') + '</div>' +
          (features ? '<div class="features-label">Features</div><div class="features-list">' + features + '</div>' : '') +
          (tags ? '<div class="tags-row">' + tags + '</div>' : '') +
        '</div></div>' +
      '</div>'
    );
  }).join('');
  updateCounts();
}

// ── Actions ───────────────────────────────────────────────────────────────────

async function loadPlugins() {
  showToast('Loading···');
  try {
    state.plugins = await fetchRegistry();
    state.openId  = null;
    render();
    showToast('Ready', 'success');
  } catch(err) {
    showToast(err.message, 'error');
    render();
  }
}

async function handleInstall(id) {
  const plugin = state.plugins.find(p => p.id === id);
  if (!plugin) return;
  const btn = document.getElementById('btn-' + id);
  if (btn) { btn.className = 'btn-action installing'; btn.textContent = '···'; }
  try {
    await installPlugin(plugin, msg => { if (btn) btn.title = msg; });
    render();
    showToast(plugin.name + ' installed — restart Premiere', 'success');
  } catch(err) {
    render();
    showToast('Install failed: ' + err.message, 'error');
  }
}

// ── Expose ────────────────────────────────────────────────────────────────────

window.FORGE = {
  load:      loadPlugins,
  install:   handleInstall,
  toggle:    function(id) { state.openId = state.openId === id ? null : id; render(); },
  setFilter: function(f, el) {
    state.filter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (el) el.classList.add('active');
    render();
  },
  onSearch:  function(v) { state.search = v.trim(); render(); }
};

loadPlugins();
