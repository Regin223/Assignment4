const balance = document.getElementById("balance");
const getALoanButton = document.getElementById("getALoanButton");
const outstandingLoan = document.getElementById("outstandingLoan");


const pay = document.getElementById("pay");
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const repayLoanButton = document.getElementById("repayButton");

const laptops = document.getElementById("laptops");
const features = document.getElementById("features");
const featureList = document.getElementById("featureList");

const laptopType = document.getElementById("laptopType");
const description = document.getElementById("description");
const price = document.getElementById("price");
const img = document.getElementById("img");
const buyNowButton = document.getElementById("buyKnowButton");

let totalBalance = 0.0;
let totalPay = 0.0;
let totalOutstandingLoan = 0.0;
let hasBankLoan = false;
let laptopsList = [];
fetchDataAsyc()

async function fetchDataAsyc(){
    try {
        const response = await fetch("https://noroff-komputer-store-api.herokuapp.com/computers");
        const data = await response.json()
        laptopsList = data;
        addLaptopsListToDropDown(laptopsList);
        laptopsList[0].specs.forEach(x =>  {
            const featureElement = document.createElement("li");
            featureElement.appendChild(document.createTextNode(x));
            featureList.appendChild(featureElement);
        });
        updateCurrentComputer(laptopsList[0]);
        
    }
    catch(error){
        console.log(error);
    }
   
}

const addLaptopsListToDropDown = (laptopsList) => {
    laptopsList.forEach(x => addLaptopToDropDown(x));
}

const addLaptopToDropDown = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptops.appendChild(laptopElement);
}

const selectedLaptop = e => {
    const selectedLaptop = laptopsList[e.target.selectedIndex];
    featureList.innerText = "";
    createFeatureList(selectedLaptop.specs);
    updateCurrentComputer(selectedLaptop);

} 
const createFeatureList = (featureList) => {
    featureList.forEach(x => addFeatureToList(x))

}
const addFeatureToList = (feature) => {
    const featureElement = document.createElement("li");
    featureElement.appendChild(document.createTextNode(feature));
    featureList.appendChild(featureElement);
}

const updateCurrentComputer = (laptop) => {
    price.innerText = `Price: ${laptop.price}`;
    description.innerText =  laptop.description;
    img.src = `https://noroff-komputer-store-api.herokuapp.com/${laptop.image}`;

}

const getALoan = () => {
    const loan = parseFloat(prompt("Enter loan amount: "));
    if (loan <= totalBalance*2 && !hasBankLoan){
        outstandingLoan.style.display = "block";
        repayLoanButton.style.display = "block";
        totalOutstandingLoan = loan;
        hasBankLoan = true;
        updateOutstandingLoanValue();
    }
    else
    {
        alert("To low balance to get the loan or already have a loan");
    }
}

const repayLoan = () => {
    if(hasBankLoan){
        totalOutstandingLoan -= totalPay;
        totalPay = 0;
        if(totalOutstandingLoan <= 0){
            totalBalance += -totalOutstandingLoan;
            totalOutstandingLoan = 0;
            outstandingLoan.style.display = "none";
            repayLoanButton.style.display = "none";
            hasBankLoan = false;
        }
    }
    updateBalanceValue();
    updateOutstandingLoanValue();
    updatePayValue();
}

const paySalary = () => {
    totalPay+=100;
    updatePayValue();
}

const transerPayToBalance = () => {
    
    if(hasBankLoan){
        const tenPercentOfPay = totalPay * 0.1; 
        totalOutstandingLoan -= tenPercentOfPay;
        totalBalance += totalPay - tenPercentOfPay;
        totalPay = 0;
        if(totalOutstandingLoan <= 0){
            totalBalance += -totalOutstandingLoan;
            totalOutstandingLoan = 0;
            hasBankLoan = false;
            outstandingLoan.style.display = "none";
        }
        updatePayValue();
        updateBalanceValue();
        updateOutstandingLoanValue();
    }
    else 
    {
        totalBalance += totalPay;
        totalPay = 0;
        updatePayValue();
        updateBalanceValue();
    }
    
}

function updatePayValue(){
    pay.innerText = `Pay: ${totalPay}`;
}
function updateBalanceValue(){
    balance.innerText = `Balance: ${totalBalance}`;
}
function updateOutstandingLoanValue(){
    outstandingLoan.innerText = `Oustanding Loan: ${totalOutstandingLoan}`;
}


getALoanButton.addEventListener("click",getALoan);
workButton.addEventListener("click",paySalary);
bankButton.addEventListener("click",transerPayToBalance);
repayLoanButton.addEventListener("click",repayLoan);
laptops.addEventListener("change",selectedLaptop);

