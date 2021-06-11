import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import {LabIcon} from "@jupyterlab/ui-components";

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  ILauncher
} from '@jupyterlab/launcher';

const SETTINGS_ID = 'jupyterlab-novnc:jupyterlab-novnc-settings';

import { requestAPI } from './handler';

import { IFrame } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';


import fooSvgstr from '../style/icon.svg';

export const fooIcon = new LabIcon({
  name: 'jupyterlab-novnc:icon',
  svgstr: fooSvgstr
});

interface INoVNCOptions {
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
}

class noVNCWidget extends IFrame {
  query: string;

  constructor(options: INoVNCOptions) {
    super();
    let queryElems = [];

    for (const k in (options as object))
    {
      if (options.hasOwnProperty(k)) {
        queryElems.push(encodeURIComponent(k) + "=" + encodeURIComponent((options as any)[k]));
      }
    }
    this.query = queryElems.join("&");

    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + `novnc/app/novnc/vnc.html?${this.query}`;
    console.log('Full URL: ', this.url)

    this.id = 'noVNC';
    this.title.label = 'noVNC';
    this.title.closable = true;
    this.node.style.overflowY = 'auto';
    this.node.style.background = '#FFF';

    this.sandbox = [
      'allow-forms',
      'allow-modals',
      'allow-orientation-lock',
      'allow-pointer-lock',
      'allow-popups',
      'allow-presentation',
      'allow-same-origin',
      'allow-scripts',
      'allow-top-navigation',
      'allow-top-navigation-by-user-activation'
    ];
  }

  dispose(): void {
    super.dispose();
  }
  onCloseRequest(): void {
    this.dispose();
  }
}

/**
 * Initialization data for the jupyterlab-novnc extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-novnc:plugin',
  autoStart: true,
  requires: [ICommandPalette, ISettingRegistry],
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, settings: ISettingRegistry, launcher: ILauncher | null) => {

    let _settings: ISettingRegistry.ISettings;

    const command = 'novnc:open';

    let registeredCommands : any[] = [];

    let _loadSettings = () => {
      const enpoints = _settings.get('configured_endpoints').composite as any[];

      let i = 0;
      for (let c of registeredCommands)
      {
        c.dispose();
      }
      registeredCommands = [];

      for (let epconf of enpoints)
      {
        console.log("Adding comand .. ")
        // const full_cmd = command + `:${i}`
        const full_cmd = command + `:${i}`

        const widget = new noVNCWidget(epconf);
    
        let rcmd = app.commands.addCommand(full_cmd, {
          label: `Connect to VNC ${i}: ${'name' in epconf ? epconf['name'] : epconf['host']}`,
          execute: () => {
            if (!widget.isAttached) {
              // Attach the widget to the main work area if it's not there
              app.shell.add(widget, 'main');
            }
            // Activate the widget
            app.shell.activateById(widget.id);
          },
          icon: fooIcon
        });
        registeredCommands.push(rcmd);

          // Add a launcher item if the launcher is available.
        if (launcher) {
          let lcmd = launcher.add({
            command: full_cmd,
            rank: 1,
            category: 'VNC',
          });
          registeredCommands.push(lcmd);
        }

        let pcmd = palette.addItem({ command: full_cmd, category: 'NoVNC' });
        registeredCommands.push(pcmd);

        i += 1;
      }
    }

    settings.load(SETTINGS_ID).then((setting) => {
      console.log(setting);
      _settings = setting;
      const extensions = setting.get('configured_endpoints').composite as any[];
      console.log(extensions);
      _loadSettings();
      setting.changed.connect(_loadSettings);
    })

    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyterlab_novnc server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default extension;
