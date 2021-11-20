<?php

  $path = '../assets/audio/tracks/';

  // get the posted track data.
  $track = file_get_contents("php://input");

  // if track is set
  if (!isset($track) || empty($track)) {
    echo json_encode(false);
    return;
  }

  $track = json_decode($track);

  // instruments folder
  $path .= $track->rows . '/';

  // for each instruments
  for ($i = 1; $i <= $track->rows; $i++) {
    // if the audio file exists
    $filename = $path . $i . '_' . $track->trackname;
    if (file_exists($filename)) {
      // deleting the file
      if(!unlink($filename)) {
        echo json_encode(false);
        return;
      }
    }
  }

  echo json_encode(true);
  return;

?>