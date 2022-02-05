export function initYandexMetrika() {
    
    const init = (win, doc, type, src, item) => {
        win[item] = win[item] || function() { (win[item].a = win[item].a || []).push(arguments)};
        win[item].l = 1 * new Date();
        const element = doc.createElement(type);
        const [ elementInDom ] = doc.getElementsByTagName(type);
        element.async = 1;
        element.src = src;
        elementInDom.parentNode.insertBefore(element, elementInDom);
    };

    init(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(87380093, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
    });

}
