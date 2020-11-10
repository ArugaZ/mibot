
const fs = require('fs-extra')

module.exports = welcome = async (client, event) => {
  return 
  const wel = JSON.parse(fs.readFileSync('./lib/welcome.json'))
  const iswel = wel.includes(event.chat)
  try {
  if ((event.action == 'add') && (iswel == true)) {
  const det = await client.getChatById(event.chat)
  const person = await client.getContact(event.who)
  const personname = person.pushname 
  const groupname = det.contact.formattedName 
  await client.sendTextWithMentions(event.chat, `Seja Bem Vindo! *${groupname}!* \n\n@${event.who.replace('@c.us', '')} \n\n? \n\n *Descrição do grupo;* ?? \n\n ${det.groupMetadata.desc}`)
  } 

  } catch(err) {

  console.log(err)

  }

}
