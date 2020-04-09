# remove duplicates from CSV metric file, FN=./data/metrics.csv
FN=$1; \
FNU="$FN.u"; \
(head -n 1 $FN && tail -n +2 $FN | sort) | uniq > $FNU; \
mv $FNU $FN
