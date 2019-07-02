import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // get mail config
    const { host, port, secure, auth } = mailConfig;
    // set transporter config and create
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    // call config templates
    this.configureTemplates();
  }

  // configure template of email
  configureTemplates() {
    // email template path
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    // using email template path and adding configs to
    // partials and layouts
    // setting default template default.hbs
    // and the extension of templates .hbs
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // calls send email from transporter and add config and message
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
