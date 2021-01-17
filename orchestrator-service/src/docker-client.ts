import { Docker } from 'docker-cli-js';
import * as uuid from 'uuid';
import { RunnerInputDto, UserDto } from '@rpstar/common/dto';
export class DockerClient {
  private docker: Docker;

  constructor(private config: any) {
    this.docker = new Docker();
  }

  async startRunner(user: UserDto = null, data: any = null) {
    const uid = uuid.v1();
    const runnerInput: RunnerInputDto = {
      containerName: uid,
      data: data,
      owner: user == null ? null : user.email
    };
    const escapedJson = JSON.stringify(JSON.stringify(runnerInput));
    console.log(escapedJson);
    await this.docker.command(`run -d -e NODE_ENV=${this.config.env} -e RUNNER_INPUT="${escapedJson}" --name ${uid} --rm rpstar/runner:latest`);
    return uid;
  }

  async killRunner(uid: string) {
    try {
      await this.docker.command(`kill ${uid}`);
      await this.docker.command(`rm ${uid}`);
    } catch (err) {
      console.error(err);
    }
  }
}
