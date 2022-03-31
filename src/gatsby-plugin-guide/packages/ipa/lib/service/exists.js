// Generated by CoffeeScript 2.6.1
// # `nikita.ipa.service.exists`

// Check if a service exists inside FreeIPA.

// ## Example

// ```js
// const {$status} = await nikita.ipa.service.exists({
//   principal: 'myprincipal/my.domain.com',
//   connection: {
//     url: "https://ipa.domain.com/ipa/session/json",
//     principal: "admin@DOMAIN.COM",
//     password: "mysecret"
//   }
// })
// console.info(`Service exists: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'principal': {
        type: 'string',
        description: `Name of the service to check for existence.`
      },
      'connection': {
        type: 'object',
        $ref: 'module://@nikitajs/network/lib/http#/definitions/config',
        required: ['principal', 'password']
      }
    },
    required: ['connection', 'principal']
  }
};

// ## Handler
handler = async function({config}) {
  var base, err;
  if ((base = config.connection.http_headers)['Referer'] == null) {
    base['Referer'] = config.connection.referer || config.connection.url;
  }
  try {
    await this.ipa.service.show({
      connection: config.connection,
      principal: config.principal
    });
    return {
      $status: true,
      exists: true
    };
  } catch (error) {
    err = error;
    if (err.code !== 4001) { // service not found
      throw err;
    }
    return {
      $status: false,
      exists: false
    };
  }
};


// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions,
    shy: true
  }
};
