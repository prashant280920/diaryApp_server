
const handleProfile = (req, res, db) => {
	const { diaryName, Avatar, textColor } = req.body;
	const { id } = req.params;
	db('profile').where('id','=',id).update({
		diaryname:diaryName,
		avatar:Avatar,
		textcolor:textColor
	})
	.then(isUpdate =>{
		if(isUpdate=='1'){
			db.select('*').from("profile").where('id','=',id).then(user =>  res.json(user[0]));	
		}else{
			res.status(400).json("user not found")
		}
		
		
	})
	.catch(err => res.status(400).json("error getting user"))

}

module.exports = {
	handleProfile: handleProfile
};