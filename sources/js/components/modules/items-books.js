export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1_Nm7xoS8xzeDUSwBAhfYfApYB8wubGGiHjk6smJbms0',
            tabs: ['Księgi']
        };
        this.deckSettings = {
            format: 'mini',
            regions: ['header', 'cover', 'subheader', 'content', 'footer'],
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            this.sets[i] = {
                title: row[0],
                cover: 'item-book',
                category: 'Księga',
                description: row[1].split(/\r?\n/u),
                size: row[2],
                val: row[3],
                darkMagic: row[5] === 'tak'
            };
        });
    }

    renderer() {
        //
    }
}
