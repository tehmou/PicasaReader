mkdir deploy
cp -r * deploy
rm -rf deploy/original
scp -r deploy/* ttuominen@timotuominen.fi@timotuominen.fi:mainwebsite_html
rm -rf deploy

