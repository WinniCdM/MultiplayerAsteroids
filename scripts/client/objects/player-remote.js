//------------------------------------------------------------------
//
// Model for each remote player in the game.
//
//------------------------------------------------------------------
MyGame.components.PlayerRemote = function() {
    'use strict';
    let that = {};
    let size = {
        width: 0.05,
        height: 0.05
    };
    let state = {
        direction: 0,
        position: {
            x: 0,
            y: 0
        },
        momentum: {
            x: 0,
            y: 0
        }
    };
    let goal = {
        direction: 0,
        position: {
            x: 0,
            y: 0
        },
        updateWindow: 0      // Server reported time elapsed since last update
    };
    that.username = '';
    that.score = 0;
    that.clientId;

    that.crashed = false;

    Object.defineProperty(that, 'state', {
        get: () => state
    });

    Object.defineProperty(that, 'goal', {
        get: () => goal
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });


    //------------------------------------------------------------------
    //
    // Update of the remote player depends upon whether or not there is
    // a current goal or if the ship is just floating along.  If a current
    // goal, update is a simpler progression/interpolation from the previous 
    // state to the goal (new) state.  If it is floating along, then use
    // the momentum to update the position.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        let goalTime = Math.min(elapsedTime, goal.updateWindow);
        if (goalTime > 0) {
            let updateFraction = goalTime / goal.updateWindow;
            // Turn first, then move.
            state.direction -= (state.direction - goal.direction) * updateFraction;

            state.position.x -= ((state.position.x - goal.position.x) * updateFraction);
            state.position.y -= ((state.position.y - goal.position.y) * updateFraction);

            goal.updateWindow -= goalTime;

            //trying to simply call particle effect here. 
            if(state.position !== goal.position){
                let vectorX = Math.cos(state.direction);
                let vectorY = Math.sin(state.direction);
                MyGame.handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
                    center: {
                        x:  state.position.x - (vectorX*.015),
                        y:  state.position.y - (vectorY*.015)
                    },
                    type:'other-thrust',
                    clientId: that.clientId, 
        
                });
            }
        } else {
            // Ship is only floating along, only need to update its position
            state.position.x += (state.momentum.x * elapsedTime);
            state.position.y += (state.momentum.y * elapsedTime);
        }
        if (state.position.x < 0) { state.position.x = 0; state.momentum.x = 0; } //lower left bound
        if (state.position.x > 10) { state.position.x = 10; state.momentum.x = 0; } //upper right bound
        if (state.position.y < 0) { state.position.y = 0; state.momentum.y = 0; } //lower up bound
        if (state.position.y > 10) { state.position.y = 10; state.momentum.y = 0; } //upper down bound
    };
    //------------------------------------------------------------------
    //
    // Public function that gives the direction of the thrust
    //
    //------------------------------------------------------------------
    that.getThrustDirection = function(){
        let vectorX = Math.cos(state.direction);
        let vectorY = Math.sin(state.direction);
        return { x: -vectorX, y: -vectorY}
    }
    return that;
};
