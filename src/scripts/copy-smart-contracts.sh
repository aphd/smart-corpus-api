#!/bin/bash
for path in ~/github/aphd/smartbugs-wild/contracts/*.sol
do
    file_name="${path##*/}"
    file_name_lower=`echo "${file_name}" | awk '{print tolower($0)}'`
    cp ${path} data/contracts/${file_name_lower:0:4}/${file_name_lower}
done
