<?php
session_start();
include('../../../dbconn.php');

$sql = "SELECT * FROM impuestos ORDER BY id ASC";
$result = pg_query($sql) or die (pg_last_error());

	while($row = pg_fetch_array($result)){
		echo '<input type="text" id="impuesto-'.$row['id'].'" value="'.$row['id'].'|'.$row['nombre'].'|'.$row['valor'].'"/>';
		}
?>