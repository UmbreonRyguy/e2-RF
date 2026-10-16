export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const queueList = document.querySelector<HTMLOListElement>("#rover-queue")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

//Create a type for the direction of the rover
type Direction = {
  name: string;
  dx: number;
  dy: number;
};

//Create an array of directions for the rover
const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

const GRID_MAX = 4;
let x = 2;
let y = 2;
let direction = 0;

//create the command type
type Command = {
  label: string;
  execute(): void;
};
//create the forward command class
class ForwardCommand implements Command {
  label = "Forward";
  execute() {
    //command uses direction array
    const { dx, dy } = directions[direction];
    x = Math.min(GRID_MAX, Math.max(0, x + dx));
    y = Math.min(GRID_MAX, Math.max(0, y + dy));
  }
}
//create the right command class
class RightCommand implements Command {
  label = "Right";
  execute() {
    direction = (direction + 1) % directions.length;
  }
}

const queue: Command[] = [];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

//Function to render the queue of commands
function renderQueue() {
  const items = queue.map((command) => {
    const item = document.createElement("li");
    item.textContent = command.label;
    return item;
  });
  queueList.replaceChildren(...items);
  runButton.disabled = queue.length === 0;
  clearButton.disabled = queue.length === 0;
}

function enqueue(command: Command) {
  queue.push(command);
  renderQueue();
}

//Function to run the queue of commands
function runQueue() {
  while (queue.length > 0) {
    queue.shift()!.execute();
  }
  renderQueue();
  drawRover();
}

function clearQueue() {
  queue.length = 0;
  renderQueue();
}

function reset() {
  x = 2;
  y = 2;
  direction = 0;
  clearQueue();
  drawRover();
}

function bind(selector: string, handler: () => void) {
  document.querySelector<HTMLButtonElement>(selector)!.onclick = handler;
}
//bind buttons to their commands
bind("#rover-forward", () => enqueue(new ForwardCommand()));
bind("#rover-right", () => enqueue(new RightCommand()));
bind("#rover-run", runQueue);
bind("#rover-clear", clearQueue);
bind("#rover-reset", reset);

renderQueue();
drawRover();
