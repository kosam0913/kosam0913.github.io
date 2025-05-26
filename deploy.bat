@echo off
echo 正在部署网站到GitHub Pages...
echo Deploying website to GitHub Pages...

echo.
echo 1. 添加所有文件到Git...
echo 1. Adding all files to Git...
git add .

echo.
echo 2. 提交更改...
echo 2. Committing changes...
git commit -m "Update personal website - Technical Product Manager focus with TreeNode and UCG projects"

echo.
echo 3. 推送到GitHub...
echo 3. Pushing to GitHub...
git push origin main

echo.
echo 部署完成！网站将在几分钟内更新。
echo Deployment complete! Website will be updated in a few minutes.
echo.
echo 访问网站: https://kosam0913.github.io
echo Visit website: https://kosam0913.github.io
echo.
pause 