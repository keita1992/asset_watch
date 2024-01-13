FROM node:18.17.1

ARG USER_ID
ARG GROUP_ID
ARG APP_NAME

# 必要なパッケージのインストール
RUN apt-get -y upgrade && apt-get -y update && \
  apt-get -y install vim bash sudo

# グループ作成が失敗した場合にスキップ
RUN groupadd -g ${GROUP_ID} appuser || true && \
  useradd -l -u ${USER_ID} -g ${GROUP_ID} -m appuser

# appuserにsudo権限を付与
# パスワードなしでsudoを実行できるように設定（任意）
RUN echo 'appuser ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

# ユーザーを切り替え
USER appuser

# デフォルトシェルをbashに変更
CMD ["bash"]

# 作業ディレクトリの設定
WORKDIR /app
