export const writeInStorage = <T>(key: string, val: T) => {
    sessionStorage.setItem(key, JSON.stringify(val));
    return Promise.resolve();
}

export const readFromStorage = async <T>(key: string): Promise<T | undefined> => {
    const val = sessionStorage.getItem(key);
    if (val != null)
        return JSON.parse(val) as T;
    return undefined;
}