const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

const mergeStyles = async (srcDir, tgtFile) => {
  fs.writeFile(tgtFile, '', (err) => {
    if (err) throw err;
  });
  try {
    const items = await readdir(srcDir, {
      withFileTypes: true,
    });
    const files = items.filter(
      (item) => item.isFile() && item.name.endsWith('.css')
    );

    for (const file of files) {
      const readableStream = fs.createReadStream(
        path.join(__dirname, 'styles', file.name),
        'utf-8'
      );
      readableStream.on('data', (chunk) => {
        fs.appendFile(tgtFile, chunk, (err) => {
          if (err) throw err;
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
};

mergeStyles(
  path.join(__dirname, 'styles'),
  path.join(__dirname, 'project-dist', 'bundle.css')
);

module.exports = mergeStyles;
