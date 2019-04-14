//------------------------------------------------------------------
//
// Model for the viewport in the game.
//
//------------------------------------------------------------------
MyGame.components.ViewPort = function(playerGlobalPosition) {
    'use strict';
    let that = {};
    let initialSetupComplete = false;
    let position = { // world units 0-10
        x: playerGlobalPosition.x - 1,
        y: playerGlobalPosition.y - .5
    };
    
    let size = { // world units 0-10
        width: 2,
        height: 1
    };
    let playerLocalPosition = { // viewport units x: 0-2 & y: 0-1
        x: 1,
        y: .5
    }

    let slidingWindowMargin = .1;

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'playerLocalPosition', {
        get: () => playerLocalPosition
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    that.update = function(elapsedTime) {
        // TODO: update position of viewport based on player position
        playerLocalPosition.x = playerGlobalPosition.x - position.x 
        playerLocalPosition.y = playerGlobalPosition.y - position.y

        if (!initialSetupComplete){ // if the port hasn't been setup, center the player on the view port
            position.x = playerGlobalPosition.x - 1;
            position.y = playerGlobalPosition.y - .5
            initialSetupComplete = true;
        }

        console.log(position);

        if (playerLocalPosition.x < slidingWindowMargin){ 
            //move viewport to the left
            console.log("HIT WINDOW X MARGIN ", playerLocalPosition);
        } else if (playerLocalPosition.x > 2 - slidingWindowMargin){
            //move to the right
            console.log("HIT WINDOW X MARGIN ", playerLocalPosition);
        }
        if (playerLocalPosition.y < slidingWindowMargin){
            //move up
            console.log("HIT WINDOW Y MARGIN ", playerLocalPosition);
        } else if (playerLocalPosition.y > 1 - slidingWindowMargin){
            //move down
            console.log("HIT WINDOW Y MARGIN ", playerLocalPosition);
        }
    };

    return that;
};
