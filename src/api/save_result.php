<?php


  // Get the posted data.
  $postdata = file_get_contents("php://input");
  $filename = '../results.csv';
  $date = new DateTime();

  if(isset($postdata) && !empty($postdata))
  {
    // Extract the data.
    $request = json_decode($postdata);

    $exist = file_exists($filename);

    // open csv file for writing
    $f = fopen($filename, 'a');

    if ($f === false) {
      http_response_code(500);
      die('Error opening the file ' . $filename);
    }

    if (!$exist) {
      fputcsv($f, [
        'email', 
        'age', 
        'statut',
        'experience',
        'apprentissage',
        'instruments',
        'pratique',
        'nb_pieces',
        'nb_instruments',
        'reference_disponible',
        'slider_individuel',
        'date',
        'audio',
        'score',
        'temps',
        'ordre_piece_origine',
        'ordre_piece_reponse',
      ], ';');
    }

    fputcsv($f, [
      $request->form->email, 
      $request->form->age, 
      $request->form->status,
      $request->form->experience,
      $request->form->learning,
      $request->form->instruments,
      $request->form->practice,
      $request->difficulty->nb_pieces,
      $request->difficulty->nb_instruments,
      $request->difficulty->available_solution ? 'oui' : 'non',
      $request->difficulty->pieces_slider ? 'oui' : 'non',
      $date->format('Y-m-d H:i:s'),
      $request->result->audio,
      $request->result->score,
      $request->result->duration,
      json_encode($request->result->order_init),
      json_encode($request->result->order_response),
    ], ';');

    // close the file
    fclose($f);
  }
?>