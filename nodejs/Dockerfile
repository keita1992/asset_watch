FROM node:20

# 必要なパッケージのインストール
RUN apt-get -y update && apt-get -y upgrade && \
  apt-get -y install vim bash sudo && \
  rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係のインストールと開発サーバーの起動は docker-compose.yml の command で行う
CMD ["bash"]
