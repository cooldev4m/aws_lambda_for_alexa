const axios = require('axios').default;

const VF_API_KEY = "VF.DM.663b555fadc9d22666fe5885.LOwY6WCEocoAPTbM";

module.exports.interact = async function interact(chatID, request) {
  let messages = [];
  console.log(`request: ` + JSON.stringify(request));

  const response = await axios.post(`https://general-runtime.voiceflow.com/state/user/${chatID}/interact`, {
    action: request
  }, {
    headers: {
      Authorization: VF_API_KEY
    }
  });

  for (const trace of response.data) {
    switch (trace.type) {
      case "text":
      case "speak":
        {
          // remove break lines
          messages.push(this.filter(trace.payload.message));
          break;
        }
      case "end":
        {
          messages.push("Bye!");
          break;
        }
    }
  }

  console.log(`response: ` + messages.join(","));
  return messages;
};

module.exports.filter = function filter(string) {
  string = string.replace(/\&#39;/g, '\'')
  string = string.replace(/(<([^>]+)>)/ig, "")
  string = string.replace(/\&/g, ' and ')
  string = string.replace(/[&\\#,+()$~%*?<>{}]/g, '')
  string = string.replace(/\s+/g, ' ').trim()
  string = string.replace(/ +(?= )/g, '')

  return string;
}

module.exports.alexaDetectedEntities = function alexaDetectedEntities(alexaRequest) {
  let entities = [];
  if (alexaRequest.request.intent.slots) {
    const entitiesDetected = alexaRequest.request.intent.slots;
    for (const entity of Object.values(entitiesDetected)) {
      entities.push({
        name: entity.name,
        value: entity.value
      });
    }
    console.log('~~~~~ Entities Detected:', entities);
  }
  return entities;
}
