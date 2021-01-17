# Dev Setup  
## To be installed:
- git, git bash
- NodeJS 12 with npm
- npm install -g @rpstar/cli typescript tslint
- Docker Community Edition  
Go to Docker settings (right click whale tray icon, Settings), go to the Kubernetes tab, enable it.
- Install kubectl and add to PATH: https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows
- Download helm binary: https://github.com/helm/helm/releases/tag/v2.16.0 , rename it to helm.exe and add to PATH
- VS Code  
Extensions: Kubernetes, Docker, YAML, TSLint, npm
- Mosquitto: https://mosquitto.org/download/

## Setup:
- Make sure Mosquitto is running on port 1883 (default)
- In Git Bash, execute ssh-keygen, and create a new key with the defaults. You will find it in (user dir)/.ssh/id_rsa.pub. Copy the file contents.
- Go to Azure DevOps: https://dev.azure.com/rpstar/_usersSettings/keys and add it there
- Clone all repos, using the SSH links.
- For each nodejs project, please run "npm i" inside!!!
- All secrets are stored inside ENV variables. For local development you need to set them on your machine:
GOOGLE_AUTH_CLIENT_ID  
GOOGLE_AUTH_CLIENT_SECRET  
JWT_KEY  
- All nodejs projects must be started with "npm start"!!!

## Creating new projects:
Each microservice/npm package must reside in it's own git repo.  
The repo name must match the project's name (it's nice).  
Create a new repo, for example: my-awesome-service or my-awesome-library.  
Create a new "develop" branch, from master.  
Go to Project Settings > Repositories > your repo > Branches > click the three dots near "develop" > make default.  
You can now clone the repo.  

We now have the @rpstar/cli global npm package! It's sources are in the "cli" repo.  
npm install -g @rpstar/cli, if you haven't done it already.  
Then, the rpstar command will be available.  
Execute "rpstar" in an empty folder (freshly cloned git repo?) and follow the instructions.  
On the first push, the azure-pipelines.yml file will get picked up and a new build definition will be created, inside a folder called "your-project", with the name "your-project CI".  
You'd want to move and rename that to a good place for it.  
As for releases, you can clone an existing release definition, then replace the artefacts source with YOUR build, and relink the Continuous Deployment triggers for the new source (trigger branches, for example).  
If this is a service, make sure kubectl apply step picks up the yaml file from the correct path!  
All done.