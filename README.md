# Alphamap

## History

This is a _really_ old generative art project that I’ve always been fond of. I wrote it in ActionScript 3 (the language used by Adobe Flash) while at university. A few years ago I ported it to ES5 and canvas. More recently, I modified it use Web Workers to improve rendering time.

## Algorithm

Starting at the top left, each cell takes average value of the cell above and to its left, plus or minus a small variance.

Originally this was only on the alpha channel (hence the name “alphamap”). In this version the colour channels red, green, and blue are calculated independently.

https://liamnewmarch.github.io/alphamap
