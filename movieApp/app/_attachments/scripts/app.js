'use strict'

angular.module('movieApp', ['ngRoute'])

	.config(function($routeProvider) {
	    $routeProvider
	        .when('/home', {
	            templateUrl: 'assets/views/home.html',
	            controller: 'homeCtrl'
	        });
	})
	
	.controller('homeCtrl', function($scope, personSrv, zoneSrv, saveSrv) {
		
	    	$('#searchButton').on('click', function (e) {

	    		$scope.movies = '';

	    		var name = $('#nameText').val();
	    		
	    		personSrv.getPerson(name).then(function(data){
	    			var arrayMovies = [];
	    			for (var i = 0; i < data.data[0].filmography.actor.length; i++) { 
	    				arrayMovies.push(data.data[0].filmography.actor[i].title);
	    			}
	    			$scope.movies = arrayMovies;
	    			/*
	    			var lat = parseFloat(data.data[0].lat);
	    			var lon = parseFloat(data.data[0].lon);
		    		var zones = saveSrv.getObject('zones');
		    		
		    		if(Object.keys(zones).length == 0){
		    			zoneSrv.getZones().then(function(data){
		    				zones = data;
		    				saveSrv.setObject('zones', data);
		    				$scope.color = zoneSrv.getTariff(lon, lat, zones.data);
		    			});
		    		}
		    		else {
		    			$scope.color = zoneSrv.getTariff(lon, lat, zones.data);
		    		}
		    		*/
	    		});
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
    
    .service('zoneSrv', function($http, $q) {
    		this.getZones = function() {
			var q = $q.defer();
			$http.get('http://datasets.antwerpen.be/v4/gis/paparkeertariefzones.json')
				.then(function(data, status, headers, config){
					q.resolve(data.data);
				}, function error(err) {
					q.reject(err);
				});
			
			return q.promise;
		};
    })
    
    .service('saveSrv', function($window, $http){
		  this.setObject = function(key, value){
			  $window.localStorage[key] = JSON.stringify(value);
			  //Save in CouchDB
			  //$http.put('../../' + key, value);
		  };
		  
		  this.getObject = function(key){
			  return JSON.parse($window.localStorage[key] || '{}');
		  };
	});