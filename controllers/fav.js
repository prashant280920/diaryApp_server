
const handleFav = (req, res, db, moment) => {
	const { email, month, year } = req.body;
	 db.select('*').from('userscontent')
	.where({email:email}).andWhereRaw(`EXTRACT(MONTH FROM dates) = ?`, [month]).andWhereRaw(`EXTRACT(YEAR FROM dates) = ?`, [year])
	 .then(data => {
	 	for(var i=0;i<data.length;i++){
	 		var obj = data[i];
	 		obj.dates = moment.utc(obj.dates).local().format('YYYY-MM-DD');
	 	}
	 	res.json(data)
	 })

}

module.exports = {
	handleFav: handleFav
};