#!/bin/bash
export DB_URL=postgresql://root:root@localhost:5431/test
yarn run prisma migrate deploy
