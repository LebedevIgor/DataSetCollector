const fs = require('fs');
const csv = require('csv-parser');

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function writeCSV(filePath, data) {
  return new Promise((resolve, reject) => {
    const header = Object.keys(data[0]).join(',') + '\n';
    let csvContent = data.reduce((acc, row) => {
      return acc + Object.values(row).join(',') + '\n';
    }, header);

    fs.writeFile(filePath, csvContent, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function replaceTargetValues(table1, table2) {
  const targetValues = table2[0];
  table1.forEach((row) => {
    const assetId = row['Asset_ID'];
    const target = targetValues[assetId];
    if (target !== undefined) {
      row['Target'] = target;
    }
  });
}

async function processTables() {
  try {
    const table1 = await readCSV('./merged_sorted_data.csv');
    const table2 = await readCSV('./result.csv');

    replaceTargetValues(table1, table2);

    await writeCSV('train.csv', table1);

    console.log('Обработка завершена. Результат записан в train.csv.');
  } catch (error) {
    console.error('Произошла ошибка:', error);
  }
}

processTables();
// module.exports = processTables;
