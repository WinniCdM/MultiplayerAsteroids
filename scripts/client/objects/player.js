//------------------------------------------------------------------
//
// Model for each player in the game.
//
//------------------------------------------------------------------
MyGame.components.Player = function() {
    'use strict';
    let that = {};
    let momentum = {
        x: 0,
        y: 0
    };
    let position = {
        x: 0,
        y: 0
    };
    let size = {
        width: 0.05,
        height: 0.05
    };
    let direction = 0;
    let rotateRate = 0;
    let thrustRate = 0;
    that.username = '';
    that.score = 0;

    Object.defineProperty(that, 'momentum', {
        get: () => momentum
    });

    Object.defineProperty(that, 'direction', {
        get: () => direction,
        set: (value) => { direction = value }
    });

    Object.defineProperty(that, 'thrustRate', {
        get: () => thrustRate,
        set: value => { thrustRate = value; }
    });

    Object.defineProperty(that, 'rotateRate', {
        get: () => rotateRate,
        set: value => { rotateRate = value; }
    });

    Object.defineProperty(that, 'position', {
        get: () => position
    });

    Object.defineProperty(that, 'size', {
        get: () => size
    });

    //------------------------------------------------------------------
    //
    // Public function that moves the player in the current direction.
    //
    //------------------------------------------------------------------
    that.thrust = function(elapsedTime) {
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);

        momentum.x += (vectorX * thrustRate * elapsedTime);
        momentum.y += (vectorY * thrustRate * elapsedTime);

        MyGame.handlers.ParticleHandler.handleNewGlobalParticleSubsytem({
            center: {
                x: position.x - (vectorX*.015),
                y: position.y - (vectorY*.015)
            },
            type:'thrust'

        });


    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player right.
    //
    //------------------------------------------------------------------
    that.rotateRight = function(elapsedTime) {
        direction += (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that rotates the player left.
    //
    //------------------------------------------------------------------
    that.rotateLeft = function(elapsedTime) {
        direction -= (rotateRate * elapsedTime);
    };

    //------------------------------------------------------------------
    //
    // Public function that gives the direction of the thrust
    //
    //------------------------------------------------------------------
    that.getThrustDirection = function(){
        let vectorX = Math.cos(direction);
        let vectorY = Math.sin(direction);
        return { x: -vectorX, y: -vectorY}
    }


    that.update = function(elapsedTime) {
        position.x += (momentum.x * elapsedTime);
        if (position.x < 0) { position.x = 0; momentum.x = 0; } //lower left bound
        if (position.x > 10) { position.x = 10; momentum.x = 0; } //upper right bound
        position.y += (momentum.y * elapsedTime);
        if (position.y < 0) { position.y = 0; momentum.y = 0; } //lower up bound
        if (position.y > 10) { position.y = 10; momentum.y = 0; } //upper down bound
    };

    return that;
};
