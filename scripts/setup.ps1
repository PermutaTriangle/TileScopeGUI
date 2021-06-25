cd ui
npm install
cd ..

foreach ($dep in Get-Content -Path ".\setup.py" | Select-String '[^"]+==\d+.\d+.\d+' -AllMatches | ForEach-Object { $_.Matches.Value }) {
   python -m pip install $dep
}
