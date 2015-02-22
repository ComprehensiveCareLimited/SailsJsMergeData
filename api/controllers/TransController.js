/**
 * TransController
 *
 * @description :: Server-side logic for managing trans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	List: function(req, res){
		//console.log('asfsd');
		//console.log(Trans.adapter);
		//Trans.adapter = 'sqlserver_pomhn';
		var pho = req.param('pho');
		var statusId = req.param('statusId');
		TransService.List(pho, statusId, function(transList){
			console.log('end');
			return res.json(transList);
		});		
	}	
};

