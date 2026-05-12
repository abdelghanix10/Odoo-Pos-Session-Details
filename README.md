# POS Print Session Details

## Overview

**POS Print Session Details** is an Odoo 19 module designed to provide immediate access to last session information and reporting directly from the POS login screen. It eliminates the need to enter the backend to check the status or print reports for the previous session, streamlining the workflow for cashiers and managers during shift changes or opening procedures.

## Features

- **Session Summary Card:** Displays critical data from the last closed session:
  - **Opening Date & Time**
  - **Closing Date & Time**
  - **Ending Balance** (with currency symbol)
- **Direct Printing:**
  - **Print Summary:** Generates a concise, receipt-style summary of the session details.
  - **Print Details:** Generates the full "Sale Details" report (X-Report/Z-Report style) for the last session.
- **Smart Logic:** Automatically identifies the most recent closed session with a non-zero balance to ensure meaningful data is displayed.
- **Configurable:** Enable or disable the session details block per POS configuration.
- **Responsive Design:** Integrates seamlessly into the Odoo POS login screen layout.

## Technical Details

- **Module Name:** `print_sessions_details`
- **Odoo Version:** 19.0
- **Dependencies:** `point_of_sale`, `pos_hide_closing_register`
- **Key Files:**
  - `models/pos_session.py`: Logic for fetching last session info and rendering reports.
  - `static/src/js/login_screen_patch.js`: Frontend logic for fetching and displaying data.
  - `static/src/xml/login_screen_patch.xml`: Template extension for the login screen.

## Installation

1. Copy the `print_sessions_details` module into your Odoo addons directory.
2. Restart your Odoo server.
3. Activate Developer Mode.
4. Go to **Apps** -> **Update Apps List**.
5. Search for "POS Print Session Details" and click **Activate**.

## Configuration

To enable the session details on the login screen:
1. Navigate to **Point of Sale** -> **Configuration** -> **Settings**.
2. Select your POS configuration.
3. Look for the **Session Details** section (or search for "Enable Session Details").
4. Check the box **Enable Session Details on Login Screen**.
5. Save the settings.

## Usage

1. Open a Point of Sale session that is currently **Closed**.
2. On the login screen, you will see a "Session Details" card next to the "Open Register" button.
3. Use the **Print** button to print a quick summary.
4. Use the **Print Details** button to view and print the comprehensive sale details report.
5. Note: These elements are automatically hidden if a session is already open or if no prior closed session data is available.

## License

This module is licensed under the LGPL-3.
