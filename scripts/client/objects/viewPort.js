//------------------------------------------------------------------
//
// Model for the viewport in the game.
//
//------------------------------------------------------------------
MyGame.components.ViewPort = function(playerGlobalPosition) {
    'use strict';
    let that = {};

    let initialSetupComplete = false;

    let objectsWithinViewPort = [];

    let position = { // world units 0-10
        x: 0,
        y: 0
    };
    
    let size = { // world units 0-10
        width: 2,
        height: 1
    };

    let playerLocalPosition = { // viewport units x: 0-2 & y: 0-1
        x: 1,
        y: .5
    }

    let slidingWindowMargin = .3;

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'playerLocalPosition', {
        get: () => playerLocalPosition
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    Object.defineProperty(that, 'objectsWithinViewPort', {
        get: () => objectsWithinViewPort
    });

    that.update = function(elapsedTime) {
        updateViewPortAndPlayerPosition();
        updateViewPortObjects(elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Nudges the viewport within the entire world map according to the
    // player's position. 
    //
    // If the viewport is at the edge of the world map, the viewport
    // won't move and allow the player to move to the edge.
    //
    //------------------------------------------------------------------
    let updateViewPortAndPlayerPosition = function(){
        playerLocalPosition.x = playerGlobalPosition.x - position.x 
        playerLocalPosition.y = playerGlobalPosition.y - position.y

        let deltaX = 0;
        let deltaY = 0;

        if (!initialSetupComplete){ // if the port hasn't been setup, center the player on the view port
            position.x = playerGlobalPosition.x - 1;
            position.y = playerGlobalPosition.y - .5
            initialSetupComplete = true;
        }

        if (playerLocalPosition.x < slidingWindowMargin){ // nudge left
            deltaX = slidingWindowMargin - playerLocalPosition.x;
            position.x -= deltaX; //nudges the viewport to the left
            if (position.x < 0){ // if its beyond the left bound, return viewport to left bound, and do not update player local position
                position.x = 0;
                deltaX = 0;
            }
            else{   //else update player local position
                playerLocalPosition.x = slidingWindowMargin;
            }
        } else if (playerLocalPosition.x > 2 - slidingWindowMargin){ // nudge right
            deltaX = playerLocalPosition.x - (2 - slidingWindowMargin);
            position.x +=  deltaX;//nudges the viewport to the right
            deltaX *= -1;
            if (position.x + 2 > 10){ // if its beyond the right bound, return viewport to left bound, and do not update player local position
                position.x = 8;
                deltaX = 0;
            }
            else{   //else update player local position
                playerLocalPosition.x = 2 - slidingWindowMargin;
            }
        }

        if (playerLocalPosition.y < slidingWindowMargin){ // nudge up
            deltaY = slidingWindowMargin - playerLocalPosition.y; 
            position.y -= deltaY;//nudges the viewport up
            if (position.y < 0){ // if its beyond the north bound, return viewport to north bound, and do not update player local position
                position.y = 0;
                deltaY = 0
            }
            else{   //else update player local position
                playerLocalPosition.y = slidingWindowMargin;
            }
        } else if (playerLocalPosition.y > 1 - slidingWindowMargin){ //nudge down
            deltaY = playerLocalPosition.y - (1 - slidingWindowMargin);
            position.y += deltaY; //nudges the viewport down
            deltaY *= -1;
            if (position.y + 1 > 10){ // if its beyond the south bound, return viewport to south bound, and do not update player local position
                position.y = 9;
                deltaY = 0;
            }
            else{   //else update player local position
                playerLocalPosition.y = 1 - slidingWindowMargin;
            }
        }

        MyGame.handlers.ParticleHandler.moveParticleSubsystems(deltaX,deltaY);
        
    }

    //------------------------------------------------------------------
    //
    // Updates the list of objects found within the viewPort
    //
    //------------------------------------------------------------------
    let updateViewPortObjects = function(elapsedTime){
        objectsWithinViewPort = { 
            "playerSelf": null,
            "playerOthers": [],
            "ufos": [],
            "asteroids": [],
            "powerups": [],
            "missiles": []
         } //clear viewport objects
        objectsWithinViewPort["playerSelf"] = MyGame.main.playerSelf; //add player

        //Check if other players are in viewport
        for (let index in MyGame.main.playerOthers){
            let currOtherPlayer = MyGame.main.playerOthers[index];
            if (checkIfWithinViewPort(currOtherPlayer.model.state.position)){
                objectsWithinViewPort["playerOthers"].push(currOtherPlayer);
            }
        }

        //Check if UFOs are in viewport
        for (let id in MyGame.handlers.UFOHandler.ufos){
            let currUFO = MyGame.handlers.UFOHandler.ufos[id];
            if (checkIfWithinViewPort(currUFO.state.center)){
                objectsWithinViewPort["ufos"].push(currUFO);
            }
        }

        //Check if asteroids are in viewport
        for (let index in MyGame.handlers.AsteroidHandler.asteroids){
            let currAsteroid = MyGame.handlers.AsteroidHandler.asteroids[index];
            if (checkIfWithinViewPort(currAsteroid.state.center)){
                objectsWithinViewPort["asteroids"].push(currAsteroid);
            }
        }

        //check if powerups are in viewport
        for (let index in MyGame.handlers.PowerupHandler.powerups){
            let currPowerup = MyGame.handlers.PowerupHandler.powerups[index];
            if (checkIfWithinViewPort(currPowerup.state.center)){
                objectsWithinViewPort["powerups"].push(currPowerup);
            }
        }

        //Missiles
        for (let id in MyGame.handlers.MissileHandler.missiles){
            let currMissile = MyGame.handlers.MissileHandler.missiles[id];
            if(checkIfWithinViewPort(currMissile.state.center)){
                objectsWithinViewPort['missiles'].push(currMissile);
            }
        }


        //Particles
        //These are a bit different, instead of just adding we need to actually call
        //the function to create the system based on the GlobalParticleSubSystem list that is
        //in the viewport
        for(let index in MyGame.handlers.ParticleHandler.globalParticleSubsystems){
            let currSystem = MyGame.handlers.ParticleHandler.globalParticleSubsystems[index];
            //currSystem contains: center, type
            if(checkIfWithinViewPort(currSystem.center)){
                //call the handler to create the correct localParticleSubsytem
                let localCenter = {
                    x:currSystem.center.x - position.x,
                    y:currSystem.center.y - position.y
                }
                MyGame.handlers.ParticleHandler.handlNewLocalParticleSubsystem({
                    center: localCenter,
                    type: currSystem.type,
                    clientId: currSystem.clientId
                })
            }
        }
        //After we have gone over all of the new globalParticleSubsystems clear that array
        MyGame.handlers.ParticleHandler.resetGlobal();


        //Audio
        for(let index in MyGame.handlers.AudioHandler.globalAudio){
            let currAudio = MyGame.handlers.AudioHandler.globalAudio[index];

            if(checkIfWithinViewPort(currAudio.center)){
                MyGame.handlers.AudioHandler.handleNewLocalAudio(currAudio.type);
            }
        }
        MyGame.handlers.AudioHandler.resetGlobal();

    }

    //------------------------------------------------------------------
    //
    // Checks to see if the provide center is within the viewport
    //
    // Adds a buffer of world units around the edges
    //
    //------------------------------------------------------------------
    let checkIfWithinViewPort = function(objectCenter){
        let isWithinViewPort = false;
        let buffer = .1 // extra space around the edges of the viewport, so things don't just pop up!
        if (objectCenter.x > position.x - buffer && objectCenter.x < position.x + 2 + buffer){ // if within x bounds
            if (objectCenter.y > position.y - buffer && objectCenter.y < position.y + 1 + buffer){ //if within y bounds
                isWithinViewPort = true;
            } 
        }

        return isWithinViewPort;
    }
    

    return that;
};
