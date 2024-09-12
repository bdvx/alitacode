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

const { alitaService } = require("../services");

module.exports = async function () {
  const data = await alitaService.getEmbeddings();
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
  array.sort((a, b) => a - b);
  return array;
}
