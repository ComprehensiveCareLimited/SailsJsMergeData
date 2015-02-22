# Node JS

This is a simple Sails JS application over Node JS demostrating how to merge data programmatically

## Models and Connections

Connections are defined on *config > connections.js*. You can define several sql connections.

*Note: SQL adapter is prerequisite https://github.com/cnect/sails-sqlserver*


```javascript

  sqlserver_pomhn: {
    adapter: 'sails-sqlserver-adapter',
    user: 'robot',
    password: 'Passw0rd123',
    host: 'localhost', 
    database: 'pomhn_production'
  },

  sqlserver_potki: {
    adapter: 'sails-sqlserver-adapter',
    user: 'robot',
    password: 'Passw0rd123',
    host: 'localhost', 
    database: 'potki_production'
  },

```

In the model you can define the connection, thus, there needs to be a model per table per connection. 
e.g. for trans table merging potki and pomhn database we need to create two models under *api > models* folder:


```javascript

module.exports = {
  tableName: 'Trans',
  
  connection: ['sqlserver_pomhn'],

  attributes: {
  }
};

```

and *potki_Trans.js*


```javascript

module.exports = {
  tableName: 'Trans',
  
  connection: ['sqlserver_potki'],

  attributes: {
  }
};

```

## Retrieving records

To retrieve a record, you just use the custom service GlobalService.Find

Parameters:
1. PHO id
2. table name
3. filter (where clause)
4. Sort Function

```javascript
		GlobalService.Find(1, 'trans', {tran_status_id: statusId}, function(a,b){ // sort by transaction date
			if (a.tran_date < b.tran_date)
				return -1;
			else
				return 1;
			return 0;
		} , function(result){
			cb(result);
		});
```
output will be as follows:

```javascript

{
"id": 20774,
"case_id": 8107,
"tran_date": "2014-07-29T00:00:00.000Z",
"content_type": "Invoice",
"content_id": null,
"tran_status_id": 1,
"ref_no": null,
"clinical_information": "lorem ipsum e",
"orginisation_id": 303,
"provider_id": 3279,
"created_at": "2014-09-10T15:14:59.000Z",
"updated_at": "2014-09-10T15:14:59.000Z",
"comment": null,
"has_attachments": false,
"payment_run_id": 0,
"pms": "medtech32",
"source": {
"table": "potki_Trans",
"database": "potki"
}
},
{
"id": 36779,
"case_id": 12816,
"tran_date": "2014-08-01T00:00:00.000Z",
"content_type": "Invoice",
"content_id": null,
"tran_status_id": 1,
"ref_no": null,
"clinical_information": "lorem ipsum",
"orginisation_id": 173,
"provider_id": 2545,
"created_at": "2014-11-04T15:27:16.000Z",
"updated_at": "2014-11-04T15:27:16.000Z",
"comment": null,
"has_attachments": false,
"payment_run_id": 0,
"pms": "medtech32",
"source": {
"table": "pomhn_Trans",
"database": "pomhn"
}
},

```

notice that there is a source field included to specify where that specific record was pulled

```javascript
source": {
"table": "pomhn_Trans",
"database": "pomhn"
}
```

## Controller and service

For this example, a *TransController.js* has been created in *api > controllers* which returns the trans table in json format.
it takes two parameters, pho id and statusId.

```javascript
module.exports = {
	List: function(req, res){
		var pho = req.param('pho');
		var statusId = req.param('statusId');
		TransService.List(pho, statusId, function(transList){
			console.log('end');
			return res.json(transList);
		});		
	}	
};
```

the controller uses a TransService function which is on *api > services* on the file *TransService.js*:

```javascript
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
```
which again uses another service *GlobalService.js*:

```javascript
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
```

The GetTable gets the table and model mapping from the database (currently hardcoded) and the find function loops to through that table
and model mapping to retrieve data and returns then into a single object.

