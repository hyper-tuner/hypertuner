export const storageGet = (key: string) => window.localStorage.getItem(key);

export const storageSet = (key: string, value: string) => window.localStorage.setItem(key, value);
