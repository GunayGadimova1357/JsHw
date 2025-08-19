function isPerfect(num){
    if (num <= 1) return false;

    let sum = 1; 
    for (let i = 2; i <= num / 2; i++) {
        if (num % i === 0) {  
            sum += i;
        }
    }

    return sum === num;
}
console.log(isPerfect(6));