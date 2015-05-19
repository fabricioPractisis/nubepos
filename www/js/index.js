   function onDeviceReady(){
		//alert("listo");
        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
        db.transaction(iniciaDB, errorCB, successCB);
		//IngresaCategorias();
    }

    // Populate the database
    //
    
    function iniciaDB(tx){
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		//tx.executeSql('DROP TABLE IF EXISTS PRODUCTOS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTOS (id_local integer primary key AUTOINCREMENT,id integer, formulado text, codigo text, precio integer, categoriaid integer,cargaiva integer,productofinal integer,materiaprima integer)');
		tx.executeSql('SELECT COUNT(id_local) as cuantos FROM PRODUCTOS',[],function(tx,res){
			var existen=res.rows.item(0).cuantos;
			if(existen==0)
				db.transaction(Ingresaproductos,errorCB,successCB);
		});
		//tx.executeSql('DROP TABLE IF EXISTS CATEGORIAS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIAS (id integer primary key AUTOINCREMENT, categoria text, activo integer, existe integer)');
		tx.executeSql('SELECT COUNT(id) as cuantos FROM CATEGORIAS',[],function(tx,res){
			var existen=res.rows.item(0).cuantos;
			if(existen==0)
				db.transaction(IngresaCategorias,errorCB,successCB);
		});
		//tx.executeSql('DROP TABLE IF EXISTS CLIENTES');
        tx.executeSql('CREATE TABLE IF NOT EXISTS CLIENTES (id integer primary key AUTOINCREMENT,nombre text, cedula text, email text, direccion text, telefono text,existe integer)');
		tx.executeSql('SELECT COUNT(id) as cuantos FROM CLIENTES',[],function(tx,res){
			var existen=res.rows.item(0).cuantos;
			if(existen==0)
				db.transaction(IngresaClientes,errorCB,successCB);
		});
		//tx.executeSql('DROP TABLE IF EXISTS FACTURAS');
		tx.executeSql('CREATE TABLE IF NOT EXISTS FACTURAS (id integer primary key AUTOINCREMENT,clientName,RUC,address,tele,fetchJson,paymentsUsed,cash,cards,cheques,vauleCxC,paymentConsumoInterno,tablita,aux,acc,echo,fecha);');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CAJA (id integer primary key AUTOINCREMENT,hora_ingreso text,hora_salida text,activo integer,sobrante_faltante real,total real,establecimiento text,autorizacion text);');
		tx.executeSql('CREATE TABLE IF NOT EXISTS CAJA_APERTURA_CIERRE (id integer primary key AUTOINCREMENT,id_caja integer,valor_apertura real,movimiento integer);',[],function(tx,result){
			//console.log('Ana');
			$('#myModal').modal('hide');
		});
    }

    function populateDB(tx){
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    }

    // Transaction error callback
    //
    function errorCB(err){
        console.log("Error processing SQL: "+err.message);
    }

    // Transaction success callback
    //
    function successCB() {
        console.log("success!");
    }

    function selector(){
         var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
         db.transaction(sacadatos, errorCB, successCB);
    }
	
    function sacadatos(tx){
         tx.executeSql('SELECT COUNT(ID) as cnt FROM DEMO;',[], function (tx,res){
            //console.log("vamos:"+res.rows.item(0).cnt);
         });
         
    }
    
	/*Funciones Ana:*/
    function Ingresaproductos(){
		 var json = $('#jsonProductos').html();
			var mijson = eval(''+json+'');
			for(var j in mijson){
				for(var k in mijson[j]){
					for(i = 0; i < mijson[j][k].length; i++){
							var item = mijson[j][k][i];
							InsertaProducto(item);
					}
				}
			}
    }
	
	function InsertaProducto(itempr){
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		var cargaiva=0;
		var imp=itempr.formulado_tax_id.split('|');
		if(imp.indexOf("1")>=0)
			cargaiva=1;
			db.transaction(
			function (tx){
					tx.executeSql('INSERT INTO PRODUCTOS (id,formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima) VALUES (?,?,?,?,?,?,?,?);',[itempr.formulado_id,itempr.formulado_nombre,itempr.formulado_codigo,itempr.formulado_precio,itempr.formulado_tipo,cargaiva,1,itempr.formulado_matprima],
					function(tx,res){
						//console.log("vamos:"+res.insertId)
					});				
			},errorCB,successCB);
	}
	
	function IngresaCategorias(){
		var json = $('#jsonCategorias').html();
			var mijson = JSON.parse(json);
			//console.log(mijson);
			for(var j in mijson){
				for(var k in mijson[j]){
						var item=mijson[j][k];
						metedatoscat(item);
				}
			}
    }
    
    function metedatoscat(itemc){
		//console.log(itemc);
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
		function (tx){
					tx.executeSql('INSERT INTO CATEGORIAS(id,categoria,activo,existe)VALUES(?,?,?,?);',[itemc.categoria_id,itemc.categoria_nombre,1,1],
					function(tx,res){
						//console.log(res);
						//console.log("vamos:"+res.insertId+"categorias");
					});				
		},errorCB,successCB);
    }
	
	function IngresaClientes(){
		var json = $('#jsonmisclientes').html();
			var mijson = JSON.parse(json);
			//console.log(mijson);
			for(var j in mijson){
				for(var k in mijson[j]){
						var item=mijson[j][k];
						metedatoscliente(item);
				}
			}
    }
    
    function metedatoscliente(itemc){
		//console.log(itemc);
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
		function (tx){
					tx.executeSql('INSERT INTO CLIENTES(id,nombre,cedula,telefono,direccion,email,existe)VALUES(?,?,?,?,?,?,?);',[itemc.id,itemc.nombre,itemc.cedula,itemc.telefono,itemc.direccion,itemc.email,1],
					function(tx,res){
						//console.log(res);
						console.log("vamos:"+res.insertId+"clientes");
					});				
		},errorCB,successCB);
    }
	
	function VerDatosProducto(id){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function(tx){
	tx.executeSql('SELECT p.*,c.categoria as categ FROM PRODUCTOS p, CATEGORIAS c WHERE p.id_local='+id+' and p.categoriaid=c.id;',[],function(tx,results){
		var row=results.rows.item(0);
		$('#idproducto').val(row.id_local);
		$('#titulonuevopr').html("Editar Producto");
		$('#nombreproducto').val(row.formulado);
		$('#codigoproducto').val(row.codigo);
		$('#precioproducto').val(row.precio.toFixed(2));
		$('#search-renderitem').val(row.categ);
		$('#idcategoria').val(row.categoriaid);
		$('#mprima').prop('checked',false);
		$('#pfinal').prop('checked',false);
		$('#coniva').prop('checked',false);
		if(row.materiaprima==1)
		$('#mprima').prop('checked',true);
		if(row.productofinal==1)
		$('#pfinal').prop('checked',true);
		if(row.cargaiva==1)
		$('#coniva').prop('checked',true);
	},errorCB,successCB);
	});
	}
	
	function VerDatosCliente(id){
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
		tx.executeSql('SELECT * FROM CLIENTES WHERE id='+id+';',[],function(tx,results){
			var row=results.rows.item(0);
			$('#idcliente').val(row.id);
			$('#titulocliente').html("Editar Cliente");
			$('#nombrecliente').val(row.nombre);
			$('#cedulacliente').val(row.cedula);
			$('#telefono').val(row.telefono);
			$('#direccion').val(row.direccion);
			$('#email').val(row.email);
		},errorCB,successCB);
		});
	}
	
	function VerDatosFactura(id){
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
		tx.executeSql('SELECT * FROM FACTURAS WHERE id='+id+';',[],function(tx,results){
			var inhtml='';
			for (var i=0; i < results.rows.length; i++){
				var row = results.rows.item(i);
				console.log(row);
				$('#idfactura').val(row.id);
				var timefecha=new Date(row.fecha);
				var mes=timefecha.getMonth()+1;
				if(mes.toString().length<2)
					mes="0"+mes.toString();
				var fechaformat=timefecha.getDate()+"/"+mes+"/"+timefecha.getFullYear()+" "+timefecha.getHours()+":"+timefecha.getMinutes()+":"+timefecha.getSeconds();
				//console.log(row);
				$('#fecha').val(fechaformat);
				var datosfact=JSON.parse(row.fetchJson);
				var totalf=parseFloat(datosfact.Pagar[0].factura.total).toFixed(2);
				$('#total').html(totalf);
				$('#invoiceTotal').html(totalf)
				var intabla='';
				var variosprods=(datosfact.Pagar[0].producto);
				for(var n=0;n<variosprods.length;n++){
					intabla+="<tr><td style='text-align:left;'>"+variosprods[n].nombre_producto+"</td><td style='text-align:right;'>"+parseInt(variosprods[n].cant_prod)+"</td><td style='text-align:right;'>"+parseFloat(variosprods[n].precio_prod).toFixed(2)+"</td><td style='text-align:right;'>"+parseFloat(variosprods[n].precio_total).toFixed(2)+"</td></tr>";
				}
				$('#cuerpodetalle').html(intabla);
				var fpago=row.paymentsUsed.split(',');
				var c=0;
				for(var t=0;t<fpago.length;t++){
					if(fpago[t]==1){
						$('#paymentEfectivo').val(parseFloat(row.cash).toFixed(2));
					}
					if(fpago[t]==2){
						var datocard=row.cards.split('|');
						$('#paymentTarjetas').val(parseFloat(datocard[2]).toFixed(2));
					}
				}
			}
		},errorCB,successCB);
		});
	}
	
	
    /**/
    function metedatos(tx,item){
		console.log(item);
		tx.executeSql('INSERT INTO PRODUCTOS (id,formulado,codigo,precio,categoriaid,cargaiva, productofinal,materiaprima) VALUES (?,?,?,?,?,?,?,?);',[item.formulado_id,item.formulado_nombre,item.formulado_codigo,item.formulado_precio,item.formulado_tipo,cargaiva,1,item.formulado_matprima],function(tx,res){//console.log("vamos:"+res.insertId);
		});
    } 
		
    var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //aqui codigo de ondevide ready para empezar a hacer cosas.
    },
    escanear: function(){
        resultDiv = document.querySelector("#results");
	resultDiv.innerHTML='';
        cordova.plugins.barcodeScanner.scan(
		function (result) {
                        alert(result.text);
		}, 
		function (error) {
			alert("Error de Scan: " + error);
		}
	);
        
    }
};

function ajax(cadena){var xmlhttp=false;
/*@cc_on @*/
/*@if (@_jscript_version >= 5)
try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");} catch (e) {try {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");} 

catch (E) { xmlhttp = false;}}
@end @*/
//console.log(cadena);
if (!xmlhttp && typeof XMLHttpRequest!='undefined') { try {xmlhttp = new XMLHttpRequest(); } catch (e) { xmlhttp=false;}}
if (!xmlhttp && window.createRequest) {	try { xmlhttp = window.createRequest();} catch (e) { xmlhttp=false;}}
xmlhttp.open("GET",cadena,true);
xmlhttp.onreadystatechange=function() {
if (xmlhttp.readyState==4){
	if(xmlhttp.status==200){
        resultDiv = document.querySelector("#results");
	resultDiv.innerHTML=xmlhttp.responseText;	
}}} 
xmlhttp.send(null);
}