
rm -rf node_modules
yarn
yarn build

DIR=$(pwd)

cd ../web
rm -rf node_modules
yarn
cd $DIR
npx ts-node --skipProject scripts/link-in-app.ts web

npx tsc -w