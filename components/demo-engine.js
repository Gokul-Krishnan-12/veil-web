/**
 * Veil Interactive Sandbox Engine (Demo Mode)
 * Matches Chrome Extension Dock, Element Picker, Area Blur, Text Blur, and PII Redaction
 */

export function initDemoSandbox() {
  if (typeof window === 'undefined') return () => {};

  const state = {
    isShieldActive: true,
    isPickerActive: false,
    isAreaBlurActive: false,
    isPiiActive: false,
    isScreenSharing: false,
    hoveredElement: null,
    activeBlurredElements: new Set(),
    redactedSpans: new Set(),
    areaBlurBoxes: new Set()
  };

  const PII_PATTERNS = {
    secrets: /(?:sk_(?:live|test)_[a-zA-Z0-9]{10,}|ghp_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})/gi,
    emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    creditCards: /\b(?:\d{4}[ -]?){3}\d{4}\b|\b(?:\d{4}[ -]?\d{6}[ -]?\d{5})\b|\b(?:\d{4}[ •]+){3}\d{4}\b/g,
    phones: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    financial: /\$[\d,]+(?:\.\d{2})?(?:\s*(?:\/|\bper\b)\s*(?:mo|yr|year|month))?/gi
  };

  const dock = document.getElementById("screenshield-floating-dock");
  const dockTooltip = document.getElementById("screenshield-dock-tooltip");
  const toast = document.getElementById("sandbox-toast");
  const selectionRing = document.getElementById("screenshield-selection-ring");
  const tagBadge = document.getElementById("screenshield-tag-badge");
  const dragPreview = document.getElementById("screenshield-drag-preview");
  const textBlurPill = document.getElementById("screenshield-text-blur-pill");
  const screenshareBar = document.getElementById("screenshare-status-bar");
  const blurCounter = document.getElementById("dock-blur-counter");

  const btnPicker = document.getElementById("dock-btn-picker");
  const btnSelectBlur = document.getElementById("dock-btn-select-blur");
  const btnArea = document.getElementById("dock-btn-area");
  const btnPii = document.getElementById("dock-btn-pii");
  const btnScreenShare = document.getElementById("dock-btn-screenshare");
  const btnClearAll = document.getElementById("dock-btn-clear");
  const btnCloseDock = document.getElementById("dock-btn-close");
  const btnSimulateScreenshare = document.getElementById("btn-simulate-screenshare");

  const actionButtons = [btnPicker, btnSelectBlur, btnArea, btnPii, btnScreenShare].filter(Boolean);

  let toastTimer = null;
  function showToast(msg, type = "info", duration = 3000) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.className = `visible ${type}`;
    let icon = "ℹ️";
    if (type === "warning") icon = "⚠️";
    if (type === "success") icon = "✅";
    toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    toastTimer = setTimeout(() => {
      toast.className = "";
    }, duration);
  }

  function updateCounter() {
    if (!blurCounter) return;
    const count = state.activeBlurredElements.size + state.redactedSpans.size + state.areaBlurBoxes.size;
    blurCounter.textContent = count;
    blurCounter.style.display = count > 0 ? "inline-flex" : "none";
  }

  // Tooltip
  if (dock && dockTooltip) {
    const tooltipTargets = dock.querySelectorAll("[data-title]");
    tooltipTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        const title = target.getAttribute("data-title");
        const shortcut = target.getAttribute("data-shortcut");
        const desc = target.getAttribute("data-desc");
        if (!title) return;

        let html = `<div class="dock-tooltip-bubble">`;
        html += `<div class="dock-tooltip-header"><span>${title}</span>`;
        if (shortcut) html += `<span class="dock-tooltip-badge">${shortcut}</span>`;
        html += `</div>`;
        if (desc) html += `<div class="dock-tooltip-desc">${desc}</div>`;
        html += `</div><div class="dock-tooltip-arrow"></div>`;
        dockTooltip.innerHTML = html;

        const rect = target.getBoundingClientRect();
        dockTooltip.style.left = `${rect.left + rect.width / 2}px`;
        dockTooltip.style.top = `${rect.top}px`;
        dockTooltip.classList.add("visible");
      });

      target.addEventListener("mouseleave", () => {
        dockTooltip.classList.remove("visible");
      });
    });
  }

  // Draggability (Mouse and Touch support)
  if (dock) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    const handle = document.getElementById("dock-drag-handle") || dock;

    const startDrag = (clientX, clientY, target) => {
      if (target.closest(".dock-btn") || target.closest(".dock-close")) return false;
      isDragging = true;
      dock.classList.add("is-dragging");
      startX = clientX;
      startY = clientY;
      const rect = dock.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      dock.style.bottom = "auto";
      dock.style.transform = "none";
      dock.style.left = `${initialLeft}px`;
      dock.style.top = `${initialTop}px`;
      return true;
    };

    const moveDrag = (clientX, clientY) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      const maxLeft = Math.max(8, window.innerWidth - dock.offsetWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - dock.offsetHeight - 8);
      const newLeft = Math.max(8, Math.min(maxLeft, initialLeft + dx));
      const newTop = Math.max(8, Math.min(maxTop, initialTop + dy));
      dock.style.left = `${newLeft}px`;
      dock.style.top = `${newTop}px`;
    };

    const endDrag = () => {
      if (isDragging) {
        isDragging = false;
        dock.classList.remove("is-dragging");
      }
    };

    // Mouse handlers
    handle.addEventListener("mousedown", (e) => {
      if (startDrag(e.clientX, e.clientY, e.target)) {
        e.preventDefault();
      }
    });

    const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    // Touch handlers for mobile responsiveness
    handle.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length > 0) {
        if (startDrag(e.touches[0].clientX, e.touches[0].clientY, e.target)) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    const onTouchMove = (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches.length > 0) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    };

    const onTouchEnd = () => endDrag();

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);

    // Re-clamp on window resize/orientationchange
    window.addEventListener("resize", () => {
      const rect = dock.getBoundingClientRect();
      const maxLeft = Math.max(8, window.innerWidth - dock.offsetWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - dock.offsetHeight - 8);
      if (rect.left > maxLeft) dock.style.left = `${maxLeft}px`;
      if (rect.top > maxTop) dock.style.top = `${maxTop}px`;
    });
  }

  // Master Shield
  function setShieldState(active) {
    state.isShieldActive = active;
    if (!state.isShieldActive) {
      document.documentElement.setAttribute("data-veil-disabled", "true");
      if (btnClearAll) {
        btnClearAll.classList.add("paused");
        btnClearAll.setAttribute("data-title", "Restore All");
        btnClearAll.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      }
      actionButtons.forEach(btn => {
        btn.classList.add("disabled");
        btn.classList.remove("active");
      });
      if (state.isPickerActive) stopPicker();
      if (state.isAreaBlurActive) stopAreaBlur();
      showToast("Privacy Shield paused (Clear All). Click Restore (▶) to resume.", "warning", 3000);
    } else {
      document.documentElement.removeAttribute("data-veil-disabled");
      if (btnClearAll) {
        btnClearAll.classList.remove("paused");
        btnClearAll.setAttribute("data-title", "Clear All");
        btnClearAll.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
      }
      actionButtons.forEach(btn => btn.classList.remove("disabled"));
      if (state.isPiiActive && btnPii) btnPii.classList.add("active");
      if (state.isScreenSharing && btnScreenShare) btnScreenShare.classList.add("active");
      showToast("Privacy Shield restored. All blurs active.", "success", 2000);
    }
  }

  if (btnClearAll) {
    btnClearAll.addEventListener("click", () => setShieldState(!state.isShieldActive));
  }

  function checkShieldActive(e) {
    if (!state.isShieldActive) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      showToast("Veil Shield is paused. Click Restore All (▶) first.", "warning", 3000);
      return false;
    }
    return true;
  }

  // 1. Element Picker Mode
  let lastDirectTarget = null;
  let manualRangeLevel = 0;
  let targetChildStack = [];

  function updatePickerOutline(el) {
    if (!el || !selectionRing || !tagBadge) return;
    const rect = el.getBoundingClientRect();
    selectionRing.style.display = "block";
    selectionRing.style.left = `${rect.left + window.scrollX}px`;
    selectionRing.style.top = `${rect.top + window.scrollY}px`;
    selectionRing.style.width = `${rect.width}px`;
    selectionRing.style.height = `${rect.height}px`;

    const tag = el.tagName.toLowerCase();
    const isBlurred = el.classList.contains("screenshield-blur");
    const action = isBlurred ? "Unblur" : "Blur";
    tagBadge.textContent = `${action} <${tag}>`;
    tagBadge.style.background = isBlurred ? "#ef4444" : "#4f46e5";
  }

  function onPickerPointerMove(e) {
    if (!state.isPickerActive) return;
    const target = document.elementFromPoint(e.clientX, e.clientY) || e.target;
    if (!target || target.closest("#screenshield-floating-dock") || target.closest(".navbar") || target.closest("#sandbox-toast") || target.closest("#screenshield-selection-ring")) {
      return;
    }
    const finalEl = (e.shiftKey && target.closest("tr")) ? target.closest("tr") : target;
    state.hoveredElement = finalEl;
    updatePickerOutline(finalEl);
  }

  function onPickerClick(e) {
    if (!state.isPickerActive) return;
    const target = state.hoveredElement || document.elementFromPoint(e.clientX, e.clientY) || e.target;
    if (target.closest("#screenshield-floating-dock") || target.closest(".navbar") || target.closest("#sandbox-toast")) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    let elToBlur = state.hoveredElement || target;
    if (e.shiftKey && target.closest("tr")) elToBlur = target.closest("tr");
    if (!elToBlur) { stopPicker(); return; }

    const tag = elToBlur.tagName.toLowerCase();
    if (elToBlur.classList.contains("screenshield-blur")) {
      elToBlur.classList.remove("screenshield-blur");
      state.activeBlurredElements.delete(elToBlur);
      showToast(`Unblurred <${tag}>.`, "info");
    } else {
      elToBlur.classList.add("screenshield-blur");
      state.activeBlurredElements.add(elToBlur);
      showToast(`Blurred <${tag}>. Click again to unblur.`, "success");
    }
    updateCounter();
    stopPicker();
  }

  function onPickerKeyDown(e) {
    if (e.key === "Escape") {
      stopPicker();
      showToast("Picker cancelled.", "info");
      return;
    }
    if (e.key === "Shift" && state.hoveredElement) {
      const tr = state.hoveredElement.closest("tr");
      if (tr) {
        state.hoveredElement = tr;
        updatePickerOutline(tr);
      }
    }
  }

  function startPicker() {
    if (!checkShieldActive()) return;
    state.isPickerActive = true;
    btnPicker.classList.add("active");
    if (state.isAreaBlurActive) stopAreaBlur();
    document.addEventListener("pointermove", onPickerPointerMove, true);
    document.addEventListener("click", onPickerClick, true);
    document.addEventListener("keydown", onPickerKeyDown, true);
    document.body.style.cursor = "crosshair";
    showToast("Click any element to blur (Shift+click for row). Esc to cancel.", "info", 3500);
  }

  function stopPicker() {
    state.isPickerActive = false;
    if (btnPicker) btnPicker.classList.remove("active");
    document.removeEventListener("pointermove", onPickerPointerMove, true);
    document.removeEventListener("click", onPickerClick, true);
    document.removeEventListener("keydown", onPickerKeyDown, true);
    document.body.style.cursor = "";
    if (selectionRing) selectionRing.style.display = "none";
  }

  if (btnPicker) {
    btnPicker.addEventListener("click", (e) => {
      if (!checkShieldActive(e)) return;
      if (state.isPickerActive) stopPicker();
      else startPicker();
    });
  }

  // 2. Blur Selected Text Pill Mode
  function onTextMouseUp() {
    if (!state.isShieldActive) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      if (textBlurPill) textBlurPill.classList.remove("visible");
      return;
    }

    const range = sel.getRangeAt(0);
    const text = range.toString().trim();
    if (text.length < 2) {
      if (textBlurPill) textBlurPill.classList.remove("visible");
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    if (textBlurPill) {
      textBlurPill.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
      textBlurPill.style.top = `${rect.top - 36 + window.scrollY}px`;
      textBlurPill.classList.add("visible");
    }
  }

  document.addEventListener("mouseup", onTextMouseUp);

  if (textBlurPill) {
    textBlurPill.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;

      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.className = "screenshield-selected-text-blur";
      span.title = "Blurred by Veil. Click to unblur.";

      try {
        range.surroundContents(span);
        state.activeBlurredElements.add(span);
        span.addEventListener("click", (ev) => {
          ev.stopPropagation();
          span.replaceWith(...span.childNodes);
          state.activeBlurredElements.delete(span);
          updateCounter();
          showToast("Unblurred selected text.", "info");
        });
        showToast("Text blurred! Click the blurred text anytime to unblur.", "success");
        updateCounter();
      } catch (err) {
        showToast("Selection spans complex elements. Use Element Picker instead.", "warning");
      }

      sel.removeAllRanges();
      textBlurPill.classList.remove("visible");
    });
  }

  // 3. Area Blur Drag Mode
  let isDrawingArea = false;
  let areaStartX = 0, areaStartY = 0;

  function onAreaMouseDown(e) {
    if (!state.isAreaBlurActive || e.button !== 0) return;
    if (e.target.closest("#screenshield-floating-dock") || e.target.closest(".screenshield-area-box")) return;
    isDrawingArea = true;
    areaStartX = e.clientX + window.scrollX;
    areaStartY = e.clientY + window.scrollY;
    if (dragPreview) {
      dragPreview.style.left = `${areaStartX}px`;
      dragPreview.style.top = `${areaStartY}px`;
      dragPreview.style.width = "0px";
      dragPreview.style.height = "0px";
      dragPreview.style.display = "block";
    }
    e.preventDefault();
  }

  function onAreaMouseMove(e) {
    if (!isDrawingArea || !dragPreview) return;
    const currentX = e.clientX + window.scrollX;
    const currentY = e.clientY + window.scrollY;
    const left = Math.min(areaStartX, currentX);
    const top = Math.min(areaStartY, currentY);
    const width = Math.abs(currentX - areaStartX);
    const height = Math.abs(currentY - areaStartY);
    dragPreview.style.left = `${left}px`;
    dragPreview.style.top = `${top}px`;
    dragPreview.style.width = `${width}px`;
    dragPreview.style.height = `${height}px`;
  }

  function createAreaBox(left, top, width, height) {
    const box = document.createElement("div");
    box.className = "screenshield-area-box";
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.width = `${width}px`;
    box.style.height = `${height}px`;

    const closeBtn = document.createElement("button");
    closeBtn.className = "area-close-btn";
    closeBtn.innerHTML = "×";
    closeBtn.title = "Remove blur box";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      box.remove();
      state.areaBlurBoxes.delete(box);
      updateCounter();
      showToast("Area blur box removed.", "info");
    });

    box.appendChild(closeBtn);
    document.body.appendChild(box);
    state.areaBlurBoxes.add(box);
    updateCounter();
  }

  function onAreaMouseUp(e) {
    if (!isDrawingArea) return;
    isDrawingArea = false;
    if (dragPreview) dragPreview.style.display = "none";
    const currentX = e.clientX + window.scrollX;
    const currentY = e.clientY + window.scrollY;
    const left = Math.min(areaStartX, currentX);
    const top = Math.min(areaStartY, currentY);
    const width = Math.abs(currentX - areaStartX);
    const height = Math.abs(currentY - areaStartY);

    if (width > 20 && height > 20) {
      createAreaBox(left, top, width, height);
      showToast("Regional blur box created!", "success");
    }
    stopAreaBlur();
  }

  function startAreaBlur() {
    if (!checkShieldActive()) return;
    state.isAreaBlurActive = true;
    btnArea.classList.add("active");
    if (state.isPickerActive) stopPicker();
    document.addEventListener("mousedown", onAreaMouseDown);
    document.addEventListener("mousemove", onAreaMouseMove);
    document.addEventListener("mouseup", onAreaMouseUp);
    document.body.style.cursor = "crosshair";
    showToast("Click and drag a box anywhere to blur that region.", "info");
  }

  function stopAreaBlur() {
    state.isAreaBlurActive = false;
    if (btnArea) btnArea.classList.remove("active");
    document.removeEventListener("mousedown", onAreaMouseDown);
    document.removeEventListener("mousemove", onAreaMouseMove);
    document.removeEventListener("mouseup", onAreaMouseUp);
    document.body.style.cursor = "";
  }

  if (btnArea) {
    btnArea.addEventListener("click", (e) => {
      if (!checkShieldActive(e)) return;
      if (state.isAreaBlurActive) stopAreaBlur();
      else startAreaBlur();
    });
  }

  // 4. Automated PII Redaction
  function togglePiiRedaction(forceState) {
    const enable = typeof forceState === "boolean" ? forceState : !state.isPiiActive;
    state.isPiiActive = enable;

    if (enable) {
      btnPii.classList.add("active");
      // Find all sample elements with class pii-sample and blur them
      const samples = document.querySelectorAll(".pii-sample");
      samples.forEach(s => {
        s.classList.add("screenshield-redacted-text");
        state.redactedSpans.add(s);
      });
      showToast(`Automated PII Redaction: ${samples.length} items masked.`, "success");
    } else {
      btnPii.classList.remove("active");
      const samples = document.querySelectorAll(".pii-sample");
      samples.forEach(s => {
        s.classList.remove("screenshield-redacted-text");
        state.redactedSpans.delete(s);
      });
      showToast("Automated PII Redaction disabled.", "info");
    }
    updateCounter();
  }

  if (btnPii) {
    btnPii.addEventListener("click", (e) => {
      if (!checkShieldActive(e)) return;
      togglePiiRedaction();
    });
  }

  // 5. Screen Share Simulation
  function toggleScreenShare() {
    state.isScreenSharing = !state.isScreenSharing;
    if (state.isScreenSharing) {
      if (btnScreenShare) btnScreenShare.classList.add("active");
      if (screenshareBar) screenshareBar.classList.add("active");
      if (!state.isPiiActive) togglePiiRedaction(true);
      showToast("🔴 Screen share session simulated! PII auto-masked.", "success", 4000);
    } else {
      if (btnScreenShare) btnScreenShare.classList.remove("active");
      if (screenshareBar) screenshareBar.classList.remove("active");
      showToast("Screen share simulation ended.", "info");
    }
  }

  if (btnScreenShare) {
    btnScreenShare.addEventListener("click", (e) => {
      if (!checkShieldActive(e)) return;
      toggleScreenShare();
    });
  }

  if (btnSimulateScreenshare) {
    btnSimulateScreenshare.addEventListener("click", (e) => {
      if (!checkShieldActive(e)) return;
      toggleScreenShare();
    });
  }

  // Live Search in Table
  const tableSearch = document.getElementById("demo-table-search");
  if (tableSearch) {
    tableSearch.addEventListener("input", () => {
      const q = tableSearch.value.toLowerCase().trim();
      const rows = document.querySelectorAll("#sandbox-customer-table tbody tr");
      rows.forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(q) ? "" : "none";
      });
    });
  }

  // Close dock
  if (btnCloseDock && dock) {
    btnCloseDock.addEventListener("click", () => {
      dock.style.display = "none";
      showToast("Toolbar minimized. Refresh to restore.", "info");
    });
  }

  // Cleanup handler
  return () => {
    stopPicker();
    stopAreaBlur();
    document.removeEventListener("mouseup", onTextMouseUp);
  };
}
