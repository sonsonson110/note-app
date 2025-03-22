Virtual machine & continuous deployment setup

Prerequisites
1. Has a Ubuntu virtual machine with a public IP address
2. Private key configured with .pem file persisted on host machine
3. SSH port 22 exposed
4. Create necessary free services on Azure
	- Virtual Machines, Basv2 Series, B2ats v2
		- Storage, Premium Page Blob, P6 Disks
		- Networking, Public IP Addresses, IP Address Hours
	- Azure Database for PostgreSQL, Flexible Server Burstable BS Series
		- Azure Database for PostgreSQL, Flexible Server Storage, Data
	- Container Registry, Standard Registry Unit
# Set up Ubuntu
### Set password for Ubuntu user
```bash
sudo passwd azureuser
```
### SSH to virtual machine
```bash
ssh -i /path/to/pem/file azureuser@vm_public_ip_address
```
For the first time connection, type `yes` for `Are you sure you want to continue connecting (yes/no/[fingerprint])?`
### Update the system
```bash
sudo apt update && sudo apt upgrade -y
```
### Install necessary package
```bash
sudo apt install git
git -v # double check

sudo apt install make
make -v # double check

sudo apt install vim
vim --version # double check
```
### Install docker and docker compose
```bash
curl -fsSL https://get.docker.com -o get-docker.sh sh get-docker.sh
```
Double check if docker container works
```bash
sudo docker run hello-world
```
The result should be like this:
```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
...
```
Double check with docker compose version
```bash
docker compose version
```
### Add user to docker group
```bash
sudo usermod -aG docker $USER
# Apply the new group membership without logging out
newgrp docker
```
### Install Azure CLI
> Also install in development environment for infra management
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```
##### Azure Container Registry
```bash
az login
az acr login --name devopslearningregistry1
```
Test by pulling a public "hello world" image locally and providing a tag before you push the image to your registry.
```bash
docker pull mcr.microsoft.com/mcr/hello-world
docker tag mcr.microsoft.com/mcr/hello-world devopslearningregistry1.azurecr.io/samples/hello-world
```
Push that test image
```bash
docker push devopslearningregistry1.azurecr.io/samples/hello-world
```
List registry repository
```bash
az acr repository list --name devopslearningregistry1 --output table
```
Further reading: 
- https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli
- https://learn.microsoft.com/en-us/cli/azure/acr/repository?view=azure-cli-latest
##### Azure Postgres Flexible Server
- https://learn.microsoft.com/en-us/cli/azure/postgres/flexible-server?view=azure-cli-latest
# Set up virtual machine networking (Azure Ubuntu 22.04)
### Azure Network Settings (Network security group)
`Azure Portal -> Networking -> Networking Settings -> Add inbound port rule`

Add **inbound rules** to allow traffic, for example, on ports 80 (http)

| Field              | Value          |
| ------------------ | -------------- |
| Name               | Allow-HTTP<br> |
| Port               | 80             |
| Protocol           | TCP            |
| Action             | Allow          |
| Priority           | 1010           |
| Destination        | \*             |
| Source             | Any            |
| Source port ranges | \*             |

### Ubuntu Firewall (UFW) Configuration
SSH into server and run
```bash
# Allow SSH (should already be allowed)
sudo ufw allow 22/tcp

# Allow HTTP for frontend
sudo ufw allow 80/tcp

# Enable the firewall if not already enabled
sudo ufw enable

# Check the status of the firewall
sudo ufw status
```
Expected output:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere            
22/tcp (v6)                ALLOW       Anywhere (v6)          
80/tcp (v6)                ALLOW       Anywhere (v6)
```

> Application must be running to check for manually opened ports (80)

Remove rule:
```bash
# Get a list of the current rules
sudo ufw status numbered
# Delete the rule by using the corresponding ID inside `[]`
sudo ufw delete *number*
```
# Set up Application on Virtual Machine
### Clone the public repository on VM
SSH to server
```bash
git clone https://github.com/sonsonson110/note-app.git
cd ./note-app # the project repository
```
### DEPRECATED: Install Postgres database on VM
> **DEPRECATED**: This only show how to install Postgres locally. The current project has move the database the Azure external database service to reduce VM load (the service is free too!)
##### Install
```bash
# Update system packages
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Verify installation
sudo systemctl status postgresql
```
##### Add user, grant role and create application database
```bash
# Access PostgreSQL command prompt as postgres user
sudo -u postgres psql

CREATE DATABASE "note-app";

# Create a user with password
CREATE USER postgres WITH PASSWORD 'password';

# Grant privileges to the user on the database
GRANT ALL PRIVILEGES ON DATABASE "note-app" TO postgres;

# Exit psql
\q
```
##### Configure
Edit the PostgreSQL configuration file:
```bash
sudo vim /etc/postgresql/*/main/postgresql.conf
```
Update the listening address (other machines can connect to instance):
```bash
listen_addresses = '*'  # Listen on all interfaces
```
`:wq` to save the file

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```
# Set up continuous deployment
### GitHub secrets & variable for GitHub Workflow (Repository variables)
##### Docker Hub authentication
To reduce rate limiting for base image from docker hub
- `DOCKERHUB_USERNAME` (variable)
	- The username to login
- `DOCKERHUB_TOKEN`(secret)
	- To authenticate user from Docker CLI (instead of password)
	- Step: Login to Docker Hub -> Account settings -> Personal access tokens -> Generate new token (set description:`any`, expiration date:`None`, access permission:`Public Repo Read-only`)
##### Azure Common
- `AZURE_SUBSCRIPTION_ID` (secret)
	- The id of azure subscription which is used to create other free services
	- Step: Login to Azure Portal -> Search for `Subscriptions` -> Observe `SubscriptionId`	
- AZURE_RESOURCE_GROUP (secret)
	- The group that free services were created from
	- Step: Login to Azure Portal -> Search for `Resource group` -> Observe name	
##### Azure Service Principle
A security identity used by applications, services, and automation tools to access specific Azure resources
- `AZURE_APPLICATION_ID` (`AZURE_CLIENT_ID`) (secret)
- `AZURE_CLIENT_SECRET` (secret)
- `AZURE_TENANT_ID` (secret)
These properties are obtained from authenticated Azure CLI and used to authenticated in automated workflows. Step:
1. Open Terminal
```bash
az login
az ad sp create-for rbac \
	--role contributor \
	--name "github-action-sp" \
	--scopes /subscriptions/mySubscriptionID \
	--sdk-auth
```
2. Observe JSON value
```json
{
  "clientId": "", // AZURE_APPLICATION_ID
  "clientSecret": "", // AZURE_CLIENT_SECRET
  "subscriptionId": "",
  "tenantId": "", // AZURE_TENANT_ID
  "activeDirectoryEndpointUrl": "",
  "resourceManagerEndpointUrl": "",
  "activeDirectoryGraphResourceId": "",
  "sqlManagementEndpointUrl": "",
  "galleryEndpointUrl": "",
  "managementEndpointUrl": ""
}
```
3. Further management from [Microsoft Entra](https://entra.microsoft.com/):
	Go to left side bar -> Identity -> Application Registrations -> Find created app
References:
- https://learn.microsoft.com/en-us/cli/azure/azure-cli-sp-tutorial-1?tabs=bash#create-a-service-principal (should definitely learn more about role & scopes)
- https://www.youtube.com/watch?v=Z06OyG4i18w&t=307s
##### Azure Container Registry
A managed Docker registry service that helps you store and manage container images for deployments
- `ACR_LOGIN_SERVER` (secret)
- `ACR_PASSWORD` (secret)
- `ACR_USERNAME` (secret)
Obtained from: Azure Portal -> Azure Container Registry -> Access keys
##### Azure Postgres Flexible Server
This study case use `PostgreSQL authentication only`
- `DATABASE_URL` (secret)
	- The connection string which is used to connect the the database from back-end application
	- Follow Postgres connection string rule
- `AZURE_POSTGRES_SERVER_NAME` (secret)
	- Extract from this format of database endpoint
```
${server_name}$.postgres.database.azure.com
```
##### Azure Linux Virtual Machine
- `AZURE_VM_USER` (secret)
	- The VM user which was set when creating the VM
- `AZURE_VM_IP` (secret)
	- The reserved IP Address for the VM
- `AZURE_VM_SSH_PRIVATE_KEY` (secret)
	- The content from the private key file which was create and persisted to local computer when creating the VM
