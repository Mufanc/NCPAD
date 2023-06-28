if ! command -v stcgal &> /dev/null; then
    pip install stcgal
fi

SERIAL=$(find /dev -name 'ttyUSB*' | head -n 1)

if ! [ -r $SERIAL -a -w $SERIAL ]; then
    sudo chmod 666 $SERIAL
fi

stcgal 'custom.hex'

