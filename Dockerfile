# create a base image of node for us to use as our base for each step
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal AS nodejs

# Use RedHats latest build of Nodejs on RHEL8
FROM nodejs AS builder

# set user to root to create a directory
USER 0

# Set working directory to the /src directory
WORKDIR /app

#Set user 1001 to root and set owner of app to 1001
RUN chown -R 1001:0 /app

#copy over files to create the build
COPY --chown=1001:0 . /app

#set user to 1001
USER 1001

#install all dependencies
RUN npm ci

#second stage to create the final clean
FROM nodejs AS pruner

# Set working directory to the /src directory
WORKDIR /app

#copy everything over from first builder to new builder
COPY --from=builder /app /app

#set user to root to remove files from final build
USER 0

#build the production version
RUN npm run build

#third stage
FROM nodejs

#Set working dir
WORKDIR /app

#copy from second stage builder for final app run
COPY --from=pruner /app /app

#builds and starts server
CMD ["npm", "start"]
