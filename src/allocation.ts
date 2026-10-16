export {};

//Create a type for the results of the shift
type ShiftResult = {
  producerCount: number;
  production: number;
  consumption: number;
  balance: number;
};
//Create a type for the rows of the bar chart
type BarRow = {
  name: string;
  value: number;
  color: string;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producerCount = 2;
//Function to calculate shift results
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
//Function to create bar rows for the bar chart
function barRows({ production, consumption }: ShiftResult): BarRow[] {
  return [
    { name: "Production", value: production, color: "#27766b" },
    { name: "Consumption", value: consumption, color: "#a44d23" },
  ];
}

//Function to draw the canvas based on the shift results
function drawCanvas(shift: ShiftResult) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let person = 0; person < 6; person++) {
    ctx.fillStyle = person < shift.producerCount ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + person * 45, 16, 36, 36);
    ctx.fillStyle = person < shift.producerCount ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(person + 1), 31 + person * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.producerCount} / 6`, 18, 76);
  barRows(shift).forEach(({ name, value, color }, row) => { //utilizing the barRows function
    const labelY = 102 + row * 52;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${name}: ${value}`, 18, labelY);
    ctx.fillStyle = color;
    ctx.fillRect(18, labelY + 8, value * 14, 20);
  });
}

//write the readout based on the shift results
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
