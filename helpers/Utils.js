const shuffleArray = (array) => {
  const shuffle = [];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    shuffle[i] = array[j];
    shuffle[j] = temp;
  }

  return shuffle;
};

module.exports = {
  shuffle: shuffleArray,
};
