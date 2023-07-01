import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  context: string;

  setContext(context: string) {
    this.context = context;
  }

  debug(message: string) {
    super.debug(message, this.context);
  }

  error(message: string) {
    super.error(message, this.context);
  }

  log(message: string) {
    super.log(message, this.context);
  }

  warn(message: string) {
    super.warn(message, this.context);
  }
}
