'use strict';

// src/utils.ts
var getDigit = (n, base2, isDecimal = false) => {
  var _a, _b;
  return (_b = (_a = n.toString(base2).split(".")[Number(isDecimal)]) == null ? void 0 : _a.length) != null ? _b : 0;
};
var parseFloat = (string, radix = 10) => {
  string = `${string || "0"}.`;
  const [integer, decimal] = string.split(".");
  const int = parseInt(integer || "0", radix);
  const float = parseInt(decimal || "0", radix) / Math.pow(radix, decimal.length);
  return int + float;
};
var complementBase = (n, base2, digit2 = void 0) => Math.pow(base2, digit2 ? digit2 - getDigit(n, base2, true) : getDigit(n, base2)) - n;
var complementBaseM1 = (n, base2, digit2 = void 0) => complementBase(n, base2, digit2) - Math.pow(base2, -getDigit(n, base2, true));

// src/index.ts
var content = document.getElementById("content");
var modeButtons = content == null ? void 0 : content.children[0].children;
var numberInputs = content == null ? void 0 : content.children[1].children;
var blockOutput = content == null ? void 0 : content.children[2].children;
numberInputs[0].children[1];
numberInputs[1].children[1];
var inputA = numberInputs[2].children[1];
var inputB = numberInputs[3].children[1];
var outputMode = blockOutput[0];
var outputBase = blockOutput[1];
var outputDigit = blockOutput[2];
var outputResult = blockOutput[3];
var mode = 0;
var base = 2;
var digit = 4;
var changeMode = (target) => {
  modeButtons[mode].classList.toggle("active");
  mode = target;
  modeButtons[target].classList.toggle("active");
  outputMode.innerHTML = ["Sign and Magnitude", "Base-1 Complement", "Base Complement"][target];
  if (!(mode === 0)) {
    inputA.value = inputA.value.replace("-", "");
    inputB.value = inputB.value.replace("-", "");
  }
  calculate();
};
var changeBase = (target) => {
  base = Number(target.value);
  outputBase.innerHTML = `Base ${base}`;
  inputA.value = "";
  inputB.value = "";
  calculate();
};
var changeDigit = (target) => {
  digit = Number(target.value);
  outputDigit.innerHTML = `${digit} Digit`;
  calculate();
};
var toUpper = (target) => {
  const pos = target.selectionStart;
  target.value = target.value.toUpperCase();
  target.setSelectionRange(pos, pos);
  calculate();
};
var checkInput = (event) => {
  const target = event.target;
  if (event.key.length === 1) {
    if (/[A-Za-z0-9]/.test(event.key)) {
      const keyCode = event.key.toUpperCase().charCodeAt(0);
      if (keyCode < 48 + base && keyCode >= 48 || base > 10 && keyCode >= 65 && keyCode < 65 + base - 10) {
        return true;
      }
    } else if (event.key === ".") {
      if (target.value.includes(".")) {
        const pos = (target.selectionStart || 0) + Number(target.value.indexOf(".") >= (target.selectionStart || 0)) - 1;
        target.value = target.value.replace(".", "");
        target.setSelectionRange(pos, pos);
      }
      return true;
    } else if (event.key === "+" && target.value.startsWith("-")) {
      const pos = (target.selectionStart || 1) - 1;
      target.value = target.value.slice(1);
      target.setSelectionRange(pos, pos);
      calculate();
    } else if (mode === 0 && event.key === "-" && !target.value.startsWith("-")) {
      const pos = (target.selectionStart || 0) + 1;
      target.value = `-${target.value}`;
      target.setSelectionRange(pos, pos);
      calculate();
    }
    return false;
  }
  return true;
};
var calculate = () => {
  const logDebugData = () => {
    console.log(
      "----------------------------- Data -----------------------------\n",
      "M B D       :",
      mode,
      base,
      digit,
      "\n",
      "Original    :",
      isNegativeA,
      stringA,
      isNegativeB,
      stringB,
      "\n",
      "Parsed      :",
      numberA.toFormatString(),
      numberB.toFormatString(),
      "\n",
      "ComplementM1:",
      complementBaseM1(numberA, base, digit).toFormatString(),
      complementBaseM1(numberB, base, digit).toFormatString(),
      "\n",
      "Complement  :",
      complementBase(numberA, base, digit).toFormatString().slice(-digit),
      complementBase(numberB, base, digit).toFormatString().slice(-digit),
      "\n----------------------------------------------------------------"
    );
  };
  const case1 = () => {
    console.log("case 1");
    sign = isNegativeA ? "-" : "";
    result = numberA + numberB;
    if (result.toString(base).length > digit)
      isOverflow = true;
  };
  const case2 = () => {
    console.log("case 2");
    let sum = 0;
    if (isNegativeA)
      sum = numberA + complementBaseM1(numberB, base, digit);
    else
      sum = complementBaseM1(numberA, base, digit) + numberB;
    const sumString = sum.toString(base);
    if (sumString.length > digit) {
      const res = parseFloat(sumString.slice(1), base);
      const eac = parseFloat(sumString[0]);
      console.log("EAC:", res.toFormatString(), eac, (res + eac).toFormatString());
      sign = "-";
      result = res + eac;
    } else {
      result = complementBaseM1(sum, base, digit);
    }
  };
  const case3 = () => {
    console.log("case 3");
    result = numberA + numberB;
    if (result.toFormatString()[0] === "1") {
      isOverflow = true;
    }
  };
  const case4 = () => {
    console.log("case 4");
    const sum = numberA + numberB;
    const sumString = sum.toString(base);
    const res = parseFloat(sumString.slice(1), base);
    const eac = parseFloat(sumString[0]);
    console.log("EAC:", res.toFormatString(), eac, (res + eac).toFormatString());
    result = res + eac;
    if (result.toFormatString()[0] === "0") {
      isOverflow = true;
    }
  };
  const case5 = () => {
    console.log("case 5");
    result = numberA + numberB;
    const sumString = result.toString(base);
    if (sumString.length > digit) {
      const res = parseFloat(sumString.slice(1), base);
      const eac = parseFloat(sumString[0]);
      console.log("EAC:", res.toFormatString(), eac, (res + eac).toFormatString());
      result = res + eac;
    }
  };
  const case6 = () => {
    console.log("case 6");
    result = parseFloat((numberA + numberB).toString(base).slice(1), base);
    if (result.toFormatString()[0] === "0") {
      isOverflow = true;
    }
  };
  const case7 = () => {
    console.log("case 7");
    result = numberA + numberB;
    const sumString = result.toString(base);
    if (sumString.length > digit) {
      result = parseFloat(sumString.slice(1), base);
    }
  };
  const isNegativeA = inputA.value.startsWith("-");
  const isNegativeB = inputB.value.startsWith("-");
  const stringA = (isNegativeA ? inputA.value.slice(1) : inputA.value).padStart(digit, "0");
  const stringB = (isNegativeB ? inputB.value.slice(1) : inputB.value).padStart(digit, "0");
  if (stringA.length - Number(stringA.includes(".")) > digit || stringB.length - Number(stringA.includes(".")) > digit) {
    outputResult.style.color = "red";
    outputResult.innerHTML = "Invalid input digit";
    return;
  }
  const numberA = parseFloat(stringA, base);
  const numberB = parseFloat(stringB, base);
  logDebugData();
  let isOverflow = false;
  let sign = "";
  let result = 0;
  if (mode === 0) {
    if (isNegativeA === isNegativeB)
      case1();
    else
      case2();
  } else {
    const baseM1 = (base - 1).toString(36).toUpperCase();
    if (!["0", baseM1].includes(stringA[0]) || !["0", baseM1].includes(stringB[0])) {
      outputResult.style.color = "red";
      outputResult.innerHTML = "Invalid input MSB";
      return;
    }
    if (mode === 1) {
      if (stringA.startsWith("0") && stringB.startsWith("0"))
        case3();
      else if (stringA.startsWith(baseM1) && stringB.startsWith(baseM1))
        case4();
      else
        case5();
    } else if (mode === 2) {
      if (stringA.startsWith("0") && stringB.startsWith("0"))
        case3();
      else if (stringA.startsWith(baseM1) && stringB.startsWith(baseM1))
        case6();
      else
        case7();
    }
  }
  if (isOverflow) {
    outputResult.style.color = "red";
    outputResult.innerHTML = "Overflow";
  } else {
    outputResult.style.color = "lime";
    outputResult.innerHTML = `${sign}${result.toFormatString()}` || "&nbsp;";
  }
};
Number.prototype.toFormatString = function() {
  const numString = this.toString(base);
  return numString.padStart(digit + Number(numString.includes(".")), "0").toUpperCase();
};
window.changeMode = changeMode;
window.changeBase = changeBase;
window.changeDigit = changeDigit;
window.toUpper = toUpper;
window.checkInput = checkInput;
window.calculate = calculate;
calculate();
