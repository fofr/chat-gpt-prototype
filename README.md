# Experiments with ChatGPT API

Experiments with the OpenAI API.

Allows setting of different system prompts using markdown files.

Example prompt:

```md
---
name: Keyword generator
description: Gives a comma separated list of keywords
markdown: true
---
You are a helper for generating keywords.
Given a description or a list of keywords, you need to generate 50 keywords.
Keywords must be comma separated and LOWER CASE. 1 word per keyword.
Put the most important keyword first.
```

## Requirements

Node.js v18

## Installation

1. Clone this repository.

2. Install the dependencies:\
`npm install`

3. [Generate an OpenAI API key](https://platform.openai.com/account/api-keys).

4. Set the `OPENAI_API_KEY` environment variable to the value of your key.

5. Start the application:\
`nvm use; npm start`
