import { readValueFromStorage } from "../IonicStorage";

export function shareCloud(uuid: string, game: string, data: any) {
  const requestConfig = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  let url = `https://el0evnajuh.execute-api.eu-central-1.amazonaws.com/data?uuid=${uuid}&game=${game}`;
  let user = readValueFromStorage('userName');
  console.log("User", user);
  if(user != undefined && user.length > 0) {
    user = user.toLowerCase();
    user = user.replace(" ", "_");
    url = url + `&user=${user}`;
  }
  fetch(url, requestConfig)
    .then(response => {
      if (response.status == 200) {
        console.log("Successfully send data to AWS.");
      } else {
        console.log("Failed to send data to AWS!");
      }
    });
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