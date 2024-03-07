const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');
const axios = require('axios');
const schedule = require('node-schedule');

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
let number = ['6281270655552'];
const rule = new schedule.RecurrenceRule();
rule.hour = 3;
rule.minute = 0;
rule.second = 0

const job = schedule.scheduleJob(rule, async function() {
    for (let i = 0; i < number.length; i++) {
        await client.sendMessage(`${number[i]}@c.us`, 'Udah jam 3 nih.');
        await client.sendMessage(`${number[i]}@c.us`, 'Jangan lupa sahur ya! Semangat puasanya! 🌙');
    }  
});

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
