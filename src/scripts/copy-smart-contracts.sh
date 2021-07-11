for path in "/tmp/smartcontracts/"*
do
    file_name="${path##*/}"
    echo ${file_name:0:4}
    echo ${path}
    cp  ${path} data/contracts/${file_name:0:4}/
done
