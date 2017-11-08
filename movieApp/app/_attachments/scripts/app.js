'use strict'

angular.module('movieApp', ['ngRoute'])

	.config(function($routeProvider) {
	    $routeProvider
	        .when('/home', {
	            templateUrl: 'assets/views/home.html',
	            controller: 'homeCtrl'
	        });
	})
	
	.controller('homeCtrl', function($scope, personSrv, saveSrv) {
		
	    	$('#searchButton').on('click', function (e) {

	    		$scope.movies = '';

	    		var name = $('#nameText').val().toLowerCase();
	    		var key = name.replace(" ","_");
	    		var obj = saveSrv.getObject(key);
	    		console.log(obj);
	    		if (!obj.movies) {
	    			console.log("zoeken");
		    		personSrv.getPerson(name).then(function(data){
		    			console.log(data.data);
		    			if (data.data != null) {
			    			console.log(data);
			    			var stringMovies = "";
			    			console.log(data.data[0]);
			    			var l = 0;
			    			var sex = 0;
			    			if (data.data[0].filmography.actor) {
			    				l = data.data[0].filmography.actor.length;
			    			}
			    			else {
			    				l = data.data[0].filmography.actress.length;
			    				sex = 1
			    			}
			    			for (var i = 0; i < l; i++) {
			    				stringMovies += '"';
			    				if (sex == 0) {
			    					var title = data.data[0].filmography.actor[i].title;
			    				}
			    				else {
			    					var title = data.data[0].filmography.actress[i].title;
			    				}
			    				stringMovies += title + '",';
			    			}
			    			if(stringMovies.length > 0) {
			    				stringMovies = stringMovies.slice(0,-1);
			    			}
			    			
			    			stringMovies = '{ "name" : "' + name.toLowerCase() + '", "movies" : [' + stringMovies + ']}';
			    			var jsonMovies = JSON.parse(stringMovies);
			    			$scope.movies = jsonMovies.movies;
			    			saveSrv.setObject(key, jsonMovies);		
		    			}
		    			else {
		    				$scope.movies = "Acteur/actrice bestaat niet";
		    			}
		    		});
	    		}
	    		else {
		    		$scope.movies = obj.movies;
	    		}
	    	});
    })
   
    .service('personSrv', function($http, $q) {
    		this.getPerson = function(name) {
	    		var q = $q.defer();
	    		var url = 'http://theimdbapi.org/api/find/person?name=' + encodeURIComponent(name) + '&format=json';

	    		$http.get(url)
	    			.then(function(data){
	    				q.resolve(data);
	    			}, function error(err) {
	    				q.reject(err);
	    			});
	    			
	    			return q.promise;
	    		};
    })
    
    .service('saveSrv', function($window, $http){
		  this.setObject = function(key, value){
			  console.log(key);
			  $window.localStorage[key] = JSON.stringify(value);
			  //Save in CouchDB
			  $http.put('../../' + key, value);
		  };
		  
		  this.getObject = function(key){
			  return JSON.parse($window.localStorage[key] || '{}');
		  };
	});