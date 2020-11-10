const { create } = require('@open-wa/wa-automate')
const welcome = require('./welcome.js')
const msgHandler = require('./msgHandler')
const msgHandler1 = require('./msgHandler1')
const msgHandler2 = require('./msgHandler2')
const msgHandler3 = require('./msgHandler3')
const fs = require('fs-extra')
const serverOption = {
    headless: true,
    cacheEnabled: false,
    useChrome: true,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
    serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async (client) => {
	global.gclient = client
    global.sendingAnimatedSticker = []
    global.queueAnimatedSticker = []
    global.amdownloaden = []
    global.queuemp3 = []
    global.queuemp4 = []
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
        })
        // listening on message
        client.onMessage((message) => {
            msgHandler(client, message)
            msgHandler1(client, message)
            msgHandler2(client, message)
            msgHandler3(client, message)
    })
    client.onGlobalParicipantsChanged((event) => {
        welcome(client, event)
        })
        
        client.onAddedToGroup((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 1) { 
            	client.sendText(chat.id, `Este grupo possui ${totalMem} membro, é necessário 1 para iniciar`).then(() => client.leaveGroup(chat.id))
            	client.deleteChat(chat.id)
            } else {
                client.sendText(chat.groupMetadata.id, `Olá, obrigado por adicionar o icarusBOT*${chat.contact.name}*. Use !help para visualizar os comandos`)
            }
        })
       
        // listening on Incoming Call
        client.onIncomingCall((call) => {
            client.sendText(call.peerJid, '...')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        })
    }

create('session', serverOption)
    .then(async (client) => startServer(client))
    .catch((error) => console.log(error))

