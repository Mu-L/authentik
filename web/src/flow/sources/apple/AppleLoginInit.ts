import "@goauthentik/flow/components/ak-flow-card.js";
import { BaseStage } from "@goauthentik/flow/stages/base";

import { msg } from "@lit/localize";
import { CSSResult, TemplateResult, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import PFButton from "@patternfly/patternfly/components/Button/button.css";
import PFForm from "@patternfly/patternfly/components/Form/form.css";
import PFFormControl from "@patternfly/patternfly/components/FormControl/form-control.css";
import PFLogin from "@patternfly/patternfly/components/Login/login.css";
import PFTitle from "@patternfly/patternfly/components/Title/title.css";
import PFBase from "@patternfly/patternfly/patternfly-base.css";

import { AppleChallengeResponseRequest, AppleLoginChallenge } from "@goauthentik/api";

@customElement("ak-flow-source-oauth-apple")
export class AppleLoginInit extends BaseStage<AppleLoginChallenge, AppleChallengeResponseRequest> {
    @property({ type: Boolean })
    isModalShown = false;

    static get styles(): CSSResult[] {
        return [PFBase, PFLogin, PFForm, PFFormControl, PFButton, PFTitle];
    }

    firstUpdated(): void {
        const appleAuth = document.createElement("script");
        appleAuth.src =
            "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        appleAuth.type = "text/javascript";
        appleAuth.onload = () => {
            AppleID.auth.init({
                clientId: this.challenge?.clientId,
                scope: this.challenge.scope,
                redirectURI: this.challenge.redirectUri,
                state: this.challenge.state,
                usePopup: false,
            });
            AppleID.auth.signIn();
            this.isModalShown = true;
        };
        document.head.append(appleAuth);
        // Listen for authorization success
        document.addEventListener("AppleIDSignInOnSuccess", () => {
            //handle successful response
        });
        // Listen for authorization failures
        document.addEventListener("AppleIDSignInOnFailure", (error) => {
            console.warn(error);
            this.isModalShown = false;
        });
    }

    render(): TemplateResult {
        return html`<ak-flow-card .challenge=${this.challenge}>
            <span slot="title">${msg("Authenticating with Apple...")}</span>
            <form class="pf-c-form">
                <ak-empty-state loading></ak-empty-state>
                ${!this.isModalShown
                    ? html`<button
                          class="pf-c-button pf-m-primary pf-m-block"
                          @click=${() => {
                              AppleID.auth.signIn();
                          }}
                      >
                          ${msg("Retry")}
                      </button>`
                    : nothing}
            </form>
        </ak-flow-card>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-flow-source-oauth-apple": AppleLoginInit;
    }
}
