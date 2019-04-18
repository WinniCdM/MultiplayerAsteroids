//------------------------------------------------------------------
//
// Handler for all missiles in the game.
//
//------------------------------------------------------------------
MyGame.handlers.MissileHandler = (function() {
    'use strict';
    let that = {};
    let missiles = {};
    Object.defineProperty(that, 'missiles', {
        get: () => missiles
    });


    //message contains
    // state
    // owner
    // clientID
    that.handleNewMissile = function (message){
        //console.log('new missile added at: ', message.state);

        switch(message.owner){
            case 'player':
                missiles[message.state.id] = MyGame.components.Missile(message,MyGame.assets['player-missile']);
                break;
            case 'enemy':
                missiles[message.state.id] = MyGame.components.Missile(message,MyGame.assets['enemy-missile']);
                break;
        }
    }
    that.destroyMissile = function(id){
        delete missiles[id];
    }

    that.update = function(elapsedTime){
        for(let id in missiles){
            missiles[id].update(elapsedTime);
        }
    }

    return that;
}())