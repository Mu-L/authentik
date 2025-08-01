import { AKElement } from "#elements/Base";
import { AKFormGroup } from "#elements/forms/FormGroup";

import { msg, str } from "@lit/localize";
import { css, CSSResult, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import PFForm from "@patternfly/patternfly/components/Form/form.css";
import PFFormControl from "@patternfly/patternfly/components/FormControl/form-control.css";
import PFBase from "@patternfly/patternfly/patternfly-base.css";

/**
 *
 * Horizontal Form Element Container.
 *
 * This element provides the interface between elements of our forms and the
 * form itself.
 * @custom-element ak-form-element-horizontal
 */

/* TODO

 * 1. Replace the "probe upward for a parent object to event" with an event handler on the parent
 *    group.
 * 2. Updated() has a lot of that slug code again. Really, all you want is for the slug input object
 *    to update itself if its content seems to have been tracking some other key element.
 * 3. Updated() pushes the `name` field down to the children, as if that were necessary; why isn't
 *    it being written on-demand when the child is written? Because it's slotted... despite there
 *    being very few unique uses.
 */

const isAkControl = (el: unknown): boolean =>
    el instanceof HTMLElement &&
    "dataset" in el &&
    el.dataset instanceof DOMStringMap &&
    "akControl" in el.dataset;

const nameables = new Set([
    "input",
    "textarea",
    "select",
    "ak-codemirror",
    "ak-chip-group",
    "ak-search-select",
    "ak-radio",
]);

@customElement("ak-form-element-horizontal")
export class HorizontalFormElement extends AKElement {
    static styles: CSSResult[] = [
        PFBase,
        PFForm,
        PFFormControl,
        css`
            .pf-c-form__group {
                display: grid;
                grid-template-columns:
                    var(--pf-c-form--m-horizontal__group-label--md--GridColumnWidth)
                    var(--pf-c-form--m-horizontal__group-control--md--GridColumnWidth);
            }

            .pf-c-form__group-label {
                padding-top: var(--pf-c-form--m-horizontal__group-label--md--PaddingTop);
            }

            .pf-c-form__label[aria-required] .pf-c-form__label-text::after {
                content: "*";
                user-select: none;
                margin-left: var(--pf-c-form__label-required--MarginLeft);
                font-size: var(--pf-c-form__label-required--FontSize);
                color: var(--pf-c-form__label-required--Color);
            }
        `,
    ];

    @property({ type: String, reflect: false })
    public fieldID?: string;

    @property({ type: String })
    public label = "";

    @property({ type: Boolean })
    public required = false;

    @property({ attribute: false })
    public errorMessages: string[] | string[][] = [];

    _invalid = false;

    /* If this property changes, we want to make sure the parent control is "opened" so
     * that users can see the change.[1]
     */
    @property({ type: Boolean })
    set invalid(v: boolean) {
        this._invalid = v;
        // check if we're in a form group, and expand that form group
        const parent = this.parentElement?.parentElement;

        if (parent instanceof AKFormGroup || parent instanceof HTMLDetailsElement) {
            parent.open = true;
        }
    }
    get invalid(): boolean {
        return this._invalid;
    }

    @property({ type: String })
    public name = "";

    @property({
        type: String,
        attribute: "flow-direction",
    })
    public flowDirection: "row" | "column" = "column";

    firstUpdated(): void {
        this.updated();
    }

    updated(): void {
        this.querySelectorAll<HTMLInputElement>("input[autofocus]").forEach((input) => {
            input.focus();
        });
        this.querySelectorAll("*").forEach((input) => {
            if (isAkControl(input) && !input.getAttribute("name")) {
                input.setAttribute("name", this.name);
                return;
            }

            if (nameables.has(input.tagName.toLowerCase())) {
                input.setAttribute("name", this.name);
            } else {
                return;
            }
        });
    }

    render(): TemplateResult {
        this.updated();
        return html`<div
            class="pf-c-form__group"
            role="group"
            aria-label="${this.label}"
            data-flow-direction="${this.flowDirection}"
        >
            <div class="pf-c-form__group-label">
                <label
                    id="group-label"
                    class="pf-c-form__label"
                    ?aria-required=${this.required}
                    for="${ifDefined(this.fieldID)}"
                >
                    <span class="pf-c-form__label-text">${this.label}</span>
                </label>
            </div>
            <div class="pf-c-form__group-control">
                <slot class="pf-c-form__horizontal-group"></slot>
                <div class="pf-c-form__horizontal-group">
                    ${this.errorMessages.map((message) => {
                        if (message instanceof Object) {
                            return html`${Object.entries(message).map(([field, errMsg]) => {
                                return html`<p
                                    class="pf-c-form__helper-text pf-m-error"
                                    aria-live="polite"
                                >
                                    ${msg(str`${field}: ${errMsg}`)}
                                </p>`;
                            })}`;
                        }
                        return html`<p class="pf-c-form__helper-text pf-m-error" aria-live="polite">
                            ${message}
                        </p>`;
                    })}
                </div>
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-form-element-horizontal": HorizontalFormElement;
    }
}
