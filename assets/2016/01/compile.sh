#!/bin/sh
#npm install babel-cli
cd ./node_modules/babel-preset-es2015/node_modules
#cat ../../../decision_tree.es | ../../.bin/babel --presets "es2015" > ../../../decision_tree.js
#cat ../../../kmeans.es | ../../.bin/babel --presets "es2015" > ../../../kmeans.js
#cat ../../../hll/hll_worker.es | ../../.bin/babel --presets "es2015" > ../../../hll/hll_worker.js
cat ../../../hll/hll_chart.es | ../../.bin/babel --presets "es2015" > ../../../hll/hll_chart.js
#cat ../../../hll/hll.es | ../../.bin/babel --presets "es2015" > ../../../hll/hll.js
cd -
