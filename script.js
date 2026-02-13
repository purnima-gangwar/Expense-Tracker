const search = document.getElementById("search");
const category = document.getElementById("category");
const balance = document.getElementById("balance");
const list = document.getElementById("list");
const form = document.getElementById("expense-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const chartCanvas = document.getElementById("chart");
let chart;

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter values");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
    date: new Date().toLocaleDateString()
};


  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = "";
  amount.value = "";
});

function addTransaction(transaction) {
  const li = document.createElement("li");

  li.classList.add(
    transaction.amount < 0 ? "expense-item" : "income-item"
  );

  li.innerHTML = `
    <div>
      <strong>${transaction.text}</strong> (₹${transaction.amount})<br>
      <small>${transaction.category} | ${transaction.date}</small>
    </div>

    <button onclick="removeTransaction(${transaction.id})">X</button>
  `;

  list.appendChild(li);
}


function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateBalance() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0);

  const income = amounts
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);

  const expense = amounts
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0) * -1;

  balance.innerText = total;
  incomeEl.innerText = income;
  expenseEl.innerText = expense;
  updateChart(income, expense);

}



function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransaction);
  updateBalance();
}
function exportData() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let csv = "Title,Amount,Type\n";

    transactions.forEach(t => {
        let type = t.amount > 0 ? "Income" : "Expense";
        csv += `${t.text},${t.amount},${type}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "expense_report.csv";
    a.click();
}


function updateChart(income, expense) {

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["green", "red"]
      }]
    }
  });
}

document.getElementById("darkBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});



init();
search.addEventListener("input", function () {
  const value = search.value.toLowerCase();

  const filtered = transactions.filter(t =>
    t.text.toLowerCase().includes(value)
  );

  list.innerHTML = "";
  filtered.forEach(addTransaction);
});

