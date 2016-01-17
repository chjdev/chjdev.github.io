#!/bin/sh
#npm install babel-cli
cd ./node_modules/babel-preset-es2015/node_modules
cat ../../../decision_tree.es | ../../.bin/babel --presets "es2015" > ../../../decision_tree.js
cd -
