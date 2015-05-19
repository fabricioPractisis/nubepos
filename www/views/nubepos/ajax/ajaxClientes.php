<?php
session_start();
include('../../dbconn.php');
$cadenaclientes='';
$cont=0;
$querycliente=pg_query("SELECT cedula FROM clientes where promotor='FALSE' and activo='TRUE' and cedula!='' ORDER BY id ASC")or die(pg_last_error());
while($cliente=pg_fetch_array($querycliente)){
	if($cont>0)
		$cadenacliente.='|';
	$cadenacliente.=$cliente['cedula'];
	$cont++;
}
echo $cadenacliente;
?>