import { convertCjsToEsm } from "@anubhav741/cjs_esm";

const examples = {
  paths: `const path = require("node:path");

function assetPath(filename) {
  return path.join("public", "assets", filename);
}

module.exports = { assetPath };`,
  defaults: `const os = require("node:os");

function platformName() {
  return os.platform();
}

module.exports = platformName;`,
  named: `const { basename, extname } = require("node:path");

function describeFile(filename) {
  return [basename(filename), extname(filename)];
}

module.exports = { describeFile };`,
};

const example = document.querySelector("#example");
const source = document.querySelector("#source");
const output = document.querySelector("#output");
const inputLines = document.querySelector("#input-lines");
const outputLines = document.querySelector("#output-lines");
const status = document.querySelector("#status");
const copy = document.querySelector("#copy");

function lineNumbers(code) {
  return code
    .split("\n")
    .map((_, index) => index + 1)
    .join("\n");
}

function render() {
  const input = source.value;
  inputLines.textContent = lineNumbers(input);
  copy.textContent = "Copy output";
  let result = "";
  let message = "Awaiting input";
  let failed = false;
  if (input.trim()) {
    try {
      result = convertCjsToEsm(input);
      message = result === input ? "No changes" : "Converted";
    } catch (error) {
      result = error.message;
      message = "Syntax error";
      failed = true;
    }
  }
  output.textContent = result;
  output.toggleAttribute("data-error", failed);
  outputLines.textContent = result && !failed ? lineNumbers(result) : "";
  outputLines.scrollTop = output.scrollTop;
  status.textContent = message;
  status.classList.toggle("error", failed);
  copy.disabled = failed || !result;
}

function loadExample() {
  source.value = examples[example.value];
  source.scrollTop = 0;
  source.scrollLeft = 0;
  output.scrollTop = 0;
  output.scrollLeft = 0;
  render();
}

source.addEventListener("input", () => {
  example.value = "custom";
  render();
});
source.addEventListener("scroll", () => {
  inputLines.scrollTop = source.scrollTop;
});
output.addEventListener("scroll", () => {
  outputLines.scrollTop = output.scrollTop;
});
example.addEventListener("change", loadExample);
copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copy.textContent = "Copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Output selected for copying";
  }
});

loadExample();
