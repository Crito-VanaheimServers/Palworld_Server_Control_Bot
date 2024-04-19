const config = require('config');
const { PalRCONClient } = require('palrconclient');

module.exports = async function rconCall([clients, rconCMD]) {
    return new Promise((resolve, reject) => {
        try {
            var server = clients[1];
    
            const rconClient1 = new PalRCONClient(config.get(`Servers.${server}.Local_IP`), config.get(`Servers.${server}.Rcon_Port`), config.get(`Servers.${server}.Admin_Password`));
                    
            PalRCONClient.checkConnection(rconClient1)
                .then((isValid) => {
                    if (isValid) {
                        PalRCONClient.Send(rconClient1, `${rconCMD}`)
                            .then((response) => { 
                                console.log(response);
                                resolve(response);
                            })
                            .catch((error) => {
                                console.error('Error:', error.message);
                                reject(error);
                            });
                    } else {
                        console.error('Connection failed. Please check your connection details.');
                        reject(new Error('Connection failed. Please check your connection details.'));
                    }
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                    reject(error);
                });
        } catch (error) {
            console.error('Error:', error.message);
            reject(error);
        }
    });
};