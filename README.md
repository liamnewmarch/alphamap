## Alphamap

This is a project I started in university when I was messing around with arrays in ActionScript 3.

Starting at the top left, each pixel is coloured based on the cell above it and the cell to it’s left. These are averaged plus or minus a small random amount. Originally this was black cells on a white background (hence the name “alphamap”). In this version the alpha channel is left alone and each colour channel - red, green, and blue - are calculated independantly, leading to unique patterns.

