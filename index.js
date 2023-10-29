const express = require('express');
const path = require('path');
const { WebSocket, WebSocketServer } = require('ws');

const WS_PORT = 8080
const wss = new WebSocketServer({ port: WS_PORT })
wss.on('listening', () => {
    console.log( `WebSocketServer listening on port ${WS_PORT}`)
})

wss.on('connection', function (ws) {
    ws.on('error', () => console.error(error))

    ws.on('message', function (data) {
        let jsonData = JSON.parse(data);
        if (jsonData.name) {
            console.log(`${jsonData.name} has connected.`);
            ws.name = jsonData.name
            wss.clients.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN && ws.name !== client.name) {

                    client.send( JSON.stringify({ announcement: `${ws.name} has joined.` }))
                }
            })
        } else {
            wss.clients.forEach( function (client) {
                if (client.readyState === WebSocket.OPEN && ws.name !== client.name) {
                    client.send( JSON.stringify({ name: ws.name, message: jsonData.message }))
                }
            })
        }
    })

    ws.on('close', function () {
        console.log(`${ws.name} has left.`)
        wss.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send( JSON.stringify({ announcement: `${ws.name} has left.` }))
            }
        })
    })
})

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})


const PORT = 3000;
app.listen(3000, () => {
    console.log(`Listening on port ${PORT}`);
})

