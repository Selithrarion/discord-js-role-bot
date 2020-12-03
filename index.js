require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));
commandFiles.forEach((file) => {
	const command = require('./commands/' + file);
	client.commands.set(command.name, command);
});

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

client.login(token);
client.on('ready', () => {
	console.log('ready');
});

const rolesLocal = [
	{
		name: 'Сила',
		emoji: '🔴',
	},
	{
		name: 'Воля',
		emoji: '🟣',
	},
	{
		name: 'Ловкость',
		emoji: '🟢',
	},
	{
		name: 'Интеллект',
		emoji: '🔵',
	},
	{
		name: 'Удача',
		emoji: '🟠',
	},
	{
		name: 'Красноречие',
		emoji: '💗',
	},
];

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.message.channel.name !== 'получение-ролей') return;
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error(
				'Что-то произошло не так при получении сообщения: ',
				error
			);
			return;
		}
	}

	try {
		const memberWhoReacted = reaction.message.guild.members.cache.get(user.id);
		const memberWhoReactedRoles = memberWhoReacted._roles
		const isReactedAdmin = memberWhoReacted.hasPermission('ADMINISTRATOR')
		const addedReactionName = reaction.emoji.name;

		const roleObjectToFind = rolesLocal.find(
			(role) => role.emoji === addedReactionName
		);
		const roleIndex = rolesLocal.indexOf(roleObjectToFind)
		if(!roleObjectToFind) return
		const roleNameToFind = roleObjectToFind.name;

		const allGuildRoles = reaction.message.guild.roles.cache
		const role = allGuildRoles.find(
			(role) => role.name === roleNameToFind
		);

		// const messageIdOnlyOneRole = '783543880590688259'
		// const messageIdManyRoles = '783527161642352681'
		// const messageIdReacted = reaction.message.id
		reaction.message.react(reaction.emoji)

		// console.log(messageIdOnlyOneRole)
		// console.log(messageIdManyRoles)
		// console.log(messageIdReacted)
		// console.log(isReactedAdmin)

		// 1. фильтр на пользователя и оставить только последнюю реакцию
		// if(!user.bot) {
		// 	if(messageIdReacted === messageIdOnlyOneRole) {
		// 		const allReactions = reaction.message.reactions.cache
				// const allCollectionsWithUserReactions = []
				// allReactions.forEach(item => allCollectionsWithUserReactions.push(item.users.cache))

				// console.log(user.id)
				// allCollectionsWithUserReactions.forEach(collection => {
				// 	collection.filter(item => {
				// 		return item.id !== user.id
				// 	})
				// })
				//
				// message.channel.fetchMessage(messageID).map(r => r).then(message => {
				// 	message.reactions.forEach(reaction => reaction.remove(UserID))
				// })

				// allReactions.forEach(reaction => reaction.remove(user.id))
				// allReactions.forEach(item => {
				// 	item.forEach(collection => {
				// 		collection.filter(member => member.id !== user.id)
				// 	})
				// })

				// allCollectionsWithUserReactions.forEach(item => item.filter(users => {
				// 	console.log(users)
				// 	users !== user.id
				// }))

				// allReactions.forEach(item => item.users.cache.filter(users => {
				// 	console.log(users.id)
				// 	users.id !== user.id
				// }))

		//думаю наиболее близкое решение, но не могу удалить уже найденного пользователя.
				// allReactions.forEach(item => item.users.cache.filter(member => {
				// 	// if (member.id === user.id) {
				// 	// 	console.log(member.id);
				// 	// 	member.splice()
				// 	// }
				// 	console.log('-------')
				// 	console.log(member)
				// 	member.id !== user.id
				// }))

				// console.log(allCollectionsWithUserReactions)
				// collection.filter(item => {
				// 	console.log('------')
				// 	console.log(item.id)
				// 	item.id !== user.id
				// })
				// console.log(allCollectionsWithUserReactions)

				// let counter = 0
				// allReactions.forEach((item) => {
				// 	item.users.cache = newCollectionToUpdate[counter]
				// 	console.log(newCollectionToUpdate[counter])
				// 	console.log(item.users.cache)
				// 	counter++
				// })

				// allCollectionsWithUserReactions.forEach(reactionCollection => reactionCollection.filter(checkMember => checkMember.id !== user.id))
				// console.log(allCollectionsWithUserReactions)

				// console.log('========================================')
				// console.log(allCollectionsWithUserReactions.forEach(reactionCollection => console.log(reactionCollection)))
				// console.log('-----------------------')
				// console.log(allCollectionsWithUserReactions)

				// console.log(memberWhoReacted)
				// const CollectionToFindRole

				// const newAllGuildRoles = allGuildRoles.filter(role => role.name !== rolesLocal.name)

				//.find(user => user.id === memberWhoReacted)
				// const memberOtherReactions = allReactions.find()
				// console.log(allReactions.forEach(reaction => console.log(reaction)))

		if (!user.bot) {
			memberWhoReacted.roles.add(role);
		}
	} catch (e) {
		console.error(e)
	}
});

client.on('messageReactionRemove', (reaction, user) => {
	if (user && !user.bot && reaction.message.channel.guild) {
		try {
			const deletedEmojiName = reaction.emoji.name
			const allRoles = reaction.message.channel.guild.roles.cache
			const roleToDeleteLocal = rolesLocal.find(role => role.emoji === deletedEmojiName)
			const roleNameToDeleteLocal = roleToDeleteLocal.name
			const role = allRoles.find(role => role.name === roleNameToDeleteLocal)
			const roleId = role.id

			const memberWhoDeletedReaction = reaction.message.guild.members.cache.get(user.id);

			memberWhoDeletedReaction.roles.remove(roleId)
		} catch(e) {
			console.error(e)
		}
	}
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	if (command.args && !args.length) {
		let reply = 'Без аргументов дверь закрыта, ' + message.author;

		if (command.usage) {
			reply += `\nЭто нужно использовать вот так: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('упс! произошла какая-то ошибка. напиши админу');
	}
});
