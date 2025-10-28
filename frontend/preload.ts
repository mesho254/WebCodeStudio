import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  openFolder: () => ipcRenderer.invoke('open-folder'),
});