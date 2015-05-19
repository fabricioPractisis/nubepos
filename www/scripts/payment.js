var qz;   // Our main applet

function receiveJson(){
	if($('#json').html() != ''){
		var fetchJsonStrng = $('#json').html();
		var jsonObject = eval("(" + fetchJsonStrng + ")");
		$('#payClientName').html(jsonObject.Pagar[0].cliente.nombre);
		$('#payClientIDCard').html(jsonObject.Pagar[0].cliente.cedula);
		//$('#invoiceTotal').html(parseFloat(jsonObject.Pagar[0].factura.total).toFixed(2));
		$('#invoiceTotal').html(parseFloat(jsonObject.Pagar[0].factura.total-jsonObject.Pagar[0].factura.descuento).toFixed(2));
		$('#cardValue').val(jsonObject.Pagar[0].factura.total);
		$('#chequeValue').val(jsonObject.Pagar[0].factura.total);
		$('#valueCxX').val(jsonObject.Pagar[0].factura.total);
		$('#printTotal').html(jsonObject.Pagar[0].factura.total);
		
		$('#invoiceNr').html($('#nextnumber').val());
		$('#printInvoiceNr').html($('#nextnumber').val());
		
		/*$.ajax({
			type: 'POST',
			url: '../includes/payment/ajax/ajaxFetchInvoiceNumber.php',
			success: function(response){
				$('#invoiceNr').html(response);
				$('#printInvoiceNr').html(response);
				}
			});*/
		
		/*var clientID = jsonObject.Pagar[0].cliente.id_cliente;
		$.ajax({
			type: 'POST',
			data: 'clientID='+ clientID,
			url: '../includes/payment/ajax/ajaxFetchCredit.php',
			success: function(response){
				$('#currentCredit').val(parseFloat(response));
				$('#activeCredit').html(parseFloat(response));
				}
			});*/
			
		// if($.cookie('asked') == 'yes'){
			// useDefaultPrinter();
			// }
		}
	}

changePaymentCategory(0);
	
function changePaymentCategory(index,nombre){
	$('.paymentMethods').each(function(){
		if($(this).attr('idPaymentMethod')==index){
			$(this).click();
		}
	});
	
	var value = 0;
	$('.paymentMethods').each(function(){
		if($(this).val() != 0 && $(this).val() != '' && $(this).val() != null){
			value += parseFloat($(this).val());
			}
		});
	updateForm(value);
	//$('.buttonsPayment').click();
}

$('.resetPayment').click(function(){
	sumOfButtonClicked = 0;
	var newValue = 0;
	$('#paymentEfectivo').val('');
	$('.paymentMethods').change();
});
	
$('.resetPayment').on('mouseover',function(){
	var buscarID = $(this).attr('id');
	$(this).attr('src', '../../images/'+ buscarID +'Hover.png');
});
	
$('.resetPayment').on('mouseout',function(){
	var buscarID = $(this).attr('id');
	$(this).attr('src', '../../images/'+ buscarID +'.png');
});
	
$('.intPayment').click(function(){
	var calculateCeil = Math.ceil(parseFloat($('#invoiceTotal').html()));
	$('#paymentEfectivo').val(calculateCeil);
	$('.paymentMethods').change();
	});
	
$('.exactPayment').click(function(){
	var calculate = (parseFloat($('#invoiceTotal').html()));
	$('#paymentEfectivo').val(calculate);
	$('.paymentMethods').change();
	});



$('.paymentMethods').change(function(){
	var value = 0;
	$('.paymentMethods').each(function(){
		if($(this).val() != 0 && $(this).val() != '' && $(this).val() != null){
			value += parseFloat($(this).val());
			}
		});
	updateForm(value);
	});
	
$('.buttonsPayment').on('mouseover',function(){
	var buscarID = $(this).attr('id');
	$(this).attr('src', '../../images/'+ buscarID +'Hover.png');
	});
	
$('.buttonsPayment').on('mouseout',function(){
	var buscarID = $(this).attr('id');
	$(this).attr('src', '../../images/'+ buscarID +'.png');
	});

	

var sumOfButtonClicked = 0;
$('.buttonsPayment').click(function(){
	var dataValue = $(this).attr('data-value');
	var valueFromButtonClicked = $.trim(parseFloat(dataValue));
	sumOfButtonClicked += parseFloat(valueFromButtonClicked);
	$('#paymentEfectivo').val(parseFloat(sumOfButtonClicked).toFixed(2));
	
	var value = 0;
	$('.paymentMethods').each(function(){
		if($(this).val() != 0 && $(this).val() != '' && $(this).val() != null){
			value += parseFloat($(this).val());
			}
		});
	updateForm(value);
	});
	
function updateForm(value){
	value = parseFloat(value);
	var total = parseFloat($('#invoiceTotal').html());
	var change = (value - total);
	
	if(value < total){
		$('#invoiceDebt').html('FALTANTE');
		change = Math.abs(change);
		$('#invoicePaid').html(value.toFixed(2));
		$('#cardValue').val(change.toFixed(2));
		$('#chequeValue').val(change.toFixed(2));
		$('#valueCxX').val(change.toFixed(2));
		}
	else if(value > total){
		$('#invoiceDebt').html('VUELTO');
		change = Math.abs(change);
		$('#invoicePaid').html(value.toFixed(2));
		$('#cardValue').val(0);
		$('#chequeValue').val(0);
		}
	else{
		if(value == total){
			$('#invoiceDebt').html('VUELTO');
			change = Math.abs(change);
			$('#invoicePaid').html(value.toFixed(2));
			$('#cardValue').val(0);
			$('#chequeValue').val(0);
			}
		}

	$('#changeFromPurchase').html(change.toFixed(2));
	}
	
function chooseCard(card,id){
	var cardValue = $('#cardValue').val();
	var cardLote = $('#cardLote').val();
	var paymentMethods = 0;
		
	$('#cardHeader').after('<tr id="'+ card + cardLote + cardValue.replace('.','') +'" class="cardRow" style="text-align: center;"><td id="card-'+ card + cardLote + cardValue.replace('.','') +'" cardID="'+ id +'">'+ card +'</td><td id="lote-'+ card + cardLote + cardValue.replace('.','') +'">'+ cardLote +'</td><td class="cardValue" id="cardvalue-'+ card + cardLote + cardValue.replace('.','') +'">'+ cardValue +'</td><td><span style="cursor: pointer;" onclick="removeCard(\''+ card + cardLote + cardValue.replace('.','') +'\'); return false;">X</span></td></tr>');
	
	var cardValues = 0;
	$('.cardValue').each(function(){
		cardValues += parseFloat($(this).html());
		});
	
	$('#paymentTarjetas').val(cardValues);
	$('.paymentMethods').change();
	}

function removeCard(row){
	$('#'+ row).remove();
	
	var cardValues = 0;
	$('.cardValue').each(function(){
		cardValues += parseFloat($(this).html());
		});
	
	$('#paymentTarjetas').val(cardValues);
	$('.paymentMethods').change();
	}
	
function chooseBank(bank,id){
	var chequeValue = $('#chequeValue').val();
	var chequeNumber = $('#chequeNumber').val();
	var paymentMethods = 0;
		
	$('#chequeHeader').after('<tr id="'+ bank + chequeNumber + chequeValue.replace('.','') +'" class="chequeRow" style="text-align: center;"><td id="bank-'+ bank + chequeNumber + chequeValue.replace('.','') +'" bankID="'+ id +'">'+ bank +'</td><td id="number-'+ bank + chequeNumber + chequeValue.replace('.','') +'">'+ chequeNumber +'</td><td id="chequevalue-'+ bank + chequeNumber + chequeValue.replace('.','') +'" class="chequeValue">'+ chequeValue +'</td><td><span style="cursor: pointer;" onclick="removeCheque(\''+ bank + chequeNumber + chequeValue.replace('.','') +'\'); return false;">X</span></td></tr>');
	
	var chequeValues = 0;
	$('.chequeValue').each(function(){
		chequeValues += parseFloat($(this).html());
		});
	
	$('#paymentCheques').val(chequeValues);
	$('.paymentMethods').change();
	}
	
function removeCheque(row){
	$('#'+ row).remove();
	
	var chequeValues = 0;
	$('.chequeValue').each(function(){
		chequeValues += parseFloat($(this).html());
		});
	
	$('#paymentCheques').val(chequeValues);
	$('.paymentMethods').change();
	}
	
	
function addJustification(justification){
	$('#justification').val(justification);
	}
	
function performCxC(){
	$('#cxcStatus').show();
	
	if($('#justification').val() == '' || $('#justification').val() == null){
		$('#justification').effect('highlight',{},'');
		$('#cxcStatus').html('Elige una justificacion...');
		return false;
		}
	
	$('#cxcStatus').html('Verificando permisos...');
	var password = $('#authorizePassword').val();
	$.ajax({
			type: 'POST',
			data: 'password='+ password,
			url: '../includes/payment/ajax/ajaxCXCPermission.php',
			success: function(response){
				if(response == 'error1'){
					$('#cxcStatus').html('Error: La clave es incorrecto');
					return false;
					}
				else if(response == 'error2'){
					$('#cxcStatus').html('Error: Usted no tiene el permiso "CxC"');
					return false;
					}
				else{
					if(response == 'success'){
						var updateValue = parseFloat($('#valueCxX').val());
						$('#cxcStatus').html('OK!');
						$('#paymentCxC').val(updateValue);
						$('.paymentMethods').change();
						return true;
						}
					}
				}
			});
	}
	
function useCredit(){
	var maxCredit = parseFloat($('#currentCredit').val());
	var updateValue = parseFloat($('#valueCredit').val());
	
	if(updateValue > maxCredit){
		$('#creditStatus').show();
		$('#creditStatus').html('Error: El cliente tiene como utilizar $'+ maxCredit +' de credito');
		return false;
		}
	var availableCredit = (maxCredit - updateValue);
	$('#activeCredit').html(availableCredit);
	$('#paymentPrepago').val(updateValue);
	$('.paymentMethods').change();
	}
	
function newCredit(){
	var creditJustification = $('#creditJustification').val();
	if(creditJustification == '' || creditJustification == null){
		 $('#creditJustification').effect('highlight',{},'');
		 return false;
		}
	
	var payClientIDCard = $.trim($('#payClientIDCard').html());
	if(payClientIDCard == 9999999999999){
		$('#newCreditStatus').show();
		$('#newCreditStatus').html('El cliente no puede ser Consumidor Final');
		return false;
		}
		
	var newCredit = parseFloat($('#invoiceTotal').html());
	$('#paymentNotadeCredito').val(newCredit);
	$('.paymentMethods').change();	
	}
	
function performGift(){
	$('#giftStatus').show();
	
	if($('#giftJustification').val() == '' || $('#giftJustification').val() == null){
		$('#giftJustification').effect('highlight',{},'');
		$('#giftStatus').html('Error: Tiene que poner una justificaci๓n');
		return false;
		}
	
	$('#giftStatus').html('Verificando permisos...');
	var password = $('#authorizePasswordGift').val();
	$.ajax({
			type: 'POST',
			data: 'password='+ password,
			url: '../includes/payment/ajax/ajaxCXCPermission.php',
			success: function(response){
				if(response == 'error1'){
					$('#giftStatus').html('Error: La clave es incorrecto');
					return false;
					}
				else if(response == 'error2'){
					$('#giftStatus').html('Error: Usted no tiene el permiso "Cortesํa"');
					return false;
					}
				else{
					if(response == 'success'){
						var updateValue = parseFloat($('#valueGift').val());
						$('#giftStatus').html('OK!');
						$('#paymentCortesia').val(updateValue);
						$('.paymentMethods').change();
						return true;
						}
					}
				}
			});
	}
	
function performInternalPurchase(){
	$('#internalStatus').show();
	
	var payClientIDCard = $.trim($('#payClientIDCard').html());
	if(payClientIDCard == 9999999999999){
		$('#internalStatus').html('Error: El cliente no puede ser Consumidor Final');
		return false;
		}
	
	if($('#internalJustification').val() == '' || $('#internalJustification').val() == null){
		$('#internalJustification').effect('highlight',{},'');
		$('#internalStatus').html('Error: Tiene que poner una justificaci๓n');
		return false;
		}
	
	$('#internalStatus').html('Verificando permisos...');
	var password = $('#authorizePasswordInternal').val();
		$.ajax({
			type: 'POST',
			data: 'password='+ password,
			url: '../includes/payment/ajax/ajaxCXCPermission.php',
			success: function(response){
				if(response == 'error1'){
					$('#internalStatus').html('Error: La clave es incorrecto');
					return false;
					}
				else if(response == 'error2'){
					$('#internalStatus').html('Error: Usted no tiene el permiso "Consumo Interno"');
					return false;
					}
				else{
					if(response == 'success'){
						var credit = parseFloat($('#currentCredit').val());
						$('#valueCredit').val('');
						$('#activeCredit').html(credit);
						$('.paymentMethods').val('');
						$('.cardRow').remove();
						$('.chequeRow').remove();
						var updateValue = parseFloat($('#invoiceTotal').html());
						$('#internalStatus').html('OK!');
						$('#paymentConsumoInterno').val(updateValue);
						$('.paymentMethods').change();
						return true;
						}
					}
				}
			});
	}
	
function performPurchase(restaurant){
	pagar();
	if($('#idCliente').val()!=''&&$('#idCliente').val()>0){
			var table;
			var aux;
			var acc = document.getElementById('acc').value;
			var echo = document.getElementById('echo').value;
			//alert(acc+'**'+echo);

			if(restaurant == 'table'){
				table = parseInt($('#shopActivatedTable').val());
				aux = parseInt($('#shopActivatedAux').val());
				}
			else{
				table = parseInt($('#shopActivatedTable').val());
				aux = parseInt($('#shopActivatedAux').val());
				}

			var invoicePaid = parseFloat($('#invoicePaid').html());
			var invoiceTotal = parseFloat($('#invoiceTotal').html());
			
			if(invoicePaid < invoiceTotal){
				alert('El valor pagado es menor del total');
				return false;
				}
				
			$('#payButton').hide();
			$('#payButtonActivated').show();
			
			//figure out what payments types were used and store them into an array
			var paymentsUsed = new Array();
			$('.paymentMethods').each(function(){
				if($(this).val() != '' && $(this).val() != 0 && $(this).val() != null){
					var paymentMethod = $(this).attr('paymentMethod');
					var idPaymentMethod = $(this).attr('idPaymentMethod')
					var combineToString = paymentMethod +'|'+ idPaymentMethod;
					paymentsUsed.push(idPaymentMethod);
					}
				});
			
			var fetchJson = $('#json').html();
			var figureOutLength = paymentsUsed.length;
			var cash = 0;
			var valueCxC = 0;
			var credit = 0;
			var newCredit = 0;
			var justificationCxC = '';
			var creditJustification = '';
			var giftValue = 0;
			var	giftJustification = '';
			var paymentConsumoInterno = 0;
			var internalJustification = '';
			var cards = new Array();
			var cheques = new Array();
			
			$.each(paymentsUsed, function(index,value){
				if(value == 1){
					cash = parseFloat($('#paymentEfectivo').val());
					}
			
				if(value == 2){
					//$('.cardRow').each(function(){
						var fetchCardID = parseInt($('#card-'+ $(this).attr('id')).attr('cardID'));
						var cardLote = parseFloat($('#lote-'+ $(this).attr('id')).html());
						//var cardValue = parseFloat($('#cardvalue-'+ $(this).attr('id')).html());
						var cardValue = parseFloat($('#paymentTarjetas').val());
						//var combineCardInfo = fetchCardID +'|'+ cardLote +'|'+ cardValue +'@';
						var combineCardInfo = '0|0|'+cardValue+'@';
						cards.push(combineCardInfo);
						//});
				}
					
				if(value == 3){
					//$('.chequeRow').each(function(){
						var fetchBankID = parseInt($('#bank-'+ $(this).attr('id')).attr('bankID'));
						var chequeNumber = parseFloat($('#number-'+ $(this).attr('id')).html());
						//var chequeValue = parseFloat($('#chequevalue-'+ $(this).attr('id')).html());
						var chequeValue = parseFloat($('#paymentCheques').val());
						//var combineChequeInfo = fetchBankID +'|'+ chequeNumber +'|'+ chequeValue +'@';
						var combineChequeInfo = '0|0|'+ chequeValue +'@';
						cheques.push(combineChequeInfo);
						//});
					}
					
				if(value == 4){
					valueCxC = $('#paymentXCobrar').val();
					justificationCxC = $('#justification').val();
				}
				
				if(value == 5){
					retencion = $('#paymentRetencion').val();
				}
					
				if(value == 6){
					credit = $('#paymentPrepago').val();
				}
					
				if(value == 7){
					newCredit = $('#paymentNotadeCredito').val();
					creditJustification = $('#creditJustification').val();
					}
					
				if(value == 9){
					giftValue = $('#paymentCortesia').val();
					giftJustification = $('#giftJustification').val();
					}
					
				if(value == 12){
					paymentConsumoInterno = $('#paymentConsumoInterno').val();
					internalJustification = $('#internalJustification').val();
					}
				
				});
				
				var clientName = $.trim($('#payClientName').html());
				var RUC = $.trim($('#cedulaP').val());
				var address = $('#direccionP').val();
				var tele = $('#telefonoP').val();
				
				//console.log(clientName+'/'+RUC);
				//console.log(clientName+'/'+RUC);
				/*funcion para insertar datos de las facturas*/
				var hoy=new Date().getTime();
				//console.log(hoy);
				
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(Ingresafacturas, errorCB, successCB);
				function Ingresafacturas(tx){
					tx.executeSql("INSERT INTO FACTURAS(clientName,RUC,address,tele,fetchJson,paymentsUsed,cash,cards,cheques,vauleCxC,paymentConsumoInterno,tablita,aux,acc,echo,fecha)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[clientName,RUC,address,tele,fetchJson,paymentsUsed,cash,cards,cheques,valueCxC,paymentConsumoInterno,table,aux,acc,echo,hoy],function(){
						console.log("Nueva Factura Ingresada");
						$('#pay').fadeOut('fast');
						envia('nubepos/nubepos/');
					});
				}
				
				$('#subtotalSinIva,#subtotalIva,#descuentoFactura,#totalmiFactura').val('0');
				/**/
				/*$('#datosprint #clientName').val(clientName);
				$('#datosprint #RUC').val(RUC);
				$('#datosprint #address').val(address);
				$('#datosprint #tele').val(tele);
				$('#datosprint #json').val(fetchJson);
				$('#datosprint #paymentMethods').val(paymentsUsed);
				$('#datosprint #cash').val(cash);
				$('#datosprint #cards').val(cards);
				$('#datosprint #cheques').val(cheques);
				$('#datosprint #CxCValue').val(valueCxC);
				$('#datosprint #CxCJustification').val(justificationCxC);
				$('#datosprint #credit').val(credit);
				$('#datosprint #newCredit').val(newCredit);
				$('#datosprint #creditJustification').val(creditJustification);
				$('#datosprint #giftValue').val(giftValue);
				$('#datosprint #giftJustification').val(giftJustification);
				$('#datosprint #paymentConsumoInterno').val(paymentConsumoInterno);
				$('#datosprint #internalJustification').val(internalJustification);
				$('#datosprint #table').val(table);
				$('#datosprint #aux').val(aux);
				$('#datosprint #acc').val(acc);
				$('#datosprint #echo').val(echo);
				$('#subtotalSinIva,#subtotalIva,#descuentoFactura,#totalmiFactura').val('0');
				
				//para pagar
				$('#datosprint').submit();*/
				
				//update database
				/*$.ajax({
					type: 'POST',
					data: 'clientName='+ clientName +'&RUC='+ RUC +'&address='+ address +'&tele='+ tele +'&json='+ fetchJson +'&paymentMethods='+ paymentsUsed +'&cash='+ cash +'&cards='+ cards +'&cheques='+ cheques +'&CxCValue='+ valueCxC +'&CxCJustification='+ justificationCxC +'&credit='+ credit +'&newCredit='+ newCredit +'&creditJustification='+ creditJustification +'&giftValue='+ giftValue +'&giftJustification='+ giftJustification +'&paymentConsumoInterno='+ paymentConsumoInterno +'&internalJustification='+ internalJustification +'&table='+ table +'&aux='+ aux+'&acc='+ acc +'&echo='+ echo,
					url: '../includes/paymentNubePOS/ajax/ajaxPerformPurchase.php',
					success: function(response){
						$('#subtotalSinIva,#subtotalIva,#descuentoFactura,#totalmiFactura').val('0');
						window.open('print.php?cont='+response, '_self');
						
						
						/*var funcion = "imprSelec('muestra');function imprSelec(muestra){var ficha=document.getElementById(muestra);var ventimp=window.open(' ','popimpr');ventimp.document.write(ficha.innerHTML);ventimp.document.close();ventimp.print();ventimp.close();location.reload();};";*/

						/*var capa = document.getElementById("pay");
						var div = document.createElement("div");
						div.innerHTML = '<div id="muestra" style="position: absolute;left: 50%;top: 4px;width: 800px;height: 480px;margin-left: -400px;background-color: #FFFFFF;z-index: 100;overflow-x: hidden;overflow-y: auto;">'+response+'</div>';
						capa.appendChild(div);*/

						/*var btnaceptar = document.createElement("div");
						btnaceptar.innerHTML = '<div id="muestra" style="position:absolute; left:50%; top:484px; width: 800px; height:70px; margin-left:-400px; background-color:#FFFFFF; z-index:100;"><table cellpadding="0" cellspacing="5px" style="position:relative; margin:0px auto;"><tr><td><div style="width:80px;" class="actiongreenbutton" onclick="'+funcion+'">Imprimir</div></td><td><div class="actionredbutton" onclick="location.reload();">Cancelar</div></td></tr></table></div>';
						capa.appendChild(btnaceptar);*/

						//imprSelec('muestra');

						//$('#printProducts').html();
						//location.reload();
						/*}
					});*/
		}else{
			alert("Por favor, elija un cliente.");
		}
	}
function imprSelec(muestra)
{
  var ficha=document.getElementById(muestra);
  var ventimp=window.open('','popimpr');
  ventimp.document.write(ficha.innerHTML);
  ventimp.document.close();
  ventimp.print();
  ventimp.close();
  location.reload();
}
function cancelPayment(){
	$('#payButton').show();
	$('#payButtonActivated').hide();
	$('#referenceToReset')[0].reset();
	$('.paymentMethods').val('');
	$('#justification').val('');
	$('.passwordCheck').val('');
	$('.statuses').hide();
	$('.statuses').html('');
	$('.payOverview').html(0);
	$('.cardRow').remove();
	$('.chequeRow').remove();
	changePaymentCategory(0);
	$('#pay').hide();
	$('#functionality-1').show();
	$('#paymentCategory-1').addClass('categoryChosen');
	$('#invoicePaid').html('0.00');
	$('#changeFromPurchase').html('0.00');
	}


   var qz;   // Our main applet
      function findPrinter() {
         
         if (qz != null) {
            // Searches for locally installed printer with "zebra" in the name
            qz.findPrinter("Zebra");
         }
         
         // *Note:  monitorFinding() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDoneFinding()" and handle your next steps there.
         monitorFinding();
      }

      function findPrinters() {
         
         if (qz != null) {
            // Searches for locally installed printer with "zebra" in the name
            qz.findPrinter("\\{dummy printer name for listing\\}");
         }

         monitorFinding2();
      }

      function print(string,preprint,useApplet) {
		if(useApplet == 'no'){
			if(preprint == 'yes'){
				//alert(string);
				var formatString = string.split('|');
				
				var stringToPrint = '';
				stringToPrint += "<table><tr><td colspan=\"4\">"+ formatString[0] +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">Pre-factura</td></tr>";
				
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				stringToPrint += "<tr><td>CANT</td><td>DESCRIPCION</td><td>P.UNI</td><td>TOTAL</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				
				//fetch products
				var explodeProducts = formatString[2].split('/');
				
				$.each(explodeProducts, function(index,value){
					var explodeValue = value.split('@');
					if(explodeValue[0] != null && explodeValue[1] != null && explodeValue[2] != null && explodeValue[3] != null){
						if(explodeValue[1].length >= 12){
							stringToPrint +="<tr><td>"+ explodeValue[0] +"</td><td>"+ explodeValue[1] +"</td><td>"+ explodeValue[2] +"</td><td>"+ explodeValue[3] +"</td></tr>";
							}
						else{
							stringToPrint +="<tr><td>"+ explodeValue[0] +"</td><td>"+ explodeValue[1] +"</td><td>"+ explodeValue[2] +"</td><td>"+ explodeValue[3] +"</td></tr>";
							}
						}
					});
				
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				stringToPrint += "<tr><td colspan=\"2\">Subtotal</td><td colspan=\"2\">"+ formatString[4]+"</td></tr>";
				
				//alert(formatString[3]);
				
				var explodeTaxes = formatString[3].split('?');
				$.each(explodeTaxes, function(index,value){
					var explodeValue = value.split('@');
					if(explodeValue[1] != null){
						stringToPrint += "<tr><td colspan=\"2\">" +explodeValue[0] +"</td><td colspan=\"2\">"+ explodeValue[1] +"</td></tr>";
						}
					});
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				stringToPrint +="<tr><td colspan=\"2\">TOTAL:</td><td colspan=\"2\">"+ formatString[5] +"</td></tr></table>";
				
				stringToPrint += "\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n";
				stringToPrint += "NOMBRE:_______________________________\r\n\r\n";
				stringToPrint += "RUC:__________________________________\r\n\r\n";
				stringToPrint += "DIRECCION:____________________________\r\n\r\n";
				stringToPrint += "______________________________________";
			
				var mywindow = window.open('', 'Receipt', 'height=400,width=600');
				mywindow.document.write('<html><head><title></title>');
				/*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
				mywindow.document.write('</head><body >');
				mywindow.document.write(stringToPrint);
				mywindow.document.write('</body></html>');

				mywindow.print();
				mywindow.close();

				return true;
				}
			else{
				var clientName = $.trim($('#payClientName').html());
				var RUC = $.trim($('#payClientIDCard').html());
				var formatString = string.split('|');		
				var address;
				
				if(formatString[8] == null || formatString[8] == 'undefined'  || formatString[8] == ''){
					address = '';
					}
				else{
					address = formatString[8];
					}
					
				var tele;
				if(formatString[9] == null || formatString[9] == 'undefined'  || formatString[9] == ''){
					tele = '';
					}
				else{
					tele = formatString[9];
					}
				
				
				var stringToPrint = '';
				stringToPrint += "<table><tr><td colspan=\"4\">"+ formatString[0] +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">Factura:"+ formatString[7] +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">Nombre:"+ clientName +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">RUC: "+ RUC +" "+ formatString[1]+"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">"+ address +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">Telefono:"+ tele +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\">Pagos:"+ formatString[10] +"</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				stringToPrint += "<tr><td>CANT</td><td>DESCRIPCION</td><td>P.UNI</td><td>TOTAL</td></tr>";
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				
				//fetch products
				var explodeProducts = formatString[2].split('/');
				
				$.each(explodeProducts, function(index,value){
					var explodeValue = value.split('@');
					if(explodeValue[0] != null && explodeValue[1] != null && explodeValue[2] != null && explodeValue[3] != null){
						if(explodeValue[1].length >= 12){
							stringToPrint +="<tr><td>"+ explodeValue[0] +"</td><td>"+ explodeValue[1] +"</td><td>"+ explodeValue[2] +"</td><td>"+ explodeValue[3] +"</td></tr>";
							}
						else{
							stringToPrint +="<tr><td>"+ explodeValue[0] +"</td><td>"+ explodeValue[1] +"</td><td>"+ explodeValue[2] +"</td><td>"+ explodeValue[3] +"</td></tr>";
							}
						}
					});
				
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				stringToPrint += "<tr><td colspan=\"2\">Subtotal sin IVA</td><td colspan=\"2\">"+ formatString[3]+"</td></tr>";
				stringToPrint += "<tr><td colspan=\"2\">Subtotal con IVA</td><td colspan=\"2\">"+ formatString[4]+"</td></tr>";
				
				var explodeTaxes = formatString[5].split('@');
				$.each(explodeTaxes, function(index,value){
					var explodeValue = value.split('/');
					if(explodeValue[1] != null){
						stringToPrint += "<tr><td colspan=\"2\">" +explodeValue[0] +"</td><td colspan=\"2\">"+ explodeValue[1] +"</td></tr>";
						}
					});
				stringToPrint += "<tr><td colspan=\"4\"> ----------------------------------</td></tr>";
				stringToPrint +="<tr><td colspan=\"2\">TOTAL:</td><td colspan=\"2\">"+ formatString[6] +"</td></tr></table>";
			
				var mywindow = window.open('', 'Receipt', 'height=400,width=600');
				mywindow.document.write('<html><head><title></title>');
				/*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
				mywindow.document.write('</head><body >');
				mywindow.document.write(stringToPrint);
				mywindow.document.write('</body></html>');

				mywindow.print();
				mywindow.close();

				return true;
				}
			}
		else{
			if (qz != null) {
				if(preprint == 'yes'){
					useDefaultPrinter();
					//alert(string);
					var formatString = string.split('|');
					qz.append("a !"+ formatString[0] +"!\r\n");
					qz.append("Pre Factura\r\n\r\n");
					qz.append(formatString[1] +" \r\n");

					qz.append("!R ออออออออออออออออออออออออออออออออออออออออ");
					qz.append("CANT DESCRIPCION       P.UNI    TOTAL\r\n");
					qz.append("R ออออออออออออออออออออออออออออออออออออออออ\r\n");
					
					//fetch products
					var explodeProducts = formatString[2].split('/');
					
					$.each(explodeProducts, function(index,value){
						var explodeValue = value.split('@');
						if(explodeValue[0] != null && explodeValue[1] != null && explodeValue[2] != null && explodeValue[3] != null){
							if(explodeValue[1].length >= 12){
								if(explodeValue[0].length >= 1){
									var amountLength = 4 - explodeValue[0].length;
									var addWhiteSpacesAmount = '';
									
									for(t = 1; t <= amountLength; t++){
										addWhiteSpacesAmount += ' ';
										}
									}
								qz.append(explodeValue[0] +""+ addWhiteSpacesAmount +""+ explodeValue[1] +"       "+ explodeValue[2] +"   "+ explodeValue[3] +"\r\n");
								}
							else{
								var nameLength = 19 - explodeValue[1].length;
								var addWhiteSpaces = '';
								
								for(j = 1; j <= nameLength; j++){
									addWhiteSpaces += ' ';
									}
								
								if(explodeValue[0].length >= 1){
									var amountLength = 4 - explodeValue[0].length;
									var addWhiteSpacesAmount = '';
									
									for(t = 1; t <= amountLength; t++){
										addWhiteSpacesAmount += ' ';
										}
									}
								
								qz.append(explodeValue[0] +""+ addWhiteSpacesAmount +""+ explodeValue[1] +""+ addWhiteSpaces +""+ explodeValue[2] +"   "+ explodeValue[3] +"\r\n");
								}
							}
						});
					
					qz.append("R ฤฤฤฤฤฤฤฤฤฤฤฤ\r\n\r\n");
					qz.append("Subtotal       "+ parseFloat(formatString[4]).toFixed(2) +" \r\n");
					
					var explodeTaxes = formatString[3].split('?');
					var totalTaxes = 0;
					
					$.each(explodeTaxes, function(index,value){
						var explodeValue = value.split('@');
						if(explodeValue[1] != null){
							var nameLength = 15 - explodeValue[0].length;
							var addWhiteSpaces = '';
							
							for(j = 1; j <= nameLength; j++){
								addWhiteSpaces += ' ';
								}
							qz.append(explodeValue[0] +""+ addWhiteSpaces +""+ parseFloat(explodeValue[1]).toFixed(2) +"\r\n");
							totalTaxes += parseFloat(explodeValue[1]);
							}
						});

					qz.append("R ออออออออออออ\r\n");
					qz.append("a !\r\n\r\nTOTAL USD: "+ (parseFloat(formatString[4]) + parseFloat(totalTaxes)).toFixed(2) +"!\r\n\r\n\r\n\r\n\r\n\r\n\r\n");
					qz.append("NOMBRE:_______________________________\r\n\r\n");
					qz.append("RUC:__________________________________\r\n\r\n");
					qz.append("DIRECCION:____________________________\r\n\r\n");
					qz.append("______________________________________\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n");
				   
				   //alert(formatString[4]);
				   
					while (!qz.isDoneAppending()) {} 
					qz.print();
					}
				else{
					var clientName = $.trim($('#payClientName').html());
					var RUC = $.trim($('#payClientIDCard').html());
					var formatString = string.split('|');
					
					var address;
					if(formatString[8] == null || formatString[8] == 'undefined'  || formatString[8] == ''){
						address = '';
						}
					else{
						address = formatString[8];
						}
						
					var tele;
					if(formatString[9] == null || formatString[9] == 'undefined'  || formatString[9] == ''){
						tele = '';
						}
					else{
						tele = formatString[9];
						}
					
					qz.append("a !"+ formatString[0] +"!\r\n\r\n\r\n");
					qz.append("@a !Factura:!"+ formatString[7] +" \r\n");
					qz.append("@a !Nombre:!"+ clientName +" \r\n");
					qz.append("a !RUC:!"+ RUC +" "+ formatString[1]+" \r\n");
					qz.append("a !"+ address +"!\r\n");
					qz.append("a !Telefono:!"+ tele +"\r\n");
					qz.append("a !Pagos:!"+ formatString[10] +"\r\n");
					qz.append("!R ออออออออออออออออออออออออออออออออออออออออ");
					qz.append("CANT DESCRIPCION       P.UNI    TOTAL\r\n");
					qz.append("R ออออออออออออออออออออออออออออออออออออออออ\r\n");
					
					//fetch products
					var explodeProducts = formatString[2].split('/');
					
					$.each(explodeProducts, function(index,value){
						var explodeValue = value.split('@');
						if(explodeValue[0] != null && explodeValue[1] != null && explodeValue[2] != null && explodeValue[3] != null){
							if(explodeValue[1].length >= 12){
								if(explodeValue[0].length >= 1){
									var amountLength = 4 - explodeValue[0].length;
									var addWhiteSpacesAmount = '';
									
									for(t = 1; t <= amountLength; t++){
										addWhiteSpacesAmount += ' ';
										}
									}
								qz.append(explodeValue[0] +""+ addWhiteSpacesAmount +""+ explodeValue[1] +"       "+ explodeValue[2] +"   "+ explodeValue[3] +"\r\n");
								}
							else{
								var nameLength = 19 - explodeValue[1].length;
								var addWhiteSpaces = '';
								
								for(j = 1; j <= nameLength; j++){
									addWhiteSpaces += ' ';
									}
									
								if(explodeValue[0].length >= 1){
									var amountLength = 4 - explodeValue[0].length;
									var addWhiteSpacesAmount = '';
									
									for(t = 1; t <= amountLength; t++){
										addWhiteSpacesAmount += ' ';
										}
									}
								qz.append(explodeValue[0] +""+ addWhiteSpacesAmount +""+ explodeValue[1] +""+ addWhiteSpaces +""+ explodeValue[2] +"   "+ explodeValue[3] +"\r\n");
								}
							}
						});
					
					qz.append("R ฤฤฤฤฤฤฤฤฤฤฤฤ\r\n\r\n");
					qz.append("Subtotal sin IVA "+ parseFloat(formatString[3]).toFixed(2) +" \r\n");
					qz.append("Subtotal con IVA "+ parseFloat(formatString[4]).toFixed(2) +" \r\n");
					
					var explodeTaxes = formatString[5].split('@');
					$.each(explodeTaxes, function(index,value){
						var explodeValue = value.split('/');
						if(explodeValue[1] != null){
							var nameLength = 17 - explodeValue[0].length;
							var addWhiteSpaces = '';
							
							for(j = 1; j <= nameLength; j++){
								addWhiteSpaces += ' ';
								}
							qz.append(explodeValue[0] +""+ addWhiteSpaces +""+ parseFloat(explodeValue[1]).toFixed(2) +"\r\n");
							}
						});
					qz.append("R ออออออออออออ\r\n");
					qz.append("a !\r\n\r\nTOTAL: "+ parseFloat(formatString[6]).toFixed(2) +"!\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n");

				   
					while (!qz.isDoneAppending()) {}
					qz.print();
				}
			}

		 monitorPrinting();
			 
			 /**
			   *  PHP PRINTING:
			   *  // Uses the php `"echo"` function in conjunction with jZebra `"append"` function
			   *  // This assumes you have already assigned a value to `"$commands"` with php
			   *  document.jZebra.append(<?php echo $commands; ?>);
			   */
			   
			 /**
			   *  SPECIAL ASCII ENCODING
			   *  //applet.setEncoding("UTF-8");
			   *  applet.setEncoding("Cp1252"); 
			   *  applet.append("\xDA");
			   *  applet.append(String.fromCharCode(218));
			   *  applet.append(chr(218));
			   */
			}
      }
      
      function printESCPImage() {
        if (qz != null) {
            // Append a black & white image.  If there are non b&w pixels, they'll
			// be converted to black or white based on a general lumen calculation.
			// In the case of "ESCP", an optional 3rd parameter "dotDensity" can be
			// provided.  This can be either an integer value (32, 33, 39) or 
			// a text value of "single", "double", "triple".  Triply dense makes
			// the image print smaller, but can improve the image quality for 
			// devices that support it.  Default value is "single" (32).
			// qz.appendImage(getPath() + "img/image_sample_bw.png", "ESCP", 32);
            qz.appendImage(getPath() + "img/image_sample_bw.png", "ESCP", "single");
            while (!qz.isDoneAppending()) {
                // Note, enless while loops are bad practice.
                // Create a JavaScript function called "jzebraDoneAppending()"
                // instead and handle your next steps there.
            }
            
            // Cut the receipt
            qz.appendHex("x1Dx56x41");
            
            // Send characters/raw commands to printer
            qz.print();
        }
		
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
         monitorPrinting();
      }
      
      function printZPLImage() {
         
         if (qz != null) {
            // Sample text
            qz.append("^XA\n");
            qz.append("^FO50,50^ADN,36,20^FDPRINTED USING QZ PRINT PLUGIN " + qz.getVersion() + "\n"); 
           
            // A second (and sometimes third an fourth) parameter MUST be 
            // specified to "appendImage()", for qz-print to use raw image 
            // printing.  If this is not supplied, qz-print will send PostScript
            // data to your raw printer!  This is bad!
            
            qz.appendImage(getPath() + "img/image_sample_bw.png", "ZPLII");
            while (!qz.isDoneAppending()) {
              // Note, enless while loops are bad practice.
              // Create a JavaScript function called "jzebraDoneAppending()"
              // instead and handle your next steps there.
            }
              
            // Finish printing
            qz.append("^FS\n");  
            qz.append("^XZ\n");  
            
            // Send characters/raw commands to printer
            qz.print();
         }
		 
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
	     monitorPrinting();
      }


      function print64() {
         
         if (qz != null) {
            // Use qz-print's `"append64"` function. This will automatically convert provided
            // base64 encoded text into ascii/bytes, etc.
            qz.append64("QTU5MCwxNjAwLDIsMywxLDEsTiwialplYnJhIHNhbXBsZS5odG1sIgpBNTkwLDE1NzAsMiwzLDEsMSxOLCJUZXN0aW5nIHRoZSBwcmludDY0KCkgZnVuY3Rpb24iClAxCg==");
            
            // Send characters/raw commands to printer
            qz.print();
         }
         
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
         monitorPrinting();
      }
      
      function printPages() {
         
         if (qz != null) { 
            // Mark the end of a label, in this case  P1 plus a newline character
            // qz-print knows to look for this and treat this as the end of a "page"
            // for better control of larger spooled jobs (i.e. 50+ labels)
            qz.setEndOfDocument("P1,1\r\n");
            
            // The amount of labels to spool to the printer at a time. When
            // qz-print counts this many `EndOfDocument`'s, a new print job will 
            // automatically be spooled to the printer and counting will start
            // over.
            qz.setDocumentsPerSpool("2");
            
            qz.appendFile(getPath() + "misc/epl_multiples.txt");
            
            // Send characters/raw commands to printer
            qz.print();

         }
         
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
         monitorPrinting();
      }

      function printXML() {
         
         if (qz != null) {
            // Appends the contents of an XML file from a SOAP response, etc.
            // a valid relative URL or a valid complete URL is required for the XML
            // file.  The second parameter must be a valid XML tag/node containing
            // base64 encoded data, i.e. <node_1>aGVsbG8gd29ybGQ=</node_1>
            // Example:
            //     qz.appendXML("http://yoursite.com/zpl.xml", "node_1");
            //     qz.appendXML("http://justtesting.biz/jZebra/dist/epl.xml", "v7:Image");
            qz.appendXML(getPath() + "misc/zpl_sample.xml", "v7:Image");
            
            // Send characters/raw commands to printer
            //qz.print(); // Can't do this yet because of timing issues with XML
         }
         
         // Monitor the append status of the xml file, prints when appending if finished
         // *Note:  monitorAppending() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDoneAppending()" and handle your next steps there.
         monitorAppending();
      }
      
      function printHex() {
      	 
         if (qz != null) {
            // *NOTE* New syntax with version 1.5.4, no backslashes needed, which should fix \x00 JavaScript bug.
            // Can be in format "1B00" or "x1Bx00"
            qz.appendHex("4e0d0a713630390d0a513230332c32360d0a42352c32362c302c31412c332c372c3135322c422c2231323334220d0a413331302c32362c302c332c312c312c4e2c22534b55203030303030204d46472030303030220d0a413331302c35362c302c332c312c312c4e2c224a5a45425241205052494e54204150504c4554220d0a413331302c38362c302c332c312c312c4e2c2254455354205052494e54205355434345535346554c220d0a413331302c3131362c302c332c312c312c4e2c2246524f4d2053414d504c452e48544d4c220d0a413331302c3134362c302c332c312c312c4e2c225052494e5448455828292046554e43220d0a50312c310d0a");
            
            // Send characters/raw commands to printer
            qz.print();

            
         }
         
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
         monitorPrinting();
         
         /**
           *  CHR/ASCII PRINTING:
           *  // Appends CHR(27) + CHR(29) using `"fromCharCode"` function
           *  // CHR(27) is commonly called the "ESCAPE" character
           *  qz.append(String.fromCharCode(27) + String.fromCharCode(29));
           */
      }
      
      
      function printFile(file) {
      	    
      	    if (qz != null) {
	       // Using qz-print's "appendFile()" function, a file containg your raw EPL/ZPL
	       // can be sent directly to the printer
	       // Example: 
	       //     qz.appendFile("http://yoursite/zpllabel.txt"); // ...etc
	       qz.appendFile(getPath() + "misc/" + file);
	       qz.print();
	    }
	    
            // *Note:  monitorPrinting() still works but is too complicated and
            // outdated.  Instead create a JavaScript  function called 
            // "jzebraDonePrinting()" and handle your next steps there.
	    monitorPrinting();
      }


      function printImage(scaleImage) {
            
      	    if (qz != null) {
	       // Using qz-print's "appendImage()" function, a png, jpeg file
	       // can be sent directly to the printer supressing the print dialog
	       // Example:
	       //     qz.appendImage("http://yoursite/logo1.png"); // ...etc

               // Sample only: Searches for locally installed printer with "pdf" in the name
               // Can't use Zebra, because this function needs a PostScript capable printer
               qz.findPrinter("\\{dummy printer name for listing\\}");
               while (!qz.isDoneFinding()) {
                    // Note, enless while loops are bad practice.
                    // Create a JavaScript function called "jzebraDoneFinding()"
                    // instead and handle your next steps there.
               }

               // Sample only: If a PDF printer isn't installed, try the Microsoft XPS Document
               // Writer.  Replace this with your printer name.
               var printers = qz.getPrinters().split(",");
               for (i in printers) {
		    if (printers[i].indexOf("Microsoft XPS") != -1 || 
			printers[i].indexOf("PDF") != -1) {
			   qz.setPrinter(i);      
		    }	       
               }
               
               // No suitable printer found, exit
               if (qz.getPrinter() == null) {
                   alert("Could not find a suitable printer for printing an image.");
                   return;
               }

               // Optional, set up custom page size.  These only work for PostScript printing.
               // setPaperSize() must be called before setAutoSize(), setOrientation(), etc.
               if (scaleImage) {
                    qz.setPaperSize("8.5in", "11.0in");  // US Letter
               	    //qz.setPaperSize("210mm", "297mm");  // A4
                    qz.setAutoSize(true);
                    //qz.setOrientation("landscape");
                    //qz.setOrientation("reverse-landscape");
                    //qz.setCopies(3); //Does not seem to do anything
               }

               // Append our image (only one image can be appended per print)
	       qz.appendImage(getPath() + "img/image_sample.png");
	    }

            // Very important for images, uses printPS() insetad of print()
            // *Note:  monitorAppending2() still works but is too complicated and
            // outdated.  Instead create a JavaScript  function called 
            // "jzebraDoneAppending()" and handle your next steps there.
	    monitorAppending2();
      }
      
      function printPDF() {
          
      	    if (qz != null) {
               qz.findPrinter("\\{dummy printer name for listing\\}");
               while (!qz.isDoneFinding()) {
                    // Note, enless while loops are bad practice.
                    // Create a JavaScript function called "jzebraDoneFinding()"
                    // instead and handle your next steps there.
               }

               // Sample only: If a PDF printer isn't installed, try the Microsoft XPS Document
               // Writer.  Replace this with your printer name.
               var printers = qz.getPrinters().split(",");
               for (i in printers) {
		    if (printers[i].indexOf("Microsoft XPS") != -1 || 
			printers[i].indexOf("PDF") != -1) {
			   qz.setPrinter(i);      
		    }	       
               }
               
               // No suitable printer found, exit
               if (qz.getPrinter() == null) {
                   alert("Could not find a suitable printer for a PDF document");
                   return;
               }
               
               // Append our pdf (only one pdf can be appended per print)
	       qz.appendPDF(getPath() + "misc/pdf_sample.pdf");
	    }

            // Very important for PDF, uses printPS() instead of print()
            // *Note:  monitorAppending2() still works but is too complicated and
            // outdated.  Instead create a JavaScript  function called 
            // "jzebraDoneAppending()" and handle your next steps there.
	    monitorAppending2();
      }
      
      // Gets the current url's path, such as http://site.com/example/dist/
      function getPath() {
          var path = window.location.href;
          return path.substring(0, path.lastIndexOf("/")) + "/";
      }
      
 
      function printHTML() {
            
      	    if (qz != null) {
               qz.findPrinter("\\{dummy printer name for listing\\}");
               while (!qz.isDoneFinding()) {
                   // Wait
               }

               // Sample only: If a PDF printer isn't installed, try the Microsoft XPS Document
               // Writer.  Replace this with your printer name.
               var printers = qz.getPrinters().split(",");
               for (i in printers) {
		    if (printers[i].indexOf("Microsoft XPS") != -1 || 
			printers[i].indexOf("PDF") != -1) {
			   qz.setPrinter(i);      
		    }	       
               }
               
               // No suitable printer found, exit
               if (qz.getPrinter() == null) {
                   alert("Could not find a suitable printer for an HTML document");
                   return;
               }
               
               // Preserve formatting for white spaces, etc.
               var colA = fixHTML('<h2>*  QZ Print Plugin HTML Printing  *</h2>');
               colA = colA + '<color=red>Version:</color> ' + qz.getVersion() + '<br />';
               colA = colA + '<color=red>Visit:</color> http://code.google.com/p/jzebra';
               
               // HTML image
               var colB = '<img src="' + getPath() + 'img/image_sample.png">';
                
               // Append our image (only one image can be appended per print)
	       qz.appendHTML('<html><table face="monospace" border="1px"><tr height="6cm">' + 
	       	   '<td valign="top">' + colA + '</td>' + 
                   '<td valign="top">' + colB + '</td>' + 
                   '</tr></table></html>');
	    }

            // Very important for html, uses printHTML() instead of print()
            // *Note:  monitorAppending3() still works but is too complicated and
            // outdated.  Instead create a JavaScript  function called 
            // "jzebraDoneAppending()" and handle your next steps there.
	    monitorAppending3();
      }
      
      // Fixes some html formatting for printing. Only use on text, not on tags!  Very important!
      //    1.  HTML ignores white spaces, this fixes that
      //    2.  The right quotation mark breaks PostScript print formatting
      //    3.  The hyphen/dash autoflows and breaks formatting  
      function fixHTML(html) { return html.replace(/ /g, "&nbsp;").replace(/’/g, "'").replace(/-/g,"&#8209;"); }
      
      function printToFile() {
         
         if (qz != null) {
            // Send characters/raw commands to qz using "append"
            // Hint:  Carriage Return = \r, New Line = \n, Escape Double Quotes= \"
            qz.append("A590,1600,2,3,1,1,N,\"QZ Print Plugin " + qz.getVersion() + " sample.html\"\n");
            qz.append("A590,1570,2,3,1,1,N,\"Testing the print() function\"\n");
            qz.append("P1\n");
            
            // Send characters/raw commands to file
            // Ex:  qz.printToFile("\\\\server\\printer");
            // Ex:  qz.printToFile("/home/user/test.txt");
            qz.printToFile("C:\\qz-print_test-print.txt");
	 }
	 
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
	 monitorPrinting();
      }
      
      function printToHost() {
         
         if (qz != null) {
            // Send characters/raw commands to applet using "append"
            // Hint:  Carriage Return = \r, New Line = \n, Escape Double Quotes= \"
            qz.append("A590,1600,2,3,1,1,N,\"QZ Print Plugin " + qz.getVersion() + " sample.html\"\n");
            qz.append("A590,1570,2,3,1,1,N,\"Testing the print() function\"\n");
            qz.append("P1\n");
            
            // qz.printToHost(String hostName, int portNumber);
            // qz.printToHost("192.168.254.254");   // Defaults to 9100
            qz.printToHost("192.168.1.254", 9100);
	 }
	 
         // *Note:  monitorPrinting() still works but is too complicated and
         // outdated.  Instead create a JavaScript  function called 
         // "jzebraDonePrinting()" and handle your next steps there.
	 monitorPrinting();
      }
      
      function chr(i) {
         return String.fromCharCode(i);
      }
      
      // *Note:  monitorPrinting() still works but is too complicated and
      // outdated.  Instead create a JavaScript  function called 
      // "jzebraDonePrinting()" and handle your next steps there.
      function monitorPrinting() {
	
	if (qz != null) {
	   if (!qz.isDonePrinting()) {
	      window.setTimeout('monitorPrinting()', 100);
	   } else {
	      var e = qz.getException();
	      //alert(e == null ? "Printed Successfully" : "Exception occured: " + e.getLocalizedMessage());
              qz.clearException();
	   }
	} else {
            alert("Applet not loaded1!");
        }
      }
      
      function monitorFinding() {
	
	if (qz != null) {
	   if (!qz.isDoneFinding()) {
	      window.setTimeout('monitorFinding()', 100);
	   } else {
	      var printer = qz.getPrinter();
              //alert(printer == null ? "Printer not found" : "Printer \"" + printer + "\" found");
	   }
	} else {
            alert("Applet not loaded2!");
        }
      }

      function monitorFinding2() {
	
	if (qz != null) {
	   if (!qz.isDoneFinding()) {
	      window.setTimeout('monitorFinding2()', 100);
	   } else {
              var printersCSV = qz.getPrinters();
              var printers = printersCSV.split(",");
              for (p in printers) {
                  alert(printers[p]);
              }
              
	   }
	} else {
            alert("Applet not loaded3!");
        }
      }
      
      // *Note:  monitorAppending() still works but is too complicated and
      // outdated.  Instead create a JavaScript  function called 
      // "jzebraDoneAppending()" and handle your next steps there.
      function monitorAppending() {
	
	if (qz != null) {
	   if (!qz.isDoneAppending()) {
	      window.setTimeout('monitorAppending()', 100);
	   } else {
	      qz.print(); // Don't print until all of the data has been appended
              
              // *Note:  monitorPrinting() still works but is too complicated and
              // outdated.  Instead create a JavaScript  function called 
              // "jzebraDonePrinting()" and handle your next steps there.
              monitorPrinting();
	   }
	} else {
            alert("Applet not loaded4!");
        }
      }

      // *Note:  monitorAppending2() still works but is too complicated and
      // outdated.  Instead create a JavaScript  function called 
      // "jzebraDoneAppending()" and handle your next steps there.
      function monitorAppending2() {
	
	if (qz != null) {
	   if (!qz.isDoneAppending()) {
	      window.setTimeout('monitorAppending2()', 100);
	   } else {
	      qz.printPS(); // Don't print until all of the image data has been appended
              
              // *Note:  monitorPrinting() still works but is too complicated and
              // outdated.  Instead create a JavaScript  function called 
              // "jzebraDonePrinting()" and handle your next steps there.
              monitorPrinting();
	   }
	} else {
            alert("Applet not loaded5!");
        }
      }
      
      // *Note:  monitorAppending3() still works but is too complicated and
      // outdated.  Instead create a JavaScript  function called 
      // "jzebraDoneAppending()" and handle your next steps there.
      function monitorAppending3() {
	
	if (qz != null) {
	   if (!qz.isDoneAppending()) {
	      window.setTimeout('monitorAppending3()', 100);
	   } else {
	      qz.printHTML(); // Don't print until all of the image data has been appended
              
              
              // *Note:  monitorPrinting() still works but is too complicated and
              // outdated.  Instead create a JavaScript  function called 
              // "jzebraDonePrinting()" and handle your next steps there.
              monitorPrinting();
	   }
	} else {
            alert("Applet not loaded6!");
        }
      }
      
      function useDefaultPrinter() {
         
         if (qz != null) {
            // Searches for default printer
            qz.findPrinter();
         }
         
         monitorFinding();
      }
      
      function jzebraReady() {
          // Change title to reflect version
          qz = document.getElementById('qz');
          var title = document.getElementById("title");
          if (qz != null) {
              title.innerHTML = title.innerHTML + " " + qz.getVersion();
             // document.getElementById("content").style.background = "#F0F0F0";
          }
      }
      
      /**
       * By default, jZebra prevents multiple instances of the applet's main 
       * JavaScript listener thread to start up.  This can cause problems if
       * you have jZebra loaded on multiple pages at once. 
       * 
       * The downside to this is Internet Explorer has a tendency to initilize the
       * applet multiple times, so use this setting with care.
       */
      function allowMultiple() {
          
          if (qz != null) {
              var multiple = qz.getAllowMultipleInstances();
              qz.allowMultipleInstances(!multiple);
              alert('Allowing of multiple applet instances set to "' + !multiple + '"');
          }
      }
      
      function printPage() {
           $("#content").html2canvas({ 
                canvas: hidden_screenshot,
                onrendered: function() {printBase64Image($("canvas")[0].toDataURL('image/png'));}
           });
      }
      
      function printBase64Image(base64data) {
         
      	 if (qz != null) {
               qz.findPrinter("\\{dummy printer name for listing\\}");
               while (!qz.isDoneFinding()) {
                    // Note, endless while loops are bad practice.
               }

               var printers = qz.getPrinters().split(",");
               for (i in printers) {
		    if (printers[i].indexOf("Microsoft XPS") != -1 || 
			printers[i].indexOf("PDF") != -1) {
			   qz.setPrinter(i);      
		    }	       
               }
               
               // No suitable printer found, exit
               if (qz.getPrinter() == null) {
                   alert("Could not find a suitable printer for printing an image.");
                   return;
               }

               // Optional, set up custom page size.  These only work for PostScript printing.
               // setPaperSize() must be called before setAutoSize(), setOrientation(), etc.
               qz.setPaperSize("8.5in", "11.0in");  // US Letter
               qz.setAutoSize(true);
               qz.appendImage(base64data);
	    }

            // Very important for images, uses printPS() insetad of print()
            // *Note:  monitorAppending2() still works but is too complicated and
            // outdated.  Instead create a JavaScript  function called 
            // "jzebraDoneAppending()" and handle your next steps there.
	    monitorAppending2();
      }

      function logFeatures() {
          if (document.jzebra != null) {
              
              var logging = qz.getLogPostScriptFeatures();
              qz.setLogPostScriptFeatures(!logging);
              alert('Logging of PostScript printer capabilities to console set to "' + !logging + '"');
          }
      }
   
      function useAlternatePrinting() {
          
          if (qz != null) {
              var alternate = qz.isAlternatePrinting();
              qz.useAlternatePrinting(!alternate);
              alert('Alternate CUPS printing set to "' + !alternate + '"');
          }
      }
	  
	  function listSerialPorts() {
		
                if (qz != null) {
			qz.findPorts();
            while (!qz.isDoneFindingPorts()) {} // wait
			var ports = qz.getPorts().split(",");
			for (p in ports) {
				if (p == 0) {
					document.getElementById("port_name").value = ports[p];
				}
				alert(ports[p]);
			}
		}
	  }
	  
	  function openSerialPort() {
		
                if (qz != null) {
                    qz.openPort(document.getElementById("port_name").value);
		}
	  }
          
          function closeSerialPort() {
		
                if (qz != null) {
                    qz.closePort(document.getElementById("port_name").value);
		}
	  }
          
          // Automatically gets fired with the port is finished opening (even if it fails to open)
          function jzebraDoneOpeningPort(portName) {
              
              if (qz != null) {
                  var e = qz.getException();
                  if (e != null) {
                      alert("Could not open port [" + portName + "] \n\t" + e.getLocalizedMessage());
                      qz.clearException();
                  } else {
                      alert("Port [" + portName +  "] is open!");
                  }
              }
          }
          
          // Automatically gets fired with the port is finished closing (even if it fails to close)
          function jzebraDoneClosingPort(portName) {
              
              if (qz != null) {
                  var e = qz.getException();
                  if (e != null) {
                      alert("Could not close port [" + portName + "] \n\t" + e.getLocalizedMessage());
                      qz.clearException();
                  } else {
                      alert("Port [" + portName +  "] closed!");
                  }
              }
          }
          
          function sendSerialData() {
		
                if (qz != null) {
                    // Beggining and ending patterns that signify port has responded
                    // chr(2) and chr(13) surround data on a Mettler Toledo Scale
                    qz.setSerialBegin(chr(2));
                    qz.setSerialEnd(chr(13));
                    // Baud rate, data bits, stop bits, parity, flow control
                    // "9600", "7", "1", "even", "none" = Default for Mettler Toledo Scale
                    qz.setSerialProperties("9600", "7", "1", "even", "none");
                    // Send raw commands to the specified port.
                    // W = weight on Mettler Toledo Scale
                    qz.send(document.getElementById("port_name").value, "\nW\n");
                    
                    var e = qz.getException();
                    if (e != null) {
                        alert("Could not send data:\n\t" + e.getLocalizedMessage());
                        qz.clearException();  
                    }
		}
	  }
          
          // Automatically gets called when the serial port responds with data
          function jzebraSerialReturned(portName, data) {
            if (data == null || data == "") {       // Test for blank data
                alert("No data was returned.")
            } else if (data.indexOf("?") !=-1) {    // Test for bad data
                alert("Device not ready.  Please wait.")
            } else {                                // Display good data
                alert("Port [" + portName + "] returned data:\n\t" + data);
            }
          }
		  
function BuscarCliente(e){
	var valor=$('#busquedacliente').val();
	if(e==13){
		mostrarClientes();
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
		function (tx){
			tx.executeSql('SELECT * FROM CLIENTES WHERE cedula=?;',[valor],
			function(tx,res){
				if(res.rows.length>0){
					console.log(res);
					var row=res.rows.item(0);
					entro=true;
					$('#idCliente').val(row.id);
					$('#clientID').val(row.id);
					$('#nombreP').val(row.nombre);
					$('#clientefind').html(row.nombre);
					$('#cedulaP').val(row.cedula);
					$('#telefonoP').val(row.telefono);
					$('#direccionP').val(row.direccion);
					$('#emailP').val(row.email);
					$('#payClientName').html(row.nombre);
					$('.tipoClienteP').val(1);
					if($('#insideShop').length > 0){
						continueShopping(row.id);
					}
			}});	
		},errorCB,successCB);
		
		
		
		/*var jsoncli=$('#jsonmisclientes').html();
		var misclientes=JSON.parse(jsoncli);
		for(var k in misclientes){
			for(var j in misclientes[k]){
				if(misclientes[k][j].cedula==valor){
					entro=true;
					$('#idCliente').val(misclientes[k][j].id);
					$('#clientID').val(misclientes[k][j].id);
					$('#nombreP').val(misclientes[k][j].nombre);
					$('#clientefind').html(misclientes[k][j].nombre);
					$('#cedulaP').val(misclientes[k][j].cedula);
					$('#telefonoP').val(misclientes[k][j].telefono);
					$('#direccionP').val(misclientes[k][j].direccion);
					$('#apellidoP').val(misclientes[k][j].apellido);
					$('#emailP').val(misclientes[k][j].email);
					$('.tipoClienteP').val(1);
					if($('#insideShop').length > 0){
						continueShopping(misclientes[k][j].id);
					}
					break;
				}
			}
		}*/
		/*if(entro==false)
			mostrarClientes();*/
		
		/*mostrarClientes();
		$.getJSON('../includes/cliente/ajaxCliente.php',{ id:"cedula", valor: valor }).done(function(json){
		if(json.clientes[0].data)
		{
			entro=true;
			$('#idCliente').val(json.clientes[0].id);
			$('#clientID').val(json.clientes[0].id);
			$('#nombreP').val(json.clientes[0].nombre+' '+json.clientes[0].apellido);
			$('#clientefind').html(json.clientes[0].nombre+' '+json.clientes[0].apellido);
			$('#cedulaP').val(json.clientes[0].cedula);
			$('#telefonoP').val(json.clientes[0].telefono);
			$('#direccionP').val(json.clientes[0].direccion);
			$('#apellidoP').val(json.clientes[0].apellido);
			$('#emailP').val(json.clientes[0].email);
			$('.tipoClienteP').val(1);
			if($('#insideShop').length > 0){
				continueShopping(json.clientes[0].id);
			}
			return;
		}else{
			mostrarClientes();
		}
		}).fail(function(){
			mostrarClientes();
		});*/
		
	}
}

function CambiarMetodo(cual){
	//$("#paymentCategory-"+cual).click();
	var nombre=$('#payment'+cual).attr('paymentMethod');
	var index=$('#payment'+cual).attr('idPaymentMethod');
	var idimagen=$('#paymentCategory-'+index+' .originalImage').attr('id').split('_');
	//alert(nombre);
	$('.originalImage').each(function(){
		var getImage = $(this).attr('id').split('_');
		$(this).attr('src','../../images/'+ getImage[1] +'.png');
		});

	$('#pagos_'+ nombre).attr('src', '../../images/'+idimagen[1]+'Hover.png');
	$('.textoformapago').css('color','#58595B');
	$('#forma_'+index).css('color','#FFF');
	$('.functionalityDiv').hide();
	$('#functionality-'+ index).show();
	$('.columna1 div').each(function(){
		$(this).attr('class','paymentCategories');
		$(this).css('backgroundColor','');
	});
	$('#paymentCategory-'+ index).attr('class','categoryChosen');
	var faltante=parseFloat($('#invoiceTotal').html());
	var pagado=0;
	$('.paymentMethods').each(function(){
		var partepago=0;
		if($(this).val()!=''){
			//if(nombre=='Efectivo')
				//$(this).val('0.00');
			partepago=parseFloat($(this).val());
		}
		faltante-=partepago;
		pagado+=partepago;
	});
	
	if(faltante>0){
		if($('#payment'+nombre).val()=='')
			$('#payment'+nombre).val(faltante.toFixed(2));
		else{
				if(nombre=='Efectivo')
					$('#payment'+nombre).select();
				else{
					$('#payment'+nombre).val(faltante.toFixed(2));
					$('#payment'+nombre).select();
				}
			}
			
	}
	$('#payment'+cual).select();
}

$('#cedula').parent().append('<div id="newCliente" > </div>');

function validaRucEc(cedula){

   var number = cedula;
  var dto = number.length;
  var valor;
  var acu=0;
  if(number==""){
   //alert('No has ingresado ning?n dato, porfavor ingresar los datos correspondientes.');
	  return false;
   }
  else{
   for (var i=0; i<dto; i++){
   valor = number.substring(i,i+1);
   if(valor==0||valor==1||valor==2||valor==3||valor==4||valor==5||valor==6||valor==7||valor==8||valor==9){
    acu = acu+1;
   }
   }
   if(acu==dto){
    while(number.substring(10,13)!=001){
		 return false;     
    }
    while(number.substring(0,2)>24){    
		 return false;
    }
    var porcion1 = number.substring(2,3);
    if(porcion1<6){
     //alert('El tercer d?gito es menor a 6, por lo \ntanto el usuario es una persona natural.\n');
		 return true;
    }
    else{
     if(porcion1==6){
      //alert('El tercer d?gito es igual a 6, por lo \ntanto el usuario es una entidad p?blica.\n');
		  return true;
     }
     else{
      if(porcion1==9){
       //alert('El tercer d?gito es igual a 9, por lo \ntanto el usuario es una sociedad privada.\n');
		   return true;
      }
     }
    }
   }
   else{
    return false;
   }
  }
}
	
	

function empezarClientes(){
	$('.direccion').html( " " );
	$('.tipoCliente').html( "Tipo de cliente:  "  );
	$('#cedula').val('9999999999999');
				$('#idCliente').val('1');
			$('#clientID').val('1');
	$('#cedula').attr({ maxLength : 13 });
	$('#nombre').val('Consumidor Final');
	$('#cedula').click(function(){
		if( $('#cedula').val() == "9999999999999" )
		{
			$('#cedula').val('');
		}
	});
	$('#telefono').keyup(function(event){
		//$("#telefono").val($("#cedula").val().replace(/\D/g,''));
		unEnter(event,"telefono");
	}
	);
	
	$('#cedula').keyup(function(event){
	if(!validarn(event)){
		$("#cedula").val($("#cedula").val().replace(/\D/g,''));
	}
		unEnter(event,"cedula");
		if(validaRucEc($('#cedula').val() ) == true && $('#cedula').val().length == 13 || $('#cedula').val() == "9999999999999"  )
		{
			$('#cedula').css('background-color', 'white');
			$('#cedula').effect("highlight");
			
		}else{
			if(cedula())
			{
			$('#cedula').css('background-color', 'white');
			$('#cedula').effect("highlight");
			}else{
			$('#cedula').css('background-color', 'red');
			}
		}
		
		
	
	})
	
}

var libre=false;
 function validarn(e)
 { // 1
 
tecla = (document.all) ? e.keyCode : e.which;

if ( $("#cedula").val().length == 1 && tecla ==80){ libre=true; return true;}

if( !libre)
	{
	/*  8 = BACK | 46= . | 0= tab */
			patron = /\d/;
			te = String.fromCharCode(tecla);
			if (tecla==8 || tecla==46 || tecla==0 ) 
			{
			return true;
			}else{
			return patron.test(te);
			}
	}else{
	return true;
	}
}
var entro=false;
function unEnter(e,id)
{		
		tecla = (document.all) ? e.keyCode : e.which;
		
		if (tecla==13 && $('#cedula').val().length >9 && $('#cedula').css('background-color') != 'rgb(59, 196, 218)'  )
		{
		var valor=$('#'+id).val();
		if(!$.trim(valor)) return;
		
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
		function (tx){
			tx.executeSql('SELECT * FROM CLIENTES WHERE cedula=?;',[valor],
			function(tx,res){
				if(res.rows.length>0){
					console.log(res);
					var row=res.rows.item(0);
					entro=true;
					$('#idCliente').val(row.id);
					$('#clientID').val(row.id);
					$('#nombre').val(row.nombre);
					$('#cedula').val(row.cedula);
					$('#telefono').val(row.telefono);
					$('#email').val(row.email);
					$('.direccion').html(row.direccion);
					$('.tipoCliente').html(1);
					
					if($('#insideShop').length > 0){
						continueShopping(row.id);
					}
					return;
			}});	
		},errorCB,successCB);
		/*$.getJSON('../includes/cliente/ajaxCliente.php',{ id: id , valor: valor }).done(function(json){
		
		if(json.clientes[0].data)
		{
			entro=true;
			$('#idCliente').val(json.clientes[0].id);
			$('#clientID').val(json.clientes[0].id);
			$('#nombre').val(json.clientes[0].nombre);
			$('#cedula').val(json.clientes[0].cedula);
			$('#telefono').val(json.clientes[0].telefono);
			$('.direccion').html( " " + json.clientes[0].direccion);
			$('.tipoCliente').html( "Tipo de cliente:  " + json.clientes[0].tipo  );
			
			if($('#insideShop').length > 0){
				continueShopping(json.clientes[0].id);
				}
			
			
			
			return;
		}*/

		/*}) .fail(function() {
			mostrarClientes();
		});*/
			
		}
	
	
}
function jsonNuevoCliente()
{
	var apellidoP=$('#apellidoP').val();
	
	var nacionalidad=1;//$('#nacionalidad').val();
	var cedula=$('#cedulaP').val();
	var nombreP=$('#nombreP').val();
	var tipoP=$('#tipoP').val();
	var direccionP=$('#direccionP').val();
	var telefonoP=$('#telefonoP').val();
	var email=$('#descripcionD #emailP').val();
	var sexoP=$('#sexoP').val();
	var fecha=$('#fecha').val();
	var notasP=$('#notasP').val();
	$("#cedula").val( cedula );
	$("#nombre").val( nombreP + " " + apellidoP );
	$("#telefono").val( telefonoP );
	$(".direccion").html( direccionP );
	$("#tipoCliente").html( tipoP );

	
	
	// alert("Ana"+nombreP+'-'+cedula);
	
	if( !nombreP) return; if( !cedula) return;
	//console.log(email);
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		tx.executeSql('SELECT id FROM CLIENTES WHERE cedula=?;',[cedula],
		function(tx,res){
			if(res.rows.length>0){
				tx.executeSql('UPDATE CLIENTES SET nombre=?,direccion=?, telefono=?, email=? WHERE cedula=?;',[nombreP,direccionP,telefonoP,email,cedula],
				function(tx,res2){
					console.log("Cliente Actualizado!");
					$('#idCliente').val(res.rows.item(0).id);
					$("#clientefind").html(nombreP);
					$("#newCliente").fadeOut();
				});	
			}else{
				tx.executeSql('INSERT INTO CLIENTES (nombre,direccion,cedula,telefono,email,existe) VALUES (?,?,?,?,?,?)',[nombreP,direccionP,cedula,telefonoP,email,0],
				function(tx,res3){
					console.log(res3.insertId);
					$('#idCliente').val(res3.insertId);
					$("#clientefind").html(nombreP);
					$("#newCliente").fadeOut();
				});	
			}
			
		});				
	},errorCB,successCB);
	
	/*$.post("../includes/cliente/addCliente.php",{ apellidoP : apellidoP ,  nacionalidad : nacionalidad , cedula : cedula , nombreP : nombreP  , tipoP : tipoP , direccionP  : direccionP , telefonoP : telefonoP , email : email , sexoP : sexoP , fecha : fecha , notas : notasP   }).done(function(data){*/
	/*var exp =data.split('|');
	if(exp[0] == "true")
	{
		//alert(data);
		noCliente();
	}else{
	alert("Error " + data);
	}*/
	/*if(data=='ok'){
		alert("Datos Actualizados!");
		$("#clientefind").html(nombreP+' '+apellidoP);
	}
	else
		alert("Ha ocurrido un error.");
	noCliente();
	});*/


}
function noCliente()
{
	$("#cuadroClientes").fadeOut("fast",function(){$(this).remove();});


}

function mostrarClientes(){
//$('#borrable').remove();
	if($("#cuadroClientes").length){
		$("#cuadroClientes").fadeIn();
	}else{
		if($("#opaco").css('display')== "none"){
			$("#opaco").fadeIn();
		}
		$("#newCliente ").html('\
			<div style="position:relative; left:20%; width:100%;" id="borrable">\
				<div id="cuadroClientes" class="cuadroClientes" style="display:none;"> \
					<div style="background:linear-gradient(to bottom, #EF4331 0%, #BD222F 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);height: 40px;color: #FFFFFF;font-size: 20px;line-height: 40px;">\
						Cliente\
					</div> \
					<div style="position:relative;">\
						<label class="equisPop" onclick="noCliente();" style="position:absolute; right:1%; top:-30px; color:red; cursor:pointer;" >\
							<img src="images/xcierre.png" width="22" height="22" style="border: 0" alt="">\
						</label> \
					</div>\
					<table id="descripcionD" width="100%" > \
						<tr> \
							<td colspan=2>\
								<br><br>\
									<table cellpadding="0" cellspacing="0" width="70%" style="position: relative;margin: 0px auto;">\
										<tr>\
											<td width="10%" class="camposcolor">\
												<img src="images/imgcedula.png" width="13" style="border: 0;" alt="">\
													&nbsp;Cédula* \
											</td>\
												<td class="valorcolor">\
													<input tabindex="0" id="cedulaP" value="9999999999" style="width:100%;" class="valor" /> \
												</td>\
										</tr>\
										<tr>\
											<td width="20%" class="camposcolor">\
												<img src="images/user.png" width="13" style="border: 0;" alt="">\
													&nbsp;Nombre*\
											</td>\
											<td width="70%" class="valorcolor">\
												<input  tabindex="1" id="nombreP" style="width:100%;" class="valor"/>\
											</td>\
										</tr>\
										\
										<tr>\
												<td width="20%" class="camposcolor">\
													<img src="images/imgtelefono.png" style="border: 0;" alt="">\
													&nbsp;Teléfono\
												</td>\
												<td width="70%" class="valorcolor">\
													<input tabindex="3" style="width:100%;" id="telefonoP" class="valor"/>\
												</td>\
										</tr>\
										<tr>\
												<td width="20%" class="camposcolor">\
													<img src="images/imgdireccion.png" style="border:0;" alt="">&nbsp;Dirección\
												</td>\
												<td width="70%" class="valorcolor">\
													<input tabindex="4" style="width:100%;" id="direccionP" class="valor"/> \
												</td>\
										</tr>\
										<tr>\
												<td width="20%" class="camposcolor">\
													<img src="images/imgemal.png" width="13" style="border: 0;" alt="">\
													&nbsp;Email\
												</td>\
												<td width="70%" class="valorcolor">\
													<input tabindex="5" id="emailP" style="width:100%;" class="valor"/>\
												</td>\
										</tr>\
										\
									</table>\
									\
									<br>\
							</td>\
						</tr>\
						<tr>\
							<td colspan=2>\
								<br>\
								<div style="background-color: #E0DEDE; width: 101%;position: relative;margin-left: -4px;height: 100px;">\
									<table style="cursor:pointer;position: relative; margin: 0px auto;" cellspacing="5px">\
										<tr>\
											<td style="vertical-align: top;">\
												<div tabindex="7" style="margin-top:0px; height:34px; width:150px; line-height: 1;" class="actiongreenbutton" onclick="jsonNuevoCliente()">Guardar</div> \
											</td>\
											<td onclick="noCliente(1);" style="vertical-align:top;">\
												<div tabindex="8" style="width: 125px; margin-top:0px; line-height: 1;" class="actionredbutton">Cancelar</div> \
											</td>\
										</tr>\
									</table>\
								</div>\
							</td>\
						</tr>\
					</table>\
				</div>\
			<input type="hidden" id="idCliente" value="1"/></div>\
			<style>\
				#descripcionD tr td table tr td{\
					text-align:left;font-size:13px;height:25px;\
				}\
			</style>');
			$('.direccion').html( " " );
			$('.tipoCliente').html( "Tipo de cliente:  "  );
				$('#cedulaP').val('9999999999999');
				$('#idCliente').val('1');
			$('#clientID').val('1');
			$('#cedulaP').attr({ maxLength : 13 });
			$('#nombre').val('Consumidor Final');
			$('#cedulaP').click(function(){
				$(this).select();
			});
	$('#telefono').keyup(function(event){
		//$("#telefono").val($("#cedula").val().replace(/\D/g,''));
		//unEnter(event,"telefono");
	}
	);
	$('#cedulaP').change(function(){
		if($('#nombreP').length==0){
			$('#busquedacliente').val('9999999999999');
			$('#clientefind').html("Consumidor Final");
			BuscarCliente(13);
		}
	});	
	$('#cedulaP').keyup(function(event){
		$('#clientefind').html('');
		$('#idCliente').val('0');
		var idcli=$(this).val();
		if(idcli.length==10){
			$('#busquedacliente').val(idcli);
			$('#clientefind').html('');
			$('#cedulaP').css('background-color', 'white');
			$('#cedulaP').effect("highlight");
			BuscarCliente(13);
		}else if($(this).val().length==13){
			$('#busquedacliente').val(idcli);
			$('#cedulaP').css('background-color', 'white');
			$('#cedulaP').effect("highlight");
			$('#clientefind').html('');
			BuscarCliente(13);
		}else if(idcli.length==0){
			$('#clientefind').html('');
			$('#busquedacliente').val('9999999999999');
			BuscarCliente(13);
		}else{
			/*$('#cuadroClientes input').each(function(){
				if($(this).attr('id')!='cedulaP')
					$(this).val('')
				}
			);*/
		}
	});
	}
}

function cedula () {
numero = document.getElementById("cedula").value; 
var suma = 0;
var residuo = 0;
var pri = false;
var pub = false;
var nat = false;
var numeroProvincias = 24;
var modulo = 11;

/* Verifico que el campo no contenga letras */
var ok=1;
/* Aqui almacenamos los digitos de la cedula en variables. */
d1 = numero.substr(0,1);
d2 = numero.substr(1,1);
d3 = numero.substr(2,1);
d4 = numero.substr(3,1);
d5 = numero.substr(4,1);
d6 = numero.substr(5,1);
d7 = numero.substr(6,1);
d8 = numero.substr(7,1);
d9 = numero.substr(8,1);
d10 = numero.substr(9,1);

/* El tercer digito es: */
/* 9 para sociedades privadas y extranjeros */
/* 6 para sociedades publicas */
/* menor que 6 (0,1,2,3,4,5) para personas naturales */

if (d3==7 || d3==8){
console.log('El tercer d?gito ingresado es inv?lido');
return false;
}

/* Solo para personas naturales (modulo 10) */
if (d3 < 6){
nat = true;
p1 = d1 * 2; if (p1 >= 10) p1 -= 9;
p2 = d2 * 1; if (p2 >= 10) p2 -= 9;
p3 = d3 * 2; if (p3 >= 10) p3 -= 9;
p4 = d4 * 1; if (p4 >= 10) p4 -= 9;
p5 = d5 * 2; if (p5 >= 10) p5 -= 9;
p6 = d6 * 1; if (p6 >= 10) p6 -= 9;
p7 = d7 * 2; if (p7 >= 10) p7 -= 9;
p8 = d8 * 1; if (p8 >= 10) p8 -= 9;
p9 = d9 * 2; if (p9 >= 10) p9 -= 9;
modulo = 10;
}

/* Solo para sociedades publicas (modulo 11) */
/* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
else if(d3 == 6){
pub = true;
p1 = d1 * 3;
p2 = d2 * 2;
p3 = d3 * 7;
p4 = d4 * 6;
p5 = d5 * 5;
p6 = d6 * 4;
p7 = d7 * 3;
p8 = d8 * 2;
p9 = 0;
}

/* Solo para entidades privadas (modulo 11) */
else if(d3 == 9) {
pri = true;
p1 = d1 * 4;
p2 = d2 * 3;
p3 = d3 * 2;
p4 = d4 * 7;
p5 = d5 * 6;
p6 = d6 * 5;
p7 = d7 * 4;
p8 = d8 * 3;
p9 = d9 * 2;
}

suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
residuo = suma % modulo;

/* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
digitoVerificador = residuo==0 ? 0: modulo - residuo;

/* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/
if (pub==true){
if (digitoVerificador != d9){
console.log('El ruc de la empresa del sector p?blico es incorrecto.');
return false;
}
/* El ruc de las empresas del sector publico terminan con 0001*/
if ( numero.substr(9,4) != '0001' ){
console.log('El ruc de la empresa del sector p?blico debe terminar con 0001');
return false;
}
}
else if(pri == true){
if (digitoVerificador != d10){
console.log('El ruc de la empresa del sector privado es incorrecto.');
return false;
}
if ( numero.substr(10,3) != '001' ){
console.log('El ruc de la empresa del sector privado debe terminar con 001');
return false;
}
}

else if(nat == true){
if (digitoVerificador != d10){
console.log('El n?mero de c?dula de la persona natural es incorrecto.');
return false;
}
if (numero.length >10 && numero.substr(10,3) != '001' ){
console.log('El ruc de la persona natural debe terminar con 001');
return false;
}
}
return true;
}

/*function BuscarCliente(e){
	var valor=$('#busquedacliente').val();
	if(e==13){
		mostrarClientes();
		$.getJSON('../includes/cliente/ajaxCliente.php',{ id:"cedula", valor: valor }).done(function(json){
		if(json.clientes[0].data)
		{
			entro=true;
			$('#idCliente').val(json.clientes[0].id);
			$('#clientID').val(json.clientes[0].id);
			$('#nombreP').val(json.clientes[0].nombre+' '+json.clientes[0].apellido);
			$('#clientefind').html(json.clientes[0].nombre+' '+json.clientes[0].apellido);
			$('#cedulaP').val(json.clientes[0].cedula);
			$('#telefonoP').val(json.clientes[0].telefono);
			$('#direccionP').val(json.clientes[0].direccion);
			$('#apellidoP').val(json.clientes[0].apellido);
			$('#emailP').val(json.clientes[0].email);
			$('.tipoClienteP').val(1);
			if($('#insideShop').length > 0){
				continueShopping(json.clientes[0].id);
			}
			return;
		}else{
			mostrarClientes();
		}
		}).fail(function(){
			mostrarClientes();
		});
		
	}
}*/