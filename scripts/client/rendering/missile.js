// ------------------------------------------------------------------
//
// Rendering function for a missile object.
//
// ------------------------------------------------------------------
MyGame.renderer.Missile = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a missile model.
    //
    // ------------------------------------------------------------------
    that.render = function(state, texture) {
        graphics.saveContext();
        graphics.rotateCanvas(state.center, state.rotation);
        graphics.drawImage(texture, state.center, state.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));
