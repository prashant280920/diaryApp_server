
const handleSignUp = (req, res, db, bcrypt) => {
	const { email, name, diaryName, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		// .returning('email')
		.then(_dataid => {
			return trx("profile")
				// .returning(['*'])
				.insert({
					email:email,
					name:name,
					diaryname:diaryName,
					joined:new Date()
				}).then(id => {
					db.select("*").from('profile').where('id','=',id[0])
					.then(user => {
						res.json(user[0])}
					)
					.catch(_err => {
						res.status(400).json("error getting user")})
						
				})

		}).then(trx.commit)
		.catch(trx.rollback)
	}).catch(_err => res.status(400).json("email already exit"))
	
}

module.exports = {
	handleSignUp: handleSignUp
};