import { isBefore, parse } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
        date: {
          [Op.gte]: new Date(),
        },
      },
    });

    res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      date: Yup.date().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date, title, description, location, banner_id } = req.body;

    const dateMeetup = parse(date);
    if (isBefore(dateMeetup, new Date())) {
      return res.status(400).json({
        error: 'Date is invalid',
      });
    }

    const bannerExists = await File.findByPk(banner_id);
    if (!bannerExists) {
      return res.status(400).json({
        error: 'Banner is should exists',
      });
    }

    const userExists = await User.findByPk(req.userId);
    if (!userExists) {
      return res.status(400).json({
        error: 'User should exists',
      });
    }

    const meetup = await Meetup.create({
      date,
      title,
      description,
      location,
      banner_id,
      user_id: req.userId,
    });

    res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      date: Yup.date(),
      description: Yup.string(),
      location: Yup.string(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date, title, description, location, banner_id } = req.body;

    const dateMeetup = parse(date);
    if (isBefore(dateMeetup, new Date())) {
      return res.status(400).json({
        error: 'Date is invalid',
      });
    }

    const userExists = await User.findByPk(req.userId);
    if (!userExists) {
      return res.status(400).json({
        error: 'User should exists',
      });
    }

    const meetupBelongsToUser = await Meetup.findByPk(req.params.id);
    if (meetupBelongsToUser.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You do not have permission',
      });
    }

    const meetup = await meetupBelongsToUser.update(req.body);

    res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        error: 'You do not have permission',
      });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(401).json({
        error: 'This meetup already happens',
      });
    }

    await meetup.destroy();

    res.json(meetup);
  }
}

export default new MeetupController();
