FROM node:20

# 必要なパッケージのインストール
RUN apt-get -y upgrade && apt-get -y update && \
  apt-get -y install vim bash sudo

# デフォルトシェルをbashに変更
CMD ["bash"]

# 作業ディレクトリの設定
WORKDIR /app
