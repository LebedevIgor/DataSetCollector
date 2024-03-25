const mergeAndSortCSVFiles = require('./mergeAndSortCSVFiles');
const getAllCoinPrices = require('./getData');
const processTables = require('./mergeTarget');

function processCoinPrices() {
  return new Promise((resolve, reject) => {
    getAllCoinPrices()
      .then(() => {
        console.log('All coin prices fetched successfully.');
        resolve();
      })
      .catch((error) => {
        console.error('Error fetching coin prices:', error);
        reject(error);
      });
  });
}

processCoinPrices()
  .then(() => {
    console.log('Now merging and sorting CSV files...');
    return mergeAndSortCSVFiles(); // возвращаем Promise из mergeAndSortCSVFiles
  })
  .then(() => {
    console.log('CSV files merged and sorted successfully.');
    console.log('Now processing tables...');
    return processTables(); // возвращаем Promise из processTables
  })
  .catch((error) => {
    console.error('Error processing:', error);
  });
