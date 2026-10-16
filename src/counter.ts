export {};

//create an interface for the shield snapshot
interface ShieldSnapshot {
  readonly charge: number;
  readonly capacity: number;
  readonly missing: number;
}

const CAPACITY = 10;

//function to make a shield snapshot
function makeSnapshot(charge: number, capacity: number): ShieldSnapshot {
  const bounded = Math.max(0, Math.min(capacity, charge));
  return { charge: bounded, capacity, missing: capacity - bounded };
}


const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

let snapshot: ShieldSnapshot = makeSnapshot(0, CAPACITY);
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

//function to render the stats in the panel
function drawMeter(s: ShieldSnapshot): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < s.capacity; i++) {
    ctx.fillStyle = i < s.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${s.charge} / ${s.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${s.charge} / ${s.capacity}`;
}
function renderStats(s: ShieldSnapshot): void {
  if (!panel) return;
  panel.textContent = `Shield charge: ${s.charge} · Missing charge: ${s.missing}`;
}

function deliverToPanel(s: ShieldSnapshot): void {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(s);
}

function setCount(next: number): void {
  const nextSnapshot = makeSnapshot(next, CAPACITY);
  if (nextSnapshot.charge === snapshot.charge) return;
  snapshot = nextSnapshot;
  drawMeter(snapshot);
  if (panel) deliverToPanel(snapshot);
}


document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(snapshot.charge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(snapshot.charge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(snapshot);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(snapshot);
