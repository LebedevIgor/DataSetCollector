const axios = require("axios");
const fs = require("fs");
const { DateTime } = require("luxon");
const AdmZip = require("adm-zip");
const path = require("path");

const coinData = {
  // 0: "BNB",
  1: "BTC",
  // 2: "BCH",
  // 3: "ADA",
  // 4: "DOGE",
  // 5: "EOS",
  // 6: "ETH",
  // 7: "ETC",
  // 8: "IOTA",
  // 9: "LTC",
  // 10: "MKR",
  // 11: "XMR",
  // 12: "XLM",
  // 13: "TRX",
};

async function getCoinPrices(symbol, AssetID) {
  const baseUrl = "https://data.binance.vision/data/spot/monthly/klines";
  const interval = "1m";
  // const previousDate = DateTime.now().minus({ days: 1 }).toFormat('yyyy-MM-dd');
  //С этим можно играться
  const previousDate = DateTime.now().minus({ months: 50 }).toFormat("yyyy-MM");
  const url = `${baseUrl}/${symbol}USDT/${interval}/${symbol}USDT-${interval}-${previousDate}.zip`;
  console.log(url);
  const zipFilePath = `${symbol}-${interval}-${previousDate}.zip`;

  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    if (response.status === 200) {
      const saveDir = path.join(__dirname, "csv_files");
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir);
      }

      const zipFileFullPath = path.join(__dirname, zipFilePath);
      fs.writeFileSync(zipFileFullPath, response.data);

      const zip = new AdmZip(zipFileFullPath);
      const zipEntries = zip.getEntries();

      const csvEntry = zipEntries.find((entry) =>
        entry.entryName.endsWith(".csv")
      );

      if (csvEntry) {
        const csvFileName = `${symbol}-${interval}-${previousDate}.csv`;
        const csvFileFullPath = path.join(saveDir, csvFileName);
        const csvData = zip.readFile(csvEntry).toString("utf-8");
        const rows = csvData.split("\n").map((row) => row.split(","));

        const modifiedRows = rows.map((row) => {
          if (row.length > 1) {
            const newRow = [AssetID];
            for (let i = 0; i < row.length; i++) {
              if (![6, 7, 9, 10, 11, 12].includes(i)) {
                newRow.push(row[i]);
              }
            }
            return newRow.join(",");
          } else {
            return "";
          }
        });

        const header = "Asset_ID,timestamp,Open,High,Low,Close,Volume,Count\n";

        fs.writeFileSync(csvFileFullPath, header + modifiedRows.join("\n"));
        console.log(`CSV file for ${symbol} saved as ${csvFileName}`);
      } else {
        console.error(`CSV file not found for ${symbol} in the ZIP archive.`);
      }

      fs.unlinkSync(zipFileFullPath);
    } else {
      console.error(`Failed to download file for ${symbol}.`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getAllCoinPrices() {
  // clearCsvFilesDirectory();
  for (const coin in coinData) {
    await getCoinPrices(coinData[coin], coin);
  }
}

async function clearCsvFilesDirectory() {
  const directory = path.join(__dirname, "csv_files");

  try {
    const files = await fs.promises.readdir(directory);

    for (const file of files) {
      await fs.promises.unlink(path.join(directory, file));
    }

    console.log("CSV files directory cleared successfully.");
  } catch (error) {
    console.error("Error clearing CSV files directory:", error);
  }
}

// module.exports = getAllCoinPrices;

getAllCoinPrices();
