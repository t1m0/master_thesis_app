import { readValueFromStorage } from "../IonicStorage";
import { encrypt } from "./encrypt";

export function shareCloud(uuid: string, game: string, data: any) {
  console.log(data);
  let user = readValueFromStorage('userName');
  data['subject'] = user;
  console.log(data);
  const body = encrypt(JSON.stringify(data));
  if (body != false) {
    const requestConfig = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    let url = `https://master-thesis-data-function.azurewebsites.net/api/data?uuid=${uuid}&game=${game}`
    
    if (user != undefined && user.length > 0) {
      user = user.toLowerCase();
      user = user.replace(" ", "_");
      url = url + `&user=${user}`;
    }
    fetch(url, requestConfig)
      .then(response => {
        if (response.status == 200 || response.status == 201) {
          console.log("Successfully send data to the cloud.");
        } else {
          console.log("Failed to send data to the cloud!");
        }
      });
  }
}

export function shareLocal(fileName: string, file: File) {
  if ('share' in navigator) {
    shareFile(file, fileName)
  } else {
    download(file, fileName)
  }
}

function shareFile(file: File, fileName: string) {
  navigator.share({
    title: `Sharing ${fileName}`,
    files: [file],
  }).then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));

}

function download(file: File, fileName: string) {
  const elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(file);
  elem.download = fileName;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}