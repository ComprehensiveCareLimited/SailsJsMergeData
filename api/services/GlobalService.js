module.exports = {
	GetTable: function(pho, tableName){
		var PODatabases = PHODatabasesService.PHODatabase();
		var tables = [];
		for (var i=0; i < PODatabases.length; i++){
			if (PODatabases[i].id == pho){
				for (var iDatabase=0; iDatabase < PODatabases[i].Database.length; iDatabase++){
					for (var itable=0; itable < PODatabases[i].Database[iDatabase].ObjectTableMapping.length; itable++){
						if (PODatabases[i].Database[iDatabase].ObjectTableMapping[itable].Table == tableName){
							tables.push({table: PODatabases[i].Database[iDatabase].ObjectTableMapping[itable].Object,
								database: PODatabases[i].Database[iDatabase].Name});
						}
					}
				}
			}
		}
		return tables;
	},

	Find: function(pho, table, filterObject, sortFunction, cb){
		var tables = GlobalService.GetTable(pho, table);
		var r = [];
		var iterator = 0;
		async.eachSeries(tables, function(dbTableName, callback){ // iterate each database using async https://github.com/caolan/async#each
			console.log('->' + dbTableName);
			var dbObjModel = eval(dbTableName.table);
			dbObjModel.find(filterObject).exec(function(err, result){
				if (result != undefined){
					if (result.length > 0){
						for (var resultItem=0; resultItem < result.length; resultItem++){
							result[resultItem].source = dbTableName;
							r[iterator] = result[resultItem];
							iterator++;
						}
					}
				}
				callback();
			});
		}, function(){ // callback function, execute when all data have been retreived.
			r.sort(sortFunction);
			cb(r); // return the result when all the retrieve have all finished.
		});		
	}
};