const balance = document.getElementById("balance");
const getALoanButton = document.getElementById("getALoanButton");

const pay = document.getElementById("pay");
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");

const laptops = document.getElementById("laptops");
const features = document.getElementById("features");

const laptopType = document.getElementById("laptopType");
const description = document.getElementById("description");
const price = document.getElementById("price");
const buyNowButton = document.getElementById("buyKnowButton");

let totalBalance = 0.0;
let totalPay = 0.0;
let outstandingLoan = 0.0;
const laptopsList = [];


const getALoan = () =>{
    const loan = prompt("Enter loan amount: ");
    console.log("Hello");
    
}

getALoanButton.addEventListener("click",getALoan);


