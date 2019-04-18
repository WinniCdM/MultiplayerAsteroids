// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d')

    //------------------------------------------------------------------
    //
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    //
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.clear();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through to save the canvas context.
    //
    //------------------------------------------------------------------
    function saveContext() {
        context.save();
    }

    //------------------------------------------------------------------
    //
    // Simple pass-through the restore the canvas context.
    //
    //------------------------------------------------------------------
    function restoreContext() {
        context.restore();
    }

    //------------------------------------------------------------------
    //
    // Rotate the canvas to prepare it for rendering of a rotated object.
    //
    //------------------------------------------------------------------
    function rotateCanvas(center, rotation) {
        context.translate(center.x / 2 * canvas.width, center.y * canvas.height);
        context.rotate(rotation);
        context.translate(-center.x / 2 * canvas.width, -center.y * canvas.height);
    }

    //------------------------------------------------------------------
    //
    // Draw an image into the local canvas coordinate system.
    //
    //------------------------------------------------------------------
    function drawImage(texture, center, size) {
        let localCenter = {
            x: center.x/2 * canvas.width,
            y: center.y * canvas.height
        };
        // console.log("Player global Position: ", center)
        // console.log("canvas position: ", localCenter);
        let localSize = {
            width: size.width * canvas.width / 2,
            height: size.height * canvas.height
        };

        context.drawImage(texture,
            localCenter.x - localSize.width / 2,
            localCenter.y - localSize.height / 2,
            localSize.width,
            localSize.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a sub-texture to the canvas with the following specification:
    //    image: Image
    //    imageCorner: {x: , y: } upperLeft corner of pixel location on image of where to clip
    //    imageSize: {width:, height: } size of image to clip
    //    canvasCorner: {x: , y: } upperLeft corner of where to place on canvas
    //    canvasSize: {width:, height: } // Size to render to Canvas
    //
    // --------------------------------------------------------------
    function drawSubTexture(tile) {
        context.save();

        // Pick the selected sprite from the sprite sheet to render
        context.drawImage(
            tile.image,
            tile.imageCorner.x, tile.imageCorner.y,        //Where to start clipping image
            tile.imageSize.width, tile.imageSize.height,   //Size of clipping
            tile.canvasCorner.x, tile.canvasCorner.y,       //Where to put on canvas    
            tile.canvasSize.width, tile.canvasSize.height); //Size to put on Canvas

        context.restore();
    }

    // --------------------------------------------------------------
    //
    // Draws a sprite to the canvas with the following specification:
    //    image: Image
    //    index: index of sub-texture to draw
    //    subTextureWidth: pixel width of the sub-texture to draw
    //    center: {x: , y: }
    //    size: { width: , height: } // Size (in pixels) to render the sub-texture
    //
    // --------------------------------------------------------------
    function drawSprite(image, index, subTextureWidth, center, size) {

        let localCenter = {
            x: center.x/2 * canvas.width,
            y: center.y * canvas.height
        }

        let localSize = {
            width: size.width * canvas.width / 2,
            height: size.height * canvas.height
        }


        context.save();
        // Pick the selected sprite from the sprite sheet to render
        context.drawImage(
            image,
            subTextureWidth * index, 0,      // Which sub-texture to pick out
            subTextureWidth, image.height,   // The size of the sub-texture
            localCenter.x - localSize.width / 2,           // Where to draw the sub-texture
            localCenter.y - localSize.height / 2,
            localSize.width, localSize.height);

        context.restore();
    }


    return {
        clear: clear,
        saveContext: saveContext,
        restoreContext: restoreContext,
        rotateCanvas: rotateCanvas,
        drawImage: drawImage,
        drawSubTexture:drawSubTexture,
        drawSprite:drawSprite
    };
}());
