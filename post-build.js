const fs = require('fs');
const fsAsync = fs.promises
const DIR = './extension'
const { parse } = require('node-html-parser');
const AdmZip = require('adm-zip');

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

const folderToZip = (OUTPUT_DIR) => {
  // creating archives
  const zip = new AdmZip();

  fs.readdir(OUTPUT_DIR, (err, files) => {
    files.forEach(file => {
      zip.addLocalFile(OUTPUT_DIR + "/" + file);
    });

    zip.writeZip(`${OUTPUT_DIR}/extension.zip`);
  });
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
  const newNames = [ 'runtime.js', 'chunk.js', 'main.js', 'all.css' ];
  const promises = [ ...scripts, ...styles ].map(
    (link, index) => fsAsync.copyFile(
      './build' + link,
      DIR + '/' + newNames[index])
  );

  const files = {
    js: [ 'runtime.js', 'chunk.js', 'main.js' ],
    css: [ 'all.css' ]
  }

  return Promise.all(promises).then(() => files)
})
  .then(() => folderToZip(DIR));


