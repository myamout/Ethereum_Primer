import express from 'express';

const app = express();

app.use(express.static(__dirname + '/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/wingcss/dist/'));

app.listen(1337);
console.log('[+] Server running on port 1337');
