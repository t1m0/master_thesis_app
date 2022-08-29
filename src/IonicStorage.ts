import { Storage, Drivers } from "@ionic/storage";
import SpiralDrawingResult from "./components/spiral/model/SpiralDrawing";

var storage:Storage | undefined = undefined;

const getStorage = () => {
    if (storage == undefined) {
        createStore();
    }
    return storage!
}

export const createStore = (name = "__mydb") => {

    storage = new Storage({
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
}


export const writeInStorage = <T>(key:string, val:T) => {
    sessionStorage.setItem(key, JSON.stringify(val));
    return Promise.resolve();
}

export const readFromStorage = async <T>(key:string):Promise<T|undefined> => {
    const val = sessionStorage.getItem(key);
    if (val != null)
        return JSON.parse(val) as T; 
    return undefined;
}

export const removeFromStorage = async (key:string)  => {
    await getStorage().remove(key);
}

export const clearStorage = async () => {
    await getStorage().clear();
}


export const readAllFromStorage = async () => {
    await getStorage().forEach((value,key) => {
        console.log("uuid "+key);
        console.log(value);
    });
}

