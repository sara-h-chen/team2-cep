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

$link = new PDO('sqlite:./databases/databases.db') or die("Failed to open the database");
$link->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_TO_STRING);

/* JOHN, PLEASE UNCOMMENT THESE LINES WHEN CONNECTING TO YOUR OWN DATABASE */
/* YOU WILL NEED TO CHANGE THE USER DETAILS */
//$link = new PDO('mysql:host=yourservername;dbname=databasename', $user, $pass, array(PDO::ATTR_PERSISTENT => true)) or die("Failed to open database");
//$link->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_TO_STRING);

/* This contains the group's custom databases */
$group_dbs = new PDO('sqlite:./databases/group_tables.db') or die("Failed to open the database");
$group_dbs->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_TO_STRING);

/* Deal with GET requests */
if ($method === 'GET') {

    /* Returns entire manual matches table */
    if ($_GET['table'] === 'matches') {
        $manual_matches = $group_dbs->query("SELECT * FROM manual_matches");
        $output = $manual_matches->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($output);
        exit();
    /* Returns entire payments_received table */
    } else if ($_GET['table'] === 'payments') {
        $payments = $group_dbs->query("SELECT * FROM payment_records");
        $output = $payments->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($output);
        exit();
    }
    /* Get all the information required */
    $result = $link->query("SELECT id, forename, pname, surname, parentsName, parentsNameAlt FROM members");
    $output = $result->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($output);

} else if ($method === 'POST') {
    /* CHECKS FOR URL PARAM; IF IT EXISTS THEN THE DATABASE DELETES THE SCOUT_ID SPECIFIED */
    if (isset($_POST['scout_id'])) {
        $toDelete = $_POST['scout_id'];
        if (!is_numeric($toDelete)) {
            echo json_encode("Cannot delete non-numeric scout_id.");
            exit();
        }
        $deleteQuery = $group_dbs->prepare("DELETE FROM manual_matches WHERE scout_id=(:delete_param)");
        $deleteQuery->bindValue(':delete_param', $toDelete, PDO::PARAM_INT);
        $deleteQuery->execute();
        echo json_encode("Manual match for scout_id " . $toDelete . " deleted.");
        exit();
    }

    $request_body = file_get_contents('php://input');
    $json = json_decode($request_body);

    /* Stores date and payments made by scouts */
    foreach ($json as $scout) {
        if (!isset($scout->payment_description)) {
            if (!empty($scout->scout_id) && !empty($scout->payment_amount)) {
                $scout_id = ($scout->scout_id);
                $date_of_payment = str_replace('/','-',($scout->payment_date));
                $amount_paid = ($scout->payment_amount);
                $update = $group_dbs->prepare("INSERT INTO payment_records(scout_id, payment_date, payment_amount) VALUES (:id, :payment_date, :payment_amount) WHERE NOT EXISTS (SELECT scout_id, payment_date, payment_amount FROM payment_records WHERE scout_id=:id AND payment_date=:payment_date AND payment_amount=:payment_amount)");
                $update->bindValue(':id', $scout_id, PDO::PARAM_INT);
                $update->bindValue(':payment_date', $date_of_payment, PDO::PARAM_STR);
                $update->bindValue(':payment_amount', $amount_paid);
                $update->execute();
                echo json_encode("Payment of " . $amount_paid . " made on " . $date_of_payment . " added");
            } else {
                echo json_encode("Either scout_id or amount is unspecified");
            }
    /* Stores manual matches */
        } else if (isset($scout->payment_description)) {
            if (!empty($scout->scout_id) && !empty($scout->payment_description)) {
                $scout_id = ($scout->scout_id);
                $description = ($scout->payment_description);
                $update = $group_dbs->prepare("INSERT OR IGNORE INTO manual_matches(scout_id, payment_description) VALUES (:id, :description)");
                $update->bindValue(':id', $scout_id, PDO::PARAM_INT);
                $update->bindValue(':description', $description, PDO::PARAM_STR);
                $update->execute();
                echo json_encode("Payment by " . $scout_id . ": " . $description);
            } else {
                echo json_encode("Either scout_id or description is empty");
            }
        }
    }
};
