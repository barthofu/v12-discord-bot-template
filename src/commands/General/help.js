const commandParams = {
    
    name: "",
    aliases: ["h"],
    desc: {
        en: "Displays the help of the bot.",
        fr: "Affiche l'aide du bot."
    },
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: 4000

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd) {

        let prefix = db.guild.get(`guilds.${msg.guild.id}.prefix`).value()

        let embed = new MessageEmbed()
            .setTitle(lang["help"]["title"][la])
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png")

        let categories = [...new Set(bot.commands.map(command => command.categoryName))]

        for (let category of categories) {

            let content = bot.commands.filter(command => command.categoryName === category).map(command => {
                command.verification.enabled == true && command.permission.owner == false ? 
                    `\`${prefix}${command.info.name.split("/").join(" ")}\`${command.info.aliases.filter(val => !val.startsWith("_")).length > 0 ? ` (ou ${command.info.aliases.filter(val => !val.startsWith("_")).map(val => `\`${prefix}${val}\``).join(" | ")})`:""} | ${this.checkCommand(command)} ${command["info"]["desc"][la]}\n` : ""
            }).join("")

            if (content.length > 0) embed.addField(category, content)
        }

        msg.channel.send(embed)

    }

    checkCommand (command) {
        
        let text = ""
        if (command.verification.nsfw == true) text+="[**NSFW**] "
        if (command.permission.memberPermission.includes("ADMINISTRATOR")) text+="[**ADMIN**] "
        if (command.info.cooldown !== null) text+=`[**${command.info.cooldown}** sec] `
        return text
    }

}