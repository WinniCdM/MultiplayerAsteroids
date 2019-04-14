let HelperFunctions = (function(){
    //------------------------------------------------------------------
    //
    // Helper function to pad a number with 0s
    //
    //------------------------------------------------------------------
    function numberPad(number, padding){
        number += '';
        return number.padStart(padding, '0');
    }

    return {
        numberPad: numberPad
    }
}())