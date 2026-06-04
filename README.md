# FORGE — Plugin Manager for Adobe Premiere Pro

A CEP panel plugin manager for Adobe Premiere Pro. Install, update, and manage productivity plugins directly inside Premiere.

## Features

- **One-click installation** — Download and install plugins from the registry
- **Plugin discovery** — Browse available plugins with detailed descriptions
- **Update management** — Check for and install plugin updates
- **Always-visible errors** — Any failure is shown directly in the panel, never silently hidden

## Current Plugins

| Plugin | Description |
|--------|-------------|
| **MOLD** | Create folder templates inside Premiere Pro projects |

## Installation

1. Download the FORGE panel files
2. Place in your Adobe CEP extensions folder:
   ```
   %APPDATA%\Adobe\CEP\extensions\FORGE\
   ```
3. Restart Adobe Premiere Pro
4. Open the panel via **Window → Extensions → FORGE**

## Usage

- **Filter plugins** — Use the filter bar to view All, Installed, Available, or Updates
- **Search** — Find plugins by name or tag
- **Expand details** — Click a plugin row to see full description and features
- **Install** — Click the Install button to download and install a plugin
- **Update** — If an update is available, the Update button will appear

After installing a plugin, restart Premiere Pro for the extension to load.

## File Structure

```
%APPDATA%\Adobe\CEP\extensions\FORGE\
  index.html        ← panel UI and layout
  CSXS\
    manifest.xml    ← CEP manifest and allowed hosts
  js\
    app.js          ← all logic: registry, installer, state, UI
```

## Registry

Plugin definitions are served via jsDelivr CDN:

```
https://cdn.jsdelivr.net/gh/Oxy720/FORGE-plugins@main/registry.json
```

Each plugin lives in its own GitHub repository under `Oxy720/`. File downloads also go through jsDelivr — no direct GitHub API calls are made.

## Requirements

- Adobe Premiere Pro 2022 or later
- Windows 10/11
- Internet connection (for plugin download)

## Troubleshooting

**Panel won't load?**
- Ensure the folder is named exactly `FORGE` (case-sensitive)
- Restart Premiere Pro
- Verify the CEP extensions folder exists at `%APPDATA%\Adobe\CEP\extensions\`

**Install fails?**
- The error message is shown directly in the panel — read it for specifics
- Check your internet connection
- jsDelivr (`cdn.jsdelivr.net`) must be reachable

**Plugin not appearing after install?**
- Restart Premiere Pro
- Verify the plugin folder exists under `%APPDATA%\Adobe\CEP\extensions\`
- Check it appears in **Window → Extensions**

## Support

For issues or feature requests:
- FORGE: https://github.com/Oxy720/FORGE-plugins
- MOLD: https://github.com/Oxy720/mold

---
Built for post-production workflows.
