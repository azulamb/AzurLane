type MEOWFFICER_NAME = 'antenna' | 'ark' | 'asamaru' | 'beer' | 'bishamaru' | 'bugles' | 'bunny' | 'eagle' | 'katsumaru' | 'lady' | 'rose' | 'sg' | 'tofu' | 'edelweiss' | 'gral' | 'jiromaru' | 'marble' | 'pepper' | 'potato' | 'soup' | 'yoshimaru' | 'justice' | 'lime' | 'oscar' | 'pound' | 'steel' | 'takemaru';
interface MEOWFFICER_INFO {
    fullname: string;
    url: string;
    rarity: 'R' | 'SR' | 'SSR';
}
interface MEOWFFICER_INFO_DETAIL extends MEOWFFICER_INFO {
    name: string;
}
interface MeowfficerElementClass {
    new (): MeowfficerElement;
    readonly meowfficers: {
        [key in MEOWFFICER_NAME]: MEOWFFICER_INFO;
    };
    list(): MEOWFFICER_INFO_DETAIL[];
}
interface MeowfficerElement extends HTMLElement {
    name: MEOWFFICER_NAME | '';
    readonly icon: string;
}
