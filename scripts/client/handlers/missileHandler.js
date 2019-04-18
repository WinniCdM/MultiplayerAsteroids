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

     //simply keeps the state and renders it. 
    //---------------------------------------------------------------
    // State contains 
    // size: { width:,height:},
    // momentum: {x:,y:},//Should set x and y, not sure
    // rotation: ,
    // maxSpeed: ,
    // center: {x:,y:},
    // id:      //unique UFO identifier, use to add to dictionary
    //---------------------------------------------------------------

    //message contains
    // state
    // owner
    //clientID
    that.handleNewMissile = function (message){
        

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