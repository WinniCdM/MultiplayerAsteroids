MyGame = {
    input: {},
    components: {},
    renderer: {},
    utilities: {},
    assets: {},
    handlers: {}
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function () {
    'use strict';
    let scriptOrder = [{
            scripts: [
                'menu'
            ],
            message: 'Menu loaded',
            onComplete: null
        }, {
            scripts: [
                'helper/helperFunctions', 
                'helper/queue',
                'helper/random',
            ],
            message: 'Utilities loaded',
            onComplete: null,
        }, {
            scripts: ['input/input'],
            message: 'Input loaded',
            onComplete: null
        }, {
            scripts: [
                'objects/player', 
                'objects/player-remote', 
                'objects/asteroid', 
                'objects/ufo', 
                'objects/missile',
                'objects/powerup',
                'objects/particleSubsystem',
                'objects/particle',
                'objects/hyperspaceBar',
                'objects/minimap',
            ],
            message: 'Object models loaded',
            onComplete: null
        }, {
            scripts: ['objects/viewPort'],
            message: 'ViewPort models loaded',
            onComplete: null
        }, {
            scripts: ['rendering/graphics'],
            message: 'Graphics loaded',
            onComplete: null
        }, {
            scripts: [
                'rendering/player', 
                'rendering/player-remote', 
                'rendering/viewPort', 
                'rendering/tiledBackground',
                'rendering/ufo',
                'rendering/asteroid',
                'rendering/powerup',
                'rendering/missile',
                'rendering/particleSubsystem',
                'rendering/hyperspaceBar',
                'rendering/minimap',
            ],
            message: 'Renderers loaded',
            onComplete: null
        }, {
            scripts: [
                'handlers/asteroidHandler', 
                'handlers/ufoHandler', 
                'handlers/missileHandler',
                'handlers/powerupHandler',
                'handlers/particleHandler',
                'handlers/audioHandler',
                'handlers/scoreHandler',
                'handlers/statusHandler'
            ],
            message: 'Handlers loaded',
            onComplete: null
        }, {
            scripts: ['game'],
            message: 'Gameplay model loaded',
            onComplete: null
        }],
        assetOrder = [{
            key: 'player-self',
            source: 'assets/images/players/playerShip1_blue.png'
        }, {
            key: 'player-other',
            source: 'assets/images/players/playerShip1_red.png'
        }, {
            key: 'asteroid',
            source: 'assets/images/other/asteroid.png'
        }, {
            key: 'ufo-1',
            source: 'assets/images/other/ufo1.png'
        }, {
            key: 'enemy-missile',
            source: 'assets/images/other/enemymissile.png'
        }, {
            key: 'player-missile',
            source: 'assets/images/other/playermissile.png'
        }, {
            key: 'fire',
            source: 'assets/images/other/fire.png'
        }, {
            key: 'blue',
            source: 'assets/images/other/blue.png'
        }, {
            key: 'smoke',
            source: 'assets/images/other/smoke.png'
        }, {
            key: 'white',
            source: 'assets/images/other/white.png'
        }, {
            key: 'green-powerup',
            source: 'assets/images/powerups/green.png'
        }, {
            key: 'blue-powerup',
            source: 'assets/images/powerups/blue.png'
        }, {
            key: 'red-powerup',
            source: 'assets/images/powerups/red.png'
        }, {
            key: 'yellow-powerup',
            source: 'assets/images/powerups/yellow.png'
        }, {
            key: 'enemy-laser',
            source: 'assets/sounds/enemylaser.wav'
        }, {
            key: 'main-music',
            source: 'assets/sounds/mainmusic.mp3'
        }, {
            key: 'laser',
            source: 'assets/sounds/laser.mp3'
        }, {
            key: 'explosion',
            source: 'assets/sounds/Explosion1.mp3'
        }, {
            key: 'asteroid-explosion',
            source: 'assets/sounds/Explosion6.mp3'
        }, {
            key: 'respawn',
            source: 'assets/sounds/respawn.mp3'
        }, {
            key: 'hyperspace',
            source: 'assets/sounds/PowerUp30.mp3'
        },
    ];

        
    //------------------------------------------------------------------
    //
    // Helper function to pad a number with 0s - duplicate of 
    // helperFunctions.js, for preloading
    //
    //------------------------------------------------------------------
    function numberPad(number, padding){
        number += '';
        return number.padStart(padding, '0');
    }

    //------------------------------------------------------------------
    //
    // Loads a tiled image
    //
    //------------------------------------------------------------------
    function prepareTiledImage(assetArray, rootName, rootKey, sizeX, sizeY, tileSize) {
        let numberX = sizeX / tileSize;
        let numberY = sizeY / tileSize;
        //
        // Create an entry in the assets that holds the properties of the tiled image
        MyGame.assets[rootKey] = {
            width: sizeX,
            height: sizeY,
            tileSize: tileSize
        };
        for (let tileY = 0; tileY < numberY; tileY += 1) {
            for (let tileX = 0; tileX < numberX; tileX += 1) {
                let tileFile = numberPad((tileY * numberX + tileX), 4);//File to generate the fileName
                let tileSource = rootName + tileFile + '.jpg';
                let tileKey = rootKey + '-' + tileFile;
                assetArray.push({
                    key: tileKey,
                    source: tileSource
                });
            }
        }
    }


    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'assets/url/asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest(),
            asset = null,
            fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3' || fileExtension === 'wav') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    asset.onload = function () {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('it is all loaded up');
        MyGame.main.initialize();
    }

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    prepareTiledImage(assetOrder, '/assets/images/background/tiles/tiles', 'background', 3840, 3840, 384);
    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('All assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );
}());
