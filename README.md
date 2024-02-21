# Palworld_Server_Control_Bot
Palworld Server Control Bot
By Crito @Vanaheim Gaming Servers
https://discord.gg/pxC7qSzQ8X
v0.1 02/20/2024

Buy me a pizza:
https://www.paypal.com/paypalme/VanaheimServers


License:
    MIT License

install video: 
https://www.youtube.com/watch?v=gt1_kpd_73s

node.js download
https://nodejs.org/en

Discord developer site
https://discord.com/developers/applications

Bot controls Palworld Server. Designate a specific channel for admin use only so users with
permissions to that channel can the buttons to start, Stop, Restart your server from discord
if needed keeping your server files safe. The bot has other functionality built into it read below.

Server control does not work with Nitrado servers but can be dissabled in setup
Nitrado servers can take advantage of player count status on bot, and rcon commands sent from discord

If you run multiple servers this bot will handle them all if config is setup for multiple bots.

BUTTONS
    Start button: Starts server if it is not running
               
    Stop button: will safely save the world and shut down server.

    Restart button: will first check if the server is running or not and if it is running than it will safely 
                     save the world and shut down the server, Then check for any
                     game updates and apply them if needed. Finally the server will start.

    Restart with warning button: Does what the restart command does but gives in game warnings starting at 15 minutes before
                                  the restart takes place to give players time to prepare for restart.

    Shutdown with warning button: Does what the Stop command does but gives in game warnings starting at 15 minutes before
                                   the shutdown takes place to give players time to prepare for shutdown.

    Cancel warning button: can be used to stop the restart with warning command or the shutdown with warning command so server will
                            not perform those actions.
	
	Use backslash commands to access RCON commands features for each server to send rcon commands from discord and get response if one is given from the server.

BOT MONITORS
	
	CRASHES: If server crashes than the bot will detect that it has gone down and bring it back online sending you a message in discord
	that the server had a possible crash.

    TIME: Checks system time and when it reaches 15 minutes prior to your desired restart time it will start sending
    in game warnings to players chat and broadcast at top of screen, so they have time to log off before world save and server restart.
	
	If you accidently close your bot monitor than just run the Palworld_Server_Controller_Start.bat again, If server is running this will not
    do anything to server it will just restart the discord bot.
	
EXTRA FEATURES
    Bot status displays how many players are connected to server vs max player slots available.

Change Notes:

###########################	INSTALLATION INSTRUCTIONS	########################################

PART 1:	Nodejs Installation

	note:	Nodejs is required for the bot to function.
			You do not need to check the box for necessary tools and chocolatey during the installation process
		
	1. 	Download and install nodejs (version recommended for most users) to the machine your Palworld Server is running on.
		nodejs link https://nodejs.org/en
	
PART 2: Setup your discord bot (each server you want to control from discord needs its own bot, this installation can handle multiple bots)
	
	1. 	Navigate to discord developers site and log in with your discord login credentials
		discord developers site https://discord.com/developers
		
	2.	Find and select "Applications" ("Applications" should be located on left side of screen).
	
	3.	On the upper right side of screen you should find "New Application" Button click on it.
	
	4. 	Now you should be looking at "CREATE AN APPLICATION" box. make a name for application (Example: VGS_Test).
	
	5.	Check the box to agree to terms then click create.
	
	6.	You should have been sent to General Information about your bot. Only thing here you might want to do is set a
		picture for your bot in the app icon portion of the page.
		
	7.	At this point you should see on left side of screen a tab called Bot, click on it.
	
	8.	On this page scroll down until you find Public Bot and turn it off.
	
	9.	Scroll down a little farther and find Privileged Gateway Intents.
	
	10. Here you need to turn on Presence Intent, Server Members Intent, and Message Content Intent.
	
	11. Now click on the green save changes button to save all of your changes so far and stay on the page.
	
PART 3: Invite your bot to your discord server
	
	1. 	On the left side of the page you should see a tab called OAuth2, click on it.
	
	2.	Under the tab you just clicked on should now show General and URL Generator, select URL Generator.
	
	3.	In the Scopes section left column find and check the box called Bot.
	
	4.	Still in the Scopes section on the right side this time find and check the box called applications.commands
	
	5.	Scroll down to the Bot Permissions section and check the box called Administrator.
	
	6.	Scroll to bottom of the page and you should now see Generated URL section, click on the copy button.
		
		note: Do not close this page we are not done here, we will be back to it.
		
	7. 	Now open a new web browser or a new web browser tab and paste in what you just copied to the adress bar and press enter.
	
	8.	You should now have a drop down on this page where you will find your discord server in the dropdown box
		select the server you want the bot to be invited to and click continue then click Authorize and
		verify that you are human. Bot should now be on your discord and will show that it is offline.
		
Part 4:	File setup for your bot
	
	note:	You will need a way to unzip a zip folder and you will need a text editor like notepad or notepad++
			these files need to be put on the same machine as the Ark Survival Ascended Server.
			
	1. 	If you have not done so yet you will need to download the files from github.
	
	2. 	find the downloaded zip file and unzip it. Make sure that the files end up in a folder called, Palworld_Server_Control_Bot
		if they do not than you will need to make this folder and put them into it.
		
		note:	file structure should be: Palworld_Server_Control_Bot folder and in this folder should be 
				node_modules folder, rcon folder, src folder, Palworld_Server_Controller_Start.bat File
				package.json file, package-lock.json file, and README.md file.
				
	3. 	Place the Palworld_Server_Control_Bot folder where ever you would like.
	
	4.	Go into Palworld_Server_Control_Bot folder and find the config folder and inside the config is the default.json
		edit this file with a text editor. In the example_config.txt you will find helpful information on how to setup the default.json File
		the example_config also shows a 2 server setup and if you want more servers just follow the example config adding another server.
	
	5.	all lines with // in the example_config are instructions read them they will guide your with putting in correct info.
 		in the default config file we need bot tokens for each of our bots for each server. Go back to the bot page I said we would come back to
		on the discord developers portal.

  	6. 	On the left side of the page select the Bot tab, on this page you should find you bots icon picture
		and next to it you should see Reset Token button, click on this button.
		
	7.	Yes you want to reset bots token, once reset there should be a copy button to copy the token.
		press this and paste the token in the token area of our .env file.
		
		note: 	Your bot token should be kept safe and not shared with anyone. If it gets compromised you can Reset
				your bot token but will need to update it in you .env file for the bot.
				
	8.	Next we need the ID's for our Discord Server, Bot, and Discord Channels. So to get these we need to make sure
		developer mode is on for us in discord. Go to discord and find User Settings usually located bottom left corner
		near your personal icon and click it.
		
	9.	On the left side of User Settings scroll down until you find Advanced and click this, you should now see at the 
		top Developer Mode. Turn this on.
		
	10. Go back to your discord server and at the top left is your servers name, Right click on this and you should Now
		have Copy Server ID as the last option in the dropdown. If you do not see Copy Server ID than you did not turn on
		Developer Mode.
		
	11. Go back to default.json file and paste in the ID to correct location. Do this for all the ID's you need.
		Find the bot in the player list right click and copy ID, right click on channels and click copy ID.
				
	12. If you have made it this far Congratulations you should be ready to start your bot by double clicking on
		Palworld_Server_Controller_Start.bat found in Palworld_Server_Control_Bot folder. You should than be able to go to your
		discord and see your bot online now.
		
		If you have set everything up correctly than Palworld_Server_Controller_Start.bat will do it all for you. It will start
		your server and your bot. It will auto update each restart and anytime the server is manually restarted.
		If for some reason your bot goes offline just start the Palworld_Server_Controller_Start.bat again. You can run this File
		while server is running and it will not mess with the server while it is running.
