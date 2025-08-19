function factorial(num) {
    if (num< 0) return "no factorial";
    let result = 1;
    for (let i = result + 1; i <= num; i++) {
        result *= i;
    }

    return result;
}

console.log(factorial(0))