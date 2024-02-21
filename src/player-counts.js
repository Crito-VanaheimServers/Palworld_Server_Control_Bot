const config = require('config');
const { ActivityType } = require('discord.js');
const GameDig = require('gamedig');

module.exports = (playerCounts);

function playerCounts(clients) {
    try {
        var client = clients[0];
        var server = clients[1];

        GameDig.GameDig.query({
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
         })
    } catch (error) {
        console.error('Error in playerCounts:', error);
        return
    }
}