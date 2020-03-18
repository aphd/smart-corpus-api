export default function delayLoop(fn, delay) {
    return (x, i) => {
        setTimeout(() => {
            fn(x);
        }, i * delay);
    };
}
