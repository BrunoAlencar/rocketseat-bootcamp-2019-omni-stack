import File from '../models/File';
import User from '../models/User';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });
    let user = await User.findByPk(req.userId);
    user = await user.update({ avatar_id: file.id });

    return res.json({
      file,

      user: {
        id: user.id,
        name: user.name,
      },
    });
  }
}

export default new FileController();

// yarn sequelize migration:create --name=create-files
// yarn sequelize db:migrate
// yarn sequelize migration:create --name=add-avatar-field-to-users
