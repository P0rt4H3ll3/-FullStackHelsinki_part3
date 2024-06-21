import axios from "axios";
const baseUrl = "/api/persons"; //added the new endpoint
//build a dockerfile
//deployed to fly.io (backend first, following is npm run build and mode dist directory)

const getAll = () => {
  const request = axios.get(baseUrl);
  console.log("in the requests getAll this is request> ", request);
  return request.then((response) => response.data);
};

const create = (dataObject) => {
  const request = axios.post(baseUrl, dataObject);
  console.log("in the requests create this is request> ", request);
  return request.then((response) => response.data);
};

const deleteEntry = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  console.log("in the requests delete this is request> ", request);
  return request.then((response) => response.data);
};

const update = (id, dataObject) => {
  const request = axios.put(`${baseUrl}/${id}`, dataObject);
  return request.then((response) => response.data);
};

export default { getAll, create, deleteEntry, update };
