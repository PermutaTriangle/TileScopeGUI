cd ui
npm run coverage
cd ..
python -m pytest --cov --cov-report term-missing
