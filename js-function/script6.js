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

function perfectInRange(min, max){
    const results = [];
    for (let n = min; n <= max; n++){
        if (isPerfect(n)) results.push(n);
    }
    return results;
}

console.log(perfectInRange(1, 500)); 