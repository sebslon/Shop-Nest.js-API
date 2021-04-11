import { HandlebarsAdapter } from '@nest-modules/mailer';

export = {
  transport: 'smtp://USERNAME:PASSWORD@HOST:PORT',
  defaults: {
    from: 'MAIL@MAIL.COM',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
