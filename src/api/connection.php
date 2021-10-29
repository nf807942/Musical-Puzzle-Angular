<?php


  // Get the posted data.
  $postdata = file_get_contents("php://input");

  $filename = '../password';

	// open the file
	$f = fopen($filename, 'r');

  // read the file
  $hash = fread($f, filesize($filename));

	// close the file
	fclose($f);

  echo json_encode(['data'=> $hash == md5($postdata)]);
?>