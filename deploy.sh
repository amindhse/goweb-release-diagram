#!/usr/bin/env sh
# abort on errors
set -e
# remove dist folder
rm -rf dist/
# build
yarn run build
# change mode of dist folder
chmod 775 dist/
# navigate into the build output directory
cd dist
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:amindhse/goweb-release-diagram.git master:gh-pages
cd -