// ---------------------------------------------------------------------------
// Email template builders for portrait inquiries
// ---------------------------------------------------------------------------

/** HTML-escape user-supplied text to prevent XSS in email templates. */
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function firstName(fullName: string): string {
  return fullName.split(" ")[0] || fullName;
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://changemedia.studio";
}

// ---------------------------------------------------------------------------
// Grad client email
// ---------------------------------------------------------------------------
export function buildGradClientEmail(name: string, packageName: string | null): string {
  const first = esc(firstName(name));
  const site = siteUrl();
  const unsubscribeUrl = `mailto:william.navarretemoreno@changemedia.studio?subject=Unsubscribe&body=Please remove me from your list.`;
  const heroImage =
    "https://c_cmlh427bmd6dq3e9v3ovobdktb8oaudah5_gezqwy.canva-cdn.email/208dd5669fd053fb8d94d246cbb5ce75.jpg";

  const packageLine = packageName
    ? `<tr><td dir="ltr" style="color:#0b1e1c;font-size:14.6667px;font-family:Helvetica,Arial,sans-serif;text-align:left;padding:0px 20px 16px">You mentioned you&rsquo;re interested in the <strong>${esc(packageName)}</strong> experience &mdash; solid pick. I think you&rsquo;re going to love it.</td></tr>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="x-apple-disable-message-reformatting">
</head>
<body style="width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;background-color:#f0f1f5;margin:0;padding:0">
<table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f0f1f5">
  <tbody><tr><td style="background-color:#f0f1f5">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;min-height:600px;margin:0 auto;background-color:#ffffff">
      <tbody>
        <!-- HERO IMAGE -->
        <tr><td style="vertical-align:top">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%"><tbody><tr><td align="center">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px"><tbody><tr>
              <td style="width:100%;padding:0">
                <img src="${heroImage}" width="600" height="627" style="display:block;width:100%;height:auto;max-width:100%" alt="Change Media Studio Grad Portraits">
              </td>
            </tr></tbody></table>
          </td></tr></tbody></table>
        </td></tr>

        <!-- BODY -->
        <tr><td style="vertical-align:top;padding:0">
          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0">
            <tbody><tr><td style="padding:24px 0 10px 0;vertical-align:top">
              <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse">
                <tbody>
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:14.6667px;font-family:Helvetica,Arial,sans-serif;text-align:left;padding:0px 20px 8px">
                    Hey ${first} &mdash; congrats on graduating. That&rsquo;s a big deal, and you deserve photos that actually match the moment.
                  </td></tr>
                  ${packageLine}
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:14.6667px;font-family:Helvetica,Arial,sans-serif;text-align:left;padding:0px 20px 16px">
                    I put together a full pricing guide with every package, what&rsquo;s included, and available dates. Take a look &mdash; then reply to this email or text me and we&rsquo;ll lock in your session. I&rsquo;ll get back to you same day.
                  </td></tr>
                  <tr><td style="font-size:0;height:8px" height="8">&nbsp;</td></tr>

                  <!-- CTA BUTTON: PRICING GUIDE -->
                  <tr><td style="padding:0px 20px"><table cellpadding="0" cellspacing="0" border="0" style="width:100%"><tbody><tr><td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:230px"><tbody><tr><td style="width:100%;padding:20px 0 8px">
                      <table cellpadding="0" cellspacing="0" style="width:100%;border-spacing:0;border-collapse:separate"><tbody><tr>
                        <td valign="middle" height="41" style="height:41px;vertical-align:middle;box-sizing:border-box;background-color:#378d90">
                          <a href="https://canva.link/j4wkc4mx7makl0d" target="_blank" rel="noopener" style="text-decoration:none;display:block">
                            <table cellpadding="0" cellspacing="0" style="width:100%;height:100%;border-spacing:0;border-collapse:collapse"><tbody><tr>
                              <td style="color:#ffffff;font-size:17px;font-weight:bold;font-family:Helvetica,Arial,sans-serif;text-align:center;line-height:1.1em;letter-spacing:-0.02em;vertical-align:middle;box-sizing:border-box">
                                View packages
                              </td>
                            </tr></tbody></table>
                          </a>
                        </td>
                      </tr></tbody></table>
                    </td></tr></tbody></table>
                  </td></tr></tbody></table></td></tr>

                  <!-- CONTACT -->
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:16px;font-family:Helvetica,Arial,sans-serif;line-height:1;text-align:center;padding:0px 20px">
                    <span style="font-weight:700;text-decoration:underline;letter-spacing:-0.01em">Contact me</span><br><br>
                    <a href="mailto:william.navarretemoreno@changemedia.studio" style="color:#0b1e1c;text-decoration:none;font-size:14.6667px">william.navarretemoreno@changemedia.studio</a>
                  </td></tr>
                  <tr><td style="font-size:0;height:8px" height="8">&nbsp;</td></tr>
                  <tr><td dir="ltr" style="color:#0b1e1c;font-size:13.3px;font-family:Helvetica,Arial,sans-serif;line-height:1;text-align:center;padding:0px 20px">
                    <a href="tel:7196638145" style="color:#0b1e1c;text-decoration:none">719-663-8145</a>
                  </td></tr>
                  <tr><td style="font-size:0;height:24px" height="24">&nbsp;</td></tr>
                </tbody>
              </table>
            </td></tr></tbody>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="vertical-align:top">
          <table border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;background-color:#0b1e1c">
            <tbody><tr><td style="text-align:center;padding:16px 20px">
              <table border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:526px;margin:0 auto">
                <tbody><tr><td style="padding:13px">
                  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;border-collapse:collapse">
                    <tbody>
                      <tr><td dir="ltr" style="color:#ffffff;font-size:12px;line-height:1.14;text-align:center;white-space:pre-wrap">
                        &copy; 2026 Change Studios. All rights reserved.<br>
                        You received this because you submitted an inquiry at changemedia.studio.
                      </td></tr>
                      <tr><td style="font-size:0;height:12px" height="12">&nbsp;</td></tr>
                      <tr><td dir="ltr" style="color:#ffffff;font-size:12px;line-height:1.14;text-align:center">
                        <a href="${unsubscribeUrl}" target="_blank" rel="noopener nofollow" style="color:#ffffff;text-decoration:underline">Unsubscribe</a>
                        <span style="color:#ffffff"> &nbsp;|&nbsp; </span>
                        <a href="${site}" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline">Visit our site</a>
                      </td></tr>
                    </tbody>
                  </table>
                </td></tr></tbody>
              </table>
            </td></tr></tbody>
          </table>
        </td></tr>

      </tbody>
    </table>
  </td></tr></tbody>
</table>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Generic client email
// ---------------------------------------------------------------------------
export function buildGenericClientEmail(name: string): string {
  const first = esc(firstName(name));
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;color:#111;max-width:560px;margin:0 auto;padding:32px 16px;line-height:1.6">
  <p style="margin:0 0 16px">Hey ${first},</p>
  <p style="margin:0 0 16px">Got your inquiry — thanks for reaching out to Change Media Studio.</p>
  <p style="margin:0 0 16px">I'll be in touch within 24 hours with more details.</p>
  <p style="margin:0">Talk soon,<br /><strong>William</strong><br />Change Media Studio</p>
</body>
</html>`;
}
