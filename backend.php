<?php
/**
 * Created by PhpStorm.
 * User: sara
 * Date: 26/01/17
 * Time: 18:19
 */

ob_start();

$method = $_SERVER['REQUEST_METHOD'];

/* Comment this out when deploying to server */
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$link = new PDO('sqlite:./databases.db') or die("Failed to open the database");
$link->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_TO_STRING);

/* Deal with GET requests */
if ($method === 'GET') {
    /* Get all the information required */
    $result = $link->query("SELECT id, forename, pname, surname, parentsName, parentsNameAlt FROM members");
    $output = $result->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($output);
};