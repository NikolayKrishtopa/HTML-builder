const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

const bundleProject = async () => {
  fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) throw err;
    createDirCopy(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets')
    );
  });
};

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

bundleProject();
