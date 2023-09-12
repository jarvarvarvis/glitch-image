export function arraysEqual(a, b) {
    a = Array.isArray(a) ? a : [];
    b = Array.isArray(b) ? b : [];
    return a.length === b.length && a.every((el, ix) => el === b[ix]);
}