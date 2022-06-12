import { MessageEmbed, WebhookClient } from 'discord.js';
import schedule from 'node-schedule';
import fs from "fs";
import config from './config.json' assert { type: "json" };
import { AsyncWeather } from '@cicciosgamino/openweather-apis';
const weather = await new AsyncWeather();
const countPath = 'count.txt';
weather.setCity('Highland');
weather.setUnits('imperial');
weather.setApiKey(config.apiKey);
const webhookClient = new WebhookClient({ url: config.webhookUrl });
var count = 0;
if (fs.existsSync(countPath)) {
    console.log('Loading chair count from file');
    try {
        count = Number(fs.readFileSync(countPath));
        console.log('Sucessfully loaded ' + count + ' from file');
    }
    catch (error) {
        console.log('Failed to load the chair count because ' + error);
    }
}
else
    console.log('Failed to load the chair count because the file was not found');
const job = schedule.scheduleJob({ hour: 6, minute: 0 }, async (date) => {
    const currentWeather = await weather.getAllWeather();
    const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${currentWeather.weather[0].main}  ${getIcon(currentWeather.weather[0].main)} `)
        //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        .setDescription(`**curent temp**: ${Math.round(currentWeather.main.temp)} ℉ `)
        .addField('forecast:', `${Math.round(currentWeather.main.temp_min)}°<:3263_Blank:985411059475152916>${getTempRange(currentWeather.main.temp_min, currentWeather.main.temp_max)}<:3263_Blank:985411059475152916>**${Math.round(currentWeather.main.temp_max)}°**`)
        .setTimestamp()
        .setFooter({ text: 'dm mat if broke' });
    if (date.getDay() % 2 == 0) {
        webhookClient.send({ content: `***__GOODMORING__*** its **6** AM in pacific time **|** today's **weather**:`, embeds: [exampleEmbed] });
    }
    else {
        webhookClient.send({ content: `***__Good Morning__*** its **6** AM in pacific time **|** today's **weather**:`, embeds: [exampleEmbed] });
    }
    count--;
    saveCountToFile();
    console.log('webhook sent');
});
async function saveCountToFile() {
    fs.writeFileSync(countPath, count.toString());
}
function getTempRange(min, max) {
    let out = "";
    const diff = max - min;
    const inc = Math.round(diff / 5);
    let temp = min;
    for (let i = 0; i < 5; i++) {
        temp += inc;
        if (temp <= 70) {
            out += `:green_square:`;
        }
        else if (temp <= 78) {
            out += `:orange_square:`;
        }
        else {
            out += `:red_square:`;
        }
        out += " ";
    }
    return out.trimEnd();
}
function getIcon(string) {
    switch (string) {
        case 'Clear':
            return ':white_sun_small_cloud:';
        case 'Clouds':
            return ':cloud:';
        case 'Drizzle':
            return ':white_sun_rain_cloud:';
        case 'Rain':
            return ':cloud_rain:';
        case 'Snow':
            return ':cloud_snow:';
        case 'Thunderstorm':
            return ':thunder_cloud_rain:';
        case 'Atmosphere':
            return ':fog:';
        default:
            return ':cloud:';
    }
}
