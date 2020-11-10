const fs = require('fs-extra')
const errorurl2 = 'https://steamuserimages-a.akamaihd.net/ugc/954087817129084207/5B7E46EE484181A676C02DFCAD48ECB1C74BC423/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'

module.exports = { profile }
async function profile(contact, message, expfile, groupAdmins) {
 try {
   if (contact == '919074161917@c.us') {
             var sts = {"status" : "One million sorry`s is not equal to one `Thank You`"}
             var block = 'Never!'
             var pic = 'https://static.zerochan.net/Emilia.%28Re%3AZero%29.full.2021606.jpg'
             var SO = 'Subaru'
             var role = 'Princess'
             var exps = '8055'
             var person = { "pushname" : "Emilia ✨️"}
             var adm = 'Depends'
   } else {
             var ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
             var person = await sclient.getContact(contact)
             var sts = await sclient.getStatus(contact)
             var block = ban.includes(contact)
             var pfp = await sclient.getProfilePicFromServer(contact)
             var adm = groupAdmins.includes(contact)

             if (fs.existsSync('./lib/expdata/'+expfile)) {
             var expdata = await JSON.parse(fs.readFileSync('./lib/expdata/'+expfile))
             var exps = expdata[0]
                    if (exps < 500) {
                    var role = '⭐️ Citizen'
                    } else if (exps < 1500) {
                    var role = '🔍️ Cleric'
                    } else if (exps < 4000) { 
                    var role = '🔮️Wizard'
                    } else if (exps < 7500) {
                    var role = '♦️ Mage'
                    } else if (exps < 10000) {
                    var role = '🎯️ Noble'
                    } else if (exps < 35000) {
                    var role = '✨️ Elite'
                    } else if (exps < 50000) {
                    var role = '🔶️ Ace'
                    } else if (exps < 100000) {
                    var role = '💎️ Supreme' 
		    } else if (exps < 250000) {
                    var role = '🛡️ Legendary' 
		    } else if (exps < 375000) {
                    var role = '🛡️ Legendary II' 
	            } else if (exps > 375000) {
                    var role = '🛡️ Legendary III' 
                    } else { 
                    var role = 'None'
                    }
             } else {
                var exps = 0
                var role = '⭐️ Citizen'
             }

             if (fs.existsSync('./lib/ssdata/'+contact+'.json')) {
             const ss = fs.readFileSync('./lib/ssdata/'+contact+'.json')
             const sso = JSON.parse(ss)
             var SO = sso[0]
             } else {
             var SO = 'None'
             }
             if (pfp === undefined) {
                var pic = errorurl2
             } else {
                var pic = pfp
             } 
   }
             await sclient.sendFileFromUrl(message.from, pic, 'pfp.jpg', `🔖️ *Username: ${person.pushname}*

💌️ *User Info: ${sts.status}*

♥️ *Haigusha: ${SO}*

💔️ *Ban: ${block}*

💚️ *Role: ${role}*

✨️ *Exp: ${exps}*

👑️ *Admin: ${adm}*`)

} catch(err) {
console.log(err)
await sclient.reply(message.from, 'An error occured', message.id)

}

}



