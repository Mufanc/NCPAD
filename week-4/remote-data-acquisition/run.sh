../flash.sh "board/wave.hex"
cd ui || exit
pnpm i && pnpm dev
cd ..

