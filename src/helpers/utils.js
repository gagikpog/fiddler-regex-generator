const defaultData = {
    modules: {
        title: 'Modules',
        items: []
    },
    fileTypes: {
        title: 'File Types',
        items: []
    },
    domains: {
        title: 'Domains',
        items: []
    },
    subdomains: {
        title: 'Subdomains',
        items: []
    },
    modulesPath: '',
    rootDomain: '',
    systemModulesPath: '',
    https: true
}

export function getData(key) {
    const dataStr = window.localStorage.getItem(key);
    let res = null;
    try {
    if (dataStr) {
        res = JSON.parse(dataStr);
    }
    } catch (error) {
        res = null;
    }

    return res || defaultData[key];
}

export function generateRequestPattern(modules, fileTypes, domains, subdomains, modulesPath, rootDomain, https, systemModulesPath) {
    const filter = (item) => item.enabled;
    const getValues = (item) => item.value;

    const domainsStr = domains.items.filter(filter).map(getValues).join('|')
    const subdomainsStr = subdomains.items.filter(filter).map(getValues).join('|')
    const modulesStr = modules.items.filter(filter).map(getValues).join('|');
    const fileTypesStr = fileTypes.items.filter(filter).map((item) => {
        return `(.*\\.${getValues(item)})?`;
    }).join('');

    return `regex:^http${https ? 's' : ''}://(${subdomainsStr})?.*(${domainsStr})\\.${rootDomain}/${modulesPath}/(${modulesStr})/(${fileTypesStr})(\\?.+)?$`;

}
