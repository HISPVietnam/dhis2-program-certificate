import { dhis2, svs } from "../config.js";

const { baseUrl, username, password } = dhis2;
const { svsBaseUrl, svsUsername, svsPassword } = svs;
import fetch from "node-fetch";
import btoa from "btoa";

const pull = (endPoint) => {
  return fetch(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  })
    .then((result) => result.json())
    .then((json) => json)
    .catch((err) => err);
};

const svsPull = (endPoint) => {
  return fetch(svsBaseUrl + endPoint, {
    headers: {
      Authorization: !svsUsername ? "" : "Basic " + btoa(`${svsUsername}:${svsPassword}`)
    }
  })
    .then((result) => result)
    .catch((err) => err);
};

const svsPost = (endPoint, payload) => {
  return fetch(svsBaseUrl + endPoint, {
    credentials: "include",
    method: "POST",
    headers: {
      Authorization: !svsUsername ? "" : "Basic " + btoa(`${svsUsername}:${svsPassword}`)
    },
    body: payload
  }).then((result) => result);
};

const push = (endPoint, payload, method, contentType) => {
  return fetch(baseUrl + endPoint, {
    method: method ? method : "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": contentType || "application/json",
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  })
    .then((result) => {
      return result.json();
    })
    .catch((err) => {
      return err;
    });
};

export { pull, push, svsPull, svsPost };
