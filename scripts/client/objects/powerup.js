MyGame.components.Powerup = function(spec, texture){
    'use strict';
    let that = {}

    Object.defineProperty(that, 'state', {
        get: () => state
    })

    Object.defineProperty(that, 'texture', {
        get: () => texture
    })

    let spriteCount = 6;
    let spriteTime = [200, 200, 200, 200, 200, 200];

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