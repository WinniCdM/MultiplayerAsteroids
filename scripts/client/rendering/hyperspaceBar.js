// --------------------------------------------------------------
//
// Renders an hyperspaceBar object.
//
// --------------------------------------------------------------
MyGame.renderer.HyperspaceBar = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawProgressBar(spec);

        graphics.drawText({
            text: spec.text,
            fillStyle: 'rgba(255, 255, 255, .7)',
            strokeStyle: 'rgba(255, 255, 255, .7)',
            font: "12pt \'Press Start 2P\'",
            center:{
                x:spec.position.x +.005,
                y:spec.position.y +.005
            }


        })
    }

    return {
        render: render
    };
}(MyGame.graphics));