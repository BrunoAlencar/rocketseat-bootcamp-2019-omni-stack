import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach({ key, handle } => {
      this.queues[key] = new Bee(key, {
        redis: {}
      })
    } )
  }
}

export default new Queue();
