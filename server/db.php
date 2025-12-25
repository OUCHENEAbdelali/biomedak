<?php
$host = 'localhost'; 
$port = '3306'; // Changez en 3307 si nécessaire
$db   = 'gmao_hopital'; 
$user = 'root'; 
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) { 
    die("Erreur de connexion : " . $e->getMessage()); 
}
?>