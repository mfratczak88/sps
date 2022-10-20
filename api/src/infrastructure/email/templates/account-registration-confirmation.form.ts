import { compile } from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export class AccountRegistrationConfirmationForm {
  constructor(
    private readonly url: string,
    private readonly name: string,
    private readonly lang: string,
  ) {}

  renderHtml(): string {
    return compile(
      fs.readFileSync(
        path.join(
          __dirname,
          `/account-registration-confirmation.${this.lang.toLowerCase()}.hbs`,
        ),
        'utf8',
      ),
    )({
      url: this.url,
      name: this.name,
    });
  }

  get subject(): string {
    if (this.lang == 'PL') {
      return 'Potwierdź założenie konta | Vappy';
    } else {
      return 'Confirm account creation | Vappy';
    }
  }
}
