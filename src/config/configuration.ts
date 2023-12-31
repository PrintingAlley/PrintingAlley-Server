export default () => ({
  ENVIRONMENT: process.env.NODE_ENV || 'local',
  API_URL: process.env.API_URL || 'http://localhost:8080',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USERNAME: process.env.DB_USERNAME || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || '1234',
  DB_NAME: process.env.DB_NAME || 'printing_alley_database',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID || '',
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET || '',
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID || '',
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || '',
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID || '',
  APPLE_KEY_ID: process.env.APPLE_KEY_ID || '',
  APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '',
  R2_ENDPOINT: process.env.R2_ENDPOINT || '',
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || '',
  R2_PUBLIC_DOMAIN: process.env.R2_PUBLIC_DOMAIN || '',
});
