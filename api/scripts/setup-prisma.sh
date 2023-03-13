#!/bin/bash
export DB_URL=postgresql://root@localhost:26258/test
yarn run prisma migrate deploy
