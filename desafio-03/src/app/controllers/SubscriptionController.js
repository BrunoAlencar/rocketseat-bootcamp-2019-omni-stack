import { isBefore, parse } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

    // é o organizador? is the organizer?
    if (meetup.user_id == req.userId) {
      return res.status(400).json({
        error: 'You can not subscript in your Meetup',
      });
    }

    // já passou? it already happens?
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'You can not subscript in old Meetups',
      });
    }

    const isAlreadySubscribed = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id,
      },
    });
    if (isAlreadySubscribed) {
      return res.status(400).json({
        error: 'You are already subscribed!',
      });
    }

    const subscriptionsSameDate = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['date'],
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (subscriptionsSameDate.length !== 0) {
      return res.status(400).json({
        error: 'You already have this date busy',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
