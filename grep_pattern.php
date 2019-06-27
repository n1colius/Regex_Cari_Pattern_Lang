<?php
/**
 * @Author: n1colius.lau@gmail.com
 * @Date:   2019-06-27 11:00:30
 */
$ArrFin = array();
$fh = fopen('/var/www/html/example_pattern.js', 'r') or die($php_errormsg);
while (!feof($fh)) {
    $line = fgets($fh, 4096);
    //echo $line.'<br>';
    preg_match_all('/lang\((?:".*?"|\'.*?\')\)/', $line, $matches);
    if(!empty($matches[0])) $ArrFin = array_merge($ArrFin,$matches[0]);
}
fclose($fh);
echo '<pre>'; print_r($ArrFin); exit;
