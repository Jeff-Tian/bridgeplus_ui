#Bridge+

## Getting Started

Install dependencies and run your app locally.

### Install Dependencies

```
npm install
bower install
```

!!!BE SURE TO RUN ABOVE SCRIPTS EVERY SYNC UP!!!

### Run project on dev mode

```
grunt
```

### Create release version
LIVE environment will use release version files.
```
grunt release
gulp release
```

### Create release version and run on local machine 
```
grunt local-release
gulp release
```

Now browse to the website at `http://localhost:12000`

### Run server side code test
```
mocha
```

### Runn client side code test
```
grunt karma
```

Or

```
karma start client/www/test/my.conf.js
```

### Run e2e test
Open a terminal
```
webdriver-manager start
```

Then open another terminal and 
```
grunt e2e
```

### Semantic
If you customized semantic styles in the ./semantic folder, you need to run 
```
gulp 'build own semantic'
```
to generate the compiled files, and then commit and push to the source control.

If you met 404 error like `http://xx.xx.xx.xx/semantic/dist/semantic.min.css?3.0.0_20160412_0538`, then you need to run 
```
gulp release
```
so that your `~/client/dist/` folder would have a `semantic` folder. And it will work.


### Sub domains
```
uat.corp.bridgeplus.cn --> 116.247.126.75 --> 10.20.32.51 --> uat.bridgeplus.cn/corp/*
```

### Back end Router Structure for new module
To build a new module, for example, `corp` for BridgePlus Company users, add a *router file* (`corp.js`) under `~/routers/` folder. And then register it in the `server.js` by the following line:
```javascript
server.use(localeHelper.regexPath('/corp', false), require('./routes/corp.js'));
```

### View files
put your view files to `~/client/views/` instead of `~/vlient/www/`!