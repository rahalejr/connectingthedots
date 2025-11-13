import fs from "fs";

function parse(path) {
  const text = fs.readFileSync(path, "utf8").trim();

  return text
    .split("\n")
    .slice(1) // skip header row
    .map(line => {
      const parts = line.split(",").map(s => s.replace(/"/g, "").trim());
      const x = Number(parts[1]); // second column
      const y = Number(parts[2]); // third column
      return { x, y };
    })
    .filter(p => !isNaN(p.x) && !isNaN(p.y));
}

const human = parse("human.csv");
const volcanic = parse("volcanic.csv");
const solar = parse("solar.csv");
const global = parse("global.csv");

const rough_left = parse("rough_left.csv");
const rough_right = parse("rough_right.csv")
const smooth_left = parse("smooth_left.csv");
const smooth_right = parse("smooth_right.csv")
const generic = parse("generic.csv")

const output = `
export const human = ${JSON.stringify(human, null, 2)};
export const volcanic = ${JSON.stringify(volcanic, null, 2)};
export const solar = ${JSON.stringify(solar, null, 2)};
export const global = ${JSON.stringify(global, null, 2)};
export const rough_left = ${JSON.stringify(rough_left, null, 2)};
export const rough_right = ${JSON.stringify(rough_right, null, 2)};
export const smooth_left = ${JSON.stringify(smooth_left, null, 2)};
export const smooth_right = ${JSON.stringify(smooth_right, null, 2)};
export const generic = ${JSON.stringify(generic, null, 2)}
`;

fs.writeFileSync("climate_data.js", output);
