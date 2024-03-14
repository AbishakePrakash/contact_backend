const cryptoDigits = require("./storingAlgorithm");

const dataObject = { name: "TRX", amount: 9278027364 }

function toOriginalValue(crypto) {

    if (cryptoDigits(crypto.name) > 10) {

        originalAmount = crypto.amount * 10**(cryptoDigits(crypto.name) - 10)

        return originalAmount

    } else if (cryptoDigits(crypto.name) === 10) {

        return crypto.amount

    } else {
       
        originalAmount = Math.round(crypto.amount / 10**(10-cryptoDigits(crypto.name)));
    
        return originalAmount;
    
    }
}

console.log(
    "Original Amount: ",
    toOriginalValue(dataObject)
);
