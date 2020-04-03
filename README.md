# Smac Corpus API - A RESTful API with Node.js

## Prerequisites

-   Node.js
-   Git

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
echo "PORT=<__HTTP_PORT__>" >> .env
```

### 3. Run the service

```bash
npm run start
```

### 4. Load smart contracts into mongoDB

```bash
node --experimental-modules src/utils/client.mjs
```

### How to Compress/Extract contracts files

To compress the smart contracts' data

```bash
cd src/
7z a -t7z json.7z json
```

To extract the smart contracts' data

```bash
cd data
7za  x json.7z
```

### References

<ol>
  <li>Watch the companion video at: https://www.youtube.com/watch?v=fy6-LSE_zjI</li>
  <li>https://etherscan.io/apis#contracts</li>
</ol>
