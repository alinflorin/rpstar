import * as simplegit from 'simple-git/promise';
import * as fs from 'fs';
import * as archiver from 'archiver';
import * as rimraf from 'rimraf';


export class GitClient {
  private gitClient: simplegit.SimpleGit;
  constructor(private config: any) {
    if (!fs.existsSync(this.config.tempFolder)) {
      fs.mkdirSync(this.config.tempFolder);
    }
    this.gitClient = simplegit(config.tempFolder);
  }

  async clone(url: string, folderName: string) {
    await this.gitClient.clone(url, folderName, ['--depth', '1']);
    const clonedFolder = `${this.config.tempFolder}/${folderName}`;
    try {
      const archive = archiver.create('zip', {
        encoding: 'utf8',
        store: true
      });
      archive.directory(clonedFolder, false);
      await archive.finalize();
      return archive;
    } finally {
      rimraf.sync(clonedFolder);
    }
  }
}