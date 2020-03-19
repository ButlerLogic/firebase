// This is a utility to automate the deployment process.
// It should only be executed as an npm script.
const path = require('path')
const fs = require('fs')
const exec = require('child_process').execSync

class Functions {
  // Configure the remote environment variables.
  static configure (debug = false) {
    let cfg

    try {
      cfg = require(path.join(process.cwd(), './.runtimeconfig.json'))
    } catch (e) {
      console.log(e.message)
      process.exit(1)
    }

    const traverse = require('traverse')
    const data = {}

    let leaves = traverse(cfg).reduce(function (acc, x) {
      if (this.isLeaf) {
        data[this.path.join('.')] = x
      }
    })

    if (Object.keys(data).length === 0) {
      process.exit(0)
    }

    let basefn = 'firebase functions:config:set'
    let cmd = basefn

    for (let [key, value] of Object.entries(data)) {
      cmd = `${cmd} ${key}="${value}"`
    }

    if (debug) {
      let cmd2 = basefn
      for (let [key, value] of Object.entries(data)) {
        cmd2 = `${cmd2} ${key}="${value.replace(/./gi, '*').substr(0, 7)}"`
      }
      console.log(`\n${cmd2}\n`)
    } else {
      console.log(`\n${cmd}\n`)
    }

    console.log(exec(cmd).toString())
  }

  // When setting up an existing project, run this
  // method to auto-extract the functions from
  static setup () {
    const fs = require('fs')
    const path = require('path')
    const klaw = require('klaw-sync')

    const files = klaw(process.cwd(), {
      // nodir: true,
      filter: item => {
        const basename = path.basename(item.path)
        return basename !== 'node_modules' // && path.extname(basename) === '.js' && basename.substr(0, 1) !== '_'
      }
    }).map(item => item.path).filter(item => path.extname(item) === '.js' && path.basename(item).substr(0, 1) !== '_')

    let content = ''
    files.forEach(filepath => content += '\n' + fs.readFileSync(filepath).toString())

    let re = /functions\.config\(\)\.([a-z0-9\.]+)/gim
    let variables = new Set()
    let matches

    while ((matches = re.exec(content)) !== null) {
      variables.add(matches[1])
      content.replace(matches[1], '')
    }

    if (variables.size === 0) {
      console.log('No configuration variables are used in this code base.')
      return
    }

    let cfgfile = path.join(process.cwd(), '.runtimeconfig.json')
    let result = {}
    if (fs.existsSync(cfgfile)) {
      result = require(cfgfile)
    }

    let processVariable = (namespace, data) => {
      let v = namespace.split('.')
      let current = v.shift()

      if (v.length > 0) {
        data[current] = processVariable(v.join('.'), data[current] || {})
      } else {
        data[current] = ''
      }

      return data
    }

    let meta = {}
    variables.forEach(v => processVariable(v, meta))

    fs.writeFileSync(cfgfile, JSON.stringify(meta, null, 2))

    console.log(`${cfgfile} file updated/created. Check it to make sure all the variables match your expectations.`)
    console.log(JSON.stringify(meta, null, 2))
  }
}

module.exports = Functions
