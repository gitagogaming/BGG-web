const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.webContents.openDevTools();


    // Dynamically import the ES module
    import('electron-is-dev').then(isDev => {
        mainWindow.loadURL(
            isDev.default
                ? 'http://localhost:3000'
                : `file://${path.join(__dirname, 'build', 'index.html')}`
        );
    });

    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


// const { app, BrowserWindow } = require('electron');
// const path = require('path');
// const isDev = require('electron-is-dev');

// let mainWindow;

// function createWindow() {
//     mainWindow = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false,
//         },
//     });

//     mainWindow.loadURL(
//         isDev
//             ? 'http://localhost:3000'
//             : `file://${path.join(__dirname, 'build', 'index.html')}`
//     );
    

//     mainWindow.on('closed', () => (mainWindow = null));
// }

// app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// app.on('activate', () => {
//     if (mainWindow === null) {
//         createWindow();
//     }
// });