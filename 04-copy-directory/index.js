const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

// create the copy of directory including the files
const createDirCopy = async () => {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;
    copyFiles();
  });
};

// creates the copies of all the files
const copyFiles = async () => {
  const items = await readdir(path.join(__dirname, 'files'), {
    withFileTypes: true,
  });
  const files = items.filter((item) => item.isFile());
  files.forEach((f) => {
    fs.writeFile(path.join(__dirname, 'files-copy', f.name), '', (err) => {
      if (err) throw err;
      const readableStream = fs.createReadStream(
        path.join(__dirname, 'files', f.name),
        'utf-8'
      );
      readableStream.on('data', (chunk) => {
        fs.appendFile(
          path.join(__dirname, 'files-copy', f.name),
          chunk,
          (err) => {
            if (err) throw err;
          }
        );
      });
    });
  });
};

// head function
const copyDir = async () => {
  const dir = await readdir(__dirname);
  if (!!dir.find((d) => d === 'files-copy')) {
    fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      createDirCopy();
    });
  } else {
    createDirCopy();
  }
};

copyDir();
