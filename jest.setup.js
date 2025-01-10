global.fetch = jest.fn();

['_csrf_header', '_csrf'].forEach(csrfMeta => {
  const meta = document.createElement('meta');
  meta.setAttribute('name', csrfMeta);
  meta.setAttribute('content', Math.floor(Math.random() * Date.now()).toString(36));
  document.head.appendChild(meta);
});
