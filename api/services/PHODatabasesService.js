module.exports = {
	Database: function(){
		return [{id: 1, PHO: 'East Health', Database: ['pomhn_Trans', 'potki_Trans']}];
	},
	PHODatabase: function(){
		return [{id: 1, PHO: 'East Health', Database: [{Name: 'pomhn', ObjectTableMapping: [{Table: 'trans', Object: 'pomhn_Trans'}, 
																							{Table: 'users', Object: 'pomhn_Users'}
																						   ]
													   },
													   {Name: 'potki', ObjectTableMapping: [{Table: 'trans', Object: 'potki_Trans'}, 
													                                        {Table: 'users', Object: 'potki_Users'}
													                                       ]
													   }]
				}];
	}	
};

