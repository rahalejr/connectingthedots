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

const output = `
export const human = ${JSON.stringify(human, null, 2)};
export const volcanic = ${JSON.stringify(volcanic, null, 2)};
export const solar = ${JSON.stringify(solar, null, 2)};
export const global = ${JSON.stringify(global, null, 2)};
`;

fs.writeFileSync("climate_data.js", output);
