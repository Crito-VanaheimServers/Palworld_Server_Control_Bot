const { exec } = require('child_process');
const config = require('config');
const { PalRCONClient } = require('palrconclient');

module.exports = (serverStatus);

function serverStatus(clients) {
    const server = clients[1];
    if (config.get(`ControlBot.Steam_Path`) !== "") {
        return new Promise((resolve, reject) => {
            try {
                const server = clients[1];

                exec(`"${config.get(`ControlBot.Bot_Folder_Path`)}/src/ServerCheck.bat" "${config.get(`Servers.${server}.Server_Path`)}" "${config.get(`Servers.${server}.Game_Server_Name`)}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Error checking server status:', error);
                        reject(stderr);
                    } else {
                        const result = stdout.trim();
                        resolve(result);
                    }
                });
            } catch (error) {
                console.error('Error in serverStatus function:', error);
                reject('Error in serverStatus function');
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            try {
                var server = clients[1];
        
                const rconClient1 = new PalRCONClient(config.get(`Servers.${server}.Local_IP`), config.get(`Servers.${server}.Rcon_Port`), config.get(`Servers.${server}.Admin_Password`));
                        
                PalRCONClient.checkConnection(rconClient1)
                    .then((isValid) => {
                        if (isValid) {
                            PalRCONClient.Send(rconClient1, `ShowPlayers`)
                                .then((response) => { 
                                    resolve(config.get(`Servers.${server}.Game_Server_Name`) + ` Online`);
                                })
                                .catch((error) => {
                                    console.error('Error:', error.message);
                                    reject(error);
                                });
                        } else {
                            resolve(config.get(`Servers.${server}.Game_Server_Name`) + ` Offline`);
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
    }
}