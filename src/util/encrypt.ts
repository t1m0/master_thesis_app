import JSEncrypt from "jsencrypt";
import { readValueFromStorage, writeInStorage } from "../IonicStorage";

const maxLength = 350;

export function initCrypto() {
    fetch("../../assets/public.pem").then(res => res.text()).then(cert => {
        writeInStorage("cert", cert);
    });
}

export function encrypt(data: string) {
    const cert = readValueFromStorage("cert");
    if (cert) {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(cert);

        if (data.length < maxLength) {
            return jsEncrypt.encrypt(data);
        } else {
            return handleLargeString(data, jsEncrypt);
        }
    } else {
        throw new Error("Failed to encrypt due to missing cert!");
    }
}

function handleLargeString(data: string, jsEncrypt: JSEncrypt) {
    const chunkCount = data.length / maxLength;
    let encryptedString = "";
    let lastIndex = 0;
    for (let i = 0; i < chunkCount; i++) {
        const newIndex = lastIndex + maxLength;
        const currentString = data.slice(lastIndex, newIndex);
        encryptedString += jsEncrypt.encrypt(currentString);
        encryptedString += "\n";
        lastIndex = newIndex;
    }
    return encryptedString;
}