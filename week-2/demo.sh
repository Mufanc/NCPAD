PIDS=""

trap kill_procs EXIT

function kill_procs() {
    for PID in $PIDS; do
        kill -9 $PID
    done
}

cd agricultural-system-manager || exit
pnpm i
pnpm dev &
PIDS="$! $PIDS"
cd ..

cd agricultural-system-terminal || exit
pnpm i
pnpm dev &
PIDS="$! $PIDS"
cd ..

echo "$PIDS"
wait
