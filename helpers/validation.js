var colors = require("colors");
exports.validateBuy = function (answer) {
    var isValid = false;
    //Customer Validation
    if (answer.selectedQuantity && !isNaN(answer.selectedQuantity)) {
        isValid = true;
    } else {
        console.log("Quantity must be a number, please try again.".bgWhite.red);
    }
    // Manager Validations
    if(answer.inventory && !isNaN(answer.inventory)) {
        isValid = true;
    } else {
        consocle.log("Quantity must be a number, please try again.".bgWhite.red);   
    }
    //Supervisor Validations

    return isValid
}

function Validation (value) {
    this.value = value;

    this.textValidate = () => {
        
        
        if(this.value.trim() && isNaN(this.value)) {
            return true
        }
        return false;
    }

    this.numberValidate = () => {
        if(isNaN(this.value) === false && this.value.trim()) {
            return true;
        }
        return false;
    }
}

module.exports = Validation;