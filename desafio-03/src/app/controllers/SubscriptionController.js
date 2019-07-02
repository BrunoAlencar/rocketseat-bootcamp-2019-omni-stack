import { isBefore, parse } from 'date-fns';
import * as Yup from 'yup';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';

import NewSubscriptionMail from '../jobs/NewSubscriptionMail';
import Queue from '../../lib/Queue';

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

    const promoter = await User.findOne({
      where: meetup.user_id,
    });
    const user = await User.findOne({
      where: subscription.user_id,
    });

    // quantas inscrições temos no evento
    const quantity = await Subscription.count({
      where: {
        meetup_id,
      },
    });

    await Queue.add(NewSubscriptionMail.key, {
      subscription: {
        promoter: promoter,
        user: user.name,
        created_at: parse(new Date()),
        quantity,
      },
    });

    return res.json(subscription);
  }

  async listUserMeetups(req, res) {
    // const meetups = await Subscription.findAll({
    //   where: {
    //     user_id: req.userId,
    //   },
    //   attributes: ['id'],
    //   include: [
    //     {
    //       model: Meetup,
    //       as: 'meetup',
    //       attributes: ['title', 'description', 'location', 'date'],
    //       order: [['date', 'DESC']],
    //     },
    //   ],
    // });
    const meetups = await Meetup.findAll({
      attributes: ['date', 'title', 'description', 'location'],
      order: [['date']],
      where: {
        date: { [Op.gte]: new Date() },
      },
      include: [
        {
          model: Subscription,
          as: 'subscription',
          where: {
            user_id: req.userId,
          },
          attributes: ['id'],
        },
      ],
    });
    res.json(meetups);
  }
}

export default new SubscriptionController();
