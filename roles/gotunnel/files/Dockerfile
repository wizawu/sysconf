FROM golang:1.15.0-alpine as intermediate
RUN apk add git
RUN go get github.com/wizawu/gotunnel

FROM alpine:3.12.0
COPY --from=intermediate /go/bin/gotunnel /usr/bin/gotunnel
ENTRYPOINT ["gotunnel"]
