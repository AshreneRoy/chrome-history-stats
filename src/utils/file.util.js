import { exec } from 'child_process';

const copyDBFile = () => {
  return new Promise((resolve) => {
    exec("cp $HOME'/Library/Application\ Support/Google/Chrome/Default/History' $TMPDIR", function(err, stdout, stderr) {
      if (err) {
        console.log(err.message);
      }
      resolve(process.env['TMPDIR']+'History');
    });
  });
}

export { copyDBFile }