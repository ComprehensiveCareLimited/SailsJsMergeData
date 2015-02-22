module.exports = {
	List: function(pho, cb){

		GlobalService.Find(1, 'users', {username: 'Claire'}, function(a,b){ // sort by transaction date
			if (a.username < b.username)
				return -1;
			else
				return 1;
			return 0;
		} , function(result){
			cb(result);
		});
	}	
};



