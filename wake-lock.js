/**
 * wake-lock.js — keeps the screen awake while the meditation timer runs.
 * Uses the Screen Wake Lock API on supported browsers (Chrome on Android).
 * It requests a wake lock when startMeditation() is called and releases it on stop.
 */
(function () {
  let wakeLock = null;

  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
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

  // Re-acquire if the page becomes visible again (Android may drop it when tabbed away)
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && 'wakeLock' in navigator && !wakeLock) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('[WakeLock] re-acquired after visibilitychange');
      } catch (e) {}
    }
  });

  function wrapStartStop() {
    const origStart = window.startMeditation;
    const origStop = window.stopMeditation;

    if (typeof origStart === 'function') {
      window.startMeditation = async function (...args) {
        await requestWakeLock();
        return origStart.apply(this, args);
      };
    }
    if (typeof origStop === 'function') {
      window.stopMeditation = function (...args) {
        releaseWakeLock();
        return origStop.apply(this, args);
      };
    }

    // Also bind to buttons if present with inline onclick attributes
    const startBtn = document.querySelector('[onclick*="startMeditation"]') || document.getElementById('start') || document.querySelector('#startMeditation,#start-btn');
    const stopBtn = document.querySelector('[onclick*="stopMeditation"]') || document.getElementById('stop') || document.querySelector('#stopMeditation,#stop-btn');

    if (startBtn && !startBtn.dataset.wakeLockBound) {
      startBtn.addEventListener('click', requestWakeLock);
      startBtn.dataset.wakeLockBound = '1';
    }
    if (stopBtn && !stopBtn.dataset.wakeLockBound) {
      stopBtn.addEventListener('click', releaseWakeLock);
      stopBtn.dataset.wakeLockBound = '1';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapStartStop);
  } else {
    wrapStartStop();
  }

  // Clean up
  window.addEventListener('beforeunload', releaseWakeLock);
})();
