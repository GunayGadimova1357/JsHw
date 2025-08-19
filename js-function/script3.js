function combineNums(num1, num2, num3) {

    function isDigit(num){
        return typeof num === "number" && Number.isInteger(num) && num>=0 && num<=9;
    }

    if (num1 === 0) return "first num cannot be zero";
    
    if (isDigit(num1) && isDigit(num2) && isDigit(num3)){
        return num1*100 +num2*10 +num3;
    }
    return "only digits"
}

console.log(combineNums(1,4,9))
console.log(combineNums(0,3,4))
console.log(combineNums(1,13,2))