<?php
session_start();
$arraydata=array();
error_reporting(E_ALL);
ini_set('display_errors', '1');
$dbname="administrador_practisis";
include "../enoc_pdo.php";
$sentencia = $gbd->prepare("SELECT empresa FROM empresas where id=".$_SESSION['clave']." order by id");
if ($sentencia->execute()){
	if($fila = $sentencia->fetch()){
		$empresa=array("nombre"=>$fila['empresa'],"num"=>$_SESSION['clave']);
		$arraydata['empresa']=$empresa;
	}
}

/*datos dde los productos y categorias*/
$dbname="emp".$_SESSION['clave'];
include "../enoc_pdo.php";
$miscategorias="{".'"Categorias"'.":[";
$sentencia = $gbd->prepare("SELECT ft.* from formulados_tipo ft,formulados f where f.id_formulado_tipo=ft.id and ft.activo group by ft.id order by ft.formulado_tipo asc");
$misproductos="{Productos:[";
if ($sentencia->execute()){
	$cont=0;
	while($fila = $sentencia->fetch()){
		if($cont>0){
			$misproductos.=",";
			$miscategorias.=",";
		}
		$miscategorias.='{"categoria_id":"'.$fila['id'].'","categoria_nombre":"'.$fila['formulado_tipo'].'"}';
		$misproductos.='{"Tipo'.$fila['id'].'":[';
		/*datos del producto*/
		$sentencia2=$gbd->prepare("SELECT f.id,f.formulado,f.codigo,f.esmateriaprima,fp.p1 as precio from formulados f,formulados_precios fp
		where f.id_formulado_tipo='".$fila['id']."' and f.id=fp.id_formulado and f.activo and f.esproductofinal");
		$cont2=0;
		if($sentencia2->execute()){
			while($data=$sentencia2->fetch()){
				if($cont2>0)
					$misproductos.=',';
				/*query de impuestos por producto*/
				$sentencia3=$gbd->prepare("select fi.id_impuesto,i.valor as valor from formulados_impuestos fi,impuestos i where fi.id_formulado='$data[id]' and i.activo and i.id=fi.id_impuesto");
				$cadimp='';
				$cadimpid='';
				if($sentencia3->execute()){
					$c=0;
					while($impdata=$sentencia3->fetch()){
						if($c>0){
							$cadimp.="|";
							$cadimpid.="|";
						}
						$cadimp.=$impdata['valor'];
						$cadimpid.=$impdata['id_impuesto'];
						$c++;
					}
				}
				/**/
				$misproductos.='{"formulado_id":'.$data['id'].',"formulado_tipo":"'.$fila['id'].'","formulado_nombre":"'.$data['formulado'].'","formulado_codigo":"'.$data['codigo'].'","formulado_precio":"'.$data['precio'].'","formulado_impuestos":"'.$cadimp.'","formulado_tax_id":"'.$cadimpid.'","formulado_matprima":"'.$data['esmateriaprima'].'"}';
				$cont2++;
			}
		}
		$misproductos.=']}';
		$cont++;
	}
}
$misproductos.="]}";
$miscategorias.="]}";
/**/

/*datos de las formas de pago*/
$misformaspago='{"FormaPago":[';
$sentencia=$gbd->prepare("select id,formapago,imagen from forma_pago where activo order by orden asc");
if($sentencia->execute()){
	$t=0;
	while($data=$sentencia->fetch()){
		if($t>0)
			$misformaspago.=',';
		$misformaspago.='{"id":"'.$data['id'].'","nombre":"'.$data['formapago'].'","imagen":"'.$data['imagen'].'"}';
		$t++;
	}
}
$misformaspago=']}';
/**/

/*datos de mis clientes*/
$misclientes='{"Clientes":[';
$sentencia=$gbd->prepare("select id,nombre,apellido,cedula,telefono,direccion,email from clientes where activo order by id asc");
if($sentencia->execute()){
	$t=0;
	while($data=$sentencia->fetch()){
		if($t>0)
			$misclientes.=',';
		$misclientes.='{"id":"'.$data['id'].'","nombre":"'.$data['apellido'].' '.$data['nombre'].'","cedula":"'.$data['cedula'].'","telefono":"'.$data['telefono'].'","direccion":"'.$data['direccion'].'","email":"'.$data['email'].'"}';
		$t++;
	}
}
$misclientes.="]}";
/**/

/*datos de caja*/
$micaja='{"caja":[';
$sentencia=$gbd->prepare("SELECT * FROM cajas WHERE activo='true' order by id DESC");
if($sentencia->execute()){
	$t=0;
	if($data=$sentencia->fetch()){
		if($t>0)
			$micaja.=',';
		$micaja.='{"idCaja":"'.$data['id'].'","open":"1"}';
		$t++;
	}
}
$micaja.=']}';
/**/

$arraydata['productos']=$misproductos;
$arraydata['categorias']=$miscategorias;
$arraydata['formaspago']=$misformaspago;
$arraydata['clientes']=$misclientes;
$arraydata['cajas']=$micaja;
//echo $micaja;
$respuesta=json_encode($arraydata);
echo $respuesta;
?>