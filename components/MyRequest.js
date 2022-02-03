export default async function MyRequest(path, method, body){
    if(method == "POST"){
        return rep = await new Promise(async (resolve) => {
            fetch('https://2bee.gq/' + path, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'user-agent': 'Contact',
                    'token': this.token,
                    'deviceId': this.deviceID,
                    "v": "0.1.3"
                },
                body: JSON.stringify( body )
            })
            .then( response => response.json() )
            .then( response => resolve(response) )
            .catch((error) => {
                resolve({
                    "statut": "error",
                    "info": "Aucune réponse du serveur."
                })
            })
        });
    }
    else if(method == "GET"){
        return rep = await new Promise(async (resolve) => {
            fetch('https://2bee.gq/' + path, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'user-agent': 'Contact',
                    'token': this.token,
                    'deviceId': this.deviceID,
                    "v": "0.1.3"
                }
            })
            .then( response => response.json() )
            .then( response => resolve(response) )
            .catch((error) => {
                resolve({
                    "statut": "error",
                    "info": "Aucune réponse du serveur."
                })
            })
        });
    }
}