FROM node
 
RUN mkdir -p src 
COPY ./ /src/

WORKDIR /src
 
RUN npm install --legacy-peer-deps

EXPOSE 8080
 
CMD ["npm", "start"]