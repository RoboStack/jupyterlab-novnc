# jupyterlab_novnc

![Github Actions Status](https://github.com/github_username/jupyterlab_novnc/workflows/Build/badge.svg)[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/github_username/jupyterlab_novnc/main?urlpath=lab)

novnc for jlab


This extension is composed of a Python package named `jupyterlab_novnc`
for the server extension and a NPM package named `jupyterlab-novnc`
for the frontend extension.

Allowed settings values:

```
  // autoconnect - Automatically connect as soon as the page has finished loading.
  autoconnect: boolean;
  // reconnect - If noVNC should automatically reconnect if the connection is dropped.
  reconnect: boolean;
  // reconnect_delay - How long to wait in milliseconds before attempting to reconnect.
  reconnect_delay: number;
  // host - The WebSocket host to connect to.
  host: string;
  // port - The WebSocket port to connect to.
  port: number;
  // encrypt - If TLS should be used for the WebSocket connection.
  encrypt?: boolean;
  // path - The WebSocket path to use.
  path?: string;
  // password - The password sent to the server, if required.
  password?: string;
  // repeaterID - The repeater ID to use if a VNC repeater is detected.
  repeaterID?: string;
  // shared - If other VNC clients should be disconnected when noVNC connects.
  shared?: boolean;
  // bell - If the keyboard bell should be enabled or not.
  bell?: boolean;
  // view_only - If the remote session should be in non-interactive mode.
  view_only?: boolean;
  // view_clip - If the remote session should be clipped or use scrollbars if it cannot fit in the browser.
  view_clip?: boolean;
  // resize - How to resize the remote session if it is not the same size as the browser window. Can be one of off, scale and remote.
  resize?: "off" | "scale" | "remote";
  // quality - The session JPEG quality level. Can be 0 to 9.
  quality?: number;
  // compression - The session compression level. Can be 0 to 9.
  compression?: number;
  // show_dot - If a dot cursor should be shown when the remote server provides no local cursor, or provides a fully-transparent (invisible) cursor.
  show_dot?: boolean;
  // logging - The console log level. Can be one of error, warn, info or debug.
  logging?: "error" | "warn" | "info" | "debug";
```

## Requirements

* JupyterLab >= 3.0

## Install

```bash
pip install jupyterlab_novnc
```


## Troubleshoot

If you are seeing the frontend extension, but it is not working, check
that the server extension is enabled:

```bash
jupyter server extension list
```

If the server extension is installed and enabled, but you are not seeing
the frontend extension, check the frontend extension is installed:

```bash
jupyter labextension list
```


## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab_novnc directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# If using a server extension, it must be manually installed in develop mode
jupyter server extension enable <extension_name>
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Uninstall

```bash
pip uninstall jupyterlab_novnc
```
