/* eslint-disable quote-props */
const replacementsArray = {
    'Zaklęcia bojow': 'attribute-spells-offensive',
    'Zaklęcia wspomagają': 'attribute-spells-support',
    'Zaklęcia praktyczn': 'attribute-spells-practical',
    'Wiedz': 'attribute-knowledge',
    'Wpływ': 'attribute-influence',
    'Spryt': 'attribute-cunning',
    'Moc zaklę': 'spell-power',
    'Kontr': 'spell-counter',
    'Petard': 'item-equipment-firework',
    'Pułap': 'item-equipment-trap'
};
/* eslint-enable */

export default class Card {
    constructor(params) {
        this.params = params;

        this.renderLayout();
        if (this.params.renderDefaultValues) this.renderDefaultValues();
    }

    renderLayout() {
        this.container = document.createElement('div');

        this.container.classList.add('card');
        this.container.classList.add(`card--format-${this.params.format}`);

        this.params.regions.forEach(item => {
            const region = document.createElement('div');

            region.classList.add('region');
            region.classList.add(`region--position-${item}`);

            ['left-top', 'left-bottom', 'right-top', 'right-bottom'].forEach(item2 => {
                const corner = document.createElement('div');

                corner.classList.add('corner');
                corner.classList.add(`corner--position-${item2}`);
                region.appendChild(corner);
            });

            this.container.appendChild(region);
        });
    }

    renderDefaultValues() {
        const data = this.params.data;

        if (data.title) {
            const title = this.createTextNode(data.title, {
                classes: ['title']
            });

            this.container.querySelector('.region--position-header').appendChild(title);
        }
        if (data.cover) {
            const cover = document.createElement('div');
            const img = document.createElement('img');

            cover.classList.add('cover');
            img.src = `../img/content/${data.cover}.png`;

            cover.appendChild(img);
            this.container.querySelector('.region--position-cover').appendChild(cover);
        }
        if (data.category) {
            const category = this.createTextNode(data.category, {
                classes: ['category']
            });

            this.container.querySelector('.region--position-content').appendChild(category);
        }
        if (data.description) {
            data.description.forEach(item => {
                const description = this.createTextNode(item, {
                    classes: ['description']
                });

                this.container.querySelector('.region--position-content').appendChild(description);
            });
        }
        if (data.val) {
            this.pushIcon('footer', 'left-bottom', {
                icon: 'money',
                text: data.val
            });
        }
        if (data.size) {
            this.pushIcon('footer', 'left-bottom', {
                icon: 'item-size',
                scale: 0.9,
                text: data.size
            });
        }
        if (data.darkMagic) {
            this.pushIcon('footer', 'left-bottom', {
                icon: 'dark-magic',
                scale: 0.9,
                last: true
            });
        }
    }

    createTextNode(text, settings = {}) {
        const textNode = document.createElement('span');

        textNode.classList.add('text-node');
        if (settings.classes) {
            settings.classes.forEach(item => {
                textNode.classList.add(item);
            });
        }

        textNode.innerHTML = this.replaceTextToIcon(text);

        return textNode;
    }

    replaceTextToIcon(text) {
        let replacedText = text;

        Object.keys(replacementsArray).forEach(k => {
            if (replacedText.includes(k)) {
                const textWithSpan = k.includes(' ') ? k.replace(' ', '</span> ') : `${k}</span>`;

                replacedText = replacedText.replace(
                    k,
                    `<span class="no-wrap"><img class="in-text-icon" src="../img/content/${replacementsArray[k]}.png" /> ${textWithSpan}`
                );
            }
        });

        return replacedText;
    }

    pushIcon(region, corner, settings = {}) {
        const container = document.createElement('div');

        if (settings.icon) {
            const img = document.createElement('img');

            img.classList.add('icon-image');
            img.src = `../img/content/${settings.icon}.png`;
            if (settings.scale) img.style.transform = `scale(${settings.scale})`;
            container.appendChild(img);
        }
        if (settings.text) {
            const text = document.createElement('span');

            text.classList.add('icon-text');
            text.innerText = settings.text;
            container.appendChild(text);
        }
        if (settings.last) {
            container.classList.add('icon--last');
        }

        container.classList.add('icon');
        this.container.querySelector(`.region--position-${region} .corner--position-${corner}`).appendChild(container);
    }

    renderCustomValues(renderer) {
        renderer(this);
    }

    getNode() {
        return this.container;
    }
}
