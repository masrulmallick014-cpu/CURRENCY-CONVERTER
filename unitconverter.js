
const URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const select = document.querySelectorAll(".dropdown select");
const msg = document.querySelector(".msg");

// Dropdowns mein currencies add karna
for (let selec of select) {
    for (let code in countryList) {
        let option = document.createElement("option");

        option.innerText = code;
        option.value = code;

        if (selec.name === "from" && code === "USD") {
            option.selected = true;
        }

        if (selec.name === "to" && code === "INR") {
            option.selected = true;
        }

        selec.appendChild(option);
    }

    // Currency change hone par flag update hoga
    selec.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Flag update karne ka function
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");

    if (img && countryCode) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
};

// Page load hone par flags set karna
updateFlag(fromcurr);
updateFlag(tocurr);

// Convert button
const btn = document.querySelector("button");

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amountInput = document.querySelector("form input");
    let amount = Number(amountInput.value);

    // Amount validation
    if (
        amountInput.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        amount = 1;
        amountInput.value = "1";
    }

    let fromCode = fromcurr.value.toLowerCase();
    let toCode = tocurr.value.toLowerCase();

    // Agar dono currencies same hain
    if (fromCode === toCode) {
        msg.innerText =
            `${amount} ${fromcurr.value} = ${amount.toFixed(2)} ${tocurr.value}`;
        return;
    }

    // API URL
    const url = `${URL}/${fromCode}.json`;

    try {
        msg.innerText = "Please wait...";

        // API se data fetch karna
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Exchange rate nikalna
        const rate = data[fromCode]?.[toCode];

        if (typeof rate !== "number") {
            throw new Error("Exchange rate available nahi hai");
        }

        // Final amount calculate karna
        const finalAmount = amount * rate;

        // Result display karna
        msg.innerText =
            `${amount} ${fromcurr.value} = ${finalAmount.toFixed(2)} ${tocurr.value}`;

    } catch (error) {
        msg.innerText = "Exchange rate fetch nahi ho paya.";
        console.error("Conversion error:", error);
    }
});
