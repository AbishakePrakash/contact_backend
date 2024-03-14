// const cryptoDigits = {
//     "USDT": 6,
//     "BTC": 8,
//     "EPX": 6,
//     "BNB": 18,
//     "TRX": 6,
//     "ETH": 18,
//     "DOGE": 8,
//     "CLV": 8,
//     "MATIC": 12,
//     "LINK": 8,
//     "GRT": 8,
//     "SHIB": 18,
//     "GRT": 18,
//     "INR": 2,
//     "ACH": 10
// };

function cryptoDigits(crypto) {
    if (crypto === "BNB" || crypto === "ETH" || crypto === "SHIB" || crypto === "GRT") {
        return 18;
    } else if (crypto === "MATIC") {
        return 12;
    } else if (crypto === "ACH") {
        return 10;
    } else if (crypto === "USDT" || crypto === "EPX" || crypto === "TRX") {
        return 6;
    } else if (crypto === "INR") {
        return 2;
    }
    else {
        return 8;
    }
}

module.exports = cryptoDigits;