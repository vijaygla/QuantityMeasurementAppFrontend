const UnitConverter = {
    length: {
        units: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            mile: 1609.34,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        type: 'ratio'
    },
    weight: {
        units: {
            gram: 1,
            kilogram: 1000,
            milligram: 0.001,
            tonne: 1000000,
            pound: 453.592,
            ounce: 28.3495
        },
        type: 'ratio'
    },
    volume: {
        units: {
            liter: 1,
            milliliter: 0.001,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.24,
            fluidOunce: 0.0295735
        },
        type: 'ratio'
    },
    temperature: {
        units: {
            celsius: 'C',
            fahrenheit: 'F',
            kelvin: 'K'
        },
        type: 'temperature'
    }
};

let currentType = "length";
let currentAction = "comparison";

const unit1Select = document.getElementById("unit1");
const unit2Select = document.getElementById("unit2");
const value1Input = document.getElementById("value1");
const value2Input = document.getElementById("value2");
const resultDisplay = document.getElementById("result");
const calculateBtn = document.getElementById("calculateBtn");
const swapBtn = document.getElementById("swapBtn");

// Initialize
function init() {
    loadUnits(currentType);
    setupEventListeners();
}

function loadUnits(type) {
    const units = Object.keys(UnitConverter[type].units);
    unit1Select.innerHTML = "";
    unit2Select.innerHTML = "";

    units.forEach(unit => {
        const opt1 = document.createElement("option");
        opt1.value = unit;
        opt1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        unit1Select.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = unit;
        opt2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        unit2Select.appendChild(opt2);
    });
    
    // Default second unit to something else if possible
    if (units.length > 1) {
        unit2Select.selectedIndex = 1;
    }
}

function swapUnits() {
    const temp = unit1Select.value;
    unit1Select.value = unit2Select.value;
    unit2Select.value = temp;
    calculate();
}

function setupEventListeners() {
    // Type Selection
    document.querySelectorAll(".type-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentType = btn.dataset.type;
            loadUnits(currentType);
            updateUIForAction();
            clearResult();
        });
    });

    // Action Selection
    document.querySelectorAll(".action-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".action-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentAction = btn.dataset.action;
            updateUIForAction();
            clearResult();
        });
    });

    calculateBtn.addEventListener("click", calculate);
    if (swapBtn) swapBtn.addEventListener("click", swapUnits);
    
    // Auto-calculate on input change
    [value1Input, value2Input, unit1Select, unit2Select].forEach(el => {
        el.addEventListener("input", () => {
            if (value1Input.value !== "") {
                calculate();
            } else {
                clearResult();
            }
        });
    });
}

function updateUIForAction() {
    if (currentAction === "conversion") {
        value2Input.disabled = true;
        value2Input.placeholder = "Result";
        value2Input.value = "";
    } else {
        value2Input.disabled = false;
        value2Input.placeholder = "0.00";
    }
}

function clearResult() {
    resultDisplay.innerText = "Waiting for input...";
    if (currentAction === "conversion") value2Input.value = "";
}

function calculate() {
    const v1 = parseFloat(value1Input.value);
    const v2 = parseFloat(value2Input.value);
    const u1 = unit1Select.value;
    const u2 = unit2Select.value;

    if (isNaN(v1) && currentAction !== "comparison") return;
    if (isNaN(v1) && isNaN(v2)) return;

    try {
        let resultValue = "";
        const typeInfo = UnitConverter[currentType];

        if (currentAction === "comparison") {
            if (isNaN(v1) || isNaN(v2)) {
                resultDisplay.innerText = "Enter both values to compare";
                return;
            }
            const base1 = convertToBase(v1, u1, currentType);
            const base2 = convertToBase(v2, u2, currentType);

            if (Math.abs(base1 - base2) < 0.000001) resultValue = "Both are Equal";
            else if (base1 > base2) resultValue = "Value 1 is Greater";
            else resultValue = "Value 2 is Greater";
        } 
        else if (currentAction === "conversion") {
            if (isNaN(v1)) return;
            const base = convertToBase(v1, u1, currentType);
            const converted = convertFromBase(base, u2, currentType);
            resultValue = `${v1} ${u1} = ${formatNumber(converted)} ${u2}`;
            value2Input.value = formatNumber(converted);
        } 
        else if (currentAction === "arithmetic") {
            if (isNaN(v1) || isNaN(v2)) {
                resultDisplay.innerText = "Enter both values to add";
                return;
            }
            if (currentType === "temperature") {
                resultValue = "Addition not applicable for Temperature";
            } else {
                const base1 = convertToBase(v1, u1, currentType);
                const base2 = convertToBase(v2, u2, currentType);
                const sumBase = base1 + base2;
                const finalSum = convertFromBase(sumBase, u1, currentType);
                resultValue = `Total: ${formatNumber(finalSum)} ${u1}`;
            }
        }

        resultDisplay.innerText = resultValue;
        animateResult();

    } catch (error) {
        console.error(error);
        resultDisplay.innerText = "Calculation Error";
    }
}

function convertToBase(value, unit, type) {
    const info = UnitConverter[type];
    if (info.type === 'ratio') {
        return value * info.units[unit];
    } else if (info.type === 'temperature') {
        if (unit === 'celsius') return value;
        if (unit === 'fahrenheit') return (value - 32) * 5 / 9;
        if (unit === 'kelvin') return value - 273.15;
    }
    return value;
}

function convertFromBase(baseValue, unit, type) {
    const info = UnitConverter[type];
    if (info.type === 'ratio') {
        return baseValue / info.units[unit];
    } else if (info.type === 'temperature') {
        if (unit === 'celsius') return baseValue;
        if (unit === 'fahrenheit') return (baseValue * 9 / 5) + 32;
        if (unit === 'kelvin') return baseValue + 273.15;
    }
    return baseValue;
}

function formatNumber(num) {
    if (Math.abs(num) < 0.000001 && num !== 0) return num.toExponential(4);
    return parseFloat(num.toFixed(4));
}

function animateResult() {
    resultDisplay.style.transform = "scale(1.1)";
    resultDisplay.style.transition = "transform 0.2s ease";
    setTimeout(() => {
        resultDisplay.style.transform = "scale(1)";
    }, 200);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
