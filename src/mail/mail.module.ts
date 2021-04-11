import { MailerModule } from '@nest-modules/mailer';
import { Module } from '@nestjs/common';

import mailerconfig = require('../mailerconfig');
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRoot(mailerconfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
