function dale(){
//alert("vamos");
cordova.plugins.barcodeScanner.scan(
      function (result) {
		var cod_barras = result.text;
         // alert(id);
         // document.getElementById("recibeScan").value = id;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
			function (tx){
				tx.executeSql('SELECT * FROM PRODUCTOS WHERE codigo='+cod_barras+' ORDER BY formulado asc',[],function(tx,res){
					if(res.rows.length>0){
						for(m=0;m<res.rows.length;m++){
						var row=res.rows.item(m);
						if(isNaN(row.precio)){row.precio = 0;}
						var impuestos='';
						var impuestosid='';
						if(row.cargaiva==1){
							impuestos+='0.12';
							impuestosid+='1';
						}
						$('#listaProductos').append('<div id="'+ row.id+'" data-precio="'+ row.precio +'" data-impuestos="'+impuestos +'" data-impuestosindexes="'+impuestosid +'" data-formulado="'+ row.formulado +'" onclick="agregarCompra(this); return false;" class="producto categoria_producto_'+row.categoriaid +'">'+ row.formulado +'</div>');
						}
						$('.producto').hide();
						init2(categoria);
						showProducts(categoria);
					}
				});				
			},errorCB,successCB
		);
		 
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
   
}



var altolistaprod=0;
var pantAlto=$('#content').height();
var pantAncho=$('#content').width();
var vertical=false;
	
function init(){
	//populateDB();
	//ingresacateg();
	//ingresaproductos();
	//descomentar este para el cierre //
	/*$('#ModuloCierre').load('views/nubepos/cierre/cierre.php');
	var objcaja= JSON.parse($('#jsoncaja').html());
	if(objcaja){
		if(objcaja.caja[0].idCaja==null||objcaja.caja[0].idCaja=='0')
			$('#contentCaja2').fadeIn('slow');
		else if(objcaja.caja[0].open=='0'){
			$('#contentCaja2').fadeIn('slow');
		}
	}else{$('#contentCaja2').fadeIn('slow');}*/
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		tx.executeSql('SELECT id FROM CAJA WHERE activo=1;',[],
		function(tx,res){
			if(res.rows.length==0){
				$('#contentCaja2').fadeIn('fast');
			}
		});				
	},errorCB,successCB);
	ColocarFormasPago();
	$('#central').css("width",parseInt($('#content').css('width'))-20);
	/*if(parseInt($('#content').css('height'))-parseInt($('#header').css('height'))-150<650)
		$('#central').css("height",parseInt($('#content').css('height'))-parseInt($('#header').css('height'))-150);
	else
		$('#central').css("height","650px");*/
	$('#central').css("height",parseInt($('#content').css('height'))-20);
	pantAlto=parseInt($('#content').css('height'));
	pantAncho=parseInt($('#content').css('width'))-20;
	/*$.ajax({
		type: 'POST',
		url: 'views/nubepos/ajax/ajaxImpuestos.php',
		success: function(response){
			console.log("Ana");
			console.log(response);
			$('#taxes').html(response);
			}
		});
	$.ajax({
		type: 'POST',
		url: 'views/nubepos/ajax/ajaxCategorias.php',
		success: function(response){
			formarCategorias(response);
			}
		});*/
		
	/*SQLLITE CATEGORIAS*/
	//var jsoncateg=$('#jsonCategorias').html(); 
	//formarCategoriasformarCategorias(jsoncateg);
	formarCategorias();
	//selectorCat();
	//selectorProds();
	
	$('.numero').on('mouseover',function(){
		var cual=$(this).attr('cual');
		$('#f_'+cual).css('display','none');
		$('#fh_'+cual).css('display','block');
	});
	
	$('.numero').on('mouseout',function(){
		var cual=$(this).attr('cual');
		$('#fh_'+cual).css('display','none');
		$('#f_'+cual).css('display','block');
	});
	
	$('.numero').on('click',function(){
		PlaySound(1);
		var accion = $.trim($(this).html());
		if(accion == '.'){
			if($('.cantidad').html().indexOf('.') == -1){
				if($('.cantidad').html() == ''){
					$('.cantidad').append('0'+ accion);
					}
				else{
					$('.cantidad').append(accion);
					}
				}
			return false;
			}
		else if($.isNumeric(accion) === true){
			$('.cantidad').append(accion);
			return false;
			}
			
		var fetchHTML = $.trim($('.cantidad').html());
		$('.cantidad').html(fetchHTML.substring(0,(fetchHTML.length-1)));
		});
		
		$('.producto').on('click',function(){
			PlaySound(2);
		})
		$('.boton,.botonr').on('click',function(){
			PlaySound(6);
		});
	
	$('.directionProducts').on('click',function(){
		var direction = $(this).data('dir');
		var category = $('#category').val();
		var pager = $('#pager').val();
		var maxPage = $('#maxPage').val();
		
		if(direction == 'right'){
			if(pager == maxPage){
				$('#nav_der').css('visibility','hidden');
				return false;
				}
			$('#pager').val(parseInt(pager) + 1);
			}
		else{
			if(pager == 1){
				$('#nav_izq').css('visibility','hidden');
				return false;
				}
			$('#pager').val(parseInt(pager) -1);
			}
			
		showProducts(category,direction);
		});
		init2();
		
}

$(window).resize(function (){
	$('#central').css("width",parseInt($('#content').css('width'))-20);
	$('#central').css("height",parseInt($('#content').css('height'))-20);
	pantAlto=parseInt($('#content').css('height'));
	pantAncho=parseInt($('#content').css('width'))-20;
	init2();
	$("#contentCaja").css("left" , ( ($(window).width() - 500 ) / 2) + "px");
	$("#contentCaja").css("top" , ( ($(window).height() - 300 ) / 2) + "px");
});

$(window).bind("orientationchange", function(event){
	$('#central').css("width",parseInt($('#content').css('width'))-20);
	$('#central').css("height",parseInt($('#content').css('height'))-20);
	pantAlto=parseInt($('#content').css('height'));
	pantAncho=parseInt($('#content').css('width'))-20;
	init2();
});

/*function ActivarCategoria(cual,categoria){
	$('#category').val(categoria);
	$('#controller').val(1);
	$('.directionProducts').css('visibility','hidden');
	$('#listaProductos').html('');
	var fila=cual.parentNode.parentNode;
	var miscateg=fila.getElementsByTagName('div');
	for(k=0;k<miscateg.length;k++){
		if(miscateg[k].id!='listaCategorias' && miscateg[k].id!='contenidoCategorias')
			miscateg[k].className="categoria esCategoria";
	}
	cual.className="categoriaActiva esCategoria";
	
	var json = $('#jsonProductos').html();	
	var evalJson = eval(''+json+'');
	for(var j in evalJson){
		for(var k in evalJson[j]){
			if(k == 'Tipo'+ categoria){
				for(i = 0; i < evalJson[j][k].length; i++){
					var item = evalJson[j][k][i];
					if(isNaN(item.formulado_precio)){
						item.formulado_precio = 0;
					}	
					$('#listaProductos').append('<div id="'+ item.formulado_id +'" data-precio="'+ item.formulado_precio +'" data-impuestos="'+ item.formulado_impuestos +'" data-impuestosindexes="'+ item.formulado_tax_id +'" data-formulado="'+ item.formulado_nombre +'" onclick="agregarCompra(this); return false;" class="producto categoria_producto_'+ item.formulado_tipo +'">'+ item.formulado_nombre +'</div>');
					}
				}
			}
		}
	$('.producto').hide();
	//$('.categoria_producto_'+ categoria).show();
	init2(categoria);
	showProducts(categoria);
	}*/
	
function ActivarCategoria(cual,categoria){
	$('#category').val(categoria);
	$('#controller').val(1);
	$('.directionProducts').css('visibility','hidden');
	$('#listaProductos').html('');
	var fila=cual.parentNode.parentNode;
	var miscateg=fila.getElementsByTagName('div');
	for(k=0;k<miscateg.length;k++){
		if(miscateg[k].id!='listaCategorias' && miscateg[k].id!='contenidoCategorias')
			miscateg[k].className="categoria esCategoria";
	}
	cual.className="categoriaActiva esCategoria";
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		tx.executeSql('SELECT * FROM PRODUCTOS WHERE categoriaid='+categoria+' ORDER BY formulado asc',[],function(tx,res){
			if(res.rows.length>0){
				for(m=0;m<res.rows.length;m++){
					var row=res.rows.item(m);
					if(isNaN(row.precio)){row.precio = 0;}
					var impuestos='';
					var impuestosid='';
					if(row.cargaiva==1){
						impuestos+='0.12';
						impuestosid+='1';
					}
					$('#listaProductos').append('<div id="'+ row.id+'" data-precio="'+ row.precio +'" data-impuestos="'+impuestos +'" data-impuestosindexes="'+impuestosid +'" data-formulado="'+ row.formulado +'" onclick="agregarCompra(this); return false;" class="producto categoria_producto_'+row.categoriaid +'">'+ row.formulado +'</div>');
				}
				$('.producto').hide();
				init2(categoria);
				showProducts(categoria);
			}
		});				
	},errorCB,successCB);
	$('.producto').hide();
	//$('.categoria_producto_'+ categoria).show();
	init2(categoria);
	showProducts(categoria);
	}
	


	function showProducts(categoria,direction){
	$('#loader').hide();
	$('.producto').hide();
	$('#listaProductos').hide();
	var listaProductosWidth = $('#listaProductos').width();
	var listaProductosHeight = $('#listaProductos').height();
	var productosWidth = 0;
	var fixedProdtuctosHeight = 0;
	var fixedProdtuctosWidth = 0;

	$('.categoria_producto_'+ categoria).each(function(){
		productosWidth += parseInt($(this).outerWidth());
		fixedProdtuctosHeight = parseInt($(this).outerHeight());
		fixedProdtuctosWidth = parseInt($(this).outerWidth());
		});
	
	var maxProductsPerRow = Math.floor(listaProductosWidth/fixedProdtuctosWidth);
	var maxProductsPerColumn = Math.floor(listaProductosHeight/fixedProdtuctosHeight); 
	var maxProductsPerSection = parseInt(maxProductsPerRow) * parseInt(maxProductsPerColumn);
	var counter = 0;
	var pager = $('#pager').val();
		$('.categoria_producto_'+ categoria).each(function(index,value){
			if(index % maxProductsPerSection == 0){
				counter++;
				}
			if(counter == pager){
				if(direction == 'right'){
					$('#listaProductos').show('slide',{direction: 'right'});
					}
				else if(direction == 'left'){
					$('#listaProductos').show('slide',{direction: 'left'});
					}
				else{
					$('#listaProductos').show();
					}
				$(this).show();
				}
			});
		
		$('#maxPage').val(counter);
		if(counter > 1 && pager<counter && pager == 1){
			$('#nav_der').css('visibility','visible');
			$('#nav_izq').css('visibility','hidden');
			}
		else if(counter > 1 && pager<counter && pager > 1){
			$('#nav_der').css('visibility','visible');
			$('#nav_izq').css('visibility','visible');
			}
		else if(counter==1 && counter > 1){
			$('#nav_izq').css('visibility','visible');
			$('#nav_der').css('visibility','visible');
		}else if(counter==pager){
			$('#nav_der').css('visibility','hidden');
		}
		$('.producto').on('click',function(){
			PlaySound(2);
		});
		$('.product_del').on('click',function(){
			PlaySound(4);
		});
		
	}
function init2(categoria){
	vertical=false;
	/*$('#central').css('top','0px');
	$('#central').css('left','0px');*/
	$('#central').css("left",$(window).width()-$('#content').css('width')-100);
	$('#central').css("top",$(window).height()-$('#header').css('height')-50);
	//alert(pantAlto/pantAncho);
	if(pantAlto/pantAncho>=0.80) vertical=true;
	console.log(pantAlto/pantAncho);
	if(vertical==true){
		console.log('vertical');
		$('.divcierre').css('width','90%');
		$('.buscador').css('top','0%');
		if(esMovil){
			$('.buscador').css('left','25%');
			$('.scan').css('top','0%');$('.scan').css('left','0%');$('.scan').css('width','25%');
			$('.buscador').css('width','75%');
			
		}else{
			$('.scan').css('display','none');
			$('.buscador').css('left','0%');
			$('.buscador').css('width','100%');
			
		}
		$('.totalpagar').css('width','60%');$('.totalpagar').css('left','40%');
		
		$('.descuento').css('width','40%');$('.descuento,.totalpagar').css('top','55%');$('.descuento').css('left','0%');
		$('.numpad').css('top','10%');$('.numpad').css('left','0%');$('.numpad').css('width','40%');
		$('.detalle').css('top','10%');$('.detalle').css('left','40%');$('.detalle').css('width','60%');$('.detalle').css('height','45%');
		$('.productos').css('left','0%');$('.productos').css('width','100%');$('.productos').css('top','63%');
		$('.buscador,.totalpagar').css('height','8%');
		$('.scan,.descuento').css('height','8%');
		$('.numpad').css('height','45%');
		$('.productos').css('height','53%');
		$('.boton,.botonr').css('font-size',(pantAlto*4.5/100)+'px');
		$('.producto').css('font-size',(pantAlto*2.8/100)+'px');
		$('.producto').css('width',pantAncho/5.7);
		$('.producto').css('height',((pantAlto*4.5/100)+10)+'px');
		$('.categoria,.categoriaActiva').css('font-size',(pantAlto*2.5/100)+'px');
		$('.categoria,.categoriaActiva').css('width',pantAncho/4);
		$('.lineadetalle').css('font-size',(pantAlto*2/100)+'px');
		$('.product_del').css('width',(pantAlto*2.7/100)+'px');
		$('.lineaheader').css('font-size',(pantAlto*2/100)+'px');
		/*popup descuento*/
		/*$('#popupDiscount').css('width',(pantAncho*80/100)+'px');*/
	}else{
		$('.divcierre').css('width','60%');
		$('.scan,.buscador').css('top','0%');
		if(!esMovil){
			$('.scan').css('display','none');
			$('.buscador').css('left','0%');
			$('.buscador').css('width','100%');
			
		}else{
			$('.buscador').css('left','30%');
			$('.buscador').css('width','70%');
			
		}
		$('.scan').css('left','0%');
		$('.numpad,.scan').css('width','30%');$('.numpad').css('top','10%');
		$('.descuento').css('width','30%');$('.descuento').css('left','30%');$('.descuento,.totalpagar').css('top','55%');
		$('.totalpagar').css('width','40%');$('.totalpagar').css('left','60%');$('#total').css('line-height','33px');
		$('.detalle').css('width','70%');$('.detalle').css('top','10%');$('.detalle').css('left','30%');
		$('.detalle').css('height','45%');
		$('.productos').css('width','100%');$('.productos').css('top','65%');
		$('.scan,.buscador,.descuento,.totalpagar').css('height','10%');
		$('.numpad').css('height','55%');
		$('.productos').css('height','35%');
		$('.boton,.scan,.descuento,.botonr').css('font-size',(pantAlto*4.5/100)+'px');
		$('.producto').css('height',((pantAlto*5.2/100)+10)+'px');
		$('.producto').css('font-size',(pantAlto*3.5/100)+'px');
		$('.producto').css('width',pantAncho/9);
		$('.categoria,.categoriaActiva').css('font-size',(pantAlto*4/100)+'px');
		$('.categoria,.categoriaActiva').css('width',pantAncho/8);
		$('.lineadetalle').css('font-size',(pantAlto*3/100)+'px');
		$('.product_del').css('width',(pantAlto*3/100)+'px');
		$('.lineaheader,.encabezadorojo').css('font-size',(pantAlto*2.5/100)+'px');
		/*$('#popupDiscount').css('width',(pantAncho*60/100)+'px');*/
	}
	
	
	
	$('#resultBuscador').css('left',parseInt($('.buscador').css('left'))+10);
	$('#resultBuscador').css('top',parseInt($('.buscador').css('height'))-9);
	$('#resultBuscador').css('max-height',parseInt($('#resultBuscador').css('font-size'))*6);
	$('#divInScan').css('height',(parseInt($('.scan').css('height'))-20)+'px');
	$('#divInScan').css('width',(parseInt($('.scan').css('width'))-20)+'px');
	$('#btn_scan').css('height',(parseInt($('.scan').css('height'))-20)+'px');
	$('#divInNumPad').css('height',(parseInt($('.numpad').css('height'))-20)+'px');
	$('#divInNumPad').css('width',(parseInt($('.numpad').css('width'))-20)+'px');
	$('#divInBuscador').css('height',(parseInt($('.buscador').css('height'))-20)+'px');
	$('#divInBuscador').css('width',(parseInt($('.buscador').css('width'))-20)+'px');
	$('#divInDesc,#divInCierre').css('width',(parseInt($('.descuento').css('width'))-43)/2+'px');
	$('#divInDesc,#divInCierre').css('height',(parseInt($('.descuento').css('height'))-20)+'px');
	$('#dinInTotalPagar').css('width',(parseInt($('.totalpagar').css('width'))-20)+'px');
	$('#dinInTotalPagar').css('height',(parseInt($('.totalpagar').css('height'))-20)+'px');
	$('#btn_descuento,#btn_cierre').css('height',$('#btn_descuento').parent().css('height'));
	$('#btn_pagar').css('height',$('#btn_descuento').css('height'));
	if(vertical==true){
		$('#btn_scan,#btn_descuento,#btn_cierre,#btn_pagar,.header').css('font-size',parseInt($('#btn_scan').css('height'))*50/100);
	}else{
		$('#btn_scan,#btn_descuento,#btn_cierre,#btn_pagar,.header').css('font-size',parseInt($('#btn_scan').css('height'))*65/100);
	}
	$('#conttotal').css('border-radius',parseInt($('#conttotal').css('height'))/2);
	$('.total').css('font-size',parseInt($('#conttotal').css('height'))*50/100);
	$('.total').css('line-height',(parseInt($('.total').css('font-size'))*90/100)+'px');
	$('#inputbusc').css('height',(parseInt($('#btn_scan').css('height'))-15));
	$('#inputbusc').css('font-size',parseInt($('#inputbusc').css('height'))*60/100);
	$('#resultBuscador').css('font-size',(parseInt($('#inputbusc').css('height'))*50/100)+'px');
	if($('#numpad').css('height')<=$('#numpad').css('width')){
		$('.contnumero,.numero').css('height',(parseInt($('#divInNumPad').css('height'))/4)-10);
		$('.contnumero').css('width',parseInt($('.contnumero').css('height')));
	}else{
		$('.contnumero,.numero').css('height',(parseInt($('#divInNumPad').css('width'))/4)-6);
		$('.contnumero').css('width',(parseInt($('#divInNumPad').css('width'))/4)-6);
	}
	if(parseInt($('.contnumero').css('height'))>=parseInt($('.contnumero').css('width')))
		$('.fondonum').css('width',(parseInt($('.contnumero').css('width'))*98/100));
	else
		$('.fondonum').css('width',(parseInt($('.contnumero').css('height'))*98/100));
	
	$('.numero').css('width',parseInt($('.fondonum').css('width')));
	$('.numero').css('font-size',(parseInt($('.fondonum').css('height'))*70/100)+'px');
	
	$('.header').css('height',pantAlto*8/100);
	$('.cantidad').css('height',(parseInt($('.contnumero').css('height'))-10)+'px');
	$('.cantidad').css('width',(parseInt($('#divInNumPad').css('width'))*90/100));
	$('.cantidad').css('border-radius',(parseInt($('.cantidad').css('height'))/2)+'px');
	$('.cantidad').css('font-size',(parseInt($('.cantidad').css('height'))*80/100)+'px');
	var altodetalle=parseInt($('#detalle').css('height'));
	$('#headerdetalle').css('height',(altodetalle*10/100)+'px');
	$('#contentdetalle,#navegadoresv').css('height',(altodetalle*90/100)-40);
	$('#nav_up,#nav_down').css('height',(parseInt($('#contentdetalle').css('height'))*50/100));
	$('#navegadoresh').css('width',pantAncho-25);
	if(pantAncho<=800){
		$('#nav_izq,#nav_der').css('width','99%');
	}else{
		$('#nav_izq,#nav_der').css('width','420px');
	}
	$('#listaProductos').css('width',pantAncho-70);
	$('#listaCategorias').css('height',(parseInt($('.categoria').css('height'))+10)+'px');
	$('#listaProductos').css('height',(parseInt($('.productos').css('height'))-80-parseInt($('#listaCategorias').css('height')))+'px');
	$('.direccionales').css('height',(parseInt($('.categoria').css('height'))+10)+'px');
	var anchoCategorias=0;
	$('.categoria,.categoriaActiva').each(function(){
		anchoCategorias+=parseInt($(this).css('width'));
	});
	var anchodireccionales=parseInt($('.direccionales').css('width'));
	$('#listaCategorias').css('width',(pantAncho-(2*anchodireccionales)-20)+'px');
	$('#contenidoCategorias').css('width',anchoCategorias);
	
	if(anchoCategorias<pantAncho){
		$('.direccionales').css('display','none');
		$('#listaCategorias').css('width',pantAncho);
		}
	else{
		$('.direccionales').css('display','block');
		$('#listaCategorias').css('width',((pantAncho)-(2*anchodireccionales)-10)+'px');
		}
	$('.producto').each(function(){
		if($(this).html().length>=10)
		{
			$('.producto').css('font-size',parseInt($('.producto').css('height'))*40/100);
			$('.producto').css('line-height',parseInt($('.producto').css('font-size'))*4/100);
		}
	});
	var productosAncho = 0;
	var productosAlto = 0;
	var counter = 0;
	$('.categoria_producto_'+ categoria).each(function(){
		productosAlto += parseInt($(this).outerHeight());
		productosAncho += parseInt($(this).outerWidth());
		if(productosAncho > pantAncho && productosAlto < pantAlto){
			counter++;
		}
		});
		
	$('.categoria_producto_'+ categoria).show();
}

function agregarCompra(item,origen){
	$('#resultBuscador').fadeOut('slow');
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();
	
	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var productoCantidad = 1;
	var productoID = $(item).attr('id');
	if(origen==2){
		var idpartes= $(item).attr('id').split('_');
		productoID = idpartes[1];
	}
	var productoNombre = $(item).data('formulado');
	var productoImpuestos = $(item).data('impuestos');
	var productoImpuestosIndexes = $(item).data('impuestosindexes');
	var productoPrecio = $(item).data('precio');
	var subtotalSinIvaCompra = 0;
	var subtotalIvaCompra = 0;
	
	//verificar cantidades
	if($.trim($('.cantidad').html()) != ''){
		productoCantidad = $.trim($('.cantidad').html());
	}
	//impuestos start
	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
			$.each(productoImpuestosIndexes.split('@'), function(index,value){
				
				if(productoImpuestosIndexes.indexOf('1') !== -1){
					subtotalIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
					}
				else{
					subtotalSinIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
					}
				
				if($('#impuestoFactura-'+ value).length == 0){
					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
					taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
					$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
					}
				else{
					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
					var currentTax = $('#impuestoFactura-'+ value).val();
					taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
					$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(taxTotal));
					}
				});
			}
		else{
			productoImpuestosIndexes == 1 ? subtotalIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
			
			if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
				$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
				}
			else{
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
				taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
				$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
				}
			}
		}
	//impuestos end
		
	var total = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) + parseFloat(taxTotal));
	$('#tablaCompra').append('<tr><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-borrarprecio="'+ productoPrecio +'" onclick="borrarCompra(this); return false;" style="width: 5%;"><img alt="" src="../../images/xcierre.png" class="product_del"/><input type="hidden" class="totales" value="'+ total +'"/></td><td style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle"><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) + parseFloat(taxTotal)) +'"/>'+ productoCantidad +'</td><td style="border-right:1px solid #909192; padding-left:20px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle">'+ productoNombre+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ parseFloat(total).toFixed(2) +'</td></tr>');
	$('.totales').each(function(){
		sumTotal += parseFloat($.trim($(this).val()));
	});
	//alert(subtotalSinIva+'/'+subtotalSinIvaCompra);
	$('#totalmiFactura').val(sumTotal);
	$('.total').html('$'+ parseFloat(sumTotal).toFixed(2))
	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
	$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));
	$('.cantidad').html('');
	$('#tableresults').html('');
	$('#inputbusc').val('');
	$('#contentdetalle').animate({
		scrollTop: $('#contentdetalle')[0].scrollHeight
		}, 1000).clearQueue();
	//$('#tablaCompra tr:last-child').effect('highlight',{},'normal')
	celdaenfocada=-1;
	$('.lineadetalle').css('font-size',$('.lineadetalle').css('font-size'));
	if(vertical==true)
		$('.product_del').css('width',(pantAlto*2.7/100)+'px');
	else
		$('.product_del').css('width',(pantAlto*3/100)+'px');
	$('.product_del').on('click',function(){
			PlaySound(4);
	});
	
	//init2();
}

/*function formarCategorias(json){
	var selected = '';
	var categoriaSelected = 0;
	var objcategoria='';
	$.each($.parseJSON(json).Categorias,function(index,item){
		selected = 'categoria';
		if(index === 0){
			selected = 'categoriaActiva';
			categoriaSelected = item.categoria_id;
		}
		$('#contenidoCategorias').append('<div id="categoria_'+ item.categoria_id +'" class="esCategoria '+ selected +'" onclick="ActivarCategoria(this,'+ item.categoria_id +'); PlaySound(5);">'+ (item.categoria_nombre).substring(0,6) +'</div>');
	});*/
	/*$.ajax({
		type: 'POST',
		url: 'views/nubepos/ajax/ajaxProductos.php',
		success: function(json){
			$('#jsonProductos').html(json);
			//init2(categoriaSelected);*/
			/*$('#loader').remove();
			objcategoria=$('#categoria_'+categoriaSelected)[0];
			console.log(objcategoria);
			ActivarCategoria(objcategoria,categoriaSelected);*/
			/*}
	});*/
/*}*/

function formarCategorias(){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var selected = '';
	var categoriaSelected = 0;
	var objcategoria='';
	db.transaction(
	function (tx){
		tx.executeSql('SELECT * FROM CATEGORIAS ORDER BY id asc',[],function(tx,res){
			if(res.rows.length>0){
				for(m=0;m<res.rows.length;m++){
					selected = 'categoria';
					var row=res.rows.item(m);
					if(m==0){
						selected = 'categoriaActiva';
						categoriaSelected = row.id;
					}
					$('#contenidoCategorias').append('<div id="categoria_'+ row.id +'" class="esCategoria '+ selected +'" onclick="ActivarCategoria(this,'+ row.id +'); PlaySound(5);">'+ (row.categoria).substring(0,6) +'</div>');
				}
				objcategoria=$('#categoria_'+categoriaSelected)[0];
				console.log(objcategoria);
				ActivarCategoria(objcategoria,categoriaSelected);
			}
		});				
	},errorCB,successCB);
}

var margin = 0;
var lastDiv = 0;
function slider(direccion){
	var slide = margin;
	var maxSlide = -Math.abs($('#contenidoCategorias').width());
	if(direccion == 'derecha'){
		$('.esCategoria ').each(function(){
			if(slide <= parseInt($('#listaCategorias').width())){
				lastDiv = $(this).outerWidth();
				slide += $(this).outerWidth();
				}
			});
		margin -= (slide - lastDiv);
		}
	else{
		$('.esCategoria').each(function(){
			if(slide - lastDiv <= parseInt($('#listaCategorias').width())){
				slide += $(this).outerWidth();
				}
			});
		margin += (slide);
		}
		
	console.log(margin);
	
	if(parseInt(margin) > 0){
		margin = 0;
		}
	else if(margin <= maxSlide){
		margin = maxSlide;
		return false;
		}
	$('#contenidoCategorias').animate({
		marginLeft: margin
		});
	}
	
function pagar(){
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();
	var descuento = $('#descuentoFactura').val();
    var total = $('#totalmiFactura').val();

	var impuestos = '';

	$('.esImpuesto').each(function(){
		var getName = $(this).data('nombre');
		var getId = $(this).data('id');
		var getValue = $(this).data('valor');
		
		impuestos += getName +'/'+ $(this).val() +'/'+ getId +'/'+ getValue +'@';
		});

	impuestos = impuestos.substring(0,impuestos.length -1);
	
	

    //alert(subtotalSinIva+'**'+subtotalIva+'**'+descuento+'**'+impuestos);
	//var total = parseFloat(subtotalSinIva) + parseFloat(subtotalIva) + parseFloat(impuestos) - parseFloat(descuento);
	
	var json = '{"Pagar": [{';
		json += ' "cliente": {';
			json +=	'"id_cliente": "'+$('#idCliente').val()+'",';
			json +=	'"cedula": "'+$('#cedulaP').val()+'",';
			json +=	'"nombre": "'+$('#nombreP').val()+'",';
			json +=	'"telefono": "'+$('#telefonoP').val()+'",';
			json +=	'"tipoCliente": "'+$('#tipoP').val()+'",';
			json +=	'"direccion": "'+$('#direccionP').val()+'",';
			json +=	'"listaDePrecio": ""';
			json +=	'},';
			json += '"producto": [';
	$('.productDetails').each(function(){
		var splitDetails = $(this).val().split('|');
		json += '{';
			json += '"id_producto" : "'+ splitDetails[0] +'",';
			json += '"nombre_producto" : "'+ splitDetails[1] +'",';
			json += '"cant_prod" : "'+ splitDetails[2] +'",';
			json += '"precio_orig" : "'+ splitDetails[3] +'",';
			json += '"precio_prod" : "'+ splitDetails[4] +'",';
			json += '"impuesto_prod" : "'+ splitDetails[5] +'",';
			json += '"precio_total" : "'+ splitDetails[6] +'",';
			json += '"precio_descuento_justificacion" : ""';
		json += '},';
		});
		
	json = json.substring(0,json.length -1);	
	json += '],'
	json += '"factura" : {';
		json += '"subtotal_sin_iva" : "'+ subtotalSinIva +'",';
		json += '"subtotal_iva" : "'+ subtotalIva +'",';
		json += '"impuestos" : "'+ impuestos +'",';
		json += '"descuento" : "'+ descuento +'",';
		json += '"total" : "'+ total +'"';
	
		json += '}}]}';
	$('#json').html(json);
	receiveJson();
	//$('#pay').show();
}
	
function addDiscount(){
	var discount=$('#addDiscount').val();
	if($('.productDetails').length > 0){
		var getTotal = $('#total').val();
		if(parseFloat(discount) > parseFloat(getTotal)){
			discount = parseFloat($('#total').val());
			$('#addDiscount').val(parseFloat(getTotal).toFixed(2));
			}
			
		if(discount == ''){
			discount = 0;
			$('#addDiscount').val('0.00');
			}
			
		if(parseFloat(discount) < 0){
			discount = 0;
			$('#addDiscount').val('0.00');
			}
		
		var totales = 0;
		$('.totales').each(function(){
			totales += parseFloat($(this).val());
			});

		$('#discountAdded').fadeIn();
		//$('#totalmiFactura').val(parseFloat(totales) + parseFloat(discount));
		$('#totalmiFactura').val(parseFloat(totales));
		$('.total').html('$'+ (parseFloat(totales) - parseFloat(discount)).toFixed(2));
		$('#descuentoFactura').val(discount);
		
		setTimeout(function(){
			$('#popupDiscount').animate({
				marginTop : 1000
				}, function(){
					$('#popup').fadeOut('fast');
					$('#discountAdded').fadeOut();
					});
			},1000);
		}
	}
	function verScan(){
		$('#popupScan').fadeIn(function(){
			$('#popupScaner').animate({
				marginTop : 0
				},1000,function(){
						$('#addDiscount').select();
						$('#addDiscount').focus();
						$('#addDiscount').val('');
				});
		});
	}
function showPopup(){
	$('#popup').fadeIn(function(){
		$('#popupDiscount').animate({
			marginTop : 0
			},1000,function(){
					$('#addDiscount').select();
					$('#addDiscount').focus();
					$('#addDiscount').val('');
			});
	});
}
	
function closePopup(){
	$('#popupDiscount').animate({
		marginTop : 1000
		}, function(){
			$('#popup').fadeOut('fast');
		});
	}
	
function borrarCompra(item){
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();
	
	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var sumTotal = 0;
	var subtotalSinIvaCompra = 0;
	var subtotalIvaCompra = 0; 
	var productoCantidad = $(item).data('borrarcantidad');
	var productoImpuestos = $(item).data('borrarimpuesto');
	var productoImpuestosIndexes = $(item).data('borrarimpuestoindexes');
	var productoPrecio = $(item).data('borrarprecio');
	
	$(item).closest('tr').remove();
	
	//impuestos start
	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
			$.each(productoImpuestosIndexes.split('@'), function(index,value){
				
				if(productoImpuestosIndexes.indexOf('1') !== -1){
					subtotalIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
					}
				else{
					subtotalSinIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
					}
					
				var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
				var currentTax = $('#impuestoFactura-'+ value).val();
				taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
				$('#impuestoFactura-'+ value).val(parseFloat(currentTax) - parseFloat(taxTotal));
				});
			}
		else{
			productoImpuestosIndexes == 1 ? subtotalIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));

			var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
			var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
			taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
			$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) - parseFloat(taxTotal));
			}
		}
	//impuestos end
	
	$('.totales').each(function(){
		sumTotal += parseFloat($.trim($(this).val()));
		});
	
	$('#totalmiFactura').val(sumTotal);
	$('.total').html('$'+ parseFloat(sumTotal).toFixed(2))
	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) - parseFloat(subtotalSinIvaCompra));
	$('#subtotalIva').val(parseFloat(subtotalIva) - parseFloat(subtotalIvaCompra));
	$('.product_del').on('click',function(){
			PlaySound(4);
	});
	}
	
function intOrFloat(e,value){
    if(value.indexOf('.') !== -1 && (e.keyCode == 190 || e.keyCode == 110)){
        e.preventDefault(); 
        }
    
    if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110){
        return;
        } 
    else{
        e.preventDefault();
        }
    }
var celdaenfocada=-1;
function BuscarSugerencias(filtro,e){
	//alert(e.keyCode);
	if(e.keyCode==13){
		var misugerencias=document.getElementsByClassName('sugerencia');
		for(j=0;j<misugerencias.length;j++){
			if(misugerencias[j].getAttribute('enfocada')==1){
				misugerencias[j].firstChild.click();
			}	
		}
		
	}else if(e.keyCode==38){
		if(document.getElementById('tableresults')){
			$('.sugerencia').each(function(){
				AclararSugerencia($(this)[0],false);
			});
			
			if((celdaenfocada-1)>-1)
				celdaenfocada-=1;
			else
				celdaenfocada=0;
			console.log(celdaenfocada);
			AclararSugerencia(document.getElementById('tableresults').rows[celdaenfocada].cells[0],true);
		}
	}else if(e.keyCode==40){
		$('.sugerencia').each(function(){
				AclararSugerencia($(this)[0],false);
			});
		console.log(e.keyCode);
		if((celdaenfocada+1)<document.getElementById('tableresults').rows.length)
				celdaenfocada+=1;
			console.log(celdaenfocada);
			AclararSugerencia(document.getElementById('tableresults').rows[celdaenfocada].cells[0],true);
	}else{
		if(filtro!=''){
			$('#resultBuscador').fadeIn('slow');
			$('#tableresults').html('');
			var json = $('#jsonProductos').html();
			var mijson = eval(''+json+'');
			for(var j in mijson){
				for(var k in mijson[j]){
					for(i = 0; i < mijson[j][k].length; i++){
							var item = mijson[j][k][i];
							var suger='';
							if(item.formulado_nombre.toLowerCase().indexOf(filtro.toLowerCase())>-1)
								suger=item.formulado_nombre;
							else if(item.formulado_codigo.toLowerCase().indexOf(filtro.toLowerCase())>-1)
								suger=item.formulado_codigo;
							
							if(suger!='')
							{
								if(document.getElementById('tableresults').rows.length<4){
									$('#tableresults').append("<tr><td class='sugerencia' onmouseover='AclararSugerencia(this,true);' onmouseout='AclararSugerencia(this,false);' enfocada='0'><div id='busc_"+ item.formulado_id +"' data-precio='"+ item.formulado_precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado_nombre.toUpperCase()+"' onclick='PlaySound(2); agregarCompra(this,2); return false;'>"+suger.toUpperCase()+"</div></td></tr>");
								}
								
							}
					}
				}
			}
			if(mijson.length>0){
				AclararSugerencia(document.getElementById('tableresults').rows[0].cells[0],true);
			}
		}
	}
}
function AclararSugerencia(celda,focus){
	if(focus){
		celda.style.backgroundColor='rgba(88,88,91,0.9)';
		celda.style.color='#FFF';
		celda.setAttribute('enfocada','1');
	}else{
		celda.style.backgroundColor='transparent';
		celda.style.color='#CCC';
		celda.setAttribute('enfocada','0');
	}
}

function PlaySound(id) {
  var thissound=document.getElementById("beep"+id);
  thissound.play();
}

function DetalleArriba(){
	var actual=parseInt($('#tablaCompra').css('top'));
	var alto=parseInt($('#tablaCompra').css('height'));
	if((actual-5)>=(-alto+25))
	    $('#tablaCompra').css('top',actual-5);
	else
		$('#tablaCompra').css('top',-alto+25);
}

function DetalleAbajo(){
	var actual=parseInt($('#tablaCompra').css('top'));
	if((actual+5)<=0)
	    $('#tablaCompra').css('top',actual+5);
	else
		$('#tablaCompra').css('top',0);
	
	//setTimeout(function(){DetalleAbajo()},200);
}
function AntesDePagar(){
	$('#pay').show();
	BuscarCliente(13);
	$("#cuadroClientes").css('display','none');
	pagar();
	if($('#idCliente').val!=''){
	}else{
		alert("Por favor elija primero un cliente.");
	}
}

function soloNumerost(e){
	//console.log(e.keyCode);
	key = e.keyCode || e.which;
	tecla = String.fromCharCode(key).toLowerCase();
	letras = "0123456789.";
	especiales = [8,9,37,39,52];
	tecla_especial = false
	for(var i in especiales){
	    if(key == especiales[i]){
		tecla_especial = true;
		break;
            }
	}
        if(letras.indexOf(tecla)==-1 && !tecla_especial){
	    return false;
	}
}

function ColocarFormasPago(){
	var formaspago=$('#jsonformaspago').html();
	var evalJson=JSON.parse(formaspago);
	//console.log(evalJson);
	for(var k in evalJson){
		var x = 1;
		var mihtml='';
		for(var j in evalJson[k]){
			//alert(evalJson[k][j]+id);
				mihtml+= '<tr>';
				mihtml+= '<td class="columna1">';
				mihtml+= '<div id="paymentCategory-'+evalJson[k][j].id+'" class="paymentCategories" onclick="changePaymentCategory(\''+evalJson[k][j].id+'\',\''+evalJson[k][j].imagen+'\'); return false;" style="height:100%; background-color: #D2D2D2; border-top-left-radius: 10px; border-bottom-left-radius: 10px; border: 1px solid #cccccc;">';
				mihtml+= '<table style="width: 100%; height: 100%;" cellspacing="0px" cellpadding="0px">';
			    mihtml+= '<tr style="cursor:pointer;">';
				mihtml+= '<td style="width:20%; height:100% text-align: right; font-size: 12px; font-weight:400; color:#58595B;"><img id="pagos_'+evalJson[k][j].imagen+'" class="originalImage"  style="margin-left:20px;" alt="" src="images/'+(evalJson[k][j].imagen)+'.png"/></td>';
				mihtml+= '<td class="textoformapago" id="forma_'+evalJson[k][j].id+'">';
				mihtml+=evalJson[k][j].nombre;
				mihtml+= '</td>';
				mihtml+= '</tr>';
				mihtml+= '</table>';
				mihtml+= '</div>';
				mihtml+= '</td>';
				mihtml+= '<td class="columna2">';
				mihtml+= '<div style="height:100%; background-color:#F7F7F7; border-top-right-radius: 10px; border-bottom-right-radius:10px; border:1px solid #CCCCCC; text-align:center; padding-right:10px;">';
				mihtml+= '<input class="paymentMethods" paymentMethod="'+evalJson[k][j].nombre+'" idPaymentMethod="'+evalJson[k][j].id+'" id="payment'+evalJson[k][j].nombre.replace(" ","")+'" style="height:100%; width:100%; background:transparent; border:0px; text-align:right;" placeholder="0.00" value="" onclick="CambiarMetodo('+"'"+evalJson[k][j].nombre.replace(" ","")+"'"+');" type="number" min="0.00" step="0.10" onfocus="this+select();" min="0" onkeypress="return soloNumerost(event);"/>';
				mihtml+= '</div>';
				mihtml+= '</td>';
				mihtml+= '</tr>';
				x++;
		}
	}
	$('#tablaformaspago').html(mihtml);
	
	/*var evalJson = eval(formaspago);
	for(var k in evalJson){
		alert(evalJson[k].id);
	}*/
}


function AbrirCaja(){
	/*$('#jsoncaja').html('{"caja":[{"idCaja":"12","open":"1"}]}');*/
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var ahora=Date.now();
	var establecimiento=$('#inpEstablecimiento1').val()+" "+$('#inpEstablecimiento2').val()+" "+$('#inpEstablecimiento3').val();
	var autorizacion=$('#inpAutorizacion').val();
	var apertura=$('#inpValor').val();
	console.log(ahora);
	db.transaction(
	function (tx){
		tx.executeSql('INSERT INTO CAJA (hora_ingreso,activo,sobrante_faltante,total,establecimiento,autorizacion) VALUES (?,?,?,?,?,?);',[ahora,1,0,0,establecimiento,autorizacion],
		function(tx,res){
			if(res.insertId>0){
				tx.executeSql('INSERT INTO CAJA_APERTURA_CIERRE (id_caja,valor_apertura,movimiento) VALUES (?,?,?);',[res.insertId,apertura,0],function(tx,res2){
					$('#contentCaja2').fadeOut('fast');
				});
			}
		});				
	},errorCB,successCB);
}

/*
function ElegirDenominacion(cual){
		$('.actiongreenbutton').css('color','#DBDCDE');
		$('#btnden'+cual).css('color','#FFF');
		var den=$('#n'+cual).attr('monto');
		var nom=$('#btnden'+cual).html();
		$('#labelgris').html("Cantidad "+nom);
		$('#nmonedas').attr('den',den);
		$('#nmonedas').attr('idden',cual);
		$('#nmonedas').val($('#n'+cual).html());
		$('#nmonedas').focus();
		$('#nmonedas').select();
	}
	
	function ColocarCantidad(){
		var cuantas=$('#nmonedas').val();
		var valor=parseInt($('#nmonedas').attr('den'));
		var id=parseInt($('#nmonedas').attr('idden'));
		$('#n'+id).html(parseInt(cuantas));
		TotalEfectivo();
	}
	
	function TotalEfectivo(){
		var totalefe=0;
		$('.labelmonedas').each(function(){
			var valor=$(this).attr('monto');
			var n=parseInt($(this).html());
			totalefe+=valor*n;
		});
		$('#totalEfectivo').val(totalefe.toFixed(2));
		$('#subtotal'+<?php echo $idformap;?>).html(totalefe.toFixed(2));
		CalcularTotal();
		
	}
	
	function Desplazar(cual){
		$('#menu div').attr('class','buttons');
		$('#btnforma'+cual).attr('class','buttonsSelected buttons');
		$('.divformas').animate({left:-1000},500);
		$('#forma'+cual).animate({left:0},500);
		$('#inputforma'+cual).select();
	}
	
	function CalcularTotal(){
		var totalfinal=0;
		$('.divcierre input').each(function(){
				if($(this).attr('elemento')=='subtotales')
					totalfinal+=parseFloat($(this).val());
		});
		$('#totalCierre').html(totalfinal.toFixed(2));
	}
	
	function ColocarDivSub(cual){
		var elsub=$('#inputforma'+cual).val();
		$('#subtotal'+cual).html(parseFloat(elsub).toFixed(2));
		CalcularTotal();
	}
	
	function CerrarCaja(){
		var cadenaformas='';
		var cadenaefectivo='';
		var c=0;
		var m=0;
		$('.divcierre input').each(function(){
				if($(this).attr('elemento')=='subtotales'){
					if($(this).attr('formapago')){
						if(parseFloat($(this).val())>0){
							if(c>0)
							cadenaformas+='|';
							cadenaformas+=$(this).val()+'_'+$(this).attr('formapago');
							c++;
						}
					}
				}
		});
		$('.labelmonedas').each(function(){
			var idden=$(this).attr('id').substr(1);
			var num=parseInt($(this).html());
			var valor=$(this).attr('monto');
			if(num>0){
				if(m>0)
				cadenaefectivo+='|';
				cadenaefectivo+=idden+'_'+num+'_'+valor;
				m++;
			}
		});
		$.post('../includes/cierreCajaNubePOS/cierre.php',
		{cadformas:cadenaformas,cadefectivo:cadenaefectivo}).done(function(data){
			console.log(data);
			$("#ModuloCierre").html(data);
		});
	}
*/