
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
			})
			.then(_id => {
				db.select('*').from('userscontent')
				.where({email : email,
					dates : date})
				.then(data => res.json(data[0]))
				
			})
			.catch(_err => res.status(400).json('error getting userContent'))
		}else{
			db('userscontent').insert({
				email : email,
				textcontent : textContent,
				dates : date,
				fav : fav
			}).returning('*')
			.then(_id => {
				db.select('*').from('userscontent')
				.where({email : email,
					dates : date})
				.then(data => res.json(data[0]))
			})
			.catch(_err => res.status(400).json('errors getting userContent'))
		}
	})
	.catch(_err => res.status(400).json('error getting userContent'))
	
}

module.exports = {
	handleTextContent: handleTextContent
};