FROM ubuntu:22.04
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*
COPY main.cpp /app/
RUN g++ /app/main.cpp -o /app/my-program
CMD ["/app/my-program"]