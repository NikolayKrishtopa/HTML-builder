const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');
const createDirCopy = require('../04-copy-directory/index');
const mergeStyles = require('../05-merge-styles/index');

const buildHtml = async () => {
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    '',
    (err) => {
      if (err) console.log(err);
    }
  );
  let htmlContent = '';
  const readableStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8'
  );
  readableStream.on('data', (chunk) => (htmlContent += chunk));
  readableStream.on('end', async () => {
    const items = await readdir(path.join(__dirname, 'components'), {
      withFileTypes: true,
    });
    const files = items.filter((item) => item.isFile());
    for (const file of files) {
      const filename = file.name
        .split('.')
        .filter((e, i, arr) => i !== arr.length - 1)
        .join('');
      if (htmlContent.includes(`{{${filename}}}`)) {
        let fileContent = '';
        const readableStr = fs.createReadStream(
          path.join(__dirname, 'components', file.name),
          'utf-8'
        );
        readableStr.on('data', (chunk) => (fileContent += chunk));
        readableStr.on('end', async () => {
          htmlContent = htmlContent.split(`{{${filename}}}`).join(fileContent);
          if (files.indexOf(file) === files.length - 1) {
            fs.writeFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              htmlContent,
              (err) => {
                if (err) console.log(err);
              }
            );
          }
        });
      }
    }
  });
};

const buildHelper = () => {
  createDirCopy(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
  mergeStyles(
    path.join(__dirname, 'styles'),
    path.join(__dirname, 'project-dist', 'style.css')
  );
  buildHtml();
};

// head function
const bundleProject = async () => {
  const dir = await readdir(__dirname);
  if (!!dir.find((d) => d === 'project-dist')) {
    fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      fs.mkdir(
        path.join(__dirname, 'project-dist'),
        { recursive: true },
        (err) => {
          if (err) throw err;
          buildHelper();
        }
      );
    });
  } else {
    fs.mkdir(
      path.join(__dirname, 'project-dist'),
      { recursive: true },
      (err) => {
        if (err) throw err;
        buildHelper();
      }
    );
  }
};

bundleProject();
