
const handleShowText = (req, res, db) => {
	const { email, date } = req.body;
	db.select('*').from('userscontent')
	.where({
		email:email,
		dates:date
	}).then(content => {
		if(content.length){
			res.json(content[0])	
		}else{
			res.status(400).json("content not found")
		}
		
	}).catch(err => {
		res.status(400).json("unable to get textContent")
	})
}

module.exports = {
	handleShowText: handleShowText
};