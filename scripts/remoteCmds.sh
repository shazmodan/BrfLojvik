# This file is meant to be executed on the production server.
# 1. Setup SSH Agen to enable GitHub connection.
# 2. Stop all instances of node programs.
# 3. Download the latest version from GitHub.
# 4. Install and build the react-application.
# 5. Copy the React build folder contents to the servers /wwwroot/ folder.
# 6. Install and start the node server.


# Make sure SSH agent is running
if ps -p $SSH_AGENT_PID > /dev/null
then
   echo "ssh-agent is already running"
   ssh-add ~/.ssh/id_rsa
else
eval `ssh-agent -s`
ssh-add ~/.ssh/id_rsa
fi

# Stops server
pm2 stop all

# Get latest version
cd ~/brflojvik/
git fetch
git reset --hard origin/master

# Build the react project
cd ~/brflojvik/brflojvik-react/
npm install
npm run build

# Clean server frontend folder
cd ~/brflojvik/brflojvik-node/src/wwwroot/
rm -rf *

# Copy react build to server frontend folder
cp -r ~/brflojvik/brflojvik-react/build/. ~/brflojvik/brflojvik-node/src/wwwroot/

# Install server packages
cd ~/brflojvik/brflojvik-node/
npm install

# Restart server
pm2 restart all
