/** @odoo-module */

/**
 * print_sessions_details – Login Screen patch
 *
 * - Fetches the last closed session for THIS register (config_id) on mount.
 * - Shows a summary card under the "Open Register" button.
 * - Adds "Print" and "Print Details" buttons above the "Backend" button.
 * - All UI elements are hidden when:
 *     • the feature is disabled in POS config (enable_session_details = false)
 *     • the button label is "Unlock Register" (session already open)
 *     • there is no prior closed session
 */

import { patch } from "@web/core/utils/patch";
import { LoginScreen } from "@point_of_sale/app/screens/login_screen/login_screen";
import { useState, onMounted } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

patch(LoginScreen.prototype, {
    setup() {
        super.setup(...arguments);
        this.orm = useService("orm");

        this.sessionDetails = useState({
            show: false,          // whether to render the block at all
            loading: true,
            opening_date: "",
            closing_date: "",
            ending_balance: "",
            session_id: null,
        });

        onMounted(async () => {
            await this._loadLastSessionDetails();
        });
    },

    /**
     * Returns true only when the register button says "Open Register"
     * (i.e. there is no active session for this config) AND the feature
     * is enabled in config.
     */
    get showSessionDetailsBlock() {
        if (!this.pos.config.enable_session_details) return false;
        // pos.session is null / undefined when register is truly closed
        const session = this.pos.session;
        if (session && session.state === "opened") return false;
        return this.sessionDetails.show;
    },

    async _loadLastSessionDetails() {
        const configId = this.pos.config.id;
        try {
            const info = await this.orm.call(
                "pos.session",
                "get_last_closed_session_info",
                [configId],
            );
            if (info) {
                this.sessionDetails.session_id = info.session_id;
                this.sessionDetails.opening_date = info.opening_date;
                this.sessionDetails.closing_date = info.closing_date;
                this.sessionDetails.ending_balance = info.ending_balance;
                this.sessionDetails.show = true;
            } else {
                this.sessionDetails.show = false;
            }
        } catch (_e) {
            this.sessionDetails.show = false;
        } finally {
            this.sessionDetails.loading = false;
        }
    },

    /** Print only the summary card (Opening, Closing, Ending Balance) */
    async printSessionSummary() {
        const { opening_date, closing_date, ending_balance } = this.sessionDetails;
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Session Summary</title>
                <style>
                    body {
                        font-family: monospace;
                        font-size: 14px;
                        font-weight: bold;
                        margin: 20px;
                    }
                    table { width: 100%; border-collapse: collapse; }
                    td { padding: 4px 0; }
                    td:last-child { text-align: right; }
                    hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
                    .title { text-align: center; font-size: 16px; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="title">SESSION SUMMARY</div>
                <hr/>
                <table>
                    <tr><td>Opening Date</td><td>${opening_date}</td></tr>
                    <tr><td>Closing Date</td><td>${closing_date}</td></tr>
                    <tr><td>Ending Balance</td><td>${ending_balance}</td></tr>
                </table>
                <hr/>
                <script>
                    window.onload = function () {
                        window.print();
                        window.onafterprint = function () { window.close(); };
                    };
                </script>
            </body>
            </html>
        `;

        const printWin = window.open("", "_blank", "width=600,height=400");
        if (printWin) {
            printWin.document.write(htmlContent);
            printWin.document.close();
        }
    },

    /** Print the full sale-details report for the last closed session */
    async printSessionDetails() {
        const sessionId = this.sessionDetails.session_id;
        if (!sessionId) return;

        try {
            const reportHtml = await this.orm.call(
                "pos.session",
                "get_session_details_report_html",
                [sessionId],
            );

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Session Details</title>
                    <style>
                        body { font-family: monospace; font-size: 14px; font-weight: bold; margin: 0; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    ${reportHtml}
                    <script>
                        window.onload = function () {
                            window.print();
                            window.onafterprint = function () { window.close(); };
                        };
                    </script>
                </body>
                </html>
            `;

            const printWin = window.open("", "_blank", "width=800,height=600");
            if (printWin) {
                printWin.document.write(htmlContent);
                printWin.document.close();
            }
        } catch (_e) {
            console.error("print_sessions_details: failed to fetch report HTML", _e);
        }
    },
});
