// ------------------------------------------------------------------
//
// Rendering function for a PlayerRemote object.
//
// ------------------------------------------------------------------
MyGame.renderer.PlayerRemote = (function(graphics) {
    'use strict';
    let that = {};
    
    // ------------------------------------------------------------------
    //
    // Renders a PlayerRemote model.
    //
    // ------------------------------------------------------------------
    that.render = function(model, texture) {
        graphics.saveContext();
        graphics.rotateCanvas(model.state.position, model.state.direction);
        graphics.drawImage(texture, model.state.position, model.size);
        graphics.restoreContext();

        let textSpec ={
            font: "12pt \'Press Start 2P\'",
            fillStyle: 'rgba(255, 255, 255, .3)',
            strokeStyle: 'rgba(255, 255, 255, .3)',
            text: model.username,
            center:{
                x:model.state.position.x - .07,
                y:model.state.position.y -.07
            }
            
        } 
        graphics.drawText(textSpec);

    };

    return that;

}(MyGame.graphics));
