<?php
session_start();
include('../../../dbconn.php');

$type = "SELECT * FROM formulados_tipo WHERE activo='TRUE' ORDER BY id ASC";
$json = '{Productos:[';
$tipo = 0;
$typeResult = pg_query($type) or die (pg_last_error());
	while($typeRow = pg_fetch_array($typeResult)){
		$innerJson = '';
		$json .= '{"Tipo'.$typeRow['id'].'":[';
		
		$sql = "SELECT f.id AS id,f.formulado AS formulado,p.id AS formpriceid, p.id_formulado,p.p1 AS price,p.codigo AS code, f.id_formulado_tipo AS typeid
						FROM formulados f
						INNER JOIN formulados_precios p ON f.id=p.id_formulado
						WHERE f.esproductofinal='TRUE' AND f.id_formulado_tipo='{$typeRow['id']}' AND f.activo='TRUE'
						ORDER BY f.id_formulado_tipo ASC";
		
		$result = pg_query($sql) or die (pg_last_error());
			while($row = pg_fetch_array($result)){
				$taxQuery = "SELECT fi.id_formulado, fi.id_impuesto, i.id, i.valor, i.nombre FROM formulados_impuestos fi
							LEFT JOIN impuestos i ON fi.id_impuesto=i.id
							WHERE fi.id_formulado='{$row['id']}'";
				$taxResult = pg_query($taxQuery) or die (pg_last_error());
				
					if(pg_num_rows($taxResult) == 0){
						$tax = 0;
						$taxID = 0;
						}
					else{
						if(pg_num_rows($taxResult) > 1){
							$tax = '';
							$taxID = '';
							while($taxRow = pg_fetch_array($taxResult)){
								$tax .= $taxRow['valor'].'@';
								$taxID .= $taxRow['id'].'@';
								}
							}
						else{
							$taxRow = pg_fetch_array($taxResult);
							$tax = $taxRow['valor'];
							$taxID = $taxRow['id'];
							}
						}
						
					if($taxID == '' || $taxID == null){
						$taxID = 0;
						}
						
					if(strpos($tax,'@') !== false){
						$tax = substr($tax,0,-1);
						}
						
					if(strpos($taxID,'@') !== false){
						$taxID = substr($taxID,0,-1);
						}
						
				$innerJson .= '{"formulado_id" : "'.$row['id'].'", "formulado_tipo" : "'.$row['typeid'].'", "formulado_nombre" : "'.$row['formulado'].'", "formulado_codigo" : "'.$row['code'].'", "formulado_precio" : "'.$row['price'].'", "formulado_precio_id" : "'.$formpriceid.'", "formulado_impuestos" : "'.$tax.'", "formulado_tax_id" : "'.$taxID.'"},';
				}
			$json .= substr($innerJson,0,-1).']},';
		}
		
	$jsonOutput .= substr($json,0,-1).']}';
	echo $jsonOutput;
?>