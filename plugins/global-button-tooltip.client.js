const ICON_TOOLTIP_MAP = {
  "mdi-plus": "Add",
  "mdi-pencil": "Edit",
  "mdi-delete": "Delete",
  "mdi-eye": "View",
  "mdi-close": "Close",
  "mdi-content-save": "Save",
  "mdi-upload": "Upload",
  "mdi-download": "Download",
  "mdi-check-circle": "Active Selected",
  "mdi-close-circle": "Inactive Selected",
  "mdi-lightning-bolt": "Force Selected",
  "mdi-lightning-bolt-off": "Unforce Selected",
  "mdi-auto-fix": "Generate Daily",
  "mdi-close-circle-outline": "Ungenerate Daily",
  "mdi-paperclip-plus": "Import File",
  "mdi-magnify": "Search",
  "mdi-refresh": "Refresh",
};

function getIconTooltip(buttonEl) {
  const icon = buttonEl.querySelector(".v-icon");
  if (!icon || !icon.className) {
    return "";
  }

  const classNames = String(icon.className).split(/\s+/);
  const mdiClass = classNames.find((name) => name.startsWith("mdi-"));
  return mdiClass ? ICON_TOOLTIP_MAP[mdiClass] || "" : "";
}

function getButtonTooltip(buttonEl) {
  if (!buttonEl) {
    return "";
  }

  const explicitTooltip = buttonEl.getAttribute("data-tooltip");
  if (explicitTooltip) {
    return explicitTooltip.trim();
  }

  const ariaLabel = buttonEl.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const text = String(buttonEl.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  if (text) {
    return text;
  }

  return getIconTooltip(buttonEl);
}

function applyTooltip(buttonEl) {
  if (!buttonEl) {
    return;
  }

  if (buttonEl.hasAttribute("title")) {
    return;
  }

  const tooltip = getButtonTooltip(buttonEl);
  if (tooltip) {
    buttonEl.setAttribute("title", tooltip);
  }
}

function scanAndApply(root = document) {
  const buttons = root.querySelectorAll(".v-btn, button");
  buttons.forEach(applyTooltip);
}

export default () => {
  if (typeof window === "undefined") {
    return;
  }

  const run = () => scanAndApply(document);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        if (node.matches && (node.matches(".v-btn") || node.matches("button"))) {
          applyTooltip(node);
        }

        if (node.querySelectorAll) {
          scanAndApply(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
