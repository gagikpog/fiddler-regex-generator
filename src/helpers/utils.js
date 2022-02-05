export const defaultData = {
    modules: {
        title: 'Modules',
        items: [{
            value: 'myModule',
            enabled: true
        }]
    },
    fileTypes: {
        title: 'File Types',
        items: [{
            value: 'js',
            enabled: true
        }, {
            value: 'css',
            enabled: false
        }]
    },
    domains: {
        title: 'Domains',
        items: [{
            value: 'mySite',
            enabled: true
        }]
    },
    subdomains: {
        title: 'Subdomains',
        items: [{
            value: 'mySubDomain',
            enabled: false
        }]
    },
    modulesPath: 'src',
    systemModulesPath: 'C:/Users/user/Documents/myProject/src',
    rootDomain: 'ru',
    https: true
}

export const listFields = [
    'modules',
    'fileTypes',
    'domains',
    'subdomains'
];
export const simpleFields = [
    'modules',
    'fileTypes',
    'domains',
    'subdomains'
];

function getDataServer(key) {
    const res = defaultData[key];
    if (typeof res === 'object') {
        return {
            title: res.title,
            items: []
        };
    }
    return res;
}

export function getData(key) {
    const dataStr = isClient() ? window?.localStorage?.getItem(key) : null;

    let res = null;
    try {
        if (dataStr) {
            res = JSON.parse(dataStr);
        }
    } catch (error) {
        res = null;
    }

    return res ?? (isClient() ? defaultData[key] : getDataServer(key));
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

    const subdomainsRegex = subdomainsStr ? `(${subdomainsStr})?.*` : '';
    const domainsRegex = domainsStr ? `(${domainsStr})` : '.*';
    const rootDomainRegex = rootDomain ? `\\.${rootDomain}` : '';

    const pattern = `regex:^http${https ? 's' : ''}://${subdomainsRegex}${domainsRegex}${rootDomainRegex}/${modulesPath}/(${modulesStr})/(${fileTypesStr})(\\?.+)?$`;

    const getParams = (start) => [0, 1].map((i) => `\\$${start + i}`).join('');

    let start = 1;
    start += subdomainsRegex ? 1 : 0;
    start += domainsStr ? 1 : 0;
    const filesPath = `${systemModulesPath || 'C:/'}${getParams(start)}`;
    return {pattern, filesPath};
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
    listFields.forEach((key) => {
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

    simpleFields.forEach((key) => {
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

export function isClient() {
    return typeof window !== 'undefined';
}
