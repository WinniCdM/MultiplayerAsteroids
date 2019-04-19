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
        updateCenter(elapsedTime);
        rotate(elapsedTime);
        updateAnimation(elapsedTime);
        // console.log('current UFO center: ', state.center);
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
        animationTime += elapsedTime;
        if (animationTime >= spriteTime[subImageIndex]) {
            animationTime -= spriteTime[subImageIndex];
            subImageIndex += 1;
            subImageIndex = subImageIndex % spriteCount;
        }
    }

    return that;
}