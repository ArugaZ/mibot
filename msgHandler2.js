const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const nrc = require('node-run-cmd')
const moment = require('moment-timezone')
const get = require('got')
const func = require('./lib/functions')
const { exec } = require('child_process')
const msgFilter = require('./lib/msgFilter')
const akaneko = require('akaneko')
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const fetch = require('node-fetch')
const bent = require('bent')
const request = require('request');
const profile = require('./lib/profile.js')
const malScraper = require('mal-scraper')
const aiQuote = require('./inspiroBotScrapperPuppeteerVersion.js')
const ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
const wel = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json'))
const ruleArr = JSON.parse(fs.readFileSync('./lib/rule.json'))
const errorurl = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'


let download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

let cutthecrap = (linkX) => {
  let tempLink = linkX.replace(/ /g,'');
  let finalLink = tempLink.replace("!mp3", "");
  return finalLink;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = msgHandler2 = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        const prefix = '!'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption) || (type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
	const isRule = ruleArr.includes(chat.id)
	const groupAdmins = isGroupMsg ? await client.getGroupAdmins(chat.id) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
	const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

     
        if (!isCmd && !isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
	if (isGroupMsg && isRule && (type === 'chat' && message.body.includes('chat.whatsapp.com') && isBotGroupAdmins) && !isGroupAdmins) return await client.removeParticipant(chat.id, author)
	if (!isCmd && isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) 
        
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name))
        const isBanned = ban.includes(author)
        const botadmins = ['919744375687@c.us', '919399075484@c.us', '917019253026@c.us', '917487021075@c.us'] //replace my number with yours here
        const isbotadmin = botadmins.includes(sender.id)
        const isnsfw = nsfwgrp.includes(chat.id)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const pokefile = sender.id+'.json'
        const groupfile = message.from+'.json'
        const ssfile = sender.id+'.json'
        sendnow = chat.id
        var expfile = sender.id+'.json'
        msgFilter.addFilter(author)


        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)

          switch (command) {
       case 'costom':
                arg = body.trim().split('|')
                if ((isMedia || isQuotedImage) && arg.length >= 2) {
                const top = arg[1]
                const bottom = arg[2]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await custom(getUrl, top, bottom)
                await client.sendFile(from, ImageBase64, 'image.png', '', '...', true)
                } else {
                await client.reply(from, 'Wrong Format!', id)
                }
            break
                    case 'linkgrupo':
            if (!isBotGroupAdmins) return client.reply(from, 'Este comando só pode ser usado quando o bot se torna administrador', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo *${name}*`)
            } else {
            	client.reply(from, 'Este comando só pode ser usado em grupos!', id)
            }
            break
        case 'printbot':
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', 'Neh...', id)
            break
            case 'covidbr': 
         arg = body.trim().split(' ')
         let slicedArgs = Array.prototype.slice.call(arg, 1); 
     console.log(slicedArgs)
     const state = await slicedArgs.join(' ') 
     const resData = await axios.get('https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/' + state + '/'); 
     const { cases, deaths, suspects } = resData.data; 
    await client.sendText(from,   'Covid Brasil Info -' + state + '\r\n Casos:' + `${cases}` + `\n Mortes totais: ${deaths}` + `\n Suspeitas: ${suspects}.`)
       break;
        case 'aiquote':
                let imgName = Math.floor((Math.random() * 100000) + 1);
                let aiQuoteUrl = await aiQuote.quoteByAI();
                await client.sendFileFromUrl(from, aiQuoteUrl,`${imgName}.png`, 'Powered By *https://inspirobot.me/*',  id)
            break
         /*case 'text':
             arg = body.trim().split(' ')
             if (arg.length == 0) return client.reply(from, 'Wrong format!', id)
             if (arg[1].toLowerCase() == 'physics') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Physics/Physics_1.pdf \n \n 11th Physics Part 1 [ENG]', id)
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Physics/Physics_2.pdf \n \n 11th Physics Part 2 [ENG]', id)
             } else if (arg[1].toLowerCase() == 'maths') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Mathematics/Mathematics.pdf \n \n 11th Maths [ENG]', id)
             } else if (arg[1].toLowerCase() == 'chemistry') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Chemistry/Chemistry_1.pdf \n \n 11th Chemistry [ENG]', id)
             } else if (arg[1].toLowerCase() == 'cs') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/CompSciencepart1/CompScience.pdf \n \n 11th CS Part 1 [ENG]', id)
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/CompSciencePart2/CompSciencePart2.pdf \n \n 11th CS Part 2 [ENG]', id)
             } else if (arg[1].toLowerCase() == 'history') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/History/ThemesinworldHistory.pdf \n \n 11th History [ENG]', id)
             } else if (arg[1].toLowerCase() == 'economics') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Economics/Indianeconomicsdevelopment.pdf \n \n 11th Indian Economics Dev [ENG]', id)
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Economics/Staticsforeconomics.pdf \n \n 11th Statics for Economics  [ENG]', id)
             } else if (arg[1].toLowerCase() == 'ps') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/PoliticalScience/Indianconstitutionatwork.pdf \n \n 11th Indian constitution at work [ENG]', id)
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/PoliticalScience/Politicaltheory.pdf \n \n 11th Political Theory [ENG]', id)
             } else if (arg[1].toLowerCase() == 'stat') {
             await client.reply(from,'https://d1v6qmyxzkp4v1.cloudfront.net/uploads/ebook/Class_XI/Statistics/Statistics.pdff', '11th Statistics [ENG]', id)
             } 
             break*/
            break
       /*case 'chatid':
            await client.reply(from,`Chat ID: ${from}`, id)
            break*/

        case 'claim' :
            if (!isGroupMsg) return client.reply(from, 'Baka!, This command can only be used in groups', message.id)
            const ss = fs.readFileSync('./lib/ssdata/so.json')
            var ssar = JSON.parse(ss)
            if (ssar.includes(wan)) {
            await client.reply(from, 'Already Taken! 💔️', id)
            break
            } else {
            const hs = fs.readFileSync(`./lib/ssdata/groups/${groupfile}`)
            const hs1 = JSON.parse(hs)
            const sspa = [hs1[0]]
            await fs.writeFile('./lib/ssdata/'+ssfile, JSON.stringify(sspa))
            ssar.push(wan)
            fs.writeFile('./lib/ssdata/so.json', JSON.stringify(ssar))
            await client.reply(from, `Congratulations! You are now married to *${hs1[0]}* 🎉️`, id)
            }
             break
               case 'bv':
             arg = body.trim().split(' ')
             if (!isGroupAdmins) return client.reply(from, 'Comando exclusivo de ADM!', id)
             		if (arg[1].toLowerCase() == 'habilitar') {
	     			if (wel.includes(chat.id)) {
	       				client.reply(from, `Bem vindo já está registrado em *${name}*`, message.id)
	     			} else {
               				wel.push(chat.id)
                			fs.writeFileSync('./lib/welcome.json', JSON.stringify(wel))
                			client.reply(from, `BemVindo Agora está habilitado no grupo.*${name}*`, message.id)
	     			}
             		} else if (arg[1].toLowerCase() == 'nsfw') {
	       			if (nsfwgrp.includes(chat.id)) {
				client.reply(from, `NSFW is already registered on *${name}*`, message.id)
	     			} else {
                		nsfwgrp.push(chat.id)
                		fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                		client.reply(from, `NSFW is now registered on *${name}*`, message.id)
				}
			} else if (arg[1].toLowerCase() == 'rule') {
				if (!isBotGroupAdmins) return client.reply(from, 'You need to make me admin to use this CMD', message.id)
				if (ruleArr.includes(chat.id)) {
					 client.reply(from, `Rule is already registered on *${name}*`, message.id)
				} else {
                			ruleArr.push(chat.id)
                			fs.writeFileSync('./lib/rule.json', JSON.stringify(ruleArr))
                			client.reply(from, `Rule is now registered on *${name}*`, message.id)
             			}
			}
             break
        case 'sbv':
             arg = body.trim().split(' ')
             if (!isGroupAdmins) return client.reply(from, 'Somente admins podem utilizar o comando >.<', id)
             if (arg[1].toLowerCase() == 'desabilitar') {
                let inx = ban.indexOf(from)
                wel.splice(inx, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(wel))
                client.reply(from, `Bem vindo foi desabilitado! *${name}*`, message.id)
             } else if (arg[1].toLowerCase() == 'nsfw') {
                let inx = ban.indexOf(from)
                nsfwgrp.splice(inx, 1)
                fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfwgrp))
                client.reply(from, `NSFW is now unregistered on *${name}*`, message.id)
             } else if (arg[1].toLowerCase() == 'pokegame') {
                let inx = pokarr.indexOf(from)
                pokarr.splice(inx, 1)
                fs.writeFileSync('./lib/poke.json', JSON.stringify(pokarr))
                client.reply(from, `PokeGame is now unregistered on *${name}*`, message.id)
             } else if (arg[1].toLowerCase() == 'rule') {
                let inx = ruleArr.indexOf(from)
                ruleArr.splice(inx, 1)
                fs.writeFileSync('./lib/rule.json', JSON.stringify(ruleArr))
                client.reply(from, `Rule is now unregistered on *${name}*`, message.id)
             }      
             break
	case 'start-wam':
	    await wam.memez(true, message)
            break
        case 'i-info':
            console.log(await client.inviteInfo(body.slice(8)))
        case 'infogrupo' :
            if (!isGroupMsg) return client.reply(from, '.', message.id) 
            var totalMem = chat.groupMetadata.participants.length
            var desc = chat.groupMetadata.desc
            var groupname = name
            var welgrp = wel.includes(chat.id)
            var ngrp = nsfwgrp.includes(chat.id)
            var grouppic = await client.getProfilePicFromServer(chat.id)
            var pkgame = pokarr.includes(chat.id)
            if (grouppic == undefined) {
                 var pfp = errorurl
            } else {
                 var pfp = grouppic 
            }
            await client.sendFileFromUrl(from, pfp, 'group.png', `*${groupname}* 

🌐️ *Membros: ${totalMem}*

💌️ *Welcome: ${welgrp}*

🎉️ *PokeGame* : *${pkgame}*

🔮️ *Rule* : *${isRule}*

⚜️ *NSFW: ${ngrp}*

📃️ *Group Description* 

${desc}`)
        break
        } 
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
 }