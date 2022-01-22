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
    systemModulesPath: '',
    rootDomain: 'ru',
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

    return res ?? defaultData[key];
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

/**
 * 
 * @param {{ value: string, enabled: boolean }} item
 * @returns 
 */
function validateItem(item) {
    return item && typeof item.value === 'string' &&  typeof item.enabled === 'boolean';
}

export function getValidatedData(data) {
    const res = {};
    let done = true;
    [
        'modules',
        'fileTypes',
        'domains',
        'subdomains'
    ].forEach((key) => {
        const items = data?.[key]?.items || [];
        let newItem = [];

        if (Array.isArray(items)) {
            newItem = items.filter(validateItem).map((item) => {
                return {
                    value: item.value,
                    enabled: item.enabled
                };
            });
            if (newItem.length !== items.length) {
                done = false;
            }
        } else {
            done = false;
        }

        res[key] = {
            title: defaultData[key].title,
            items: newItem
        };
    });

    [
        'modulesPath',
        'systemModulesPath',
        'rootDomain',
        'https',
    ].forEach((key) => {
        const type =  typeof defaultData[key];
        const inputData = data?.[key];
        if (typeof inputData === type) {
            res[key] = inputData;
        } else {
            done = false;
        }
    });

    return {res, done};
}
