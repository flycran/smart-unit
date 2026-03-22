import { SmartUnit } from "smart-unit";

const time = new SmartUnit(["ms", 1000, "s", 60, "m", 60, "h"]);

console.log(`origin format: ${time.format(1200000)}`);

const { num, unit } = time.getUnit(1200000);

console.log(`translated format: ${num} ${t(unit)}`);

function t(unit: string) {
  return {
    ms: "毫秒",
    s: "秒",
    m: "分",
    h: "小时",
  }[unit];
}
