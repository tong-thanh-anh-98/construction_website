<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('mail.subject') }}</title>
</head>

<body>
    <h2>{{ __('mail.greeting') }}</h2>
    <p>{{ __('mail.intro') }}</p>
    <p><strong>{{ __('mail.name') }}:</strong> {{ $mailData['name'] }}</p>
    <p><strong>{{ __('mail.email') }}:</strong> {{ $mailData['email'] }}</p>
    <p><strong>{{ __('mail.phone') }}:</strong> {{ $mailData['phone'] }}</p>
    <p><strong>{{ __('mail.subject_label') }}:</strong> {{ $mailData['subject'] }}</p>
    <p><strong>{{ __('mail.message') }}:</strong><br>{!! nl2br(e($mailData['message'])) !!}</p>
</body>

</html>
