import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasOne(models.Subscription, {
      foreignKey: 'meetup_id',
      as: 'subscription',
    });
  }
}

export default Meetup;
