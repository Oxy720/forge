# FORGE — Plugin Manager for Adobe Premiere Pro

A CEP panel plugin manager for Adobe Premiere Pro. Install, update, and manage productivity plugins directly inside Premiere.

## Features

- **One-click installation** — Download and install plugins from the registry
- **Plugin discovery** — Browse available plugins with detailed descriptions
- **Update management** — Check for and install plugin updates
- **Offline fallback** — Works with a cached plugin list if registry is unavailable
- **Dark theme** — Optimized for post-production workflows

## Current Plugins

| Plugin | Description |
|--------|-------------|
| **MOLD** | Create folder templates inside Premiere Pro projects |

## Installation

1. Download the FORGE panel files
2. Place in your Adobe CEP extensions folder:
   ```
   %APPDATA%\Adobe\CEP\extensions\forge\
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

## Registry

Plugin definitions are stored in the registry:
```
https://raw.githubusercontent.com/Oxy720/FORGE-plugins/main/registry.json
```

Each plugin lives in its own GitHub repository under `Oxy720/`.

## Requirements

- Adobe Premiere Pro 2022 or later
- Windows 10/11
- Internet connection (for plugin download)

## Troubleshooting

**Panel won't load?**
- Restart Premiere Pro
- Check that CEP extensions folder exists

**Install fails?**
- Check your internet connection
- Verify GitHub is accessible
- Check the browser console (F12) for error messages

**Plugin not appearing after install?**
- Restart Premiere Pro
- Verify the plugin is listed in **Window → Extensions**

## Support

For issues or feature requests, visit the plugin repository:
- https://github.com/Oxy720/mold

---

Built with assistance. Themed for post-production workflows.
