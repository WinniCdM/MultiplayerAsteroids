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

    let slidingWindowMargin = .2;

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

        if (!initialSetupComplete){ // if the port hasn't been setup, center the player on the view port
            position.x = playerGlobalPosition.x - 1;
            position.y = playerGlobalPosition.y - .5
            initialSetupComplete = true;
        }

        if (playerLocalPosition.x < slidingWindowMargin){ // nudge left
            position.x -= slidingWindowMargin - playerLocalPosition.x; //nudges the viewport to the left
            if (position.x < 0){ // if its beyond the left bound, return viewport to left bound, and do not update player local position
                position.x = 0;
            }
            else{   //else update player local position
                playerLocalPosition.x = slidingWindowMargin;
            }
        } else if (playerLocalPosition.x > 2 - slidingWindowMargin){ // nudge right
            position.x += playerLocalPosition.x - (2 - slidingWindowMargin); //nudges the viewport to the right
            if (position.x + 2 > 10){ // if its beyond the right bound, return viewport to left bound, and do not update player local position
                position.x = 10;
            }
            else{   //else update player local position
                playerLocalPosition.x = 2 - slidingWindowMargin;
            }
        }

        if (playerLocalPosition.y < slidingWindowMargin){ // nudge up
            position.y -= slidingWindowMargin - playerLocalPosition.y; //nudges the viewport up
            if (position.y < 0){ // if its beyond the north bound, return viewport to north bound, and do not update player local position
                position.y = 0;
            }
            else{   //else update player local position
                playerLocalPosition.y = slidingWindowMargin;
            }
        } else if (playerLocalPosition.y > 1 - slidingWindowMargin){ //nudge down
            position.y += playerLocalPosition.y - (1 - slidingWindowMargin); //nudges the viewport down
            if (position.y + 1 > 10){ // if its beyond the south bound, return viewport to sotuh bound, and do not update player local position
                position.y = 10;
            }
            else{   //else update player local position
                playerLocalPosition.y = 2 - slidingWindowMargin;
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Updates the list of objects found within the viewPort
    //
    //------------------------------------------------------------------
    let updateViewPortObjects = function(elapsedTime){
        objectsWithinViewPort = { 
            "playerSelf": null,
            "playerOthers": []
         } //clear viewport objects
        objectsWithinViewPort["playerSelf"] = MyGame.main.that.playerSelf; //add player

        for (let index in MyGame.main.that.playerOthers){
            let currOtherPlayer = MyGame.main.that.playerOthers[index];
            if (checkIfWithinViewPort(currOtherPlayer.model.state.position)){
                objectsWithinViewPort["playerOthers"].push(currOtherPlayer);
            }
        }
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
