export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1_Nm7xoS8xzeDUSwBAhfYfApYB8wubGGiHjk6smJbms0',
            tabs: ['Ekwipunek specjalny']
        };
        this.deckSettings = {
            format: 'mini',
            back: 'item-equipment',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            let cover;

            switch (row[2]) {
            case 'Insygnium śmierci':
                cover = 'deathly-hallows';

                break;
            case 'Przeklęty ekwipunek':
                cover = 'item-cursed';

                break;
            default:
                cover = false;
            }

            this.sets[i] = {
                title: row[0],
                cover,
                category: row[2],
                slot: row[3],
                description: row[1].split(/\r?\n/u),
                size: row[4]
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
