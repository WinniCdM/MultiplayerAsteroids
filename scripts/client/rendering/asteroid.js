// ------------------------------------------------------------------
//
// Rendering function for a Asteroid object.
//
// ------------------------------------------------------------------
MyGame.renderer.Asteroid = (function(graphics) {
    'use strict';
    let that = {};

    // ------------------------------------------------------------------
    //
    // Renders a Asteroid model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.saveContext();
        graphics.rotateCanvas(model.state.center, model.state.rotation);
        graphics.drawImage(texture, model.state.center, model.state.size);
        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics));