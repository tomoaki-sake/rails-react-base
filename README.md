# What is this
Rails API ✖️ React のベースです。

## Step1
backendディレクトリにて
```terminal
docker-compose build
docker-compose run api rails db:create
docker-compose up -d
```

## Step2
frontendディレクトリにて
```terminal
yarn
yarn start
```