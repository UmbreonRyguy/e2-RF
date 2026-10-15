export {};

type ShiftResult = {
  producerCount: number;
  production: number;
  consumption: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producerCount = 2;

function calculateShift(producerCount: number): ShiftResult {
  const production = producerCount * 3;
  const consumption = 6;
  return {
    producerCount,
    production,
    consumption,
    balance: production - consumption,
  };
}

function drawCanvas({ producerCount, production, consumption }: ShiftResult) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let person = 0; person < 6; person++) {
    ctx.fillStyle = person < producerCount ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + person * 45, 16, 36, 36);
    ctx.fillStyle = person < producerCount ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(person + 1), 31 + person * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producerCount} / 6`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
}

function writeReadout(
  { producerCount, production, consumption, balance }: ShiftResult,
) {
  readout.textContent =
    `Assigned: ${producerCount}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function render() {
  const shift = calculateShift(producerCount);
  drawCanvas(shift);
  writeReadout(shift);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producerCount = Math.max(0, producerCount - 1);
  render();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producerCount = Math.min(6, producerCount + 1);
  render();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producerCount = 2;
    render();
  };
render();