
echo "Hello World" > /home/coder/work/onyxia-ui/hello.txt
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn
sudo sysctl -w fs.inotify.max_user_watches=12288
