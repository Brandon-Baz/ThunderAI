# ![ThunderAI icon](images/icon-32px.png "ThunderAI") ThunderAI

ThunderAI is a Thunderbird Addon that uses the capabilities of ChatGPT | Google Gemini | Ollama to enhance email management.

It enables users to analyse, write, correct, assign tags, create calendar events and optimize their emails, facilitating more effective and professional communication.

ThunderAI is a tool for anyone looking to improve their email quality, both in content and grammar, making the writing process quicker and more intuitive. 

You can also define, export and import your own **[custom prompts](https://micz.it/thunderbird-addon-thunderai/custom-prompts/)**!

In any custom prompt you can use additional **[data placeholders](https://micz.it/thunderbird-addon-thunderai/data-placeholders/)**!


<br>


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
