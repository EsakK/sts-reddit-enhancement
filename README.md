# Slay The Spire Reddit Enhancement

This is an ** alpha ** chrome/firefox extension for the subreddit SLay The Spire at https://www.reddit.com/r/slaythespire/

It provides cards informations on hover when you are in a post :

|      |  |
| ---      | ---       |
| ![alt](https://image.noelshack.com/fichiers/2018/06/2/1517930207-before.png) |![alt](https://image.noelshack.com/fichiers/2018/06/2/1517930207-after.png)|

# Devs : requirements

```shell 
npm install --global web-ext
```

```shell
npm install -g typescript
```

# Devs : Compile & test

```shell
# In /web-extension folder
# It will allow you to run and update the extension on every change
web-ext run

# in /web-extension/src
# It compiles typescript into js
tsc -w
```