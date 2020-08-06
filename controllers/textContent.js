
const handleTextContent = (req, res, db) => {
	const { email, textContent, date, fav } = req.body;
	db.select('*').from('userscontent')
	.where({
		email : email,
		dates : date
	}).then(user => {
		if(user.length){
			db.select('*').from('userscontent')
			.where({
				email : email,
				dates : date
			}).update({
				textcontent : textContent,
				fav : fav
			}).returning('*')
			.then(content => {res.json(content[0])})
			.catch(err => res.status(400).json('error getting userContent'))
		}else{
			db('userscontent').insert({
				email : email,
				textcontent : textContent,
				dates : date,
				fav : fav
			}).returning('*')
			.then(content => {res.json(content[0])})
			.catch(err => res.status(400).json('error getting userContent'))
		}
	})
	.catch(err => res.status(400).json('error getting userContent'))
	
}

module.exports = {
	handleTextContent: handleTextContent
};