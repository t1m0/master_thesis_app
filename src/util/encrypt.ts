import JSEncrypt from "jsencrypt";
import { readValueFromStorage, writeInStorage } from "../IonicStorage";


export function initCrypto() {
    fetch("../../assets/public.pem").then(res=>res.text()).then(cert => {
        writeInStorage("cert", cert);
    });
}

export function encrypt(data: string) {
    const cert = readValueFromStorage("cert");
    if(cert) {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(cert);
        return jsEncrypt.encrypt(data);
    } else {
        throw new Error("Failed to encrypt due to missing cert!");
    }
}