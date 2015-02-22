module.exports = {
	List: function	(pho, statusId, cb){
		GlobalService.Find(1, 'trans', {tran_status_id: statusId}, function(a,b){ // sort by transaction date
			if (a.tran_date < b.tran_date)
				return -1;
			else
				return 1;
			return 0;
		} , function(result){
			cb(result);
		});
	}
};



