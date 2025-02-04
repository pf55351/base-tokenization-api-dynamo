# FHP Tokenization Api - DynamoDB

This software is provided "as is" without any warranties, express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. The **AWS Lambda** functions, developed with **TypeScript** and deployed via the **Serverless framework**, are designed to tokenize files on the **Algorand** blockchain.
Files will be stored on **Amazon S3**, and a set of transaction-related data is recorded in a **DynamoDB**.

**This release is recommended for mono wallet installations**

## Menu

- [Requirements](#requirements)
- [How to run in local](#how-to-run-in-local-rocket)
- [How to deploy on AWS](#how-to-deploy-on-aws-rocket)
- [How to test](#how-to-test)

## Requirements

List of requirements to run this project:

- Engine: [Nodejsv20](https://nodejs.org/en)
- Packet manager: [npm](https://www.npmjs.com/)
- Container: [Docker](https://www.docker.com/products/docker-desktop/)
- To deploy lambdas first of add on your machine aws credetianls:

```
./aws/credentias
```

and add `aws_access_key` and `aws_secret_key` whith the right policy.

```
[default]
aws_access_key=
aws_secret_key=
```

## How to run in local :rocket:

Follow these steps

- open folder `docker` and run

```
docker compose up --build -d
```

## How to deploy on AWS :rocket:

It's mandatory to have an administrator IAM user on AWS

#### S3

Create two buckets on S3.
You can choose whatever name, the first is for file that are uploaded, the second contains pdf template and fonts.
Put inside this bucket fonts and pdf template, you can find them in: `src/libs/pdf`.

#### Env

Create an `.env` file with these parameters that are public:

```
PINATA_GATEWAY = ''
CONTRACT_EXPIRE_UNIX_TS= ''
BUCKET_NAME=''
BUCKET_TEMPLATE=''
ALGO_EXPLORER=
API_KEY_NAME=
```

Add also these env that will be the key in parameters store

```
PINATA_JWT_TOKEN =""
MNEMONIC =""
```

#### Parameter store

Create items where name are the value inside `.env` and the really **secret** values.
Create it as **Secure String**

### Deploy on AWS

Run this command (test or prod stage):

```
npm deploy:prod --stage STAGE --region REGION
```

At the end of deploy you can obtain this result:

```
api keys:
  test-api-key: EYOnJzmBeN4Ax2jYZSdei930znEzDcA24KSe4sOc
endpoints:
  GET - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/status
  GET - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/file/{fileUUID}/certificate/download
  GET - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/file/{fileUUID}/download
  GET - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/file/{fileUUID}
  GET - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/files
  POST - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/file/verify
  POST - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/file/tokenize
  POST - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/folder/add
  GET - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/test/api/folders
functions:
  status: api-test-status (22 MB)
  download-tokenization-certificate: api-test-download-tokenization-certificate (22 MB)
  download-tokenization-file: api-test-download-tokenization-file (22 MB)
  retrieve-tokenization: api-test-retrieve-tokenization (22 MB)
  retrieve-tokenizations: api-test-retrieve-tokenizations (22 MB)
  verify-tokenization: api-test-verify-tokenization (22 MB)
  create-token: api-test-create-token (22 MB)
  create-folder: api-test-create-folder (22 MB)
  get-folders: api-test-get-folders (22 MB)
```

You can find the **API KEY** to use and the endpoints URL

## How to test

To test Api import into **Postman** files `collection.json` and `local-env.json` if you want to try in local or `test-env.json` if you want to try in test env

Enjoy :smile:
