<?php
$jsonFile = 'myTown.json';
$fileContent = file_get_contents($jsonFile);

// Check if the file is empty and initialize $data accordingly
if (!$fileContent) {
    $data = [];
} else {
    $data = json_decode($fileContent, true);
}

$input = json_decode(file_get_contents('php://input'), true);
$date = $input['date'];
$avgTemp = $input['avgTemp'];

// Update or create the entry for the specified date
$data[$date] = ['avgTemp' => $avgTemp, 'lastUpdated' => time()];

// Write the updated data back to the file
file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode(['message' => "Data for $date saved successfully."]);
?>
