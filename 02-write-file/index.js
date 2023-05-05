const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

fs.writeFile(path.join(__dirname, 'inputs.txt'), '', (err) => {
  if (err) throw err;
});

stdout.write('Hello! Please tape your text here\n');
stdin.on('data', (data) => {
  if (Buffer.from(data, 'utf-8').toString().trim() === 'exit') {
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'inputs.txt'), data, (err) => {
      if (err) throw err;
    });
  }
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('See you later'));
