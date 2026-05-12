# -*- coding: utf-8 -*-
{
    'name': 'POS Print Session Details',
    'version': '19.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Show last session info and print buttons on POS login screen',
    'description': (
        'Displays last closed session details (Opening Date, Closing Date, '
        'Ending Balance) on the POS login screen when the register is closed. '
        'Adds Print and Print Details buttons above the Backend button.'
    ),
    'author': 'Custom',
    'depends': ['point_of_sale', 'pos_hide_closing_register'],
    'data': [
        'views/pos_config_view.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'print_sessions_details/static/src/css/login_screen.css',
            'print_sessions_details/static/src/js/login_screen_patch.js',
            'print_sessions_details/static/src/xml/login_screen_patch.xml',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
