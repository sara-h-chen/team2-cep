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

/* Deal with GET requests */
if ($method === 'GET') {
    /* Get the list of topics */
    $result = $link->query("SELECT id, forename, pname, surname, parentsName, parentsNameAlt FROM members");
    $output = $result->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($output);
    /* Change here when you know the params */
//    $result = $link->prepare("SELECT topics.topic, faqs.question, faqs.answer FROM faqs INNER JOIN topics ON faqs.topic_id = topics.id WHERE topics.topic LIKE :param OR faqs.answer LIKE :param OR faqs.question LIKE :param");
//    $result->bindValue(':param', '%' . $q . '%', PDO::PARAM_STR);
//    $result->execute();
//    $itemize = $result->fetchAll(PDO::FETCH_ASSOC);
//    $output = array('faqs'=>$itemize);
//    echo json_encode($output);
};