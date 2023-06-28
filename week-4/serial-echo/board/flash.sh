if ! command -v stcgal &> /dev/null; then
    pip install stcgal
fi

stcgal 'echo.hex'

