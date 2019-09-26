<?php
/**
 * @Author: n1colius.lau@gmail.com
 * @Date:   2019-06-27 11:00:30
 */
function getDirContents($dir, &$results = array()){
    $files = scandir($dir);

    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
        if(!is_dir($path)) {
            $results[] = $path;
        } else if($value != "." && $value != "..") {
            getDirContents($path, $results);
            $results[] = $path;
        }
    }

    return $results;
}

function GetFileExt($filename) {
    $arrTemp = explode(".", $filename);
    $ext = strtolower(array_values(array_slice($arrTemp, -1))[0]);
	return $ext;
}

$ArrFin = array();
$ArrFiles = getDirContents('/var/www/html/misc/script_cari_lang/testing');
for ($i=0; $i < count($ArrFiles); $i++) { 
    $PathProcess = $ArrFiles[$i];
    $ExtNya = GetFileExt($PathProcess);
    
    if($ExtNya == 'js' || $ExtNya == 'php') {
        $fh = fopen($PathProcess, 'r') or die($php_errormsg);
        while (!feof($fh)) {
            $line = fgets($fh, 4096);
            //echo $line.'<br>';
            preg_match_all('/lang\((?:".*?"|\'.*?\')\)/', $line, $matches);
            if(!empty($matches[0])) $ArrFin = array_merge($ArrFin,$matches[0]);
        }
        fclose($fh);
    }
}
echo '<pre>'; print_r($ArrFin); exit;
