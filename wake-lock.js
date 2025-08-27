/**
 * wake-lock.js — keeps the screen awake while the meditation timer runs.
 * Tailored to functions used in meditation.html: startTimer, resumeTimer, resetTimer.
 * Requires a user gesture (Start/Resume) to acquire the lock (Chrome/Android).
 */
(function () {
  let wakeLock = null;
  let endWatcher = null;

  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        if (wakeLock) return;
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
          console.log('[WakeLock] released');
        });
        console.log('[WakeLock] acquired');
      } else {
        console.log('[WakeLock] not supported in this browser');
      }
    } catch (err) {
      console.error('[WakeLock] request failed:', err);
    }
  }

  function releaseWakeLock() {
    try {
      if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log('[WakeLock] manually released');
      }
    } catch (err) {
      console.error('[WakeLock] release failed:', err);
    }
  }

  // Watch global remainingSeconds/timer to auto-release when the countdown ends
  function startEndWatcher() {
    if (endWatcher) clearInterval(endWatcher);
    endWatcher = setInterval(() => {
      try {
        if (typeof window.remainingSeconds === 'number') {
          if (window.remainingSeconds <= 0) {
            clearInterval(endWatcher);
            endWatcher = null;
            releaseWakeLock();
          }
        } else {
          // If we can't read remainingSeconds, at least release when no interval is running
          if (window.timer == null) {
            clearInterval(endWatcher);
            endWatcher = null;
            releaseWakeLock();
          }
        }
      } catch (e) {}
    }, 1000);
  }

  // Re-acquire if page becomes visible again (some devices drop wake lock when tabbed away)
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && 'wakeLock' in navigator && wakeLock == null) {
      try {
        // Only re-acquire if a timer seems to be running
        if (window.timer != null && typeof window.remainingSeconds === 'number' && window.remainingSeconds > 0) {
          wakeLock = await navigator.wakeLock.request('screen');
          console.log('[WakeLock] re-acquired after visibilitychange');
        }
      } catch (e) {}
    }
  });

  function wrapTimerFunctions() {
    const wrap = (obj, fnName, before, after) => {
      if (!obj) return;
      const orig = obj[fnName];
      if (typeof orig !== 'function') return;
      obj[fnName] = function (...args) {
        before && before();
        const result = orig.apply(this, args);
        after && after();
        return result;
      };
    };

    // Acquire when starting or resuming
    wrap(window, 'startTimer', async () => { await requestWakeLock(); }, () => { startEndWatcher(); });
    wrap(window, 'resumeTimer', async () => { await requestWakeLock(); }, () => { startEndWatcher(); });

    // Release when resetting (treat as a stop)
    wrap(window, 'resetTimer', null, () => {
      if (endWatcher) { clearInterval(endWatcher); endWatcher = null; }
      releaseWakeLock();
    });

    // Optional: if you want to release on Pause, uncomment below
    // wrap(window, 'pauseTimer', null, () => { releaseWakeLock(); });
  }

  function bindButtonsByText() {
    // Fallback: bind to buttons that contain Start/Resume/Reset labels (in English)
    const buttons = Array.from(document.querySelectorAll('button'));
    const byText = (txt) => buttons.find(b => (b.textContent || '').trim().toLowerCase() === txt);

    const startBtn = byText('start');
    const resumeBtn = byText('resume');
    const resetBtn = byText('reset');

    if (startBtn && !startBtn.dataset.wakeLockBound) {
      startBtn.addEventListener('click', requestWakeLock);
      startBtn.addEventListener('click', startEndWatcher);
      startBtn.dataset.wakeLockBound = '1';
    }
    if (resumeBtn && !resumeBtn.dataset.wakeLockBound) {
      resumeBtn.addEventListener('click', requestWakeLock);
      resumeBtn.addEventListener('click', startEndWatcher);
      resumeBtn.dataset.wakeLockBound = '1';
    }
    if (resetBtn && !resetBtn.dataset.wakeLockBound) {
      resetBtn.addEventListener('click', () => {
        if (endWatcher) { clearInterval(endWatcher); endWatcher = null; }
        releaseWakeLock();
      });
      resetBtn.dataset.wakeLockBound = '1';
    }
  }

  function init() {
    wrapTimerFunctions();
    bindButtonsByText();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Clean up on unload
  window.addEventListener('beforeunload', () => {
    if (endWatcher) { clearInterval(endWatcher); endWatcher = null; }
    releaseWakeLock();
  });

  // Optional: expose manual release for debugging
  window.__releaseWakeLock = releaseWakeLock;
})();
