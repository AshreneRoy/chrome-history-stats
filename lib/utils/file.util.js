import { exec } from 'child_process';

const copyDBFile = () => new Promise((resolve) => {
  exec("cp $HOME'/Library/Application Support/Google/Chrome/Default/History' $TMPDIR", (err) => {
    if (err) {
      console.log(err.message);
    }
    resolve(`${process.env.TMPDIR}History`);
  });
});

export { copyDBFile };
