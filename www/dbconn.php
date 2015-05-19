<?php
if(!isset($_SESSION)){
	session_start();
	
}
include('enoc_con.php');
//$sessDB = $_SESSION['db_name'];
$sessDB = "emp288";
$bd_usuario = "794";
$bd_password = "123456";
$conexion = pg_connect("host=".$bd_host." dbname=".$sessDB." user=".$bd_usuario." password=".$bd_password) or die ("Fallo en el establecimiento de la conexi&oacute;n");
?>