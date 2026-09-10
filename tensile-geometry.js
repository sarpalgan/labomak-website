// Illustrative motion only: these dimensions do not represent measured test data.
export function tensileState(value) {
  const progress = Math.max(0, Math.min(1, Number(value) || 0));
  const lift = progress * 96;
  const top = 330 - lift;
  const bottom = 440;
  const middle = (top + bottom) / 2;
  const neck = 9 - Math.max(0, (progress - .5) / .5) * 6;
  const gap = Math.max(0, (progress - .88) / .12) * 12;
  const left = `M259 ${top} H301 V${top + 16} C301 ${top + 32} ${280 + neck} ${middle - 30} ${280 + neck} ${middle}`;
  const right = `C${280 - neck} ${middle - 30} 259 ${top + 32} 259 ${top + 16} Z`;
  const upper = gap > 0
    ? `${left.replaceAll(String(middle), String(middle - gap))} l-${neck * .6} -2 l-${neck * .7} 4 L${280 - neck} ${middle - gap} ${right}`
    : `${left} C${280 + neck} ${middle + 30} 301 ${bottom - 32} 301 ${bottom - 16} V${bottom} H259 V${bottom - 16} C259 ${bottom - 32} ${280 - neck} ${middle + 30} ${280 - neck} ${middle} ${right}`;
  const lower = gap > 0
    ? `M${280 - neck} ${middle + gap} l${neck * .7} 2 l${neck * .6} -4 L${280 + neck} ${middle + gap} C${280 + neck} ${middle + 30} 301 ${bottom - 32} 301 ${bottom - 16} V${bottom} H259 V${bottom - 16} C259 ${bottom - 32} ${280 - neck} ${middle + 30} ${280 - neck} ${middle + gap} Z`
    : '';
  return { progress, lift, upper, lower, stage: progress < .2 ? 0 : progress < .58 ? 1 : progress < .88 ? 2 : 3 };
}
