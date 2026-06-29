const { app, BrowserWindow, ipcMain, dialog, desktopCapturer } = require("electron");
const path = require("path");
const fs = require("fs"); 

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {

      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
  return sources;
});


ipcMain.handle('save-dialog', async (event, buffer) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Scegli dove salvare il video',
    buttonLabel: 'Salva Video',
    defaultPath: `registrazione-${Date.now()}.webm`,
    filters: [{ name: 'Videos', extensions: ['webm', 'mp4'] }]
  });

  if (filePath) {
    try {
      fs.writeFileSync(filePath, Buffer.from(buffer));
      return true; 
    } catch (err) {
      console.error('Errore nel salvataggio del file:', err);
      return false;
    }
  }
  return false; 
});