# DHIS2 PROGRAM CERTIFICATE EXAMPLE

## What's inside this example?

- Customized backend for talking with DHIS2
- Simple public portal for certificate generation
- QRCode service
- One database backup for example DHIS2 instance with covid19 vaccination package installed

## Setting up

- Install NodeJS (version 14 or above)
- Set up QRCode service (documentation coming soon)
- Deploy the DHIS2 example instance using the database backup (DHIS2 version 2.35.8 or above)
- Run the command `yarn install` in the root directory
- In the root directory, configure the `config.js` file: put the base url, username, password for DHIS2 and QRCode service

## RUN

- In root directory, run the command `yarn start`
- Example public portal will be available on `http://localhost:8080`
- Example backend APIs will be available on `http://localhost:8080/api`

## How to use

- **Generate certificate inside tracker capture**
  - Go to tracker capture, select the person
  - Create one event of Vaccination Certificate program stage
  - Click `GENERATE CERTIFICATE` button
- **Generate certificate using public portal**
  - Go to public portal `http://localhost:8080`
  - Input SystemID and Phone number
  - Input the captcha
  - Click `GENERATE` button