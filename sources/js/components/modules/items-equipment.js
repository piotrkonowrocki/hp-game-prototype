export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1_Nm7xoS8xzeDUSwBAhfYfApYB8wubGGiHjk6smJbms0',
            tabs: ['Ekwipunek']
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
                cover: 'item-equipment',
                category: row[2] !== 'zużywalny' ? 'Ekwipunek do wyposażenia' : 'Ekwipunek do użycia',
                slot: row[2],
                description: row[1].split(/\r?\n/u),
                size: row[3],
                val: row[4],
                darkMagic: row[5] === 'tak'
            };
        });
    }

    renderer(card) {
        let slot;

        switch (card.params.data.slot) {
        case 'ręka':
            slot = 'item-equipment-slot-hand';

            break;
        case 'strój':
            slot = 'item-equipment-slot-clothes';

            break;
        case 'talizman':
            slot = 'item-equipment-slot-talisman';

            break;
        default:
            slot = false;
        }

        if (slot) {
            card.pushIcon('footer', 'left-bottom', {
                icon: slot
            });
        }
    }
}
