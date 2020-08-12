FROM golang:1.15.0-alpine

RUN apk add git
RUN go get github.com/xjdrew/gotunnel

ENTRYPOINT ["gotunnel"]
