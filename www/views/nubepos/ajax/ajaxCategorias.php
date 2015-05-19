<?php
session_start();
include('../../../dbconn.php');

$json = '{"Categorias":[';

$sql = "SELECT t.* FROM formulados_tipo t,formulados f WHERE t.activo='TRUE' and (select count(id) from formulados where activo and id_formulado_tipo=t.id)>0 group by t.id ORDER BY formulado_tipo ASC";
$result = pg_query($sql) or die (pg_last_error());
	
	while($row = pg_fetch_array($result)){
		$json .= '{"categoria_id" : '.$row['id'].', "categoria_nombre" : "'.$row['formulado_tipo'].'"},';
	}
		
$jsonOutput .= substr($json,0,-1).']}';
echo $jsonOutput;
?>