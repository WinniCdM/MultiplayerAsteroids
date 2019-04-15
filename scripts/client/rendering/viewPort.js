// ------------------------------------------------------------------
//
// Rendering function for the ViewPort.
//
// ------------------------------------------------------------------
MyGame.renderer.ViewPort = (function(graphics, renderer) {
    'use strict';
    let that = {};

    let rootKey = 'background';
    let backgroundImageWholeInfo = MyGame.assets[rootKey];//has width, height, and tileSize
    let tilesToRender = [];
    let tileSize = backgroundImageWholeInfo.tileSize;
    let cols = 10;//backgroundImageWholeInfo.width /backgroundImageWholeInfo.tileSize; 

    // ------------------------------------------------------------------
    //
    // Renders the ViewPort.
    //
    // ------------------------------------------------------------------
    // let tileFile = numberPad((tileY * numberX + tileX), 4);//File to generate the fileName
    // let tileSource = rootName + tileFile + '.jpg';
    // let tileKey = rootKey + '-' + tileFile;

    that.render = function(model, texture) {
        graphics.saveContext();

        // let tileX = Math.floor(model.position.x);
        // let tileY = Math.floor(model.position.y);
        // let key = rootKey + '-' + HelperFunctions.numberPad(tileY*cols+tileX,4);
        // let upperLeftTile = {
        //     image : MyGame.assets[key],
        //     imageCorner : {x:(model.position.x - tileX) * tileSize ,    //The upperLeft Corner of the clip from image in pixels
        //         y:(model.position.y - tileY) * tileSize},  
        //     imageSize : {width:tileSize - (model.position.x - tileX) * tileSize,  //The size of the clip in pixels
        //         height:tileSize - (model.position.y - tileY) * tileSize},
        //     canvasCorner: {x:0,y:0},                                    //upper left tile always starts at 0,0 on Canvas
        //     canvasSize: { width:(1 - (model.position.x - tileX)) * 500, height:(1 - (model.position.y - tileY)) * 500}


        // }
        // graphics.drawSubTexture(upperLeftTile.image,
        //     upperLeftTile.imageCorner,
        //     upperLeftTile.imageSize,
        //     upperLeftTile.canvasCorner,
        //     upperLeftTile.canvasSize);

        // tilesToRender.push(upperLeftTile);


        // //Need to render 1000x500 pixel canvas
        // // let upperLeftTile = {
        // //     imageCorner: {x:model.position.x},
        // //     x: model.position.x,                    //exact x location on tile World Units
        // //     y: model.position.y,                    //exact x location on tile World Units
        // //     xIndex: Math.floor(model.position.x),   // x tile number
        // //     yIndex: Math.floor(model.position.y),   // y tile number
        // // };
        
        // let lowerRightTile = {
        //     x: Math.floor(model.position.x + 2),
        //     y: Math.floor(model.position.y + 1)
        // };
        // tilesToRender.push(lowerRightTile);

        //Now do a double for loop to catch in between tiles

        //for(var i = upperLeftTile.xIndex < lowerRightTile.x)
        
    // Draws a sub-texture to the canvas with the following specification:
    //    image: Image
    //    imageCorner: {x: , y: } upperLeft corner of pixel location on image of where to clip
    //    imageSize: {width:, height: } size of image to clip
    //    canvasCorner: {x: , y: } upperLeft corner of where to place on canvas
    //    canvasSize: {width:, height: } // Size to render to Canvas
        //graphics.drawSubTexture(image,imageCorner,imageSize,canvasCorner,canvasSize);


        // render all objects inside the viewport, using the viewports local position

        let playerSelf = model.objectsWithinViewPort["playerSelf"]; // extract player

        let localPlayerSelf = { // translate to local viewport coordinates
            model: {
                position:{
                    x: model.playerLocalPosition.x,
                    y: model.playerLocalPosition.y
                },
                size: playerSelf.model.size,
                direction: playerSelf.model.direction
            },
            texture: playerSelf.texture
        }

        let localPlayerOthers = []

        let playerOthers = model.objectsWithinViewPort["playerOthers"]; // extracct other players

        for (let index in playerOthers){
            let currPlayerOther = playerOthers[index];
            let currLocalPlayerOther = { // translate each to local viewport coordinates
                model: {
                    state: {
                        position: {
                            x: currPlayerOther.model.state.position.x - model.position.x,
                            y: currPlayerOther.model.state.position.y - model.position.y
                        },
                        direction: currPlayerOther.model.state.direction
                    },
                    size: currPlayerOther.model.size
                },
                texture: currPlayerOther.texture
            }
            localPlayerOthers.push(currLocalPlayerOther);
        }

        // render everything within view port
        renderer.Player.render(localPlayerSelf.model, localPlayerSelf.texture);
        for (let id in localPlayerOthers) {
            let player = localPlayerOthers[id];
            renderer.PlayerRemote.render(player.model, player.texture);
        }

        graphics.restoreContext();
    };

    return that;

}(MyGame.graphics, MyGame.renderer));
