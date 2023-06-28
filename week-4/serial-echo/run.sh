../flash.sh "board/echo.hex"
cd ui || exit
pnpm i && pnpm dev
cd ..

