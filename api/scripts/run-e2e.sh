#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
source "$DIR/setup-prisma.sh"
doppler run -- yarn run test:integration
