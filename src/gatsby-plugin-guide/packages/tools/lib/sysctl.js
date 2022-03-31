// Generated by CoffeeScript 2.6.1
  // # `nikita.tools.sysctl`

// Configure kernel parameters at runtime.

// Target file will be overwritten by default, use the `merge` option to preserve existing variables.

// Comments will be preserved if the `comments` and `merge` config are enabled.

// ## Output

// * `$status`  (boolean)   
  //   Value is "true" if the property was created or updated.

// ## Usefull Commands

// * Display all sysctl variables   
  //   `sysctl -a`
  // * Display value for a kernel variable   
  //   `sysctl -n kernel.hostname`
  // * Set a kernel variable
  //   `echo "value" > /proc/sys/location/variable`
  //   `echo 'variable = value' >> /etc/sysctl.conf && sysctl -p`
  //   `echo '0' > /proc/sys/fs/protected_regular && sysctl -p && sysctl -a | grep 'fs.protected_regular = 0'`

// ## Example

// ```js
  // const {$status} = await nikita.tools.sysctl({
  //   source: '/etc/sysctl.conf',
  //   properties: {
  //     'vm.swappiness': 1
  //   }
  // })
  // console.info(`Systcl was reloaded: ${$status}`)
  // ```

// ## Schema definitions
var definitions, handler, utils,
  indexOf = [].indexOf;

definitions = {
  config: {
    type: 'object',
    properties: {
      'backup': {
        type: ['string', 'boolean'],
        description: `Create a backup, append a provided string to the filename extension or
a timestamp if value is not a string, only apply if the target file
exists and is modified.`
      },
      'comment': {
        type: 'boolean',
        description: `Preserve comments.`
      },
      'load': {
        type: 'boolean',
        default: true,
        description: `Load properties if target is modified.`
      },
      'merge': {
        type: 'boolean',
        description: `Preserve existing variables in the target file.`
      },
      'properties': {
        type: 'object',
        description: `Key/value object representing sysctl properties and values.`
      },
      'target': {
        type: 'string',
        default: '/etc/sysctl.conf',
        description: `Destination to write properties and load in sysctl settings, default
to "/etc/sysctl.conf" if none given.`
      }
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var $status, current, data, err, final, i, k, key, len, line, ref, ref1, v, value;
  // Read current properties
  current = {};
  $status = false;
  log({
    message: `Read target: ${config.target}`,
    level: 'DEBUG'
  });
  try {
    ({data} = (await this.fs.base.readFile({
      target: config.target,
      encoding: 'ascii'
    })));
    ref = utils.string.lines(data);
    for (i = 0, len = ref.length; i < len; i++) {
      line = ref[i];
      // Preserve comments
      if (/^#/.test(line)) {
        if (config.comment) {
          current[line] = null;
        }
        continue;
      }
      if (/^\s*$/.test(line)) {
        current[line] = null;
        continue;
      }
      [key, value] = line.split('=');
      // Trim
      key = key.trim();
      value = value.trim();
      // Skip property
      if (indexOf.call(config.properties, key) >= 0 && (config.properties[key] == null)) {
        log(`Removing Property: ${key}, was ${value}`, {
          level: 'INFO'
        });
        $status = true;
        continue;
      }
      // Set property
      current[key] = value;
    }
  } catch (error) {
    err = error;
    if (err.code !== 'NIKITA_FS_CRS_TARGET_ENOENT') {
      throw err;
    }
  }
  // Merge user properties
  final = {};
  if (config.merge) {
    for (k in current) {
      v = current[k];
      final[k] = v;
    }
  }
  $status = false;
  ref1 = config.properties;
  for (key in ref1) {
    value = ref1[key];
    if (value == null) {
      continue;
    }
    if (typeof value === 'number') {
      value = `${value}`;
    }
    if (current[key] === value) {
      continue;
    }
    log(`Update Property: key \"${key}\" from \"${final[key]}\" to \"${value}\"`, {
      level: 'INFO'
    });
    final[key] = value;
    $status = true;
  }
  if ($status) {
    await this.file({
      target: config.target,
      backup: config.backup,
      content: ((function() {
        var results;
        results = [];
        for (key in final) {
          value = final[key];
          if (value != null) {
            results.push(`${key} = ${value}`);
          } else {
            results.push(`${key}`);
          }
        }
        return results;
      })()).join('\n')
    });
  }
  if (config.load && $status) {
    return (await this.execute(`sysctl -p ${config.target}`));
  }
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};

// ## Dependencies
utils = require('./utils');