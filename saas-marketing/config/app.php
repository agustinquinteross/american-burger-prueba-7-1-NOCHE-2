<?php
return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'database' => 'marketing_os',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
    ],
    'app' => [
        'name' => 'Marketing OS',
        'base_url' => 'http://localhost:8081',
        'timezone' => 'UTC',
    ],
    'notifications' => [
        'telegram_bot_token' => '',
        'telegram_chat_id' => '',
    ],
];
