# -*- coding: utf-8 -*-
from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    enable_session_details = fields.Boolean(
        string="Show Session Details on Login",
        default=True,
        help="When enabled, the last closed session's Opening Date, "
             "Closing Date and Ending Balance are shown on the POS login "
             "screen, along with Print and Print Details buttons."
    )
