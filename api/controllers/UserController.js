/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	List: function (req, res){
		/*
		var name = req.param("name");
		User.find({}).exec(function(err, result){
			return res.json(result);	
		});
*/
		//return res.json(GlobalService.GetTable(1, 'trans'));
		UsersService.List(1, function(result){
			return res.json(result);
		})

	},

	Add: function(req, res){
		var name = req.param("name");
		var username = req.param("username");
		var password = req.param("password");
		if (name == undefined || username == undefined || password == undefined){
			return res.serverError('invalid parameters.')
		}
		else{
			var user = {Name: name,
				Username: username,
				Password: password
			};

			User.create(user).exec(function(err, result){
				return res.json(result);
			});
		}
	}
};

