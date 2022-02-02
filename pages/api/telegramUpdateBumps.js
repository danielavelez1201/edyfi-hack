import { spawn } from 'child_process'

async function handler(req, res) {
  var process = spawn('python', ['../../public/telegram/sample.py'])
  process.stdout.on('data', function (data) {
    console.log('in process')
    res.send(data.toString())
    res.end()
  })
}

export default handler
