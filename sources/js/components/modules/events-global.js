export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1x_kYIIVV_sqE8_ycINh79U2bUCXdF9D4YZnnTFWqePc',
            tabs: ['Wydarzenia']
        };
        this.deckSettings = {
            format: 'standard',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            this.sets[i] = {
                title: row[0],
                narrative: row[1],
                effect: row[2],
                duration: row[4],
                search: row[5],
                shop: row[6],
                npc: row[7],
                income: row[8]
            };
        });
    }

    renderer(card) {
        const data = card.params.data;
        let shopIndex;

        switch (data.shop) {
        case 'uzupełnienie':
            shopIndex = 'shop-replenish';

            break;
        case 'rotacja':
            shopIndex = 'shop-replace';

            break;
        case 'wymiana ekwipunku':
            shopIndex = 'item-equipment';

            break;
        case 'wymiana ksiąg':
            shopIndex = 'item-book';

            break;
        case 'wymiana eliksirów':
            shopIndex = 'item-potion';

            break;
        default:
            shopIndex = false;
        }

        const narrative = card.createTextNode(data.narrative, {
            classes: ['description'],
            wrapper: 'em'
        });
        const effect = card.createTextNode(data.effect, {
            classes: ['description'],
            wrapper: 'strong'
        });

        card.container.querySelector('.region--position-content').appendChild(narrative);
        card.container.querySelector('.region--position-content').appendChild(effect);
        card.pushIcon('footer', 'left-bottom', {
            icon: 'duration',
            text: data.duration
        });
        if (data.search) {
            const ranks = ['brąz', 'srebro', 'złoto'];

            card.pushIcon('footer', 'left-bottom', {
                icon: 'cube',
                scale: 0.9,
                index: `rank-${ranks.indexOf(data.search) + 1}`
            });
        }
        if (data.shop) {
            card.pushIcon('footer', 'left-bottom', {
                icon: 'shop',
                index: shopIndex
            });
        }
        if (data.npc) {
            card.pushIcon('footer', 'left-bottom', {
                icon: 'npc'
            });
        }
        if (data.income) {
            card.pushIcon('footer', 'left-bottom', {
                icon: 'income'
            });
        }
    }
}
