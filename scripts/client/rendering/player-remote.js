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
        console.log('other players username: ', model.username);
        graphics.saveContext();
        graphics.rotateCanvas(model.state.position, model.state.direction);
        graphics.drawImage(texture, model.state.position, model.size);
        graphics.restoreContext();

        let textSpec ={
            font: '32pt Arial',
            fillStyle: 'rgba(255, 0, 0, 1)',
            strokeStyle: 'rgba(0, 0, 0, 1)',
            text: model.username,
            center:{
                x:model.state.position.x,
                y:model.state.position.y
            }
            
        } 
        graphics.drawText(textSpec);

    };

    return that;

}(MyGame.graphics));
