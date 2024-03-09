const config = require('config');
const { ActivityType } = require('discord.js');
const BM = require('@leventhan/battlemetrics');
//const GameDig = require('gamedig');

module.exports = (playerCounts);

function playerCounts(clients) {
    try {
        var client = clients[0];
        var server = clients[1];

        /*GameDig.GameDig.query({
             type: 'palworld',
             host: config.get(`Servers.${server}.Global_IP`),
             port: config.get(`Servers.${server}.Game_Port`)
         }).then((res) => {
             var plyrCnt = res.numplayers;
             var maxSlots = res.maxplayers;
 
             client.user.setPresence({
                 activities: [{
                     name: (`Players ${plyrCnt}/${maxSlots}`),
                     type: ActivityType.Custom,
                 }],
                 status: 'online'
             });
         }).catch((error) => {
             client.user.setPresence({
                 activities: [{
                     name: (`Players 0/0`),
                     type: ActivityType.Custom,
                 }],
                 status: 'online'
             });
         })*/

         const options = {
            token: config.get(`ControlBot.Battle_Metrics_Token`),
            serverID: config.get(`Servers.${server}.Battle_Metrics_ServerID`),
            game: 'palworld'
        };
        
        const battleMetrics = new BM(options);
        
                            battleMetrics.getServerInfoById(battleMetrics.serverID).then(res => {
                            var plyrCnt = res.attributes.players;
                            var maxSlots = res.attributes.maxPlayers;
                
                                client.user.setPresence({ 
                                activities: [{ 
                                        name: (`Players ${plyrCnt}/${maxSlots}`),
                                        type: ActivityType.Custom,  
                                        }], 
                                    status: 'online' 
                                    });
                                });
    } catch (error) {
        console.error('Error in playerCounts:', error);
        return
    }
}