<?php

	$filename = '../results.csv';
	$data = [];

	// open the file
	$f = fopen($filename, 'r');

	if ($f === false) {
		http_response_code(500);
		die('Cannot open the file ' . $filename);
	}

	// read each line in CSV file at a time
	while (($row = fgetcsv($f, 0, ';')) !== false) {
		$data[] = $row;
	}

	// close the file
	fclose($f);

	echo json_encode(['data'=> $data]);

?>