const fs = require('fs');
const path = require('path');
const { readdir } = require('node:fs/promises');
const createDirCopy = require('../04-copy-directory/index');
const mergeStyles = require('../05-merge-styles/index');

const buildHelper = () => {
  createDirCopy(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets')
  );
  mergeStyles(
    path.join(__dirname, 'styles'),
    path.join(__dirname, 'project-dist', 'styles.css')
  );
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
