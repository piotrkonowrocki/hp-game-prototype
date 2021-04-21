// import sheetLoader from './sheet-loader';
import Deck from './deck';

export default class DeckHandler {
    constructor(item) {
        this.container = item;
        this.isPlayable = item.classList.contains('playable');
        this.fakeFontPreload();
        this.init(item);
    }

    async init(item) {
        const module = item.getAttribute('data-module');

        if (this.isPlayable) {
            const title = item.getAttribute('data-title');

            this.createPlayableUI(title);
        }
        await this.loadModule(module);
        await this.loadSheetData(module);
        this.createDeck();
        this.createCards();
        this.displayCards();
        this.attachEvents();
    }

    fakeFontPreload() {
        const container = document.createElement('div');

        container.classList.add('fake-font-preload');
        container.innerHTML += '<p class="sans-serif">Lorem ipsum dolor sit amet</p>';
        container.innerHTML += '<p class="sans-serif"><strong>Lorem ipsum dolor sit amet</strong></p>';
        container.innerHTML += '<p class="sans-serif"><em>Lorem ipsum dolor sit amet</em></p>';
        container.innerHTML += '<p class="serif">Lorem ipsum dolor sit amet</p>';
        container.innerHTML += '<p class="serif"><strong>Lorem ipsum dolor sit amet</strong></p>';
        container.innerHTML += '<p class="serif"><em>Lorem ipsum dolor sit amet</em></p>';

        document.body.appendChild(container);
    }

    async loadModule(module) {
        const Module = (await import(`./modules/${module}`)).default;

        this.module = new Module();
    }

    async loadSheetData() {
        // const sheet = await sheetLoader.loadData(this.module.sheetDataSettings);

        // this.sheet = sheet;
        this.module.sets = {"Alastor Moody":{"title":"Alastor Moody","income":{"moneyMultiplier":"2","money":"3","explosive":"4","book":"0","potion":"5"},"abilities":{"active":["Magiczne oko","Akcja: jeżeli na polu na którym się znajdujesz nie ma znacznika przeszukiwania, możesz wykonać akcję Przeszukiwanie jakby na polu znajdował się brązowy znacznik."],"passive":["Eks-Auror","Za każdym razem, gdy rzucasz zaklęcie, możesz dobrać modyfikator z talii zamiast używać swojego. Jeżeli modyfikator nie zostanie użyty natychmiast, należy go odrzucić."],"weakness":["Mania prześladowcza","Nie możesz wymieniać się z innymi graczami przedmiotami ani pieniędzmi."]},"techniques":[["4","→","↺","","","",""],["5","/","6","→","✓","✓",null]],"other":{"side":"Zakon Feniksa","start":"Ministerstwo Magii - Departament Tajemnic"},"progress":[["•","M","•","1"],["M","•","M","•"],["WK","2","W","•"],["•","B","•","3"]],"attributes":{"offensiveSpells":"7","supportSpells":"6","practicalSpells":"4","knowledge":"5","influence":"6","cunning":"6"}},"Harry Potter":{"title":"Harry Potter","income":{"moneyMultiplier":"2","money":"2","explosive":"0","book":"5","potion":"0"},"abilities":{"active":["Chłopiec, który przeżył","Akcja: przyjmij jedno obrażenie i otrzymaj stan Agonia, abyście ty lub jeden sojusznik uzyskali odporność na obrażenia do końca trwania tej rundy. Nie możesz wykonać tej akcji, jeśli już posiadasz stan Agonia."],"passive":["Mistrz pojedynków","Po rzuceniu dwóch zaklęć bojowych, których celem jest ten sam przeciwnik, możesz natychmiast rzucić trzecie zaklęcie bojowe przeciw temu samemu celowi."],"weakness":["Kompleks bohatera","Nie możesz odzyskiwać punktów życia jeśli na obszarze, na którym przebywasz, znaduje się sprzymierzony bohater z mniejszą liczbą punktów życia niż ty."]},"techniques":[["6","6","→","✓","✓","✓","✓"],["1","→","◻",null,null,null,null]],"other":{"side":"Zakon Feniksa","start":"Hogwart - Wieże"},"progress":[["•","BO","M","1"],["M","•","•","W"],["WL","•","3","•"],["2","•","B","M"]],"attributes":{"offensiveSpells":"6","supportSpells":"6","practicalSpells":"5","knowledge":"6","influence":"7","cunning":"4"}},"Hermiona Granger":{"title":"Hermiona Granger","income":{"moneyMultiplier":"1","money":"0","explosive":"0","book":"0","potion":"3"},"abilities":{"active":["Zmieniacz czasu","Akcja: możesz przenieść znacznik czasu pomiędzy dowolnymi kartami w grze, niezależnie do kogo należą."],"passive":["Chodząca encyklopedia","Twój limit kart zaklęć na ręku wynosi osiem."],"weakness":["Urodzony Prefekt","Nie możesz używać przedmiotów czarnomagicznych, pułapek ani petard."]},"techniques":[["3","→","✓","","","",""],["1","/","2","→","↺",null,null]],"other":{"side":"Zakon Feniksa","start":"Hogsmeade - Rynek miejski"},"progress":[["•","WL","•","WK"],["1","•","BO","2"],["M","•","M","•"],["3","M","•","4"]],"attributes":{"offensiveSpells":"5","supportSpells":"6","practicalSpells":"6","knowledge":"7","influence":"4","cunning":"6"}},"Nimfadora Tonks":{"title":"Nimfadora Tonks","income":{"moneyMultiplier":"2","money":"2","explosive":"0","book":"4","potion":"0"},"abilities":{"active":["Metamorfomagia","Akcja: umieść na tej umiejętności znacznik postępu. Kiedy znajduje się na niej znacznik, wszystkie postaci niezależne ignorują cię podczas rozpatrywania swojego ruchu i akcji. Odrzuć znacznik po rzuceniu zaklęcia bojowego."],"passive":["Teraz albo nigdy","Podczas rzucania zaklęć otrzymujesz +1 do mocy zaklęć za każdy znacznik czasu na swoich zużytych zaklęciach."],"weakness":["Niezdarna","Za każdym razem, kiedy nie powiedzie ci się test umiejętności niemagicznych, otrzymujesz jedno obrażenie."]},"techniques":[["5","5","→","✓","✓","✓",""],["1","→","↺",null,null,null,null]],"other":{"side":"Zakon Feniksa","start":"Ulica Pokątna - Pasaż"},"progress":[["•","•","M","BS"],["M","1","•","2"],["W","•","•","•"],["M","3","•","BO"]],"attributes":{"offensiveSpells":"6","supportSpells":"4","practicalSpells":"7","knowledge":"6","influence":"6","cunning":"5"}},"Remus Lupin":{"title":"Remus Lupin","income":{"moneyMultiplier":"1","money":"2","explosive":"5","book":"0","potion":"4"},"abilities":{"active":["Pomocna dłoń","Akcja: przywróć sprzymierzeńcowi znajdującemu się na tym samym polu co ty połowę jego utraconych punktów życia, zaokrąglając w dół."],"passive":["Passa","Jeśli podczas testu zaklęcia uzyskasz trafienie krytyczne, otrzymujesz dodatkową akcję."],"weakness":["Klątwa","Nie możesz korzystać ze znaczników przerzucenia."]},"techniques":[["3","3","→","✓","","",""],["1","→","✓",null,null,null,null]],"other":{"side":"Zakon Feniksa","start":"Szpital Św. Munga - Zatrucia eliksilarne i roślinne"},"progress":[["•","WK","2","•"],["1","•","•","W"],["•","M","3","M"],["•","BO","M","•"]],"attributes":{"offensiveSpells":"5","supportSpells":"7","practicalSpells":"5","knowledge":"6","influence":"5","cunning":"6"}},"Ronald Weasley":{"title":"Ronald Weasley","income":{"moneyMultiplier":"1","money":"0","explosive":"5","book":"3","potion":"0"},"abilities":{"active":["Nieludzki wysiłek","Akcja: przyjmij jedno obrażenie, aby rzucić zużyte zaklęcie. Po rzuceniu go nie dokładaj dodatkowych znaczników czasu."],"passive":["Towar z drugiej ręki","Podczas zakupów każdy z przedmiotów możesz kupić w cenie niższej o 1₷."],"weakness":["Trauma","Po pokonaniu przeciwnika twoja tura kończy się natychmiast."]},"techniques":[["?","→","+1","","","",""],["6","→","✓","✓",null,null,null]],"other":{"side":"Zakon Feniksa","start":"Nora"},"progress":[["•","•","1","B"],["BO","•","•","W"],["M","2","M","WL"],["WK","•","3","M"]],"attributes":{"offensiveSpells":"6","supportSpells":"5","practicalSpells":"6","knowledge":"4","influence":"6","cunning":"7"}},"Bellatriks Lestrange":{"title":"Bellatriks Lestrange","income":{"moneyMultiplier":"2","money":"2","explosive":"5","book":"0","potion":"5"},"abilities":{"active":["Zastraszenie","Akcja: umieść, odrzuć lub przemieść znacznik przerzucenia obok jednego atrybutu. Kiedy dowolny bohater z drużyny przeciwnej, znajdujący się na tym samym obszarze co ty, wykonuje test oparty o ten atrybut, test automatycznie kończy się porażką. Odrzuć znacznik po tym teście."],"passive":["Tortury","Podczas rzucania zaklęcia zadającego obrażenia, otrzymujesz +1 do mocy zaklęć za każde trzy utracone punkty życia u celu."],"weakness":["Obłąkana","Nie możesz otrzymywać pozytywnych stanów."]},"techniques":[["3","→","✓","","","",""],["1","→","↺",null,null,null,null]],"other":{"side":"Śmierciożercy","start":"Ulica Pokątna - Ulica Śmiertelnego Nokturnu"},"progress":[["•","B","M","BO"],["•","1","WL","•"],["WK","•","M","•"],["2","M","•","3"]],"attributes":{"offensiveSpells":"7","supportSpells":"5","practicalSpells":"5","knowledge":"6","influence":"6","cunning":"5"}},"Lucjusz  Malfoy":{"title":"Lucjusz  Malfoy","income":{"moneyMultiplier":"3","money":"2","explosive":"4","book":"0","potion":"0"},"abilities":{"active":["Urodzony przywódca","Akcja: przesuń sprzymierzoną postać niezależną o jedno pole."],"passive":["Opurtunista","Kiedy przeciwnik próbuje opuścić pole na którym się znajdujesz (również aportacją), możesz natychmiast rzucić na niego zaklęcie. Jeśli to możliwe, jego ruch zostaje kontynuowany po rozpatrzeniu efektu zaklęcia."],"weakness":["Snob","Nigdy nie możesz kupić przedmiotu, którego cena jest obniżona."]},"techniques":[["3","3","→","✓","","",""],["5","/","6","→","✓","✓",null]],"other":{"side":"Śmierciożercy","start":"Dwór Malfoyów"},"progress":[["•","•","BO","M"],["•","WK","M","2"],["W","M","•","•"],["1","•","•","3"]],"attributes":{"offensiveSpells":"5","supportSpells":"6","practicalSpells":"6","knowledge":"5","influence":"7","cunning":"5"}},"Draco Malfoy":{"title":"Draco Malfoy","income":{"moneyMultiplier":"3","money":"2","explosive":"0","book":"5","potion":"4"},"abilities":{"active":["Obstawa","Akcja: wybierz postać niezależną znajdującą się na tym samym obszarze co ty i zapłać pół sykla (zaokrąglając w górę) za każdy jej poziom, aby otrzymała 2 obrażenia. W skutek tego efektu liczba jej punktów życia nie może spaść do zera."],"passive":["Do skutku","Za każdym razem, kiedy nie powiedzie ci się test zaklęcia wymagającego sukcesu, otrzymujesz dodatkową akcję."],"weakness":["Głębokie blizny","Wszystkie efekty przywracające punkty życia zostają zmniejszone o jeden (do minimum jednego punktu)."]},"techniques":[["?","→","+1","","","",""],["6","→","+",null,null,null,null]],"other":{"side":"Śmierciożercy","start":"Hogwart - Lochy"},"progress":[["•","M","1","B"],["•","M","•","•"],["W","•","•","2"],["•","WL","3","M"]],"attributes":{"offensiveSpells":"6","supportSpells":"5","practicalSpells":"6","knowledge":"7","influence":"5","cunning":"5"}},"Antonin Dołohow":{"title":"Antonin Dołohow","income":{"moneyMultiplier":"1","money":"2","explosive":"0","book":"4","potion":"0"},"abilities":{"active":["Jeden z wielu","Akcja: dowolny sprzymierzony bohater może natychmiast wykonać dodatkową akcję."],"passive":["Przezwyciężenie bólu","Za każdym razem, kiedy otrzymujesz obrażenia, możesz odnowić jedno zaklęcie."],"weakness":["Ślepe posłuszeństwo","Nie możesz używać Insygniów Śmierci."]},"techniques":[["6","6","→","✓","✓","✓","✓"],["1","→","✓",null,null,null,null]],"other":{"side":"Śmierciożercy","start":"Azkaban - Izolatki"},"progress":[["•","M","W","3"],["•","2","•","M"],["WK","•","•","•"],["1","M","W","•"]],"attributes":{"offensiveSpells":"6","supportSpells":"6","practicalSpells":"5","knowledge":"4","influence":"6","cunning":"7"}},"Fenrir Greyback":{"title":"Fenrir Greyback","income":{"moneyMultiplier":"1","money":"0","explosive":"5","book":"4","potion":"0"},"abilities":{"active":["Rzeź","Akcja: przeciwnik znajdujący się na tym samym polu otrzymuje jedno obrażenie oraz stan Zranienie lub Agonia."],"passive":["Nadludzka odporność","Nie możesz otrzymać stanów Zranienie, Agonia i Choroba."],"weakness":["Samotny wilk","Nie możesz rzucać zaklęć na sprzymierzeńców, a sprzymierzeńcy nie mogą rzucać zaklęć na ciebie."]},"techniques":[["1","→","◻","","","",""],["6","→","✓","✓",null,null,null]],"other":{"side":"Śmierciożercy","start":"Hogsmeade - Wzgórze"},"progress":[["•","•","1","B"],["•","M","•","•"],["W","•","M","3"],["WL","2","•","M"]],"attributes":{"offensiveSpells":"5","supportSpells":"5","practicalSpells":"7","knowledge":"5","influence":"6","cunning":"6"}},"Peter Pettigrew":{"title":"Peter Pettigrew","income":{"moneyMultiplier":"1","money":"0","explosive":"0","book":"0","potion":"4"},"abilities":{"active":["Siła poświęcenia","Akcja: przyjmij jedno obrażenie, aby przywrócić sprzymierzeńcowi znajdującemu się na tym samym polu pięć punktów życia."],"passive":["Animagia (Szczur)","Możesz przemieszczać się między polami w obrębie jednego obszaru tak, jakby były ze sobą połączone."],"weakness":["Tchórz","Nie możesz wykonywać akcji Odpoczynek."]},"techniques":[["5","5","→","✓","✓","✓",""],["4","/","5","/","6","→","↺"]],"other":{"side":"Śmierciożercy","start":"Szpital Św. Munga - Urazy pozaklęciowe"},"progress":[["•","WK","•","3"],["M","1","•","•"],["B","M","2","•"],["•","W","M","•"]],"attributes":{"offensiveSpells":"6","supportSpells":"7","practicalSpells":"4","knowledge":"7","influence":"4","cunning":"6"}}}
    }

    createDeck() {
        this.deck = new Deck(this.module.deckSettings);
    }

    createCards() {
        // Object.keys(this.sheet).forEach(tab => {
        //     this.module.parseData(this.sheet[tab], tab);
        // });
        Object.keys(this.module.sets).forEach(set => {
            this.deck.createCard(this.module.sets[set]);
        });
    }

    displayCards() {
        this.container.querySelectorAll('.card').forEach(item => {
            item.parentNode.removeChild(item);
        });
        if (this.isPlayable) this.deck.shuffle();
        this.deck.getCards().forEach(card => {
            this.container.appendChild(card.getNode());
            card.fitTextInRegions();
        });
        if (this.isPlayable) this.nextCard();
    }

    createPlayableUI(titleText) {
        const ui = document.createElement('div');
        const draw = document.createElement('a');
        const shuffle = document.createElement('a');
        const title = document.createElement('span');

        ui.classList.add('ui');
        draw.href = '#';
        shuffle.href = '#';
        draw.classList.add('ui-button');
        shuffle.classList.add('ui-button');
        draw.classList.add('ui-button--draw');
        shuffle.classList.add('ui-button--shuffle');
        title.classList.add('ui-title');
        title.innerText = titleText;

        ui.appendChild(draw);
        ui.appendChild(shuffle);
        ui.appendChild(title);
        this.container.appendChild(ui);

        draw.addEventListener('click', e => {
            this.nextCard();

            e.preventDefault();
        });
        shuffle.addEventListener('click', e => {
            this.shuffleCards();

            e.preventDefault();
        });
    }

    nextCard() {
        const cards = this.container.querySelectorAll('.card');
        const current = this.container.querySelector('.current');

        if (!current) {
            cards[0].classList.add('current');
        } else {
            current.classList.remove('current');
            if (current.nextElementSibling) {
                current.nextElementSibling.classList.add('current');
            } else {
                this.displayCards();
            }
        }
    }

    shuffleCards() {
        const current = this.container.querySelector('.current');

        current.classList.remove('current');
        this.displayCards();
    }

    attachEvents() {
        document.body.addEventListener('font-resized', () => {
            this.deck.getCards().forEach(card => {
                card.resetTextInRegions();
                card.fitTextInRegions();
            });
        });
    }
}
