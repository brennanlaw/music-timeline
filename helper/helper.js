const crypto = require('crypto');

module.exports = {

 	Album: (function(){
		return function item(title, albumId, artistId, artistName, year, cover){
			this.title = title;
			this.albumId = albumId.toString();
			this.artistId = artistId.toString();
			this.artistName = artistName;
			this.year = year.toString();
			this.cover = cover;
		};
	}()),

    Artist: (function(){
		return function item(name, artistId, picture){
			this.name = name;
			this.artistId = artistId.toString();
            this.picture = picture;
		};
	}()),

    User: (function(){
		return function item(username, salt, hash){
			this.username = username;
			this.salt = salt;
            this.hash = hash;
			this.likedArtists = [];
			this.reccAlbums = [];
		};
	}()),

	generateSalt: function () {
		return crypto.randomBytes(16).toString('base64');
    },

	generateHash: function (password, salt) {
		var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('base64');
    },

	getRandomItems: function (arr, n) {
		if (n >= arr.length) return arr;
		var arr2 = [...arr];
		var index;
		var result = [];
		while (n--) {
			index = Math.floor(Math.random() * arr2.length);
			randomItem = arr2[index];
			arr2.splice(index, 1);
			result.push(randomItem);
		}
		return result;
  	},

	getUsernames: function (arr) {
		var result = [];
		for (var i = 0; i < arr.length; i++) {
			result.push(arr[i].username);
		}
		return result;
    }
};





	

