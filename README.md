# Smac Corpus API - A clean RESTful API with Node.js

## Prerequisites

-   Node.js
-   Git
-   Sign server and client certificates

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ~/.ssh/server.key -out ~/.ssh/server.crt
```

## Getting started

Follow these steps at the command line:

### 1. Clone and Install

```bash
git clone https://github.com/aphd/smac-corpus-api.git
cd smac-corpus-api
npm install
```

### 2. Set the environment variables

```bash
echo "DB_URL=mongodb+srv://<user>:<password>@cluster0-euwvg.mongodb.net" > .env
echo "HTTP_PORT=<__HTTP_PORT__>" >> .env
echo "HTTPs_PORT=<__HTTPS_PORT__>" >> .env
echo "PRIVATE_KEY=<__PRIVATE_KEY__>" >> .env
echo "CERTIFICATE=<__CERTIFICATE__>" >> .env
```

### 3. Run the service

```bash
npm run start
```

### 4. Load smart contracts into mongoDB

```bash
node --experimental-modules src/utils/index.mjs
```


### References

<ol>
  <li>Watch the companion video at: https://www.youtube.com/watch?v=fy6-LSE_zjI</li>
  <li>https://etherscan.io/apis#contracts</li>
</ol> 
