#!/bin/bash

npm run build --prefix ui
python3 -m tilescopegui.main
