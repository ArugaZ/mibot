const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg') //paid
const color = require('./lib/color')
const { liriklagu, quotemaker, wall } = require('./lib/functions')
const { help, info, } = require('./lib/help')
const akaneko = require('akaneko');
const { exec } = require('child_process')
const fetch = require('node-fetch');
const bent = require('bent')
const msgFilter = require('./lib/msgFilter')
const malScraper = require('mal-scraper')
const request = require('request');
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json')) 
const ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'

const feature = require('./lib/poll');

let download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
const { watchFile } = require("fs-extra");
var songLine = 0


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = msgHandler1 = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = ''
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')

   
        if (!isCmd && !isGroupMsg) return 0//console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        if (!isCmd && isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        if (isCmd && !isGroupMsg) return 0;//console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const isBanned = ban.includes(chatId)
        const owner = '558188263143@c.us' // eg 9190xxxxxxxx
        const isowner = owner+'558188263143@c.us' == sender.id 
        global.pollfile = 'poll_Config_'+chat.id+'.json'
        global.voterslistfile = 'poll_voters_Config_'+chat.id+'.json'


        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isBanned) {
            switch (command) {
        case 'covidbr':
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const state = await slicedArgs.join(' ')
            console.log(state)
            const response2 = await axios.get('https://covid19-brazil-api.now.sh/api/report/v1' + state + '/')
            const { cases,deaths,suspects } = response2.data
            await client.sendText(from, '🌎Covid Brasil Info -' + state + ' 🌍\r\n✨Casos: ' + `${cases}` +  '\n☣️Mortes totais: ' + `${deaths}` + '\n☢️Suspeitas: ' + `${suspects}` + '.')
            break
         case 'oi':
            client.sendTextWithMentions(from, `@${message.author} Olá, como posso ajudar?`);
            break
         case 'oi icaro':    
            client.sendTextWithMentions(from, `@${message.author} Oi, como você vai?`);
            break
        case '!stick':
            client.sendTextWithMentions(from, `@${message.author} Digite !sticker seu doente`);
            break
        case 'Bot Lixo':
            client.sendTextWithMentions(from, `@${message.author} Lixo é sua mãe`);
            break
        case 'hentai':
            client.sendTextWithMentions(from, `@${message.author} Vou dar ban emm`);
            break
        case 'gay':
            client.sendTextWithMentions(from, `@${message.author} Concordo kkkk`);
            break
        case 'da ban':
            client.sendTextWithMentions(from, `@${message.author} Se ele continuar vou banir mesmo`);
            break
        case 'o bot é pago?':
            client.sendTextWithMentions(from, `@${message.author} Sim, sou pago, apenas 10 reais por mês`);
            break
        case 'bot é pago?':
            client.sendTextWithMentions(from, `@${message.author} Sim, sou pago, apenas 10 reais por mês`);
            break
        case 'pornô':
            client.sendTextWithMentions(from, `@${message.author} Sem pornografias ou vai levar banimento`);
            break
        case 'porno':
            client.sendTextWithMentions(from, `@${message.author} Vou banir em`);
            break
        case 'icarus':
            client.sendTextWithMentions(from, `@${message.author} Oi?`);
            break
        case 'kkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkk`);
            break
        case 'kk':
            client.sendTextWithMentions(from, `@${message.author} kkkk`);
            break
        case 'kkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkk`);
            break
        case 'kkkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkkkkkk`);
            break
        case 'kkkkkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkkkkkkkkkk`);
            break
        case 'kkkkkkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkkkkk`);
            break
        case 'kkkkkkkkkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkkkkkkkkk`);
            break
        case 'quem é o criador do bot?':
            client.sendTextWithMentions(from, `@${message.author} o 558188263143`);
            break
        case 'quem é o criador do bot':
            client.sendTextWithMentions(from, `@${message.author} o 558188263143`);
            break
        case 'anime':
            client.sendTextWithMentions(from, `@${message.author} Seu Otakuzin`);
            break
        case 'criador':
            client.sendTextWithMentions(from, `@${message.author} Gabriel Santana`);
            break
        case 'black':
        case 'clover':
        case 'blackclover':
            client.sendTextWithMentions(from, `@${message.author} Vamos ver se você é bom, me diga quem é o líder dos Touros Negros?`);
            break
        case 'yami':
            client.sendTextWithMentions(from, `@${message.author} Parabéns, você entende bem de black clover`);
            break
        case 'yamisukehiro':
            client.sendTextWithMentions(from, `@${message.author} Parabéns, você entende bem de black clover`);
            break
        case 'o bot ta on?':
            client.sendTextWithMentions(from, `@${message.author} Simmmmmmm, olha eu aqui`);
            break
        case 'o bot ta funcionando?':
            client.sendTextWithMentions(from, `@${message.author} Sim, totalmente ONLINE!`);
            break
        case 'A':
            client.sendTextWithMentions(from, `@${message.author} B`);
            break
        case '1+1':
            client.sendTextWithMentions(from, `@${message.author} 2`);
            break
        case 'bot':
            client.sendTextWithMentions(from, `@${message.author} Não me chame de bot! Você é doente?`);
            break
        case 'manunteção':
            client.sendTextWithMentions(from, `@${message.author} Eu já voltei...`);
            break
        case 'bot em manunteção?':
            client.sendTextWithMentions(from, `@${message.author} NÃO!`);
            break
        case 'não':
            client.sendTextWithMentions(from, `@${message.author} Talvez sim`);
            break
        case 'nudes':
            client.sendTextWithMentions(from, `@${message.author} Epa, eu também quero`);
            break
        case 'manda nudes':
            client.sendTextWithMentions(from, `@${message.author} Nossa, compartilha comigo também hehe`);
            break
        case 'maldito':
            client.sendTextWithMentions(from, `@${message.author} Seu pai`);
            break
        case 'ademiro':
            client.sendTextWithMentions(from, `@${message.author} Deixa o adm descansar`);
            break
        case 'baiano':
            client.sendTextWithMentions(from, `@${message.author} Não use esse nome aqui!`);
            break
        case 'pronto':
            client.sendTextWithMentions(from, `@${message.author} Prontinho`);
            break
        case 'ok':
            client.sendTextWithMentions(from, `@${message.author} Ok oq corno?`);
            break
        case 'pdp':
            client.sendTextWithMentions(from, `@${message.author} pode pá`);
            break
        case 'Q isso':
            client.sendTextWithMentions(from, `@${message.author} Também não sei`);
            break
        case 'q isso?':
            client.sendTextWithMentions(from, `@${message.author} não seiii`);
            break
        case 'não,kkk':
            client.sendTextWithMentions(from, `@${message.author} Ajude esse imbecil a entender`);
            break
        case 'putz':
            client.sendTextWithMentions(from, `@${message.author} Psé, triste`);
            break
        case 'puts':
            client.sendTextWithMentions(from, `@${message.author} triste kkk`);
            break
        case 'o bot ta falando':
            client.sendTextWithMentions(from, `@${message.author} kkkkk sim`);
            break
        case 'o bot tá falando kkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkk`);
            break
        case 'bot falando':
            client.sendTextWithMentions(from, `@${message.author} psé`);
            break
        case 'bot falando kkk':
            client.sendTextWithMentions(from, `@${message.author} Sim kkkk posso não?`);
            break
        case 'bot fala agora é':
            client.sendTextWithMentions(from, `@${message.author} simmmmmmmmmmm`);
            break
        case 'o bot ta falando kkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkk sim seu otario`);
            break
        case 'icarus qual meu nome?':
            client.sendTextWithMentions(from, `@${message.author} joão corno da silva`);
            break
        case 'nivelgay':
            client.sendTextWithMentions(from, `@${message.author} seu nivel gay é mais de 8000`);
            break
        case 'kkkkkkkkkkkkkkkkkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkkkkkkkkkk`);
            break
        case 'kkkkkkkkkkkkkkkkkk':
            client.sendTextWithMentions(from, `@${message.author} kkkkkkkkkkkkkkkkkkk`);
            break
        case 'bot doente':
            client.sendTextWithMentions(from, `@${message.author} Doente é seu pai`);
            break
        case 'o bot ta conversando':
            client.sendTextWithMentions(from, `@${message.author} tenho inteligencia artificial hehe`);
            break
        case 'o bot ta conversando':
            client.sendTextWithMentions(from, `@${message.author} Sim, sou inteligente`);
            break
        case 'oi icarus tudo bom?':
            client.sendTextWithMentions(from, `@${message.author}  Tudo sim e você?`);
            break
        case 'icarus qual sua idade?':
            client.sendTextWithMentions(from, `@${message.author} Tenho apenas 1 mês de vida`);
            break
        case 'icarus manda um hentai':
            client.sendTextWithMentions(from, `@${message.author} Não!`);
            break
        case 'esse bot é foda':
            client.sendTextWithMentions(from, `@${message.author} Sim, eu sou pilka mlk`);
            break
        case 'bot foda':
            client.sendTextWithMentions(from, `@${message.author} Sim, sou mesmo`);
            break
        case 'bot fodaaa dms':
            client.sendTextWithMentions(from, `@${message.author} simmmmm`);
            break
        case 'bot muito bom':
            client.sendTextWithMentions(from, `@${message.author} Concordo`);
            break
        case 'bot pra whatsapp?':
            client.sendTextWithMentions(from, `@${message.author} Sim cara, eu sou um.`);
            break
        case 'tem bot pra whatsapp agora é':
            client.sendTextWithMentions(from, `@${message.author} Sim, tem, eu sou um`);
            break
        case 'tem bot pra whats agr é':
            client.sendTextWithMentions(from, `@${message.author} Sim, olha eu aqui seu cego`);
            break
        case 'ww':
            client.sendTextWithMentions(from, `@${message.author} werewolf`);
            break
        case 'freefire':
            client.sendTextWithMentions(from, `@${message.author}  Esse jogo é uma porcaria`);
            break
        case 'pubg':
            client.sendTextWithMentions(from, `@${message.author} Sim, esse jogo é melhor que freefire`);
            break
        case 'testando':
            client.sendTextWithMentions(from, `@${message.author} 123`);
            break
        case 'amo esse bot':
            client.sendTextWithMentions(from, `@${message.author} Também te amo`);
            break
        case 'eu amo esse bot':
            client.sendTextWithMentions(from, `@${message.author} Também te amo`);
            break
        case 'como faz figurinha?':
            client.sendTextWithMentions(from, `@${message.author} Envie uma foto com legenda !sticker`);
            break
        case 'como faz figurinha':
            client.sendTextWithMentions(from, `@${message.author} Envie uma foto com legenda !sticker`);
            break
        case 'como faço figurinha?':
            client.sendTextWithMentions(from, `@${message.author} Envie uma foto com legenda !sticker`);
            break
        case 'bot desativado':
            client.sendTextWithMentions(from, `@${message.author} Claro que não, olha eu aqui seu corno`);
            break
        case 'iae':
            client.sendTextWithMentions(from, `@${message.author} Opa, tudo bom?`);
            break
        case 'eae':
            client.sendTextWithMentions(from, `@${message.author} Dale meu comparça`);
            break
        case 'minecraft':
            client.sendTextWithMentions(from, `@${message.author} Bom jogo...`);
            break
        case 'bora jogar':
            client.sendTextWithMentions(from, `@${message.author} Vamos!`);
            break
        case 'aff':
            client.sendTextWithMentions(from, `@${message.author} Aff isso é triste`);
            break
        case 'como assim?':
            client.sendTextWithMentions(from, `@${message.author} Também não entendi`);
            break
        case 'q kkk':
            client.sendTextWithMentions(from, `@${message.author} eoq`);
            break
        case 'novo bot':
            client.sendTextWithMentions(from, `@${message.author} Sou apenas eu`);
            break
        case 'wpp':
            client.sendTextWithMentions(from, `@${message.author} Passa o zipzap`);
            break
        case '10 conto':
            client.sendTextWithMentions(from, `@${message.author} Sim, baratinho`);
            break
        case '10 reais':
            client.sendTextWithMentions(from, `@${message.author} Me compre por favorzinho`);
            break
        case 'apaga':
            client.sendTextWithMentions(from, `@${message.author} Diz a ele que vou dar ban caso continue`);
            break
        case 'namoral bot':
            client.sendTextWithMentions(from, `@${message.author} Dale meu comparça`);
            break
        case 'tá off ainda':
            client.sendTextWithMentions(from, `@${message.author} To online aqui`);
            break
        case 'ta off':
            client.sendTextWithMentions(from, `@${message.author} Estou aqui man`);
            break
        case 'tá off':
            client.sendTextWithMentions(from, `@${message.author} Opa eai`);
            break
        case 'invadiram o bot':
            client.sendTextWithMentions(from, `@${message.author} Não kkk`);
            break
        case 'Melhoras':
            client.sendTextWithMentions(from, `@${message.author} Fique bem`);
            break
        case 'É':
            client.sendTextWithMentions(from, `@${message.author} Sim, é mesmo`);
            break
        case 'ele':
            client.sendTextWithMentions(from, `@${message.author} Eu?`);
            break
        case 'sextou':
            client.sendTextWithMentions(from, `@${message.author} Ihuuuuu agora sim paii`);
            break
        case 'Bom dia icarus':
            client.sendTextWithMentions(from, `@${message.author} Bom diaaaaaaa`);
            break
        case 'Boa noite icarus':
            client.sendTextWithMentions(from, `@${message.author} Boa noiteeeeee`);
            break
        case 'boa noite':
            client.sendTextWithMentions(from, `@${message.author} Durma bem`);
            break
        case 'saiu':
            client.sendTextWithMentions(from, `@${message.author} Quer me trolar né`);
            break
        case 'removeu você':
            client.sendTextWithMentions(from, `@${message.author} Será? kkkkk`);
            break
    
        }
    }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
        
