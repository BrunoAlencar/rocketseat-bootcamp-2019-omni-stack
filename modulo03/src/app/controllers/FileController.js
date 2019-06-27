import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();

// yarn sequelize migration:create --name=create-files
// yarn sequelize db:migrate
// yarn sequelize migration:create --name=add-avatar-field-to-users
