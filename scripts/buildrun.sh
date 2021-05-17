#!/bin/bash

cd ui
npm run-script build
cd ..
python3 -m tilescopegui.main
