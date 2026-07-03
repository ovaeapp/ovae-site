// First-party waitlist submit — posts straight to Ovae's own database.
// No form service, no third-party scripts, nothing watching. The key below is
// the public anon key; the table is write-only for it (nobody can read the
// list without the service role).
const WL_URL = 'https://wftnynwtesdtuuteugib.supabase.co/rest/v1/waitlist';
const WL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmdG55bnd0ZXNkdHV1dGV1Z2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMjI5NzMsImV4cCI6MjA5ODU5ODk3M30.-MJ2uuBJsyAvhHCpe2XWfAE7K6GhzXPkHCfFcEADZEM';

async function joinWaitlist(payload) {
  const res = await fetch(WL_URL, {
    method: 'POST',
    headers: {
      apikey: WL_KEY,
      Authorization: 'Bearer ' + WL_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  // 409 = already on the list — that's a success from her point of view.
  if (!res.ok && res.status !== 409) throw new Error('waitlist ' + res.status);
}

function sourceTag() {
  return (new URLSearchParams(location.search).get('via') || 'direct').slice(0, 32);
}

function wireWaitlistForm(formId, buildPayload, onDone) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const err = form.querySelector('.err');
    btn.disabled = true;
    err.classList.add('hidden');
    try {
      await joinWaitlist(buildPayload(form));
      onDone();
    } catch (_) {
      err.classList.remove('hidden');
      btn.disabled = false;
    }
  });
}
