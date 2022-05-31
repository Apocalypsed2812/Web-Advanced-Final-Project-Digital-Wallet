function card(operator) {
    let result = "";
    if (operator == "Viettel") {
        result = "11111";
    }
    if (operator == "Mobifone") {
        result = "22222";
    }
    if (operator == "Vinaphone") {
        result = "33333";
    }

    let temp = new Array()
    for(let i = 0; i < 5; i++){
        result += Math.floor(Math.random() * 10);
    }
    // temp.push(result + "-")
    // console.log("Mảng chính là: ",temp)
    // // console.log("Mảng là:",result)
    // // console.log("Mảng tạm là", result_temp)
    let cards = ""
    result_temp = result.split("-")
    result_temp.forEach(item => {
        cards += item + "-" 
    });
    return cards;
}
module.exports = { card };
