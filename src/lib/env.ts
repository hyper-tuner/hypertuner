export const isWeb = process.env.APP_PLATFORM === 'web';
export const isDesktop = process.env.APP_PLATFORM === 'desktop';
export const isMac = `${window.navigator.platform}`.includes('Mac');
export const platform = `${window.navigator.platform}`;
