# Get latest version
cd ~/develop/brflojvik/

# Build the react project
cd ~/develop/brflojvik/brflojvik-react/
npm install
npm run build

# Clean server frontend folder
cd ~/develop/brflojvik/brflojvik-node/src/wwwroot/
rm -rf *

# Copy react build to server frontend folder
cp -r ~/develop/brflojvik/brflojvik-react/build/. ~/develop/brflojvik/brflojvik-node/src/wwwroot/

# Install server packages
cd ~/develop/brflojvik/brflojvik-node/
npm install
