'use strict;'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}




function countNeighbours(mat, cellI, cellJ) {
  // CR: Not a utills function. you don't count neighbors but mines-neighbors only.
  var negsCount = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {

      if (i < 0 || i >= mat.length) continue;

      for (var j = cellJ - 1; j <= cellJ + 1; j++) {

          if (i === cellI && j === cellJ) continue;
          if (j < 0 || j >= mat[i].length) continue;

          if (mat[i][j] === MINE) negsCount++;
      }
  }
  return negsCount;
}

