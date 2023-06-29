while true; do
    if [ -e /dev/ttyUSB* ]; then
        break
    else
        read -p '请将开发板连接到设备，按回车键继续...'
    fi
done

cd serial-echo || exit
./run.sh
cd ..

wait

cd serial-custom-protocol || exit
./run.sh
cd ..

wait
