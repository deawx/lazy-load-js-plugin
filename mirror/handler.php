<?php 

/** 
 * JSLazyLoading raw JavaScript plugin
 *
 * @Copyright (C) 2015–2016 Philip Sorokin. All rights reserved.
 * @website: https://addondev.com
 * @GitHub: github.com/addondev.
 * @developer: Philip Sorokin.
 * @location: Russia, Moscow.
 * @e-mail: philip.sorokin@gmail.com
 * @created: June 2015.
 * @license: GNU GPLv2 http://www.gnu.org/licenses/gpl-2.0.html
 * 
 * If automatic image multi-serving is enabled and the PHP handler is selected, the JavaScript plugin changes 
 * image URLs so that images can be served by this script. This script checks if the submitted analogues 
 * exist and displays it. If analogues do not exist, this handler tries to display the original image. Otherwise,
 * an error 404 is risen.
 */

if(isset($_SERVER['PATH_INFO']))
{
	$url = $_SERVER['PATH_INFO'];
	$root = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR;
	$original = $root . $url;
	
	if(@$imginfo = getimagesize($original))
	{
		header("Content-type: " . $imginfo['mime']);
		header("Cache-Control: max-age=2629000");
		
		if(!empty($_GET['analogues']))
		{
			if($pos = strrpos($url, '.'))
			{
				$ext = substr($url, $pos);
				$file = substr($url, 0, $pos);
				
				$analogues = explode(' ', $_GET['analogues']);
				
				foreach($analogues as $key => $postfix)
				{
					if($key > 2)
					{
						break;
					}
					elseif(@readfile($root . $file . "_" . $postfix . $ext))
					{
						exit;
					}
				}
			}
		}
		
		@readfile($original);
		
	}
	else
	{
		$code = 404;
		$status = "Not Found";
		
		header("HTTP/1.0 $code $status"); 
		header("HTTP/1.1 $code $status"); 
		header("Status: $code $status");	
	}
}
