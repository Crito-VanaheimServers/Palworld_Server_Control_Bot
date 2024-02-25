const config = require('config');
const { EmbedBuilder } = require('discord.js');
const rconCall = require("./rcon-call");
const buttonsInfo = require("./buttons-info.js");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = (gameWarning);

async function gameWarning([clients, warning, clientsArray]) {
    try {
        const client = clients[0];
        const server = clients[1];

        const warnMinutes = [300000, 300000, 60000, 60000, 60000, 60000, 60000];
        let totalMin = warnMinutes.reduce((acc, curr) => acc + curr, 0);

        for (let i = 0; i < warnMinutes.length; i++) {
            let totalMinConv = totalMin / 60000;
            let warnBroadcast, warnMessage;

            if (clients[3] === false) {
                warnBroadcast = `Broadcast ${warning}_${totalMinConv}_MINUTES`;
            } else {
                warnBroadcast = `Broadcast ${warning}_CANCELLED`;
                
                const rconCancelWarn = new EmbedBuilder()
                    .setTitle(config.get(`Servers.${server}.Game_Server_Name`))
                    .addFields({ name: `${warning}`, value: (`****${warning} CANCELLED****`) })
                    .setColor(0x00e8ff);
                await client.channels.cache.get(config.get(`Servers.${server}.Admin_Channel_ID`)).send({ embeds: [rconCancelWarn] });

                for (let i = 0; i < 3; i++) {
                    rconCall([clients, warnBroadcast]); 
                    await sleep(5000);
                }

                console.log(`${warnBroadcast}`);

                await sleep(2000);

                clients[2] = false;
                clients[3] = false;
                await buttonsInfo(clientsArray);
                return;
            }

            for (let i = 0; i < 3; i++) {
                rconCall([clients, warnBroadcast]); 
                await sleep(5000);
            }

            console.log(`${warnBroadcast}`);

            await sleep(2000);

            await sleep(warnMinutes[i]);
            totalMin -= warnMinutes[i];
        }

        rconCall([clients, 'DoExit']);
        await sleep(30000);

        if (warning === "ADMIN FORCED RESTART") {
            clients[2] = false;
        } else if (warning === "ADMIN FORCED SHUTDOWN") {
            const responseTrim = `${response}`.trim();
            const rconShutdownWarn = new EmbedBuilder()
                .setTitle(config.get(`Servers.${server}.Game_Server_Name`))
                .addFields({ name: `${warning}`, value: (`${responseTrim}\n${config.get(`Servers.${server}.Game_Server_Name`)} shutdown successfully`) })
                .setColor(0x00e8ff);
            await client.channels.cache.get(config.get(`Servers.${server}.Admin_Channel_ID`)).send({ embeds: [rconShutdownWarn] });
            console.log(`${responseTrim}\n${config.get(`Servers.${server}.Game_Server_Name`)} shutdown successfully`);
            await sleep(20000);
            await buttonsInfo(clientsArray);
        } else if (warning === "DAILY RESTART" || warning === "MOD UPDATE RESTART") {
            clients[2] = false;
        }
    } catch (error) {
        console.error('Error in gameWarning function:', error);
    }
}