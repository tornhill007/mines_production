const getRandomInt = require('./getRandomInt');

const createMines = (minesAmount, firstLimit, lastLimit) => {
  let arr = [];
  const map = {}
  for(let i = 0; i < minesAmount; i++) {
    let firstCoordinate = -1
    let lastCoordinate = -1
    do {
      firstCoordinate = getRandomInt(0, +firstLimit-1);
      lastCoordinate = getRandomInt(0, +lastLimit-1);
    } while (map[`${firstCoordinate}:${lastCoordinate}`]);
    map[`${firstCoordinate}:${lastCoordinate}`] = 1;
    // let firstCoordinate = (2*i)%(+firstLimit)
    // let lastCoordinate = Math.floor((2*i)/(+firstLimit))

    arr.push({firstCoordinate, lastCoordinate})
  }
  return arr;
}

module.exports = createMines;