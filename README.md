# ![ThunderAI icon](images/icon-32px.png "ThunderAI") ThunderAI

ThunderAI is a Thunderbird Addon that uses the capabilities of ChatGPT, Google Gemini or Ollama to enhance email management.

It enables users to analyse, write, correct, assign tags, create calendar events and optimize their emails, facilitating more effective and professional communication.

ThunderAI is a tool for anyone looking to improve their email quality, both in content and grammar, making the writing process quicker and more intuitive. 

You can also define, export and import your own **[custom prompts](https://micz.it/thunderbird-addon-thunderai/custom-prompts/)**!

In any custom prompt you can use additional **[data placeholders](https://micz.it/thunderbird-addon-thunderai/data-placeholders/)**!


<br>

## ChatGPT Web Session Management

ThunderAI now supports seamless integration with the ChatGPT web interface using a logged-in session. This feature allows users to interact with ChatGPT without requiring an API key, leveraging the web session for authentication.

### How It Works
1. **Session Authentication**: ThunderAI automatically checks if the ChatGPT session is authenticated. If not, it prompts the user to log in to the ChatGPT web interface.
2. **Session State Maintenance**: The session state is maintained using browser cookies, ensuring uninterrupted interactions with ChatGPT.

### Configuration Options
- **Model Selection**: Users can specify the ChatGPT model to use (e.g., `gpt-4o`, `gpt-4`, etc.) in the options page.
- **Temporary Chat**: Enable or disable the use of temporary chats for specific interactions.
- **Custom Prompts**: Define and manage custom prompts to tailor ChatGPT responses to your needs.

### Deployment Instructions
To deploy ThunderAI with ChatGPT Web Session Management:
1. Ensure the browser extension is installed and permissions for `https://*.chatgpt.com/*` are granted.
2. Open the options page and configure the desired ChatGPT model and session settings.
3. Use the "Open ChatGPT Tab" button in the options page to log in to ChatGPT if not already authenticated.

For advanced users, the middleware service can be deployed in its own repository. Configure the following environment variables:
- `CHATGPT_SESSION_URL`: The endpoint URL for session authentication.
- `CHATGPT_API_URL`: The endpoint URL for sending prompts.
- `SESSION_REFRESH_INTERVAL`: Interval (in seconds) to refresh the session state.

For more details, refer to the [documentation](https://micz.it/thunderbird-addon-thunderai/).

<br>

## Web Session Analysis

For developers and advanced users, a detailed analysis of the web session handling implementation is available. This document provides insights into session management, request/response patterns, browser integration, and more.

[Read the Web Session Analysis](docs/ChatGPT_Web_Session_Analysis.md)


> [!TIP]
> **Using ChatGPT**
> 
> There is no need for an API key and is possibile to use this extension even with a free account, using the **ChatGPT web interface**!
> 
> If you want to connect with the OpenAI API integration, instead, you can use an **API Key**!

<br>

> [!TIP]
> **Using Google Gemini**
> 
> Connect directly with Google Gemini API, using also the _System Instructions_ option if needed.

<br>

> [!TIP]
> **Using Ollama**
>
> It's also possible to use a local Ollama server!
>
> Just remember to add `OLLAMA_ORIGINS = moz-extension://*` to the Ollama server environment variables.
> 
> [More info about CORS](https://micz.it/thunderbird-addon-thunderai/ollama-cors-information/)

<br>

> [!TIP]
> **Using an OpenAI Compatible API**
>
> You can also use a local OpenAI Compatible API server, like LM Studio!
> 
> There is also an option to remove the "v1" segment from the API url, if needed, and to manually set the model name if the server doesn't have a models list endpoint (like Gemini).


<br>

## Translations
Do you want to help translate this addon?

[Find out how!](https://micz.it/thunderbird-addon-thunderai/translate/)

<br>

## Changelog
ThunderAI's changes are logged [here](CHANGELOG.md).

<br>

## Privacy and Permissions
You can find all the information on [this page](https://micz.it/thunderbird-addon-thunderai/privacy-permissions/).

<br>

## Support this addon!
Are you using this addon in your Thunderbird?
<br>Consider to support the development making a small donation. [Click here!](https://www.paypal.com/donate/?business=UHN4SXPGEXWQL&no_recurring=1&item_name=Thunderbird+Addon+ThunderAI&currency_code=EUR)

<br>

## Attributions

### Translations
- English (en-US): [Mic](https://github.com/micz/)
- French (fr): Generated automatically, [Noam](https://github.com/noam-sc)
- German (de): Generated automatically
- Italian (it): [Mic](https://github.com/micz/)
- Polski (pl): [neexpl](https://github.com/neexpl)
- Português Brasileiro (pt-br): Bruno Pereira de Souza



<br>

### Graphics
- ChatGPT-4 for the help with the addon icon ;-)
- <a href="https://loading.io">loading.io</a> for the dynamic menu loading SVG
- [Fluent Design System](https://www.iconfinder.com/fluent-designsystem) for the Custom Prompts table sorting icons
- [JessiGue](https://www.flaticon.com/authors/jessigue) for the show/hide icon for api key fields


<br>


### Miscellaneous
- <a href="https://github.com/KudoAI/chatgpt.js">chatgpt.js</a> for providing methods to interact with the ChatGPT web frontend
- <a href="https://github.com/boxabirds">Julian Harris</a> for his project <a href="https://github.com/boxabirds/chatgpt-frontend-nobuild">chatgpt-frontend-nobuild</a>, that has been used as a starting point for the API Web Interface
- <a href="https://github.com/ali-raheem/Aify">Aify</a> for inspiration