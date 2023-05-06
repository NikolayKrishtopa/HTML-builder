const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

// create the copy of directory including the files
const createDirCopy = async (srcDir, tgtDir) => {
  const items = await readdir(srcDir, {
    withFileTypes: true,
  });
  const files = items.filter((item) => item.isFile());
  const dirs = items.filter((item) => !item.isFile());
  fs.mkdir(tgtDir, { recursive: true }, (err) => {
    if (err) throw err;
    files.forEach((f) => {
      fs.writeFile(path.join(tgtDir, f.name), '', (err) => {
        if (err) throw err;
        const readableStream = fs.createReadStream(path.join(srcDir, f.name));
        readableStream.on('data', (chunk) => {
          fs.appendFile(path.join(tgtDir, f.name), chunk, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
  dirs.forEach((dir) =>
    createDirCopy(path.join(srcDir, dir.name), path.join(tgtDir, dir.name))
  );
};

// head function
const copyDir = async () => {
  const dir = await readdir(__dirname);
  if (!!dir.find((d) => d === 'files-copy')) {
    fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
      createDirCopy(
        path.join(__dirname, 'files'),
        path.join(__dirname, 'files-copy')
      );
    });
  } else {
    createDirCopy(
      path.join(__dirname, 'files'),
      path.join(__dirname, 'files-copy')
    );
  }
};

copyDir();
