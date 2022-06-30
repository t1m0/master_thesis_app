import { Storage, Drivers } from "@ionic/storage";
import SpiralDrawingResult from "./components/spiral/model/SpiralDrawingResult";

var storage:Storage | undefined = undefined;

export const createStore = (name = "__mydb") => {

    storage = new Storage({
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
}


export const writeInStorage = (key:string, val:SpiralDrawingResult) => {
    if(storage != undefined) {
        storage.set(key, val);
        console.log("Save result: "+ val.uuid);
    }
}

export const readFromStorage = async (key:string):Promise<SpiralDrawingResult|undefined> => {
    if(storage != undefined) {
        const val = await storage.get(key);
        console.log(val);
        if (val instanceof SpiralDrawingResult) {
            return val as SpiralDrawingResult; 
        }
    }
    console.log("Not able to read "+key);
    return undefined;
}

export const removeFromStorage = async (key:string)  => {
    if(storage != undefined) {
        await storage.remove(key);
    }
}

export const clearStorage = async () => {
    if(storage != undefined) {
        await storage.clear();
    }
}


export const readAllFromStorage = async () => {
    if(storage != undefined) {
        const val = await storage.forEach((value,key) => {
            console.log("uuid"+key);
            console.log(value);
        });
    }
}

