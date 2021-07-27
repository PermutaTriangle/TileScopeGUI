#!/bin/bash

cd ui
npm run coverage
cd ..
python3 -m pytest --cov --cov-report term-missing
