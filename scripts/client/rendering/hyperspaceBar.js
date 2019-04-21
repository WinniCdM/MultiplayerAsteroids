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
            fillStyle: spec.barOutlineColor,
            strokeStyle: spec.barOutlineColor,
            font: spec.font,
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