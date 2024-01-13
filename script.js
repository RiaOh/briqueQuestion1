const fs = require("fs");
const path = require("path");
const FILE_NAME = "sample.csv";
const csvPath = path.join(FILE_NAME);
const csv = fs.readFileSync(csvPath, "utf-8");
const rows = csv.split("\r\n");

let notNumberCsv = [];
let onlyNumberCsv = [];
for (let i = 1; i < rows.length; i++) {
  const data = rows[i].split(",");

  let includingString = false;
  let arr = [];
  for (let j = 0; j < data.length; j++) {
    let elementToNumber = Number(data[j]);

    if (isNaN(elementToNumber)) {
      includingString = true;
      arr.push(data[j]);
    } else {
      arr.push(elementToNumber);
    }
  }
  if (includingString) {
    notNumberCsv.push(arr);
  } else {
    onlyNumberCsv.push(arr);
  }
}

function calculateStatistics(arr) {
  const result = arr.map((subArr) => {
    const min = parseFloat(Math.min(...subArr).toFixed(1)); // 최소값
    const max = parseFloat(Math.max(...subArr).toFixed(1)); // 최대값
    const sum = parseFloat(
      subArr.reduce((acc, val) => acc + val, 0).toFixed(1)
    ); // 합계
    const average = parseFloat((sum / subArr.length).toFixed(1)); //평균

    const squaredDifferences = subArr.map((value) =>
      Math.pow(value - average, 2)
    );
    const variance =
      squaredDifferences.reduce((acc, cur) => acc + cur, 0) / subArr.length;
    const standardDeviation = parseFloat(Math.sqrt(variance).toFixed(15)); // 표준편차

    const sortedArr = subArr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    const median =
      sortedArr.length % 2 !== 0
        ? parseFloat(sortedArr[mid].toFixed(1))
        : parseFloat(
            (
              (parseFloat(sortedArr[mid - 1]) + parseFloat(sortedArr[mid])) /
              2
            ).toFixed(1)
          ); // 중간값

    return [min, max, sum, average, standardDeviation, median];
  });

  return result;
}

const result = calculateStatistics(onlyNumberCsv);
console.log("최소값 최대값 합계 평균 표준편차 중간값", result);

//notNumberCsv
let stringResult = "";
for (let i = 0; i < notNumberCsv.length; i++) {
  for (let j = 0; j < notNumberCsv[i].length; j++) {
    if (typeof notNumberCsv[i][j] !== "number") {
      if (
        notNumberCsv[i][j].startsWith('"') &&
        notNumberCsv[i][j].endsWith('"')
      ) {
        let str = notNumberCsv[i][j].slice(1, -1);
        stringResult = stringResult + str;
      } else {
        stringResult = stringResult + notNumberCsv[i][j];
      }
    }
  }
}
console.log("숫자가 아닌 값", stringResult);
