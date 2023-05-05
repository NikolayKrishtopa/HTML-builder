const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
  if (err) throw err;
});

const mergeStyles = async () => {
  try {
    const items = await readdir(path.join('05-merge-styles', 'styles'), {
      withFileTypes: true,
    });
    const files = items.filter(
      (item) => item.isFile() && item.name.endsWith('.css')
    );

    for (const file of files) {
      const readableStream = fs.createReadStream(
        path.join(path.join('05-merge-styles', 'styles'), file.name),
        'utf-8'
      );
      readableStream.on('data', (chunk) => {
        fs.appendFile(
          path.join(__dirname, 'project-dist', 'bundle.css'),
          chunk,
          (err) => {
            if (err) throw err;
          }
        );
      });
    }
  } catch (err) {
    console.error(err);
  }
};

mergeStyles();
