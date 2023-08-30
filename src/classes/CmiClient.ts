import BaseCmiClient from './BaseCmiClient';

export default class cmiParams extends BaseCmiClient {
  public redirect_post(): string {
    /**
     * GENERATE HASH
     */
    this.generateHash();
    /**
     * HANDLE REQUIRE OPTIONS HIDDEN INPUTS AND REDIRECT TO CMI PAGE
     */
    const url = this.DEFAULT_API_BASE_URL + '/fim/est3Dgate';

    let html = '<html>';
    html += '<head>';
    html += "<meta http-equiv='Content-Language' content='tr'>";
    html += "<meta http-equiv='Content-Type' content='text/html; charset=ISO-8859-9'>";
    html += "<meta http-equiv='Pragma' content='no-cache'>";
    html += "<meta http-equiv='Expires' content='now'>";
    html += '</head>';
    html += "<body onload='closethisasap();'>";
    html += "<form name='redirectpost' method='post' action='" + url + "'>";

    for (const [name, value] of Object.entries(this.requiredOpts)) {
      html += "<input type='hidden' name='" + name + "' value='" + value + "'> ";
    }

    html += '</form>';
    html += "<script type='text/javascript'>";
    html += "function closethisasap() { document.forms['redirectpost'].submit(); }";
    html += '</script>';
    html += '</body></html>';

    console.log(html);

    return html;
  }

  /**
   * Check status hash from CMI plateform if is equal to hash generated
   *
   * @param HASH
   * @return bool
   */

  public checkHash(hash: string): boolean {
    return this.generateHash() === hash;
  }
}
