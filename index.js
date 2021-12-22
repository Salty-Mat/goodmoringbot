const { MessageEmbed, WebhookClient } = require('discord.js');
const schedule = require('node-schedule');
const fs = require('fs')
const config = require('./config.json');

const countPath = 'count.txt';
var count = 0;

if (fs.existsSync(countPath)) {
	console.log('Loading chair count from file');

	try {
		count = Number(fs.readFileSync(countPath));
		console.log('Sucessfully loaded ' + count + ' from file')

	} catch (error) {
		console.log('Failed to load the chair count because ' + error);
	}
} else console.log('Failed to load the chair count because the file was not found');

const webhookClient = new WebhookClient({ url: config.webhookUrl });

const job = schedule.scheduleJob({hour:6 , minute: 0}, () => {
	webhookClient.send(`***__Good Morning__*** its **6** AM in pacific time **|** its the **${count}th** day of break`)
	count++;
	saveCountToFile();
	console.log('webhook sent');
});


