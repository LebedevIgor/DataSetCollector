Создать .env для .ipynb  
py -3.10 -m venv target  
.\target\Scripts\activate  
python -m pip install --upgrade pip

Установить все пакеты  
pip install -r requirements.txt

Создать папку ./csv_files

npm i

1. node .\getData.js  
   Внутри этого файла можно менять промежуток времени получения данных (Может выполнятся множество раз)
2. node .\mergeAndSortCSVFiles.js  
   после выполнения .\mergeAndSortCSVFiles.js
3. зайти в index.ipynb и выполнить весь код
4. node .\mergeTarget.js
5. train.csv
