// ------------------------------------------------------------------
//
// Rendering function for a Powerup object.
//
// ------------------------------------------------------------------
MyGame.renderer.Powerup = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Powerup as a sprite
    //
    // ------------------------------------------------------------------
    that.render = function(state, texture, subImageIndex, subTextureWidth) {
        graphics.saveContext();
        graphics.rotateCanvas(state.center, state.rotation);
        graphics.drawSprite(texture, subImageIndex, subTextureWidth, state.center, state.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));