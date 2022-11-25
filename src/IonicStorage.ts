export const clearStorage = () => {
    sessionStorage.clear();
}

export const writeInStorage = <T>(key: string, val: T) => {
    let localValue: string;
    if (typeof (val) === 'string' || val instanceof String) {
        localValue = val as string
    } else {
        localValue = JSON.stringify(val);
    }
    sessionStorage.setItem(key, localValue);
}

export const readObjectFromStorage = <T>(key: string): T | undefined => {
    const val = sessionStorage.getItem(key);
    if (val != null)
        return JSON.parse(val) as T;
    return undefined;
}

export const readValueFromStorage = (key: string): string | undefined => {
    const val = sessionStorage.getItem(key);
    if (val != null)
        return val;
    return undefined;
}

export const appendSessionUuid = (key: string, uuid: string) => {
    let uuids = readObjectFromStorage(key) as Array<string>;
    if (uuids == undefined) {
        uuids = new Array<string>()
    }
    if (!uuids.includes(uuid)) {
        uuids.push(uuid);
    }
    writeInStorage(key, uuids);
    return uuids.length;
}

export const getSessionCount = (key: string) => {
    const uuids = readObjectFromStorage(key) as [string];
    if (uuids != undefined) {
        return uuids.length;
    } else {
        return 0;
    }
}
