angular
	.module('legapp',['ngRoute','angular-md5','mgcrea.ngStrap','ngSanitize','textAngular'])
	.config(function($routeProvider,$httpProvider){
		if(!$httpProvider.defaults.headers.get) $httpProvider.defaults.headers.get = {};
		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	    $routeProvider
	    	.when('/',{
	    		redirectTo:'/autoridades'
	    	})
			.when('/autoridades',{
				templateUrl:'views/autoridadesView.html',
				controller:'autoridadesController'
			})
			/*
			.when('/parlamentoj/colegios/:id',{
				templateUrl:'views/colegiosView.html',
				controller:'colegiosController'
			})
			.when('/parlamentoj/programa/:id',{
				templateUrl:'views/programaView.html',
				controller:'programaController'
			})
			*/
			.otherwise({redirectTo:'/parlamentoj'});
	});