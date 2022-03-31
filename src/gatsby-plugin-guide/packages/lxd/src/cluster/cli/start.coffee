
nikita = require '@nikitajs/core/lib'
require '@nikitajs/lxd/src/register'
require '@nikitajs/log/src/register'
path = require 'path'

key = path.relative process.cwd(), "#{__dirname}/../../../assets/.vagrant/machines/default/virtualbox/private_key"

module.exports = ({params}) ->
  await nikita
    $debug: params.debug
  .log.cli pad: host: 20, header: 60
  .log.md basename: 'start', basedir: params.log, archive: false, $if: params.log
  .execute
    $header: 'Dependencies'
    $unless_exec: 'vagrant plugin list | egrep \'^vagrant-vbguest \''
    command: '''
    vagrant plugin install vagrant-vbguest
    '''
  .execute
    $header: 'Vagrant'
    cwd: "#{__dirname}/../../../assets"
    command: '''
    vagrant up
    '''
  .execute
    $header: 'LXC remote'
    command: '''
    lxc remote add nikita 127.0.0.1:8443 --accept-certificate --password secret
    lxc remote switch nikita
    '''
  .execute
    $header: 'LXC remote (update)'
    # todo: use condition for `lxc ls`
    command: '''
    lxc ls || {
      lxc remote switch local
      lxc remote remove nikita
      lxc remote add nikita --accept-certificate --password secret 127.0.0.1:8443
      lxc remote switch nikita
    }
    '''
  .call ->
    $disabled: true
    command: """
    ssh -i #{key} -qtt -p 2222 vagrant@127.0.0.1 -- "cd /nikita && bash"\n
    """
    stdin: process.stdin
    stderr: process.stderr
    stdout: process.stdout
  .call ->
    $header: 'Connection'
    process.stdout.write """
    ssh -i #{key} -qtt -p 2222 vagrant@127.0.0.1 -- "cd /nikita && bash"\n
    """