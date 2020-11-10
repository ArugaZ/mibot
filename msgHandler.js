const { decryptMedia } = require('@open-wa/wa-decrypt')
const { createClient } = require('pexels')
const fs = require('fs-extra')
const yt = require('./yt')
const sendSticker = require('./sendSticker')
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
const msgFilter = require('./lib/msgFilter')
const bent = require('bent')
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

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = '!'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')

        async function getAnimeInfo(data) {
            try{
                image_url = data.picture;
                title = data.title;
                content = `*Anime Encontrado!*
                  
✨️ *Titulo:* ${data.title}

✨️ *Japanese Titulo:* ${data.japaneseTitle}

🎆️ *Episodios:* ${data.episodes}

💌️ *Recomendado:* ${data.rating}

❤️ *Score:* ${data.score}

💚️ *Sinopse:* ${data.synopsis}

🌐️ *URL*: ${data.url}`

                  //console.log(content)

                await client.sendFileFromUrl(from, image_url, `${title}.jpg`, content);
                //await client.sendImage(from, 'image.jpg', title, content)

              } catch(err) {
                if(err) {
                  let errorFile = "https://miro.medium.com/max/978/1*pUEZd8z__1p-7ICIO1NZFA.png";
                  console.error(err.message)
                  await client.sendFileFromUrl(from, errorFile, 'error.png', '💔️ Desculpa não encontrei')
                }
              }
            }

        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
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

        msgFilter.addFilter(from)
      
        global.pollfile = 'poll_Config_'+chat.id+'.json'
        global.voterslistfile = 'poll_voters_Config_'+chat.id+'.json'
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isBanned) {
            switch (command) {
            case 'sticker':
            case 'stiker':
                if (isMedia) {
                    const mediaData = await decryptMedia(message)
                    const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64)
                } else if (quotedMsg && quotedMsg.type == 'image') {
                    const mediaData = await decryptMedia(quotedMsg)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64)
                } else if (args.length >= 1) {
                    const url = args[1]
                    if (url.match(isUrl)) {
                        await client.sendStickerfromUrl(from, url, { method: 'get' })
                            .catch(err => console.log('Caught exception: ', err))
                    } else {
                        client.sendText(from, 'Invalid URL')
                    }
                } else {
                    if(isGroupMsg) {
                        client.sendTextWithMentions(from, `@${message.author} You did not tag a picture`)
                    } else {
                        client.reply(from, 'You did not tag a picture', message)
                    }
                }

            break
        case 'tsticker':
            if (isMedia && type == 'image') {
              try { 
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                const base64img = imageBase64
                const filename = "./media/pic.jpg";
                //console.log(base64img)
                const outFile = './media/noBg.png'
                const result = await removeBackgroundFromImageBase64({ base64img, apiKey: '5fz4Qd4B5oqp9jBuh9H1GYsx', size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
                }
            }
            break
        case 'simsimi':
const simsimi = require('simsimi')({
  key: 'WDh50hnBKfEGvh.9MrCHy~WS~ZgUyfFZKgIfrfFy',
});
 
simsimi('Hi')
.then(response => {
  console.log('simsimi say:', response); // What's up ?
});
          break
        case 'stickergif':
        case 'stikergif':
        case 'sgif':
             if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '[ESPERE] EM MENOS DE 1 MINUTO GIF PRONTO !', id)
                    const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    console.log(`gify ${filename} ./media/output.gif --fps=60 --scale=240:240`);
                    await exec(`gify ${filename} ./media/output.gif --fps=60 --scale=240:240`, async function (error, stdout, stderr) {
                      if(error) {
                        console.log(error);
                      } else {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                      }
                        
                    })
                } else (
                    client.reply(from, '[❗] Kirim video dengan caption *!stickerGif* max 10 sec!', id)
                )
            }
            break
        case 'stickernobg':
        case 'stikernobg':
        if (isMedia) {
                try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './media/img/noBg.png'
                    // untuk api key kalian bisa dapatkan pada website remove.bg
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'API-KEY', size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
                }
            }
            break
      
       case 'mp3' :
            yt.mp3(message)
       case 'mp4' :
            break
            yt.mp4(message)
            break
        case 'tts':
            if (args.length === 1) return client.reply(from, '  *!tts [id, en, jp, ar, pt] [texto]*, Exemplo *!tts en olá pessoas*')
            const ttsId = require('node-gtts')('id');
            const ttsEn = require('node-gtts')('en');
            const ttsPt = require('node-gtts')('pt');
            const ttsJp = require('node-gtts')('ja');
            const ttsAr = require('node-gtts')('ar');

            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'idiota!', id)
            if (dataText.length > 500) return client.reply(from, 'O texto é muito longo!', id)
            var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
            } else if (dataBhs == 'pt') {
                ttsPt.save('./media/tts/resPt.mp3', dataText, ()=> {
                    client.sendPtt(from, './media/tts/resPt.mp3');
                })
            } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                client.reply(from, 'Insira os dados do idioma: [id] para a Indonésia, [en] Para inglês, [jp] Para japão, [ar] Para Árabe, [pt] Para portugues', id)
            }
            break

        case 'anime':
            let errorFile = "https://miro.medium.com/max/978/1*pUEZd8z__1p-7ICIO1NZFA.png";
            const name = message.body.replace('!anime', '');
            malScraper.getInfoFromName(name)
            .then((data) => getAnimeInfo(data))
            .catch((err) => console.log(err.message))
            break;          
        case 'brainly':
            if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                client.reply(from, `➸ *Questão* : ${tanya.split('.')[0]}\n\n➸ *Resposta* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `➸ *Questão* : ${x.pertanyaan}\n\n➸ *Resposta* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            client.reply(from, `➸ *Questão* : ${x.pertanyaan}\n\n➸ *Resposta* : ${x.jawaban.judulJawaban}\n\n➸ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                client.reply(from, 'Usage :\n!brainly [Questão] [quantidade a pesquisar]\n\nEx : \n!brainly NKRI .2', id)
            }
            break
           case 'musicasbr':
             client.reply(from, '!tribodaperiferia | !sidoka  ', id)
             break
            case 'tribodaperiferia':
             client.reply(from, '!imprevisivel , !minhamente , !almadepipa', id)
            break
            case 'sidoka':
             client.reply(from, '!replay , !naomesintomalmais', id)
            break            
           case 'musica':
           case 'músicas':
           case 'música':
           case 'musicas':
             client.sendText(from, '!imaginedragons | !zelda | !traviscott | !linkinpark |!nirvana | !lewiscapaldi| !harrystyles| !powfu| !xxxtentacion|!redhotchillipeppers| !thekingsparade | !brunomars | !theneighbourhood |!systemofadown | !leagueoflegends | !tonesand | !naruto| !maroon5 ', pushname)
            break
           case 'imaginedragons':
             client.reply(from, '!whateverittakes , !radioactive , !natural , !demons , !bulletinagun , !birds , !badliar', id)
            break
        case 'quotemaker':
            arg = body.trim().split('|')
            if (arg.length >= 3) {
            client.reply(from, 'Processing...', message.id) 
            const quotes = arg[1]
            const author = arg[2]
            const theme = arg[3]
            try {
            const resolt = await quotemaker(quotes, author, theme)
            client.sendFile(from, resolt, 'quotesmaker.jpg','neh...')
            } catch {
            client.reply(from, 'I\'m afraid to tell you that the image failed to process', message.id)
            }
            } else {
            client.reply(from, 'Usage: \n!quotemaker |text|watermark|theme\n\nEx :\n!quotemaker |...|...|random', message.id)
            }
            break
         // paid
        case 'infogrupo' :
            if (!isGroupMsg) return client.reply(from, '.', message.id) 
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = wel.includes(chat.id)
            var ngrp = nsfwgrp.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `*${groupname}* 

🌐️ *Membros: ${totalMem}*

💌️ *Bemvindo: ${welgrp}*

⚜️ *NSFW: ${ngrp}*

📃️ *Descrição do grupo* 

${desc}`)
        break
        case 'sou':
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) client.sendText(ids, `${msg}`)
            }
            client.reply(from, 'Broadcast Successo!', message.id)
            break
        case 'ban':
            if(!isGroupAdmins) return client.reply(from, 'Você não é ADM!', message.id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                ban.push(mentionedJidList[i])
                fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
                client.reply(from, 'Sucesso ao banir!', message.id)
            }
            break
        case 'covid':
            arg = body.trim().split(' ')
            console.log(...arg[1])
            var slicedArgs = Array.prototype.slice.call(arg, 1);
            console.log(slicedArgs)
            const country = await slicedArgs.join(' ')
            console.log(country)
            const response3 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
            const { cases, todayCases, deaths, todayDeaths, active } = response3.data
                await client.sendText(from, '🌎️Covid Info -' + country + ' 🌍️\n\n✨️Casos totais: ' + `${cases}` + '\n📆️Casos hoje: ' + `${todayCases}` + '\n☣️Mortes totais: ' + `${deaths}` + '\n☢️Mortes Hoje: ' + `${todayDeaths}` + '\n⛩️Casos ativos: ' + `${active}` + '.')
            break
              case 'play'://silahkan kalian custom sendiri jika ada yang ingin diubah
            if (args.length == 0) return client.reply(from, `Digite uma música do youtube\n\nMusica> ${prefix}Play count on me`, id)
            axios.get(`https://arugaytdl.herokuapp.com/search?q=${body.slice(6)}`)
            .then(async (res) => {
                await client.sendFileFromUrl(from, `${res.data[0].thumbnail}`, ``, `Música\n\nTítulo: ${res.data[0].title}\nDuração ${res.data[0].duration}\nUploaded: ${res.data[0].uploadDate}\nView: ${res.data[0].viewCount}\n\nvisualizações`, id)
                axios.get(`https://arugaz.herokuapp.com/api/yta?url=https://youtu.be/${res.data[0].id}`)
                .then(async(rest) => {
                    await client.sendPtt(from, `${rest.data.result}`, id)
                  })
            })       
            break
        case 'clearall':
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Pronto!', message.id)
            break
       case 'cgc':
            arg = body.trim().split(' ')
            const gcname = arg[1]
            client.createGroup(gcname, mentionedJidList)
            client.sendText(from, 'Group Created ✨️')
            break
       
        case 'sr':
             arg = body.trim().split(' ')
             const sr = arg[1]
             try {
             const response1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + sr + '/');
             const {
                    postLink,
                    title,
                    subreddit,
                    url,
                    nsfw,
                    spoiler
                } = response1.data

                const isnsfw = nsfwgrp.includes(from)
                if (nsfw == true) {
                      if ((isGroupMsg) && (isnsfw)) {
                                await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                      } else if ((isGroupMsg) && (!isnsfw)) {
                                await client.reply(from, `NSFW is not registered on *${name}*`, id)
                      }
                } else { 
                      await client.sendFileFromUrl(from, `${url}`, 'Reddit.jpg', `${title}` + '\n\nPostlink:' + `${postLink}`)
                }
                } catch(err) {
                    console.log(err)
                    await client.reply(from, 'There is no such subreddit, Baka!', id) 
                }
                break
        case 'unban':
            if(!isGroupAdmins) return client.reply(from, 'Você não é ADM!', message.id)
            let inx = ban.indexOf(mentionedJidList[0])
            ban.splice(inx, 1)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            client.reply(from, 'Usuario desbanido!', message.id)
            break

        case 'banir':
            if(!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', message.id)
            if(!isGroupAdmins) return client.reply(from, 'Você não é ADM!', message.id)
            if(!isBotGroupAdmins) return client.reply(from, 'Você precisa me dar ADM para eu banir alguém', message.id)
            if(mentionedJidList.length === 0) return client.reply(from, 'Formato incorreto', message.id)
            await client.sendText(from, `Ok, vou banir esse corno:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await client.reply(from, '....', message.id)
                await client.removeParticipant(groupId,mentionedJidList[i])
            }
            break
        case 'delete':
            if (!isGroupAdmins) return client.reply(from, 'Somente adms podem usar este comando', id)
            if (!quotedMsg) return client.reply(from, 'Formato invalido!', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Inválido!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
       case 'sair':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break
       case 'promover':
            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado quando o bot é um administrador', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Para utilizar o comando: *!promover * @mencionarMembro', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser aplicado a 1 usuário.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Desculpe, o usuário já é um administrador.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Pedido aceito, promovido @${mentionedJidList[0]} a admin.`)
            break
        case 'rebaixar':
            if (!isGroupMsg) return client.reply(from, 'Este recurso só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado por administradores de grupo', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este recurso só pode ser usado quando o bot é um administrador', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Para utilizar, *!rebaixar* @mencionarADM', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Desculpe, este comando só pode ser aplicado a 1 pessoa.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Desculpe, o usuário não é um administrador.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Pedido recebido, removendo posição @${mentionedJidList[0]}.`)
            break
        case 'desativado':
            if (args.length == 0) return client.reply(from, 'Formato incorreto', message.id)
            const link = body.slice(6)
            const minMem = 3
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Onde está o link?', message.id)
            if (check.size < minMem) return client.reply(from, 'Esse grupo não tem 3 membros no mínimo', message.id)
            await client.joinGroupViaLink(link).then( async () => {
                await client.reply(from, '*Entrei!* ✨️', message.id)
            }).catch(error => {
                client.reply(from, 'Ocorreu algum erro 💔️', message.id)
            })
            break
        case 'sauce':
            if (isMedia) {
            const mediaData = await decryptMedia(message)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
             try {
                const raw = await fetch("https://trace.moe/api/search", {
                method: "POST",
                body: JSON.stringify({ image: imageBase64 }),
                headers: { "Content-Type": "application/json" }
                })
                const parsedResult = await raw.json()
                const { anime, episode, title_english } = parsedResult.docs[0]
                const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title:* ${title_english} \n💚️ *Source Episode:* ${episode} `
                await client.sendImage(from, imageBase64, 'sauce.png', content, id)
                console.log("Sent!")
             } catch (err) {
                await client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
             }
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                try {
                 const raw = await fetch("https://trace.moe/api/search", {
                 method: "POST",
                 body: JSON.stringify({ image: imageBase64 }),
                 headers: { "Content-Type": "application/json" }
                 })
                 const parsedResult = await raw.json()
                 const { anime, episode, title_english } = parsedResult.docs[0]
                 const content = `*Anime Found!* \n⛩️ *Japanese Title:* ${anime} \n✨️ *English Title: ${title_english} \n💚️ *Source Episode:* ${episode} `
                 await client.sendImage(from, imageBase64, 'sauce.png', content, id)
                 console.log("Sent!")
               } catch (err) {
                 throw new Error(err.message)
                 await client.sendFileFromUrl(from, errorurl, 'error.png', '💔️ An Error Occured', id)
               }
            }
            break
        case 'lyrics':
            if (args.length == 0) return client.reply(from, 'Formato incorreto', message.id)
            const lagu = body.slice(7)
            console.log(lagu)
            const lirik = await liriklagu(lagu)
            client.sendText(from, lirik)
            break
        case 'anime':
            const keyword = message.body.replace('!anime', '')
            try {
            const data = await fetch(
           `https://api.jikan.moe/v3/search/anime?q=${keyword}`
            )
            const parsed = await data.json()
            if (!parsed) {
              await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Sorry, Couldn\'t find the requested anime', id)
              console.log("Sent!")
              return null
              }
            const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
            const content = `*Anime Found!*
✨️ *Titulo* ${title}

🎆️ *Episodios:* ${episodes}

💌️ *Rating:* ${rated}

❤️ *Score:* ${score}

💚️ *Sinopse:* ${synopsis}

🌐️ *URL*: ${url}`

            const image = await bent("buffer")(image_url)
            const base64 = `data:image/jpg;base64,${image.toString("base64")}`
            client.sendImage(from, base64, title, content)
           } catch (err) {
             console.error(err.message)
             await client.sendFileFromUrl(from, errorurl2, 'error.png', '💔️ Desculpe não encontramos seu anime')
           }
          break
        case 'nívelgay': 
        case 'nivelgay': 
            const data1 = fs.readFileSync('./lib/levelgay.json')
            const data1Json = JSON.parse(data1)
            const randIndex1 = Math.floor(Math.random() * data1Json.length)
            const randKey1 = data1Json[randIndex1]
            client.sendFileFromUrl(from, randKey1.image, 'levelgay.jpg', randKey1.teks, id)
            break
        case 'meme': 
            const data = fs.readFileSync('./meme.json')
            const dataJson = JSON.parse(data)
            const randIndex = Math.floor(Math.random() * dataJson.length)
            const randKey = dataJson[randIndex]
            client.sendFileFromUrl(from, randKey.image, 'Meme.jpg', randKey.teks, id)
            break
        case 'animeneko':
            client.sendFileFromUrl(from, akaneko.neko(), 'neko.jpg', 'Neko *Nyaa*~')
            break
        case 'zelda':
            client.sendPtt(from, './media/Zelda.mp3')
            break
        case 'dog':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Doggo ✨️', id)
            break
        case 'casal':
            arg = body.trim().split(' ')
            const per = Math.floor(Math.random() * 100)

if (per < 25) { 
var sentence = `${per}% Pouco compatível ♦️`
} else if (per < 50) {
var sentence = `${per}% Se alguém tiver interesse pode rolar...❇️` 
} else if (per < 75) {
var sentence = `${per}% Bom, eu apoio... ⭐️` 
} else if (per < 90) {
var sentence = `${per}% Perfeitoo🤩️` 
} else {
var sentence = `${per}% Incrível! Vocês se combinam 100% 😍️` 
}

var shiptext = `❣️ *Analisando...*

---------------------------------
    *${arg[1]}  x  ${arg[2]}*
---------------------------------

${sentence}`
        await client.sendTextWithMentions(from, shiptext)
        break
        case 'neko':          
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko 🌠️', id)
            break
        case 'dado':
            const dice = Math.floor(Math.random() * 6) + 1
            await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
            break
        case 'moeda':
            const side = Math.floor(Math.random() * 2) + 1
            if (side == 1) {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
            } else {
               client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
            }
            break
        case 'slap':
            arg = body.trim().split(' ')
            const person = author.replace('@c.us', '')
            await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
            client.sendTextWithMentions(from, '@' + person + ' *slapped* ' + arg[1])
            break
        case 'pokemon':
            q7 = Math.floor(Math.random() * 890) + 1;
            client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png','.', id)
            break
        case 'rpaper' :
            const walnime = ['https://cdn.nekos.life/wallpaper/QwGLg4oFkfY.png','https://cdn.nekos.life/wallpaper/bUzSjcYxZxQ.jpg','https://cdn.nekos.life/wallpaper/j49zxzaUcjQ.jpg','https://cdn.nekos.life/wallpaper/YLTH5KuvGX8.png','https://cdn.nekos.life/wallpaper/Xi6Edg133m8.jpg','https://cdn.nekos.life/wallpaper/qvahUaFIgUY.png','https://cdn.nekos.life/wallpaper/leC8q3u8BSk.jpg','https://cdn.nekos.life/wallpaper/tSUw8s04Zy0.jpg','https://cdn.nekos.life/wallpaper/sqsj3sS6EJE.png','https://cdn.nekos.life/wallpaper/HmjdX_s4PU4.png','https://cdn.nekos.life/wallpaper/Oe2lKgLqEXY.jpg','https://cdn.nekos.life/wallpaper/GTwbUYI-xTc.jpg','https://cdn.nekos.life/wallpaper/nn_nA8wTeP0.png','https://cdn.nekos.life/wallpaper/Q63o6v-UUa8.png','https://cdn.nekos.life/wallpaper/ZXLFm05K16Q.jpg','https://cdn.nekos.life/wallpaper/cwl_1tuUPuQ.png','https://cdn.nekos.life/wallpaper/wWhtfdbfAgM.jpg','https://cdn.nekos.life/wallpaper/3pj0Xy84cPg.jpg','https://cdn.nekos.life/wallpaper/sBoo8_j3fkI.jpg','https://cdn.nekos.life/wallpaper/gCUl_TVizsY.png','https://cdn.nekos.life/wallpaper/LmTi1k9REW8.jpg','https://cdn.nekos.life/wallpaper/sbq_4WW2PUM.jpg','https://cdn.nekos.life/wallpaper/QOSUXEbzDQA.png','https://cdn.nekos.life/wallpaper/khaqGIHsiqk.jpg','https://cdn.nekos.life/wallpaper/iFtEXugqQgA.png','https://cdn.nekos.life/wallpaper/deFKIDdRe1I.jpg','https://cdn.nekos.life/wallpaper/OHZVtvDm0gk.jpg','https://cdn.nekos.life/wallpaper/YZYa00Hp2mk.jpg','https://cdn.nekos.life/wallpaper/R8nPIKQKo9g.png','https://cdn.nekos.life/wallpaper/_brn3qpRBEE.jpg','https://cdn.nekos.life/wallpaper/ADTEQdaHhFI.png','https://cdn.nekos.life/wallpaper/MGvWl6om-Fw.jpg','https://cdn.nekos.life/wallpaper/YGmpjZW3AoQ.jpg','https://cdn.nekos.life/wallpaper/hNCgoY-mQPI.jpg','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/iQ2FSo5nCF8.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/CmEmn79xnZU.jpg','https://cdn.nekos.life/wallpaper/MAL18nB-yBI.jpg','https://cdn.nekos.life/wallpaper/FUuBi2xODuI.jpg','https://cdn.nekos.life/wallpaper/ez-vNNuk6Ck.jpg','https://cdn.nekos.life/wallpaper/K4-z0Bc0Vpc.jpg','https://cdn.nekos.life/wallpaper/Y4JMbswrNg8.jpg','https://cdn.nekos.life/wallpaper/ffbPXIxt4-0.png','https://cdn.nekos.life/wallpaper/x63h_W8KFL8.jpg','https://cdn.nekos.life/wallpaper/lktzjDRhWyg.jpg','https://cdn.nekos.life/wallpaper/j7oQtvRZBOI.jpg','https://cdn.nekos.life/wallpaper/MQQEAD7TUpQ.png','https://cdn.nekos.life/wallpaper/lEG1-Eeva6Y.png','https://cdn.nekos.life/wallpaper/Loh5wf0O5Aw.png','https://cdn.nekos.life/wallpaper/yO6ioREenLA.png','https://cdn.nekos.life/wallpaper/4vKWTVgMNDc.jpg','https://cdn.nekos.life/wallpaper/Yk22OErU8eg.png','https://cdn.nekos.life/wallpaper/Y5uf1hsnufE.png','https://cdn.nekos.life/wallpaper/xAmBpMUd2Zw.jpg','https://cdn.nekos.life/wallpaper/f_RWFoWciRE.jpg','https://cdn.nekos.life/wallpaper/Y9qjP2Y__PA.jpg','https://cdn.nekos.life/wallpaper/eqEzgohpPwc.jpg','https://cdn.nekos.life/wallpaper/s1MBos_ZGWo.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/32EAswpy3M8.png','https://cdn.nekos.life/wallpaper/Z6eJZf5xhcE.png','https://cdn.nekos.life/wallpaper/xdiSF731IFY.jpg','https://cdn.nekos.life/wallpaper/Y9r9trNYadY.png','https://cdn.nekos.life/wallpaper/8bH8CXn-sOg.jpg','https://cdn.nekos.life/wallpaper/a02DmIFzRBE.png','https://cdn.nekos.life/wallpaper/MnrbXcPa7Oo.png','https://cdn.nekos.life/wallpaper/s1Tc9xnugDk.jpg','https://cdn.nekos.life/wallpaper/zRqEx2gnfmg.jpg','https://cdn.nekos.life/wallpaper/PtW0or_Pa9c.png','https://cdn.nekos.life/wallpaper/0ECCRW9soHM.jpg','https://cdn.nekos.life/wallpaper/kAw8QHl_wbM.jpg','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/WVEdi9Ng8UE.png','https://cdn.nekos.life/wallpaper/IRu29rNgcYU.png','https://cdn.nekos.life/wallpaper/LgIJ_1AL3rM.jpg','https://cdn.nekos.life/wallpaper/DVD5_fLJEZA.jpg','https://cdn.nekos.life/wallpaper/siqOQ7k8qqk.jpg','https://cdn.nekos.life/wallpaper/CXNX_15eGEQ.png','https://cdn.nekos.life/wallpaper/s62tGjOTHnk.jpg','https://cdn.nekos.life/wallpaper/tmQ5ce6EfJE.png','https://cdn.nekos.life/wallpaper/Zju7qlBMcQ4.jpg','https://cdn.nekos.life/wallpaper/CPOc_bMAh2Q.png','https://cdn.nekos.life/wallpaper/Ew57S1KtqsY.jpg','https://cdn.nekos.life/wallpaper/hVpFbYJmZZc.jpg','https://cdn.nekos.life/wallpaper/sb9_J28pftY.jpg','https://cdn.nekos.life/wallpaper/JDoIi_IOB04.jpg','https://cdn.nekos.life/wallpaper/rG76AaUZXzk.jpg','https://cdn.nekos.life/wallpaper/9ru2luBo360.png','https://cdn.nekos.life/wallpaper/ghCgiWFxGwY.png','https://cdn.nekos.life/wallpaper/OSR-i-Rh7ZY.png','https://cdn.nekos.life/wallpaper/65VgtPyweCc.jpg','https://cdn.nekos.life/wallpaper/3vn-0FkNSbM.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/3VjNKqEPp58.jpg','https://cdn.nekos.life/wallpaper/NoG4lKnk6Sc.jpg','https://cdn.nekos.life/wallpaper/xiTxgRMA_IA.jpg','https://cdn.nekos.life/wallpaper/yq1ZswdOGpg.png','https://cdn.nekos.life/wallpaper/4SUxw4M3UMA.png','https://cdn.nekos.life/wallpaper/cUPnQOHNLg0.jpg','https://cdn.nekos.life/wallpaper/zczjuLWRisA.jpg','https://cdn.nekos.life/wallpaper/TcxvU_diaC0.png','https://cdn.nekos.life/wallpaper/7qqWhEF_uoY.jpg','https://cdn.nekos.life/wallpaper/J4t_7DvoUZw.jpg','https://cdn.nekos.life/wallpaper/xQ1Pg5D6J4U.jpg','https://cdn.nekos.life/wallpaper/aIMK5Ir4xho.jpg','https://cdn.nekos.life/wallpaper/6gneEXrNAWU.jpg','https://cdn.nekos.life/wallpaper/PSvNdoISWF8.jpg','https://cdn.nekos.life/wallpaper/SjgF2-iOmV8.jpg','https://cdn.nekos.life/wallpaper/vU54ikOVY98.jpg','https://cdn.nekos.life/wallpaper/QjnfRwkRU-Q.jpg','https://cdn.nekos.life/wallpaper/uSKqzz6ZdXc.png','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/N1l8SCMxamE.jpg','https://cdn.nekos.life/wallpaper/n2cBaTo-J50.png','https://cdn.nekos.life/wallpaper/ZXcaFmpOlLk.jpg','https://cdn.nekos.life/wallpaper/7bwxy3elI7o.png','https://cdn.nekos.life/wallpaper/7VW4HwF6LcM.jpg','https://cdn.nekos.life/wallpaper/YtrPAWul1Ug.png','https://cdn.nekos.life/wallpaper/1p4_Mmq95Ro.jpg','https://cdn.nekos.life/wallpaper/EY5qz5iebJw.png','https://cdn.nekos.life/wallpaper/aVDS6iEAIfw.jpg','https://cdn.nekos.life/wallpaper/veg_xpHQfjE.jpg','https://cdn.nekos.life/wallpaper/meaSEfeq9QM.png','https://cdn.nekos.life/wallpaper/Xa_GtsKsy-s.png','https://cdn.nekos.life/wallpaper/6Bx8R6D75eM.png','https://cdn.nekos.life/wallpaper/zXOGXH_b8VY.png','https://cdn.nekos.life/wallpaper/VQcviMxoQ00.png','https://cdn.nekos.life/wallpaper/CJnRl-PKWe8.png','https://cdn.nekos.life/wallpaper/zEWYfFL_Ero.png','https://cdn.nekos.life/wallpaper/_C9Uc5MPaz4.png','https://cdn.nekos.life/wallpaper/zskxNqNXyG0.jpg','https://cdn.nekos.life/wallpaper/g7w14PjzzcQ.jpg','https://cdn.nekos.life/wallpaper/KavYXR_GRB4.jpg','https://cdn.nekos.life/wallpaper/Z_r9WItzJBc.jpg','https://cdn.nekos.life/wallpaper/Qps-0JD6834.jpg','https://cdn.nekos.life/wallpaper/Ri3CiJIJ6M8.png','https://cdn.nekos.life/wallpaper/ArGYIpJwehY.jpg','https://cdn.nekos.life/wallpaper/uqYKeYM5h8w.jpg','https://cdn.nekos.life/wallpaper/h9cahfuKsRg.jpg','https://cdn.nekos.life/wallpaper/iNPWKO8d2a4.jpg','https://cdn.nekos.life/wallpaper/j2KoFVhsNig.jpg','https://cdn.nekos.life/wallpaper/z5Nc-aS6QJ4.jpg','https://cdn.nekos.life/wallpaper/VUFoK8l1qs0.png','https://cdn.nekos.life/wallpaper/rQ8eYh5mXN8.png','https://cdn.nekos.life/wallpaper/D3NxNISDavQ.png','https://cdn.nekos.life/wallpaper/Z_CiozIenrU.jpg','https://cdn.nekos.life/wallpaper/np8rpfZflWE.jpg','https://cdn.nekos.life/wallpaper/ED-fgS09gik.jpg','https://cdn.nekos.life/wallpaper/AB0Cwfs1X2w.jpg','https://cdn.nekos.life/wallpaper/DZBcYfHouiI.jpg','https://cdn.nekos.life/wallpaper/lC7pB-GRAcQ.png','https://cdn.nekos.life/wallpaper/zrI-sBSt2zE.png','https://cdn.nekos.life/wallpaper/_RJhylwaCLk.jpg','https://cdn.nekos.life/wallpaper/6km5m_GGIuw.png','https://cdn.nekos.life/wallpaper/3db40hylKs8.png','https://cdn.nekos.life/wallpaper/oggceF06ONQ.jpg','https://cdn.nekos.life/wallpaper/ELdH2W5pQGo.jpg','https://cdn.nekos.life/wallpaper/Zun_n5pTMRE.png','https://cdn.nekos.life/wallpaper/VqhFKG5U15c.png','https://cdn.nekos.life/wallpaper/NsMoiW8JZ60.jpg','https://cdn.nekos.life/wallpaper/XE4iXbw__Us.png','https://cdn.nekos.life/wallpaper/a9yXhS2zbhU.jpg','https://cdn.nekos.life/wallpaper/jjnd31_3Ic8.jpg','https://cdn.nekos.life/wallpaper/Nxanxa-xO3s.png','https://cdn.nekos.life/wallpaper/dBHlPcbuDc4.jpg','https://cdn.nekos.life/wallpaper/6wUZIavGVQU.jpg','https://cdn.nekos.life/wallpaper/_-Z-0fGflRc.jpg','https://cdn.nekos.life/wallpaper/H9OUpIrF4gU.jpg','https://cdn.nekos.life/wallpaper/xlRdH3fBMz4.jpg','https://cdn.nekos.life/wallpaper/7IzUIeaae9o.jpg','https://cdn.nekos.life/wallpaper/FZCVL6PyWq0.jpg','https://cdn.nekos.life/wallpaper/5dG-HH6d0yw.png','https://cdn.nekos.life/wallpaper/ddxyA37HiwE.png','https://cdn.nekos.life/wallpaper/I0oj_jdCD4k.jpg','https://cdn.nekos.life/wallpaper/ABchTV97_Ts.png','https://cdn.nekos.life/wallpaper/58C37kkq39Y.png','https://cdn.nekos.life/wallpaper/HMS5mK7WSGA.jpg','https://cdn.nekos.life/wallpaper/1O3Yul9ojS8.jpg','https://cdn.nekos.life/wallpaper/hdZI1XsYWYY.jpg','https://cdn.nekos.life/wallpaper/h8pAJJnBXZo.png','https://cdn.nekos.life/wallpaper/apO9K9JIUp8.jpg','https://cdn.nekos.life/wallpaper/p8f8IY_2mwg.jpg','https://cdn.nekos.life/wallpaper/HY1WIB2r_cE.jpg','https://cdn.nekos.life/wallpaper/u02Y0-AJPL0.jpg','https://cdn.nekos.life/wallpaper/jzN74LcnwE8.png','https://cdn.nekos.life/wallpaper/IeAXo5nJhjw.jpg','https://cdn.nekos.life/wallpaper/7lgPyU5fuLY.jpg','https://cdn.nekos.life/wallpaper/f8SkRWzXVxk.png','https://cdn.nekos.life/wallpaper/ZmDTpGGeMR8.jpg','https://cdn.nekos.life/wallpaper/AMrcxZOnVBE.jpg','https://cdn.nekos.life/wallpaper/ZhP-f8Icmjs.jpg','https://cdn.nekos.life/wallpaper/7FyUHX3fE2o.jpg','https://cdn.nekos.life/wallpaper/CZoSLK-5ng8.png','https://cdn.nekos.life/wallpaper/pSNDyxP8l3c.png','https://cdn.nekos.life/wallpaper/AhYGHF6Fpck.jpg','https://cdn.nekos.life/wallpaper/ic6xRRptRes.jpg','https://cdn.nekos.life/wallpaper/89MQq6KaggI.png','https://cdn.nekos.life/wallpaper/y1DlFeHHTEE.png']
            let walnimek = walnime[Math.floor(Math.random() * walnime.length)]
            client.sendFileFromUrl(from, walnimek, 'Nimek.jpg', '', message.id)
            break
        case 'help':
            client.reply(from, help.replace(undefined, pushname), message.id)
            break
        case 'perfil':
            if (isGroupMsg) {
              if (!quotedMsg) {
              var pic = await client.getProfilePicFromServer(author)
              var namae = pushname
              var sts = await client.getStatus(author)
              const { status } = sts
               if (pic == undefined) {
               var pfp = errorurl 
               } else {
               var pfp = pic
               } 
             await client.sendFileFromUrl(from, pfp, 'pfp.jpg', `*Foto* ✨️ \n\n 🔖️ *Nome: ${namae}*\n\n💌️ *Info: ${status}*\n\n*💔️`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var pic = await client.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.name
             var sts = await client.getStatus(qmid)
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
             await client.sendFileFromUrl(from, pfp, 'pfo.jpg', `*Perfil* ✨️ \n\n 🔖️ *Nome: ${namae}*\n💌️ *Status: ${status}*\n*💔️`)
             }
            }
            break
        case 'adminlista':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break
        case 'ownergrupo':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Criador do grupo : @${Owner_}`)
            break
        case 'mencionar':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Mencionar 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 icarusBOT 〙'
            await client.sendTextWithMentions(from, hehe)
            break
        case 'kickall':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, 'Este comando só pode ser usado pelo grupo Proprietário', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss apenas grupo adm')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            client.reply(from, 'Sucesso ao chutar todos os membros', id)
            break
        case 'leaveall':
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Me retirando por lag excessivo. : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Sucesso ao deixar todos os grupo!', id)
            break
         case 'bulletinagun':
               client.sendPtt(from, './media/bulletinagun.mp3')
            break
         case 'badliar':
               client.sendPtt(from, './media/badliar.mp3')
               break
         case 'machine':
               client.sendPtt(from, './media/machine.mp3')
               break
         case 'whateverittakes':
               client.sendPtt(from, './media/whateverittakes.mp3')
               break
         case 'radioactive':
               client.sendPtt(from, './media/radioactive.mp3')
               break
         case 'demons':
               client.sendPtt(from, './media/demons.mp3')
               break
         case 'natural':
               client.sendPtt(from, './media/natural.mp3')
               break
         case 'birds':
               client.sendPtt(from, './media/birds.mp3')
               break
         case 'goosebumps':
              client.sendPtt(from, './media/goosebumps.mp3')
               break
        case 'butterfly':
              client.sendPtt(from, './media/butterfly.mp3')
              break
        case 'antidote':
              client.sendPtt(from, './media/antidote.mp3')
              break
        case 'traviscott':
              client.reply(from, 'goosebumps , butterfly , antidote', id)
              break
        case 'lewiscapaldi':
              client.reply(from, 'someoneyouloved', id)
              break
         case 'someoneyouloved':
              client.sendPtt(from, './media/someoneyouloved.mp3')
              break
         case 'nirvana':
              client.reply(from, '!smellsliketeenspirit', id)
              break
         case 'smellsliketeenspirit':
              client.sendPtt(from, './media/smellsliketeenspirit.mp3')
              break
         case 'linkinpark':
              client.reply(from, 'numb, intheend', id)
              break
         case 'numb':
              client.sendPtt(from, './media/numb.mp3')
              break
         case 'almadepipa':
              client.sendPtt(from, './media/almadepipa.mp3')
              break
         case 'minhamente':
              client.sendPtt(from, './media/minhamente.mp3')
              break 
         case 'imprevisivel':
              client.sendPtt(from, './media/imprevisivel.mp3')
              break                           
         case 'intheend':
              client.sendPtt(from, './media/intheend.mp3')
              break
         case 'saymyname':
              client.sendPtt(from, './media/saymyname.mp3')
              break
        case 'funknaruto':
              client.sendPtt(from, './media/funknaruto.mp3')
              break
        case 'bluebird':
              client.sendPtt(from, './media/bluebird.mp3')
              break
        case 'naruto':
              client.reply(from, 'bluebird , funknaruto', id)
              break
        case 'tonesand':
              client.reply(from, 'idancemonkey', id)
              break
         case 'memories':
              client.sendPtt(from, './media/memories.mp3')
              break
        case 'maroon5':
              client.reply(from, 'memories', id)
              break
        case 'systemofadown':
              client.reply(from, 'byob', id)
              break
        case 'leagueoflegends':
              client.reply(from, 'legendsneverdie', id)
              break
         case 'byob':
              client.sendPtt(from, './media/byob.mp3')
              break
         case 'legendsneverdie':
              client.sendPtt(from, './media/legendsneverdie.mp3')
              break
        case 'theneighbourhood':
              client.reply(from, 'saymyname', id)
              break
        case 'brunomars':
              client.reply(from, 'billionaire , wheniwasyourman', id)
              break
         case 'billionaire':
              client.sendPtt(from, './media/billionaire.mp3')
              break
         case 'wheniwasyourman':
              client.sendPtt(from, './media/wheniwasyourman.mp3')
              break
         case 'silhouette':
              client.sendPtt(from, './media/silhouette.mp3')
              break
         case 'thekingsparade':
              client.reply(from, 'silhouette', id)
              break
         case 'californication':
              client.sendPtt(from, './media/californication.mp3')
              break
         case 'replay':
              client.sendPtt(from, './media/replay.mp3')
              break 
         case 'naomesintomalmais':
              client.sendPtt(from, './media/naomesintomalmais.mp3')
              break                          
        case 'redhotchillipeppers':
              client.reply(from, 'californication', id)
              break
         case 'moonlight':
              client.sendPtt(from, './media/moonlight.mp3')
              break
        case 'xxxtentacion':
              client.reply(from, 'moonlight', id)
              break
         case 'deathbed':
              client.sendPtt(from, './media/deathbed.mp3')
              break
        case 'powfu':
              client.reply(from, 'deathbed', id)
              break
         case 'watermelonsugar':
              client.sendPtt(from, './media/watermelonsugar.mp3')
              break
        case 'harrystyles':
              client.reply(from, 'watermelonsugar', id)
              break 
         case 'sair':
            if (!isGroupMsg) return client.reply(from, 'Este comando só pode ser usado em grupos', id)
            if (!isGroupAdmins) return client.reply(from, 'Este comando só pode ser usado por administradores de grupo', id)
            await client.sendText(from,'Sayonara').then(() => client.leaveGroup(groupId))
            break
         case 'oie':
            client.sendTextWithMentions(from, `@${message.author} Olá, como posso ajudar?`);
            break
        }
    }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
        
