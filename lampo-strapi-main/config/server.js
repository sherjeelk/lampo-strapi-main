module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  cron: {enabled: true},
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '5cf7afe4fa1c99afded3e4d813d06b9d'),
    },
  },
});
