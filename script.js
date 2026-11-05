const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");

const type = document.getElementById("type");
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const note = document.getElementById("note");

const addButton = document.getElementById("addTransaction");
const scrollButton = document.getElementById("scrollToForm");

const defaultTransactions = [
    { id: 1, type: "income", category: "Salary", amount: 2000, date: "2024-05-20", note: "" },
    { id: 2, type: "expense", category: "Groceries", amount: 120, date: "2024-05-19", note: "" },
    { id: 3, type: "expense", category: "Electricity Bill", amount: 80, date: "2024-05-18", note: "" },
    { id: 4, type: "income", category: "Bonus", amount: 500, date: "2024-05-17", note: "" },
    { id: 5, type: "expense", category: "Dinner", amount: 60, date: "2024-05-16", note: "" }
];

let transactions = JSON.parse(localStorage.getItem("transactions"));

if (transactions === null) {
    transactions = defaultTransactions;
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

const recentHeading = Array.from(document.querySelectorAll("h1")).find(function(item) {
    return item.innerText.trim() === "Recent Transactions";
});

const recentBox = recentHeading.parentElement;
const viewButton = recentBox.querySelector("button");

const transactionList = document.createElement("div");
recentBox.insertBefore(transactionList, viewButton);

while (transactionList.previousElementSibling !== recentHeading) {
    transactionList.previousElementSibling.remove();
}

function getIcon(category) {

    if (category === "Salary") return "fa-wallet";
    if (category === "Business") return "fa-briefcase";
    if (category === "Freelance") return "fa-laptop";
    if (category === "Food" || category === "Dinner") return "fa-utensils";
    if (category === "Shopping") return "fa-cart-shopping";
    if (category === "Bills" || category === "Electricity Bill") return "fa-bolt";
    if (category === "Transport") return "fa-car";
    if (category === "Groceries") return "fa-basket-shopping";
    if (category === "Bonus") return "fa-gift";

    return "fa-box";
}

function addTransaction() {

    if (amount.value === "" || Number(amount.value) <= 0 || date.value === "") {
        alert("Please enter valid amount and date");
        return;
    }

    let newTransaction = {
        id: Date.now(),
        type: type.value,
        category: category.value,
        amount: Number(amount.value),
        date: date.value,
        note: note.value
    };

    transactions.push(newTransaction);

    saveData();
    showTransactions();
    calculateTotals();

    amount.value = "";
    date.value = "";
    note.value = "";
}

function showTransactions() {

    transactionList.innerHTML = "";

    transactions.slice().reverse().forEach(function(item) {

        let sign = item.type === "income" ? "+" : "-";
        let color = item.type === "income" ? "text-green-500" : "text-red-500";

        let div = document.createElement("div");

        div.className = "flex justify-between items-center p-4";

        div.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-gray-200 p-3 rounded-full">
                    <i class="fa-solid ${getIcon(item.category)}"></i>
                </div>

                <div>
                    <h1 class="font-bold">${item.category}</h1>
                    <p class="text-gray-400 text-sm">${item.date}</p>
                    <p class="text-gray-400 text-xs">${item.note}</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <h1 class="font-bold ${color}">
                    ${sign}$${item.amount.toFixed(2)}
                </h1>

                <button class="delete-btn text-red-500" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        transactionList.appendChild(div);

    });
}

function calculateTotals() {

    let income = 0;
    let expense = 0;

    transactions.forEach(function(item) {

        if (item.type === "income") {
            income += item.amount;
        } else {
            expense += item.amount;
        }

    });

    totalIncome.innerText = "$" + income.toFixed(2);
    totalExpenses.innerText = "$" + expense.toFixed(2);
    totalBalance.innerText = "$" + (income - expense).toFixed(2);

}

function deleteTransaction(id) {

    transactions = transactions.filter(function(item) {
        return item.id !== id;
    });

    saveData();
    showTransactions();
    calculateTotals();

}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

addButton.addEventListener("click", addTransaction);

transactionList.addEventListener("click", function(event) {

    let button = event.target.closest(".delete-btn");

    if (button) {
        deleteTransaction(Number(button.dataset.id));
    }

});

scrollButton.addEventListener("click", function() {

    document.getElementById("transactionForm").scrollIntoView({
        behavior: "smooth"
    });

});
showTransactions();
calculateTotals();