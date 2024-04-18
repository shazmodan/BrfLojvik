# This script requires that the server has a GitHub SSH key.
# It also requires that the gitconfig looks like this:
# [user]
#         name = William Bergqvist
#         email = shazmodan@gmail.com
#         user = shazmodan

# [credential]
#         helper = store

# [branch "master"]
#     remote = origin
#     merge = refs/heads/master

#ssh -i "AWS-EC2-Ubuntu-BrfLojvik.pem" ubuntu@ec2-13-48-59-137.eu-north-1.compute.amazonaws.com
#sudo ufw allow 80/tcp


### CERTBOT SSL SETTINGS ###

# ubuntu@ip-172-31-46-17:/etc/nginx$ sudo certbot --nginx -d brflojvik.se -d www.brflojvik.se
# Saving debug log to /var/log/letsencrypt/letsencrypt.log
# Plugins selected: Authenticator nginx, Installer nginx
# Obtaining a new certificate
# Performing the following challenges:
# http-01 challenge for brflojvik.se
# http-01 challenge for www.brflojvik.se
# Waiting for verification...
# Cleaning up challenges
# Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/brflojvik.se
# Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/brflojvik.se

# Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# 1: No redirect - Make no further changes to the webserver configuration.
# 2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
# new sites, or if you're confident your site works on HTTPS. You can undo this
# change by editing your web server's configuration.
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
# Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/brflojvik.se
# Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/brflojvik.se

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# Congratulations! You have successfully enabled https://brflojvik.se and
# https://www.brflojvik.se

# You should test your configuration at:
# https://www.ssllabs.com/ssltest/analyze.html?d=brflojvik.se
# https://www.ssllabs.com/ssltest/analyze.html?d=www.brflojvik.se
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# IMPORTANT NOTES:
#  - Congratulations! Your certificate and chain have been saved at:
#    /etc/letsencrypt/live/brflojvik.se/fullchain.pem
#    Your key file has been saved at:
#    /etc/letsencrypt/live/brflojvik.se/privkey.pem
#    Your cert will expire on 2020-10-13. To obtain a new or tweaked
#    version of this certificate in the future, simply run certbot again
#    with the "certonly" option. To non-interactively renew *all* of
#    your certificates, run "certbot renew"
#  - If you like Certbot, please consider supporting our work by:

#    Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
#    Donating to EFF:                    https://eff.org/donate-le



#######################
# How to deploy
#######################

# 1. Run this file, cd into the same folder and type bash deploy.sh
# 2. A remote connection is made to the AWS Nano Ubuntu server.
# 3. The remoteCmds.sh is run. See that file for more info.

ssh-add -k /home/william/Documents/AWS-EC2-Ubuntu-BrfLojvik.pem
# cat remoteCmds.sh | ssh bitnami@3.8.143.32
cat remoteCmds.sh | ssh ubuntu@13.49.68.107