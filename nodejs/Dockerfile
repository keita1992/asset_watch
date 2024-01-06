FROM node:18.17.1

ARG USER_ID
ARG GROUP_ID
ARG APP_NAME

RUN apt-get -y upgrade && apt-get -y update && apt-get -y install vim bash

# グループ作成が失敗した場合にスキップ
RUN groupadd -g ${GROUP_ID} appuser || true && \
  useradd -l -u ${USER_ID} -g ${GROUP_ID} -m appuser

USER appuser

# デフォルトシェルをbashに変更
CMD ["bash"]

WORKDIR /app