<?php

  $filename = '../assets/config/config.json';

  // get the config data.
  $config = file_get_contents("php://input");

  // if posted data is set and config file exist and is writable
  if (!isset($config) || empty($config) || !file_exists($filename) || !is_writable($filename)) {
    echo json_encode(false);
    return;
  }

  // opening the file
  if (!$f = fopen($filename, 'w')) {
    echo json_encode(false);
    return;
  }

  // beautify the json
  $config = json_encode(json_decode($config), JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);

  // writing the new configs
  if (fwrite($f, $config) === false) {
    fclose($f);
    echo json_encode(false);
    return;
  }

  // close the file
  fclose($f);

  echo json_encode(true);
  return;

?>