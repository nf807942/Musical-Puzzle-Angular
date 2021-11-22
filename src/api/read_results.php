<?php

	$filename = '../results.csv';
	$data = [];

	// open the file
	$f = fopen($filename, 'r');

	if ($f === false) {
		echo json_encode(['data'=> $data]);
		return;
	}

	// read each line in CSV file at a time
	while (($row = fgetcsv($f, 0, ';')) !== false) {
		$data[] = $row;
	}

	// close the file
	fclose($f);

	echo json_encode(['data'=> $data]);

?>