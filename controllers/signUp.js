
const handleSignUp = (req, res, db, bcrypt) => {
	const { email, name, diaryName, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(loginemail => {
			return trx("profile")
				.returning('*')
				.insert({
					email:loginemail[0],
					name:name,
					diaryname:diaryName,
					joined:new Date()
				}).then(user => {
					res.json(user[0]);	
				})

		}).then(trx.commit)
		.catch(trx.rollback)
	}).catch(err => res.status(400).json("err.detail"))
	
}

module.exports = {
	handleSignUp: handleSignUp
};