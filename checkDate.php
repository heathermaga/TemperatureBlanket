<?php
echo "<script>console.log('Just got to checkDate.php');</script>";
$jsonFile = 'myTown.json';
$data = file_get_contents($jsonFile);

if (!$data) {
    // File is empty, initialize as an empty array
    echo "<script>console.log('myTown.json is empty or does not exist. Initializing an empty array.');</script>";
    $data = [];
} else {
    $data = json_decode($data, true);
}

$date = json_decode(file_get_contents('php://input'), true)['date'];

if (isset($data[$date])) {
    echo json_encode(['exists' => true, 'avgTemp' => $data[$date]['avgTemp']]);
} else {
    echo json_encode(['exists' => false]);
}
?>
