const score = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const average = values => values.length ? Math.round(values.reduce((total, value) => total + score(value), 0) / values.length) : 0;

export function progressTrend(results, windowSize = 3) {
  const scores = results.map(result => score(result.accuracy));
  if (scores.length < 2) return { direction: 'starting', change: 0, label: 'Building your baseline' };
  const recent = scores.slice(-windowSize);
  const previous = scores.slice(-windowSize * 2, -windowSize);
  if (!previous.length) return { direction: 'starting', change: 0, label: 'Building your baseline' };
  const change = average(recent) - average(previous);
  if (change >= 5) return { direction: 'up', change, label: `${change} points stronger recently` };
  if (change <= -5) return { direction: 'down', change, label: `${Math.abs(change)} points lower recently` };
  return { direction: 'steady', change, label: 'Recall is holding steady' };
}

export function techniquePerformance(results) {
  const grouped = new Map();
  for (const result of results) {
    const technique = String(result.technique || 'General practice').trim();
    const entry = grouped.get(technique) || { technique, total: 0, sessions: 0 };
    entry.total += score(result.accuracy);
    entry.sessions += 1;
    grouped.set(technique, entry);
  }
  return [...grouped.values()]
    .map(entry => ({ technique: entry.technique, sessions: entry.sessions, accuracy: Math.round(entry.total / entry.sessions) }))
    .sort((a, b) => b.accuracy - a.accuracy || b.sessions - a.sessions || a.technique.localeCompare(b.technique));
}

export function errorProfile(results) {
  const errors = results.reduce((totals, result) => ({
    omitted: totals.omitted + score(result.omitted),
    orderErrors: totals.orderErrors + score(result.orderErrors),
    incorrect: totals.incorrect + score(result.incorrect)
  }), { omitted: 0, orderErrors: 0, incorrect: 0 });
  const ranked = [
    { key: 'omitted', label: 'Missing items', value: errors.omitted, advice: 'Rebuild the first image and make every link move.' },
    { key: 'orderErrors', label: 'Order slips', value: errors.orderErrors, advice: 'Use a fixed route and connect each image to the next.' },
    { key: 'incorrect', label: 'Mixed-up items', value: errors.incorrect, advice: 'Make similar images more distinct in size, colour or action.' }
  ].sort((a, b) => b.value - a.value);
  return { ...errors, total: ranked.reduce((total, item) => total + item.value, 0), leading: ranked[0] };
}

export function reviewHealth(reviews, now = Date.now()) {
  const active = reviews.filter(review => review.status === 'active');
  const scored = reviews.filter(review => review.reviewScore != null);
  return {
    active: active.length,
    due: active.filter(review => score(review.nextReviewAt) <= now).length,
    completed: scored.length,
    delayedAccuracy: average(scored.map(review => review.reviewScore))
  };
}

export function nextProgressAction(results, reviews, now = Date.now()) {
  const health = reviewHealth(reviews, now);
  if (health.due) return { href: '#reviews', label: 'Do due review', title: 'Strengthen a memory that is due', detail: `${health.due} review${health.due === 1 ? ' is' : 's are'} ready now.` };
  if (!results.length) return { href: '#learn', label: 'Create first result', title: 'Create your first recall result', detail: 'One short before-and-after challenge will establish your baseline.' };
  const errors = errorProfile(results);
  if (errors.total) return { href: '#train', label: 'Practise the weak link', title: errors.leading.advice, detail: `${errors.leading.label} are your most common repair opportunity.` };
  return { href: '#train', label: 'Continue training', title: 'Keep the memory route active', detail: 'Your recent recalls have no recorded errors. Add another useful memory.' };
}
