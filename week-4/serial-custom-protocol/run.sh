../flash.sh "board/custom.hex"
cd ui || exit
pnpm i && pnpm dev
cd ..

