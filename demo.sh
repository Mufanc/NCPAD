for SCRIPT in $(ls week-?/demo.sh); do
    cd $(dirname $SCRIPT) || exit
    source ./demo.sh
    cd ..
done
