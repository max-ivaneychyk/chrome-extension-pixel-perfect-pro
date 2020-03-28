const fs = require('fs');
const fsAsync = fs.promises
const DIR = './extension'
const { parse } = require('node-html-parser');

const rmDir = function (dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};

fsAsync.lstat(DIR)
.then(() => rmDir(DIR))
.catch(() => null)
.then(() => fsAsync.mkdir(DIR))
.then(() => {
  return fsAsync.readdir('./chrome')
  .then(files => {
    return Promise.all(files.map(link => {
      return fsAsync.copyFile(
        './chrome/' + link,
        DIR + '/' + link)
    }))
  });
})
.then(() => fs.readFileSync('./build/index.html', 'utf8'))
.then(html => {
  const root = parse(html);
  const scripts = root.querySelectorAll('script').map(node => node.getAttribute('src'))
  const styles = root.querySelectorAll('link')
  .filter(node => node.rawAttrs.includes('.css'))
  .map(node => node.getAttribute('href'))

  return {
    styles,
    scripts
  }
})
.then(({ styles, scripts }) => {
  const promises = [ ...scripts, ...styles ].map(
    link => fsAsync.copyFile(
      './build' + link,
      DIR + '/' + link.replace(/\//g, "$"))
  );

  const files = {
    js: scripts.map(link => link.replace(/\//g, "$")),
    css: styles.map(link => link.replace(/\//g, "$")),
  }

  return Promise.all(promises).then(() => files)
})
.then(({js, css}) => {
  const fileName = DIR + '/manifest.json';
  const json = require(fileName);

  json.content_scripts[0].js.push(...js)
  json.content_scripts[0].css.push(...css)

  fs.writeFile(fileName, JSON.stringify(json), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(json));
    console.log('writing to ' + fileName);
  });
})

