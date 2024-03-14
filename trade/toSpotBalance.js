const cryptoDigits = require("./storingAlgorithm");

const dataObject = { name: "EPX", amount: 7293221 }

function toTenDigits(crypto) {

    if (cryptoDigits(crypto.name) > 10) {

        const spotValue = Math.round(crypto.amount / 10 ** (cryptoDigits(crypto.name) - 10))
        // const spotValue = crypto.amount / 10 ** (cryptoDigits(crypto.name) - 10)
        console.log("A");

        return spotValue;

    } else if (cryptoDigits(crypto.name) === 10) {

        console.log("B");
        return crypto.amount;

    } else {

        // const decimalValue = crypto.amount / 10 ** (cryptoDigits(crypto.name))
        // const spotValue = decimalValue * (10 ** 10)

        const spotValue = crypto.amount * 10 ** (10 - cryptoDigits(crypto.name))


        console.log("C");

        return spotValue;

    };



    // let numberString = String(dataObject.amount);

    // if (numberString.length > 10) {
    //     console.log("Limiting");
    //     numberString = numberString.substring(0, 10)
    // } else if (numberString.length === 10) {

    // } else {
    //     console.log("Extending");
    //     const factor = 10 - numberString.length

    //     for (let i = 0; i < factor; i++) {
    //         numberString += '0';
    //     }
    // }


    // return numberString

}

console.log(
    "10-digit Value: ",
    toTenDigits(dataObject)
);