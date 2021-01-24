/* global gapi */

class SheetLoader {
    loadData(params) {
        return new Promise(resolve => {
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: 'AIzaSyDWSuIGBCIQBrfnIZAi2qrzwLNxFX5wJck',
                    clientId: '481471314677-7f9j3s2mnvsli2s1755nqjcnko62s7gb.apps.googleusercontent.com',
                    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
                }).then(() => {
                    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                        this.getDataFromSheet(params).then(resolve);
                    } else {
                        gapi.auth2.getAuthInstance().signIn().then(() => {
                            this.getDataFromSheet(params).then(resolve);
                        });
                    }
                });
            });
        });
    }

    getDataFromSheet(params) {
        return new Promise(resolve => {
            const sheet = {};
            let i = 0;

            params.tabs.forEach(tab => {
                this.getDataFromTab({
                    sheet: params.sheet,
                    tab
                }).then(data => {
                    i++;
                    sheet[tab] = data;

                    if (i >= params.tabs.length) resolve(sheet);
                });
            });
        });
    }

    getDataFromTab(params) {
        return new Promise(resolve => {
            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: params.sheet,
                range: params.tab
            }).then(response => {
                resolve(response.result.values);
            });
        });
    }
}

const sheetLoader = new SheetLoader();

export default sheetLoader;
