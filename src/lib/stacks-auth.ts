import * as StacksConnectModule from '@stacks/connect';

export const appConfig = new StacksConnectModule.AppConfig(['store_write', 'publish_data']);
export const userSession = new StacksConnectModule.UserSession({ appConfig });

export const appDetails = {
    name: 'Zedkr',
    icon: 'https://image2url.com/r2/default/images/1770964749157-969a1115-2925-4766-b377-26cf90473e42.png',
};

// Robust showConnect extraction with logging
const getShowConnect = () => {
    const mod = StacksConnectModule as any;
    const show = mod.showConnect || mod.default?.showConnect || mod.authenticate || mod.default?.authenticate;
    if (typeof show === 'function') {
        console.log('StacksConnect: showConnect found via direct property or default export.');
        return show;
    }

    // Try searching all keys for anything that looks like showConnect
    const foundKey = Object.keys(mod).find(k => k.toLowerCase() === 'showconnect');
    if (foundKey && typeof mod[foundKey] === 'function') {
        console.log(`StacksConnect: showConnect found via case-insensitive key search: ${foundKey}`);
        return mod[foundKey];
    }

    console.warn('StacksConnect: showConnect function not found using any known methods.');
    return null;
};

export const showConnect = getShowConnect();
export { StacksConnectModule };
