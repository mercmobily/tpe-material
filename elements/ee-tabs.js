export const EeTabs = (base) => {
  return class Base extends base {
    static get styles () {
      return [
        super.styles,
        super.lit.css`
        :host {
          --ee-tabs-selected-color: var(--mat-primary-color);
          --ee-tabs-color: var(--mat-primary-text);
        }

        :host nav > ::slotted(*:hover) {
          box-shadow: var(--mat-theme-box-shadow4);
        }

        :host nav > ::slotted(*) {
          border-bottom: 0 !important;
          transition: all 0.3s ease-in-out;
          position: relative;
          box-sizing: border-box;
        }

        :host nav > ::slotted(*[active]) {
          color: var(--ee-tabs-selected-color);
          border-bottom: 0;
        }

        :host nav > ::slotted(*:focus),
        :host nav > ::slotted(*:hover) {
          outline:0 ;
          border-bottom: 0;
          filter: brightness(150%);
        }

        :host nav > ::slotted(*)::after,
        :host nav > ::slotted(*:not([active]))::after {
          content: '';
          position: absolute;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 1px;
          background-color: var(--ee-tabs-selected-color);
        }

        :host nav > ::slotted(*:focus)::after,
        :host nav > ::slotted(*:hover)::after {
          height: 1px;
          left: 0.5px;
          right: 0.5px;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;
        }

        :host nav > ::slotted(*[active])::after {
          content: '';
          background-color: var(--ee-tabs-active-color);
          left: 0.5px;
          right: 0.5px;
          bottom: 0;
          height: 4px;
          transition: height 0.3s ease-in-out, left 0.3s ease-in-out, right 0.3s ease-in-out;;
        }

        :host nav > ::slotted(*:active) {
          background: #cccccc;
          border-bottom: 0;
          box-shadow: none;
        }

        `
      ]
    }
  }
}
