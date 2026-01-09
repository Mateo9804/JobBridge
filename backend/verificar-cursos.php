<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$courses = \App\Models\Course::select('title', 'type', 'is_active')->get();

echo "Total de cursos: " . $courses->count() . PHP_EOL . PHP_EOL;

foreach ($courses as $course) {
    echo "- " . $course->title . " (" . $course->type . ") - Active: " . ($course->is_active ? 'Yes' : 'No') . PHP_EOL;
}

