cd board || exit
./flash.sh
cd ../ui || exit
pnpm i && pnpm dev
cd ..

