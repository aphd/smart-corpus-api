echo "Downloading contracts..."
node src/services/handle-contracts.js

echo "Writing metrics..."
node src/services/handle-metrics.js

echo "Removing dupicates metrics from /data/metrics.csv..."
FN=./data/metrics.csv
FNU="$FN.u"
(head -n 1 $FN && tail -n +2 $FN | sort) | uniq > $FNU
mv $FNU $FN

