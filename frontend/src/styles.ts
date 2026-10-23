import { css } from "lit";

// Colours and shapes come from the active Home Assistant theme.
export const shared = css`
  :host {
    --hc-heat: var(--state-climate-heat-color, #ff8100);
    --hc-cold: var(--state-climate-cool-color, #2b9af9);
    --hc-ok: var(--success-color, #43a047);
    --hc-muted: var(--secondary-text-color);
    --hc-radius: var(--ha-card-border-radius, 12px);
    --hc-gap: 16px;
  }

  .card {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--hc-radius);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    box-shadow: var(--ha-card-box-shadow, none);
    padding: 16px;
    box-sizing: border-box;
    min-width: 0;
  }

  .card h2 {
    margin: 0 0 12px;
    font-size: 1rem;
    font-weight: 500;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .muted {
    color: var(--hc-muted);
  }

  .small {
    font-size: 0.85rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    color: var(--primary-text-color);
    white-space: nowrap;
  }

  .chip.heat {
    background: color-mix(in srgb, var(--hc-heat) 18%, transparent);
    color: var(--hc-heat);
  }

  .chip.ok {
    background: color-mix(in srgb, var(--hc-ok) 18%, transparent);
    color: var(--hc-ok);
  }

  .chip.cold {
    background: color-mix(in srgb, var(--hc-cold) 18%, transparent);
    color: var(--hc-cold);
  }

  button.round {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: transparent;
    color: var(--primary-text-color);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button.round:hover {
    background: var(--secondary-background-color);
  }

  button.round:disabled {
    opacity: 0.4;
    cursor: default;
  }

  ha-icon {
    --mdc-icon-size: 20px;
  }
`;
