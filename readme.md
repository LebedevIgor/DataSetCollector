Создать .env для .ipynb  
py -3.10 -m venv target  
.\fyp-env\Scripts\activate  
Установить все пакеты

npm i

1. node .\getData.js  
   Внутри этого файла можно менять промежуток времени получения данных (Может выполнятся множество раз)
2. node .\mergeAndSortCSVFiles.js  
   после выполнения .\mergeAndSortCSVFiles.js
3. зайти в index.ipynb и выполнить весь код
4. node .\mergeTarget.js
5. train.csv
