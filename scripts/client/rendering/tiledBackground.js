MyGame.renderer.TiledBackground = (function(graphics) {
    'use strict';
    let that = {};

    let rootKey = 'background';
    let backgroundImageWholeInfo = MyGame.assets[rootKey];//has width, height, and tileSize
    let tileSize = backgroundImageWholeInfo.tileSize;

    that.render = function(viewPortPosition){
        let xMax = 2;
        let yMax = 1;
        let xOffset = 0;
        let yOffset = 0;

        while(xOffset < xMax){
            yOffset = 0;
            while(yOffset < yMax){
                let tileX = Math.floor(viewPortPosition.x + xOffset);
                let tileY = Math.floor(viewPortPosition.y + yOffset);
                let xPositionWithOffset = viewPortPosition.x + xOffset;
                let yPositionWithOffset = viewPortPosition.y + yOffset;
                let key = rootKey + '-' + HelperFunctions.numberPad(tileY * 10 + tileX, 4); // gets the key to the specific image to render

                let tileToRender = {
                    image: MyGame.assets[key],
                    imageCorner: {
                        x: (xPositionWithOffset - tileX) * tileSize, 
                        y: (yPositionWithOffset - tileY) * tileSize 
                    },
                    imageSize: {
                        width: tileSize - ((xPositionWithOffset - tileX) * tileSize),  //The size of the clip in pixels
                        height: tileSize - ((yPositionWithOffset - tileY) * tileSize)
                    },
                    canvasCorner: {
                        x: xOffset * 500,
                        y: yOffset * 500
                    },
                    canvasSize: {
                        width: 500 - ((xPositionWithOffset - tileX) * 500),
                        height: 500 - ((yPositionWithOffset - tileY) * 500)
                    }
                }

                yOffset += 1 - (yPositionWithOffset - tileY)

                graphics.drawSubTexture(tileToRender)
            }
            xOffset += 1 - (viewPortPosition.x + xOffset - Math.floor(viewPortPosition.x + xOffset));
        }
    }

    return that;
}(MyGame.graphics));