function area(length, width){

    if (typeof length!== "number"){
        return "invalid input";
    }

    if (typeof width === "undefined"){
        return length*length;
    }

    if (typeof width === "number"){
        return length * width;
    }
    return "invalid input";
}

console.log(area(5,10));
console.log(area(7));