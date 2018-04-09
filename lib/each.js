export default function (xs, f) {
    for (let i = 0; i < xs.length; i += 1) {
        f(xs[i], i);
    }
}
