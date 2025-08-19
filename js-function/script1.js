function compareNums(num1, num2){
    if (num1<num2) return -1;
    else if (num1>num2) return 1;
    else return 0;
}

console.log(compareNums(4,5))
console.log(compareNums(5,4))
console.log(compareNums(5,5))