echo "compressing contracts..."
cd data
mv contracts.7z /tmp/
7z a -t7z contracts.7z contracts
rm -rf contracts

echo "compressing metrics in CSV format..."
mv metrics.csv.7z /tmp/ 
7z a -t7z metrics.csv.7z metrics.csv
rm metrics.csv
