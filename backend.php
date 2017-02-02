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

    /* Returns entire manual matches table */
    if ($_GET['table'] === 'matches') {
        $manual_matches = $link->query("SELECT * FROM manual_matches");
        $output = $manual_matches->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($output);
        exit();
    /* Returns entire payments_received table */
    } else if ($_GET['table'] === 'payments') {
        $payments = $link->query("SELECT * FROM payment_records");
        $output = $payments->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($output);
        exit();
    }
    /* Get all the information required */
    $result = $link->query("SELECT id, forename, pname, surname, parentsName, parentsNameAlt FROM members");
    $output = $result->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($output);

} else if ($method === 'POST') {
    $request_body = file_get_contents('php://input');
    $json = json_decode($request_body);

    /* Stores date and payments made by scouts */
    if (!isset($json->desc)) {
        if (!empty($json->scoutid) && !empty($json->amount)) {
            $scout_id = ($json->scoutid);
            $date_of_payment = ($json->date);
            $amount_paid = ($json->amount);
            $update = $link->prepare("INSERT INTO payments_received(id, payment_date, payment_amount) VALUES (:id, :payment_date, :payment_amount)");
            $update->bindValue(':id', $scout_id, PDO::PARAM_INT);
            $update->bindValue(':payment_date', $date_of_payment, PDO::PARAM_STR);
            $update->bindValue(':payment_amount', $amount_paid);
            $update->execute();
            echo json_encode("Payment of " . $amount_paid . " made on " . $date_of_payment . " added");
        } else {
            echo json_encode("Either scout_id or amount is unspecified");
        }
    /* Stores manual matches */
    } else if (!isset($json->amount) && !isset($json->date)) {
        if (!empty($json->scoutid) && !empty($json->desc)) {
            $scout_id = ($json->scoutid);
            $description = ($json->desc);
            $update = $link->prepare("INSERT INTO manual_matches(scout_id, payment_description) VALUES (:id, :description)");
            $update->bindValue(':id', $scout_id, PDO::PARAM_INT);
            $update->bindValue(':description', $description, PDO::PARAM_STR);
            $update->execute();
            echo json_encode("Payment by " . $scout_id . ": " . $description);
        } else {
            echo json_encode("Either scout_id or description is empty");
        }
    }
};