# Life Dashboard

Life Dashboard is a simple browser app for tracking daily habits. It lets you enter date-based values for water, sleep, exercise, reading, and screen time, then saves those entries in your browser so you can review them later.

## What the app does

- Lets you record daily habit data with a single form.
- Saves entries in browser localStorage on the current device.
- Shows a summary page that highlights today’s habits and a weekly snapshot.
- Shows a history page with all saved entries and delete buttons.

## Features

- Daily entry form with date and habit fields.
- Validation for required fields and valid ranges.
- Success state after saving an entry.
- Summary page focused on today’s entry.
- Weekly snapshot summary across all saved entries.
- History page with delete buttons for each saved entry.

## How to run it

1. Open `index.html` in a web browser.
2. Fill in the form and click **Submit**.
3. Use the **View Summary** link or the **History** page to review saved data.

No server is needed because this is a static HTML/CSS/JavaScript app.

## What data is stored

The app stores entries in browser localStorage under the key `lifeDashboardEntries`.
Each entry includes:

- `date`
- `water` (number of glasses)
- `sleep` (hours)
- `exercise` (minutes)
- `reading` (minutes)
- `screenTime` (hours)

## Validation rules

Each field is required and must meet these rules:

- Date: required.
- Water: 0 to 30 glasses.
- Sleep: 0 to 24 hours.
- Exercise: 0 to 600 minutes.
- Reading: 0 to 600 minutes.
- Screen Time: 0 to 24 hours.

If a field is empty or outside the allowed range, the form will show an error message and prevent saving.

## How deletion works

- The history page shows a delete button next to each entry.
- Clicking delete removes that entry from localStorage instantly.
- The table refreshes immediately to show the updated list.

## Limitations

- Data is stored only in the browser used to open the app.
- Entries are not synced between devices or browsers.
- There is no account system or password protection.
- The app only stores the values you enter in the form.

## Privacy note

This app stores data only in browser localStorage on the current device.
