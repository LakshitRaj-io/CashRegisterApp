let total = 0;

function addItem() {
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const qty = parseInt(document.getElementById("itemQty").value);

  if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0) {
    alert("Please enter a valid item, price, and quantity.");
    return;
  }

  const cost = price * qty;
  total += cost;

  const list = document.getElementById("billList");
  const item = document.createElement("p");
  item.textContent = `${name} x${qty} @ ₹${price.toFixed(2)} = ₹${cost.toFixed(2)}`;
  list.appendChild(item);

  document.getElementById("totalAmount").textContent = total.toFixed(2);

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemQty").value = 1;

  calculateChange();
}

function onPaymentChange() {
  const modes = document.getElementsByName("payment");
  const cashDiv = document.getElementById("cashSection");

  const selected = Array.from(modes).find(mode => mode.checked);
  cashDiv.style.display = selected.value === "Cash" ? "block" : "none";

  if (selected.value !== "Cash") {
    document.getElementById("cashGiven").value = "";
    document.getElementById("changeOutput").textContent = "";
  } else {
    calculateChange();
  }
}

function calculateChange() {
  const cashVal = document.getElementById("cashGiven").value;
  const changeOutput = document.getElementById("changeOutput");

  if (!cashVal) {
    changeOutput.textContent = "";
    return;
  }

  const cash = parseFloat(cashVal);
  if (isNaN(cash)) {
    changeOutput.textContent = "";
    return;
  }

  const change = cash - total;
  if (change < 0) {
    changeOutput.textContent = `⚠️ ₹${Math.abs(change).toFixed(2)} still owed.`;
    changeOutput.style.color = "#c0392b";
  } else {
    changeOutput.textContent = `✅ Return ₹${change.toFixed(2)} to customer.`;
    changeOutput.style.color = "#1e8449";
  }
  
}
function printBill() {
  const selectedMode = document.querySelector('input[name="payment"]:checked');
  const paymentText = selectedMode ? selectedMode.value : "N/A";

  let paymentSummary = `Payment Mode: ${paymentText}`;
  if (paymentText === "Cash") {
    const cash = parseFloat(document.getElementById("cashGiven").value || 0);
    const change = (cash - total).toFixed(2);
    paymentSummary += ` | Cash Given: ₹${cash.toFixed(2)} | Change Returned: ₹${change >= 0 ? change : "0.00"}`;
  }

  const now = new Date();
  const formattedTime = now.toLocaleString();
  document.getElementById("paymentSummary").textContent = paymentSummary;
  document.getElementById("timestamp").textContent = `🕒 Printed on: ${formattedTime}`;

  // ✅ Get only the inner content (NO double border!)
  const rawContent = document.querySelector('.receipt-box').innerHTML;

  const printWindow = window.open("", "", "width=400,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', sans-serif;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .receipt-box {
            width: 340px;
            padding: 24px;
            border: 1px dashed #444;
            border-radius: 10px;
            text-align: center;
            box-sizing: border-box;
          }
          h2, h3, p {
            margin: 6px 0;
          }
          #billList p {
            text-align: left;
            margin: 4px 0;
            padding-left: 10px;
          }
          hr {
            margin: 10px 0;
            border: none;
            border-top: 1px dashed #aaa;
          }
          .thankyou p {
            font-style: italic;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          ${rawContent}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}