MyGame.Menu = (function(){
    let that = {};
    let menuStack = [];

    let screens = document.getElementsByClassName("screen");

    that.MenuItemsEnums = 
    {
        MAINMENU : "main-menu-screen",
        HIGHSCORES: "highscore-screen",
        CONTROLS: "controls-screen",
        CREDITS: "credit-screen",
        INGAME: "canvas-screen",
        PAUSE: "pause-screen",
        GAMEOVER: "game-over"
    };

    that.buttonOnClickHandler = function(btnid){
        switch(btnid){
            case "playgame-button":
                that.Push(that.MenuItemsEnums.INGAME);
                MyGame.main.initialize();
                break;
            case "highscore-button":
                that.Push(that.MenuItemsEnums.HIGHSCORES);
                break;
            case "controls-button":
                that.Push(that.MenuItemsEnums.CONTROLS);
                break;
            case "credit-button":
                that.Push(that.MenuItemsEnums.CREDITS);
                break;
            case "resume-button":
                that.Pop();
                break;
            case "exit-button":
                that.Pop();
                that.Pop();
                break;
            case "exit-game-over":
                that.Pop();
                that.Pop();
                break;
            default:
                break;        
        }         
    }

    that.Push = function(screenToAdd){
        menuStack.push(screenToAdd);
        UpdateVisibleScreen();
    }

    that.Pop = function(){
        if (menuStack.length > 1){
            menuStack.pop();
        }
        UpdateVisibleScreen();
    } 

    that.HandleEscPress = function(){
        if (menuStack[menuStack.length - 1] === MenuItemsEnums.INGAME){
            Push(MenuItemsEnums.PAUSE);
        }
        else if (menuStack[menuStack.length - 1] === MenuItemsEnums.PAUSE){
            //Do nothing, user is required to press resume or exit
            //TODO: Make this not part of it
        }
        else {
            Pop();
        }
    }

    function UpdateVisibleScreen(){
        for (let i = 0; i < screens.length; i++) {
            let screen = screens[i];
            screen.setAttribute("style", "display: none");
            if (screen.id === menuStack[menuStack.length - 1]){
                screen.setAttribute("style", "display: block");
            }
        };
    }

    that.Push(that.MenuItemsEnums.MAINMENU);

    return that;
})()