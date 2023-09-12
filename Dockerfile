FROM node:16-alpine3.15

WORKDIR /app

#RUN chown -R node:node /app

#--chown=node:node
COPY package*.json ./

#USER node

# To Fix Permissions for Packages
RUN npm config set unsafe-perm true

RUN npm install

COPY . .

#RUN #chown -R node /app/node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
