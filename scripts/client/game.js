//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components, handlers) {
    'use strict';

    let lastTimeStamp = performance.now(),
        myKeyboard = input.Keyboard(),
        playerSelf = {
            model: components.Player(),
            texture: MyGame.assets['player-self']
        },
        viewPort = components.ViewPort(playerSelf.model.position),
        playerOthers = {},
        messageHistory = MyGame.utilities.Queue(),
        messageId = 1,
        messageQueue = [],
        inGame = false,
        socket = io(),
        that = {};

    let hyperspaceBar = components.HyperspaceBar({
        value: 0,
        maxVal: 15000,
        size: { width: .35, height: .045 },
        barColor: 'rgba(255, 255, 255, .5)',
        barOutlineColor: 'rgba(255, 255, 255, .7)',
        position: { x: .75, y: .01 },//ViewPort Units
        text: 'Hyperspace',
        font: "12pt \'Press Start 2P\'",
    });

    Object.defineProperty(that, 'playerSelf', {
        get: () => playerSelf
    });

    Object.defineProperty(that, 'playerOthers', {
        get: () => playerOthers
    });

    //------------------------------------------------------------------
    //
    // Handler for all messages
    //
    //------------------------------------------------------------------
    socket.on('message', function(data) {
        messageQueue.push({
            data: data
        })
    });

    //------------------------------------------------------------------
    //
    // Processes network messages, utilizing the handler functions
    //
    //------------------------------------------------------------------
    function processNetwork(elapsedTime){
        //
        // Double buffering on the queue so we don't asynchronously receive inputs
        // while processing.
        let processMe = messageQueue;
        messageQueue = [];

        for (let index in processMe){
            let message = processMe[index];
            switch (message.data.type){
                case 'connect-ack':
                    handleConnectAck(message.data);
                    break;
                case 'connect-other':
                    handleConnectOther(message.data);
                    break;
                case 'disconnect-other':
                    handleDisconnectOther(message.data);
                    break;
                case 'update-self':
                    handleUpdateSelf(message.data);
                    //hyperspace?
                    break;
                case 'update-other':
                    handleUpdateOther(message.data);
                    //hyperspace?
                    break;
                case 'asteroid-new':
                    handleAsteroidNew(message.data);
                    break;
                case 'asteroid-delete':
                    handleAsteroidDelete(message.data);
                    break;
                case 'ufo-new':
                    handleUFONew(message.data);
                    break;
                case 'ufo-destroyed':
                    handleUFODestroyed(message.data);
                    break;
                case 'missile-new':
                    handleMissileNew(message.data);
                    break;
                case 'missile-destroyed':
                    handleMissileDestroyed(message.data);
                    break;
                case 'powerup-new':
                    handlePowerupNew(message.data);
                    break;
                case 'powerup-delete':
                    handlePowerupDelete(message.data);
                    break;
            }
        } 
    }

    //------------------------------------------------------------------
    //
    // Emits the join game message to start the game
    //
    //------------------------------------------------------------------
    that.handleJoinGame = function(){
        inGame = true;
        let username = document.getElementById("user-name").value;
        if(username === '')
            username = 'nothing';
        let message = {
            type: 'join-game',
            username: username
        }
        socket.emit('input', message);
        playerSelf.model.username = message.username;
    }

    //------------------------------------------------------------------
    //
    // Handler for when the server ack's the socket connection.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function handleConnectAck(data){
        playerSelf.model.momentum.x = data.momentum.x;
        playerSelf.model.momentum.y = data.momentum.y;

        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;

        playerSelf.model.size.x = data.size.x;
        playerSelf.model.size.y = data.size.y;

        playerSelf.model.direction = data.direction;
        playerSelf.model.thrustRate = data.thrustRate;
        playerSelf.model.rotateRate = data.rotateRate;

        viewPort.position.x = playerSelf.model.position.x -1;
        viewPort.position.y = playerSelf.model.position.y -.5;
    }

    //------------------------------------------------------------------
    //
    // Handler for when a new player connects to the game.  We receive
    // the state of the newly connected player model.
    //
    //------------------------------------------------------------------
    function handleConnectOther(data){
        let model = components.PlayerRemote();
        model.state.momentum.x = data.momentum.x;
        model.state.momentum.y = data.momentum.y;
        model.state.position.x = data.position.x;
        model.state.position.y = data.position.y;
        model.state.direction = data.direction;
        model.state.lastUpdate = performance.now();

        model.goal.position.x = data.position.x;
        model.goal.position.y = data.position.y;
        model.goal.direction = data.direction;
        model.goal.updateWindow = 0;

        model.size.x = data.size.x;
        model.size.y = data.size.y;

        playerOthers[data.clientId] = {
            model: model,
            texture: MyGame.assets['player-other']
        };
    }

    //------------------------------------------------------------------
    //
    // Handler for when another player disconnects from the game.
    //
    //------------------------------------------------------------------
    function handleDisconnectOther(data){
        handlers.StatusHandler.createUpdate(playerOthers[data.clientId].model.username + " has disconnected");
        delete playerOthers[data.clientId];
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about the self player.
    //
    //------------------------------------------------------------------
    function handleUpdateSelf(data){
        playerSelf.model.momentum.x = data.momentum.x;
        playerSelf.model.momentum.y = data.momentum.y;
        playerSelf.model.position.x = data.position.x;
        playerSelf.model.position.y = data.position.y;
        playerSelf.model.direction = data.direction;
        playerSelf.model.score = data.score;

        //
        // Remove messages from the queue up through the last one identified
        // by the server as having been processed.
        let done = false;
        while (!done && !messageHistory.empty) {
            if (messageHistory.front.id === data.lastMessageId) {
                done = true;
            }
            messageHistory.dequeue();
        }

        //
        // Update the client simulation since this last server update, by
        // replaying the remaining inputs.
        let memory = MyGame.utilities.Queue();
        while (!messageHistory.empty) {
            let message = messageHistory.dequeue();
            switch (message.type) {
                case 'thrust':
                    playerSelf.model.thrust(message.elapsedTime);
                    break;
                case 'rotate-right':
                    playerSelf.model.rotateRight(message.elapsedTime);
                    break;
                case 'rotate-left':
                    playerSelf.model.rotateLeft(message.elapsedTime);
                    break;
            }
            memory.enqueue(message);
        }
        messageHistory = memory;


        if(data.hyperspaceJump){
            playerSelf.model.hyperSpaceStatus = 0;
            handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
                center:{
                    x: data.position.x,
                    y: data.position.y
                },
                type: 'hyperspace'
            });
            handlers.AudioHandler.handleNewGlobalAudio({
                center:{
                    x: data.position.x,
                    y: data.position.y
                },
                type: 'hyperspace'
            });
        }
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving state updates about other players.
    //
    //------------------------------------------------------------------
    function handleUpdateOther(data){
        if (playerOthers.hasOwnProperty(data.clientId)) {
            let model = playerOthers[data.clientId].model;
            model.goal.updateWindow = data.updateWindow;

            model.score = data.score;
            model.username = data.username;
            model.state.momentum.x = data.momentum.x;
            model.state.momentum.y = data.momentum.y
            model.goal.position.x = data.position.x;
            if (model.goal.position.x < 0) { model.goal.position.x = 0; model.state.momentum.x = 0; } //lower left bound
            if (model.goal.position.x > 10) { model.goal.position.x = 10; model.state.momentum.x = 0; } //upper right bound
            model.goal.position.y = data.position.y
            if (model.goal.position.y < 0) { model.goal.position.y = 0; model.state.momentum.y = 0; } //lower up bound
            if (model.goal.position.y > 10) { model.goal.position.y = 10; model.state.momentum.y = 0; } //upper down bound
            model.goal.direction = data.direction;
        }
        if(data.hyperspaceJump){
            handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
                center:{
                    x: data.position.x,
                    y: data.position.y
                },
                type: 'hyperspace'
            });
            handlers.AudioHandler.handleNewGlobalAudio({
                center:{
                    x: data.position.x,
                    y: data.position.y
                },
                type: 'hyperspace'
            });
        }
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving new asteroids
    //
    //------------------------------------------------------------------
    function handleAsteroidNew(data){
        handlers.AsteroidHandler.createAsteroid(data.message);
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving a notification about asteroid destructions
    //
    //------------------------------------------------------------------
    function handleAsteroidDelete(data){
        //Call correct particle system
        let asteroid = MyGame.handlers.AsteroidHandler.asteroids[data.message.key];

        if (asteroid != null){
            //Call correct Particle System
            if(asteroid.state.size.width == .05){
                MyGame.handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
                    type:'asteroid-destroyed',
                    center:{
                        x: asteroid.state.center.x,
                        y: asteroid.state.center.y
                    }
                })
            }
            else{
                MyGame.handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
                    type:'asteroid-breakup',
                    center:{
                        x: asteroid.state.center.x,
                        y: asteroid.state.center.y
                    }
                })
            }
    
            //Call correct Audio
            MyGame.handlers.AudioHandler.handleNewGlobalAudio({
                type:'asteroid-explosion',
                center:{
                    x: asteroid.state.center.x,
                    y: asteroid.state.center.y
                }
            })
        }

        //Delete Asteroid
        handlers.AsteroidHandler.deleteAsteroid(data.message.key);
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving a new ufo
    //
    //------------------------------------------------------------------
    function handleUFONew(data){
        MyGame.handlers.UFOHandler.handleNewUFO(data.message);//send state info
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving a notification about ufo destructions
    //
    //------------------------------------------------------------------
    function handleUFODestroyed(data){
        //Call correct particle system
        let ufoCenter = MyGame.handlers.UFOHandler.ufos[data.message].state.center;
        MyGame.handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
            type:'ufo-explosion',
            center:{
                x: ufoCenter.x,
                y: ufoCenter.y
            }
        })

        //Call correct Audio
        MyGame.handlers.AudioHandler.handleNewGlobalAudio({
            type:'explosion',
            center:{
                x: ufoCenter.x,
                y: ufoCenter.y
            }
        })

        MyGame.handlers.UFOHandler.destroyUFO(data.message);//pass in only id of UFO
    }
    //------------------------------------------------------------------
    //
    // Handler for receiving a new Missile
    //
    //------------------------------------------------------------------
    function handleMissileNew(data){
        MyGame.handlers.MissileHandler.handleNewMissile(data.message);//send everything
        
        //Call correct Audio
        if(data.message.owner == 'player'){
            MyGame.handlers.AudioHandler.handleNewGlobalAudio({
                type:'laser',
                center:{
                    x: data.message.state.center.x,
                    y: data.message.state.center.y
                }
            })
        } else{
            MyGame.handlers.AudioHandler.handleNewGlobalAudio({
                type:'enemy-laser',
                center:{
                    x: data.message.state.center.x,
                    y: data.message.state.center.y
                }
            })
        }
        
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving a notification about powerup creation
    //
    //------------------------------------------------------------------
    function handlePowerupNew(data){
        handlers.StatusHandler.createUpdate("A power up has appeared", true);
        MyGame.handlers.PowerupHandler.createPowerup(data);
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving a notification about powerup destructions
    //
    //------------------------------------------------------------------
    function handlePowerupDelete(data){
        //Call correct particle system
        let powerUpCenter = MyGame.handlers.PowerupHandler.powerups[data.message.key].state.center;
        MyGame.handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
            type:'powerup-pickup',
            center:{
                x:powerUpCenter.x,
                y:powerUpCenter.y
            }
        })

        //Call correct Audio
        MyGame.handlers.AudioHandler.handleNewGlobalAudio({
            type:'hyperspace',
            center:{
                x: powerUpCenter.x,
                y: powerUpCenter.y
            }
        })

        handlers.StatusHandler.createUpdate(getPowerUpString(handlers.PowerupHandler.powerups[data.message.key].type), true);

        MyGame.handlers.PowerupHandler.deletePowerup(data.message.key);
    }

    function getPowerUpString(type){
        switch (type){
            case "no-shot":
                return "Sucks to suck, looks like a player is without missiles for a bit"
            case "rapid-fire":
                return "A player has picked up a rapid fire boost. Pew pew"
            case "spread-shot":
                return "A player has picked up a spread shot boost. Fear them"
            case "split-shot":
                return "A player has picked up a split shot boost. Somehow, this is wrong"
        }
    }

    //------------------------------------------------------------------
    //
    // Handler for receiving a notification about Missile destructions
    //
    //------------------------------------------------------------------
    function handleMissileDestroyed(data){
        MyGame.handlers.MissileHandler.destroyMissile(data.message);//pass in only id of missile
    }

    //------------------------------------------------------------------
    //
    // Process Score updates on the status menu
    //
    //------------------------------------------------------------------
    function statusUpdateScores(){
        for (let i in playerOthers){
            let currPlayer = playerOthers[i];
            let currPlayerScoreRounded = Math.floor(currPlayer.model.score/10000) * 10000
            if (Math.floor(currPlayerScoreRounded / 10000) > 0){
                handlers.StatusHandler.createUpdate(currPlayer.model.username + " has reached a score of: " + currPlayerScoreRounded, false);
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Process the registered input handlers here.
    //
    //------------------------------------------------------------------
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }
    
    //------------------------------------------------------------------
    //
    // Update the game simulation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        handlers.MissileHandler.update(elapsedTime);
        handlers.AsteroidHandler.update(elapsedTime);
        handlers.UFOHandler.update(elapsedTime);
        handlers.PowerupHandler.update(elapsedTime);

        handlers.ParticleHandler.update(elapsedTime);
        viewPort.update(elapsedTime);
        playerSelf.model.update(elapsedTime);
        handlers.ScoreHandler.update(elapsedTime);
        hyperspaceBar.update(playerSelf.model.hyperSpaceStatus);
        
        statusUpdateScores();
        handlers.StatusHandler.update(elapsedTime);

        for (let id in playerOthers) {
            playerOthers[id].model.update(elapsedTime);
        }
    }

    //------------------------------------------------------------------
    //
    // Render the current state of the game simulation
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        renderer.ViewPort.render(viewPort); 
        handlers.ScoreHandler.render();   
        handlers.StatusHandler.render();    
        renderer.HyperspaceBar.render(hyperspaceBar);    
    }

    //------------------------------------------------------------------
    //
    // Client-side game loop
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        if (inGame){
            processNetwork();
            update(elapsedTime);
            render();
        }

        requestAnimationFrame(gameLoop);
    };

    //------------------------------------------------------------------
    //
    // Public function used to get the game initialized and then up
    // and running.
    //
    //------------------------------------------------------------------
    function initialize() {
        console.log('game initializing...');
        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: 'thrust'
                };
                socket.emit('input', message);
                messageHistory.enqueue(message);
                playerSelf.model.thrust(elapsedTime);
            },
            'w', true);

        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: 'rotate-right'
                };
                socket.emit('input', message);
                messageHistory.enqueue(message);
                playerSelf.model.rotateRight(elapsedTime);
            },
            'd', true);

        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: 'rotate-left'
                };
                socket.emit('input', message);
                messageHistory.enqueue(message);
                playerSelf.model.rotateLeft(elapsedTime);
            },
            'a', true);

        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: 'fire'
                };
                socket.emit('input', message);
                messageHistory.enqueue(message);
            },
            ' ', true);
        myKeyboard.registerHandler(elapsedTime => {
                let message = {
                    id: messageId++,
                    elapsedTime: elapsedTime,
                    type: 'hyperspace'
                };
                socket.emit('input', message);
                messageHistory.enqueue(message);
            },
            'z', true);

        myKeyboard.registerHandler(
            () => MyGame.Menu.HandleEscPress(), 'Escape', true);

        //
        // Get the game loop started
        requestAnimationFrame(gameLoop);
    }

    Object.defineProperty(that, 'initialize',{
        get: () => initialize
    })

    return that
 
}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components, MyGame.handlers));
