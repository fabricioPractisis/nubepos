<?php
	session_start();
	error_reporting(E_ALL); 
	ini_set("display_errors", 1); 
	$dbname="emp".$_SESSION['clave'];
	include "../../../../../enoc.php";
	$arrayformas=array();
	$queryformaspago=pg_query("SELECT * FROM  forma_pago where activo='true'")or die(pg_last_error());
?>
<style>
	.divcierre{	
	width:60%;
	padding:0px;
	text-align:center;
	background-color:#FFF;
	color:#404041;
	font-size:12px;
	margin-left:auto;
	margin-right:auto;
	margin-top:50px;
	-webkit-box-shadow:4px 4px 3px 0px rgba(181, 181, 181, 0.75);
	-moz-box-shadow:4px 4px 3px 0px rgba(181, 181, 181, 0.75);
	box-shadow:4px 4px 3px 0px rgba(181, 181, 181, 0.75);
}
.totales{
	border:none;
	font-size:24px;
	font-weight:bold;
	color:#404041;
	background-color:transparent;
	max-width:180px;
}
.buttons{
	background: #fdfaf9;
	background: -moz-linear-gradient(top,  #fdfaf9 0%, #dcdcdc 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fdfaf9), color-stop(100%,#dcdcdc));
	background: -webkit-linear-gradient(top,  #fdfaf9 0%,#dcdcdc 100%);
	background: -o-linear-gradient(top,  #fdfaf9 0%,#dcdcdc 100%);
	background: -ms-linear-gradient(top,  #fdfaf9 0%,#dcdcdc 100%);
	background: linear-gradient(to bottom,  #fdfaf9 0%,#dcdcdc 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fdfaf9', endColorstr='#dcdcdc',GradientType=0 );
	padding: 4px;
	height: 30px;
	width: 130px;
	line-height: 2;
	cursor: pointer;
}
	
.buttonsHover{
	background: #fffefe;
	background: -moz-linear-gradient(top,  #fffefe 0%, #e8e8e8 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#fffefe), color-stop(100%,#e8e8e8));
	background: -webkit-linear-gradient(top,  #fffefe 0%,#e8e8e8 100%);
	background: -o-linear-gradient(top,  #fffefe 0%,#e8e8e8 100%);
	background: -ms-linear-gradient(top,  #fffefe 0%,#e8e8e8 100%);
	background: linear-gradient(to bottom,  #fffefe 0%,#e8e8e8 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fffefe', endColorstr='#e8e8e8',GradientType=0 );
	padding: 4px;
	height: 30px;
	width: 130px;
	line-height: 2;
	cursor: pointer;
	}
	
.buttonsSelected{
	background: linear-gradient(to bottom, #E5FFF5 0%, #CCE2E5 100%) repeat scroll 0 0 rgba(0, 0, 0, 0);
	padding: 4px;
	height: 30px;
	width: 130px;
	line-height: 2;
	cursor: pointer;
}

</style>
<div class='divcierre' style='position:relative;'>
	<h3 class='header' style='padding-top:5px;'>Cierre de Caja</h3>
	<img src='../../images/xcierre.png' style='cursor:pointer;  position:absolute; right:5px; top:2px;' onclick='$("#ModuloCierre").hide();'/>
	<table cellspacing='0px' cellpadding='0px' width='100%'>
	<tr><td valign='top' width='18%'>
		<table cellpadding='0px' cellspacing='0px' width='100%' id='menu'>
			<?php
				$otrasformas='';
				$c=0;
				while($formas=pg_fetch_array($queryformaspago)){
					$arrayformas[$formas['id']]=$formas['formapago'];
					if($c>0){
						echo "<tr><td><div id='btnforma$formas[id]' class='buttons' onclick='Desplazar($formas[id]);' style='text-align:left;'>$formas[formapago]</div></td></tr>";
						$otrasformas.="<div id='forma".$formas['id']."' style='position:absolute; top:0px; left:-1000px; width:100%;' class='divformas'>
							<br/><br/>
							<table align='center' cellspacing='0px' cellpadding='0px'><tr><td align='right'><div class='labelgris' style='width:180px; height:27px; font-size:18px;' id='labelgris'>Valor $formas[formapago] USD. </div></td><td><input class='valor' elemento='subtotales' type='number' style='width:180px; text-align:right; font-size:20px; height:25px; padding-right:10px;' value='0.00' onchange='ColocarDivSub($formas[id]);' id='inputforma$formas[id]' formapago='$formas[id]' min='0' onkeypress='soloNumerost(event);'/></td></tr>
							</table>
							<br/>
							<div align='center'>
							<div class='actionredbutton' style='width:70px; min-height:10px; padding:5px;' onclick='Desplazar(0);'>Ver Totales</div>
							</div>
						</div>";
					}
					else{
						$idformap=$formas['id'];
						echo "<tr><td><div class='buttonsSelected  buttons' id='btnforma$formas[id]' onclick='Desplazar($formas[id]);' style='text-align:left;'>$formas[formapago]</div></td></tr>";
					}
					$c++;
				}
			?>
			<tr><td height='50px'><!--<div id='btnforma0' class='buttons' onclick='Desplazar(0);' style='color:#808284; font-weight:bold;  font-size:14px;'>Totales</div>--></td></tr>
		</table>
	</td>
	<td valign='top' style='position:relative; overflow:hidden;'>
		<div id='forma<?php echo $idformap;?>' style='position:absolute; top:0px; left:0px; width:100%;' class='divformas'>
			<br/>
			<table width='75%' cellspacing='10px' cellpadding='0px' align='center'>
			<tr>
			<?php
				$tds='';
				$q3="SELECT * FROM monedas_denominaciones where activo order by orden";
				$query3=pg_query($q3) or die("error3|" .$q3);
				$tds.="";
				$cont=0;
				$qCont= pg_query("SELECT * FROM monedas_denominaciones");
				$cuantasMonedas=0;
				$inputmonedas='';
				while($rowCont=pg_fetch_array($qCont)){$cuantasMonedas++;}
				while($row2=pg_fetch_array($query3))
				{
						//$clase='impar';
						if($cont%6==0)
							$tds.="</tr><tr>";
						$style='color:#DBDCDE;';
						if($cont==0){
							$primeramoneda=$row2['nombre'];
							$primerden=$row2['valor'];
							$primerid=$row2['id'];
							$style='color:#FFF;';
						}
							
						$tds .= "<td style='position:relative;'><div id='btnden$row2[id]' class='actiongreenbutton' style='min-width:60px; min-height:10px; font-size:14px; font-weight:bold; padding-top:20px; $style' onclick='ElegirDenominacion($row2[id]);'>$row2[nombre]</div>
						<label style='position:absolute; top:2px; right:5px; color:#CCC; font-weight:bold;' id='n$row2[id]' monto='$row2[valor]' class='labelmonedas'>0</label>
						</td>";
						$cont++;
				}
				echo $tds;
			?>
			</tr>
			</table>
			<br/>
			<table align='center' cellspacing='0px' cellpadding='0px'><tr><td align='right'><div class='labelgris' style='width:180px; height:27px; font-size:18px;' id='labelgris'>Cantidad <?php echo $primeramoneda;?></div></td><td><input class='valor' type='number' min='0' onkeypress='soloNumerost(event);' style='width:180px; text-align:right; font-size:20px; height:25px; padding-right:10px;' value='0' id='nmonedas' den='<?php echo $primerden;?>' idden='<?php echo $primerid;?>' onchange='ColocarCantidad();'/></td></tr>
			</table>
			<br/>
			<div style='font-size:20px; font-weight:bold; text-align:center;'> Total Efectivo: $ <input id='totalEfectivo' class='totalesc' value='0.00' elemento='subtotales' formapago='<?php echo $idformap;?>' style='width:150px; border:none; font-size:20px; font-weight:bold;'/></div>
			<br/>
			<div align='center'>
			<div class='actionredbutton' style='width:70px; min-height:10px; padding:5px;' onclick='Desplazar(0);'>Ver Totales</div>
			</div>
			<br/>
		</div>
		<?php echo $otrasformas;?>
		<div id='forma0' style='position:absolute; top:0px; left:-1000px; width:100%;' class='divformas'>
		<br/>
			<table align='center' width='40%' cellpadding='0px' cellspacing='0px'>
				<tr class='tablaenc'><td><b>Forma Pago</b></td><td align='right' style='padding-right:10px;'><b>Valor</b></td></tr>
				<?php
					$c=0;
					foreach($arrayformas as $k=>$value){
						$class='impar';
						if($c%2==0)
							$class='par';
						echo "<tr class='$class'><td align='center' width='50%' style='padding:3px;'>$value</td><td align='right' style='padding-right:10px;' id='subtotal$k'>0.00</td></tr>";
						$c++;
					}
				?>
			</table>
			<br/>
			<div style='font-size:20px; font-weight:bold; text-align:center;'> Total USD <span id='totalCierre' class='totalesc'>0.00</span></div>
			<br/>
			<div align='center'>
			<div class='actionredbutton' style='min-height:20px;' onclick='CerrarCaja();'>Cerrar Caja</div>
			</div>
		</div>
	</td></tr></table>
</div>
<script>
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
</script>