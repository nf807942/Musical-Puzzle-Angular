<?php

  $filepath =  '../results.csv';

  if (file_exists($filepath) && is_readable($filepath)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=' . basename($filepath));
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filepath));
    header("Access-Control-Expose-Headers: Content-Disposition");   
    readfile($filepath);
  } else {
    header("HTTP/1.0 404 Not Found");
  }

?>