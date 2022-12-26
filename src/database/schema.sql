CREATE DATABASE ogmo;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE,
    phone_number VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_login VARCHAR NOT NULL,
    user_password VARCHAR NOT NULL,
    should_update BOOLEAN NOT NULL DEFAULT true,
    last_update TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_request (
    id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parede VARCHAR,
    requi VARCHAR,
    operacao VARCHAR,
    turno VARCHAR,
    ter VARCHAR,
    funcao VARCHAR,
    forma VARCHAR,
    navio VARCHAR,
    ber VARCHAR,
    cais VARCHAR,
    requisitante VARCHAR,
    status VARCHAR,
    worker_id UUID NOT NULL,
    FOREIGN KEY(worker_id) REFERENCES users(id)
);