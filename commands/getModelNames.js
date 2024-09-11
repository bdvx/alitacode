// Copyright 2023 EPAM Systems
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const axios = require("axios");
const { alitaService } = require("../services");


module.exports = async function () {
  const data = await fetchDataFromServer();
  const array = [];
  data.forEach(entry => {
    if (entry.settings && Array.isArray(entry.settings.models)) {
      entry.settings.models.forEach(model => {
        if (model.name && entry.name) {
          array.push(`${entry.name}/${model.name}`);
        }
      });
    }
  });
  sortConfigMenuItemsByVendor(array);
  console.log(array);
  return array;
}


async function fetchDataFromServer2() {
  await alitaService.getEmbeddings();
}

function sortConfigMenuItemsByVendor(menutItemsArray) {
  return menutItemsArray.sort((a, b) => a - b);
}


// Temporary workaround
async function fetchDataFromServer() {
  const response =
    await sendRequest("/api/v1/integrations/integrations/default/97?offset=0&limit=10&sort_by=name&sort_order=asc");
  return response.data;
}


const sendRequest = async (url, data = null, method = "get") => {
  try {
    const response = await axios({
      method: method,
      url: "https://eye.projectalita.ai/main" + url,
      data: data,
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiOTg4Y2JmYWYtYTQ4NS00NDA3LWJmOGMtMDFlNzM3ZWEwNTkxIn0.RxLl7IfbgK89c5bTWjk1jypWbVURbjA73g2M5VFvBZavGceGqRhorzwq210hE7v0YKMaP2Axzch3_rlF_OGDQQ"
      }
    })
    return {
      url: response.url,
      status: response.status,
      data: response.data
    }
  } catch (error) {
    return {
      status: error.response.status,
    }
  }
};


