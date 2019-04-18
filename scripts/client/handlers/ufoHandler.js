//------------------------------------------------------------------
//
// Handler for all ufos in the game.
//
//------------------------------------------------------------------
MyGame.handlers.UFOHandler = function() {
    'use strict';
    let that = {};


    let ufos = {};
    Object.defineProperty(that, 'ufos', {
        get: () => ufos
    });

    //simply keeps the state and renders it. 
    //---------------------------------------------------------------
    // State contains the following
    // size: { width:,height:},
    // momentum: {x:,y:},//Should set x and y, not sure
    // rotation: ,
    // maxSpeed: ,
    // center: {x:,y:},
    // rotationRate: 
    // id:      //unique UFO identifier, use to add to dictionary
    //---------------------------------------------------------------
    that.handleNewUFO = function (state){
        console.log('ufo state: ', state.center);
        //add the ufo to the dictionary using id
        ufos[state.id] = MyGame.components.UFO(state,MyGame.assets['ufo-1']);
    }

    that.destroyUFO = function(id){
        delete ufos[id];
    }


    return that;
}