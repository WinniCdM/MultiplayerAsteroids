// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a missile.
//
// ------------------------------------------------------------------
'use strict';


//------------------------------------------------------------------
//
// Public function used to initially create a new missile
//
//------------------------------------------------------------------
function createMissile(spec){
    let that = {};
    let owner = spec.owner;
    let state = spec.state;
    let remainingLife = 0;

    Object.defineProperty(that, 'owner', {
        get: () => owner
    });
    Object.defineProperty(that, 'state', {
        get: () => state
    });
    Object.defineProperty(that, 'remainingLife', {
        get: () => remainingLife
    });

    that.setRemainingLife = function(value){
        remainingLife = value;
    }

    that.update = function(elapsedTime){
        remainingLife -=elapsedTime;
        updateCenter(elapsedTime);
    }
    function updateCenter(elapsedTime){
        state.center.x += state.momentum.x * elapsedTime;
        state.center.y += state.momentum.y * elapsedTime;
        if (state.center.x < 0){
            state.center.x = 10;
        }
        if (state.center.x > 10){
            state.center.x = 0;
        }
        
        if (state.center.y < 0){
            state.center.y = 10;
        }
        if (state.center.y > 10){
            state.center.y = 0;
        }
    }
    return that;
}

module.exports.create = (spec) => createMissile(spec);