//Declare all elements for the bank container
const balance = document.getElementById("balance");
const getALoanButton = document.getElementById("getALoanButton");
const outstandingLoan = document.getElementById("outstandingLoan");

//Declare all elements for the work container
const pay = document.getElementById("pay");
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const repayLoanButton = document.getElementById("repayButton");

//Declare all elements for the laptop container
const laptops = document.getElementById("laptops");
const features = document.getElementById("features");
const featureList = document.getElementById("featureList");

//Declare all elements for the buy laptop container
const laptopType = document.getElementById("laptopType");
const description = document.getElementById("description");
const price = document.getElementById("price");
const img = document.getElementById("img");
const buyLaptopButton = document.getElementById("buyNowButton");

//Declare everything that is needed for the program
let totalBalance = 0.0;
let totalPay = 0.0;
let totalOutstandingLoan = 0.0;
let hasBankLoan = false;
let needsToBuyLaptopToTakeLoan = false;
let laptopsList = [];
let currentLaptop = [];
// Fetching the data everytime the site is reloaded. 
fetchDataAsyc();

// Fetching data and setting data when starting/realoding the site. 
async function fetchDataAsyc(){
    try {
        const response = await fetch("https://noroff-komputer-store-api.herokuapp.com/computers");
        const data = await response.json()
        laptopsList = data;
        addLaptopsListToDropDown(laptopsList);
        currentLaptop = laptopsList[0];
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

//Adding laptops to the dropdown, calling addLapopToDropDown
//to add each laptop.
//Takes in a list of laptop objects.
const addLaptopsListToDropDown = (laptopsList) => {
    laptopsList.forEach(x => addLaptopToDropDown(x));
}

//Taking in a laptop.
//Adds each laptop as an optin to the dropdown.
const addLaptopToDropDown = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptops.appendChild(laptopElement);
}

//Updating values based on computer selected in the dropdown.
const selectedLaptop = e => {
    const selectedLaptop = laptopsList[e.target.selectedIndex];
    featureList.innerText = "";
    currentLaptop = selectedLaptop;
    createFeatureList(selectedLaptop.specs);
    updateCurrentComputer(selectedLaptop);
} 

//Creates the feature list to show specs for a chosen laptop.
//Calls addFeature to add every feature.
//Takes in a list of strings, the specs list in the laptop object,
const createFeatureList = (featureList) => {
    featureList.forEach(x => addFeatureToList(x))
}

//Takes in a string and creating a li element and adds it to the ul. 
const addFeatureToList = (feature) => {
    const featureElement = document.createElement("li");
    featureElement.appendChild(document.createTextNode(feature));
    featureList.appendChild(featureElement);
}

//Updating all the values for the chosen laptop in the dropdown. 
const updateCurrentComputer = (laptop) => {
    laptopType.innerText = laptop.title;
    price.innerText = `Price: ${laptop.price}`;
    description.innerText =  laptop.description;
    img.src = `https://noroff-komputer-store-api.herokuapp.com/${laptop.image}`;
}

//If an images not is found, sets a default image. 
const imageNotFound = (image) => {
    image.onerror = "";
    img.src="https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png";
    return true;
} 

//Gets a loan. Check if user is allowed to take a loan, if the 
// user is allowed, loan gets granted, else an alert will pop up. 
const getALoan = () => {
    if(hasBankLoan){
        alert("You already got a loan.");
    }
    else if(needsToBuyLaptopToTakeLoan){
        alert("You need to buy a laptop before taking another loan.")
    }
    else 
    {
        const loan = parseFloat(prompt("Enter loan amount: "));
        if (loan <= totalBalance*2){
            outstandingLoan.style.display = "block";
            repayLoanButton.style.display = "block";
            totalOutstandingLoan = loan;
            totalBalance += loan;
            hasBankLoan = true;
            needsToBuyLaptopToTakeLoan = true;
            updateOutstandingLoanValue();
            updateBalanceValue();
        }
        else 
        {
            alert("To low balance to take that loan.")
        }
    }
}

//Repays the loan. Takes money from the pay account and 
// pays of the outstanding loan. 
const repayLoan = () => {
    if(hasBankLoan){
        totalOutstandingLoan -= totalPay;
        totalPay = 0;
        if(totalOutstandingLoan <= 0){
            totalPay += -totalOutstandingLoan;
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

//Pay salary when working. 
const paySalary = () => {
    totalPay+=100;
    updatePayValue();
}

//Transfer money to the balance account from the pay account.
//If user has loan, take 10% to pay of a little of the outstaning loan. 
//Then updating all the values. 
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

//Buying a laptop. 
//If balance is to low, a alert will pop up.
//Else buy the computer and update values. 
const buyLaptop = () => {
    if(totalBalance < currentLaptop.price){
        alert("To low balance to buy this laptop");
    }
    else 
    {
        totalBalance -= currentLaptop.price;
        needsToBuyLaptopToTakeLoan = false;
        alert(`You now own the ${currentLaptop.title} laptop`);
        updateBalanceValue();
    }
}

//Updating pay account value.
function updatePayValue(){
    pay.innerText = `Pay: ${totalPay}`;
}

//Updating balance account value.
function updateBalanceValue(){
    balance.innerText = `Balance: ${totalBalance}`;
}

//Updating outstanding loan account value.
function updateOutstandingLoanValue(){
    outstandingLoan.innerText = `Oustanding Loan: ${totalOutstandingLoan}`;
}

//Adding all events needed and sending in the curresponding function. 
getALoanButton.addEventListener("click",getALoan);
workButton.addEventListener("click",paySalary);
bankButton.addEventListener("click",transerPayToBalance);
repayLoanButton.addEventListener("click",repayLoan);
laptops.addEventListener("change",selectedLaptop);
buyLaptopButton.addEventListener("click",buyLaptop);

