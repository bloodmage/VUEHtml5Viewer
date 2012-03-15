@echo off
copy ..\vuehtml5\* .
copy reader.html index.html
del *~
cmd /c git add .
cmd /c git commit -a -m "aaa"
cmd /c git push origin gh-pages

