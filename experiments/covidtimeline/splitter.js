let counter = 0;
const split = (available, depth, who) => {
  if (counter % 100000 === 0) {
    console.log(`${who}: ${counter}`)
  }
  counter++;

  if (depth <= 0) {
    return [available];
  }
  return Array(4).fill().map((_, idx) => {
    const value = idx === 3 ? available : Math.random() * available;
    available -= value;
    return split(value, depth - 1, who);
  });
}

onmessage = ({data: {available, depth, idx}}) => {
  console.log(`hi! I'm ${idx} and will create ${Math.pow(4, depth)} datapoints...`);
  counter = 0;
  postMessage(split(available, depth, idx).flat(depth));
};
