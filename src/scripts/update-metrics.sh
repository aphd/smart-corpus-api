echo "Downloading contracts..."
node src/services/handle-contracts.js

echo "Writing metrics to csv..."
node src/services/handle-metrics.js csv

echo "Removing dupicates metrics from /data/metrics.csv..."
FN=./data/metrics.csv
FNU="$FN.u"
(head -n 1 $FN && tail -n +2 $FN | sort) | uniq > $FNU
mv $FNU $FN

echo "Writing metrics to JSON..."
node src/services/handle-metrics.js json

