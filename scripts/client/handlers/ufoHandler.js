//------------------------------------------------------------------
//
// Handler for all ufos in the game.
//
//------------------------------------------------------------------
MyGame.handlers.UFOHandler = (function(){
    'use strict';
    let that = {};


    let ufos = {};
    Object.defineProperty(that, 'ufos', {
        get: () => ufos
    });

    that.update = function(elapsedTime){
        for(let id in ufos){
            ufos[id].update(elapsedTime);
        }
    }

    that.handleNewUFO = function (state){
        //add the ufo to the dictionary using id
        console.log('new ufo with state: ', state);
        ufos[state.id] = MyGame.components.UFO(state, MyGame.assets['ufo-1']);
    }

    that.destroyUFO = function(id){
        delete ufos[id];
    }

    that.update = function(elapsedTime){
        for(let id in ufos){
            ufos[id].update(elapsedTime);
        }
    }


    return that;
}());