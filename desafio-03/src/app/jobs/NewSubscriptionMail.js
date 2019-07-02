import { format, parse } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class NewSubscriptionMail {
  get key() {
    return 'NewSubscriptionMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${subscription.promoter.name} <${subscription.promoter.email}>`,
      subject: 'Nova inscrição',
      template: 'newSubscriptionMail',
      context: {
        promoter: subscription.promoter.name,
        user: subscription.user,
        quantity: subscription.quantity,
        date: format(
          parse(subscription.created_at),
          '[dia] DD [de] MMMM[, às] H:mm[h]',
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewSubscriptionMail();
