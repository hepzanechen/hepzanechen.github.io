const search = document.querySelector('[data-search]');
if (search) {
  const posts = [...document.querySelectorAll('[data-post]')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  let category = 'all';
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const post of posts) {
      const visible = (category === 'all' || post.dataset.tag === category) && post.textContent.toLocaleLowerCase().includes(query);
      post.hidden = !visible;
      count += Number(visible);
    }
    document.querySelector('[data-empty]').hidden = count > 0;
    document.querySelector('[data-count]').textContent = String(count).padStart(2, '0');
  };
  search.addEventListener('input', update);
  for (const button of buttons) button.addEventListener('click', () => {
    category = button.dataset.filter;
    for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
    update();
  });
  document.querySelector('[data-controls]').hidden = false;
}
