echo "compressing contracts..."
cd data
mv contracts.7z contracts.old.7z
7z a -t7z contracts.7z contracts
rm -rf contracts
