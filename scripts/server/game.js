// ------------------------------------------------------------------
//
// Nodejs module that provides the server-side game model.
//
// ------------------------------------------------------------------
'use strict';

let present = require('present');
let Player = require('./objects/player');
let AsteroidHandler = require('./handlers/asteroidsHandler');
let UFOHandler = require('./handlers/ufoHandler');
let MissileHandler = require('./handlers/missileHandler');

let asteroidsHandler = AsteroidHandler.create();
let missilesHandler = MissileHandler.createMissileHandler();
let ufosHandler = UFOHandler.createUFOHandler(missilesHandler);

const UPDATE_RATE_MS = 200;
let quit = false;
let activeClients = {};
let inputQueue = [];
let lastUpdateTime = present();

let asteroidGenerationRate = 3 / 10000 // 1 every 10000 milliseconds
let timeSinceLastAsteroid = 10000; // immediately spawn one

//------------------------------------------------------------------
//
// Process the network inputs we have received since the last time
// the game loop was processed.
//
//------------------------------------------------------------------
function processInput() {
    //
    // Double buffering on the queue so we don't asynchronously receive inputs
    // while processing.
    let processMe = inputQueue;
    inputQueue = [];

    for (let inputIndex in processMe) {
        let input = processMe[inputIndex];
        let client = activeClients[input.clientId];
        client.lastMessageId = input.message.id;
        switch (input.message.type) {
            case 'thrust':
                // Need to compute the difference since the last update and when the thrust
                // input was received.  This time difference needs to be simulated before the
                // thrust input is processed in order to keep the client and server thinking
                // the same think about the player's ship.
                client.player.thrust(input.message.elapsedTime, input.receiveTime - lastUpdateTime);
                lastUpdateTime = input.receiveTime;
                break;
            case 'rotate-left':
                client.player.rotateLeft(input.message.elapsedTime);
                break;
            case 'rotate-right':
                client.player.rotateRight(input.message.elapsedTime);
                break;
        }
    }
}

//------------------------------------------------------------------
//
// Update the simulation of the game.
//
//------------------------------------------------------------------
function update(elapsedTime) {
    for (let clientId in activeClients) {
        activeClients[clientId].player.update(elapsedTime, false);
    }
    asteroidsHandler.update(elapsedTime);
    ufosHandler.update(elapsedTime);
}

//------------------------------------------------------------------
//
// Send new information about UFOs to the clients
//
//------------------------------------------------------------------
function updateClientsAboutUFOs(elapsedTime){
    //New UFO
    if(ufosHandler.newUFOs.length){
        for(let id in ufosHandler.newUFOs){
            let currNewUFO = ufosHandler.ufos[id];
            transmitMessageToAllClients(currNewUFO.state,'ufo-new');
        }
        ufosHandler.clearNewUFOS();
    }

    //UFO destroyed
    if(ufosHandler.UFOsDestroyed.length){
        for(let id in ufosHandler.UFOsDestroyed){
            transmitMessageToAllClients(id,'ufo-destroyed'); 
        }
        ufosHandler.clearUFOsDestroyed();
    }
}
//------------------------------------------------------------------
//
// Send new information about UFOs to the clients
//
//------------------------------------------------------------------
function updateClientsAboutMissiles(elapsedTime){
    //New Missiles
    if(missilesHandler.newMissiles.length){

        for(let id in missilesHandler.newMissiles){
            let currNewMissile = missilesHandler.newMissiles[id];
            let message = {
                state:currNewMissile.state,
                owner:currNewMissile.owner
            }
            transmitMessageToAllClients(message,'missile-new');
        }
        missilesHandler.clearNewMissiles();
    }

    //Missiles destroyed
    if(missilesHandler.missilesDestroyed.length){
        for(let id in missilesHandler.missilesDestroyed){
            transmitMessageToAllClients(id,'missile-destroyed');
        }

        missilesHandler.clearMissilesDestroyed();
    }
}

//------------------------------------------------------------------
//
// Send state of the Asteroids to any connected clients.
//
//------------------------------------------------------------------
function updateClientsAboutAsteroids(elapsedTime){
    timeSinceLastAsteroid += elapsedTime; // generate a new asteroid if necesary
    if (timeSinceLastAsteroid * asteroidGenerationRate > 1){
        asteroidsHandler.createNewRandomAsteroid(1);
        timeSinceLastAsteroid = 0;
    }

    // new asteroids
    let newAsteroids = asteroidsHandler.newAsteroids;
    for (let i in newAsteroids){
        let key = newAsteroids[i];
        let currNewAsteroid = asteroidsHandler.asteroids[key];
        let message = {
            asteroidState: currNewAsteroid.state,
            key: key
        }
        transmitMessageToAllClients(message, 'asteroid-new');
    }

    // deleted asteroids
    let deletedAsteroids = asteroidsHandler.deletedAsteroids;
    for (let key in deletedAsteroids){
        let message = {
            key: key
        }
        transmitMessageToAllClients(message, 'asteroid-delete');
    }

    asteroidsHandler.clearNewAndDeletedAsteroids();
}

//------------------------------------------------------------------
//
// Generic function used to send messages to all clients
//
//------------------------------------------------------------------
function transmitMessageToAllClients(message, type){
    for (let clientId in activeClients) {
        let client = activeClients[clientId];
        client.socket.emit('message', {
                type: type,
                message: message
            }
        )
    }
}


//------------------------------------------------------------------
//
// Send state of the game to any connected clients.
//
//------------------------------------------------------------------
function updateClients(elapsedTime) {
    for (let clientId in activeClients) {
        let client = activeClients[clientId];
        let update = {
            type: 'update-self',
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            momentum: client.player.momentum,
            direction: client.player.direction,
            position: client.player.position,
            updateWindow: elapsedTime
        };
        if (client.player.reportUpdate) {
            client.socket.emit('message', update);

            update.type = 'update-other';

            //
            // Notify all other connected clients about every
            // other connected client status...but only if they are updated.
            for (let otherId in activeClients) {
                if (otherId !== clientId) {
                    activeClients[otherId].socket.emit('message', update);
                }
            }
        }
    }

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
    }
    lastUpdateTime = present();
}

//------------------------------------------------------------------
//
// Transmits messages of all current asteroids to the provided 
// clientSocket
//
//------------------------------------------------------------------
function informNewClientAboutExistingAsteroids(clientSocket){
    let rocks = asteroidsHandler.asteroids;
    for( let key in rocks ){
        let currRock = rocks[key];
        let message = {
            asteroidState: currRock.state,
            key: key
        }
        clientSocket.emit('message', {
            type: "asteroid-new",
            message: message
        });
    }
}

//------------------------------------------------------------------
//
// Transmits messages of all current ufos to the provided 
// clientSocket
//
//------------------------------------------------------------------
function informNewClientAboutExistingUFOs(clientSocket){
    let fos = ufosHandler.ufos;
    for (let key in fos){
        let currFos = fos[key];
        let message = currFos.state;
        clientSocket.emit('message', {
            type: "ufo-new",
            message: message
        })
    }
}

//------------------------------------------------------------------
//
// Transmits a message of a certain type to all connected clients
//
//------------------------------------------------------------------
function transmitMessageToAllClients(message, type){
    for (let clientId in activeClients) {
        let client = activeClients[clientId];
        client.socket.emit('message', {
                type: type,
                message: message
            }
        )
    }
}

//------------------------------------------------------------------
//
// Server side game loop
//
//------------------------------------------------------------------
function gameLoop(currentTime, elapsedTime) {
    processInput();
    update(elapsedTime);
    updateClients(elapsedTime);
    updateClientsAboutAsteroids(elapsedTime);
    updateClientsAboutUFOs(elapsedTime);
    updateClientsAboutMissiles(elapsedTime);

    if (!quit) {
        setTimeout(() => {
            let now = present();
            gameLoop(now, now - currentTime);
        }, UPDATE_RATE_MS);
    }
}

//------------------------------------------------------------------
//
// Get the socket.io server up and running so it can begin
// collecting inputs from the connected clients.
//
//------------------------------------------------------------------
function initializeSocketIO(httpServer) {
    let io = require('socket.io')(httpServer);

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the arrival of this
    // new client.  Plus, tell the newly connected client about the
    // other players already connected.
    //
    //------------------------------------------------------------------
    function notifyConnect(socket, newPlayer) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (newPlayer.clientId !== clientId) {
                //
                // Tell existing about the newly connected player
                client.socket.emit('message', {
                    type: 'connect-other',
                    clientId: newPlayer.clientId,
                    momentum: newPlayer.momentum,
                    direction: newPlayer.direction,
                    position: newPlayer.position,
                    rotateRate: newPlayer.rotateRate,
                    thrustRate: newPlayer.thrustRate,
                    size: newPlayer.size
                });

                //
                // Tell the new player about the already connected player
                socket.emit('message', {
                    type: 'connect-other',
                    clientId: client.player.clientId,
                    momentum: client.player.momentum,
                    direction: client.player.direction,
                    position: client.player.position,
                    rotateRate: client.player.rotateRate,
                    thrustRate: client.player.thrustRate,
                    size: client.player.size
                });
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Notifies the already connected clients about the disconnect of
    // another client.
    //
    //------------------------------------------------------------------
    function notifyDisconnect(playerId) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (playerId !== clientId) {
                client.socket.emit('message', {
                    type: 'disconnect-other',
                    clientId: playerId
                });
            }
        }
    }
    
    io.on('connection', function(socket) {
        console.log('Connection established: ', socket.id);
        //
        // Create an entry in our list of connected clients
        let newPlayer = Player.create()
        newPlayer.clientId = socket.id;
        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer
        };
        socket.emit('message', {
            type: 'connect-ack',
            momentum: newPlayer.momentum,
            direction: newPlayer.direction,
            position: newPlayer.position,
            size: newPlayer.size,
            rotateRate: newPlayer.rotateRate,
            thrustRate: newPlayer.thrustRate
        });

        socket.on('input', data => {
            inputQueue.push({
                clientId: socket.id,
                message: data,
                receiveTime: present()
            });
        });

        socket.on('disconnect', function() {
            delete activeClients[socket.id];
            notifyDisconnect(socket.id);
        });

        notifyConnect(socket, newPlayer);
        informNewClientAboutExistingAsteroids(socket);
        informNewClientAboutExistingUFOs(socket);
    });
}

//------------------------------------------------------------------
//
// Entry point to get the game started.
//
//------------------------------------------------------------------
function initialize(httpServer) {

    initializeSocketIO(httpServer);
    gameLoop(present(), 0);
}

//------------------------------------------------------------------
//
// Public function that allows the game simulation and processing to
// be terminated.
//
//------------------------------------------------------------------
function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;
