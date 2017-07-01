import express from 'express';

const app = express();
app.use(express.static(__dirname + '/dist'));



app.listen(1337);
console.log('[+] Server is listening on port 1337');