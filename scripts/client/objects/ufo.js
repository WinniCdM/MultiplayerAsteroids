//------------------------------------------------------------------
//
// Model for each ufo in the game.
//
//------------------------------------------------------------------
MyGame.components.UFO = function(state, texture) {
    'use strict';
    let that = {};
    Object.defineProperty(that, 'state', {
        get: () => state
    });
    Object.defineProperty(that, 'texture', {
        get: () => texture
    });

    let spriteCount = 7;
    let spriteTime = [285, 285, 285, 285, 285, 285, 285];

    Object.defineProperty(that, 'spriteCount', {
        get: () => spriteCount
    });
    Object.defineProperty(that, 'spriteTime', {
        get: () => spriteTime
    });
    
    let animationTime = 0;
    let subImageIndex = 0;
    let subTextureWidth = texture.width / spriteCount;

    Object.defineProperty(that, 'subImageIndex', {
        get: () => subImageIndex
    });
    Object.defineProperty(that, 'subTextureWidth', {
        get: () => subTextureWidth
    });

    that.update = function(elapsedTime){
        //update Location
        updateCenter(elapsedTime);
        rotate(elapsedTime);
        updateAnimation(elapsedTime);
    }

    function updateCenter(elapsedTime){
        state.center.x += state.momentum.x * elapsedTime;
        state.center.y += state.momentum.y * elapsedTime;
        if (state.center.x < -.1){
            state.center.x = 10.1;
        }
        if (state.center.x > 10.1){
            state.center.x = -.1;
        }
        
        if (state.center.y < -.1){
            state.center.y = 10.1;
        }
        if (state.center.y > 10.1){
            state.center.y = -.1;
        }
    }

    function rotate(elapsedTime){
        state.rotation += state.rotationRate * elapsedTime;
    }

    function updateAnimation(elapsedTime){
        //update animation Sprite stuff
        animationTime += elapsedTime;
        //
        // Check to see if we should update the animation frame
        if (animationTime >= spriteTime[subImageIndex]) {
            //
            // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame.
            animationTime -= spriteTime[subImageIndex];
            subImageIndex += 1;
            //
            // Wrap around from the last back to the first sprite as needed
            subImageIndex = subImageIndex % spriteCount;
        }
    }

    return that;
}