# Asset Watch

Welcome to **Asset Watch** - your dynamic dashboard for monitoring your financial portfolio. This application enables users to input their cash, stocks, and other investments to visualize their asset allocation and assess risk effectively.

## Features

- **Portfolio Visualization**: Get a comprehensive overview of your asset distribution across different categories.
- **Risk Assessment**: Evaluate the potential risks associated with your investment choices.
- **Real-time Updates**: Keep your dashboard up-to-date as you add or modify your investments.

## Demo

Experience Asset Watch firsthand through our live demo: [https://asset-watch.keita1992.link/](https://asset-watch.keita1992.link/)

## Technology Stack

Asset Watch leverages a modern tech stack including:

- **Frontend**: Developed with Next.js for a seamless user experience.
- **Infrastructure**: Hosted on AWS, utilizing services such as AWS Amplify, DynamoDB, API Gateway, and Lambda for robust and scalable performance.
- **Containerization**: Supported by Docker, facilitating straightforward setup and development across various environments.

## Getting Started

### Prerequisites

- Docker（Docker Desktop など）

### ローカルで起動する（サンプルデータ）

```bash
git clone https://github.com/keita1992/asset_watch.git
cd asset_watch
docker compose up --build
```

初回は依存パッケージのインストールに数分かかります。ログに `Ready` と出たら http://localhost:3000 を開いてください。

- 既定では `USE_MOCK_DATA=true` で起動し、AWS に接続せずメモリ上のサンプルデータを使います（`src/libs/mockClient.ts`）。追加・編集・削除も動きますが、コンテナを再起動すると初期データに戻ります。
- 停止は `Ctrl+C`、片付けは `docker compose down`。

### 実データ（AWS）で起動する

`amplify pull` などで `src/aws-exports.js` を用意し、モックを無効にして起動します。

```bash
USE_MOCK_DATA=false docker compose up --build
```

### Docker を使わない場合

```bash
yarn install --frozen-lockfile
USE_MOCK_DATA=true yarn dev
```
