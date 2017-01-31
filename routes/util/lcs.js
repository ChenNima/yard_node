exports.maxRepeat = function (arr1, arr2) {
  var matrix = [];
  for(var i = 0; i < arr2.length ; i++){
    matrix.push(new Array(arr1.length));
  }
  arr1.forEach(function(num1, index1) {
    arr2.forEach(function(num2, index2){
      var up = index2 ? matrix[index2-1][index1] : 0;
      var left = index1 ? matrix[index2][index1-1] : 0;
      var leftUp = index1 && index2 ? matrix[index2-1][index1-1] : 0;
      var base = Math.max(up, left);

      base = num1 === num2 ? leftUp + 1 : base;
      matrix[index2][index1] = base;
    });
  });

  return matrix[arr2.length-1][arr1.length-1];
};