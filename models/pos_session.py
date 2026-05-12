# -*- coding: utf-8 -*-
from odoo import models, api


class PosSession(models.Model):
    _inherit = 'pos.session'

    @api.model
    def get_last_closed_session_info(self, config_id):
        """
        Return key info about the last *closed* session for the given POS
        config whose ending balance is non-zero.  If the most recent closed
        session has a zero balance it is skipped and we walk back until a
        session with a real ending balance is found (or we exhaust all).

        Returns a dict or False when nothing useful is found.
        """
        config = self.env['pos.config'].browse(config_id)
        if not config.exists():
            return False

        # Fetch last 50 closed sessions (plenty for walking back)
        closed_sessions = self.search(
            [
                ('config_id', '=', config_id),
                ('state', '=', 'closed'),
            ],
            order='stop_at desc',
            limit=50,
        )

        if not closed_sessions:
            return False

        # Walk through most-recent-first and stop at first non-zero balance
        chosen = None
        for s in closed_sessions:
            balance = s.cash_register_balance_end_real or 0.0
            if balance != 0.0:
                chosen = s
                break

        # If every closed session has 0 balance, just use the most recent one
        if chosen is None:
            chosen = closed_sessions[0]

        def fmt_dt(dt):
            if not dt:
                return ''
            try:
                return dt.strftime('%b %-d, %H:%M')
            except ValueError:
                return dt.strftime('%b %d, %H:%M')

        currency = config.currency_id
        symbol = currency.symbol or ''
        ending_balance = chosen.cash_register_balance_end_real or 0.0

        return {
            'session_id': chosen.id,
            'name': chosen.name,
            'opening_date': fmt_dt(chosen.start_at),
            'closing_date': fmt_dt(chosen.stop_at),
            'ending_balance': '{:.2f} {}'.format(ending_balance, symbol),
            'currency_symbol': symbol,
        }

    @api.model
    def get_session_details_report_html(self, session_id):
        """
        Render the sale-details report HTML for a given session_id.
        Delegates to the report defined in pos_hide_closing_register.
        """
        try:
            session = self.browse(session_id)
            if not session.exists():
                return "<html><body><h1>Session not found</h1></body></html>"
            report = self.env.ref('pos_hide_closing_register.sale_details_report')
            html = report._render_qweb_html(report.report_name, [session_id])[0].decode('utf-8')
            return html
        except Exception as exc:
            import traceback
            return (
                f"<html><body><h1>Error</h1><p>{exc}</p>"
                f"<pre>{traceback.format_exc()}</pre></body></html>"
            )
