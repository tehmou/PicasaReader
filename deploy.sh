TIME=$(date +%s)
DEPLOY=../deploy$TIME
echo $DEPLOY
mkdir $DEPLOY
cp -r * $DEPLOY
rm -rf $DEPLOY/original
rm -rf $DEPLOY/.git*
scp -r $DEPLOY/* ttuominen@timotuominen.fi@timotuominen.fi:mainwebsite_html
rm -rf $DEPLOY

