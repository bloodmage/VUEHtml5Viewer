@echo off
copy ..\vuehtml5\* .
copy z:\gitted\NNResearch.vue data.vue
copy reader.html index.html
del *~
cmd /c git add .
cmd /c git commit -a -m "aaa"
cmd /c git push origin gh-pages

