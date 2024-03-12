const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');
const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
   kode = qrcode.generate(qr, { small: true });
//    console.log(kode);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
//     console.log(msg);
// });
async function getPrayerTimes() {
    try {
        const response = await axios.get('https://waktu-sholat.vercel.app/prayer?latitude=0.5264444444444445&longitude=101.4506222222222');
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function findTodayPrayerTimes() {
    const data = await getPrayerTimes();
    if (data) {
        const today = moment().format('YYYY-M-D');
        for (let i = 0; i < data.prayers.length; i++) {
            if (data.prayers[i].date === today) {
                // return data.prayers[i];

                let fixNumberHour = parseInt(data.prayers[i].time.imsak.replace(/^0+/, ''), 10);
                let fixNumberMinutes = parseInt(data.prayers[i].time.imsak.split(':')[1]);;

                let number = ['6281270655552'];
                const rule = new schedule.RecurrenceRule();
                const sekarang = new Date();
                const jamSekarang = sekarang.getHours();
                rule.hour = fixNumberHour - 2;
                rule.minute = fixNumberMinutes;
                rule.second = 0;
                console.log(rule.hour)
                const job = schedule.scheduleJob(rule, async function() {
                    for (let i = 0; i < number.length; i++) {
                        console.log('Sending message to', number[i]);
                        await client.sendMessage(`${number[i]}@c.us`, `Udah jam ${jamSekarang} nih.`);
                        await client.sendMessage(`${number[i]}@c.us`, `Hari ini imsaknya jam ${data.prayers[i].time.imsak}`);
                        await client.sendMessage(`${number[i]}@c.us`, 'Jangan lupa sahur ya! Semangat puasanya! 🌙');
                    }  
                });
            }
        }
    }
   
    return null;
}
let timex = findTodayPrayerTimes()
// // let fixNumberHour = parseInt(timex.replace(/^0+/, ''), 10);
// console.log(timex)

client.on('message', async (message) => {
	// await client.sendMessage(message.from, 'pong');
    try {
        const response = await axios.post('http://8.222.215.182:3000/chat', {
            messages: message.body
        });
        await client.sendMessage(message.from, response.data.reply);
        const user = await message.getContact();
        // Mendapatkan nama pengguna
        const userName = user.name;

        console.log(`Pesan dari: ${userName} - ${message.body}`);
        // console.log('Response from server:', response);
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
});
 

client.initialize();
