FROM golang:1.20.3-bullseye

ENV PATH="/root/.cargo/bin:${PATH}"
ENV USER=root

#INSTALL RUST
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
  && rustup default stable \
  && rustup target add x86_64-unknown-linux-gnu

WORKDIR /go/src
RUN ln -sf /bin/bash /bin/sh
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .

RUN cd /go/pkg/mod/github.com/j178/tiktoken-go@v0.2.1/tiktoken-cffi && \
  cargo build --release

CMD [ "tail", "-f", "/dev/null" ]
