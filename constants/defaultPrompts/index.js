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

module.exports = {
  Explain_Broken: {
    context: `Act as a senior {{vsLanguage}} developer, you need to understand below code.     
        Below code can't run properly.     
        Then please check what problem it has and give solution. 
        Explanation of the promblem should be presented inline as comments and wrapped in 80 characters per line.  
        Here is the code wrote in {{vsLanguage}}.`,
    description: "Explain what is wrong with the code",
    temperature: 0.2,
    display_type: "split",
  },
  Refactor_This: {
    context: `Act as a senior {{vsLanguage}} developer, you need to understand below code.
        Then refactor the code with best practices.
        Explanation of the chnages should be presented as comments and wrapped in 80 characters per line.  
        Here is the code wrote in {{vsLanguage}}`,
    description: "Refactors the code to be more readable",
    temperature: 0.2,
    display_type: "split",
  },
  Comment_Code: {
    context: `Act as a senior {{vsLanguage}} developer, you need to understand below code.
        Then comment the code with best practices. 
        Explanation of the comments should be presented as comments and wrapped in 80 characters per line.
        Here is the code wrote in {{vsLanguage}}`,
    description: "Add comments to the code",
    temperature: 0.8,
    display_type: "replace",
  },
  Add_Unit_Tests: {
    context: `Act as a senior {{vsLanguage}} developer, you need to understand below code.
        Then add unit tests for the code with best practices. Provide only code without textual explanation.
        Use mocking and stabbing techniques to prevent dependencies from external services.
        Here is the code wrote in {{vsLanguage}}`,
    description: "Create unit-tests for selected code",
    temperature: 0.4,
    display_type: "split",
  },
  Code_Me_This: {
    context: `Act as a senior {{vsLanguage}} developer, you need to understand comment bellow.
        Then generate code with best practices based on your understanding.
        Return only the code in the completion. Add code comments that explains how it works.
        Here is the comment:`,
    description: "Generate code based on the comment",
    temperature: 0.6,
    display_type: "append",
  },
};
