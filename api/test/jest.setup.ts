// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

// running from IDE ?
if (process.env.DOPPLER_LOAD) {
  const envs = execSync('doppler secrets download --no-file --format env');
  const newEnvs = dotenv.parse(envs);
  process.env = {
    ...process.env,
    ...newEnvs,
  };
}
// Alter the DB URL to not swipe local dev DB
// All data is purged during testing
process.env.DB_URL = 'postgresql://root@localhost:26258/test';
jest.setTimeout(10000);
