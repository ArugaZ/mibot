const fs = require('fs-extra')
const axios = require('axios')
const nrc = require('node-run-cmd')
const moment = require('moment-timezone')
const get = require('got')
const { exec } = require('child_process')
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json'))
const akaneko = require('akaneko')
const bent = require('bent')
var request = require('request');
require('dotenv').config()
const { create, decryptMedia, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const fetch = require('node-fetch')
const rugaporn = require('@justalk/pornhub-api')
const banned = JSON.parse(fs.readFileSync('./settings/banned.json'))

const { 
    removeBackgroundFromImageBase64
} = require('remove.bg')

const { menuId, cekResi, urlShortener, meme, translate, getLocationData, images, resep, rugapoi, rugaapi } = require('C:\\Users\\icarusbot\\Desktop\\Whatsapp-Botto-Re-master\\bot\\lib')

const {  
    color, 
    processTime, 
    isUrl 
} = require('C:\\Users\\icarusbot\\Desktop\\Whatsapp-Botto-Re-master\\bot\\utils')

const options = require('C:\\Users\\icarusbot\\Desktop\\Whatsapp-Botto-Re-master\\bot\\utils\\options')
const { uploadImages } = require('C:\\Users\\icarusbot\\Desktop\\Whatsapp-Botto-Re-master\\bot\\utils\\fetcher')

const { 
    ownerNumber, 
    groupLimit, 
    memberLimit,
    prefix
} = JSON.parse(fs.readFileSync('C:\\Users\\icarusbot\\Desktop\\Whatsapp-Botto-Re-master\\bot\\settings\\setting.json'))

const {
    apiNoBg
} = JSON.parse(fs.readFileSync('C:\\Users\\icarusbot\\Desktop\\Whatsapp-Botto-Re-master\\bot\\settings\\api.json'))

module.exports = msgHandler3 = async (client, message) => {

    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        var { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isOwnerBot = ownerNumber == sender.id
        
        const isBanned = banned.includes(sender.id)

        // Bot Prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
	    const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'

        //
        if (!isCmd) { return }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

        if (isBanned) {
            return console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        switch (command) {
        // Menu and TnC
        case 'speed':
        case 'ping':
            await client.sendText(from, `Aqui está a velocidade do icarus\nVelocidade de processo: ${processTime(t, moment())} _segundos_`)
            break
        case 'sticker2':
        case 'stiker2': {
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64).then(() => {
                    client.reply(from, 'Here\'s your sticker')
                    console.log(`Sticker Processado em ${processTime(t, moment())} Segundos`)
                })
            } else if (args[0] === 'nobg') {
            if (isMedia || isQuotedImage) {
              try {
                var mediaData = await decryptMedia(message, uaOverride)
                var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                var base64img = imageBase64
                var outFile = './media/noBg.png'
		        // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json
                var result = await removeBackgroundFromImageBase64({ base64img, apiKey: apiNoBg, size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
	   	    await client.reply(from, 'desculpe, o limite de uso de hoje é máximo', id)
                }
            }
            } else if (args.length === 1) {
                if (!isUrl(url)) { await client.reply(from, 'Desculpe, o link que você enviou é inválido.', id) }
                client.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                    ? client.sendText(from, 'Desculpe, o link que você enviou não contém uma imagem.')
                    : client.reply(from, 'Aqui está seu sticker')).then(() => console.log(`Sticker Processed for ${processTime(t, moment())} Second`))
            } else {
                await client.reply(from, `Sem imagens! Usar ${prefix}sticker\n\n\nEnvie fotos com legendas\n${prefix}sticker \n${prefix}sticker nobg <adesivo sem fundo>\n\nou enviar mensagem com\n${prefix}sticker <link>`, id)
            }
            break
        }

        case 'stickergif2':
        case 'stikergif2':
            {
            if (isMedia || isQuotedVideo) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    var mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '[ESPERE] Processando gif⏳  Espere ± até 40 segundos!', id)
                    var filename = `./media/stickergif.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/stickergf.gif --fps=250 --scale=240:240`, async function (error, stdout, stderr) {
                        var gif = await fs.readFileSync('./media/stickergf.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
			
                    })
                  } else {
                    client.reply(from, `[❗] ERRO, Imagem muito grande ou escala fora do normal *${prefix}stickergif* max 10 segundos!`, id)
                   }
                } else {
		    client.reply(from, `[❗] Envie foto como uma legenda! *${prefix}stickergif*`, id)
	        }
            break
        }
        case 'stikergiphy':
        case 'stickergiphy':
	 {
            if (args.length !== 1) return client.reply(from, `Criar um giphy.\n ${prefix}stickergiphy <link_giphy>`, id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return client.reply(from, 'Falha ao recuperar o código giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.reply(from, 'Aqui está seu sticker')
                    console.log(`Sticker processado em ${processTime(t, moment())} Segundos`)
                }).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    client.reply(from, 'Aqui está seu sticker')
                    console.log(`Sticker processado em ${processTime(t, moment())} Segundos`)
                }).catch((err) => console.log(err))
            } else {
                await client.reply(from, 'desculpe, os comandos do adesivo giphy só podem usar links do giphy.  [Giphy Somente]', id)
            }
            break
        }
        case 'instagram':
            if (args.length == 0) return client.reply(from, `Baixa um vídeo do instagram\nketik: ${prefix}instagram [link_ig]`, id)
            const instag = await rugaapi.insta(args[0])
            await client.sendFileFromUrl(from, instag, '', '', id)
            break
        case 'ytmp3':
            if (args.length == 0) return client.reply(from, `Baixa música do youtube\nketik: ${prefix}ytmp3 [link_yt]`, id)
            const mp3 = await rugaapi.ytmp3(args[0])
            await client.sendFileFromUrl(from, mp3, '', '', id)
            break
        case 'ytmp4':
            if (args.length == 0) return client.reply(from, `Baixa video do youtube\nketik: ${prefix}ytmp3 [link_yt]`)
            const mp4 = await rugaapi.ytmp4(args[0])
            await client.sendFileFromUrl(from, mp4, '', '', id)
            break

        // Random Kata
        case 'fakta':
            fetch('https://raw.githubusercontent.com/clientZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                client.reply(from, randomnix, id)
            })
            break
        case 'katabijak':
            fetch('https://raw.githubusercontent.com/clientZ/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                client.reply(from, randombijak, id)
            })
            break
        case 'imagem':
            if (args.length == 0) return client.reply(from, `Procurando imagens no pinterest\nExemplo: ${prefix}!imagem [procurar]\nUtilizando:${prefix}!imagem naruto`, id)
            const cariwall = body.slice(8)
            const hasilwall = await images.fdci(cariwall)
            client.sendFileFromUrl(from, hasilwall, '', '', id)
            break
        case 'red':
            if (args.length == 0) return client.reply(from, `Procura posts no reddit\n ${prefix}reddit [procurar]\nExemplo ${prefix}sreddit naruto`, id)
            const carireddit = body.slice(9)
            const hasilreddit = await images.sreddit(carireddit)
            client.sendFileFromUrl(from, hasilreddit, '', '', id)
        case 'hent':
            client.sendText(from, `Procurando videos mais recentes...`)
            rugapoi.getLatest()
            .then((result) => {
                rugapoi.getVideo(result.link)
                .then((res) => {
                    let heheq = '\n'
                    for (let i = 0; i < res.links.length; i++) {
                        heheq += `${res.links[i]}\n`
                    }
                    client.reply(from, `Titulo: ${res.title}\n\nLink:\n${heheq}\n:v`)
                })
            })
            break
         case 'pornhub':
            if (args.length == 0) return client.reply(from, `Procurando videos\n\n ${prefix}pornhub [pesquisa]\nExemplo> ${prefix}pornhub japanese`, id)
            const cariporn = body.slice(9)
            rugaporn.search(cariporn, ['title', 'link','hd'])
            .then((res) => {
                const ramdom = Math.floor(Math.random() * res.results.length)
                const domram = res.results[ramdom].link
                client.reply(from, ` video\n\n ${res.results[ramdom].title}\nAuthor: ${res.results[ramdom].author}\nView: ${res.results[ramdom].views}\nLink: ${res.results[ramdom].link}`)
                rugaporn.page(domram, ['title','pornstars','download_urls'])
                .then(async (res) => {
                    await client.reply(from, `*Streaming*\n\nJudul: ${res.title}\nArtis: ${res.pornstars}\n\n720: ${res.download_urls['720P']}\n480: ${res.download_urls['480P']}\n240: ${res.download_urls['240P']}\n\nbot icarus pesquisando...`, id)
                    await client.sendFileFromUrl(from, `${res.download_urls['720P']}`, '', `video download 720p`, id)
                    .catch(async() => {
                        await client.sendFileFromUrl(from, `${res.download_urls['480P']}`, '', `video download 480p`, id)
                        .catch(async() => {
                            await client.sendFileFromUrl(from, `${res.download_urls['240P']}`, '', `video download 240p`, id)
                            .catch(() => {
                                client.reply(from, 'Error', id)
                            })
                        })
                    })
                })
            })
            break
        case 'stalkig':
            if (args.length == 0) return client.reply(from, `\nUse ${prefix}stalkig [username]\nEx> ${prefix}stalkig justinbieber`, id)
            const igstalk = await rugaapi.stalkig(args[0])
            const igstalkpict = await rugaapi.stalkigpict(args[0])
            await client.sendFileFromUrl(from, igstalkpict, '', igstalk, id)
            break
        case 'wiki':
            if (args.length == 0) return client.reply(from, `Faça uma pesquisa no wikipedi\nExemplo: ${prefix}wiki [brasil]`, id)
            const wikip = body.slice(6)
            const wikis = await rugaapi.wiki(wikip)
            await client.reply(from, wikis, id)
            break
        case 'ss': //jika error silahkan buka file di folder settings/api.json dan ubah apiSS 'API-KEY' yang kalian dapat dari website https://apiflash.com/
            if (args.length == 0) return client.reply(from, `Faça a captura de tela dos bots em uma web\n\nUso:${prefix}ss [url]\n\nExemplo ${prefix}ss http://google.com`, id)
            const scrinshit = await meme.ss(args[0])
            await client.sendFile(from, scrinshit, 'ss.jpg', 'Arquivo', id)
            break
        case 'translate':
            if (args.length != 1) return client.reply(from, `Desculpe, o formato da mensagem está errado.\nResponda a uma mensagem com uma legenda ${prefix}translate <código>\nExemplo; ${prefix}translate pt`, id)
            if (!quotedMsg) return client.reply(from, `Desculpe, o formato da mensagem está errado.\nResponda a uma mensagem com uma legenda ${prefix}translate <código>\nExemplo; ${prefix}translate pt`, id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
                .then((result) => client.sendText(from, result))
                .catch(() => client.sendText(from, 'Errado'))
            break
        case 'encurtar':
            if (args.length == 0) return client.reply(from, `Utilize ${prefix}encurtar <url>`, message.id)
            if (!isUrl(args[0])) return client.reply(from, 'Este link não é válido', message.id)
            const shortlink = await urlShortener(args[0]);
            await client.sendText(from, shortlink);
            break
	    case 'adicionar':
            if (!isGroupMsg) return client.reply(from, 'Comando apenas utilizado em grupos!', id)
            if (!isGroupAdmins) return client.reply(from, 'Comando apenas liberado para Administradores de grupo!', id)
            if (!isBotGroupAdmins) return client.reply(from, 'O bot precisa ser adm para adicionar!', id)
	        if (args.length !== 1) return client.reply(from, `Escreva${prefix}add\nPExemplo${prefix}adicionar numero\n ${prefix}!adicionar 558188263143`, id)
                try {
                    await client.addParticipant(from,`${args[0]}@c.us`)
		            .then(() => client.reply(from, 'Adicionado', id))
                } catch {
                    client.reply(from, 'Não foi possivel', id)
                }
            break
        case 'botstatus': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Status :\n- *${loadedMsg}* Mensagens Carregadas\n- *${groups.length}* Chats de Grupo\n- *${chatIds.length - groups.length}* Chats normais\n- *${chatIds.length}* ChatsTotais`)
            break
        }
        case 'clearall': //menghapus seluruh pesan diakun 
            const allChatx = await client.getAllChats()
            for (let dchat of allChatx) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Succes clear all chat!', id)
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}
        
