<?php
	$host = "162.242.162.119";
	$user2 = "practisis3";
	$pass = "Zuleta99@251!";
	try {
        $gbd = new PDO("pgsql:dbname=$dbname;host=$host",$user2,$pass);
    } catch(PDOException $e){
        print "<p>Error: No puede conectarse con la base de datos.</p>\n";
        print "<p>Error: " . $e->getMessage() . "</p>\n";
    }
?>