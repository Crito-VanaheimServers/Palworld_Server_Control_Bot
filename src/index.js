const config = require('config');
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const playerCounts = require("./player-counts.js");
const serverStatus = require("./server-status.js");
const buttonsInfo = require("./buttons-info.js");
const updateServer = require("./update-server.js");
//const modCollect = require("./mod-collect.js");
//const gameChat = require("./game-chat.js");
//const discordChat = require("./discord-chat.js");
const timeCheck = require("./time-check.js");
const restartTimeConv = require("./restart-timeconv.js");
const gameWarning = require("./server-warnings.js");
const reBoot = require("./re-boot.js");
//const modCheck = require("./mod-check.js");
const rconCall = require("./rcon-call.js");

var restartTime = config.get(`ControlBot.Restart_Hour`);
restartTimeConv(function (response) {
    restartTime = response;
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const clients = [];

function afterLogin() {
    setInterval(() => {
        for (let i = 0; i < clients.length; i++) {
            playerCounts(clients[i]);
        }

        if (config.get(`ControlBot.Server_Control`)) {
            (async function () {
                for (let i = 0; i < clients.length; i++) {
                    try {
                        const result = await serverStatus(clients[i]);
                        if (`${result}`.includes("Online")) {
                            const timeResult = await timeCheck();
                            if (`${timeResult}` === `${restartTime}`) {
                                if (clients[i][2] === false) {
                                    clients[i][2] = true;
                                    console.log(`Executing Daily Restart Warnings`);
                                    gameWarning([clients[i], "DAILY_RESTART", clients]);
                                }
                            }
                        } else {
                            if (clients[i][2] === false) {
                                clients[i][2] = true;
                                console.log(`${result}`);
                                reBoot([clients[i], `${clients[i][0].user.tag}`]);
                                await updateServer([clients[i], `${clients[i][0].user.tag}`]);
                                buttonsInfo(clients);
                            }
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            })();
        }
    }, 3000);

    if (config.get(`ControlBot.Server_Control`)) {
        (async function () {
            await buttonsInfo(clients);
            for (let i = 0; i < clients.length; i++) {
                try {
                    const result = await serverStatus(clients[i]);
                    if (`${result}`.includes("Online")) {
                        clients[i][2] = false;
                        console.log(`${result}`);
                    } else {
                        console.log(`${result}`);
                        clients[i][2] = false;
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        })();
    }

    for (let i = 0; i < clients.length; i++) {
        clients[i][0].on('interactionCreate', (interaction) => {
            var IDName = config.get(`Servers.${clients[i][1]}.Game_Server_Name`).toLowerCase().replace(/\s+/g, '_');
            if (interaction.isButton()) {
                if (interaction.customId === `${IDName}_start`) {
                    (async function () {
                        try {
                            var commandSender = interaction.user.globalName;
                            const result = await serverStatus(clients[i]);
                            if (`${result}`.includes("Online")) {
                                const sartcommand = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: commandSender, value: (`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already online`) })
                                    .setColor(0x00e8ff)
                                interaction.reply({ embeds: [sartcommand] });
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already online`);
                                buttonsInfo(clients);
                            } else {
                                const sartcommand = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: commandSender, value: (`Starting ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server`) })
                                    .setColor(0x00e8ff)
                                interaction.reply({ embeds: [sartcommand] });
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Starting ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server`);
                                clients[i][2] = false;
                            }
                        } catch (error) {
                            return
                        }
                    })();
                }

                if (interaction.customId === `${IDName}_stop`) {
                    (async function () {
                        try {
                            var commandSender = interaction.user.globalName;
                            const result = await serverStatus(clients[i]);
                            if (`${result}`.includes("Online")) {
                                if (clients[i][2] === false) {
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Sending shutdown signal to ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server, awaiting response...`);
                                    const stopcommand = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: commandSender, value: (`Sending shutdown signal to ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server, awaiting response...`) })
                                        .setColor(0x00e8ff)
                                    interaction.reply({ embeds: [stopcommand] });
                                    clients[i][2] = true;
                                    rconCall([clients[i], 'DoExit']);
                                    await sleep(60000);
                                    const serverstop = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: commandSender, value: (`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} shutdown successfully`) })
                                        .setColor(0x00e8ff)
                                    await clients[i][0].channels.cache.get((config.get(`Servers.${clients[i][1]}.Admin_Channel_ID`))).send({ embeds: [serverstop] });
                                    console.log(`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} shutdown successfully`);
                                    buttonsInfo(clients);
                                } else {
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Active restart/shutdown in progress`);
                                    const serverstop = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: `ERROR`, value: `Active restart/shutdown in progress` })
                                        .setColor(0xff0000)
                                    interaction.reply({ embeds: [serverstop] });
                                }
                            } else {
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline`);
                                const status = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: `ERROR`, value: (`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline`) })
                                    .setColor(0xff0000)
                                interaction.reply({ embeds: [status] });
                            }
                        } catch (error) {
                            return
                        }
                    })();
                }

                if (interaction.customId === `${IDName}_restart`) {
                    (async function () {
                        try {
                            var commandSender = interaction.user.globalName;
                            const result = await serverStatus(clients[i]);
                            if (`${result}`.includes("Online")) {
                                if (clients[i][2] === false) {
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Restarting ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server please wait...`);
                                    const restartcommand = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: commandSender, value: (`Restarting ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server please wait...`) })
                                        .setColor(0x00e8ff)
                                    interaction.reply({ embeds: [restartcommand] });
                                    rconCall([clients[i], 'DoExit']);
                                } else {
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Active restart/shutdown in progress`);
                                    const restartcommand = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: `ERROR`, value: `Active restart/shutdown in progress` })
                                        .setColor(0xff0000)
                                    interaction.reply({ embeds: [restartcommand] });
                                    buttonsInfo(clients);
                                }
                            } else {
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline, try starting the server`);
                                const status = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: `ERROR`, value: (`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline, try starting the server`) })
                                    .setColor(0xff0000)
                                interaction.reply({ embeds: [status] });
                            }
                        } catch (error) {
                            return
                        }
                    })();
                }

                if (interaction.customId === `${IDName}_restartwarn`) {
                    (async function () {
                        try {
                            var commandSender = interaction.user.globalName;
                            const result = await serverStatus(clients[i]);
                            if (`${result}`.includes("Online")) {
                                if (clients[i][2] === false) {
                                    clients[i][2] = true;
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Restarting ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server with warnings please wait...`);
                                    const restartwarning = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: commandSender, value: `Restarting ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server with warnings please wait....` })
                                        .setColor(0x00e8ff)
                                    interaction.reply({ embeds: [restartwarning] });
                                    gameWarning([clients[i], "ADMIN_FORCED_RESTART", clients]);
                                } else {
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Active restart/shutdown in progress`);
                                    const restartwarning = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: `ERROR`, value: `Active restart/shutdown in progress` })
                                        .setColor(0xff0000)
                                    interaction.reply({ embeds: [restartwarning] });
                                    buttonsInfo(clients);
                                }
                            } else {
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline, try starting the server`);
                                const status = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: `ERROR`, value: (`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline, try starting the server`) })
                                    .setColor(0xff0000)
                                interaction.reply({ embeds: [status] });
                            }
                        } catch (error) {
                            return
                        }
                    })();
                }

                if (interaction.customId === `${IDName}_stopwarn`) {
                    (async function () {
                        try {
                            var commandSender = interaction.user.globalName;
                            const result = await serverStatus(clients[i]);
                            if (`${result}`.includes("Online")) {
                                if (clients[i][2] === false) {
                                    clients[i][2] = true;
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Shutting down ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server with warnings please wait...`);
                                    const shutdownwarning = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: commandSender, value: `Shutting down ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server with warnings please wait....` })
                                        .setColor(0x00e8ff)
                                    interaction.reply({ embeds: [shutdownwarning] });
                                    gameWarning([clients[i], "ADMIN_FORCED_SHUTDOWN", clients]);
                                } else {
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Active restart/shutdown in progress`);
                                    const shutdownwarning = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: `ERROR`, value: `Active restart/shutdown in progress` })
                                        .setColor(0xff0000)
                                    interaction.reply({ embeds: [shutdownwarning] });
                                    buttonsInfo(clients);
                                }
                            } else {
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: ${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline, try starting the server`);
                                const status = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: `ERROR`, value: (`${config.get(`Servers.${clients[i][1]}.Game_Server_Name`)} server is already offline, try starting the server`) })
                                    .setColor(0xff0000)
                                interaction.reply({ embeds: [status] });
                            }

                        } catch (error) {
                            return
                        }
                    })();
                }

                if (interaction.customId === `${IDName}_cancelwarn`) {
                    (async function () {
                        try {
                            var commandSender = interaction.user.globalName;
                            if (clients[i][3] === false) {
                                //if (clients[i][4] === false) {
                                    const cancelwarning = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: commandSender, value: "Cancelling restart please wait..." })
                                        .setColor(0x00e8ff)
                                    interaction.reply({ embeds: [cancelwarning] });
                                    clients[i][3] = true;
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Cancelling restart please wait...`);
                                /*} else {
                                    const cancelwarning = new EmbedBuilder()
                                        .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                        .addFields({ name: `ERROR`, value: "Restart for mod updates can't be cancelled" })
                                        .setColor(0xff0000)
                                    interaction.reply({ embeds: [cancelwarning] });
                                    console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Restart for mod updates can't be cancelled`);
                                }*/
                            } else {
                                const cancelwarning = new EmbedBuilder()
                                    .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                    .addFields({ name: `ERROR`, value: "Active restart cancellation in progress" })
                                    .setColor(0xff0000)
                                interaction.reply({ embeds: [cancelwarning] });
                                console.log(`SENDER: ${commandSender} | COMMAND: ${interaction.customId} | RESPONSE: Active restart cancellation in progress`);
                            }
                        } catch (error) {
                            return
                        }
                    })();
                }
            }

            if (interaction.commandName === `${IDName}_rcon`) {
                (async function () {
                    try {
                        var rconCommand = interaction.options.get('rcon-command').value;
                        var rconSender = interaction.user.globalName;
                        if (interaction.channelId === (config.get(`Servers.${clients[i][1]}.Admin_Channel_ID`))) {
                            //const response = await rconCall([clients[i], `${rconCommand}`]);
                            const response = rconCall([clients[i], `${rconCommand}`]);
                            const rconEmbed = new EmbedBuilder()
                                .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                .addFields({ name: `RCON Command Sender: ${rconSender}`, value: `RCON Command Recived: ${rconCommand}\n${response}\nPalworld RCON seems to still be a work in progress, commands do not give back a response.` })
                                .setColor(0x00e8ff)
                            interaction.reply({ embeds: [rconEmbed] });
                            console.log(`RCON Command Sender: ${rconSender}\nRCON Command Recived: ${rconCommand}\nRCON Results:\n${response}\nPalworld RCON seems to still be a work in progress, commands do not give back a response.`);
                            buttonsInfo(clients);
                        } else {
                            const rconEmbed = new EmbedBuilder()
                                .setTitle(config.get(`Servers.${clients[i][1]}.Game_Server_Name`))
                                .addFields({ name: 'ERROR:', value: 'You just tried to run an admin command outside of an admin channel!' })
                                .setColor(0xff0000)
                            interaction.reply({ embeds: [rconEmbed] });
                            console.log(`RCON Command Sender: ${rconSender}\nRCON Command Recived: ${rconCommand}\n RCON Results: You just tried to run an admin command outside of an admin channel!`);
                        }
                    } catch (error) {
                        return
                    }
                })();
            }
        });
    }
    
}

async function createAndLoginClients() {
    const servers = config.get('Servers');

    for (const serverKey in servers) {
        const server = servers[serverKey];
        const client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
        });

        client.on('ready', () => {
            console.log(`${client.user.tag} is online.`);
            clients.push([client, serverKey, true, false, false]);
            if (clients.length === Object.keys(servers).length) {
                afterLogin();
            }
        });


        try {
            await client.login(server.Player_Count_Bot_Token);
        } catch (error) {
            console.error(`Error logging in client for server ${serverKey}:`, error);
        }
    }
}

createAndLoginClients()

//cancelRestart = clients[i][3];
//modUpdate = clients[i][4];
//activeRestart = clients[i][2];