<?php
declare(strict_types=1);
$cfg['blowfish_secret'] = 'FebC3cMPORiGInlJ3pbaL8yLHQjt4s6y';
$i = 0;
$i++;
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['host'] = 'mariadb';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = true;

$cfg['AllowArbitraryServer'] = true;
$cfg['EnableAutocompleteForTablesAndColumns'] = false;
$cfg['LoginCookieValidity'] = 86400;
$cfg['NavigationDisplayLogo'] = false;
$cfg['ShowDatabasesNavigationAsTree'] = false;
?>
