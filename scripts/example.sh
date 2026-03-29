npm run build
npm pack
mv ./smart-unit-*.tgz ./smart-unit-latest.tgz
cd ./examples/basic
bun remove smart-unit
bun install ../../smart-unit-latest.tgz
cd ../react
bun remove smart-unit
bun install ../../smart-unit-latest.tgz
cd ../vue
bun remove smart-unit
bun install ../../smart-unit-latest.tgz
cd ../..
rm -f smart-unit-latest.tgz
