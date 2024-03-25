const fs = require('fs');

async function mergeSortCSVFiles() {
  const directoryPath = './csv_files';
  const mergedFileName = 'merged_sorted_data.csv';

  try {
    const csvFiles = fs.readdirSync(directoryPath);
    let mergedData = '';

    for (const file of csvFiles) {
      const csvData = fs.readFileSync(`${directoryPath}/${file}`, 'utf8');
      mergedData += csvData;
    }

    let lines = mergedData.trim().split('\n');

    const parsedData = lines.map((line) => {
      const values = line.split(',');
      const temp = values[0];
      const count = values[7];
      values.splice(7, 1);
      values.push(
        parseFloat(
          (
            (Number(values[4]) + Number(values[5]) + Number(values[6])) /
            3
          ).toFixed(8)
        )
      );
      values.push(0);
      values[0] = Number(values[1]) / 1000;
      values[1] = Number(temp);
      values[2] = parseFloat(values[2]);
      values[3] = parseFloat(values[3]);
      values[4] = parseFloat(values[4]);
      values[5] = parseFloat(values[5]);
      values[6] = parseFloat(values[6]);
      values[7] = parseFloat(values[7]);
      values.splice(2, 0, Number(count));
      return values;
    });

    parsedData.sort((a, b) => `${a[0]}`.localeCompare(`${b[0]}`));

    const sortedCSV = [
      'timestamp,Asset_ID,Count,Open,High,Low,Close,Volume,VWAP,Target',
    ]
      .concat(parsedData.map((row) => row.join(',')))
      .filter(
        (row) =>
          !row.startsWith(
            // 'timestamp,Asset_ID,Count,Open,High,Low,Close,Volume,NaN,0'
            'NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,NaN,0'
          )
      )
      .join('\n');
    fs.writeFileSync(mergedFileName, sortedCSV);

    console.log(`Merged, swapped, and sorted data saved as ${mergedFileName}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
mergeSortCSVFiles();
// module.exports = mergeSortCSVFiles;
