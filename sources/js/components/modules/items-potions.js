export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1_Nm7xoS8xzeDUSwBAhfYfApYB8wubGGiHjk6smJbms0',
            tabs: ['Eliksiry']
        };
        this.deckSettings = {
            format: 'mini',
            back: 'item-potion',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            this.sets[i] = {
                title: row[0],
                cover: 'item-potion',
                category: 'Eliksir',
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
