import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;

// json-server server.json -p 3333
// adiciona um watch para ficar vendo o server
// json-server server.json -p 3333 -w
// adicionsa um delay a api
// json-server server.json -p 3333 -d 2000
