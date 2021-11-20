<?php

  $path = '../assets/audio/tracks/';

  // get the posted name.
  $name = $_POST['name'];
  // get the files.
  $files = $_FILES['file'];
  
  // if files and name are set
  if (!isset($files) || empty($files) || !isset($name) || empty($name)) {
    echo json_encode(false);
    return;
  }
  $count = count($files['name']);

  // if folder does not exist, create it
  if(!file_exists($path . $count)) {
    if(!mkdir($path . $count)) {
      echo json_encode(false);
      return;
    }
  }
  $path .= $count . '/';

  // for each file
  for ($i = 1; $i <= $count; $i++) {
    if(!move_uploaded_file($files["tmp_name"][$i - 1], $path . $i . '_' . $name)) {
      echo json_encode(false);
      return;
    }
  }

  echo json_encode(true);
  return;

?>