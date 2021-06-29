#!/bin/bash

cd ui
npm install
cd ..

for dep in $(egrep -o '[^"]+==[0-9]+.[0-9]+.[0-9]+' setup.py)
do
  python3 -m pip install "$dep"
done
