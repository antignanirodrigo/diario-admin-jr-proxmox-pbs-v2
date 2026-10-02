import { readFileSync, writeFileSync } from 'node:fs';

// REJECTED EXPERIMENT (2026-10-02): its generated tails remained visually artificial.
// Do not use for active/commercial boards; draw seamless speech balloons in the base art.
// Turns an oval plus a separate triangular pointer into one continuous outline.
// Usage: node scripts/unify-balloons.mjs source.svg destination.svg
const [, , source, destination] = process.argv;
if (!source || !destination) throw new Error('source.svg destination.svg required');
const round = number => Math.round(number * 10) / 10;
const pattern = /<path d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) Z"\s*\/><ellipse cx="([\d.]+)" cy="([\d.]+)" rx="([\d.]+)" ry="([\d.]+)"\s*\/>/g;
let count = 0;
const changed = readFileSync(source, 'utf8').replace(pattern, (_match, ...values) => {
  const n = values.map(Number);
  const vertices = [[n[0], n[1]], [n[2], n[3]], [n[4], n[5]]];
  const [cx, cy, rx, ry] = n.slice(6);
  let [tipX, tipY] = vertices.reduce((best, point) => {
    const distance = ((point[0] - cx) / rx) ** 2 + ((point[1] - cy) / ry) ** 2;
    return distance > best.distance ? { point, distance } : best;
  }, { point: vertices[0], distance: -1 }).point;
  const originalDx = tipX - cx;
  const originalDy = tipY - cy;
  const originalLength = Math.hypot(originalDx, originalDy);
  const boundaryLength = originalLength / Math.hypot(originalDx / rx, originalDy / ry);
  const cappedLength = Math.min(originalLength, boundaryLength + 70);
  tipX = cx + originalDx * cappedLength / originalLength;
  tipY = cy + originalDy * cappedLength / originalLength;
  const theta = Math.atan2((tipY - cy) / ry, (tipX - cx) / rx);
  const spread = 0.07;
  const before = [cx + rx * Math.cos(theta - spread), cy + ry * Math.sin(theta - spread)];
  const after = [cx + rx * Math.cos(theta + spread), cy + ry * Math.sin(theta + spread)];
  const to = point => point.map(round).join(' ');
  // Long elliptical arc omits only the narrow opening from which the tail grows.
  // Two curves leave that opening tangentially and meet at the speaker anchor.
  const between = (from, to, fraction) => [from[0] + (to[0] - from[0]) * fraction, from[1] + (to[1] - from[1]) * fraction];
  const tip = [tipX, tipY];
  const length = Math.hypot(tipX - cx, tipY - cy);
  const normal = [-(tipY - cy) / length, (tipX - cx) / length];
  const bend = (point, amount) => [point[0] + normal[0] * amount, point[1] + normal[1] * amount];
  const firstNear = bend(between(before, tip, 0.22), -1.5);
  const firstFar = bend(between(before, tip, 0.76), -2.5);
  const secondFar = bend(between(after, tip, 0.76), 2.5);
  const secondNear = bend(between(after, tip, 0.22), 1.5);
  count++;
  return `<path d="M${to(after)} A${rx} ${ry} 0 1 1 ${to(before)} C${to(firstNear)} ${to(firstFar)} ${to(tip)} C${to(secondFar)} ${to(secondNear)} ${to(after)} Z"/>`;
});
if (!count) throw new Error(`No oval/triangle pair found in ${source}`);
writeFileSync(destination, changed);
process.stdout.write(`${count} integrated balloon(s): ${destination}\n`);
