angular
.module('legapp')
.controller('autoridadesController',function($scope,$rootScope,$location,$http,$session,md5){

	$scope.pushIn = function(v,a){ a.push(v); };

	$scope.padLeft = function(n){
		s = n.toString();
		if(s.length==1) s = '0'+s;
		return s;
	};

	$scope.init = function(){
		$session.init();
		$scope.d = new Date();
		$scope.dias  = [];
		$scope.meses = [];
		$scope.anios = [];
		$scope.cargos = ['PRESIDENTE','VICEPRESIDENTE PRIMERO','VICEPRESIDENTE SEGUNDO','SECRETARIO ADMINISTRATIVO','SECRETARIO PARLAMENTARIO'];
		$scope.toolbars = [
			['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'quote'],
			['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
			['justifyLeft','justifyCenter','justifyRight','justifyFull']
		];
		$scope.resetModelo();
		$scope.httpGetAutoridades();

		for(i=1;i<=31;i++) $scope.pushIn($scope.padLeft(i),$scope.dias);
		for(i=1;i<=12;i++) $scope.pushIn($scope.padLeft(i),$scope.meses);
		for(i=($scope.d.getFullYear() +4);i>=1983;i--) $scope.pushIn(i.toString(),$scope.anios);
	};

	$scope.httpGetAutoridades  = function(){
		$scope.resetDisplay();
		uri='/rest/ful/adminaut/index.php/autoridades';
		$session.autorize(function(){
			$http
				.get(uri)
				.error(()=>{console.log(uri+' : No Data');})
				.success((json)=>{if(json.result){ $scope.lista=json.rows; }});
				$scope.formularios.lista.display=true;
		});
	};

	$scope.resetDisplay = function(){
		$scope.formularios.lista.display=false;
		$scope.formularios.formulario.display=false;
		$scope.formularios.formulario.disabled=true;
		$scope.formularios.formulario.botones.visualizar=false;
		$scope.formularios.formulario.botones.nuevo=false;
		$scope.formularios.formulario.botones.modificar=false;
	};

	$scope.resetModelo = function(){
		$scope.modelo = {
			id:null,
			institucion_id:83,
			archivo:null,
			partido_id:null,
			nombre:null,
			apellido:null,
			desde:null,
			hasta:null,
			cargo:'PRESIDENTE',
			biografia:null,
			competencias:null,
			formacion:null,
			experiencia:null,
			telefono:null,
			email:null,
			orden:1,
			estado:'INACTIVO'
		};

		$scope.desde = {
			dia:$scope.padLeft($scope.d.getDate()),
			mes:$scope.padLeft($scope.d.getMonth() +1),
			anio:$scope.d.getFullYear().toString()
		};

		$scope.hasta = {
			dia:$scope.padLeft($scope.d.getDate()),
			mes:$scope.padLeft($scope.d.getMonth() +1),
			anio:$scope.d.getFullYear().toString()
		};

		$scope.email = {
			usuario:'usuario',
			dominio:'dominio',
			locacion:'gov.ar'
		};

	};

	$scope.formularios = {
		lista:{
			display:false,
			botones:{
				nuevo:function(){
					$scope.resetModelo();
					$scope.resetDisplay();
					$scope.formularios.formulario.display=true;
					$scope.formularios.formulario.disabled=false;
					$scope.formularios.formulario.botones.nuevo=true;
					fotografia = document.getElementById('fotografia');
					fotografia.innerHTML = '';
				},
				visualizar:function(k){
					$scope.resetDisplay();
					id = $scope.lista[k].id;
					uri = '/rest/ful/adminaut/index.php/autoridad/' +id;
					$http
						.get(uri)
						.error(function(){console.log(uri+' : No Data');})
						.success(function(json){if(json.result==true){
							$scope.modelo=json.rows;

							var fotografia = document.getElementById('fotografia');
							fotografia.innerHTML = '<img src="/img/autoridades/'+$scope.modelo.archivo+'" width="500"/>';

							var desde = $scope.modelo.desde.split('-');
							var hasta = $scope.modelo.hasta.split('-');
							$scope.desde.dia = desde[2];
							$scope.desde.mes = desde[1];
							$scope.desde.anio = desde[0];
							$scope.hasta.dia = hasta[2];
							$scope.hasta.mes = hasta[1];
							$scope.hasta.anio = hasta[0];

							var email = $scope.modelo.email.split('@');
							var usuario = email[0];

							var email = email[1].split('.');
							var dominio = email[0];
							var locacion = email[1];
							if(email[2]!=undefined) locacion += '.'+email[2]; 
							$scope.email.usuario = usuario;
							$scope.email.dominio = dominio;
							$scope.email.locacion = locacion;

							$scope.formularios.formulario.display=true;
							$scope.formularios.formulario.botones.visualizar=true;
						}});
				},
				modificar:function(k){if(confirm('¿Esta seguro que desea modificar este registro?')){
					$scope.resetDisplay();
					id = $scope.lista[k].id;
					uri = '/rest/ful/adminaut/index.php/autoridad/' +id;
					$http
						.get(uri)
						.error(function(){console.log(uri+' : No Data');})
						.success(function(json){if(json.result==true){
							$scope.modelo=json.rows;

							var fotografia = document.getElementById('fotografia');
							fotografia.innerHTML = '<img src="/img/autoridades/'+$scope.modelo.archivo+'" width="500"/>';

							var desde = $scope.modelo.desde.split('-');
							var hasta = $scope.modelo.hasta.split('-');
							$scope.desde.dia = desde[2];
							$scope.desde.mes = desde[1];
							$scope.desde.anio = desde[0];
							$scope.hasta.dia = hasta[2];
							$scope.hasta.mes = hasta[1];
							$scope.hasta.anio = hasta[0];

							var email = $scope.modelo.email.split('@');
							var usuario = email[0];

							var email = email[1].split('.');
							var dominio = email[0];
							var locacion = email[1];
							if(email[2]!=undefined) locacion += '.'+email[2]; 
							$scope.email.usuario = usuario;
							$scope.email.dominio = dominio;
							$scope.email.locacion = locacion;

							$scope.formularios.formulario.display=true;
							$scope.formularios.formulario.disabled=false;
							$scope.formularios.formulario.botones.modificar=true;
						}});
				}},
				eliminar:function(k){if(confirm('¿Esta seguro que desea eliminar este registro?')){
					id = $scope.lista[k].id;
					uri = '/rest/ful/adminaut/index.php/autoridad/' +id;
					$session.autorize(function(){
						$http
							.delete(uri)
							.error(function(){console.log(uri+' : No Data');})
							.success(function(json){if(json.result==true){$scope.httpGetAutoridades();}});
					});
				}},
				activar:function(k){if(confirm('¿Esta seguro que desea activar/inactivar este registro?')){
					id = $scope.lista[k].id;
					estado = $scope.lista[k].estado;
					if(estado=='ACTIVO') $scope.modelo.estado='INACTIVO';
					else $scope.modelo.estado='ACTIVO';
					uri = '/rest/ful/adminaut/index.php/autoridad/' +id+'/estado';
					$session.autorize(function(){
						$http
							.put(uri,$scope.modelo)
							.error(function(){console.log(uri+' : No Data');})
							.success(function(json){if(json.result==true){$scope.httpGetAutoridades();}});
					});
				}},
				subir:function(k){if(confirm('¿Esta seguro que desea mover hacia arriba este registro?')){
					key1 = parseInt(k);
					key2 = key1 -1;
					json = {
						reg1:{id:$scope.lista[key1].id,orden:$scope.lista[key2].orden},
						reg2:{id:$scope.lista[key2].id,orden:$scope.lista[key1].orden}
					};
					uri = '/rest/ful/adminaut/index.php/autoridad/'+json.reg1.id+'/reordenar';
					$session.autorize(function(){
						$http
							.put(uri,json)
							.error(function(){console.log(uri+' : No Data');})
							.success(function(json){if(json.result) $scope.httpGetAutoridades();});
					});
				}},
				bajar:function(k){if(confirm('¿Esta seguro que desea mover hacia abajo este registro?')){
					key1 = parseInt(k);
					key2 = key1 +1;
					json = {
						reg1:{id:$scope.lista[key1].id,orden:$scope.lista[key2].orden},
						reg2:{id:$scope.lista[key2].id,orden:$scope.lista[key1].orden}
					};
					uri = '/rest/ful/adminaut/index.php/autoridad/'+json.reg1.id+'/reordenar';
					$session.autorize(function(){
						$http
							.put(uri,json)
							.error(function(){console.log(uri+' : No Data');})
							.success(function(json){if(json.result) $scope.httpGetAutoridades();});
					});
				}}
			}
		},
		formulario:{
			display:false,
			disabled:true,
			botones:{
				visualizar:false,
				nuevo:false,
				modificar:false
			},
			acciones:{
				visualizar:function(){$scope.httpGetAutoridades();},
				nuevo:{
					cancelar:function(){$scope.httpGetAutoridades();},
					aceptar:function(){

						$session.autorize(function(){
							
							// Send fotografia.
							var date = new Date;

							var fileNameForSend  = '';
							fileNameForSend += date.getFullYear().toString();
							fileNameForSend += date.getMonth().toString();
							fileNameForSend += date.getDate().toString();
							fileNameForSend += date.getHours().toString();
							fileNameForSend += date.getMinutes().toString();
							fileNameForSend += date.getSeconds().toString();
							fileNameForSend += date.getMilliseconds().toString();
							fileNameForSend = md5.createHash(fileNameForSend);
							fileNameForSend += '-'+$scope.file.name;

							var json = {
								fileName:fileNameForSend,
								fileContent:$scope.canvas.toDataURL($scope.file.type.toString(),0.8)
							};

							var uri = '/rest/ful/adminaut/index.php/upload';
							$http
								.post(uri,json)
								.error(function(){console.log(uri+' : No Data');})
								.success(function(json){if(json.result===true){

									//Send model.
									$scope.modelo.archivo = fileNameForSend;
									$scope.modelo.desde=$scope.desde.anio+'-'+$scope.desde.mes+'-'+$scope.desde.dia;
									$scope.modelo.hasta=$scope.hasta.anio+'-'+$scope.hasta.mes+'-'+$scope.hasta.dia;
									$scope.modelo.email=$scope.email.usuario+'@'+$scope.email.dominio+'.'+$scope.email.locacion;
									uri='/rest/ful/adminaut/index.php/autoridad';
									$http
										.post(uri,$scope.modelo)
										.error(function(){
											console.log(uri+' : No Data');
											$scope.resetModelo();
											$scope.httpGetAutoridades();
										})
										.success(function(json){if(json.result==true){
											$scope.resetModelo();
											$scope.httpGetAutoridades();
										}});

								}});

						});
					}
				},
				modificar:{
					cancelar:function(){$scope.httpGetAutoridades();},
					aceptar:function(){

						$session.autorize(function(){
							
							// Send fotografia.
							var date = new Date;

							var fileNameForSend  = '';
							fileNameForSend += date.getFullYear().toString();
							fileNameForSend += date.getMonth().toString();
							fileNameForSend += date.getDate().toString();
							fileNameForSend += date.getHours().toString();
							fileNameForSend += date.getMinutes().toString();
							fileNameForSend += date.getSeconds().toString();
							fileNameForSend += date.getMilliseconds().toString();
							fileNameForSend = md5.createHash(fileNameForSend);
							fileNameForSend += '-'+$scope.file.name;

							var json = {
								fileName:fileNameForSend,
								fileContent:$scope.canvas.toDataURL($scope.file.type.toString(),0.8)
							};

							var uri = '/rest/ful/adminaut/index.php/upload';
							$http
								.post(uri,json)
								.error(function(){console.log(uri+' : No Data');})
								.success(function(json){if(json.result===true){

									//Send model.
									$scope.modelo.archivo = fileNameForSend;
									$scope.modelo.desde=$scope.desde.anio+'-'+$scope.desde.mes+'-'+$scope.desde.dia;
									$scope.modelo.hasta=$scope.hasta.anio+'-'+$scope.hasta.mes+'-'+$scope.hasta.dia;
									$scope.modelo.email=$scope.email.usuario+'@'+$scope.email.dominio+'.'+$scope.email.locacion;
									uri='/rest/ful/adminaut/index.php/autoridad';
									$http
										.post(uri,$scope.modelo)
										.error(function(){
											console.log(uri+' : No Data');
											$scope.resetModelo();
											$scope.httpGetAutoridades();
										})
										.success(function(json){if(json.result==true){
											$scope.resetModelo();
											$scope.httpGetAutoridades();
										}});

								}});

						});
					}
				},
				upload:function(){

					$scope.fotografia = document.getElementById('fotografia');
					$scope.fotografia.style="width:500px;";
					$scope.fotografia.innerHTML = '<img src="/imgcdn/loading.gif" width="500px"/>';

					$scope.input = document.createElement('input');
					$scope.input.multiple=false;
					$scope.input.type='file';
					$scope.input.lang='es';
					$scope.input.accept='image/*';
					$scope.input.click();
					$scope.input.addEventListener('change',function(){
						
						$scope.file = $scope.input.files[0];

						if($scope.file.type.toString().substring(0,5)==='image'){
							
							$scope.reader = new FileReader();
							$scope.reader.readAsDataURL($scope.file);
							$scope.reader.addEventListener('loadend',function(){
								if($scope.reader.readyState===2){

									$scope.img = document.createElement('img');
									$scope.img.src = $scope.reader.result;
									$scope.img.addEventListener('load',function(){
										
										$scope.canvas = document.createElement('canvas');
										$scope.canvas.width = 500;
										$scope.canvas.height = parseInt(((parseInt(((100*$scope.canvas.width)/$scope.img.width))) *$scope.img.height) /100);
										
										$scope.context = $scope.canvas.getContext('2d');
										$scope.context.drawImage($scope.img,0,0,$scope.canvas.width,$scope.canvas.height);

										$scope.fotografia.innerHTML = '<img src="data:'+$scope.canvas.toDataURL($scope.file.type.toString(),0.8)+'" width="500px"/>';

									});
								}
							});
						}
					});

				}
			}
		}
	};

	// Inicializar.
	$scope.init();	

});