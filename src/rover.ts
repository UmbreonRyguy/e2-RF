export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

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
  execute(): void;
};
//create the forward command class
class ForwardCommand implements Command {
  execute() {
    //command uses direction array
    const { dx, dy } = directions[direction];
    x = Math.min(GRID_MAX, Math.max(0, x + dx));
    y = Math.min(GRID_MAX, Math.max(0, y + dy));
  }
}
//create the right command class
class RightCommand implements Command {
  execute() {
    direction = (direction + 1) % directions.length;
  }
}

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
//run the command and draw the rover
function run(command: Command) {
  command.execute();
  drawRover();
}
//bind the buttons to the commands
function bind(selector: string, command: Command) {
  document.querySelector<HTMLButtonElement>(selector)!.onclick = () =>
    run(command);
}
//bind the buttons to the commands
bind("#rover-forward", new ForwardCommand());
bind("#rover-right", new RightCommand());

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
