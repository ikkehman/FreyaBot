const qrcode = require('qrcode-terminal');
const { Client, LocalAuth  } = require('whatsapp-web.js');
const axios = require('axios');

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
client.on('message', async (message) => {
	// await client.sendMessage(message.from, 'pong');
    try {
        const response = await axios.post('http://8.222.215.182:3000/chat', {
            messages: message.body
        });
        await client.sendMessage(message.from, response.data.reply);
        console.log(message.body)
        // console.log('Response from server:', response);
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
});
 

client.initialize();