import { AppConfig, UserSession } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const appDetails = {
    name: 'Zedkr',
    icon: 'https://image2url.com/r2/default/images/1770964749157-969a1115-2925-4766-b377-26cf90473e42.png',
};
