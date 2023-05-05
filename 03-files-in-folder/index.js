const fs = require('fs');
const { stat } = fs;
const path = require('path');
const { readdir } = require('node:fs/promises');

const getFiles = async () => {
  try {
    const items = await readdir(
      path.join('03-files-in-folder', 'secret-folder'),
      { withFileTypes: true }
    );
    const files = items.filter((item) => item.isFile());
    for (const file of files) {
      stat(
        path.join('03-files-in-folder', 'secret-folder', file.name),
        (err, stats) => {
          if (err) throw new Error(err.message);
          console.log(
            `${file.name
              .split('.')
              .filter((e, i, arr) => i !== arr.length - 1)} - ${
              file.name.split('.')[1]
            } - ${stats.size}`
          );
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

getFiles();
